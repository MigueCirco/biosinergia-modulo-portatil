(() => {
  const config = window.BIOSINERGIA_FIREBASE_CONFIG || {};
  const apiKey = String(config.apiKey || "");
  const projectId = String(config.projectId || "");
  const authStorageKey = "biosinergia_auth_session_v2";

  function configReady() {
    return apiKey && !apiKey.startsWith("REPLACE_") && projectId;
  }

  function authEndpoint(action) {
    return `https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=${encodeURIComponent(apiKey)}`;
  }

  function tokenEndpoint() {
    return `https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(apiKey)}`;
  }

  function loadSession() {
    try {
      const raw = localStorage.getItem(authStorageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function saveSession(session) {
    localStorage.setItem(authStorageKey, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(authStorageKey);
    window.BIOSINERGIA_ID_TOKEN = "";
    window.BIOSINERGIA_AUTH_USER = null;
  }

  async function signIn(email, password) {
    if (!configReady()) throw new Error("Firebase Auth todavía no está configurado.");
    const response = await fetch(authEndpoint("signInWithPassword"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || `HTTP ${response.status}`);
    const session = {
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresAt: Date.now() + Number(data.expiresIn || 3600) * 1000,
      email: data.email || email,
      localId: data.localId || null
    };
    saveSession(session);
    applySession(session);
    return session;
  }

  async function refreshSession(session) {
    if (!configReady() || !session?.refreshToken) throw new Error("No hay sesión renovable.");
    const body = new URLSearchParams({ grant_type: "refresh_token", refresh_token: session.refreshToken });
    const response = await fetch(tokenEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || `HTTP ${response.status}`);
    const renewed = {
      idToken: data.id_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + Number(data.expires_in || 3600) * 1000,
      email: session.email,
      localId: data.user_id || session.localId || null
    };
    saveSession(renewed);
    applySession(renewed);
    return renewed;
  }

  function applySession(session) {
    window.BIOSINERGIA_ID_TOKEN = session?.idToken || "";
    window.BIOSINERGIA_AUTH_USER = session ? { email: session.email, uid: session.localId } : null;
  }

  async function ensureSession() {
    if (!configReady()) {
      clearSession();
      return null;
    }
    let session = loadSession();
    if (!session) return null;
    try {
      if (!session.idToken || Number(session.expiresAt || 0) < Date.now() + 120000) {
        session = await refreshSession(session);
      } else {
        applySession(session);
      }
      return session;
    } catch (error) {
      console.warn("No se pudo renovar la sesión Firebase:", error);
      clearSession();
      return null;
    }
  }

  async function sendPasswordReset(email) {
    if (!configReady()) throw new Error("Firebase Auth todavía no está configurado.");
    const response = await fetch(authEndpoint("sendOobCode"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestType: "PASSWORD_RESET", email })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || `HTTP ${response.status}`);
    return true;
  }

  function signOut() {
    clearSession();
    location.replace("login.html");
  }

  window.BioSinergiaAuth = {
    configReady,
    signIn,
    signOut,
    ensureSession,
    sendPasswordReset,
    getUser: () => window.BIOSINERGIA_AUTH_USER,
    getIdToken: () => window.BIOSINERGIA_ID_TOKEN || ""
  };
})();
