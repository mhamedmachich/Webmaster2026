import { NATIONAL_RESOURCES } from "../national/nationalResources";
import { NATIONAL_CATEGORIES, CATEGORY_ALIASES } from "../national/nationalCategories";
import { STATE_PROFILES, getStateProfileByAbbreviation as findStateProfile } from "../states/stateProfiles";
import { US_STATES } from "../states/usStates";
import { LOCAL_PROFILES, getLocalProfile } from "../local";
import { createResource } from "../schema/resourceSchema";
import { DATA_STATUS } from "../schema/dataStatus";
import { getStateAbbrFromZipPrefix } from "./zipToState";

const urgencyRank = {
  Emergency: 0,
  "Same Day": 1,
  "Same Week": 2,
  Routine: 3,
  Varies: 4,
};

function normalizeStateAbbr(abbr) {
  return String(abbr || "").trim().toUpperCase();
}

function createStatePlaceholder(profile) {
  if (!profile) return [];
  return [
    createResource({
      id: `state-${profile.abbreviation.toLowerCase()}-official-website`,
      title: `${profile.name} Official State Website`,
      category: "State Profile",
      subcategory: "State government starting point",
      audience: ["Everyone"],
      scope: "state",
      statesCovered: [profile.abbreviation],
      serviceAreaLabel: profile.name,
      cost: "Free",
      urgency: "Routine",
      format: ["Online"],
      description: profile.officialStateWebsite
        ? `Official state website starting point for ${profile.name} services and agency directories.`
        : `${profile.name} state profile placeholder. Add verified state-level resources before presenting this as complete coverage.`,
      sourceUrl: profile.officialStateWebsite || "",
      website: profile.officialStateWebsite || "",
      dataStatus: profile.officialStateWebsite ? DATA_STATUS.SOURCE_LINKED : DATA_STATUS.PLACEHOLDER,
      verifiedDate: profile.officialStateWebsite ? "2026-06-21" : "",
      verificationNote: profile.officialStateWebsite
        ? "Official state website linked. Add agency-specific resources after manual verification."
        : "Placeholder profile only. No official source URL has been added yet.",
      officialSource: Boolean(profile.officialStateWebsite),
      tags: ["State profile", profile.name, profile.abbreviation],
      keywords: ["state", profile.name, profile.abbreviation, "government"],
    }),
  ];
}

export function getStateFromZip(zip) {
  return getStateAbbrFromZipPrefix(zip);
}

export function getStateProfileByAbbreviation(abbr) {
  return findStateProfile(normalizeStateAbbr(abbr));
}

export function getNationalResources() {
  return NATIONAL_RESOURCES;
}

export function getResourcesForState(abbr) {
  const profile = getStateProfileByAbbreviation(abbr);
  if (!profile) return [];
  return [
    ...createStatePlaceholder(profile),
    ...(profile.stateResources || []),
  ];
}

export function getResourcesForLocalProfile(profileId) {
  return getLocalProfile(profileId)?.resources || [];
}

export function getCombinedResources({ zip = "", stateAbbr = "", localProfileId = "", includeNational = true } = {}) {
  const resolvedState = normalizeStateAbbr(stateAbbr || getStateFromZip(zip));
  const localProfile = getLocalProfile(localProfileId);
  const stateFromLocal = localProfile?.stateAbbr || "";
  const effectiveState = resolvedState || stateFromLocal;

  const resources = [
    ...(includeNational ? getNationalResources() : []),
    ...(effectiveState ? getResourcesForState(effectiveState) : []),
    ...(localProfile ? localProfile.resources : []),
  ];

  return dedupeResources(sortResources(resources));
}

export function getResourceIndex() {
  return dedupeResources([
    ...NATIONAL_RESOURCES,
    ...STATE_PROFILES.flatMap(profile => createStatePlaceholder(profile)),
    ...LOCAL_PROFILES.flatMap(profile => profile.resources),
  ]);
}

export function getFundingForContext({ zip = "", stateAbbr = "", localProfileId = "" } = {}, nationalFunding = []) {
  const localProfile = getLocalProfile(localProfileId);
  const stateProfile = getStateProfileByAbbreviation(stateAbbr || getStateFromZip(zip) || localProfile?.stateAbbr);
  return [
    ...nationalFunding,
    ...(stateProfile ? createStateFundingPlaceholder(stateProfile) : []),
    ...(stateProfile?.stateFunding || []),
    ...(localProfile?.funding || []),
  ];
}

export function getVolunteerForContext({ zip = "", stateAbbr = "", localProfileId = "" } = {}, nationalVolunteer = []) {
  const localProfile = getLocalProfile(localProfileId);
  const stateProfile = getStateProfileByAbbreviation(stateAbbr || getStateFromZip(zip) || localProfile?.stateAbbr);
  return [
    ...nationalVolunteer,
    ...(stateProfile ? createStateVolunteerPlaceholder(stateProfile) : []),
    ...(stateProfile?.stateVolunteer || []),
    ...(localProfile?.volunteer || []),
  ];
}

function createStateFundingPlaceholder(profile) {
  return [{
    id: `state-funding-${profile.abbreviation.toLowerCase()}-placeholder`,
    title: `${profile.name} state funding profile`,
    amount: "Check official source",
    deadline: "Check official source",
    audience: "Students, families, nonprofits, schools, and community groups",
    category: "State Funding Placeholder",
    eligibilitySummary: `State-specific funding for ${profile.name} has not been manually verified yet.`,
    applicationSource: profile.officialStateWebsite || "",
    sourceUrl: profile.officialStateWebsite || "",
    scope: "state",
    stateAbbr: profile.abbreviation,
    serviceAreaLabel: profile.name,
    dataStatus: DATA_STATUS.PLACEHOLDER,
    officialSource: Boolean(profile.officialStateWebsite),
    verificationNote: "Placeholder only. Add official agency or grant links before using as complete state funding data.",
  }];
}

function createStateVolunteerPlaceholder(profile) {
  return [{
    id: `state-volunteer-${profile.abbreviation.toLowerCase()}-placeholder`,
    title: `${profile.name} state volunteer profile`,
    org: `${profile.name} state profile`,
    scope: "state",
    stateAbbr: profile.abbreviation,
    sourceType: "state-placeholder",
    category: "State Volunteer Placeholder",
    hours: "Check official source",
    spots: "Placeholder",
    urgent: false,
    icon: "hands",
    desc: `State-specific volunteer listings for ${profile.name} have not been manually verified yet.`,
    sourceUrl: profile.officialStateWebsite || "",
    dataStatus: DATA_STATUS.PLACEHOLDER,
    officialSource: Boolean(profile.officialStateWebsite),
    verificationNote: "Placeholder only. Add official state, local, or nonprofit volunteer links before using as complete state data.",
  }];
}

export function filterResources(resources, filters = {}) {
  const search = String(filters.search || "").trim().toLowerCase();
  return resources.filter(resource => {
    const category = CATEGORY_ALIASES[resource.category] || resource.category;
    if (filters.cat && filters.cat !== "All categories" && category !== filters.cat && resource.category !== filters.cat) return false;
    if (filters.audience && filters.audience !== "Everyone" && !resource.audience?.includes(filters.audience)) return false;
    if (filters.cost && filters.cost !== "Any cost" && resource.cost !== filters.cost) return false;
    if (filters.urgency && filters.urgency !== "Any timing" && resource.urgency !== filters.urgency) return false;
    if (filters.format && filters.format !== "Any format" && !resource.format?.includes(filters.format)) return false;
    if (filters.language && filters.language !== "Any language" && !resource.languages?.includes(filters.language)) return false;
    if (filters.openNow && !resource.hoursVerified) return false;
    if (filters.accessibility && !resource.format?.some(format => ["Phone", "Online", "Locator"].includes(format))) return false;
    if (search && !resourceMatchesSearch(resource, search)) return false;
    return true;
  });
}

export function sortResources(resources) {
  return [...resources].sort((a, b) => {
    const emergency = Number(Boolean(b.emergency)) - Number(Boolean(a.emergency));
    if (emergency) return emergency;
    const urgency = (urgencyRank[a.urgency] ?? 9) - (urgencyRank[b.urgency] ?? 9);
    if (urgency) return urgency;
    const scopeRank = { local: 0, state: 1, national: 2 };
    return (scopeRank[a.scope] ?? 9) - (scopeRank[b.scope] ?? 9);
  });
}

function dedupeResources(resources) {
  const seen = new Set();
  return resources.filter(resource => {
    if (!resource?.id || seen.has(resource.id)) return false;
    seen.add(resource.id);
    return true;
  });
}

function resourceMatchesSearch(resource, search) {
  const haystack = [
    resource.title,
    resource.description,
    resource.desc,
    resource.category,
    resource.subcategory,
    resource.serviceAreaLabel,
    resource.location,
    ...(resource.tags || []),
    ...(resource.keywords || []),
    ...(resource.audience || []),
  ].join(" ").toLowerCase();

  if (haystack.includes(search)) return true;

  const terms = search
    .split(/[^a-z0-9]+/)
    .map(term => term.trim())
    .filter(term => term.length >= 3 && !["need", "help", "with", "this", "that", "near", "week", "find", "show"].includes(term));

  if (!terms.length) return false;
  return terms.some(term => haystack.includes(term));
}

export { NATIONAL_CATEGORIES, LOCAL_PROFILES, US_STATES };
