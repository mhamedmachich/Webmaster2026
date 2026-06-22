import { C } from "../../data/colors";

export default function FilterSidebar({ filters, setFilters, saved }) {
  const cats = ["All categories","Emergency & Crisis","Food Assistance","Housing & Utilities","Health Care","Mental Health","Legal Aid","Jobs & Career","Education & College","Youth Programs","Disability Support","Senior Support","Veterans & Military Families","Disaster Relief","Transportation","Volunteering","Grants & Funding"];
  const audiences = ["Everyone","Students","Families","Adults","Seniors"];
  const costs = ["Any cost","Free","Sliding scale","Low-cost","Varies"];
  const urgencies = ["Any timing","Emergency","Same Day","Same Week","Routine","Varies"];
  const formats = ["Any format","Online","Phone","Text","In-person","Locator"];
  const langs = ["Any language","English","Spanish"];

  const update = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  return (
    <div className="filter-sidebar command-center" style={{ width:290, flexShrink:0, height:"fit-content", position:"sticky", top:92 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <span style={{ fontWeight:700, fontSize:16, color:C.navy }}>Filters</span>
        <button onClick={() => setFilters({ cat:"All categories", audience:"Everyone", cost:"Any cost", urgency:"Any timing", format:"Any format", language:"Any language", openNow:false, accessibility:false, transit:false, savedOnly:false })}
          style={{ background:C.tealLight, border:"none", color:C.teal, fontWeight:800, fontSize:13, cursor:"pointer", borderRadius:999, padding:"7px 11px" }}>Clear</button>
      </div>
      {[
        { label:"Category", key:"cat", opts:cats },
        { label:"Audience", key:"audience", opts:audiences },
        { label:"Cost", key:"cost", opts:costs },
        { label:"Urgency", key:"urgency", opts:urgencies },
        { label:"Format", key:"format", opts:formats },
        { label:"Language", key:"language", opts:langs },
      ].map(({ label, key, opts }) => (
        <div key={key} style={{ marginBottom:16 }}>
          <label style={{ fontSize:13, fontWeight:600, color:C.g700, display:"block", marginBottom:6 }}>{label}</label>
          <select value={filters[key]} onChange={e => update(key, e.target.value)}
            style={{ width:"100%", padding:"10px 12px", border:"1px solid rgba(15,31,58,0.1)", borderRadius:12, fontSize:13, color:C.navy, background:"rgba(255,255,255,0.92)", fontFamily:"inherit" }}>
            {opts.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      ))}
      <div style={{ borderTop:"1px solid #E9ECEF", paddingTop:14, display:"flex", flexDirection:"column", gap:10 }}>
        {[
          { key:"openNow", label:"Verified hours" },
          { key:"accessibility", label:"Remote or transit-friendly" },
          { key:"transit", label:"Transportation available" },
          { key:"savedOnly", label:`Saved only (${saved})` },
        ].map(({ key, label }) => (
          <label key={key} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.g700, cursor:"pointer" }}>
            <input type="checkbox" checked={filters[key]} onChange={e => update(key, e.target.checked)}
              style={{ width:15, height:15, accentColor:C.teal }} />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}
