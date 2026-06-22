import { EVENTS } from "../../data/events";
import { FUNDING } from "../../data/funding";
import { getResourceIndex, NATIONAL_RESOURCE_COUNT, STATE_PROFILES } from "../../data";
import { VOLUNTEER_ROLES } from "../../data/volunteerRoles";

export default function ImpactSnapshot({ actionCount = 0 }) {
  const volunteerOpenings = VOLUNTEER_ROLES.reduce((total, role) => total + role.spots, 0);
  const resourceCount = getResourceIndex().length;

  const stats = [
    { value: resourceCount, label: "resource entries", detail: `${NATIONAL_RESOURCE_COUNT} national resources plus state/local layers` },
    { value: STATE_PROFILES.length, label: "state profiles", detail: "50 states plus Washington, D.C. with placeholder expansion slots" },
    { value: volunteerOpenings, label: "local volunteer openings", detail: "retained in the Middletown local profile" },
    { value: FUNDING.length + EVENTS.length, label: "local action leads", detail: "events and funding leads remain separated from national data" },
  ];

  return (
    <section className="premium-shell" aria-labelledby="impact-heading">
      <div style={{ display:"flex", justifyContent:"space-between", gap:24, alignItems:"end", flexWrap:"wrap", marginBottom:26 }}>
        <div>
          <div className="section-kicker">Community Impact Snapshot</div>
          <h2 id="impact-heading" className="section-heading">A civic platform with measurable pathways.</h2>
          <p className="section-subtext">The site turns static community information into guided, trackable actions for residents and students.</p>
        </div>
        <div className="premium-card" style={{ padding:"16px 18px", minWidth:190 }}>
          <strong style={{ display:"block", fontSize:28, color:"var(--cc-teal)", lineHeight:1 }}>{actionCount}</strong>
          <span style={{ color:"var(--cc-muted)", fontSize:13 }}>actions in your plan</span>
        </div>
      </div>
      <div className="impact-grid">
        {stats.map(stat => (
          <div className="impact-tile" key={stat.label}>
            <strong>{stat.value}</strong>
            <span style={{ fontWeight:800, color:"var(--cc-ink)" }}>{stat.label}</span>
            <p style={{ color:"var(--cc-muted)", fontSize:13, lineHeight:1.55, marginTop:10 }}>{stat.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
