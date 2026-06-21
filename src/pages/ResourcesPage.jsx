import { useEffect, useMemo, useState } from "react";
import { C } from "../data/colors";
import { RESOURCES } from "../data/resources";
import CompassMatch from "../components/features/CompassMatch";
import ResourceCardFull from "../components/resources/ResourceCardFull";
import VisualIcon from "../components/ui/VisualIcon";

const FINDER_SUGGESTIONS = [
  { label:"Food this week", search:"food", category:"Food", icon:"food" },
  { label:"Tutoring", search:"tutoring library", category:"Learning Resources", icon:"education" },
  { label:"Rent or utilities", search:"housing utilities", category:"Housing", icon:"building" },
  { label:"Career help", search:"resume career", category:"Employment", icon:"computer" },
  { label:"Teen programs", search:"teen youth", category:"Youth & Recreation", icon:"hands" },
  { label:"Transportation", search:"transportation rides", category:"Transportation", icon:"car" },
];

export default function ResourcesPage({ filters, setFilters, filteredResources, savedIds, toggleSave, resourceSearch, setResourceSearch }) {
  const [selectedId, setSelectedId] = useState(filteredResources[0]?.id || RESOURCES[0].id);
  const verifiedCount = RESOURCES.filter(resource => resource.verified).length;
  const selected = useMemo(
    () => filteredResources.find(resource => resource.id === selectedId) || filteredResources[0] || RESOURCES[0],
    [filteredResources, selectedId]
  );
  const selectedMapQuery = selected.mapQuery || "";

  useEffect(() => {
    if (filteredResources.length && !filteredResources.some(resource => resource.id === selectedId)) {
      setSelectedId(filteredResources[0].id);
    }
  }, [filteredResources, selectedId]);

  const askFinder = (suggestion) => {
    setResourceSearch(suggestion.search);
    setFilters(prev => ({ ...prev, cat:suggestion.category, savedOnly:false }));
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
      <section className="resource-tool-shell">
        <aside className="resource-assistant-panel">
          <div className="resource-assistant-panel__top">
            <div className="premium-eyebrow">
              <VisualIcon name="search" size={15} />
              Resource Finder AI
            </div>
            <h1>Tell Compass what you need.</h1>
            <p>Use this as a guided tool instead of scrolling through a long directory. Search, choose intent chips, then review one best match at a time.</p>
          </div>

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
                {[...new Set(RESOURCES.map(resource => resource.category))].map(category => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>
              Audience
              <select value={filters.audience} onChange={event => setFilters(prev => ({ ...prev, audience:event.target.value }))}>
                {["Everyone", "Students", "Families", "Adults", "Seniors"].map(value => <option key={value}>{value}</option>)}
              </select>
            </label>
            <label>
              Timing
              <select value={filters.urgency} onChange={event => setFilters(prev => ({ ...prev, urgency:event.target.value }))}>
                {["Any timing", "Same Week", "Routine"].map(value => <option key={value}>{value}</option>)}
              </select>
            </label>
          </div>

          <div className="resource-tool-stats">
            <div><strong>{filteredResources.length}</strong><span>matches</span></div>
            <div><strong>{verifiedCount}</strong><span>verified</span></div>
            <div><strong>{savedIds.size}</strong><span>saved</span></div>
          </div>

          <button className="resource-reset-button" onClick={resetFinder}>Reset finder</button>
        </aside>

        <main className="resource-results-workspace">
          <div className="resource-workspace-header">
            <div>
              <span>Best Matches</span>
              <h2>{filteredResources.length ? `${filteredResources.length} resources found` : "No matches yet"}</h2>
            </div>
            <button onClick={() => setFilters(prev => ({ ...prev, savedOnly:!prev.savedOnly }))}>
              {filters.savedOnly ? "Showing saved" : "Saved only"}
            </button>
          </div>

          <div className="resource-workspace-grid">
            <div className="resource-match-list">
              {filteredResources.length === 0 ? (
                <div className="resource-empty-state">
                  <VisualIcon name="empty" size={42} />
                  <strong>No resources match.</strong>
                  <span>Try fewer filters or another search phrase.</span>
                </div>
              ) : filteredResources.map(resource => (
                <button
                  key={resource.id}
                  className={`resource-match-row ${selected?.id === resource.id ? "is-active" : ""}`}
                  onClick={() => setSelectedId(resource.id)}
                >
                  <span>{resource.category}</span>
                  <strong>{resource.title}</strong>
                  <small>{resource.urgency} · {resource.format} · {resource.verified ? "Verified" : "Needs review"}</small>
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
                  <strong>Online or phone-based resource</strong>
                  <span>This listing does not have a single public walk-in location. Use the official source link for access details.</span>
                </div>
              )}
              <ResourceCardFull res={selected} saved={savedIds.has(selected.id)} onSave={toggleSave} />
            </div>
          </div>
        </main>
      </section>

      <CompassMatch onSave={toggleSave} savedIds={savedIds} onOpenResources={resetFinder} />
    </div>
  );
}
