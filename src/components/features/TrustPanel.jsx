import { getResourceIndex, STATE_PROFILES } from "../../data";
import VisualIcon from "../ui/VisualIcon";

export default function TrustPanel() {
  const resources = getResourceIndex();
  const verified = resources.filter(resource => resource.officialSource || resource.dataStatus === "source-linked").length;
  const needsReview = resources.filter(resource => resource.needsReview).length;
  const stateProfiles = STATE_PROFILES.length;

  const items = [
    { label:"Source-linked", value:verified, text:"National resources link to official or locator sources whenever possible." },
    { label:"State profiles", value:stateProfiles, text:"State profiles may be partial or placeholders until manually verified." },
    { label:"Needs review", value:needsReview, text:"Sample or placeholder entries are labeled instead of treated as complete data." },
    { label:"Verify before use", value:"Always", text:"Users should confirm eligibility, hours, availability, and deadlines on official websites." },
  ];

  return (
    <section className="premium-shell" aria-labelledby="trust-heading">
      <div className="trust-grid">
        <div>
          <div className="section-kicker">Trust & Verification</div>
          <h2 id="trust-heading" className="section-heading">Honest data, clearly labeled.</h2>
          <p className="section-subtext">Community Compass does not claim live data. Verified date means when the student team last checked or linked the source; local data must be rechecked before public real-world use.</p>
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
