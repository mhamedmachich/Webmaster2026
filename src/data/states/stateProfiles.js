import { NATIONAL_CATEGORIES } from "../national/nationalCategories";
import { US_STATES } from "./usStates";

export const STATE_PROFILES = US_STATES.map(state => ({
  id: state.stateProfileId,
  name: state.name,
  abbreviation: state.abbreviation,
  region: state.region,
  capital: state.capital,
  commonMajorCities: state.commonMajorCities,
  officialStateWebsite: state.abbreviation === "DE" ? "https://delaware.gov/" : "",
  status: state.abbreviation === "DE" ? "partial" : "placeholder",
  stateLevelCategoriesAvailable: NATIONAL_CATEGORIES,
  localProfiles: state.abbreviation === "DE" ? ["middletown-de"] : [],
  stateResources: [],
  stateFunding: [],
  stateEvents: [],
  stateVolunteer: [],
  dataStatus: {
    profile: state.abbreviation === "DE" ? "partial" : "placeholder",
    resources: "placeholder",
    funding: "placeholder",
    events: "placeholder",
    volunteer: "placeholder",
  },
  notes: state.abbreviation === "DE"
    ? "Delaware includes the existing Middletown local profile. More state-level entries can be added after manual verification."
    : "Placeholder state profile. Add verified state-level resources before presenting as complete local coverage.",
}));

export function getStateProfileByAbbreviation(abbreviation) {
  return STATE_PROFILES.find(profile => profile.abbreviation === String(abbreviation || "").toUpperCase()) || null;
}
