import { filterResources, getCombinedResources, getStateFromZip, getStateProfileByAbbreviation } from "../data/location/locationLookup";

function mentions(text, terms) {
  return terms.some((term) => text.includes(term));
}

const CATEGORY_RULES = [
  { category:"Emergency & Crisis", terms:["emergency", "crisis", "911", "988", "hotline", "urgent"] },
  { category:"Food Assistance", terms:["food", "snap", "hungry", "meal", "pantry", "wic"] },
  { category:"Mental Health", terms:["mental health", "therapy", "counselor", "substance", "treatment"] },
  { category:"Housing & Utilities", terms:["housing", "rent", "eviction", "utilities", "electric", "heat"] },
  { category:"Jobs & Career", terms:["job", "career", "resume", "employment", "training", "apprentice"] },
  { category:"Legal Aid", terms:["legal", "lawyer", "attorney", "tenant rights", "eviction notice"] },
  { category:"Education & College", terms:["student", "teen", "school", "tutoring", "college", "fafsa", "scholarship"] },
  { category:"Volunteering", terms:["volunteer", "service", "hours"] },
  { category:"Grants & Funding", terms:["grant", "funding", "scholarship", "money"] },
];

function getCategoryForMessage(text) {
  return CATEGORY_RULES.find(rule => mentions(text, rule.terms))?.category || "";
}

function getContextLabel(context) {
  const stateAbbr = context.stateAbbr || getStateFromZip(context.zip);
  const state = getStateProfileByAbbreviation(stateAbbr);
  if (context.localProfileId) return "your selected local profile";
  if (state) return state.name;
  return "national coverage";
}

export function getLocalGuideResponse(message, context = {}) {
  const text = message.toLowerCase();
  const category = getCategoryForMessage(text);
  const resources = getCombinedResources({
    zip: context.zip,
    stateAbbr: context.stateAbbr,
    localProfileId: context.localProfileId,
    includeNational: true,
  });

  const matches = category
    ? filterResources(resources, { cat:category, search:text }).slice(0, 3)
    : filterResources(resources, { search:text }).slice(0, 3);

  const contextLabel = getContextLabel(context);

  if (matches.length) {
    const suggestions = matches
      .map(resource => `${resource.title} (${resource.scope}${resource.locatorUrl ? ", locator" : resource.officialSource ? ", official source" : ""})`)
      .join("; ");
    return `For ${contextLabel}, start with: ${suggestions}. Open the source links in the Resource Finder and verify eligibility, hours, availability, and deadlines before taking action.`;
  }

  if (mentions(text, ["emergency", "danger", "unsafe"])) {
    return "If there is immediate danger, call 911. For mental health crisis support, call or text 988. For local referrals, use 211. The Resource Finder lists these national starting points without needing a local profile.";
  }

  if (category) {
    return `I found the ${category} category, but not a strong text match. Try the Resource Finder with a ZIP, state, or local profile selected. National resources appear first when no location is selected.`;
  }

  return "Try searching by need, ZIP code, state, or local profile. Community Compass uses static national, state, and local data layers and points users to official source links whenever possible.";
}
