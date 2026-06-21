import { useState } from "react";
import { C } from "../../data/colors";
import Tag from "../ui/Tag";
import VisualIcon from "../ui/VisualIcon";

export default function ResourceCardFull({ res, saved, onSave }) {
  const [expanded, setExpanded] = useState(false);
  const showPhoneLink = res.phone && res.phone !== "N/A" && !["211", "911", "988"].includes(String(res.phone).replace(/\D/g, ""));

  return (
    <article className="resource-card-premium" style={expanded ? { boxShadow:"var(--cc-shadow-lift)" } : {}}>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14, alignItems:"center" }}>
        <span className="status-badge" style={{ background:res.verified?C.tealLight:C.coralLight, color:res.verified?C.teal:C.coral }}>
          <VisualIcon name={res.verified ? "check" : "empty"} size={13} color="currentColor" />
          {res.verified ? "Verified source" : "Needs review"}
        </span>
        <span className="status-badge" style={{ background:res.hoursVerified?C.greenLight:C.g100, color:res.hoursVerified?C.green:C.g600 }}>
          {res.hoursVerified ? "Hours verified" : "Hours not verified"}
        </span>
        <Tag label={res.category} />
        <button onClick={() => onSave(res.id)} style={{ marginLeft:"auto", background:saved?C.coralLight:"#fff", border:`1px solid ${saved?`${C.coral}33`:"rgba(15,31,58,0.1)"}`, borderRadius:20, cursor:"pointer", fontSize:12, color: saved ? C.coral : C.g500, transition:"all 0.2s", padding:"6px 11px", fontWeight:800 }} title={saved ? "Unsave" : "Save"}>
          {saved ? "Saved to Toolkit" : "Save"}
        </button>
      </div>

      <h3 style={{ margin:"0 0 8px", fontSize:22, fontWeight:800, color:C.navy, letterSpacing:"-0.03em" }}>{res.title}</h3>
      <p style={{ margin:"0 0 16px", fontSize:14, color:C.g600, lineHeight:1.65 }}>{res.desc}</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:10, fontSize:13, color:C.g600, marginBottom:16 }}>
        <div style={{ background:"rgba(248,249,250,0.88)", border:"1px solid rgba(15,31,58,0.05)", borderRadius:14, padding:"10px" }}><strong style={{ color:C.navy }}>Location</strong><br />{res.location}</div>
        <div style={{ background:"rgba(248,249,250,0.88)", border:"1px solid rgba(15,31,58,0.05)", borderRadius:14, padding:"10px" }}><strong style={{ color:C.navy }}>Hours</strong><br />{res.hours}</div>
        <div style={{ background:"rgba(248,249,250,0.88)", border:"1px solid rgba(15,31,58,0.05)", borderRadius:14, padding:"10px" }}><strong style={{ color:C.navy }}>Verified date</strong><br />{res.verifiedDate}</div>
      </div>

      {expanded && (
        <div style={{ borderTop:"1px solid rgba(15,31,58,0.08)", paddingTop:14, marginBottom:14, fontSize:13, color:C.g600, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:8 }}>
          <div><strong style={{ color:C.navy }}>Audience:</strong> {res.audience.join(", ")}</div>
          <div><strong style={{ color:C.navy }}>Cost:</strong> {res.cost}</div>
          <div><strong style={{ color:C.navy }}>Format:</strong> {res.format}</div>
          <div><strong style={{ color:C.navy }}>Language:</strong> {res.language}</div>
          <div><strong style={{ color:C.navy }}>Phone:</strong> {res.phone}</div>
        </div>
      )}

      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <a href={res.website} target="_blank" rel="noopener noreferrer" className="premium-button" style={{ background:C.navy, color:"#fff", minHeight:40, fontSize:13 }}>
          <VisualIcon name="link" size={15} /> Official source
        </a>
        <a href={`https://maps.google.com/?q=${encodeURIComponent(res.location)}`} target="_blank" rel="noopener noreferrer" className="premium-button" style={{ background:"#fff", color:C.navy, border:"1px solid rgba(15,31,58,0.1)", minHeight:40, fontSize:13 }}>
          <VisualIcon name="location" size={15} /> Directions
        </a>
        {showPhoneLink && (
          <a href={`tel:${res.phone}`} className="premium-button" style={{ background:"#fff", color:C.navy, border:"1px solid rgba(15,31,58,0.1)", minHeight:40, fontSize:13 }}>
            <VisualIcon name="phone" size={15} /> {res.phone}
          </a>
        )}
        <button onClick={() => setExpanded(e => !e)} className="premium-button" style={{ background:C.tealLight, color:C.teal, minHeight:40, marginLeft:"auto", fontSize:13 }}>
          {expanded ? "Show less" : "More details"}
        </button>
      </div>
    </article>
  );
}
