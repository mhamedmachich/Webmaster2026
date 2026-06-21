export default function JudgeDemoPath({ nav }) {
  const steps = [
    { label:"1. Run Compass Match", text:"Show how a visitor gets tailored resource suggestions from local data.", page:"resources" },
    { label:"2. Save an action", text:"Save a resource, register for an event, or apply for a volunteer role.", page:"events" },
    { label:"3. Explain trust labels", text:"Point judges to verification labels and honest data notes.", page:"tsa" },
  ];

  return (
    <section className="premium-shell" aria-labelledby="demo-heading">
      <div className="demo-path">
        <div className="section-kicker">Judge Demo Path</div>
        <h2 id="demo-heading" className="section-heading" style={{ fontSize:"clamp(1.8rem,3vw,2.6rem)" }}>A 3-minute walkthrough for TSA evaluation.</h2>
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
