import { RECOVERY_FACTS } from '../constants.js';

export function RestTab({c,t,lang,todayActivity,onLogRest,onUndoRest,activeWorkout,onOverrideRest,autoRestEnabled,setAutoRestEnabled,restDaysLog,sessions,streak}){
  const fact=RECOVERY_FACTS[new Date().getDate()%RECOVERY_FACTS.length];
  const isRu=lang==="ru";
  const totalRest=restDaysLog?restDaysLog.length:0;
  const totalSessions=sessions?sessions.length:0;
  const ratio=totalSessions>0?(totalRest/totalSessions).toFixed(1):"—";
  // Calculate consecutive rest day streak (counting backwards from today)
  const getRestStreak=()=>{
    if(!restDaysLog||restDaysLog.length===0)return 0;
    const sorted=[...restDaysLog].sort((a,b)=>new Date(b)-new Date(a));
    let count=0;
    const today=new Date();today.setHours(0,0,0,0);
    for(let i=0;i<sorted.length;i++){
      const expected=new Date(today);expected.setDate(today.getDate()-i);
      const logDate=new Date(sorted[i]);logDate.setHours(0,0,0,0);
      if(logDate.getTime()===expected.getTime())count++;
      else break;
    }
    return count;
  };
  const restStreak=getRestStreak();
  const sectionTitle={fontSize:9.5,color:c.primary,letterSpacing:1.8,textTransform:"uppercase",fontWeight:700,marginBottom:10};
  const recoveryTips=[
    {emoji:"😴",title:isRu?"Сон":"Sleep",desc:isRu?"Старайтесь спать 7-9 часов":"Aim for 7-9 hours"},
    {emoji:"💧",title:isRu?"Гидратация":"Hydration",desc:isRu?"Пейте 2-3 л воды":"Drink 2-3L of water"},
    {emoji:"🥩",title:isRu?"Питание":"Nutrition",desc:isRu?"Ешьте белковую пищу":"Eat protein-rich foods"},
    {emoji:"🧘",title:isRu?"Подвижность":"Mobility",desc:isRu?"Растяжка или миофасциальный релиз":"Stretch or foam roll"}
  ];
  return(<div style={{maxWidth:680,margin:"0 auto"}}>
    <div style={{position:"relative",height:160,borderRadius:18,overflow:"hidden",marginBottom:20,background:c.panelRest}}><div style={{position:"absolute",inset:0,backgroundImage:c.grain,opacity:0.8}}/><div style={{position:"absolute",inset:0,padding:"22px 26px",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}><h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:48,fontWeight:900,color:c.textPrimary,lineHeight:0.95}}>{t.restDay}<span style={{color:c.primary}}>.</span></h1><p style={{fontSize:12.5,color:c.textSecondary,marginTop:7}}>{isRu?"Восстановление — это где происходит магия.":"Recovery is where the magic happens."}</p></div></div>
    {activeWorkout&&(<div style={{background:c.primaryDim,border:`1px solid ${c.primary}33`,borderRadius:12,padding:"15px 18px",marginBottom:16,display:"flex",gap:12,alignItems:"center"}}><span style={{fontSize:22}}>⏱</span><div><p style={{fontSize:14,fontWeight:600,color:c.primary,marginBottom:2}}>{t.workoutActiveMsg}</p><p style={{fontSize:12,color:c.textSecondary}}>{t.workoutActiveSub}</p></div></div>)}
    {todayActivity==="workout"&&!activeWorkout&&(<div style={{background:c.primaryDim,border:`1px solid ${c.primary}33`,borderRadius:12,padding:"15px 18px",marginBottom:16,display:"flex",gap:12,alignItems:"center"}}><span style={{fontSize:22}}>💪</span><div><p style={{fontSize:14,fontWeight:600,color:c.primary,marginBottom:2}}>{t.workoutBlockedMsg}</p><p style={{fontSize:12,color:c.textSecondary}}>{t.workoutBlockedSub}</p></div></div>)}
    <div style={{background:c.card,border:`1px solid ${c.border}`,borderLeft:`3px solid ${c.primary}`,borderRadius:"0 13px 13px 0",padding:"14px 18px",marginBottom:18}}><p style={{fontSize:9.5,color:c.primary,letterSpacing:1.8,textTransform:"uppercase",fontWeight:700,marginBottom:6}}>{t.recoveryInsight}</p><p style={{fontSize:13,color:c.textPrimary,lineHeight:1.8,fontStyle:"italic"}}>"{fact}"</p></div>
    {todayActivity===null&&!activeWorkout&&<button onClick={onLogRest} style={{background:c.primary,color:"#fff",border:"none",borderRadius:13,padding:"13px 38px",fontSize:16,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",cursor:"pointer",boxShadow:`0 4px 16px ${c.primary}44`}}>LOG REST DAY</button>}
    {todayActivity==="rest"&&(<div style={{background:c.successDim,border:`1px solid ${c.success}44`,borderRadius:12,padding:"16px 20px"}}><p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,color:c.success,marginBottom:3}}>✓ {t.loggedState}</p><p style={{fontSize:13,color:c.textSecondary,marginBottom:12}}>{t.streakSafe}</p><div style={{display:"flex",gap:8}}><button onClick={onUndoRest} style={{background:"none",border:`1px solid ${c.border}`,color:c.textSecondary,borderRadius:8,padding:"7px 13px",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{t.undoRest}</button>{onOverrideRest&&<button onClick={onOverrideRest} style={{background:"none",border:`1px solid ${c.primary}44`,color:c.primary,borderRadius:8,padding:"7px 13px",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{isRu?"Тренироваться вместо отдыха":"Switch to Workout"}</button>}</div></div>)}

    {/* Auto Rest Days Toggle */}
    <div style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:13,padding:"16px 18px",marginTop:20,display:"flex",alignItems:"center",justifyContent:"space-between",gap:14}}>
      <div style={{flex:1}}>
        <p style={{fontSize:14,fontWeight:600,color:c.textPrimary,marginBottom:2}}>{isRu?"Авто дни отдыха":"Auto Rest Days"}</p>
        <p style={{fontSize:12,color:c.textSecondary,lineHeight:1.4}}>{isRu?"Автоматически засчитывать пропущенные дни как дни отдыха для защиты вашего стрика.":"Automatically count missed days as rest days to protect your streak."}</p>
      </div>
      <button onClick={()=>setAutoRestEnabled(!autoRestEnabled)} style={{width:42,height:24,borderRadius:12,background:autoRestEnabled?c.primary:c.border,border:"none",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}><div style={{width:18,height:18,borderRadius:9,background:"#fff",position:"absolute",top:3,left:autoRestEnabled?21:3,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/></button>
    </div>

    {/* Rest Day Streak */}
    {restStreak>0&&<div style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:13,padding:"16px 18px",marginTop:14,textAlign:"center"}}>
      <p style={sectionTitle}>{isRu?"СТРИК ОТДЫХА":"REST DAY STREAK"}</p>
      <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:40,fontWeight:900,color:c.primary,lineHeight:1}}>{restStreak}</p>
      <p style={{fontSize:12,color:c.textSecondary,marginTop:4}}>{isRu?`${restStreak===1?"день подряд":restStreak<5?"дня подряд":"дней подряд"}`:`consecutive day${restStreak!==1?"s":""}`}</p>
    </div>}

    {/* Rest Day Stats */}
    <div style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:13,padding:"16px 18px",marginTop:14}}>
      <p style={sectionTitle}>{isRu?"СТАТИСТИКА ОТДЫХА":"REST DAY STATS"}</p>
      <div style={{display:"flex",gap:10}}>
        <div style={{flex:1,background:c.bg,borderRadius:10,padding:"12px 10px",textAlign:"center"}}>
          <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:c.textPrimary}}>{totalRest}</p>
          <p style={{fontSize:11,color:c.textSecondary}}>{isRu?"Дни отдыха":"Rest Days"}</p>
        </div>
        <div style={{flex:1,background:c.bg,borderRadius:10,padding:"12px 10px",textAlign:"center"}}>
          <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:c.textPrimary}}>{streak||0}</p>
          <p style={{fontSize:11,color:c.textSecondary}}>{isRu?"Текущий стрик":"Current Streak"}</p>
        </div>
        <div style={{flex:1,background:c.bg,borderRadius:10,padding:"12px 10px",textAlign:"center"}}>
          <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:c.textPrimary}}>{ratio}</p>
          <p style={{fontSize:11,color:c.textSecondary}}>{isRu?"Отдых/Тренировки":"Rest/Workout"}</p>
        </div>
      </div>
    </div>

    {/* Recovery Tips */}
    <div style={{marginTop:14}}>
      <p style={{...sectionTitle,marginBottom:10}}>{isRu?"СОВЕТЫ ПО ВОССТАНОВЛЕНИЮ":"RECOVERY TIPS"}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {recoveryTips.map((tip,i)=>(
          <div key={i} style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:12,padding:"14px 14px 12px"}}>
            <span style={{fontSize:24,display:"block",marginBottom:6}}>{tip.emoji}</span>
            <p style={{fontSize:13,fontWeight:700,color:c.textPrimary,marginBottom:2}}>{tip.title}</p>
            <p style={{fontSize:11.5,color:c.textSecondary,lineHeight:1.4}}>{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>);
}
