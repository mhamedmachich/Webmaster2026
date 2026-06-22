import { requestJson } from "./apiClient";

export async function authenticateWithApi(mode, form) {
  const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
  const body = await requestJson(endpoint, {
    method: "POST",
    body: JSON.stringify(form),
  }, mode === "signup" ? "Could not create account." : "Could not authenticate.");
  return body.user;
}

export async function getCurrentApiUser() {
  const body = await requestJson("/api/auth/me", {}, "Could not read session.");
  return body.user || null;
}

export async function logoutApi() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  }).catch(() => null);
}
