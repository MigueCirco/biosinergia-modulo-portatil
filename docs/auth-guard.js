document.addEventListener("DOMContentLoaded", async () => {
  const auth = window.BioSinergiaAuth;
  if (!auth) return;

  const session = await auth.ensureSession();
  if (!session) {
    const next = encodeURIComponent(location.pathname.split("/").pop() || "index.html");
    location.replace(`login.html?next=${next}`);
    return;
  }

  document.documentElement.dataset.authReady = "true";
  document.dispatchEvent(new CustomEvent("biosinergia-auth-ready", { detail: { user: auth.getUser() } }));
});
