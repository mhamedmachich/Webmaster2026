import { useState } from "react";
import { C } from "../data/colors";
import { CLUBS } from "../data/clubs";
import PageHero from "../components/layout/PageHero";
import VisualIcon, { IconTile } from "../components/ui/VisualIcon";

export default function ClubsPage({ toast_ }) {
  const [selectedType, setSelectedType] = useState("All");
  const [joinedClubs, setJoinedClubs] = useState(new Set());
  const visibleClubs = selectedType === "All" ? CLUBS : CLUBS.filter(club => club.type === selectedType);

  return (
    <div style={{ animation:"fadeIn 0.3s ease" }}>
      <PageHero title="Clubs & Organizations" subtitle="Find your community. Join a club, lead a team, build something great." color={C.green} end="#085041" icon="building" />
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"48px 24px" }}>
        <div style={{ display:"flex", gap:8, marginBottom:28, flexWrap:"wrap" }}>
          {["All","STEM","Academic","Leadership","Business","Community"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedType(cat)}
              style={{ background:selectedType===cat?C.navy:"#fff", color:selectedType===cat?"#fff":C.navy, border:"1.5px solid #E9ECEF", borderRadius:20, padding:"7px 16px", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
          {visibleClubs.map(club => (
            <div key={club.id} className="card-hover" style={{ background:"#fff", border:"1.5px solid #E9ECEF", borderRadius:16, padding:"1.5rem", transition:"all 0.2s" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <IconTile name={club.icon} color={club.color} tileSize={48} size={25} />
                <div>
                  <h3 style={{ fontSize:16, fontWeight:700, color:C.navy, margin:0 }}>{club.name}</h3>
                  <div style={{ fontSize:12, color:C.g500, marginTop:2 }}>{club.school}</div>
                </div>
                <span style={{ marginLeft:"auto", background:club.color+"18", color:club.color, fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{club.type}</span>
              </div>
              <p style={{ fontSize:14, color:C.g500, lineHeight:1.6, marginBottom:14 }}>{club.desc}</p>
              <div style={{ display:"flex", gap:12, fontSize:13, color:C.g600, flexWrap:"wrap" }}>
                <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}><VisualIcon name="users" size={15} /> {club.members} members</span>
                <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}><VisualIcon name="calendar" size={15} /> {club.meeting}</span>
              </div>
              <button
                onClick={() => {
                  setJoinedClubs(prev => {
                    const next = new Set(prev);
                    next.add(club.id);
                    return next;
                  });
                  toast_(joinedClubs.has(club.id) ? "You already saved this club." : `${club.name} added to your interest list.`, club.color);
                }}
                style={{ marginTop:14, width:"100%", background:joinedClubs.has(club.id)?C.tealLight:club.color, color:joinedClubs.has(club.id)?C.teal:"#fff", border:"none", borderRadius:10, padding:"9px", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}
              >
                {joinedClubs.has(club.id) ? "Saved to Interest List" : "Learn More & Join"}
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop:48, background:C.g100, borderRadius:16, padding:"2rem", textAlign:"center" }}>
          <h3 style={{ fontSize:18, fontWeight:700, color:C.navy, marginBottom:8 }}>Don't see your club?</h3>
          <p style={{ color:C.g600, marginBottom:16 }}>Submit your school organization to be listed on Community Compass.</p>
          <button onClick={() => toast_("Club submission form coming soon. Email info@communitycompass.org for now.", C.navy)} style={{ background:C.navy, color:"#fff", border:"none", borderRadius:12, padding:"12px 24px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Submit a Club →</button>
        </div>
      </div>
    </div>
  );
}
