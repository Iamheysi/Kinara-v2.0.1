import { RECOVERY_FACTS } from '../constants.js';
import { KIcon } from '../brandedIcons.jsx';
import { sickDaysUsedLast30, MAX_SICK_DAYS_PER_30 } from '../utils.js';

export function RestTab({c,t,lang,todayActivity,onLogRest,onUndoRest,onLogSick,onUndoSick,sickDaysLog=[],schedule={},activeWorkout,onOverrideRest,autoRestEnabled,setAutoRestEnabled,restDaysLog,sessions,streak}){
  const fact=RECOVERY_FACTS[new Date().getDate()%RECOVERY_FACTS.length];
  const isRu=lang==="ru";
  const totalRest=restDaysLog?restDaysLog.length:0;
  const totalSessions=sessions?sessions.length:0;
  const ratio=totalSessions>0?(totalRest/totalSessions).toFixed(1):"—";
  const sickUsed=sickDaysUsedLast30(sickDaysLog);
  const sickRemaining=MAX_SICK_DAYS_PER_30-sickUsed;
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
    {icon:<KIcon.moon color={c.textSecondary} size={22}/>,title:isRu?"Сон":"Sleep",desc:isRu?"Старайтесь спать 7-9 часов":"Aim for 7-9 hours"},
    {icon:<KIcon.heart color={c.textSecondary} size={22}/>,title:isRu?"Гидратация":"Hydration",desc:isRu?"Пейте 2-3 л воды":"Drink 2-3L of water"},
    {icon:<KIcon.dumbbell color={c.textSecondary} size={22}/>,title:isRu?"Питание":"Nutrition",desc:isRu?"Ешьте белковую пищу":"Eat protein-rich foods"},
    {icon:<KIcon.lotus color={c.textSecondary} size={22}/>,title:isRu?"Подвижность":"Mobility",desc:isRu?"Растяжка или миофасциальный релиз":"Stretch or foam roll"}
  ];
  return(<div style={{maxWidth:680,margin:"0 auto"}}>
    <div style={{position:"relative",height:160,borderRadius:18,overflow:"hidden",marginBottom:20,background:c.panelRest}}><div style={{position:"absolute",inset:0,backgroundImage:c.grain,opacity:0.8}}/><div style={{position:"absolute",inset:0,padding:"22px 26px",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}><h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:48,fontWeight:900,color:c.textPrimary,lineHeight:0.95}}>{t.restDay}<span style={{color:c.primary}}>.</span></h1><p style={{fontSize:12.5,color:c.textSecondary,marginTop:7}}>{isRu?"Восстановление — это где происходит магия.":"Recovery is where the magic happens."}</p></div></div>
    {activeWorkout&&(<div style={{background:c.primaryDim,border:`1px solid ${c.primary}33`,borderRadius:12,padding:"15px 18px",marginBottom:16,display:"flex",gap:12,alignItems:"center"}}><KIcon.fire color={c.primary} size={22}/><div><p style={{fontSize:14,fontWeight:600,color:c.primary,marginBottom:2}}>{t.workoutActiveMsg}</p><p style={{fontSize:12,color:c.textSecondary}}>{t.workoutActiveSub}</p></div></div>)}
    {todayActivity==="workout"&&!activeWorkout&&(<div style={{background:c.primaryDim,border:`1px solid ${c.primary}33`,borderRadius:12,padding:"15px 18px",marginBottom:16,display:"flex",gap:12,alignItems:"center"}}><KIcon.dumbbell color={c.primary} size={22}/><div><p style={{fontSize:14,fontWeight:600,color:c.primary,marginBottom:2}}>{t.workoutBlockedMsg}</p><p style={{fontSize:12,color:c.textSecondary}}>{t.workoutBlockedSub}</p></div></div>)}
    <div style={{background:c.card,border:`1px solid ${c.border}`,borderLeft:`3px solid ${c.primary}`,borderRadius:"0 13px 13px 0",padding:"14px 18px",marginBottom:18}}><p style={{fontSize:9.5,color:c.primary,letterSpacing:1.8,textTransform:"uppercase",fontWeight:700,marginBottom:6}}>{t.recoveryInsight}</p><p style={{fontSize:13,color:c.textPrimary,lineHeight:1.8,fontStyle:"italic"}}>"{fact}"</p></div>

    {/* Action buttons */}
    {todayActivity===null&&!activeWorkout&&(
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <button onClick={onLogRest} style={{background:c.primary,color:"#fff",border:"none",borderRadius:13,padding:"13px 32px",fontSize:16,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",cursor:"pointer",boxShadow:`0 4px 16px ${c.primary}44`,flex:1,minWidth:160}}>
          {isRu?"ДЕНЬ ОТДЫХА":"LOG REST DAY"}
        </button>
        {onLogSick&&(
          <button onClick={onLogSick} disabled={sickRemaining<=0} style={{
            background:"none",border:`1.5px solid ${sickRemaining>0?c.border:c.border}`,
            color:sickRemaining>0?c.textSecondary:c.textMuted,
            borderRadius:13,padding:"13px 20px",fontSize:14,fontWeight:600,
            fontFamily:"'DM Sans',sans-serif",cursor:sickRemaining>0?"pointer":"not-allowed",
            display:"flex",alignItems:"center",gap:8,opacity:sickRemaining>0?1:0.5,
          }}>
            <KIcon.sick color={sickRemaining>0?c.textSecondary:c.textMuted} size={18}/>
            {isRu?"Больничный":"Sick Day"}
            <span style={{fontSize:11,color:c.textMuted,fontWeight:400}}>({sickRemaining}/{MAX_SICK_DAYS_PER_30})</span>
          </button>
        )}
      </div>
    )}

    {todayActivity==="rest"&&(<div style={{background:c.successDim,border:`1px solid ${c.success}44`,borderRadius:12,padding:"16px 20px"}}><p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,color:c.success,marginBottom:3}}>✓ {t.loggedState}</p><p style={{fontSize:13,color:c.textSecondary,marginBottom:12}}>{t.streakSafe}</p><div style={{display:"flex",gap:8}}><button onClick={onUndoRest} style={{background:"none",border:`1px solid ${c.border}`,color:c.textSecondary,borderRadius:8,padding:"7px 13px",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{t.undoRest}</button>{onOverrideRest&&<button onClick={onOverrideRest} style={{background:"none",border:`1px solid ${c.primary}44`,color:c.primary,borderRadius:8,padding:"7px 13px",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{isRu?"Тренироваться вместо отдыха":"Switch to Workout"}</button>}</div></div>)}

    {todayActivity==="sick"&&(<div style={{background:`${c.gold}12`,border:`1px solid ${c.gold}33`,borderRadius:12,padding:"16px 20px",marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
        <KIcon.sick color={c.gold} size={22}/>
        <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,color:c.gold}}>{isRu?"Больничный день":"Sick Day Logged"}</p>
      </div>
      <p style={{fontSize:13,color:c.textSecondary,marginBottom:12}}>{isRu?"Серия защищена. Выздоравливайте!":"Streak protected. Get well soon!"}</p>
      <button onClick={onUndoSick} style={{background:"none",border:`1px solid ${c.border}`,color:c.textSecondary,borderRadius:8,padding:"7px 13px",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{isRu?"Отменить":"Undo"}</button>
    </div>)}

    {/* Streak explanation */}
    <div style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:13,padding:"14px 18px",marginTop:16,marginBottom:4}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
        <KIcon.shield color={c.primary} size={18}/>
        <p style={{fontSize:12,fontWeight:700,color:c.primary,letterSpacing:0.5}}>{isRu?"КАК РАБОТАЕТ СТРИК":"HOW STREAKS WORK"}</p>
      </div>
      <p style={{fontSize:12,color:c.textSecondary,lineHeight:1.6}}>{isRu
        ?"Стрик считает дни, когда вы следуете своему расписанию. Свободные дни не ломают стрик. Допускается до 2 пропусков в неделю. Больничные дни (до 3 за 30 дней) также защищают стрик."
        :"Your streak counts consecutive days following your schedule. Free days don't break it. Up to 2 missed workout days per week are tolerated. Sick days (up to 3 per 30 days) also protect your streak."
      }</p>
    </div>

    {/* Auto Rest Days Toggle */}
    <div style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:13,padding:"16px 18px",marginTop:14,display:"flex",alignItems:"center",justifyContent:"space-between",gap:14}}>
      <div style={{flex:1}}>
        <p style={{fontSize:14,fontWeight:600,color:c.textPrimary,marginBottom:2}}>{isRu?"Авто дни отдыха":"Auto Rest Days"}</p>
        <p style={{fontSize:12,color:c.textSecondary,lineHeight:1.4}}>{isRu?"Автоматически засчитывать пропущенные дни как дни отдыха.":"Automatically count missed days as rest days."}</p>
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
          <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:c.textPrimary}}>{sickDaysLog.length}</p>
          <p style={{fontSize:11,color:c.textSecondary}}>{isRu?"Больничные":"Sick Days"}</p>
        </div>
      </div>
    </div>

    {/* Recovery Tips */}
    <div style={{marginTop:14}}>
      <p style={{...sectionTitle,marginBottom:10}}>{isRu?"СОВЕТЫ ПО ВОССТАНОВЛЕНИЮ":"RECOVERY TIPS"}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {recoveryTips.map((tip,i)=>(
          <div key={i} style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:12,padding:"14px 14px 12px"}}>
            <div style={{marginBottom:6}}>{tip.icon}</div>
            <p style={{fontSize:13,fontWeight:700,color:c.textPrimary,marginBottom:2}}>{tip.title}</p>
            <p style={{fontSize:11.5,color:c.textSecondary,lineHeight:1.4}}>{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>);
}
