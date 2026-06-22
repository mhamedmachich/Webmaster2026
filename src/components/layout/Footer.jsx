import { C } from "../../data/colors";
import { NAV } from "../../data/nav";

export default function Footer({ nav }) {
  return (
    <footer style={{ background:C.navy, padding:"48px 24px 0", marginTop:80 }}>
      <div style={{ maxWidth:"var(--cc-container)", margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:32, paddingBottom:40 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:"#fff", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
              <img src="/brand/community-compass-logo.png" alt="" style={{ width:34, height:34, objectFit:"contain" }} />
            </div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>Community Compass</div>
          </div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.7 }}>Connecting Middletown residents to the services and support that help communities thrive.</div>
        </div>
        <div>
          <div style={{ color:"#fff", fontWeight:700, fontSize:13, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.06em" }}>Navigation</div>
          {NAV.map(n => (
            <button key={n.id} onClick={() => nav(n.id)} style={{ display:"block", background:"none", border:"none", color:"rgba(255,255,255,0.55)", fontSize:14, cursor:"pointer", padding:"3px 0", fontFamily:"inherit", textAlign:"left", transition:"color 0.15s" }}
              onMouseEnter={e => e.target.style.color="#fff"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.55)"}>
              {n.label}
            </button>
          ))}
        </div>
        <div>
          <div style={{ color:"#fff", fontWeight:700, fontSize:13, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.06em" }}>Platform Tools</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:2 }}>
            <div>Guided Resource Finder</div>
            <div>Community profiles and posts</div>
            <div>Event registration confirmations</div>
            <div>info@communitycompass.org</div>
          </div>
        </div>
        <div>
          <div style={{ color:"#fff", fontWeight:700, fontSize:13, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.06em" }}>Data Integrity</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:2 }}>
            <div>Official source links</div>
            <div>Visible verification dates</div>
            <div>Needs-review flags</div>
            <div>Routine data review required</div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth:"var(--cc-container)", margin:"0 auto", borderTop:"1px solid rgba(255,255,255,0.1)", padding:"20px 0", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
        <span style={{ fontSize:12, color:"rgba(255,255,255,0.35)" }}>(c) 2026 Community Compass | Community Resource Platform | Middletown, Delaware</span>
        <span style={{ fontSize:12, color:"rgba(255,255,255,0.35)" }}>Built with React and local resource guidance</span>
      </div>
    </footer>
  );
}
