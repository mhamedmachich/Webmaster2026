import { C } from "../data/colors";
import Tag from "../components/ui/Tag";
import PageHero from "../components/layout/PageHero";
import VisualIcon, { IconTile } from "../components/ui/VisualIcon";

export default function StudentsPage({ nav }) {
  const cards = [
    { icon:"book", title:"After-School Tutoring", desc:"Free one-on-one and group tutoring for math, science, and reading at Appoquinimink Library.", tags:["Free","Students","Routine"], color:C.purple },
    { icon:"computer", title:"Digital Equity Program", desc:"Refurbished laptops and free internet access for students who qualify. Apply through the library.", tags:["Free","Students","Same Week"], color:C.blue },
    { icon:"health", title:"Mental Health Support", desc:"Confidential counseling for students through Delaware Guidance Services. No referral needed.", tags:["Free","Students","Same Week"], color:C.coral },
    { icon:"education", title:"School Supplies Drive", desc:"Free backpacks and supplies at the start of each school year. No income requirement.", tags:["Free","Students","Routine"], color:C.amber },
    { icon:"globe", title:"ESL Support", desc:"English language support for multilingual students and families through New Neighbors Network.", tags:["Free","Students","Routine"], color:C.teal },
    { icon:"sports", title:"Youth Recreation", desc:"Free and low-cost sports, arts, and enrichment programs through the Middletown Rec Dept.", tags:["Low cost","Students","Routine"], color:C.green },
  ];

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <PageHero title="Student Hub" subtitle="Resources, support, and opportunities specifically for K-12 and college students in the Middletown area." color={C.purple} end="#3C3489" icon="education" />
      <div style={{ maxWidth:"var(--cc-container)", margin:"0 auto", padding:"48px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20, marginBottom:48 }}>
          {cards.map(card => (
            <div key={card.title} className="card-hover" style={{ background:"#fff", border:"1.5px solid #E9ECEF", borderRadius:16, padding:"1.5rem", transition:"all 0.2s", borderTop:`4px solid ${card.color}` }}>
              <div style={{ marginBottom:12 }}><IconTile name={card.icon} color={card.color} tileSize={52} size={28} /></div>
              <h3 style={{ fontSize:15, fontWeight:700, color:C.navy, marginBottom:6 }}>{card.title}</h3>
              <p style={{ fontSize:13, color:C.g500, lineHeight:1.6, marginBottom:12 }}>{card.desc}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
                {card.tags.map(t => <Tag key={t} label={t} />)}
              </div>
              <button onClick={() => nav("resources")} style={{ background:card.color, color:"#fff", border:"none", borderRadius:10, padding:"9px 14px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", width:"100%" }}>
                Find Matching Resources
              </button>
            </div>
          ))}
        </div>
        <div style={{ background:C.blueLight, border:`1.5px solid ${C.blue}44`, borderRadius:16, padding:"2rem", marginBottom:32 }}>
          <h3 style={{ fontSize:18, fontWeight:700, color:C.navy, marginBottom:8, display:"flex", alignItems:"center", gap:10 }}>
            <VisualIcon name="education" size={24} color={C.blue} /> College Prep Corner
          </h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12, marginTop:16 }}>
            {["SAT/ACT Prep (Free)", "FAFSA Assistance", "College Essay Workshops", "Scholarship Database", "Campus Visit Programs", "First-Gen Student Support"].map(item => (
              <div key={item} style={{ background:"#fff", borderRadius:10, padding:"10px 14px", fontSize:14, color:C.navy, fontWeight:500, display:"flex", alignItems:"center", gap:8 }}>
                <VisualIcon name="check" size={16} color={C.blue} /> {item}
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign:"center" }}>
          <button onClick={() => nav("resources")} style={{ background:C.purple, color:"#fff", border:"none", borderRadius:12, padding:"14px 32px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Browse All Resources →</button>
        </div>
      </div>
    </div>
  );
}
