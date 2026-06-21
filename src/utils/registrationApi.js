export async function sendEventRegistrationEmail({ event, attendee }) {
  const response = await fetch("/api/registrations/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ event, attendee }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Registration email could not be sent.");
  }

  return response.json();
}
