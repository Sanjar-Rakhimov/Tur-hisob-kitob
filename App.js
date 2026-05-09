import { useState, useEffect } from "react";

const fmtEur = (n) => { const v = parseFloat(n)||0; return v%1===0?`${v} €`:`${v.toFixed(2)} €`; };
const fmtUzs = (n) => { const v = Math.round(parseFloat(n)||0); return v.toLocaleString("uz-UZ")+" so'm"; };
let _uid = 1;
const uid = () => ++_uid;

const C = {
  bg:"#0f1117", card:"#181c26", border:"#2a2f3e",
  accent:"#4f8ef7", gold:"#f0b429", green:"#3ecf8e",
  red:"#e05252", muted:"#6b7280", text:"#e8eaf0", sub:"#9aa0b2", purple:"#a78bfa",
};

const cardSt = { background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:12 };
const inp = (extra={}) => ({ background:"#0f1117", border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:15, outline:"none", boxSizing:"border-box", ...extra });
const pill = (on, col=C.accent) => ({ padding:"6px 13px", borderRadius:20, fontSize:13, border:`1.5px solid ${on?col:C.border}`, background:on?`${col}22`:"transparent", color:on?col:C.sub, cursor:"pointer", fontWeight:on?600:400 });
const obtn = (col=C.accent) => ({ background:`${col}18`, border:`1px solid ${col}55`, borderRadius:8, padding:"9px 14px", color:col, fontSize:13, cursor:"pointer", fontWeight:500 });
const ibtn = (col=C.red) => ({ background:`${col}18`, border:`1px solid ${col}44`, borderRadius:7, padding:"6px 10px", color:col, fontSize:13, cursor:"pointer", flexShrink:0 });

const SVCS = [
  { key:"pickup",  icon:"✈️", label:"Kutib olish" },
  { key:"tour",    icon:"🚗", label:"Tur" },
  { key:"dropoff", icon:"🚉", label:"Kuzatish" },
];

// ── DriverCard: amount has LOCAL state, only syncs to parent on blur ──────────
function DriverCard({ d, idx, onRemove, onNameChange, onAmountCommit, onToggleSvc }) {
  const [amt, setAmt] = useState(d.amount);

  // if parent resets (e.g. "teng" button) — sync local state
  useEffect(() => { setAmt(d.amount); }, [d.amount]);

  return (
    <div style={{ background:"#13181f", border:`1px solid ${C.border}`, borderRadius:12, marginBottom:10, overflow:"hidden" }}>
      {/* header */}
      <div style={{ padding:"12px 12px 10px", display:"flex", gap:8, alignItems:"center" }}>
        <div style={{ width:26, height:26, borderRadius:6, background:`${C.gold}22`, border:`1px solid ${C.gold}44`, display:"flex", alignItems:"center", justifyContent:"center", color:C.gold, fontSize:12, fontWeight:700, flexShrink:0 }}>
          {idx+1}
        </div>
        <input
          value={d.name}
          onChange={e => onNameChange(e.target.value)}
          placeholder="Ism / Shahar"
          style={{ ...inp(), flex:1 }}
        />
        <button onClick={onRemove} style={ibtn()}>✕</button>
      </div>

      {/* service toggles */}
      <div style={{ padding:"0 12px 10px", display:"flex", gap:6, flexWrap:"wrap" }}>
        {SVCS.map(s => {
          const on = d.services[s.key];
          return (
            <button key={s.key} onClick={() => onToggleSvc(s.key)} style={{
              display:"flex", alignItems:"center", gap:5,
              padding:"6px 12px", borderRadius:8, fontSize:13, cursor:"pointer",
              border:`1.5px solid ${on?C.purple+"bb":C.border}`,
              background: on?`${C.purple}22`:"transparent",
              color: on?C.purple:C.muted, fontWeight:on?600:400,
            }}>
              {s.icon} {s.label}
            </button>
          );
        })}
      </div>

      {/* amount — local state, commits on blur */}
      <div style={{ padding:"10px 12px", borderTop:`1px solid ${C.border}`, background:"#0f1117", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>
            Miqdor (€) · {SVCS.filter(s=>d.services[s.key]).map(s=>s.icon).join(" ")||"xizmat tanlanmagan"}
          </div>
          <input
            type="number"
            value={amt}
            onChange={e => setAmt(e.target.value)}          // faqat local
            onBlur={() => onAmountCommit(amt)}              // parentga faqat shu yerda
            style={{ ...inp({ width:"100%", textAlign:"right", fontFamily:"monospace", fontSize:20, color:C.gold, padding:"8px 12px" }) }}
          />
        </div>
        {amt !== "" && parseFloat(amt) > 0 && (
          <div style={{ textAlign:"center", flexShrink:0 }}>
            <div style={{ fontSize:10, color:C.muted }}>€</div>
            <div style={{ fontSize:18, fontFamily:"monospace", color:C.gold, fontWeight:700 }}>{fmtEur(amt)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── UZS card ──────────────────────────────────────────────────────────────────
const UZS_P = [5000,10000,20000,50000,100000,150000,200000,300000,500000];
const pk = n => n>=1000000?(n/1000000)+" mln":n>=1000?(n/1000)+"k":String(n);

function UzsCard({ item, icon, onRemove, onChange }) {
  return (
    <div style={{ background:"#13181f", border:`1px solid ${C.border}`, borderRadius:10, padding:12, marginBottom:8 }}>
      <div style={{ display:"flex", gap:8, marginBottom:10, alignItems:"center" }}>
        <span style={{ fontSize:18 }}>{icon}</span>
        <input value={item.name} onChange={e=>onChange({...item,name:e.target.value})} placeholder="Ism yoki joy..." style={{ ...inp(), flex:1 }} />
        <button onClick={onRemove} style={ibtn()}>✕</button>
      </div>
      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:8 }}>
        {UZS_P.map(p=>(
          <button key={p} onClick={()=>onChange({...item,amount:p})} style={pill(parseFloat(item.amount)===p,C.green)}>{pk(p)}</button>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ color:C.sub, fontSize:13 }}>Boshqa:</span>
        <input type="number" value={item.amount} onChange={e=>onChange({...item,amount:e.target.value})} placeholder="0"
          style={{ ...inp({ flex:1, textAlign:"right", fontFamily:"monospace", fontSize:15, color:C.green }) }} />
        <span style={{ color:C.muted, fontSize:13 }}>so'm</span>
      </div>
    </div>
  );
}

function Head({ icon, title, badge, bc=C.gold }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
      <span style={{ fontSize:20 }}>{icon}</span>
      <span style={{ fontSize:11, letterSpacing:2, color:C.sub, textTransform:"uppercase", fontWeight:700 }}>{title}</span>
      {badge!=null && <span style={{ marginLeft:"auto", fontFamily:"monospace", color:bc, fontSize:14, fontWeight:700 }}>{badge}</span>}
    </div>
  );
}

function Row({ label, val, color, big, indent }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", padding:big?"8px 0":"5px 0", paddingLeft:indent?14:0 }}>
      <span style={{ color:big?C.text:C.sub, fontSize:big?14:13, fontWeight:big?600:400 }}>{label}</span>
      <span style={{ color, fontFamily:"monospace", fontSize:big?16:14, fontWeight:big?700:500 }}>{val}</span>
    </div>
  );
}

const mkDriver = () => ({ id:uid(), name:"", amount:"", services:{pickup:false,tour:false,dropoff:false} });
const mkItem  = () => ({ id:uid(), name:"", amount:"" });

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [count,    setCount]    = useState(10);
  const [leader,   setLeader]   = useState(false);
  const [eurRate,  setEurRate]  = useState(50);
  const [drvRate,  setDrvRate]  = useState(10);
  const [drivers,  setDrivers]  = useState([mkDriver()]);
  const [bells,    setBells]    = useState([]);
  const [waiters,  setWaiters]  = useState([]);
  const [result,   setResult]   = useState(false);

  const paying     = Math.max(0, parseInt(count)||0);
  const totalPpl   = paying + (leader?1:0);
  const totalEur   = paying * eurRate;
  const drvBudget  = paying * drvRate;
  const drvTotal   = drivers.reduce((s,d)=>s+(parseFloat(d.amount)||0),0);
  const guideEur   = totalEur - drvTotal;
  const bellTotal  = bells.reduce((s,b)=>s+(parseFloat(b.amount)||0),0);
  const waitTotal  = waiters.reduce((s,w)=>s+(parseFloat(w.amount)||0),0);

  // driver ops — amount only changes when onAmountCommit fires (on blur)
  const commitAmt  = (id, val) => setDrivers(p => p.map(d => d.id===id ? {...d, amount:val} : d));
  const nameChg    = (id, val) => setDrivers(p => p.map(d => d.id===id ? {...d, name:val}   : d));
  const toggleSvc  = (id, key) => setDrivers(p => p.map(d => d.id===id ? {...d, services:{...d.services,[key]:!d.services[key]}} : d));
  const addDriver  = ()        => setDrivers(p => [...p, mkDriver()]);
  const delDriver  = (id)      => setDrivers(p => p.filter(d => d.id!==id));
  const equalSplit = ()        => {
    if (!drivers.length || !drvBudget) return;
    const share = String(parseFloat((drvBudget/drivers.length).toFixed(2)));
    setDrivers(p => p.map(d => ({...d, amount:share})));
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'Segoe UI',system-ui,sans-serif", maxWidth:480, margin:"0 auto", paddingBottom:80 }}>

      {/* ── header ── */}
      <div style={{ background:"linear-gradient(135deg,#1a2035,#0f1117)", borderBottom:`1px solid ${C.border}`, padding:"18px 16px 14px", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:11, letterSpacing:3, color:C.muted }}>TUR GIDI</div>
            <div style={{ fontSize:18, fontWeight:700 }}>💶 Choychaqa Hisob</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:10, color:C.muted }}>Gidga qoladi</div>
            <div style={{ fontSize:24, fontWeight:800, fontFamily:"monospace", color:guideEur>=0?C.green:C.red }}>{fmtEur(guideEur)}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {[["Guruh",`${totalPpl} k`,C.sub],["Jami",fmtEur(totalEur),C.accent],["Haydovchi",fmtEur(drvTotal),C.gold],["Gidga",fmtEur(guideEur),guideEur>=0?C.green:C.red]].map(([l,v,c])=>(
            <div key={l} style={{ flex:1, textAlign:"center", background:"#1a1f2e", borderRadius:8, padding:"5px 2px", border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:8, color:C.muted, letterSpacing:1, textTransform:"uppercase" }}>{l}</div>
              <div style={{ fontSize:11, fontFamily:"monospace", color:c, fontWeight:700 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"14px 14px 0" }}>

        {/* ── 1. Guruh ── */}
        <div style={cardSt}>
          <Head icon="🧑‍🤝‍🧑" title="Guruh" badge={`Jami: ${fmtEur(totalEur)}`} bc={C.accent} />

          <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}>
            <span style={{ color:C.sub, fontSize:13, whiteSpace:"nowrap" }}>To'lovchilar:</span>
            <button onClick={()=>setCount(c=>Math.max(0,(parseInt(c)||0)-1))} style={{ ...ibtn(C.muted), fontSize:18, padding:"4px 10px" }}>−</button>
            <input type="number" min="0" value={count} onChange={e=>setCount(e.target.value)}
              style={{ ...inp({ width:70, textAlign:"center", fontSize:22, fontWeight:700, color:C.accent }) }} />
            <button onClick={()=>setCount(c=>(parseInt(c)||0)+1)} style={{ ...ibtn(C.accent), fontSize:18, padding:"4px 10px" }}>+</button>
            <span style={{ color:C.sub, fontSize:13 }}>kishi</span>
          </div>

          <button onClick={()=>setLeader(v=>!v)} style={{
            width:"100%", padding:"10px 14px", marginBottom:12,
            background:leader?"#1a2a1a":"#1a1f2e", border:`1.5px solid ${leader?C.green+"88":C.border}`,
            borderRadius:10, color:leader?C.green:C.sub, fontSize:14, cursor:"pointer",
            textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center",
          }}>
            <span>👑 Tur lider <span style={{ color:C.muted, fontSize:12 }}>(+1 kishi, pul bermaydi)</span></span>
            <span style={{ background:leader?C.green+"33":C.border, color:leader?C.green:C.muted, borderRadius:12, padding:"3px 10px", fontSize:12, fontWeight:600 }}>
              {leader?"✓ Bor":"Yo'q"}
            </span>
          </button>

          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ color:C.sub, fontSize:13 }}>Kishi boshiga:</span>
            {[45,50].map(v=><button key={v} onClick={()=>setEurRate(v)} style={pill(eurRate===v)}>{v} €</button>)}
            <input type="number" placeholder="Boshqa €" onChange={e=>setEurRate(parseFloat(e.target.value)||eurRate)}
              style={{ ...inp({ width:90, textAlign:"center" }) }} />
          </div>

          {paying>0 && (
            <div style={{ marginTop:10, padding:"8px 12px", borderRadius:8, background:"#1a1f2e", fontSize:13, color:C.sub, display:"flex", justifyContent:"space-between" }}>
              <span>{paying} × {eurRate}€{leader?" + 1 lider":""}</span>
              <span style={{ color:C.accent, fontFamily:"monospace", fontWeight:700 }}>{fmtEur(totalEur)}</span>
            </div>
          )}
        </div>

        {/* ── 2. Haydovchilar ── */}
        <div style={cardSt}>
          <Head icon="🚗" title="Haydovchilar" badge={`Byudjet: ${fmtEur(drvBudget)}`} />

          {/* rate selector */}
          <div style={{ padding:"10px 12px", borderRadius:8, marginBottom:12, background:"#161b28", border:`1px solid ${C.border}` }}>
            <div style={{ color:C.sub, fontSize:12, marginBottom:7 }}>Kishi boshiga haydovchi ulushi:</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
              {[5,10,15,20].map(v=><button key={v} onClick={()=>setDrvRate(v)} style={pill(drvRate===v,C.gold)}>{v} €</button>)}
              <input type="number" placeholder="Boshqa €" onChange={e=>setDrvRate(parseFloat(e.target.value)||drvRate)}
                style={{ ...inp({ width:85, textAlign:"center" }) }} />
            </div>
            <div style={{ marginTop:7, fontSize:12, color:C.muted }}>
              {paying} × {drvRate}€ = <span style={{ color:C.gold, fontWeight:700 }}>{fmtEur(drvBudget)}</span>
            </div>
          </div>

          {drivers.map((d,i)=>(
            <DriverCard
              key={d.id}
              d={d} idx={i}
              onRemove={()=>delDriver(d.id)}
              onNameChange={v=>nameChg(d.id,v)}
              onAmountCommit={v=>commitAmt(d.id,v)}
              onToggleSvc={k=>toggleSvc(d.id,k)}
            />
          ))}

          <div style={{ display:"flex", gap:8 }}>
            <button onClick={addDriver} style={{ ...obtn(C.gold), flex:1 }}>+ Haydovchi qo'shish</button>
            {drivers.length>1 && <button onClick={equalSplit} style={obtn(C.muted)}>⚖️ Teng</button>}
          </div>

          {drvBudget>0 && Math.abs(drvTotal-drvBudget)>0.05 && (
            <div style={{ marginTop:8, padding:"7px 12px", borderRadius:8, fontSize:12, background:drvTotal>drvBudget?"#2a1010":"#101a14", border:`1px solid ${drvTotal>drvBudget?C.red+"55":C.green+"44"}`, color:drvTotal>drvBudget?C.red:C.green }}>
              {drvTotal>drvBudget?`⚠️ Byudjetdan ${fmtEur(drvTotal-drvBudget)} oshib ketdi`:`ℹ️ ${fmtEur(drvBudget-drvTotal)} hali taqsimlanmagan`}
            </div>
          )}
        </div>

        {/* ── 3. Bellboylar ── */}
        <div style={cardSt}>
          <Head icon="🧳" title="Bellboylar" badge={bellTotal>0?fmtUzs(bellTotal):null} bc={C.green} />
          {bells.map(b=><UzsCard key={b.id} item={b} icon="🧳" onRemove={()=>setBells(p=>p.filter(x=>x.id!==b.id))} onChange={u=>setBells(p=>p.map(x=>x.id===u.id?u:x))} />)}
          <button onClick={()=>setBells(p=>[...p,mkItem()])} style={{ ...obtn(C.green), width:"100%" }}>+ Bellboy qo'shish</button>
          {!bells.length && <div style={{ color:C.muted, fontSize:12, marginTop:6, textAlign:"center" }}>Bugun bellboy yo'q</div>}
        </div>

        {/* ── 4. Ofitsiantlar ── */}
        <div style={cardSt}>
          <Head icon="🍽️" title="Ofitsiantlar" badge={waitTotal>0?fmtUzs(waitTotal):null} bc={C.green} />
          {waiters.map(w=><UzsCard key={w.id} item={w} icon="🍽️" onRemove={()=>setWaiters(p=>p.filter(x=>x.id!==w.id))} onChange={u=>setWaiters(p=>p.map(x=>x.id===u.id?u:x))} />)}
          <button onClick={()=>setWaiters(p=>[...p,mkItem()])} style={{ ...obtn(C.green), width:"100%" }}>+ Ofitsiant qo'shish</button>
          {!waiters.length && <div style={{ color:C.muted, fontSize:12, marginTop:6, textAlign:"center" }}>Bugun restoran yo'q</div>}
        </div>

        {/* ── 5. Natija ── */}
        <button onClick={()=>setResult(v=>!v)} style={{ width:"100%", padding:14, cursor:"pointer", fontWeight:600, fontSize:15, background:guideEur>=0?"linear-gradient(135deg,#1a3a2a,#0d2018)":"linear-gradient(135deg,#3a1a1a,#200d0d)", border:`2px solid ${guideEur>=0?C.green+"66":C.red+"66"}`, borderRadius:12, color:C.text, marginBottom:10 }}>
          {result?"▲ Yopish":"📋 Yakuniy hisob"}
        </button>

        {result && (
          <div style={{ ...cardSt, borderColor:C.accent+"55" }}>
            <div style={{ fontSize:11, letterSpacing:2, color:C.accent, marginBottom:12 }}>YAKUNIY HISOB</div>
            <Row label={`Guruh: ${totalPpl} kishi (${paying} to'lovchi${leader?" + 1 lider":""})`} val={fmtEur(totalEur)} color={C.accent} />
            <div style={{ borderTop:`1px solid ${C.border}`, margin:"8px 0" }} />
            {drivers.length>0 && <>
              <div style={{ color:C.muted, fontSize:11, letterSpacing:1, marginBottom:6 }}>HAYDOVCHILAR:</div>
              {drivers.map(d=>{
                const svcs = SVCS.filter(s=>d.services[s.key]).map(s=>s.icon).join(" ");
                return <Row key={d.id} label={`🚗 ${d.name||"Haydovchi"}${svcs?" · "+svcs:""}`} val={`− ${fmtEur(d.amount)}`} color={C.gold} indent />;
              })}
              <Row label="Jami haydovchi" val={`− ${fmtEur(drvTotal)}`} color={C.gold} />
              <div style={{ borderTop:`1px solid ${C.border}`, margin:"8px 0" }} />
            </>}
            <Row label="🏆 GID (EUR)" val={fmtEur(guideEur)} color={guideEur>=0?C.green:C.red} big />
            {(bells.length>0||waiters.length>0) && <>
              <div style={{ borderTop:`1px solid ${C.border}`, margin:"12px 0 8px" }} />
              <div style={{ color:C.muted, fontSize:11, letterSpacing:1, marginBottom:6 }}>NAQD SO'M:</div>
              {bells.map(b=><Row key={b.id} label={`🧳 ${b.name||"Bellboy"}`} val={fmtUzs(b.amount)} color={C.green} indent />)}
              {waiters.map(w=><Row key={w.id} label={`🍽️ ${w.name||"Ofitsiant"}`} val={fmtUzs(w.amount)} color={C.green} indent />)}
              {(bellTotal+waitTotal)>0 && <Row label="Jami so'mda" val={fmtUzs(bellTotal+waitTotal)} color={C.green} big />}
            </>}
          </div>
        )}

        <button onClick={()=>{ if(window.confirm("Yangi kun — tozalash?")){ setCount(10);setLeader(false);setEurRate(50);setDrvRate(10);setDrivers([mkDriver()]);setBells([]);setWaiters([]);setResult(false); }}}
          style={{ marginTop:4, width:"100%", padding:10, background:"transparent", border:`1px solid ${C.red}33`, borderRadius:10, color:C.red+"88", fontSize:13, cursor:"pointer" }}>
          🗑️ Yangi kun — tozalash
        </button>
      </div>
    </div>
  );
}
