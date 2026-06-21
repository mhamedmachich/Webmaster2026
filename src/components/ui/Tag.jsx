import { TAG_COLORS } from "../../data/tagColors";

export default function Tag({ label }) {
  const style = TAG_COLORS[label] || { bg:"#F1EFE8", color:"#5F5E5A" };

  return (
    <span style={{ background:style.bg, color:style.color, fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20, whiteSpace:"nowrap", display:"inline-block" }}>
      {label}
    </span>
  );
}
