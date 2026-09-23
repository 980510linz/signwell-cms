/* SIGN WELL CMS · Passkey / WebAuthn client · v24.3.1
 * Browser never receives biometric data or the bridge secret.
 * Passkey success returns a short-lived Worker proof that must be exchanged
 * for the real Apps Script cms-session before the CMS is unlocked.
 */
const SignWellAuth = (() => {
  let AUTH_BASE = '';
  const VERSION = '24.3.1';

  function configure(options = {}) {
    const raw = String(options.authBase || '').trim().replace(/\/$/, '');
    if (!raw) { AUTH_BASE = ''; return false; }
    try {
      const u = new URL(raw);
      if (u.protocol !== 'https:') throw new Error('HTTPS_REQUIRED');
      AUTH_BASE = u.origin;
      return true;
    } catch (_) {
      AUTH_BASE = '';
      return false;
    }
  }

  function authBase() { return AUTH_BASE; }
  function passkeySupported() { return !!(window.PublicKeyCredential && navigator.credentials); }

  function rpOriginEligible() {
    // v24.3.1: CMS intentionally lives on GitHub Pages while Public lives on a
    // separate domain. WebAuthn binds to the exact GitHub origin; URL paths are
    // not part of an Origin, so Public must not share this same github.io origin.
    return String(location.origin || '').toLowerCase() === 'https://980510linz.github.io';
  }

  async function hasPlatformAuthenticator() {
    if (!passkeySupported()) return false;
    if (!PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) return true;
    try { return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(); }
    catch (_) { return true; }
  }

  async function api(path, init = {}) {
    if (!AUTH_BASE) throw Object.assign(new Error('PASSKEY_AUTH_NOT_CONFIGURED'), { code: 'PASSKEY_AUTH_NOT_CONFIGURED' });
    const res = await fetch(AUTH_BASE + path, {
      credentials: 'include',
      cache: 'no-store',
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    });
    let data = null;
    try { data = await res.json(); } catch (_) {}
    if (!res.ok) {
      const err = new Error(data?.error || `HTTP_${res.status}`);
      err.code = data?.error || `HTTP_${res.status}`;
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function b64urlToBytes(value) {
    const pad = '='.repeat((4 - value.length % 4) % 4);
    const b64 = value.replace(/-/g, '+').replace(/_/g, '/') + pad;
    const bin = atob(b64);
    return Uint8Array.from(bin, c => c.charCodeAt(0));
  }

  function bytesToB64url(value) {
    if (typeof value === 'string') return value;
    const bytes = new Uint8Array(value);
    let bin = '';
    bytes.forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function normalizeCreationOptions(options) {
    return {
      ...options,
      challenge: b64urlToBytes(options.challenge),
      user: { ...options.user, id: b64urlToBytes(options.user.id) },
      excludeCredentials: (options.excludeCredentials || []).map(c => ({ ...c, id: b64urlToBytes(c.id) })),
    };
  }

  function normalizeRequestOptions(options) {
    return {
      ...options,
      challenge: b64urlToBytes(options.challenge),
      allowCredentials: (options.allowCredentials || []).map(c => ({ ...c, id: b64urlToBytes(c.id) })),
    };
  }

  function credentialToJSON(cred) {
    const response = cred.response;
    const out = {
      id: cred.id,
      rawId: bytesToB64url(cred.rawId),
      type: cred.type,
      authenticatorAttachment: cred.authenticatorAttachment || null,
      clientExtensionResults: cred.getClientExtensionResults?.() || {},
      response: { clientDataJSON: bytesToB64url(response.clientDataJSON) },
    };
    if ('attestationObject' in response) {
      out.response.attestationObject = bytesToB64url(response.attestationObject);
      if (response.getTransports) out.response.transports = response.getTransports();
    }
    if ('authenticatorData' in response) {
      out.response.authenticatorData = bytesToB64url(response.authenticatorData);
      out.response.signature = bytesToB64url(response.signature);
      out.response.userHandle = response.userHandle ? bytesToB64url(response.userHandle) : null;
    }
    return out;
  }

  async function loginWithPasskey() {
    if (!passkeySupported()) return { ok: false, reason: 'unsupported' };
    if (!rpOriginEligible()) return { ok: false, reason: 'origin' };
    if (!AUTH_BASE) return { ok: false, reason: 'not_configured' };
    try {
      const { options } = await api('/v1/passkey/login/options', { method: 'POST', body: '{}' });
      const credential = await navigator.credentials.get({ publicKey: normalizeRequestOptions(options) });
      if (!credential) throw new Error('NO_CREDENTIAL');
      const result = await api('/v1/passkey/login/verify', {
        method: 'POST',
        body: JSON.stringify({ response: credentialToJSON(credential) }),
      });
      if (!result?.appScriptProof) throw Object.assign(new Error('PASSKEY_APPS_SCRIPT_PROOF_MISSING'), { code: 'PASSKEY_APPS_SCRIPT_PROOF_MISSING' });
      return { ok: true, ...result };
    } catch (err) {
      const reason = err?.name === 'NotAllowedError' ? 'cancelled' :
        err?.code === 'PASSKEY_UNKNOWN' ? 'not_registered' :
        err?.code === 'PASSKEY_AUTH_NOT_CONFIGURED' ? 'not_configured' : 'failed';
      return { ok: false, reason, error: err };
    }
  }

  async function exchangeLegacyProof(proof) {
    if (!proof || !AUTH_BASE) return { ok: false, skipped: true };
    return api('/v1/legacy/exchange', { method: 'POST', body: JSON.stringify({ proof }) });
  }

  async function addPasskey(label = '') {
    if (!passkeySupported()) throw new Error('PASSKEY_UNSUPPORTED');
    if (!rpOriginEligible()) throw new Error('PASSKEY_RP_ORIGIN_REQUIRED');
    const { options } = await api('/v1/passkey/register/options', { method: 'POST', body: '{}' });
    const credential = await navigator.credentials.create({ publicKey: normalizeCreationOptions(options) });
    if (!credential) throw new Error('PASSKEY_CREATE_CANCELLED');
    return api('/v1/passkey/register/verify', {
      method: 'POST',
      body: JSON.stringify({ response: credentialToJSON(credential), label: String(label || '').slice(0, 80) }),
    });
  }

  async function listPasskeys() { return api('/v1/passkeys', { method: 'GET', headers: {} }); }
  async function deletePasskey(id) { return api('/v1/passkeys/' + encodeURIComponent(id), { method: 'DELETE', body: '{}' }); }
  async function me() { return api('/v1/me', { method: 'GET', headers: {} }); }
  async function logout() {
    if (!AUTH_BASE) return { ok: true, skipped: true };
    try { return await api('/v1/logout', { method: 'POST', body: '{}' }); }
    catch (_) { return { ok: false }; }
  }

  return { VERSION, configure, authBase, passkeySupported, rpOriginEligible, hasPlatformAuthenticator, loginWithPasskey, exchangeLegacyProof, addPasskey, listPasskeys, deletePasskey, me, logout };
})();
window.SignWellAuth = SignWellAuth;
