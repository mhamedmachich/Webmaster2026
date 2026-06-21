import { RESOURCES } from "../../data/resources";
import VisualIcon from "../ui/VisualIcon";

export default function TrustPanel() {
  const verified = RESOURCES.filter(resource => resource.verified).length;
  const needsReview = RESOURCES.filter(resource => resource.needsReview).length;
  const hoursVerified = RESOURCES.filter(resource => resource.hoursVerified).length;

  const items = [
    { label:"Verified source", value:verified, text:"Resource came from an official or direct organization source." },
    { label:"Needs review", value:needsReview, text:"Information is useful for demo purposes but should be re-checked." },
    { label:"Hours verified", value:hoursVerified, text:"Listed hours have a stronger confirmation signal in the data." },
    { label:"Verify before use", value:"Always", text:"Users should confirm eligibility, hours, and availability with official sources." },
  ];

  return (
    <section className="premium-shell" aria-labelledby="trust-heading">
      <div className="trust-grid">
        <div>
          <div className="section-kicker">Trust & Verification</div>
          <h2 id="trust-heading" className="section-heading">Honest data, clearly labeled.</h2>
          <p className="section-subtext">Community Compass does not claim live data. It shows what is verified, what needs review, and when users should confirm details directly.</p>
        </div>
        <div className="premium-card" style={{ padding:"22px" }}>
          <div style={{ display:"grid", gap:12 }}>
            {items.map(item => (
              <div key={item.label} style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:12, alignItems:"start" }}>
                <span style={{ width:34, height:34, borderRadius:12, background:"var(--cc-teal-soft)", color:"var(--cc-teal)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <VisualIcon name="check" size={18} color="currentColor" />
                </span>
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:12, fontWeight:900, color:"var(--cc-ink)" }}>
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <p style={{ color:"var(--cc-muted)", fontSize:13, lineHeight:1.55, marginTop:4 }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
