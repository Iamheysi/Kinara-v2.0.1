import { useState, useEffect, useRef } from 'react';
import { DARK, LIGHT, TR, DEFAULT_PLANS, DEFAULT_SCHEDULE } from './constants.js';
import { localDateStr, calcStreak, playBeeps, autoFillRestDays } from './utils.js';
import { LogoMark } from './components/LogoMark.jsx';
import { Toast } from './components/Toast.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Header } from './components/Header.jsx';
import { BottomNav } from './components/BottomNav.jsx';
import { BurgerDrawer } from './components/BurgerDrawer.jsx';
import { SettingsModal } from './components/SettingsModal.jsx';
import { PRModal } from './components/PRModal.jsx';
import { HomeTab } from './components/HomeTab.jsx';
import { PlansTab } from './components/PlansTab.jsx';
import { LogTab } from './components/LogTab.jsx';
import { RestTab } from './components/RestTab.jsx';
import { CalendarTab } from './components/CalendarTab.jsx';
import { ProgressTab } from './components/ProgressTab.jsx';
import { ProfileTab } from './components/ProfileTab.jsx';
import { HelpSupportModal } from './components/HelpSupportModal.jsx';
import { PrivacyPolicy } from './components/PrivacyPolicy.jsx';
import { TermsOfService } from './components/TermsOfService.jsx';
import { AchievementsModal } from './components/AchievementsModal.jsx';
import { OnboardingWizard } from './components/OnboardingWizard.jsx';
import { MilestoneModal } from './components/MilestoneModal.jsx';
import { UpgradePrompt } from './components/UpgradePrompt.jsx';
import { getAchievements } from './utils.js';

const FONTS=`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');`;

function App(){
  const [theme,setTheme]=useState("light");const [lang,setLang]=useState(window.__kinaraGuestLang||"en");
  const [profileName,setProfileName]=useState("My Profile");const [profileBio,setProfileBio]=useState("");const [profileGoal,setProfileGoal]=useState("general");const [profilePhoto,setProfilePhoto]=useState(null);
  const [tab,setTab]=useState("home");const [menuOpen,setMenuOpen]=useState(false);const [settingsOpen,setSettingsOpen]=useState(false);
  const [plans,setPlans]=useState(DEFAULT_PLANS);const [schedule,setSchedule]=useState(DEFAULT_SCHEDULE);
  const [sessions,setSessions]=useState([]);const [restDaysLog,setRestDaysLog]=useState([]);
  const [activeWorkout,setActiveWorkout]=useState(null);const [pendingPlanId,setPendingPlanId]=useState(null);
  const [bannerDismissed,setBannerDismissed]=useState(false);
  const [autoRestEnabled,setAutoRestEnabled]=useState(false);
  const [reminderEnabled,setReminderEnabled]=useState(false);
  const [reminderTime,setReminderTime]=useState("18:00");
  const [showHelp,setShowHelp]=useState(false);
  const [showPrivacy,setShowPrivacy]=useState(false);
  const [showTerms,setShowTerms]=useState(false);
  const [showAchievements,setShowAchievements]=useState(false);
  const [onboardingDone,setOnboardingDone]=useState(false);
  const [showMilestone,setShowMilestone]=useState(null);
  const [showUpgrade,setShowUpgrade]=useState(false);
  const [selectedMonth,setSelectedMonth]=useState(new Date());const [selectedDay,setSelectedDay]=useState(null);
  const [showPR,setShowPR]=useState(null);const [toast,setToast]=useState(null);
  const [dataLoaded,setDataLoaded]=useState(false);
  const fileInputRef=useRef(null);const photoInputRef=useRef(null);const timerRef=useRef(null);

  // ── Load data: prefer Supabase cloud data, fall back to localStorage ──
  useEffect(()=>{
    const cloud=window.__kinaraData||{};
    const hasCloud=Object.keys(cloud).length>0;
    try{
      const saved=hasCloud?cloud:JSON.parse(localStorage.getItem('kinara_v7')||'{}');
      if(Array.isArray(saved.sessions))setSessions(saved.sessions);
      if(Array.isArray(saved.restDaysLog))setRestDaysLog(saved.restDaysLog);
      if(Array.isArray(saved.plans))setPlans(saved.plans);
      if(saved.schedule)setSchedule(saved.schedule);
      if(saved.theme)setTheme(saved.theme);
      if(saved.lang)setLang(saved.lang);
      if(saved.profileName)setProfileName(saved.profileName);
      if(saved.profileBio!==undefined)setProfileBio(saved.profileBio);
      if(saved.profileGoal)setProfileGoal(saved.profileGoal);
      if(saved.profilePhoto!==undefined)setProfilePhoto(saved.profilePhoto);
      if(saved.autoRestEnabled)setAutoRestEnabled(saved.autoRestEnabled);
      if(saved.reminderEnabled)setReminderEnabled(saved.reminderEnabled);
      if(saved.reminderTime)setReminderTime(saved.reminderTime);
      if(saved.onboardingDone)setOnboardingDone(saved.onboardingDone);
    }catch(e){}
    setDataLoaded(true);

    // Background refresh: supabase-auth.js calls this when fresh cloud data
    // arrives after the fast-path mount (returning-user reload).
    window.__kinaraRefresh=(fresh)=>{
      if(!fresh||!Object.keys(fresh).length)return;
      if(Array.isArray(fresh.sessions))setSessions(fresh.sessions);
      if(Array.isArray(fresh.restDaysLog))setRestDaysLog(fresh.restDaysLog);
      if(Array.isArray(fresh.plans))setPlans(fresh.plans);
      if(fresh.schedule)setSchedule(fresh.schedule);
      if(fresh.profileName)setProfileName(fresh.profileName);
      if(fresh.profileBio!==undefined)setProfileBio(fresh.profileBio);
      if(fresh.profileGoal)setProfileGoal(fresh.profileGoal);
      if(fresh.profilePhoto!==undefined)setProfilePhoto(fresh.profilePhoto);
    };
    return ()=>{ delete window.__kinaraRefresh; };
  },[]);

  // ── Save to localStorage on every relevant change ─────────────────────
  useEffect(()=>{
    if(!dataLoaded||window.__kinaraGuest)return;
    try{
      localStorage.setItem('kinara_v7',JSON.stringify({sessions,restDaysLog,plans,schedule,theme,lang,profileName,profileBio,profileGoal,profilePhoto,autoRestEnabled,reminderEnabled,reminderTime,onboardingDone}));
    }catch(e){}
  },[sessions,restDaysLog,plans,schedule,theme,lang,profileName,profileBio,profileGoal,profilePhoto,autoRestEnabled,reminderEnabled,reminderTime,onboardingDone,dataLoaded]);

  // ── Cloud sync to Supabase (debounced via supabase-auth.js) ───────────
  useEffect(()=>{
    if(!dataLoaded||!window.__kinaraSave)return;
    window.__kinaraSave('sessions',sessions);
    window.__kinaraSave('restDays',restDaysLog);
    window.__kinaraSave('plans',plans);
    window.__kinaraSave('schedule',schedule);
    window.__kinaraSave('profile',{profileName,profileBio,profileGoal,profilePhoto,theme,lang});
  },[sessions,restDaysLog,plans,schedule,theme,lang,profileName,profileBio,profileGoal,profilePhoto,dataLoaded]);

  // Auto-fill rest days for gaps when enabled
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(()=>{
    if(!dataLoaded||!autoRestEnabled)return;
    const newRest=autoFillRestDays(sessions,restDaysLog);
    if(newRest.length>0)setRestDaysLog(prev=>[...new Set([...prev,...newRest])]);
  },[dataLoaded,autoRestEnabled]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const c=theme==="dark"?DARK:LIGHT;const t=TR[lang];
  const todayStr=localDateStr();
  const streak=calcStreak(sessions,restDaysLog);
  const todayWorkout=sessions.some(s=>s.date===todayStr);
  const todayRest=restDaysLog.includes(todayStr);
  const todayActivity=todayWorkout?"workout":todayRest?"rest":null;
  const exPRs={};sessions.forEach(s=>s.exercises.forEach(ex=>{const max=Math.max(...ex.sets.map(s2=>parseFloat(s2.weight)||0),0);if(max>0&&(!exPRs[ex.name]||max>exPRs[ex.name]))exPRs[ex.name]=max;}));
  const achievements=getAchievements(sessions,restDaysLog,exPRs);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};
  const exportData=()=>{const d={sessions,plans,restDaysLog,schedule,theme,lang,profileName,profileBio,profileGoal,profilePhoto,exportedAt:new Date().toISOString(),version:"0.7.1"};const blob=new Blob([JSON.stringify(d,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`kinara-backup-${todayStr}.json`;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);};
  const handleImportFile=(e)=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=(ev)=>{try{const d=JSON.parse(ev.target.result);if(Array.isArray(d.sessions))setSessions(d.sessions);if(Array.isArray(d.plans))setPlans(d.plans);if(Array.isArray(d.restDaysLog))setRestDaysLog(d.restDaysLog);if(d.schedule)setSchedule(d.schedule);if(d.theme)setTheme(d.theme);if(d.lang)setLang(d.lang);if(d.profileName)setProfileName(d.profileName);if(d.profileBio!==undefined)setProfileBio(d.profileBio);if(d.profileGoal)setProfileGoal(d.profileGoal);if(d.profilePhoto!==undefined)setProfilePhoto(d.profilePhoto);setMenuOpen(false);setSettingsOpen(false);showToast(t.importOk);}catch{showToast(t.importFail,"error");}};reader.readAsText(file);e.target.value="";};
  // Photo upload is now handled inside ProfileTab with crop preview
  const logRestDay=()=>{if(todayActivity!==null)return;setRestDaysLog(prev=>[...prev,todayStr]);};
  const undoRestDay=()=>setRestDaysLog(prev=>prev.filter(d=>d!==todayStr));
  const deletePlan=(planId)=>{if(activeWorkout?.planId===planId)setActiveWorkout(null);setPlans(p=>p.filter(x=>x.id!==planId));setSchedule(s=>{const ns={...s};Object.keys(ns).forEach(k=>{if(ns[k]===planId)ns[k]=null;});return ns;});showToast("Plan deleted");};
  const selectPlanForWorkout=(planId)=>{setPendingPlanId(planId);setTab("log");};
  const resetProgress=()=>{setSessions([]);setRestDaysLog([]);setActiveWorkout(null);showToast(lang==="ru"?"Прогресс сброшен":"Progress reset");};
  const clearAllData=()=>{setSessions([]);setRestDaysLog([]);setPlans(DEFAULT_PLANS);setSchedule(DEFAULT_SCHEDULE);setProfileName("My Profile");setProfileBio("");setProfileGoal("general");setProfilePhoto(null);setAutoRestEnabled(false);setReminderEnabled(false);setReminderTime("18:00");setActiveWorkout(null);try{localStorage.removeItem('kinara_v7');}catch(e){}showToast(lang==="ru"?"Данные очищены":"All data cleared");};
  const deleteAccount=async()=>{clearAllData();if(window.__kinaraDeleteAccount){try{await window.__kinaraDeleteAccount();}catch(e){}}if(window.__kinaraSignOut)window.__kinaraSignOut();showToast(lang==="ru"?"Аккаунт удалён":"Account deleted");};

  useEffect(()=>{if(activeWorkout&&!activeWorkout.paused){timerRef.current=setInterval(()=>setActiveWorkout(w=>w?{...w,elapsed:w.elapsed+1}:w),1000);}else clearInterval(timerRef.current);return()=>clearInterval(timerRef.current);},[!!activeWorkout,activeWorkout?.paused]);
  useEffect(()=>{if(!activeWorkout?.restTimer||activeWorkout.paused)return;const iv=setInterval(()=>{setActiveWorkout(w=>{if(!w?.restTimer||w.paused)return w;const rem=w.restTimer.remaining-1;if(rem<=0){playBeeps();return{...w,restTimer:null};}return{...w,restTimer:{...w.restTimer,remaining:rem}};});},1000);return()=>clearInterval(iv);},[activeWorkout?.restTimer?.remaining,activeWorkout?.paused]);
  useEffect(()=>{const s=document.createElement("style");s.textContent=FONTS+`body{background:${c.bg};transition:background 0.3s;}`;document.head.appendChild(s);return()=>document.head.removeChild(s);},[theme]);

  const formatTime=s=>`${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const fmtMin=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  const startWorkout=(plan)=>{setActiveWorkout({planId:plan.id,planName:plan.name,elapsed:0,paused:false,warmup:plan.warmup.enabled?{enabled:true,target:plan.warmup.duration,done:false}:{enabled:false,done:true},exercises:plan.exercises.map(ex=>({...ex,sets:Array.from({length:ex.sets},()=>({reps:ex.reps,weight:"",done:false}))})),currentExIdx:0,restTimer:null});setTab("log");};
  const checkSet=(exIdx,setIdx)=>{setActiveWorkout(w=>{if(!w)return w;const exercises=[...w.exercises];const ex={...exercises[exIdx]};const sets=[...ex.sets];sets[setIdx]={...sets[setIdx],done:true};ex.sets=sets;exercises[exIdx]=ex;const allDone=sets.every(s=>s.done);const restTimer=!allDone?{remaining:ex.rest,total:ex.rest,exIdx}:null;const newIdx=allDone&&exIdx<exercises.length-1?exIdx+1:w.currentExIdx;return{...w,exercises,currentExIdx:newIdx,restTimer};});};
  const updateSet=(exIdx,setIdx,field,val)=>{setActiveWorkout(w=>{if(!w)return w;const exercises=[...w.exercises];const ex={...exercises[exIdx]};const sets=[...ex.sets];sets[setIdx]={...sets[setIdx],[field]:val};ex.sets=sets;exercises[exIdx]=ex;return{...w,exercises};});};
  const finishWorkout=()=>{
    if(!activeWorkout)return;
    const prs=[];
    activeWorkout.exercises.forEach(ex=>{const weights=ex.sets.filter(s=>s.done&&s.weight).map(s=>parseFloat(s.weight)||0);if(!weights.length)return;const maxW=Math.max(...weights);const prev=sessions.flatMap(s=>s.exercises).filter(e=>e.name===ex.name).flatMap(e=>e.sets).map(s=>parseFloat(s.weight)||0);if(maxW>(prev.length?Math.max(...prev):0))prs.push({exercise:ex.name,weight:maxW});});
    const session={id:Date.now(),date:todayStr,planName:activeWorkout.planName,duration:activeWorkout.elapsed,exercises:activeWorkout.exercises.map(ex=>({name:ex.name,sets:ex.sets.filter(s=>s.done)})),totalVolume:activeWorkout.exercises.flatMap(ex=>ex.sets.filter(s=>s.done).map(s=>(parseFloat(s.weight)||0)*(parseInt(s.reps)||0))).reduce((a,b)=>a+b,0)};
    setSessions(prev=>{const next=[session,...prev];const count=next.length;if([1,5,10,25,50,100].includes(count))setShowMilestone({type:"workout",count});return next;});setActiveWorkout(null);setPendingPlanId(null);
    if(prs.length)setShowPR(prs);else showToast(t.woSession);
  };
  const allSetsDone=activeWorkout&&activeWorkout.exercises.every(ex=>ex.sets.every(s=>s.done));

  if(!dataLoaded){
    const shimmer={background:"linear-gradient(90deg, #1A1A1E 25%, #252529 50%, #1A1A1E 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite"};
    const sBar={...shimmer,height:14,borderRadius:8,marginBottom:10};
    const sCard={...shimmer,borderRadius:14,minHeight:80};
    return(<div style={{display:"flex",height:"100vh",background:"#0D0D0D",fontFamily:"'DM Sans',sans-serif",overflow:"hidden"}}>
      {/* Sidebar skeleton */}
      <div style={{width:200,background:"#111114",borderRight:"1px solid #1E1E22",padding:"24px 16px",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{...shimmer,width:36,height:36,borderRadius:10,marginBottom:32}}/>
        {Array.from({length:7},(_,i)=>(<div key={i} style={{...sBar,width:`${60+Math.random()*30}%`,height:12}}/>))}
        <div style={{marginTop:"auto"}}><div style={{...shimmer,width:36,height:36,borderRadius:"50%"}}/></div>
      </div>
      {/* Main content skeleton */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{...shimmer,height:48,borderRadius:0,flexShrink:0}}/>
        <div style={{flex:1,padding:"28px 32px",overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:11,marginBottom:16}}>
            {Array.from({length:4},(_,i)=>(<div key={i} style={{...sCard,minHeight:72}}/>))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={{...sCard,minHeight:180}}/>
            <div style={{...sCard,minHeight:180}}/>
          </div>
        </div>
      </div>
    </div>);
  }

  return(<div style={{display:"flex",height:"100vh",background:c.bg,fontFamily:"'DM Sans',sans-serif",color:c.textPrimary,overflow:"hidden",transition:"background 0.3s"}}>
    <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportFile} style={{display:"none"}}/>
    {/* Photo input is now inside ProfileTab with crop preview */}
    <Sidebar tab={tab} setTab={setTab} running={!!activeWorkout} streak={streak} profileName={profileName} profilePhoto={profilePhoto} c={c} t={t} onOpenSettings={()=>setSettingsOpen(true)} onOpenUpgrade={()=>setShowUpgrade(true)}/>
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header running={!!activeWorkout} time={activeWorkout?.elapsed||0} formatTime={formatTime} setTab={setTab} menuOpen={menuOpen} setMenuOpen={setMenuOpen} c={c} t={t}/>
      {window.__kinaraGuest&&(<div style={{background:theme==="dark"?"linear-gradient(to right,rgba(196,130,106,0.12),rgba(196,130,106,0.04))":"linear-gradient(to right,rgba(43,85,204,0.08),rgba(43,85,204,0.02))",borderBottom:`1px solid ${c.primary}22`,padding:"8px 26px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,gap:8}}><p style={{fontSize:12,color:c.textSecondary,flex:1,minWidth:0}}>{lang==="ru"?"Гостевой режим — данные не сохраняются.":"Guest mode — your data will not be saved."} <span style={{color:c.primaryLight}}>{lang==="ru"?"Создайте аккаунт для сохранения.":"Create an account to keep your progress."}</span></p><button onClick={()=>window.__kinaraSignOut?.()} style={{background:c.primary,color:"#fff",border:"none",borderRadius:7,padding:"5px 12px",fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",whiteSpace:"nowrap"}}>{lang==="ru"?"Создать аккаунт":"Sign Up"}</button></div>)}
      {todayActivity===null&&!bannerDismissed&&!activeWorkout&&(<div style={{background:`linear-gradient(to right,${c.primaryDim},transparent)`,borderBottom:`1px solid ${c.primary}22`,padding:"8px 26px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,gap:8}}><p style={{fontSize:12,color:c.textSecondary,flex:1,minWidth:0}}>{t.noActivityToday} <span style={{color:c.primaryLight}}>{t.restStreakNote}</span></p><div style={{display:"flex",gap:7,flexShrink:0}}><button onClick={()=>{logRestDay();setTab("rest");}} style={{background:c.primary,color:"#fff",border:"none",borderRadius:7,padding:"5px 12px",fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",whiteSpace:"nowrap"}}>{t.logRestDay}</button><button onClick={()=>setBannerDismissed(true)} style={{background:"none",border:`1px solid ${c.border}`,color:c.textMuted,borderRadius:7,padding:"5px 9px",fontSize:11.5,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{t.dismiss}</button></div></div>)}
      <div style={{flex:1,overflow:"auto",padding:"28px 32px"}} className="tab-content kb-main-pad" key={tab}>
        {tab==="home"&&<HomeTab c={c} t={t} lang={lang} setTab={setTab} running={!!activeWorkout} sessions={sessions} restDaysLog={restDaysLog} todayActivity={todayActivity} logRestDay={logRestDay} plans={plans} schedule={schedule} setSchedule={setSchedule} onSelectPlan={selectPlanForWorkout} profileName={profileName}/>}
        {tab==="plans"&&<PlansTab c={c} t={t} theme={theme} plans={plans} setPlans={setPlans} onStart={startWorkout} onDeletePlan={deletePlan} showToast={showToast}/>}
        {tab==="log"&&<LogTab c={c} t={t} activeWorkout={activeWorkout} setActiveWorkout={setActiveWorkout} plans={plans} onStart={startWorkout} checkSet={checkSet} updateSet={updateSet} finishWorkout={finishWorkout} allSetsDone={allSetsDone} formatTime={formatTime} fmtMin={fmtMin} todayActivity={todayActivity} defaultPlanId={pendingPlanId}/>}
        {tab==="rest"&&<RestTab c={c} t={t} lang={lang} todayActivity={todayActivity} onLogRest={logRestDay} onUndoRest={undoRestDay} activeWorkout={!!activeWorkout} onOverrideRest={()=>{undoRestDay();setTab("log");}} autoRestEnabled={autoRestEnabled} setAutoRestEnabled={setAutoRestEnabled} restDaysLog={restDaysLog} sessions={sessions} streak={streak}/>}
        {tab==="calendar"&&<CalendarTab c={c} t={t} lang={lang} sessions={sessions} setSessions={setSessions} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedDay={selectedDay} setSelectedDay={setSelectedDay} restDaysLog={restDaysLog}/>}
        {tab==="progress"&&<ProgressTab c={c} t={t} sessions={sessions} lang={lang}/>}
        {tab==="profile"&&<ProfileTab c={c} t={t} lang={lang} sessions={sessions} restDaysLog={restDaysLog} plans={plans} profileName={profileName} setProfileName={setProfileName} profileBio={profileBio} setProfileBio={setProfileBio} profileGoal={profileGoal} setProfileGoal={setProfileGoal} profilePhoto={profilePhoto} setProfilePhoto={setProfilePhoto} photoInputRef={photoInputRef} showToast={showToast} achievements={achievements} onOpenAchievements={()=>setShowAchievements(true)}/>}
      </div>
    </div>
    <BottomNav tab={tab} setTab={setTab} running={!!activeWorkout} c={c} t={t}/>
    <BurgerDrawer open={menuOpen} onClose={()=>setMenuOpen(false)} onOpenSettings={()=>setSettingsOpen(true)} onOpenHelp={()=>setShowHelp(true)} onOpenPrivacy={()=>{setMenuOpen(false);setShowPrivacy(true);}} onOpenTerms={()=>{setMenuOpen(false);setShowTerms(true);}} onOpenAchievements={()=>{setMenuOpen(false);setShowAchievements(true);}} setTab={setTab} streak={streak} profileName={profileName} setProfileName={setProfileName} profilePhoto={profilePhoto} c={c} t={t}/>
    <SettingsModal open={settingsOpen} onClose={()=>setSettingsOpen(false)} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} onExport={exportData} onImport={()=>fileInputRef.current?.click()} autoRestEnabled={autoRestEnabled} setAutoRestEnabled={setAutoRestEnabled} reminderEnabled={reminderEnabled} setReminderEnabled={setReminderEnabled} reminderTime={reminderTime} setReminderTime={setReminderTime} onOpenPrivacy={()=>{setSettingsOpen(false);setShowPrivacy(true);}} onOpenTerms={()=>{setSettingsOpen(false);setShowTerms(true);}} onResetProgress={resetProgress} onClearData={clearAllData} onDeleteAccount={deleteAccount} c={c} t={t}/>
    {showPR&&<PRModal prs={showPR} onClose={()=>setShowPR(null)} c={c} t={t}/>}
    <HelpSupportModal open={showHelp} onClose={()=>setShowHelp(false)} c={c} lang={lang}/>
    <PrivacyPolicy open={showPrivacy} onClose={()=>setShowPrivacy(false)} c={c} lang={lang}/>
    <TermsOfService open={showTerms} onClose={()=>setShowTerms(false)} c={c} lang={lang}/>
    <AchievementsModal open={showAchievements} onClose={()=>setShowAchievements(false)} achievements={achievements} c={c} lang={lang}/>
    {!onboardingDone&&dataLoaded&&profileName==="My Profile"&&sessions.length===0&&<OnboardingWizard c={c} t={t} lang={lang} plans={plans} onComplete={({name,goal,selectedPlanId})=>{setProfileName(name);setProfileGoal(goal);setOnboardingDone(true);showToast(lang==="ru"?"Добро пожаловать!":"Welcome to Kinara!");setTab("home");}}/>}
    {showMilestone&&<MilestoneModal milestone={showMilestone} onClose={()=>setShowMilestone(null)} c={c} lang={lang}/>}
    {showUpgrade&&<UpgradePrompt c={c} lang={lang} onClose={()=>setShowUpgrade(false)}/>}
    <Toast msg={toast?.msg} type={toast?.type} c={c}/>
  </div>);
}

export default App;
