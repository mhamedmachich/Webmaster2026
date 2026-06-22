export default function ProductWalkthrough({ nav }) {
  const steps = [
    { label:"1. Run Compass Match", text:"Show how a visitor gets tailored resource suggestions from local data.", page:"resources" },
    { label:"2. Save an action", text:"Save a resource, register for an event, or apply for a volunteer role.", page:"events" },
    { label:"3. Explain trust labels", text:"Highlight verification labels, official sources, and honest data notes.", page:"resources" },
  ];

  return (
    <section className="premium-shell" aria-labelledby="walkthrough-heading">
      <div className="walkthrough-path">
        <div className="section-kicker">Product Walkthrough</div>
        <h2 id="walkthrough-heading" className="section-heading" style={{ fontSize:"clamp(1.8rem,3vw,2.6rem)" }}>A concise walkthrough for partners and community stakeholders.</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14, marginTop:22 }}>
          {steps.map(step => (
            <button key={step.label} onClick={() => nav(step.page)} className="premium-card" style={{ border:"none", cursor:"pointer", fontFamily:"inherit", padding:"20px", textAlign:"left" }}>
              <strong style={{ color:"var(--cc-ink)", display:"block", fontSize:15 }}>{step.label}</strong>
              <span style={{ color:"var(--cc-muted)", display:"block", fontSize:13, lineHeight:1.55, marginTop:8 }}>{step.text}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
