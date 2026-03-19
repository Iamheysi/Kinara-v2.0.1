import { useState } from 'react';
import { Ic } from '../icons.jsx';
import { StatCard } from './StatCard.jsx';
import { calcStreak, calcConsistency, getAchievements, localDateStr } from '../utils.js';

export function ProfileTab({c,t,sessions,restDaysLog,plans,profileName,setProfileName,profileBio,setProfileBio,profileGoal,setProfileGoal,profilePhoto,setProfilePhoto,photoInputRef,showToast}){
  const [editing,setEditing]=useState(false);const [draftName,setDraftName]=useState(profileName);const [draftBio,setDraftBio]=useState(profileBio);const [draftGoal,setDraftGoal]=useState(profileGoal);
  const [showMiniProfile,setShowMiniProfile]=useState(false);
  const [achExpanded,setAchExpanded]=useState(false);
  const [cropPreview,setCropPreview]=useState(null);
  const streak=calcStreak(sessions,restDaysLog);const totalVol=sessions.reduce((a,s)=>a+s.totalVolume,0);
  const exPRs={};sessions.forEach(s=>s.exercises.forEach(ex=>{const max=Math.max(...ex.sets.map(s2=>parseFloat(s2.weight)||0),0);if(max>0&&(!exPRs[ex.name]||max>exPRs[ex.name]))exPRs[ex.name]=max;}));
  const exFreq={};sessions.forEach(s=>s.exercises.forEach(ex=>{exFreq[ex.name]=(exFreq[ex.name]||0)+1;}));
  const topEx=Object.entries(exFreq).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const consistency=calcConsistency(sessions);const achievements=getAchievements(sessions,restDaysLog,exPRs);const earned=achievements.filter(a=>a.earned);
  const saveEdit=()=>{setProfileName(draftName||profileName);setProfileBio(draftBio);setProfileGoal(draftGoal);setEditing(false);if(showToast)showToast(t.saveProfile+"!");};
  const goalOpts=[{v:"strength",l:t.goalStrength},{v:"hypertrophy",l:t.goalHypertrophy},{v:"fatLoss",l:t.goalFatLoss},{v:"endurance",l:t.goalEndurance},{v:"general",l:t.goalGeneral}];
  const goalLabel=goalOpts.find(g=>g.v===profileGoal)?.l||t.goalGeneral;
  const initials=profileName.trim().split(" ").map(w=>w[0]?.toUpperCase()||"").join("").slice(0,2);
  const now=new Date();const heatDays=Array.from({length:84},(_,i)=>{const d=new Date(now);d.setDate(now.getDate()-(83-i));const ds=localDateStr(d);return{ds,isW:sessions.some(s=>s.date===ds),isR:restDaysLog.includes(ds)};});
  const recentInt=sessions.slice(0,8).reverse().map(s=>s.totalVolume/Math.max(s.duration/60,1));
  const maxInt=Math.max(...recentInt,1);

  // Photo crop preview handler
  const handlePhotoPreview=(e)=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const img=new Image();
      img.onload=()=>{
        const canvas=document.createElement("canvas");
        canvas.width=240;canvas.height=240;
        const ctx=canvas.getContext("2d");
        const sz=Math.min(img.width,img.height);
        const sx=(img.width-sz)/2,sy=(img.height-sz)/2;
        ctx.drawImage(img,sx,sy,sz,sz,0,0,240,240);
        setCropPreview(canvas.toDataURL("image/jpeg",0.82));
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);e.target.value="";
  };
  const confirmCrop=()=>{if(cropPreview){setProfilePhoto(cropPreview);setCropPreview(null);}};
  const cancelCrop=()=>setCropPreview(null);

  return(<div style={{maxWidth:900}}>
    {/* Crop Preview Modal */}
    {cropPreview&&(<div onClick={cancelCrop} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:600,backdropFilter:"blur(6px)",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:c.card,border:`1px solid ${c.borderMid}`,borderRadius:20,padding:"28px 24px",width:340,maxWidth:"100%",textAlign:"center"}}>
        <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,color:c.textPrimary,marginBottom:16}}>{t.uploadPhoto}</p>
        <div style={{width:160,height:160,borderRadius:"50%",overflow:"hidden",margin:"0 auto 20px",border:`3px solid ${c.primary}`,boxShadow:`0 4px 20px ${c.primary}33`}}>
          <img src={cropPreview} alt="Preview" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button onClick={cancelCrop} style={{background:c.surface,color:c.textSecondary,border:`1px solid ${c.border}`,borderRadius:9,padding:"9px 20px",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{t.cancelWorkout}</button>
          <button onClick={confirmCrop} style={{background:c.primary,color:"#fff",border:"none",borderRadius:9,padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6}}>{Ic.check} {t.saveProfile}</button>
        </div>
      </div>
    </div>)}

    {/* Mini-Profile Widget */}
    {showMiniProfile&&(<div onClick={()=>setShowMiniProfile(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:500,backdropFilter:"blur(3px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:80,left:32,background:c.card,border:`1px solid ${c.borderMid}`,borderRadius:16,padding:"20px 22px",width:280,boxShadow:"0 12px 40px rgba(0,0,0,0.25)",animation:"fadeUp .2s ease"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
          <div style={{width:52,height:52,borderRadius:14,background:profilePhoto?`url(${profilePhoto}) center/cover`:`linear-gradient(135deg,${c.primary},${c.primaryLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,color:"#fff",border:`2px solid ${c.border}`,flexShrink:0}}>{!profilePhoto&&(initials||<span style={{opacity:0.7}}>{Ic.user}</span>)}</div>
          <div><p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,color:c.textPrimary,lineHeight:1.1}}>{profileName}</p>{window.__kinaraUserEmail&&<p style={{fontSize:10,color:c.textMuted,marginTop:3}}>{window.__kinaraUserEmail}</p>}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
          {[{l:t.currentStreak,v:`${streak}`,u:t.days},{l:t.totalWorkouts,v:`${sessions.length}`,u:t.allTime},{l:t.achievements,v:`${earned.length}/${achievements.length}`,u:""}].map(s=>(<div key={s.l} style={{textAlign:"center",background:c.bg,borderRadius:8,padding:"8px 4px"}}><p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:900,color:c.primary}}>{s.v}</p><p style={{fontSize:9,color:c.textMuted,marginTop:2}}>{s.l}</p></div>))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          <button onClick={()=>{setShowMiniProfile(false);setDraftName(profileName);setDraftBio(profileBio);setDraftGoal(profileGoal);setEditing(true);}} style={{width:"100%",background:c.surface,border:`1px solid ${c.border}`,borderRadius:8,padding:"8px 12px",fontSize:12,color:c.textPrimary,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left",display:"flex",alignItems:"center",gap:8}}>{Ic.edit} {t.editProfile}</button>
          <button onClick={()=>{setShowMiniProfile(false);setAchExpanded(true);}} style={{width:"100%",background:c.surface,border:`1px solid ${c.border}`,borderRadius:8,padding:"8px 12px",fontSize:12,color:c.textPrimary,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left",display:"flex",alignItems:"center",gap:8}}>{Ic.trophy} {t.achievements}</button>
        </div>
      </div>
    </div>)}

    {/* Profile Header Card */}
    <div className="kb-prof-top" onClick={()=>!editing&&setShowMiniProfile(true)} style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:20,padding:"24px 28px",marginBottom:18,display:"grid",gridTemplateColumns:"auto 1fr auto",gap:24,alignItems:"start",boxShadow:"0 2px 12px rgba(0,0,0,0.07)",cursor:editing?"default":"pointer",transition:"box-shadow 0.2s"}}>
      <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}><div style={{width:88,height:88,borderRadius:22,background:profilePhoto?`url(${profilePhoto}) center/cover`:`linear-gradient(135deg,${c.primary},${c.primaryLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:30,fontWeight:900,color:"#fff",border:`3px solid ${c.border}`}}>{!profilePhoto&&(initials||<span style={{opacity:0.7}}>{Ic.user}</span>)}</div><input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoPreview} style={{display:"none"}}/><button onClick={()=>photoInputRef.current?.click()} style={{position:"absolute",bottom:-6,right:-6,width:28,height:28,borderRadius:"50%",background:c.primary,border:`2px solid ${c.surface}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}>{Ic.camera}</button></div>
      <div onClick={e=>editing&&e.stopPropagation()}>{editing?(<div style={{display:"flex",flexDirection:"column",gap:8}}><input value={draftName} onChange={e=>setDraftName(e.target.value)} style={{background:c.inputBg,border:`1px solid ${c.primary}`,borderRadius:8,padding:"7px 11px",color:c.textPrimary,fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900}}/><textarea value={draftBio} onChange={e=>setDraftBio(e.target.value)} placeholder={t.bio+"…"} rows={2} style={{background:c.inputBg,border:`1px solid ${c.border}`,borderRadius:8,padding:"7px 11px",color:c.textPrimary,fontSize:12.5,fontFamily:"'DM Sans',sans-serif",resize:"none"}}/><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{goalOpts.map(g=>(<button key={g.v} onClick={()=>setDraftGoal(g.v)} style={{padding:"5px 11px",borderRadius:20,border:`1.5px solid ${draftGoal===g.v?c.primary:c.border}`,background:draftGoal===g.v?c.primaryDim:"transparent",color:draftGoal===g.v?c.primary:c.textSecondary,fontSize:11.5,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:draftGoal===g.v?600:400}}>{g.l}</button>))}</div></div>):(<><p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:900,color:c.textPrimary,lineHeight:1,marginBottom:4}}>{profileName}</p>{profileBio&&<p style={{fontSize:13,color:c.textSecondary,marginBottom:8,lineHeight:1.6}}>{profileBio}</p>}<span style={{display:"inline-block",padding:"4px 12px",borderRadius:20,background:c.primaryDim,border:`1px solid ${c.primary}33`,color:c.primary,fontSize:11.5,fontWeight:600}}>{goalLabel}</span></>)}</div>
      <div onClick={e=>e.stopPropagation()}>{editing?(<button onClick={saveEdit} style={{background:c.primary,color:"#fff",border:"none",borderRadius:9,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6}}>{Ic.save} {t.saveProfile}</button>):(<button onClick={()=>{setDraftName(profileName);setDraftBio(profileBio);setDraftGoal(profileGoal);setEditing(true);}} style={{background:c.surface,color:c.textSecondary,border:`1px solid ${c.border}`,borderRadius:9,padding:"9px 16px",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6}}>{Ic.edit} {t.editProfile}</button>)}</div>
    </div>

    {/* Stats Row — replaced AVG INTENSITY with Total Volume */}
    <div className="kb-prof-stats kb-stat5" style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:11,marginBottom:18}}>
      {[{l:t.currentStreak,v:String(streak),u:t.days,a:c.primary,info:t.streakInfo},{l:t.totalWorkouts,v:String(sessions.length),u:t.allTime,a:c.textPrimary,info:t.totalWorkoutsInfo},{l:t.personalRecords,v:String(Object.keys(exPRs).length),u:t.set,a:c.primary,info:t.prInfo},{l:t.totalVolLabel||"Total Volume",v:totalVol>1000?`${(totalVol/1000).toFixed(1)}t`:`${Math.round(totalVol)}kg`,u:t.allTime,a:c.gold,info:t.volumeInfo},{l:t.consistency,v:`${consistency}%`,u:t.last8wks||"last 8 wks",a:c.success,info:t.consistencyInfo}].map(s=>(<StatCard key={s.l} label={s.l} value={s.v} unit={s.u} accent={s.a} info={s.info} c={c}/>))}
    </div>

    {/* Heatmap and Volume Trend */}
    <div className="kb-prof-heat" style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:14,marginBottom:14}}>
      <div style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:14,padding:"18px 20px"}}>
        <p style={{fontSize:13,fontWeight:600,color:c.textPrimary,marginBottom:12}}>{t.activityLast12||"Activity — Last 12 Weeks"}</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(12,1fr)",gap:3}}>{Array.from({length:12},(_,wk)=>(<div key={wk} style={{display:"flex",flexDirection:"column",gap:3}}>{Array.from({length:7},(_,dow)=>{const idx=wk*7+dow;const day=heatDays[idx];if(!day)return<div key={dow} style={{width:"100%",aspectRatio:"1"}}/>;return(<div key={dow} title={day.ds} style={{width:"100%",aspectRatio:"1",borderRadius:3,background:day.isW?c.primary:day.isR?c.purple:c.border,opacity:day.isW?1:day.isR?0.6:0.25,transition:"opacity 0.15s"}}/>);})}</div>))}</div>
        <div style={{display:"flex",gap:14,marginTop:12}}><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:2,background:c.primary}}/><span style={{fontSize:10.5,color:c.textSecondary}}>{t.workout}</span></div><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:2,background:c.purple}}/><span style={{fontSize:10.5,color:c.textSecondary}}>{t.rest}</span></div></div>
      </div>
      <div style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:14,padding:"18px 20px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
        <div>
          <p style={{fontSize:9.5,color:c.textMuted,letterSpacing:1.7,textTransform:"uppercase",fontWeight:700,marginBottom:10}}>{t.totalVolLabel||"Total Volume"}</p>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
            <div><div style={{display:"flex",alignItems:"baseline",gap:5}}><p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:50,fontWeight:900,color:c.gold,lineHeight:1}}>{totalVol>1000?`${(totalVol/1000).toFixed(1)}`:totalVol>0?Math.round(totalVol):"—"}</p>{totalVol>0&&<p style={{fontSize:12,color:c.textMuted,marginBottom:3}}>{totalVol>1000?"t":"kg"}</p>}</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}><span style={{fontSize:11,color:c.textMuted}}>{sessions.length} {t.totalWorkouts?.toLowerCase?.()?.includes("тренировк")?"тренировок":"sessions"}</span></div></div>
            {recentInt.length>1&&(()=>{const sparkPts=recentInt.map((v,i)=>{const x=4+(i/(recentInt.length-1))*72;const y=32-(v/maxInt)*28;return`${x},${y}`;}).join(" ");const lastDot={x:4+72,y:32-(recentInt[recentInt.length-1]/maxInt)*28};return(<svg viewBox="0 0 80 36" width="88" height="40" style={{flexShrink:0}}><defs><linearGradient id="spGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={c.gold} stopOpacity="0.3"/><stop offset="100%" stopColor={c.gold} stopOpacity="1"/></linearGradient></defs><polyline points={sparkPts} fill="none" stroke="url(#spGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx={lastDot.x} cy={lastDot.y} r="3" fill={c.gold}/><circle cx={lastDot.x} cy={lastDot.y} r="5.5" fill={c.gold} opacity="0.2"/></svg>);})()}
          </div>
        </div>
        <div style={{height:1,background:c.border,marginTop:14,marginBottom:10}}/>
        <p style={{fontSize:10.5,color:c.textMuted,lineHeight:1.5}}>{t.volumeInfo}</p>
      </div>
    </div>

    {/* Top Exercises and Achievements */}
    <div className="kb-prof-bottom" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:14,padding:"18px 20px"}}>
        <p style={{fontSize:13,fontWeight:600,color:c.textPrimary,marginBottom:14}}>{t.topExercises||"Top Exercises"}</p>
        {topEx.length===0?<p style={{fontSize:12,color:c.textMuted}}>{t.noData}</p>:topEx.map(([name,cnt],i)=>(<div key={name} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><span style={{width:20,textAlign:"center",fontSize:i<3?14:12,flexShrink:0}}>{"🥇🥈🥉🏅🏅"[i]}</span><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12.5,color:c.textPrimary}}>{name}</span><span style={{fontSize:11,color:c.textMuted,fontFamily:"'JetBrains Mono',monospace"}}>{cnt}×</span></div><div style={{height:3,background:c.border,borderRadius:2}}><div style={{height:"100%",width:`${(cnt/(topEx[0]?.[1]||1))*100}%`,background:i<3?c.primary:`${c.primary}50`,borderRadius:2}}/></div></div></div>))}
      </div>

      {/* Achievements — expandable */}
      <div style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:14,padding:"18px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <p style={{fontSize:13,fontWeight:600,color:c.textPrimary}}>{t.achievements}</p>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:11,color:c.textSecondary}}>{earned.length}/{achievements.length}</span>
            <button onClick={()=>setAchExpanded(!achExpanded)} style={{background:"none",border:"none",cursor:"pointer",color:c.textMuted,display:"flex",alignItems:"center",padding:2}}>{achExpanded?Ic.chevUp:Ic.chevDown}</button>
          </div>
        </div>

        {!achExpanded?(
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>{achievements.map(a=>(<div key={a.id} title={`${a.label}: ${a.desc}`} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,opacity:a.earned?1:0.25,cursor:"default"}}><div style={{width:40,height:40,borderRadius:11,background:a.earned?c.primaryDim:c.border,border:`1px solid ${a.earned?c.primary+"44":c.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{a.icon}</div><p style={{fontSize:8.5,color:a.earned?c.textSecondary:c.textMuted,textAlign:"center",lineHeight:1.2}}>{a.label}</p></div>))}</div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {achievements.map(a=>(<div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:a.earned?c.primaryDim:c.bg,borderRadius:10,border:`1px solid ${a.earned?c.primary+"33":c.border}`,opacity:a.earned?1:0.6}}>
              <div style={{width:42,height:42,borderRadius:11,background:a.earned?c.primaryDim:c.border,border:`1px solid ${a.earned?c.primary+"44":c.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{a.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <p style={{fontSize:13,fontWeight:600,color:a.earned?c.textPrimary:c.textMuted}}>{a.label}</p>
                  {a.earned&&<span style={{fontSize:9,color:c.success,fontWeight:700,background:c.successDim,padding:"2px 7px",borderRadius:10}}>Earned</span>}
                </div>
                <p style={{fontSize:11,color:c.textSecondary,marginBottom:4}}>{a.desc}</p>
                {a.target>0&&(<div style={{height:3,background:c.border,borderRadius:2}}><div style={{height:"100%",width:`${Math.min((a.current/a.target)*100,100)}%`,background:a.earned?c.success:c.primary,borderRadius:2,transition:"width 0.3s"}}/></div>)}
                {a.target>0&&<p style={{fontSize:9.5,color:c.textMuted,marginTop:3}}>{a.current}/{a.target}</p>}
              </div>
            </div>))}
          </div>
        )}
      </div>
    </div>
  </div>);
}
