import { C } from "../../data/colors";
import { IconTile } from "../ui/VisualIcon";

const HELP_ITEMS = [
  { label:"Emergency", category:"Emergency & Crisis", urgency:"Emergency", search:"911 emergency", icon:"alert", color:C.coral, detail:"Call 911 for immediate danger" },
  { label:"988 Crisis Support", category:"Emergency & Crisis", urgency:"Emergency", search:"988 crisis mental health", icon:"health", color:C.pink, detail:"Call or text 988 for crisis support" },
  { label:"211 Referrals", category:"Emergency & Crisis", urgency:"Same Day", search:"211 referral local help", icon:"message", color:C.teal, detail:"Find local referral support" },
  { label:"Food Help", category:"Food Assistance", urgency:"Same Week", search:"food SNAP WIC pantry", icon:"food", color:C.amber, detail:"SNAP, WIC, food banks, and meal locators" },
  { label:"Housing Help", category:"Housing & Utilities", urgency:"Same Week", search:"housing rent utilities LIHEAP", icon:"building", color:C.blue, detail:"Rent, utilities, HUD, and housing contacts" },
  { label:"Legal Aid", category:"Legal Aid", urgency:"Same Week", search:"legal aid eviction benefits", icon:"grant", color:C.purple, detail:"Civil legal support and referrals" },
];

export default function NeedHelpFast({ onQuickHelp }) {
  return (
    <section className="premium-shell" aria-labelledby="fast-help-heading" style={{ paddingTop:36 }}>
      <div className="glass-panel" style={{ padding:"28px" }}>
        <div className="fast-help-header">
          <div>
            <div className="section-kicker">Need Help Fast</div>
            <h2 id="fast-help-heading" className="section-heading" style={{ fontSize:"clamp(1.9rem,3vw,2.7rem)" }}>Start with the right door.</h2>
            <p className="section-subtext">Choose an urgent category to pre-load the Resource Finder with calm, practical filters.</p>
          </div>
          <button className="fast-help-finder-button" onClick={() => onQuickHelp({ category:"Emergency & Crisis", urgency:"Same Day", search:"211 referral local help" })}>
            <span>Open Finder</span>
            <small>View all support options</small>
          </button>
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
