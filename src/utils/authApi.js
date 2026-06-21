export async function authenticateWithApi(mode, form) {
  const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(body.error || "Authentication failed.");
    error.status = response.status;
    throw error;
  }

  const body = await response.json();
  return body.user;
}

export async function logoutApi() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  }).catch(() => null);
}
