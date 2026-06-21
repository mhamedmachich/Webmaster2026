import { C } from "../data/colors";
import { RESOURCES } from "../data/resources";
import CompassMatch from "../components/features/CompassMatch";
import NeedHelpFast from "../components/features/NeedHelpFast";
import TrustPanel from "../components/features/TrustPanel";
import FilterSidebar from "../components/resources/FilterSidebar";
import ResourceCardFull from "../components/resources/ResourceCardFull";
import VisualIcon from "../components/ui/VisualIcon";

const FINDER_SUGGESTIONS = [
  { label:"Food this week", search:"food", category:"Food", icon:"food" },
  { label:"Tutoring and study space", search:"tutoring library", category:"Learning Resources", icon:"education" },
  { label:"Rent or utility help", search:"housing utilities", category:"Housing", icon:"building" },
  { label:"Resume support", search:"resume career", category:"Employment", icon:"computer" },
  { label:"Youth programs", search:"teen youth", category:"Youth & Recreation", icon:"hands" },
];

export default function ResourcesPage({ filters, setFilters, filteredResources, savedIds, toggleSave, resourceSearch, setResourceSearch, quickHelp }) {
  const verifiedCount = RESOURCES.filter(resource => resource.verified).length;
  const reviewCount = RESOURCES.filter(resource => resource.needsReview).length;
  const categories = [...new Set(RESOURCES.map(resource => resource.category))];

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <section className="premium-hero" style={{ minHeight:"auto", padding:"76px 24px 42px" }}>
        <div style={{ maxWidth:"var(--cc-container)", margin:"0 auto", position:"relative" }}>
          <div className="premium-eyebrow">
            <VisualIcon name="search" size={15} color="currentColor" />
            Resource Finder
          </div>
          <h1 style={{ maxWidth:760 }}>Search less. Find the right local starting point faster.</h1>
          <p style={{ maxWidth:760 }}>Use search, filters, Compass Match, and trust labels to narrow community resources without needing a live API or account.</p>

          <div className="command-center" style={{ marginTop:34 }}>
            <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) auto", gap:16, alignItems:"center" }}>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:C.g400, display:"flex" }}><VisualIcon name="search" size={18} /></span>
                <input
                  value={resourceSearch}
                  onChange={e => setResourceSearch(e.target.value)}
                  placeholder="Search by resource, need, or description..."
                  aria-label="Search community resources"
                  style={{ width:"100%", padding:"16px 18px 16px 48px", border:"1px solid rgba(15,31,58,0.1)", borderRadius:999, fontSize:16, fontFamily:"inherit", color:C.navy, background:"rgba(255,255,255,0.92)", boxShadow:"0 12px 34px rgba(11,31,58,0.08)" }}
                />
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"flex-end" }}>
                <div className="status-badge" style={{ background:C.tealLight, color:C.teal }}>{verifiedCount} verified</div>
                <div className="status-badge" style={{ background:C.coralLight, color:C.coral }}>{reviewCount} needs review</div>
                <div className="status-badge" style={{ background:C.purpleLight, color:C.purple }}>{savedIds.size} saved</div>
              </div>
            </div>
            <div className="finder-suggestion-row">
              {FINDER_SUGGESTIONS.map(suggestion => (
                <button
                  key={suggestion.label}
                  onClick={() => {
                    setResourceSearch(suggestion.search);
                    setFilters(prev => ({ ...prev, cat:suggestion.category, savedOnly:false }));
                  }}
                >
                  <VisualIcon name={suggestion.icon} size={17} />
                  <span>{suggestion.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <NeedHelpFast onQuickHelp={quickHelp} />
      <CompassMatch onSave={toggleSave} savedIds={savedIds} onOpenResources={() => setResourceSearch("")} />

      <section className="premium-shell" style={{ paddingTop:28 }}>
        <div className="resource-intel-grid">
          <div className="resource-intel-card resource-intel-card--primary">
            <span>Finder intelligence</span>
            <strong>{categories.length} service categories</strong>
            <p>Search is paired with filters, saved-only mode, verification tags, transit indicators, and action links.</p>
          </div>
          <div className="resource-intel-card">
            <span>Trust view</span>
            <strong>{verifiedCount} verified</strong>
            <p>Official links and verification dates are visible on every result.</p>
          </div>
          <div className="resource-intel-card">
            <span>Action plan</span>
            <strong>{savedIds.size} saved</strong>
            <p>Saved resources roll into the user’s sitewide action plan.</p>
          </div>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", gap:20, alignItems:"end", flexWrap:"wrap", marginBottom:20 }}>
          <div>
            <div className="section-kicker">Filtered Results</div>
            <h2 className="section-heading" style={{ fontSize:"clamp(1.8rem,3vw,2.7rem)" }}>{filteredResources.length} resource{filteredResources.length!==1?"s":""} match your finder.</h2>
          </div>
          <span style={{ color:"var(--cc-muted)", fontSize:14 }}>{savedIds.size} saved locally</span>
        </div>

        <div className="resource-layout" style={{ display:"flex", gap:24, alignItems:"flex-start" }}>
          <FilterSidebar filters={filters} setFilters={setFilters} total={filteredResources.length} saved={savedIds.size} />
          <div style={{ flex:1, minWidth:0 }}>
            {filteredResources.length === 0 ? (
              <div className="glass-panel" style={{ textAlign:"center", padding:"60px 24px", color:C.g400 }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}><VisualIcon name="empty" size={48} color={C.g400} /></div>
                <div style={{ fontSize:18, color:C.navy, fontWeight:800, marginBottom:8 }}>No resources match your filters.</div>
                <button onClick={() => { setFilters(f => ({...f, cat:"All categories", audience:"Everyone", cost:"Any cost", urgency:"Any timing", format:"Any format", language:"Any language", savedOnly:false})); setResourceSearch(""); }} className="premium-button premium-button--teal">Clear finder</button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {filteredResources.map(r => <ResourceCardFull key={r.id} res={r} saved={savedIds.has(r.id)} onSave={toggleSave} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      <TrustPanel />
    </div>
  );
}
