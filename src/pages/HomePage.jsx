import { useMemo, useState } from "react";
import { C } from "../data/colors";
import { EVENTS } from "../data/events";
import { RESOURCES } from "../data/resources";
import CompassMatch from "../components/features/CompassMatch";
import ImpactSnapshot from "../components/features/ImpactSnapshot";
import JudgeDemoPath from "../components/features/JudgeDemoPath";
import NeedHelpFast from "../components/features/NeedHelpFast";
import TrustPanel from "../components/features/TrustPanel";
import Tag from "../components/ui/Tag";
import VisualIcon, { IconTile } from "../components/ui/VisualIcon";

const HERO_CHIPS = ["verified", "open now", "nearby", "youth support", "tutoring", "volunteering", "saved"];
const STARTER_SEARCHES = ["food pantry", "tutoring", "rent support", "resume workshop", "teen programs"];

const JOURNEY_STEPS = [
  { icon:"message", title:"Describe the need", text:"Start with a real situation: food, housing, tutoring, crisis support, volunteering, or funding.", page:"ai", color:C.teal },
  { icon:"search", title:"Narrow the path", text:"Filter by audience, urgency, cost, language, format, transportation, and trust signals.", page:"resources", color:C.blue },
  { icon:"check", title:"Choose with confidence", text:"Review verification labels, official sources, dates, phone links, and directions.", page:"resources", color:C.amber },
  { icon:"hands", title:"Take action", text:"Save resources, register for events, apply for roles, and build a personal action plan.", page:"volunteering", color:C.coral },
];

const RESOURCE_SHOWCASE = [
  { icon:"food", title:"Food assistance", meta:"SNAP, pantries, same-week support", color:C.amber, span:"wide" },
  { icon:"education", title:"Tutoring and student help", meta:"library spaces, school supplies, youth programs", color:C.blue },
  { icon:"health", title:"Health and wellness", meta:"mental health, community clinics, crisis lines", color:C.coral, span:"tall" },
  { icon:"hands", title:"Volunteer opportunities", meta:"urgent roles and local openings", color:C.teal },
  { icon:"calendar", title:"Local events", meta:"workshops, fairs, service drives", color:C.purple },
  { icon:"building", title:"Trusted organizations", meta:"official sources and verification dates", color:C.green, span:"wide" },
];

const TRUST_SIGNALS = [
  { label:"Official source links", value:"14", text:"Each resource keeps users close to the organization that owns the information." },
  { label:"Verification dates", value:"2026", text:"Dates are visible so judges and users can see when data was last reviewed." },
  { label:"Review flags", value:"Clear", text:"Needs-review labels are shown instead of hidden, keeping the project honest." },
  { label:"Action safety", value:"Local", text:"The guide uses demo responses only and never exposes external API keys." },
];

export default function HomePage({ nav, quickHelp, toggleSave, savedIds, actionCount, setResourceSearch }) {
  const [heroQuery, setHeroQuery] = useState("");
  const heroSuggestions = useMemo(() => {
    const query = heroQuery.trim().toLowerCase();
    if (!query) {
      return STARTER_SEARCHES.map(label => ({ label, type:"Suggested search", value:label }));
    }

    return RESOURCES
      .filter(resource => `${resource.title} ${resource.category} ${resource.desc} ${resource.tags.join(" ")}`.toLowerCase().includes(query))
      .slice(0, 5)
      .map(resource => ({ label:resource.title, type:resource.category, value:resource.title }));
  }, [heroQuery]);

  const runHeroSearch = (value = heroQuery) => {
    const query = value.trim();
    if (!query) return;
    setResourceSearch(query);
    nav("resources");
  };

  return (
    <div className="home-redesign">
      <section className="signature-hero" aria-labelledby="home-hero-title">
        <div className="signature-hero__bg" />
        <div className="signature-hero__routes" aria-hidden="true">
          <svg viewBox="0 0 1100 620" preserveAspectRatio="none">
            <path className="route-line route-line--one" d="M30 420 C220 210 330 500 520 300 C700 110 840 190 1060 70" />
            <path className="route-line route-line--two" d="M80 120 C260 230 340 90 470 220 C590 340 760 330 1010 470" />
            <path className="route-line route-line--three" d="M170 540 C330 460 390 380 530 450 C690 530 790 250 970 300" />
          </svg>
          <span className="map-node map-node--a" />
          <span className="map-node map-node--b" />
          <span className="map-node map-node--c" />
          <span className="map-node map-node--d" />
        </div>

        <div className="signature-hero__content">
          <div className="signature-hero__copy">
            <div className="premium-eyebrow">
              <img src="/brand/community-compass-logo.png" alt="" className="eyebrow-logo" />
              TSA Webmaster 2026 | Community Compass
            </div>
            <h1 id="home-hero-title">Find the right local starting point faster.</h1>
            <p>
              A premium civic-tech resource launchpad that helps people move from uncertainty to
              trusted local support with guided search, verification labels, and saved next steps.
            </p>
            <div className="premium-actions">
              <button className="premium-button premium-button--primary" onClick={() => nav("resources")}>Launch Resource Finder</button>
              <button className="premium-button premium-button--ghost" onClick={() => nav("ai")}>Ask the Resource Guide</button>
            </div>
          </div>

          <div className="hero-command-stage" aria-label="Animated resource command center">
            <div className="compass-halo">
              <img src="/brand/community-compass-logo.png" alt="Community Compass logo" />
            </div>

            <div className="hero-command-panel">
              <div className="command-panel__topline">
                <span>Resource command center</span>
                <span className="status-badge" style={{ background:C.tealLight, color:C.teal }}>Live demo</span>
              </div>
              <form className="hero-search-shell" onSubmit={(event) => { event.preventDefault(); runHeroSearch(); }}>
                <VisualIcon name="search" size={22} color="currentColor" />
                <input
                  value={heroQuery}
                  onChange={event => setHeroQuery(event.target.value)}
                  placeholder="Try food pantry, tutoring, rent support..."
                  aria-label="Search suggested community resources"
                />
                <button type="submit">Search</button>
              </form>
              <div className="hero-suggestions" aria-label="Suggested resource searches">
                {heroSuggestions.length ? heroSuggestions.map(suggestion => (
                  <button key={`${suggestion.type}-${suggestion.label}`} onClick={() => runHeroSearch(suggestion.value)}>
                    <span>{suggestion.type}</span>
                    {suggestion.label}
                  </button>
                )) : (
                  <button onClick={() => runHeroSearch(heroQuery)}>
                    <span>Search all resources</span>
                    {heroQuery}
                  </button>
                )}
              </div>
              <div className="hero-chip-cloud">
                {HERO_CHIPS.map((chip, index) => (
                  <span key={chip} className="hero-chip" style={{ animationDelay:`${index * 0.18}s` }}>{chip}</span>
                ))}
              </div>

              <div className="hero-match-card">
                <div>
                  <span className="section-kicker" style={{ marginBottom:4 }}>Best match</span>
                  <strong>{RESOURCES[0].title}</strong>
                  <p>{RESOURCES[0].desc.slice(0, 92)}...</p>
                </div>
                <button onClick={() => toggleSave(RESOURCES[0].id)}>{savedIds.has(RESOURCES[0].id) ? "Saved" : "Save"}</button>
              </div>
            </div>

            <div className="floating-proof-card floating-proof-card--trust">
              <VisualIcon name="check" size={18} />
              <div><strong>Verified source</strong><span>official link included</span></div>
            </div>

            <div className="floating-proof-card floating-proof-card--plan">
              <strong>{actionCount}</strong>
              <span>actions in your plan</span>
            </div>
          </div>
        </div>
      </section>

      <section className="journey-section" aria-labelledby="journey-heading">
        <div className="premium-shell">
          <div className="section-kicker">How Community Compass Guides You</div>
          <h2 id="journey-heading" className="section-heading">A pathfinding experience, not a list of links.</h2>
          <p className="section-subtext">The homepage now shows the user journey as connected checkpoints, reinforcing the compass and route-finding identity.</p>
          <div className="route-journey">
            <div className="route-journey__line" />
            {JOURNEY_STEPS.map((step, index) => (
              <button key={step.title} onClick={() => nav(step.page)} className="route-stop" style={{ "--stop-color":step.color, animationDelay:`${index * 0.14}s` }}>
                <span className="route-stop__node"><VisualIcon name={step.icon} size={24} /></span>
                <span className="route-stop__index">0{index + 1}</span>
                <strong>{step.title}</strong>
                <span>{step.text}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <NeedHelpFast onQuickHelp={quickHelp} />

      <section className="resource-mosaic-section" aria-labelledby="resource-types-heading">
        <div className="premium-shell">
          <div style={{ display:"flex", justifyContent:"space-between", gap:24, alignItems:"end", flexWrap:"wrap", marginBottom:26 }}>
            <div>
              <div className="section-kicker">Explore Real Resource Types</div>
              <h2 id="resource-types-heading" className="section-heading">A layered ecosystem of support.</h2>
              <p className="section-subtext">Instead of equal cards, the homepage uses a product-module mosaic with trust labels, metadata, and movement.</p>
            </div>
            <button className="premium-button premium-button--teal" onClick={() => nav("resources")}>Open all resources</button>
          </div>
          <div className="resource-mosaic">
            {RESOURCE_SHOWCASE.map((item, index) => (
              <button key={item.title} onClick={() => nav(item.title.includes("Volunteer") ? "volunteering" : item.title.includes("events") ? "events" : "resources")} className={`mosaic-card mosaic-card--${item.span || "base"}`} style={{ "--mosaic-color":item.color, animationDelay:`${index * 0.08}s` }}>
                <IconTile name={item.icon} color={item.color} tileSize={54} size={28} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.meta}</span>
                </div>
                <div className="mosaic-card__meta">
                  <span>verified</span>
                  <span>updated</span>
                  <span>local</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <CompassMatch onSave={toggleSave} savedIds={savedIds} onOpenResources={() => nav("resources")} />

      <section className="trust-showcase" aria-labelledby="trust-showcase-heading">
        <div className="premium-shell">
          <div className="trust-dashboard">
            <div>
              <div className="section-kicker">Trust & Verification</div>
              <h2 id="trust-showcase-heading" className="section-heading">Reliability is part of the interface.</h2>
              <p className="section-subtext">Community Compass surfaces quality signals directly inside the experience: official links, verification dates, review flags, and safe local guidance.</p>
              <button className="premium-button premium-button--teal" onClick={() => nav("resources")}>Review trust labels</button>
            </div>
            <div className="trust-stack">
              {TRUST_SIGNALS.map((signal, index) => (
                <div className="trust-signal-card" key={signal.label} style={{ animationDelay:`${index * 0.12}s` }}>
                  <span>{signal.value}</span>
                  <strong>{signal.label}</strong>
                  <p>{signal.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ImpactSnapshot actionCount={actionCount} />

      <section className="mission-section" aria-labelledby="mission-heading">
        <div className="mission-panel">
          <div>
            <div className="section-kicker">Why This Matters</div>
            <h2 id="mission-heading">When people need help, the hardest step is often knowing where to start.</h2>
          </div>
          <p>
            Community Compass reduces confusion by turning local services into a guided,
            trustworthy, action-oriented experience. It is designed to feel modern enough for
            judges, but grounded enough for real community use.
          </p>
        </div>
      </section>

      <TrustPanel />
      <JudgeDemoPath nav={nav} />

      <section className="final-launch-section" aria-labelledby="final-launch-heading">
        <div className="final-launch-card">
          <img src="/brand/community-compass-logo.png" alt="" />
          <div>
            <div className="section-kicker">Start Exploring</div>
            <h2 id="final-launch-heading">Discover trusted support near you.</h2>
            <p>Use the Resource Finder, Compass Match, or Need Help Fast mode to find a better starting point in seconds.</p>
          </div>
          <button className="premium-button premium-button--primary" onClick={() => nav("resources")}>Launch Community Compass</button>
        </div>
      </section>
    </div>
  );
}
