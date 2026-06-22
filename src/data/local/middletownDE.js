import { RESOURCES } from "../resources";
import { FUNDING } from "../funding";
import { EVENTS } from "../events";
import { VOLUNTEER_ROLES } from "../volunteerRoles";
import { normalizeLegacyResource } from "../schema/resourceSchema";
import { DATA_STATUS } from "../schema/dataStatus";

export const MIDDLETOWN_DE_PROFILE = {
  id: "middletown-de",
  name: "Middletown, Delaware",
  stateAbbr: "DE",
  region: "South Atlantic",
  scope: "local",
  dataStatus: "partial",
  serviceAreaLabel: "Middletown and nearby Delaware communities",
  notes: "Existing local profile retained. Entries should be checked against official source links before public real-world use.",
  resources: RESOURCES.map(resource => normalizeLegacyResource(resource)),
  funding: FUNDING.map(item => ({
    ...item,
    id: `local-funding-${item.id}`,
    scope: "local",
    stateAbbr: "DE",
    serviceAreaLabel: "Delaware / Middletown area",
    dataStatus: DATA_STATUS.SAMPLE,
    deadline: item.deadline || "Check official source",
    verificationNote: "Legacy local funding sample. Verify amount, deadline, and eligibility before public use.",
  })),
  events: EVENTS.map(item => ({
    ...item,
    id: `local-event-${item.id}`,
    scope: "local",
    stateAbbr: "DE",
    serviceAreaLabel: "Middletown area",
    dataStatus: DATA_STATUS.SAMPLE,
    verificationNote: "Local event sample. Confirm schedule and registration with organizers before public use.",
  })),
  volunteer: VOLUNTEER_ROLES.map(item => ({
    ...item,
    id: `local-volunteer-${item.id}`,
    scope: "local",
    stateAbbr: "DE",
    serviceAreaLabel: "Middletown area",
    dataStatus: DATA_STATUS.SAMPLE,
    sourceType: "local-role",
    verificationNote: "Legacy local volunteer sample. Confirm organization, background check, schedule, and openings before public use.",
  })),
};
