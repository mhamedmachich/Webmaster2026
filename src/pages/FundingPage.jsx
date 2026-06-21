import { useState } from "react";
import { C } from "../data/colors";
import { FUNDING } from "../data/funding";
import PageHero from "../components/layout/PageHero";
import VisualIcon from "../components/ui/VisualIcon";

export default function FundingPage({ nav, toast_ }) {
  const [savedFunding, setSavedFunding] = useState(new Set());

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <PageHero title="Funding & Grants" subtitle="Scholarships, grants, and funding opportunities for students, families, and organizations." color={C.amber} end="#854F0B" icon="funding" />
      <section className="premium-shell">
        <div style={{ display:"grid", gridTemplateColumns:"minmax(0,0.75fr) minmax(0,1.25fr)", gap:22 }} className="responsive-two-col">
          <aside className="premium-card" style={{ padding:"26px", alignSelf:"start", position:"sticky", top:92 }}>
            <div className="section-kicker">Funding Command Center</div>
            <h2 className="section-heading" style={{ fontSize:"clamp(1.8rem,3vw,2.6rem)" }}>Compare deadlines before you apply.</h2>
            <p className="section-subtext">Each opportunity highlights amount, audience, deadline, eligibility, and can be saved locally for demo planning.</p>
            <button className="premium-button premium-button--teal" onClick={() => nav("events")} style={{ marginTop:18 }}>Find grant workshops</button>
          </aside>

          <div style={{ display:"grid", gap:16 }}>
            {FUNDING.map(f => (
              <article key={f.id} className="premium-card" style={{ padding:"22px", borderLeft:`5px solid ${f.color}` }}>
                <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) auto", gap:18, alignItems:"start" }}>
                  <div>
                    <div className="status-badge" style={{ background:f.color+"18", color:f.color, marginBottom:10 }}>{f.category}</div>
                    <h3 style={{ fontSize:22, fontWeight:850, color:C.navy, letterSpacing:"-0.03em", marginBottom:8 }}>{f.title}</h3>
                    <p style={{ fontSize:14, color:C.g500, lineHeight:1.65 }}>{f.eligibility}</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:26, fontWeight:900, color:f.color, letterSpacing:"-0.04em" }}>{f.amount}</div>
                    <div style={{ color:C.g400, fontSize:12, marginTop:5 }}>Due {f.deadline}</div>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", gap:12, alignItems:"center", marginTop:18, flexWrap:"wrap" }}>
                  <div style={{ color:C.g600, fontSize:13 }}><strong style={{ color:C.navy }}>For:</strong> {f.audience}</div>
                  <button
                    onClick={() => {
                      setSavedFunding(prev => {
                        const next = new Set(prev);
                        next.add(f.id);
                        return next;
                      });
                      toast_(savedFunding.has(f.id) ? "This funding opportunity is already saved." : `${f.title} saved to your funding list.`, f.color);
                    }}
                    className="premium-button"
                    style={{ background:savedFunding.has(f.id)?C.tealLight:f.color, color:savedFunding.has(f.id)?C.teal:"#fff", minHeight:40 }}
                  >
                    {savedFunding.has(f.id) ? "Saved" : "Save funding"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ marginTop:28, padding:"24px" }}>
          <h3 style={{ fontSize:20, fontWeight:850, color:C.navy, marginBottom:8, display:"flex", alignItems:"center", gap:10 }}>
            <VisualIcon name="grant" size={24} color={C.amber} /> Grant Writing Help
          </h3>
          <p style={{ color:C.g600, marginBottom:16, lineHeight:1.7 }}>Not sure how to apply? Partner organizations can host free grant writing workshops every month.</p>
          <button onClick={() => nav("events")} className="premium-button premium-button--teal">See upcoming workshops</button>
        </div>
      </section>
    </div>
  );
}
