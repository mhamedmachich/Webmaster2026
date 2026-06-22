import { DATA_STATUS, isReviewNeeded } from "./dataStatus";

export const RESOURCE_SCOPES = {
  NATIONAL: "national",
  STATE: "state",
  LOCAL: "local",
};

export const DEFAULT_VERIFICATION_NOTE = "Source link provided where available. Users should confirm eligibility, hours, availability, and deadlines on official websites.";

export function createResource(resource) {
  const format = Array.isArray(resource.format)
    ? resource.format
    : String(resource.format || "")
      .split(/[\/,]/)
      .map(item => item.trim())
      .filter(Boolean);

  const languages = Array.isArray(resource.languages)
    ? resource.languages
    : String(resource.language || "")
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);

  const dataStatus = resource.dataStatus || (resource.officialSource ? DATA_STATUS.SOURCE_LINKED : DATA_STATUS.NEEDS_REVIEW);
  const sourceUrl = resource.sourceUrl || resource.website || "";
  const locatorUrl = resource.locatorUrl || "";

  return {
    id: resource.id,
    title: resource.title,
    category: resource.category,
    subcategory: resource.subcategory || "",
    audience: resource.audience || ["Everyone"],
    scope: resource.scope || RESOURCE_SCOPES.NATIONAL,
    statesCovered: resource.statesCovered || ["ALL"],
    serviceAreaLabel: resource.serviceAreaLabel || "United States",
    cost: resource.cost || "Varies",
    urgency: resource.urgency || "Varies",
    format,
    description: resource.description || resource.desc || "",
    eligibilitySummary: resource.eligibilitySummary || "Eligibility varies. Check the official source.",
    actionSteps: resource.actionSteps || ["Open the official source or locator.", "Confirm current eligibility, hours, availability, and next steps."],
    phone: resource.phone || "",
    textLine: resource.textLine || "",
    website: resource.website || locatorUrl || sourceUrl,
    sourceUrl,
    locatorUrl,
    verifiedDate: resource.verifiedDate || "",
    dataStatus,
    verificationNote: resource.verificationNote || DEFAULT_VERIFICATION_NOTE,
    officialSource: Boolean(resource.officialSource),
    hours: resource.hours || "Varies",
    hoursVerified: Boolean(resource.hoursVerified),
    languages,
    tags: resource.tags || [],
    keywords: resource.keywords || resource.tags || [],
    emergency: Boolean(resource.emergency),
    youthFriendly: Boolean(resource.youthFriendly),
    coordinates: resource.coordinates || null,
    coordinatesApproximate: Boolean(resource.coordinatesApproximate),
    location: resource.location || resource.serviceAreaLabel || "United States",
    mapQuery: resource.mapQuery || "",
    verified: dataStatus === DATA_STATUS.VERIFIED || dataStatus === DATA_STATUS.SOURCE_LINKED,
    needsReview: isReviewNeeded(dataStatus),
    desc: resource.description || resource.desc || "",
    language: languages.join(", ") || "Varies",
  };
}

export function normalizeLegacyResource(resource, overrides = {}) {
  return createResource({
    id: `local-${resource.id}`,
    title: resource.title,
    category: resource.category,
    audience: resource.audience,
    scope: RESOURCE_SCOPES.LOCAL,
    statesCovered: ["DE"],
    serviceAreaLabel: "Middletown / Delaware",
    cost: resource.cost,
    urgency: resource.urgency,
    format: resource.format,
    description: resource.desc,
    phone: resource.phone,
    website: resource.website,
    sourceUrl: resource.website,
    verifiedDate: resource.verifiedDate,
    dataStatus: resource.verified ? DATA_STATUS.SOURCE_LINKED : DATA_STATUS.SAMPLE,
    verificationNote: resource.verified
      ? "Legacy Delaware source link retained. Re-check hours, eligibility, and availability before public use."
      : "Legacy local sample entry. Verify against official sources before public use.",
    officialSource: Boolean(resource.verified),
    hours: resource.hours,
    hoursVerified: resource.hoursVerified,
    languages: resource.language,
    tags: resource.tags,
    keywords: [...(resource.tags || []), resource.title, resource.category],
    mapQuery: resource.mapQuery,
    location: resource.location,
    ...overrides,
  });
}
