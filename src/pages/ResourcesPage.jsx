import { useEffect, useMemo, useState } from "react";
import { C } from "../data/colors";
import { NATIONAL_CATEGORIES } from "../data";
import { filterResources, getCombinedResources } from "../data/location/locationLookup";
import CompassMatch from "../components/features/CompassMatch";
import LocationSelector from "../components/location/LocationSelector";
import ResourceCardFull from "../components/resources/ResourceCardFull";
import VisualIcon from "../components/ui/VisualIcon";

const FINDER_SUGGESTIONS = [
  { label:"Food this week", search:"food SNAP pantry", category:"Food Assistance", icon:"food" },
  { label:"Housing", search:"housing rent utilities", category:"Housing & Utilities", icon:"building" },
  { label:"Mental health", search:"988 treatment counseling", category:"Mental Health", icon:"health" },
  { label:"Jobs", search:"career job training resume", category:"Jobs & Career", icon:"computer" },
  { label:"Education", search:"FAFSA tutoring college", category:"Education & College", icon:"education" },
  { label:"Legal aid", search:"legal aid eviction benefits", category:"Legal Aid", icon:"grant" },
];

const FAST_HELP = [
  { label:"Emergency", detail:"Call 911 for immediate danger.", search:"911 emergency", category:"Emergency & Crisis", urgency:"Emergency", icon:"alert", color:C.coral },
  { label:"Mental health crisis", detail:"Use 988 for crisis support.", search:"988 crisis", category:"Emergency & Crisis", urgency:"Emergency", icon:"health", color:C.purple },
  { label:"Local referral support", detail:"Use 211 for local referrals.", search:"211 referral", category:"Emergency & Crisis", urgency:"Same Day", icon:"message", color:C.teal },
  { label:"Food help", detail:"SNAP, WIC, food bank locators.", search:"food SNAP WIC pantry", category:"Food Assistance", urgency:"Same Week", icon:"food", color:C.amber },
  { label:"Housing help", detail:"HUD, LIHEAP, housing contacts.", search:"housing rent utilities LIHEAP", category:"Housing & Utilities", urgency:"Same Week", icon:"building", color:C.blue },
  { label:"Legal aid", detail:"Civil legal aid and LawHelp.", search:"legal aid lawhelp", category:"Legal Aid", urgency:"Same Week", icon:"grant", color:C.green },
];

const defaultLocation = {
  zip: "",
  stateAbbr: "",
  localProfileId: "",
  includeNational: true,
};

export default function ResourcesPage({ filters, setFilters, savedIds, toggleSave, resourceSearch, setResourceSearch }) {
  const [selectedId, setSelectedId] = useState("");
  const [locationContext, setLocationContext] = useState(defaultLocation);

  const combinedResources = useMemo(
    () => getCombinedResources(locationContext),
    [locationContext]
  );

  const visibleResources = useMemo(() => {
    const filtered = filterResources(combinedResources, { ...filters, search:resourceSearch });
    return filters.savedOnly ? filtered.filter(resource => savedIds.has(resource.id)) : filtered;
  }, [combinedResources, filters, resourceSearch, savedIds]);

  const selected = useMemo(
    () => visibleResources.find(resource => resource.id === selectedId) || visibleResources[0] || combinedResources[0],
    [combinedResources, selectedId, visibleResources]
  );
  const selectedMapQuery = selected?.mapQuery || "";
  const sourceLinkedCount = combinedResources.filter(resource => resource.officialSource || resource.dataStatus === "source-linked" || resource.dataStatus === "verified").length;
  const localCount = combinedResources.filter(resource => resource.scope === "local").length;
  const stateCount = combinedResources.filter(resource => resource.scope === "state").length;

  useEffect(() => {
    if (visibleResources.length && !visibleResources.some(resource => resource.id === selectedId)) {
      setSelectedId(visibleResources[0].id);
    }
  }, [visibleResources, selectedId]);

  const askFinder = (suggestion) => {
    setResourceSearch(suggestion.search);
    setFilters(prev => ({ ...prev, cat:suggestion.category, urgency:suggestion.urgency || prev.urgency, savedOnly:false }));
  };

  const resetFinder = () => {
    setResourceSearch("");
    setFilters({
      cat:"All categories",
      audience:"Everyone",
      cost:"Any cost",
      urgency:"Any timing",
      format:"Any format",
      language:"Any language",
      openNow:false,
      accessibility:false,
      transit:false,
      savedOnly:false,
    });
  };

  return (
    <div className="resource-tool-page">
      <section className="resource-tool-shell resource-tool-shell--national">
        <aside className="resource-assistant-panel">
          <div className="resource-assistant-panel__top">
            <div className="premium-eyebrow">
              <VisualIcon name="search" size={15} />
              Nationwide Resource Finder
            </div>
            <h1>Find support anywhere in the U.S.</h1>
            <p>Choose national, state, or local coverage. Results are source-linked and clearly labeled so the site avoids fake local data.</p>
          </div>

          <LocationSelector value={locationContext} onChange={setLocationContext} resultCount={visibleResources.length} />

          <div className="resource-command-box">
            <VisualIcon name="guide" size={22} />
            <input
              value={resourceSearch}
              onChange={event => setResourceSearch(event.target.value)}
              placeholder="Example: I need food help this week"
              aria-label="Ask the resource finder"
            />
          </div>

          <div className="resource-prompt-grid">
            {FINDER_SUGGESTIONS.map(suggestion => (
              <button key={suggestion.label} onClick={() => askFinder(suggestion)}>
                <VisualIcon name={suggestion.icon} size={18} />
                {suggestion.label}
              </button>
            ))}
          </div>

          <div className="resource-filter-mini">
            <label>
              Category
              <select value={filters.cat} onChange={event => setFilters(prev => ({ ...prev, cat:event.target.value }))}>
                <option>All categories</option>
                {NATIONAL_CATEGORIES.map(category => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>
              Audience
              <select value={filters.audience} onChange={event => setFilters(prev => ({ ...prev, audience:event.target.value }))}>
                {["Everyone", "Students", "Families", "Adults", "Seniors", "Veterans"].map(value => <option key={value}>{value}</option>)}
              </select>
            </label>
            <label>
              Timing
              <select value={filters.urgency} onChange={event => setFilters(prev => ({ ...prev, urgency:event.target.value }))}>
                {["Any timing", "Emergency", "Same Day", "Same Week", "Routine", "Varies"].map(value => <option key={value}>{value}</option>)}
              </select>
            </label>
          </div>

          <div className="resource-tool-stats">
            <div><strong>{visibleResources.length}</strong><span>matches</span></div>
            <div><strong>{sourceLinkedCount}</strong><span>source-linked</span></div>
            <div><strong>{localCount + stateCount}</strong><span>state/local</span></div>
          </div>

          <button className="resource-reset-button" onClick={resetFinder}>Reset finder</button>
        </aside>

        <main className="resource-results-workspace">
          <div className="resource-workspace-header">
            <div>
              <span>Grouped by urgency and scope</span>
              <h2>{visibleResources.length ? `${visibleResources.length} resources found` : "No matches yet"}</h2>
            </div>
            <button onClick={() => setFilters(prev => ({ ...prev, savedOnly:!prev.savedOnly }))}>
              {filters.savedOnly ? "Showing saved" : "Saved only"}
            </button>
          </div>

          <section className="fast-help-strip" aria-label="Need Help Fast">
            {FAST_HELP.map(item => (
              <button key={item.label} onClick={() => askFinder(item)} style={{ "--fast-color":item.color }}>
                <VisualIcon name={item.icon} size={18} />
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </button>
            ))}
          </section>

          <div className="resource-workspace-grid">
            <div className="resource-match-list">
              {visibleResources.length === 0 ? (
                <div className="resource-empty-state">
                  <VisualIcon name="empty" size={42} />
                  <strong>No resources match.</strong>
                  <span>Try fewer filters, another ZIP/state, or a broader search phrase.</span>
                </div>
              ) : visibleResources.map(resource => (
                <button
                  key={resource.id}
                  className={`resource-match-row ${selected?.id === resource.id ? "is-active" : ""}`}
                  onClick={() => setSelectedId(resource.id)}
                >
                  <span>{resource.category}</span>
                  <strong>{resource.title}</strong>
                  <small>
                    {resource.scope} / {resource.urgency} / {resource.locatorUrl ? "Locator" : resource.officialSource ? "Official source" : resource.dataStatus}
                  </small>
                </button>
              ))}
            </div>

            <div className="resource-focus-panel">
              {selectedMapQuery ? (
                <div className="resource-map-embed">
                  <iframe
                    key={selected.id}
                    title={`Map for ${selected.title}`}
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedMapQuery)}&output=embed`}
                  />
                </div>
              ) : (
                <div className="resource-map-embed resource-map-embed--empty">
                  <VisualIcon name="globe" size={42} />
                  <strong>{selected?.scope === "national" ? "National or locator-based resource" : "Online or phone-based resource"}</strong>
                  <span>Use the official source or locator for current eligibility, hours, availability, and local details.</span>
                </div>
              )}
              {selected && <ResourceCardFull res={selected} saved={savedIds.has(selected.id)} onSave={toggleSave} />}
            </div>
          </div>
        </main>
      </section>

      <CompassMatch onSave={toggleSave} savedIds={savedIds} onOpenResources={resetFinder} resources={combinedResources} />
    </div>
  );
}
