import { useMemo, useState } from "react";
import { C } from "../../data/colors";
import { RESOURCES } from "../../data/resources";
import Tag from "../ui/Tag";

const needs = [
  { label:"Food", value:"Food" },
  { label:"Housing", value:"Housing" },
  { label:"Mental health", value:"Mental Health" },
  { label:"Student support", value:"Student & Family Support" },
  { label:"Jobs", value:"Employment" },
  { label:"Legal aid", value:"Legal Aid" },
];

const audiences = ["Students", "Families", "Adults", "Seniors"];
const timings = ["Same Week", "Routine"];

export default function CompassMatch({ onSave, savedIds, onOpenResources }) {
  const [need, setNeed] = useState("Food");
  const [audience, setAudience] = useState("Students");
  const [timing, setTiming] = useState("Same Week");

  const matches = useMemo(() => {
    const exact = RESOURCES.filter(resource =>
      resource.category === need &&
      resource.audience.includes(audience) &&
      resource.urgency === timing
    );
    const broad = RESOURCES.filter(resource =>
      resource.category === need ||
      resource.audience.includes(audience) ||
      resource.urgency === timing
    );
    return (exact.length ? exact : broad).slice(0, 3);
  }, [need, audience, timing]);

  return (
    <section className="premium-shell" aria-labelledby="compass-match-heading">
      <div className="command-center">
        <div style={{ display:"flex", justifyContent:"space-between", gap:18, flexWrap:"wrap", marginBottom:22 }}>
          <div>
            <div className="section-kicker">Compass Match</div>
            <h2 id="compass-match-heading" className="section-heading" style={{ fontSize:"clamp(1.9rem,3vw,2.8rem)" }}>A guided matcher for real needs.</h2>
            <p className="section-subtext">Answer three quick prompts and get a local starting point using existing resource data.</p>
          </div>
          <button className="premium-button premium-button--teal" onClick={onOpenResources}>Open full finder</button>
        </div>
        <div className="finder-quiz">
          <div style={{ display:"grid", gap:18 }}>
            <QuizGroup title="What do you need?" options={needs} value={need} onChange={setNeed} />
            <QuizGroup title="Who is this for?" options={audiences.map(value => ({ label:value, value }))} value={audience} onChange={setAudience} />
            <QuizGroup title="How soon?" options={timings.map(value => ({ label:value, value }))} value={timing} onChange={setTiming} />
          </div>
          <div style={{ display:"grid", gap:12 }}>
            {matches.map(resource => (
              <div className="premium-card" key={resource.id} style={{ padding:"18px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:12, alignItems:"start" }}>
                  <div>
                    <h3 style={{ color:"var(--cc-ink)", fontSize:16, marginBottom:7 }}>{resource.title}</h3>
                    <p style={{ color:"var(--cc-muted)", fontSize:13, lineHeight:1.55 }}>{resource.desc}</p>
                  </div>
                  <button
                    onClick={() => onSave(resource.id)}
                    className="premium-button"
                    style={{ background:savedIds.has(resource.id)?C.tealLight:C.navy, color:savedIds.has(resource.id)?C.teal:"#fff", minHeight:38, flexShrink:0 }}
                  >
                    {savedIds.has(resource.id) ? "Saved" : "Save"}
                  </button>
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:12 }}>
                  {resource.tags.slice(0,4).map(tag => <Tag key={tag} label={tag} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function QuizGroup({ title, options, value, onChange }) {
  return (
    <div>
      <h3 style={{ color:"var(--cc-ink)", fontSize:14, marginBottom:10 }}>{title}</h3>
      <div className="quiz-options">
        {options.map(option => (
          <button
            key={option.value}
            className={`quiz-option ${value === option.value ? "is-selected" : ""}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
