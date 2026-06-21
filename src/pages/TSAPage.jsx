import { C } from "../data/colors";
import PageHero from "../components/layout/PageHero";
import { IconTile } from "../components/ui/VisualIcon";

export default function TSAPage() {
  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <PageHero title="TSA Chapter" subtitle="Technology Student Association - Appoquinimink High School, Delaware" color={C.navy} end="#122840" icon="wrench" />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"48px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16, marginBottom:48 }}>
          {[
            { icon:"trophy", title:"2nd Place", sub:"Webmaster - State 2025", color:C.amber },
            { icon:"code", title:"Webmaster", sub:"This project!", color:C.teal },
            { icon:"wrench", title:"Robotics", sub:"State competitors", color:C.blue },
            { icon:"grant", title:"STEM Innovation", sub:"Annual showcase", color:C.purple },
          ].map(card => (
            <div key={card.title} style={{ background:"#fff", border:"1.5px solid #E9ECEF", borderRadius:14, padding:"1.5rem", textAlign:"center", borderTop:`4px solid ${card.color}` }}>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}><IconTile name={card.icon} color={card.color} tileSize={58} size={30} /></div>
              <div style={{ fontWeight:700, fontSize:16, color:C.navy }}>{card.title}</div>
              <div style={{ fontSize:13, color:C.g500, marginTop:4 }}>{card.sub}</div>
            </div>
          ))}
        </div>
        <div className="responsive-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, marginBottom:48 }}>
          <div style={{ background:"#fff", border:"1.5px solid #E9ECEF", borderRadius:16, padding:"1.75rem" }}>
            <h3 style={{ fontSize:18, fontWeight:700, color:C.navy, marginBottom:16 }}>About This Project</h3>
            <p style={{ fontSize:14, color:C.g600, lineHeight:1.7 }}>
              Community Compass was built as part of the TSA Webmaster competition for 2026. Our team designed and built a web application to connect Middletown residents with community resources, events, volunteer opportunities, and support services. The project emphasizes accessibility, real data, and guided navigation.
            </p>
          </div>
          <div style={{ background:"#fff", border:"1.5px solid #E9ECEF", borderRadius:16, padding:"1.75rem" }}>
            <h3 style={{ fontSize:18, fontWeight:700, color:C.navy, marginBottom:16 }}>Tech Stack</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {[["code","React + Hooks","Frontend framework"],["guide","Local guide logic","No external API keys"],["wrench","Custom CSS","Design system"],["building","Vite","Development build"],["grant","14 real resources","Verified database"]].map(([icon,name,desc]) => (
                <div key={name} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13 }}>
                  <IconTile name={icon} color={C.teal} tileSize={28} size={15} />
                  <strong style={{ color:C.navy }}>{name}</strong>
                  <span style={{ color:C.g400 }}>- {desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background:C.g100, borderRadius:16, padding:"2rem", textAlign:"center" }}>
          <h3 style={{ fontSize:18, fontWeight:700, color:C.navy, marginBottom:8 }}>Join TSA at Appoquinimink HS</h3>
          <p style={{ color:C.g600, marginBottom:16 }}>Meetings every Tuesday at 3:00pm. Open to all students interested in STEM, design, or technology.</p>
          <a href="mailto:info@communitycompass.org" style={{ display:"inline-block", background:C.navy, color:"#fff", border:"none", borderRadius:12, padding:"12px 28px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", textDecoration:"none" }}>Get in touch →</a>
        </div>
      </div>
    </div>
  );
}
