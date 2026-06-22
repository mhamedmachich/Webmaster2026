export function isRecoverableApiStatus(status) {
  return status === 0 || status === 404 || status === 405 || status >= 500;
}

export function isApiUnavailable(error) {
  return Boolean(error?.recoverable);
}

async function readJson(response) {
  const text = await response.text().catch(() => "");
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    const error = new Error("Service temporarily unavailable.");
    error.status = response.status;
    error.recoverable = response.ok || isRecoverableApiStatus(response.status);
    throw error;
  }
}

export async function requestJson(path, options = {}, fallbackMessage = "Request failed.") {
  let response;

  try {
    const headers = options.body
      ? { "Content-Type": "application/json", ...options.headers }
      : options.headers;

    response = await fetch(path, {
      credentials: "include",
      ...options,
      headers,
    });
  } catch (cause) {
    const error = new Error("Service temporarily unavailable.");
    error.status = 0;
    error.recoverable = true;
    error.cause = cause;
    throw error;
  }

  const body = await readJson(response);

  if (!response.ok) {
    const recoverable = isRecoverableApiStatus(response.status);
    const error = new Error(body.error || (recoverable ? "Service temporarily unavailable." : fallbackMessage));
    error.status = response.status;
    error.recoverable = recoverable;
    error.details = body.details;
    throw error;
  }

  return body;
}
