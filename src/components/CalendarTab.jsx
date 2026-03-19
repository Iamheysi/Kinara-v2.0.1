import { localDateStr } from '../utils.js';

const DOW_EN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DOW_RU=["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];
const MONTHS_RU=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];

export function CalendarTab({c,t,lang,sessions,setSessions,selectedMonth,setSelectedMonth,selectedDay,setSelectedDay,restDaysLog}){
  const days=new Date(selectedMonth.getFullYear(),selectedMonth.getMonth()+1,0).getDate();
  const firstDay=new Date(selectedMonth.getFullYear(),selectedMonth.getMonth(),1).getDay();
  const isRu=lang==="ru";
  const monthName=isRu?`${MONTHS_RU[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`:selectedMonth.toLocaleDateString("en-GB",{month:"long",year:"numeric"});
  const dow=isRu?DOW_RU:DOW_EN;
  const getDateStr=d=>`${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth()+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const todayDateStr=localDateStr();
  const getSession=d=>sessions.find(s=>s.date===getDateStr(d));
  const isRest=d=>restDaysLog.includes(getDateStr(d));
  const goToday=()=>{const n=new Date();setSelectedMonth(new Date(n.getFullYear(),n.getMonth()));setSelectedDay(n.getDate());};

  return(<div style={{maxWidth:1100,margin:"0 auto"}}>
    <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:18}}>
      <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:34,fontWeight:900,color:c.textPrimary}}>{t.activityCalendar}</p>
      <button onClick={goToday} style={{background:c.primaryDim,color:c.primary,border:`1px solid ${c.primary}33`,borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{isRu?"Сегодня":"Today"}</button>
    </div>
    <div className="kb-cal-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      <div style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:18,padding:22}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <button onClick={()=>setSelectedMonth(new Date(selectedMonth.getFullYear(),selectedMonth.getMonth()-1))} style={{background:c.surface,border:`1px solid ${c.border}`,color:c.textSecondary,cursor:"pointer",fontSize:18,padding:"4px 10px",borderRadius:8,transition:"background 0.15s"}}>‹</button>
          <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:c.textPrimary}}>{monthName}</p>
          <button onClick={()=>setSelectedMonth(new Date(selectedMonth.getFullYear(),selectedMonth.getMonth()+1))} style={{background:c.surface,border:`1px solid ${c.border}`,color:c.textSecondary,cursor:"pointer",fontSize:18,padding:"4px 10px",borderRadius:8,transition:"background 0.15s"}}>›</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:5}}>{dow.map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:c.textMuted,padding:"4px 0",fontWeight:600}}>{d}</div>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
          {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`}/>)}
          {Array.from({length:days}).map((_,i)=>{const d=i+1;const dStr=getDateStr(d);const isToday=dStr===todayDateStr;const isW=!!getSession(d);const isR=isRest(d);const isSel=selectedDay===d;return(<div key={d} onClick={()=>setSelectedDay(isSel?null:d)} style={{aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,borderRadius:8,background:isSel?c.primaryDim:isW?`${c.primary}0A`:isR?`${c.purple}0A`:"transparent",cursor:"pointer",border:isToday?`1.5px solid ${c.primary}`:isSel?`1.5px solid ${c.primary}55`:"1.5px solid transparent",transition:"all 0.15s"}}><span style={{fontSize:12,color:isSel?c.primary:isToday?c.primary:c.textPrimary,fontWeight:isToday||isSel?700:400}}>{d}</span>{isW&&<div style={{width:5,height:5,borderRadius:"50%",background:c.purple}}/>}{isR&&!isW&&<div style={{width:5,height:5,borderRadius:"50%",background:c.gold}}/>}</div>);})}
        </div>
        <div style={{display:"flex",gap:14,marginTop:14,paddingTop:12,borderTop:`1px solid ${c.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:7,height:7,borderRadius:"50%",background:c.purple}}/><span style={{fontSize:10.5,color:c.textSecondary}}>{t.workout}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:7,height:7,borderRadius:"50%",background:c.gold}}/><span style={{fontSize:10.5,color:c.textSecondary}}>{t.rest}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:10,height:10,borderRadius:3,border:`1.5px solid ${c.primary}`}}/><span style={{fontSize:10.5,color:c.textSecondary}}>{isRu?"Сегодня":"Today"}</span></div>
        </div>
      </div>
      <div style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:18,padding:22}}>
        {selectedDay&&getSession(selectedDay)?(()=>{const s=getSession(selectedDay);return(<>
          <p style={{fontSize:9.5,color:c.primary,letterSpacing:1.8,textTransform:"uppercase",fontWeight:700,marginBottom:4}}>{getDateStr(selectedDay)}</p>
          <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:c.textPrimary,marginBottom:3}}>{s.planName}</h3>
          <div style={{display:"flex",gap:12,marginBottom:14}}>
            <span style={{fontSize:12,color:c.textSecondary,background:c.bg,padding:"3px 8px",borderRadius:6}}>{Math.round(s.duration/60)} {isRu?"мин":"min"}</span>
            <span style={{fontSize:12,color:c.textSecondary,background:c.bg,padding:"3px 8px",borderRadius:6}}>{Math.round(s.totalVolume)} {isRu?"кг объём":"kg volume"}</span>
          </div>
          {s.exercises.map((ex,i)=>(<div key={i} style={{borderBottom:`1px solid ${c.border}`,paddingBottom:9,marginBottom:9}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12.5,fontWeight:500,color:c.textPrimary}}>{ex.name}</span><span style={{fontSize:11,color:c.textSecondary}}>{ex.sets.length} {isRu?"подх.":"sets"}</span></div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{ex.sets.map((s2,j)=><span key={j} style={{fontSize:10.5,color:c.textMuted,background:c.bg,padding:"2px 6px",borderRadius:4}}>{s2.reps}r @ {s2.weight}kg</span>)}</div>
          </div>))}
          <button onClick={()=>{setSessions(p=>p.filter(x=>x.id!==s.id));setSelectedDay(null);}} style={{background:"none",border:`1px solid ${c.border}`,color:"#B05050",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:4,padding:"6px 12px",borderRadius:7}}>{t.deleteSession}</button>
        </>);})():selectedDay&&isRest(selectedDay)?(
          <div style={{height:"100%",minHeight:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:c.textSecondary,gap:8}}>
            <span style={{fontSize:32}}>😴</span>
            <p style={{fontSize:14,fontWeight:600}}>{t.restDay}</p>
            <p style={{fontSize:12,color:c.textMuted}}>{getDateStr(selectedDay)}</p>
          </div>
        ):(<div style={{height:"100%",minHeight:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:c.textMuted,gap:10}}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <p style={{fontSize:12}}>{t.selectDayDetail}</p>
        </div>)}
      </div>
    </div>
  </div>);
}
