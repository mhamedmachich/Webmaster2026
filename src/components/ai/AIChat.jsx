import { useCallback, useEffect, useRef, useState } from "react";
import { C } from "../../data/colors";
import { getLocalGuideResponse } from "../../utils/localGuideResponses";
import VisualIcon from "../ui/VisualIcon";

export default function AIChat() {
  const [msgs, setMsgs] = useState([{ role:"assistant", text:"Hi, I can help you narrow down local services, application steps, student programs, and community support options around Middletown." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [msgs, loading]);

  const SUGGESTIONS = ["I need food assistance now","Job training programs?","Housing help options","Programs for my teen","Mental health support","Free legal help"];

  const send = useCallback((text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setMsgs(m => [...m, { role:"user", text:msg }]);
    setLoading(true);
    setTimeout(() => {
      setMsgs(m => [...m, { role:"assistant", text:getLocalGuideResponse(msg) }]);
      setLoading(false);
    }, 650);
  }, [input, loading]);

  return (
    <div className="glass-panel" style={{ overflow:"hidden", maxWidth:760, margin:"0 auto" }}>
      <div style={{ background:"linear-gradient(135deg,#071A31,#0B3D2E)", padding:"1rem 1.5rem", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:38, height:38, borderRadius:"50%", background:C.teal, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <VisualIcon name="compass" size={22} color="currentColor" />
        </div>
        <div>
          <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>Resource Navigator</div>
          <div style={{ color:C.tealMid, fontSize:12 }}>Local demo guidance | Always available</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:C.teal }} />
          <span style={{ color:C.tealMid, fontSize:12 }}>Online</span>
        </div>
      </div>
      <div ref={messagesRef} style={{ height:360, overflowY:"auto", padding:"1.25rem 1.5rem", display:"flex", flexDirection:"column", gap:12, overscrollBehavior:"contain", background:"linear-gradient(180deg,rgba(248,250,252,0.8),rgba(255,255,255,0.88))" }}>
        {msgs.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            <div style={{ background:m.role==="user"?C.navy:"#F8F9FA", color:m.role==="user"?"#fff":C.navy, borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 14px", maxWidth:"82%", fontSize:14, lineHeight:1.6 }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", justifyContent:"flex-start" }}>
            <div style={{ background:"#F8F9FA", borderRadius:"16px 16px 16px 4px", padding:"12px 16px", display:"flex", gap:5 }}>
              {[0,1,2].map(i => <span key={i} style={{ width:7, height:7, borderRadius:"50%", background:C.teal, display:"inline-block", animation:`bounce 1.2s infinite ${i*0.2}s` }} />)}
            </div>
          </div>
        )}
      </div>
      {msgs.length <= 1 && (
        <div style={{ padding:"0 1.5rem 1rem", display:"flex", flexWrap:"wrap", gap:8 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} style={{ background:C.tealLight, color:C.teal, border:"1px solid rgba(29,158,117,0.16)", borderRadius:20, padding:"7px 14px", fontSize:13, fontWeight:700, cursor:"pointer" }}>{s}</button>
          ))}
        </div>
      )}
      <div style={{ padding:"0.75rem 1.5rem 1.25rem", display:"flex", gap:10, borderTop:"1px solid #E9ECEF" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && send()}
          placeholder="Ask about any service or resource..."
          style={{ flex:1, border:"1.5px solid #DEE2E6", borderRadius:12, padding:"10px 14px", fontSize:14, outline:"none", fontFamily:"inherit", color:C.navy }} />
        <button onClick={() => send()} disabled={!input.trim()||loading}
          style={{ background:input.trim()&&!loading?C.teal:"#E9ECEF", color:input.trim()&&!loading?"#fff":C.g400, border:"none", borderRadius:12, padding:"10px 20px", fontWeight:700, fontSize:14, cursor:input.trim()&&!loading?"pointer":"default", transition:"all 0.2s" }}>
          Send
        </button>
      </div>
    </div>
  );
}
