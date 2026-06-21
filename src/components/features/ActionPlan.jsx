import { EVENTS } from "../../data/events";
import { VOLUNTEER_ROLES } from "../../data/volunteerRoles";

export default function ActionPlan({ savedResources, registeredEvents, appliedRoles, nav }) {
  const registeredList = EVENTS.filter(event => registeredEvents.has(event.id));
  const appliedList = VOLUNTEER_ROLES.filter(role => appliedRoles.has(role.id));
  const total = savedResources.length + registeredList.length + appliedList.length;

  if (total === 0) return null;

  const sections = [
    { label:"Saved Resources", count:savedResources.length, items:savedResources.map(resource => resource.title), action:"Review Resources", page:"resources" },
    { label:"Event Registrations", count:registeredList.length, items:registeredList.map(event => event.title), action:"View Events", page:"events" },
    { label:"Volunteer Applications", count:appliedList.length, items:appliedList.map(role => role.title), action:"View Roles", page:"volunteering" },
  ];

  return (
    <section className="action-plan" aria-labelledby="action-plan-heading">
      <div style={{ display:"flex", justifyContent:"space-between", gap:16, alignItems:"center", flexWrap:"wrap" }}>
        <div>
          <div style={{ color:"#5DCAA5", fontSize:12, fontWeight:900, letterSpacing:"0.1em", textTransform:"uppercase" }}>My Action Plan</div>
          <h2 id="action-plan-heading" style={{ color:"#fff", fontSize:"clamp(1.5rem,3vw,2.25rem)", marginTop:6 }}>Your next steps are saved in one place.</h2>
        </div>
        <div style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.13)", borderRadius:999, padding:"9px 14px", fontWeight:800 }}>
          {total} action{total === 1 ? "" : "s"}
        </div>
      </div>
      <div className="action-plan__grid">
        {sections.map(section => (
          <div className="action-plan__item" key={section.label}>
            <div style={{ display:"flex", justifyContent:"space-between", gap:10, alignItems:"center" }}>
              <strong>{section.label}</strong>
              <span style={{ color:"#5DCAA5", fontWeight:900 }}>{section.count}</span>
            </div>
            <div style={{ minHeight:64, marginTop:12 }}>
              {section.items.length ? section.items.slice(0,2).map(item => (
                <div key={item} style={{ color:"rgba(255,255,255,0.75)", fontSize:13, lineHeight:1.45, marginBottom:6 }}>{item}</div>
              )) : <div style={{ color:"rgba(255,255,255,0.45)", fontSize:13 }}>No actions yet.</div>}
            </div>
            <button className="premium-button premium-button--ghost" onClick={() => nav(section.page)} style={{ minHeight:38, width:"100%" }}>{section.action}</button>
          </div>
        ))}
      </div>
    </section>
  );
}
