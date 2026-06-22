import { MIDDLETOWN_DE_PROFILE } from "./middletownDE";

export const LOCAL_PROFILES = [MIDDLETOWN_DE_PROFILE];

export function getLocalProfile(profileId) {
  return LOCAL_PROFILES.find(profile => profile.id === profileId) || null;
}

export function getLocalProfilesForState(stateAbbr) {
  return LOCAL_PROFILES.filter(profile => profile.stateAbbr === String(stateAbbr || "").toUpperCase());
}
