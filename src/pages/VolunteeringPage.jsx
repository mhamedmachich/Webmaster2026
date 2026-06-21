import { C } from "../data/colors";
import { VOLUNTEER_ROLES } from "../data/volunteerRoles";
import PageHero from "../components/layout/PageHero";
import VisualIcon, { IconTile } from "../components/ui/VisualIcon";

export default function VolunteeringPage({ appliedRoles, setAppliedRoles, toast_ }) {
  const urgentRoles = VOLUNTEER_ROLES.filter(role => role.urgent);

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <PageHero title="Volunteer" subtitle="Give back. Every hour makes a difference in Middletown." color={C.coral} end="#993C1D" icon="hands" />
      <section className="premium-shell">
        <div style={{ display:"grid", gridTemplateColumns:"minmax(0,0.85fr) minmax(0,1.15fr)", gap:22, marginBottom:28 }} className="responsive-two-col">
          <div className="premium-card" style={{ padding:"26px" }}>
            <div className="section-kicker">Urgent Roles</div>
            <h2 className="section-heading" style={{ fontSize:"clamp(1.8rem,3vw,2.6rem)" }}>Places where help is needed soon.</h2>
            <p className="section-subtext">Urgent roles stand out clearly while every application is saved to the action plan.</p>
          </div>
          <div style={{ display:"grid", gap:12 }}>
            {urgentRoles.slice(0,3).map(role => (
              <div key={role.id} className="premium-card" style={{ padding:"18px", display:"flex", gap:14, alignItems:"center", borderLeft:`5px solid ${C.coral}` }}>
                <IconTile name={role.icon} color={C.coral} tileSize={48} size={25} />
                <div>
                  <strong style={{ color:C.navy }}>{role.title}</strong>
                  <p style={{ color:C.g500, fontSize:13, lineHeight:1.5, marginTop:4 }}>{role.org} | {role.spots} openings</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:16, marginBottom:28, flexWrap:"wrap" }}>
          {[
            { label:"Total openings", val:VOLUNTEER_ROLES.reduce((a,r)=>a+r.spots,0), color:C.coral },
            { label:"Urgent roles", val:urgentRoles.length, color:C.amber },
            { label:"Organizations", val:VOLUNTEER_ROLES.length, color:C.purple },
            { label:"Your applications", val:appliedRoles.size, color:C.teal },
          ].map(({ label,val,color }) => (
            <div key={label} className="impact-tile" style={{ flex:"1 1 160px" }}>
              <strong style={{ color }}>{val}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gap:14 }}>
          {VOLUNTEER_ROLES.map(role => (
            <article key={role.id} className="premium-card volunteer-row" style={{ padding:"20px", display:"grid", gridTemplateColumns:"auto minmax(0,1fr) auto", alignItems:"center", gap:16 }}>
              <IconTile name={role.icon} color={role.urgent?C.coral:C.teal} tileSize={54} size={28} />
              <div style={{ minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                  <h3 style={{ fontSize:17, fontWeight:850, color:C.navy, margin:0 }}>{role.title}</h3>
                  {role.urgent && <span className="status-badge" style={{ background:C.coralLight, color:C.coral }}>Urgent</span>}
                </div>
                <div style={{ fontSize:13, color:C.g600, marginBottom:4 }}>{role.org}</div>
                <div style={{ fontSize:13, color:C.g400, marginBottom:8, display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
                  <VisualIcon name="clock" size={14} /> {role.hours} | {role.spots} openings | {role.category}
                </div>
                <p style={{ fontSize:13, color:C.g500, lineHeight:1.55, margin:0 }}>{role.desc}</p>
              </div>
              <button onClick={() => {
                setAppliedRoles(prev => { const n=new Set(prev); n.add(role.id); return n; });
                toast_(appliedRoles.has(role.id)?"Already applied!":"Application submitted! Check your action plan.", C.coral);
              }} className="premium-button" style={{ background:appliedRoles.has(role.id)?C.tealLight:C.navy, color:appliedRoles.has(role.id)?C.teal:"#fff", minWidth:120 }}>
                {appliedRoles.has(role.id)?"Applied":"Apply"}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
