export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:2000, background:toast.color, color:"#fff", borderRadius:12, padding:"12px 20px", fontWeight:600, fontSize:14, maxWidth:360, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"slideDown 0.3s ease" }}>
      {toast.msg}
    </div>
  );
}
