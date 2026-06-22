import { useMemo, useState } from "react";
import { C } from "../data/colors";
import { NATIONAL_FUNDING } from "../data";
import { getFundingForContext } from "../data/location/locationLookup";
import LocationSelector from "../components/location/LocationSelector";
import PageHero from "../components/layout/PageHero";
import VisualIcon from "../components/ui/VisualIcon";

const defaultLocation = {
  zip: "",
  stateAbbr: "",
  localProfileId: "",
  includeNational: true,
};

function getFundingColor(item) {
  if (item.scope === "local") return C.teal;
  if (item.scope === "state") return C.blue;
  if (item.category?.includes("Student")) return C.purple;
  if (item.category?.includes("Federal")) return C.amber;
  return C.coral;
}

export default function FundingPage({ nav, toast_ }) {
  const [savedFunding, setSavedFunding] = useState(new Set());
  const [locationContext, setLocationContext] = useState(defaultLocation);
  const fundingItems = useMemo(
    () => getFundingForContext(locationContext, locationContext.includeNational ? NATIONAL_FUNDING : []),
    [locationContext]
  );

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <PageHero title="Funding & Grants" subtitle="National grant portals, student aid, scholarships, state placeholders, and local funding leads." color={C.amber} end="#854F0B" icon="funding" />
      <section className="premium-shell">
        <div style={{ display:"grid", gridTemplateColumns:"minmax(0,0.75fr) minmax(0,1.25fr)", gap:22 }} className="responsive-two-col">
          <aside className="premium-card" style={{ padding:"26px", alignSelf:"start", position:"sticky", top:92 }}>
            <div className="section-kicker">Funding Command Center</div>
            <h2 className="section-heading" style={{ fontSize:"clamp(1.8rem,3vw,2.6rem)" }}>Compare sources without inventing deadlines.</h2>
            <p className="section-subtext">Unknown or changing deadlines use "Varies" or "Check official source." State profiles remain placeholders until verified.</p>
            <div style={{ marginTop:18 }}>
              <LocationSelector value={locationContext} onChange={setLocationContext} resultCount={fundingItems.length} resultLabel="funding items" />
            </div>
            <button className="premium-button premium-button--teal" onClick={() => nav("events")} style={{ marginTop:18 }}>Find grant workshops</button>
          </aside>

          <div style={{ display:"grid", gap:16 }}>
            {fundingItems.map(item => {
              const color = getFundingColor(item);
              const source = item.applicationSource || item.sourceUrl;
              return (
                <article key={item.id} className="premium-card" style={{ padding:"22px", borderLeft:`5px solid ${color}` }}>
                  <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) auto", gap:18, alignItems:"start" }}>
                    <div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
                        <span className="status-badge" style={{ background:color+"18", color }}>{item.scope || "national"}</span>
                        <span className="status-badge" style={{ background:item.officialSource?C.tealLight:C.g100, color:item.officialSource?C.teal:C.g600 }}>{item.officialSource ? "Official source" : item.dataStatus}</span>
                      </div>
                      <h3 style={{ fontSize:22, fontWeight:850, color:C.navy, letterSpacing:"-0.03em", marginBottom:8 }}>{item.title}</h3>
                      <p style={{ fontSize:14, color:C.g500, lineHeight:1.65 }}>{item.eligibilitySummary || item.eligibility}</p>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:24, fontWeight:900, color, letterSpacing:"-0.04em" }}>{item.amount || "Varies"}</div>
                      <div style={{ color:C.g400, fontSize:12, marginTop:5 }}>Deadline: {item.deadline || "Check official source"}</div>
                    </div>
                  </div>
                  <p style={{ color:C.g500, fontSize:13, lineHeight:1.55, marginTop:14 }}>{item.verificationNote}</p>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:12, alignItems:"center", marginTop:18, flexWrap:"wrap" }}>
                    <div style={{ color:C.g600, fontSize:13 }}><strong style={{ color:C.navy }}>For:</strong> {item.audience}</div>
                    <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                      {source && (
                        <a href={source} target="_blank" rel="noopener noreferrer" className="premium-button" style={{ background:C.navy, color:"#fff", minHeight:40 }}>
                          Official/application source
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setSavedFunding(prev => {
                            const next = new Set(prev);
                            next.add(item.id);
                            return next;
                          });
                          toast_(savedFunding.has(item.id) ? "This funding item is already saved." : `${item.title} saved to your funding list.`, color);
                        }}
                        className="premium-button"
                        style={{ background:savedFunding.has(item.id)?C.tealLight:color, color:savedFunding.has(item.id)?C.teal:"#fff", minHeight:40 }}
                      >
                        {savedFunding.has(item.id) ? "Saved" : "Save funding"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="glass-panel" style={{ marginTop:28, padding:"24px" }}>
          <h3 style={{ fontSize:20, fontWeight:850, color:C.navy, marginBottom:8, display:"flex", alignItems:"center", gap:10 }}>
            <VisualIcon name="grant" size={24} color={C.amber} /> Verification rule
          </h3>
          <p style={{ color:C.g600, marginBottom:16, lineHeight:1.7 }}>Funding deadlines, amounts, and eligibility often change. Community Compass links to official sources and avoids invented deadlines.</p>
          <button onClick={() => nav("resources")} className="premium-button premium-button--teal">Find support resources</button>
        </div>
      </section>
    </div>
  );
}
