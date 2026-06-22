import { useMemo, useState } from "react";
import { C } from "../data/colors";
import { NATIONAL_VOLUNTEER } from "../data";
import { getVolunteerForContext } from "../data/location/locationLookup";
import LocationSelector from "../components/location/LocationSelector";
import PageHero from "../components/layout/PageHero";
import VisualIcon, { IconTile } from "../components/ui/VisualIcon";

const defaultLocation = {
  zip: "",
  stateAbbr: "",
  localProfileId: "",
  includeNational: true,
};

export default function VolunteeringPage({ appliedRoles, setAppliedRoles, toast_ }) {
  const [locationContext, setLocationContext] = useState(defaultLocation);
  const volunteerItems = useMemo(
    () => getVolunteerForContext(locationContext, locationContext.includeNational ? NATIONAL_VOLUNTEER : []),
    [locationContext]
  );
  const urgentRoles = volunteerItems.filter(role => role.urgent);
  const localRoles = volunteerItems.filter(role => role.scope === "local");
  const nationalPlatforms = volunteerItems.filter(role => role.scope === "national");

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <PageHero title="Volunteer" subtitle="National volunteer platforms, state placeholders, and local role profiles." color={C.coral} end="#993C1D" icon="hands" />
      <section className="premium-shell">
        <div style={{ display:"grid", gridTemplateColumns:"minmax(0,0.85fr) minmax(0,1.15fr)", gap:22, marginBottom:28 }} className="responsive-two-col">
          <div className="premium-card" style={{ padding:"26px" }}>
            <div className="section-kicker">Volunteer Coverage</div>
            <h2 className="section-heading" style={{ fontSize:"clamp(1.8rem,3vw,2.6rem)" }}>Separate platforms from local roles.</h2>
            <p className="section-subtext">National entries are search platforms or service programs. Local roles stay clearly labeled and should be verified before real-world use.</p>
            <div style={{ marginTop:18 }}>
              <LocationSelector value={locationContext} onChange={setLocationContext} resultCount={volunteerItems.length} resultLabel="volunteer items" />
            </div>
          </div>
          <div style={{ display:"grid", gap:12 }}>
            {[
              { label:"National platforms", val:nationalPlatforms.length, color:C.blue },
              { label:"Local roles", val:localRoles.length, color:C.teal },
              { label:"Urgent local/sample roles", val:urgentRoles.length, color:C.coral },
            ].map(item => (
              <div key={item.label} className="premium-card" style={{ padding:"18px", display:"flex", gap:14, alignItems:"center", borderLeft:`5px solid ${item.color}` }}>
                <IconTile name="hands" color={item.color} tileSize={48} size={25} />
                <div>
                  <strong style={{ color:C.navy }}>{item.val}</strong>
                  <p style={{ color:C.g500, fontSize:13, lineHeight:1.5, marginTop:4 }}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"grid", gap:14 }}>
          {volunteerItems.map(role => {
            const color = role.scope === "national" ? C.blue : role.scope === "state" ? C.purple : role.urgent ? C.coral : C.teal;
            const isPlatform = role.sourceType?.includes("platform") || role.scope !== "local";
            return (
              <article key={role.id} className="premium-card volunteer-row" style={{ padding:"20px", display:"grid", gridTemplateColumns:"auto minmax(0,1fr) auto", alignItems:"center", gap:16 }}>
                <IconTile name={role.icon || "hands"} color={color} tileSize={54} size={28} />
                <div style={{ minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                    <h3 style={{ fontSize:17, fontWeight:850, color:C.navy, margin:0 }}>{role.title}</h3>
                    <span className="status-badge" style={{ background:color+"18", color }}>{role.scope}</span>
                    <span className="status-badge" style={{ background:role.dataStatus === "placeholder" ? C.g100 : C.tealLight, color:role.dataStatus === "placeholder" ? C.g600 : C.teal }}>{role.dataStatus}</span>
                  </div>
                  <div style={{ fontSize:13, color:C.g600, marginBottom:4 }}>{role.org}</div>
                  <div style={{ fontSize:13, color:C.g400, marginBottom:8, display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
                    <VisualIcon name="clock" size={14} /> {role.hours} | {role.spots} | {role.category}
                  </div>
                  <p style={{ fontSize:13, color:C.g500, lineHeight:1.55, margin:0 }}>{role.desc}</p>
                  <p style={{ fontSize:12, color:C.g400, lineHeight:1.5, marginTop:8 }}>{role.verificationNote}</p>
                </div>
                {isPlatform ? (
                  role.sourceUrl ? (
                    <a href={role.sourceUrl} target="_blank" rel="noopener noreferrer" className="premium-button" style={{ background:C.navy, color:"#fff", minWidth:130 }}>
                      Open platform
                    </a>
                  ) : (
                    <button disabled className="premium-button" style={{ background:C.g100, color:C.g500, minWidth:130 }}>
                      Add source
                    </button>
                  )
                ) : (
                  <button onClick={() => {
                    setAppliedRoles(prev => { const next = new Set(prev); next.add(role.id); return next; });
                    toast_(appliedRoles.has(role.id) ? "Already saved." : "Volunteer role saved to your action plan.", C.coral);
                  }} className="premium-button" style={{ background:appliedRoles.has(role.id)?C.tealLight:C.navy, color:appliedRoles.has(role.id)?C.teal:"#fff", minWidth:120 }}>
                    {appliedRoles.has(role.id) ? "Saved" : "Save role"}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
