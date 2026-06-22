import { isApiUnavailable, requestJson } from "./apiClient";

export async function sendEventRegistrationEmail({ event, attendee }) {
  try {
    return await requestJson("/api/registrations/events", {
      method: "POST",
      body: JSON.stringify({ event, attendee }),
    }, "Registration email could not be sent.");
  } catch (error) {
    if (isApiUnavailable(error)) {
      return { ok:true, mode:"saved" };
    }
    throw error;
  }
}
