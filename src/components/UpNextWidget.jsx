import { useState } from 'react';
import { Ic } from '../icons.jsx';
import { localDateStr, getUpNextDays, getThisWeekMonday, DOW_SHORT } from '../utils.js';

function WeekDayRow({day,pid,plans,isFirst,editMode,setSchedule,onSelectPlan,c,t}){
  const [hov,setHov]=useState(false);
  const plan=pid&&pid!=="rest"?plans.find(p=>p.id===pid):null;
  const isRest=pid==="rest";
  const dows=[1,2,3,4,5,6,0];
  const labels=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const idx=dows.findIndex(d=>d===day.dow);
  return(<div style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:`1px solid ${c.border}`,opacity:day.isPast?0.38:1}}>
    <div style={{width:34,flexShrink:0,textAlign:"center"}}>
      <p style={{fontSize:11,fontWeight:day.isToday?700:400,color:day.isToday?c.primary:c.textSecondary,lineHeight:1.2}}>{idx>=0?labels[idx]:DOW_SHORT[day.dow]}</p>
      <p style={{fontSize:9,color:c.textMuted}}>{day.d.getDate()}</p>
    </div>
    {editMode?(
      <select value={pid===null||pid===undefined?"":String(pid)} onChange={e=>{const v=e.target.value;setSchedule(s=>({...s,[day.dow]:v===""?null:v==="rest"?"rest":parseInt(v)}));}} style={{flex:1,background:c.inputBg,border:`1px solid ${c.borderMid}`,borderRadius:7,padding:"6px 8px",color:c.textPrimary,fontSize:12,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>
        <option value="">— {t.free} —</option>
        <option value="rest">🌙 {t.rest}</option>
        {plans.map(p=><option key={p.id} value={String(p.id)}>{p.name}</option>)}
      </select>
    ):(
      <div style={{flex:1,display:"flex",alignItems:"center",gap:7}}>
        {plan?<span style={{fontSize:12.5,color:c.textPrimary}}>{plan.name}</span>:isRest?<span style={{fontSize:12,color:c.textMuted}}>🌙 {t.rest}</span>:<span style={{fontSize:12,color:c.textMuted}}>—</span>}
        {day.isToday&&plan&&<span style={{fontSize:8,background:c.primaryDim,color:c.primary,padding:"2px 6px",borderRadius:10,fontWeight:700,letterSpacing:0.5}}>TODAY</span>}
      </div>
    )}
    {!editMode&&isFirst&&plan&&(
      <button onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={()=>onSelectPlan(plan.id)} style={{width:30,height:30,borderRadius:7,background:hov?c.primaryDim:"transparent",border:`1px solid ${hov?c.primary+"55":c.border}`,color:hov?c.primary:c.textMuted,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.15s",flexShrink:0}}>{Ic.arrow}</button>
    )}
  </div>);
}

export function UpNextWidget({c,t,plans,schedule,setSchedule,onSelectPlan}){
  const [expanded,setExpanded]=useState(false);const [editMode,setEditMode]=useState(false);const [hoverFirst,setHoverFirst]=useState(false);
  const upNext=getUpNextDays(schedule,plans,3);const monday=getThisWeekMonday();const today=new Date();const todayS=localDateStr(today);
  const weekDays=Array.from({length:7},(_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);const dow=[1,2,3,4,5,6,0][i];const ds=localDateStr(d);return{d,dow,label:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],dateStr:ds,isToday:ds===todayS,isPast:d<today&&ds!==todayS};});
  const firstUpcomingIdx=weekDays.findIndex(wd=>!wd.isPast&&schedule[wd.dow]&&schedule[wd.dow]!=="rest"&&plans.find(p=>p.id===schedule[wd.dow]));
  return(<div style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:13,overflow:"hidden"}}>
    <div style={{padding:"15px 17px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <p style={{fontSize:9.5,color:c.textMuted,letterSpacing:1.7,textTransform:"uppercase",fontWeight:700}}>{expanded?t.weeklySchedule:t.upNext}</p>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          {expanded&&<button onClick={()=>setEditMode(!editMode)} style={{background:editMode?c.primaryDim:"transparent",color:editMode?c.primary:c.textSecondary,border:`1px solid ${editMode?c.primary+"44":c.border}`,borderRadius:6,padding:"3px 9px",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s"}}>{editMode?t.doneSched:t.editSchedule}</button>}
          {!expanded&&<button onClick={()=>{setExpanded(true);setEditMode(true);}} title="Edit schedule" style={{background:"transparent",border:`1px solid ${c.border}`,color:c.textSecondary,borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:4}}>{Ic.edit} {t.editSchedule}</button>}
          <button onClick={()=>{setExpanded(!expanded);if(expanded)setEditMode(false);}} style={{background:"transparent",border:`1px solid ${c.border}`,color:c.textSecondary,borderRadius:6,padding:"3px 8px",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:4}}>
            {expanded?<>{Ic.chevUp} {t.collapse}</>:<>{Ic.chevDown} {t.seeWeek}</>}
          </button>
        </div>
      </div>
      {!expanded&&(<>
        {upNext.length===0&&<p style={{fontSize:12,color:c.textMuted,padding:"10px 0",textAlign:"center"}}>No workouts scheduled — press Edit Schedule to set one.</p>}
        {upNext.map((item,i)=>(
          <div key={i} onClick={i===0?()=>onSelectPlan(item.plan.id):undefined} onMouseEnter={()=>i===0&&setHoverFirst(true)} onMouseLeave={()=>setHoverFirst(false)}
            style={{display:"flex",alignItems:"center",gap:10,padding:i===0?"9px 10px":"7px 0",borderBottom:i<upNext.length-1?`1px solid ${c.border}`:"none",borderRadius:i===0?9:0,marginBottom:i===0?6:0,cursor:i===0?"pointer":"default",background:i===0&&hoverFirst?c.primaryDim:"transparent",border:i===0?`1px solid ${i===0&&hoverFirst?c.primary+"44":"transparent"}`:"none",transition:"all 0.16s"}}>
            <div style={{width:34,height:34,borderRadius:8,background:i===0?c.primaryDim:c.bg,border:`1px solid ${i===0?c.primary+"44":c.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:item.isToday?8:9,fontWeight:900,color:i===0?c.primary:c.textMuted,letterSpacing:0.5,lineHeight:1.2}}>{item.isToday?"TODAY":DOW_SHORT[item.dow].toUpperCase()}</span>
              {!item.isToday&&<span style={{fontSize:9,color:c.textMuted}}>{item.d.getDate()}</span>}
            </div>
            <div style={{flex:1}}><p style={{fontSize:12.5,fontWeight:i===0?600:400,color:i===0?c.textPrimary:c.textSecondary}}>{item.plan.name}</p><p style={{fontSize:10.5,color:c.textMuted}}>{item.plan.exercises.length} {t.exercises}</p></div>
            {i===0&&<span style={{color:c.primary,opacity:hoverFirst?1:0.45,transition:"opacity 0.15s"}}>{Ic.arrow}</span>}
          </div>
        ))}
      </>)}
      {expanded&&weekDays.map((day,i)=>(<WeekDayRow key={day.dateStr} day={day} pid={schedule[day.dow]} plans={plans} isFirst={i===firstUpcomingIdx} editMode={editMode} setSchedule={setSchedule} onSelectPlan={onSelectPlan} c={c} t={t}/>))}
    </div>
  </div>);
}
