import { C } from "../../data/colors";
import { IconTile } from "../ui/VisualIcon";

const HELP_ITEMS = [
  { label:"Food", category:"Food", urgency:"Same Week", icon:"food", color:C.amber, detail:"Pantries, SNAP, and local referral directories" },
  { label:"Housing", category:"Housing", urgency:"Same Week", icon:"building", color:C.coral, detail:"Rent, eviction, utility support" },
  { label:"Mental Health", category:"Mental Health", urgency:"Same Week", icon:"health", color:C.pink, detail:"Counseling, crisis, and youth help" },
  { label:"Legal Aid", category:"Legal Aid", urgency:"Same Week", icon:"grant", color:C.purple, detail:"Civil legal support and referrals" },
  { label:"Student Support", category:"Student & Family Support", urgency:"Same Week", icon:"education", color:C.blue, detail:"Family navigation and school support" },
];

export default function NeedHelpFast({ onQuickHelp }) {
  return (
    <section className="premium-shell" aria-labelledby="fast-help-heading" style={{ paddingTop:36 }}>
      <div className="glass-panel" style={{ padding:"28px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", gap:20, flexWrap:"wrap", marginBottom:22 }}>
          <div>
            <div className="section-kicker">Need Help Fast</div>
            <h2 id="fast-help-heading" className="section-heading" style={{ fontSize:"clamp(1.9rem,3vw,2.7rem)" }}>Start with the right door.</h2>
            <p className="section-subtext">Choose an urgent category to pre-load the Resource Finder with calm, practical filters.</p>
          </div>
          <button className="premium-button premium-button--teal" onClick={() => onQuickHelp({ category:"Student & Family Support", urgency:"Same Week" })}>Open guided finder</button>
        </div>
        <div className="fast-help-grid">
          {HELP_ITEMS.map(item => (
            <button
              className="fast-help-card"
              key={item.label}
              onClick={() => onQuickHelp(item)}
            >
              <IconTile name={item.icon} color={item.color} tileSize={46} size={24} />
              <strong style={{ display:"block", color:"var(--cc-ink)", fontSize:15, marginTop:14 }}>{item.label}</strong>
              <span style={{ display:"block", color:"var(--cc-muted)", fontSize:12, lineHeight:1.5, marginTop:5 }}>{item.detail}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
