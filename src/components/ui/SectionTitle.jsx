import { C } from "../../data/colors";

export default function SectionTitle({ title, sub }) {
  return (
    <div style={{ marginBottom:32 }}>
      <h2 style={{ fontSize:28, fontWeight:800, color:C.navy, margin:0 }}>{title}</h2>
      {sub && <p style={{ color:C.g500, fontSize:16, marginTop:8, marginBottom:0 }}>{sub}</p>}
    </div>
  );
}
