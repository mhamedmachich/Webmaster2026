import VisualIcon from "../ui/VisualIcon";

export default function PageHero({ title, subtitle, color, end = "#0F2D4E", icon = "compass" }) {
  return (
    <div style={{ background:`radial-gradient(circle at 18% 18%, ${color}44, transparent 26rem), linear-gradient(135deg,${color} 0%, ${end} 100%)`, padding:"72px 24px 62px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:"auto -80px -120px auto", width:330, height:330, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
      <div style={{ position:"absolute", inset:"-120px auto auto -90px", width:260, height:260, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
      <div style={{ maxWidth:800, margin:"0 auto", textAlign:"center", position:"relative" }}>
        <div style={{ width:74, height:74, borderRadius:24, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.28)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", boxShadow:"0 20px 60px rgba(0,0,0,0.18)", backdropFilter:"blur(18px)" }}>
          <VisualIcon name={icon} size={36} color="currentColor" />
        </div>
        <h1 style={{ color:"#fff", fontSize:"clamp(2.3rem,5vw,4.4rem)", fontWeight:850, letterSpacing:"-0.045em", lineHeight:1, marginBottom:14 }}>{title}</h1>
        <p style={{ color:"rgba(255,255,255,0.82)", fontSize:17, lineHeight:1.75 }}>{subtitle}</p>
      </div>
    </div>
  );
}
