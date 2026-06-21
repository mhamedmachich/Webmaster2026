import { C } from "../data/colors";
import { EVENTS } from "../data/events";
import PageHero from "../components/layout/PageHero";
import VisualIcon from "../components/ui/VisualIcon";
import { sendEventRegistrationEmail } from "../utils/registrationApi";

export default function EventsPage({ registeredEvents, setRegisteredEvents, toast_, currentUser }) {
  const email = currentUser?.email || "demo@communitycompass.local";
  const [sendingId, setSendingId] = useState(null);

  const registerEvent = async (event) => {
    const alreadyRegistered = registeredEvents.has(event.id);
    if (alreadyRegistered) {
      setRegisteredEvents(prev => {
        const next = new Set(prev);
        next.delete(event.id);
        return next;
      });
      toast_("Registration cancelled.", C.g500);
      return;
    }

    setSendingId(event.id);
    try {
      const result = await sendEventRegistrationEmail({
        event,
        attendee: {
          name: currentUser?.name || "Community Compass Visitor",
          email,
        },
      });

      setRegisteredEvents(prev => {
        const next = new Set(prev);
        next.add(event.id);
        return next;
      });

      toast_(result.mode === "sent" ? "Registration email sent." : "Registered. Email preview logged by the API.", event.color);
    } catch (error) {
      const subject = encodeURIComponent(`Community Compass registration: ${event.title}`);
      const body = encodeURIComponent(`You registered for ${event.title}.\n\nDate: ${event.date}\nTime: ${event.time}\nLocation: ${event.location}\n\n${event.desc}`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      toast_(error.message || "API unavailable. Opening email draft with registration details.", C.coral);
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <PageHero title="Events" subtitle="Free community events in Middletown. Register to save your spot." color={C.blue} end="#185FA5" icon="calendar" />
      <section className="premium-shell">
        {registeredEvents.size > 0 && (
          <div className="glass-panel" style={{ padding:"18px 22px", marginBottom:24, display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ color:C.teal, display:"flex" }}><VisualIcon name="check" size={22} color="currentColor" /></span>
            <div>
              <div style={{ fontWeight:800, color:C.teal }}>Registered for {registeredEvents.size} event{registeredEvents.size>1?"s":""}</div>
              <div style={{ fontSize:13, color:C.g600 }}>Your local demo confirmation is saved in this session.</div>
            </div>
          </div>
        )}

        <div style={{ display:"grid", gap:16 }}>
            {EVENTS.map(event => {
              const pct = Math.round((event.registered/event.spots)*100);
              const full = pct >= 90;
              const reg = registeredEvents.has(event.id);
              return (
                <article key={event.id} className="premium-card" style={{ padding:"22px", borderLeft:`5px solid ${event.color}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:16, alignItems:"start", flexWrap:"wrap" }}>
                    <div>
                      <div className="status-badge" style={{ background:event.color+"18", color:event.color, marginBottom:10 }}>{event.category}</div>
                      <h3 style={{ fontSize:22, fontWeight:850, color:C.navy, letterSpacing:"-0.03em", marginBottom:8 }}>{event.title}</h3>
                      <p style={{ fontSize:14, color:C.g500, lineHeight:1.65, maxWidth:620 }}>{event.desc}</p>
                    </div>
                    <button onClick={() => registerEvent(event)} className="premium-button" style={{ background:reg?C.tealLight:event.color, color:reg?C.teal:"#fff", minWidth:148 }}>
                      {sendingId === event.id ? "Sending..." : reg ? "Registered" : "Register"}
                    </button>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:10, marginTop:16, color:C.g600, fontSize:13 }}>
                    <div><strong style={{ color:C.navy }}>Date</strong><br />{event.date} | {event.time}</div>
                    <div><strong style={{ color:C.navy }}>Location</strong><br />{event.location}</div>
                    <div><strong style={{ color:C.navy }}>Seats</strong><br />{event.spots-event.registered} spots left</div>
                  </div>

                  <div style={{ marginTop:18 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.g400, marginBottom:6 }}>
                      <span>{event.registered} registered</span>
                      <span style={{ color:full?C.coral:C.g400 }}>{pct}% filled</span>
                    </div>
                    <div style={{ background:"#E9ECEF", borderRadius:100, height:7 }}>
                      <div style={{ background:full?C.coral:event.color, borderRadius:100, height:7, width:`${pct}%`, transition:"width 0.6s ease" }} />
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </section>
    </div>
  );
}
