import { useState } from 'react';
import { Ic } from '../icons.jsx';

export function SettingsModal({open,onClose,theme,setTheme,lang,setLang,onExport,onImport,autoRestEnabled,setAutoRestEnabled,reminderEnabled,setReminderEnabled,reminderTime,setReminderTime,onOpenPrivacy,onOpenTerms,onResetProgress,onClearData,onDeleteAccount,c,t}){
  const [confirmReset,setConfirmReset]=useState(null); // "reset"|"clear"|"delete"
  if(!open)return null;
  const isRu=lang==="ru";
  const Row=({icon,label,opts,cur,onChange})=>(<div style={{background:c.surface,border:`1px solid ${c.border}`,borderRadius:11,padding:"13px 15px",marginBottom:10}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:11}}><span style={{color:c.primary}}>{icon}</span><span style={{fontSize:13,fontWeight:500,color:c.textPrimary}}>{label}</span></div><div style={{display:"flex",gap:6}}>{opts.map(o=>(<button key={o.v} onClick={()=>onChange(o.v)} style={{flex:1,padding:"8px 6px",borderRadius:8,border:`1.5px solid ${cur===o.v?c.primary:c.border}`,background:cur===o.v?c.primaryDim:"transparent",color:cur===o.v?c.primary:c.textSecondary,fontSize:12.5,fontWeight:cur===o.v?600:400,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all 0.18s"}}>{o.l}</button>))}</div></div>);
  const Toggle=({icon,label,desc,checked,onChange})=>(<div style={{background:c.surface,border:`1px solid ${c.border}`,borderRadius:11,padding:"13px 15px",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}><span style={{color:c.primary,flexShrink:0}}>{icon}</span><div><p style={{fontSize:13,fontWeight:500,color:c.textPrimary}}>{label}</p>{desc&&<p style={{fontSize:10.5,color:c.textMuted,marginTop:2}}>{desc}</p>}</div></div><button onClick={()=>onChange(!checked)} style={{width:42,height:24,borderRadius:12,background:checked?c.primary:c.border,border:"none",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}><div style={{width:18,height:18,borderRadius:9,background:"#fff",position:"absolute",top:3,left:checked?21:3,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/></button></div>);

  const DangerBtn=({label,sub,action,confirmKey})=>{
    const isConfirming=confirmReset===confirmKey;
    return(<div style={{marginBottom:7}}>
      {!isConfirming?(<button onClick={()=>setConfirmReset(confirmKey)} style={{width:"100%",background:"transparent",border:"1px solid rgba(176,80,80,0.25)",borderRadius:11,padding:"11px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,textAlign:"left",fontFamily:"'DM Sans',sans-serif",transition:"border-color 0.2s"}}>
        <div style={{width:30,height:30,borderRadius:8,background:"rgba(176,80,80,0.08)",display:"flex",alignItems:"center",justifyContent:"center",color:"#B05050",flexShrink:0}}>{Ic.trash}</div>
        <div><p style={{fontSize:13,fontWeight:500,color:"#B05050",margin:0}}>{label}</p><p style={{fontSize:10.5,color:c.textMuted,margin:0}}>{sub}</p></div>
      </button>):(<div style={{background:"rgba(176,80,80,0.06)",border:"1px solid rgba(176,80,80,0.3)",borderRadius:11,padding:"12px 14px"}}>
        <p style={{fontSize:12,color:"#B05050",fontWeight:600,marginBottom:8}}>{isRu?"Вы уверены? Это действие необратимо.":"Are you sure? This action cannot be undone."}</p>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{action();setConfirmReset(null);onClose();}} style={{background:"#B05050",color:"#fff",border:"none",borderRadius:8,padding:"7px 16px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{isRu?"Да, подтверждаю":"Yes, confirm"}</button>
          <button onClick={()=>setConfirmReset(null)} style={{background:c.surface,color:c.textSecondary,border:`1px solid ${c.border}`,borderRadius:8,padding:"7px 14px",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{isRu?"Отмена":"Cancel"}</button>
        </div>
      </div>)}
    </div>);
  };

  return(<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,backdropFilter:"blur(6px)",padding:"16px"}}><div onClick={e=>e.stopPropagation()} style={{background:c.card,border:`1px solid ${c.borderMid}`,borderRadius:20,padding:"28px 24px",width:420,maxWidth:"100%",boxShadow:"0 24px 60px rgba(0,0,0,0.4)",maxHeight:"90vh",overflow:"auto"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}><p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:c.textPrimary}}>{t.settings}</p><button onClick={onClose} style={{background:"none",border:`1px solid ${c.border}`,color:c.textSecondary,borderRadius:7,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{Ic.close}</button></div>

    <p style={{fontSize:9.5,color:c.textMuted,letterSpacing:1.8,fontWeight:700,textTransform:"uppercase",marginBottom:9,paddingLeft:2}}>{t.appearance}</p>
    <Row icon={theme==="dark"?Ic.moon:Ic.sun} label={t.theme} opts={[{v:"light",l:t.light},{v:"dark",l:t.dark}]} cur={theme} onChange={setTheme}/>
    <Row icon={Ic.globe} label={t.language} opts={[{v:"en",l:t.english},{v:"ru",l:t.russian}]} cur={lang} onChange={setLang}/>

    <div style={{height:1,background:c.border,margin:"14px 0"}}/>
    <p style={{fontSize:9.5,color:c.textMuted,letterSpacing:1.8,fontWeight:700,textTransform:"uppercase",marginBottom:9,paddingLeft:2}}>{t.data}</p>
    {[[Ic.exportI,t.exportData,isRu?"Скачать сессии и планы в JSON":"Download sessions & plans as JSON",onExport],[Ic.importI,t.importData,isRu?"Восстановить из резервной копии":"Restore from a Kinara backup file",onImport]].map(([icon,label,sub,fn])=>(<button key={label} onClick={fn} style={{width:"100%",background:c.surface,border:`1px solid ${c.border}`,borderRadius:11,padding:"11px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,marginBottom:7,textAlign:"left",fontFamily:"'DM Sans',sans-serif"}}><div style={{width:30,height:30,borderRadius:8,background:c.primaryDim,display:"flex",alignItems:"center",justifyContent:"center",color:c.primary,flexShrink:0}}>{icon}</div><div><p style={{fontSize:13,fontWeight:500,color:c.textPrimary,margin:0}}>{label}</p><p style={{fontSize:10.5,color:c.textSecondary,margin:0}}>{sub}</p></div></button>))}

    <div style={{height:1,background:c.border,margin:"14px 0"}}/>
    <p style={{fontSize:9.5,color:c.textMuted,letterSpacing:1.8,fontWeight:700,textTransform:"uppercase",marginBottom:9,paddingLeft:2}}>{t.reminders}</p>
    <Toggle icon={Ic.bell} label={isRu?"Напоминание о тренировке":"Workout Reminder"} desc={isRu?"Уведомление в выбранное время":"Daily notification at your chosen time"} checked={reminderEnabled} onChange={setReminderEnabled}/>
    {reminderEnabled&&(<div style={{background:c.surface,border:`1px solid ${c.border}`,borderRadius:11,padding:"10px 15px",marginBottom:10,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:12,color:c.textSecondary}}>{isRu?"Время:":"Time:"}</span><input type="time" value={reminderTime} onChange={e=>setReminderTime(e.target.value)} style={{background:c.inputBg,border:`1px solid ${c.border}`,borderRadius:6,padding:"4px 8px",color:c.textPrimary,fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}/><span style={{fontSize:10,color:c.primary,flex:1,fontWeight:500}}>{isRu?"Настроено":"Scheduled"} ✓</span></div>)}

    <div style={{height:1,background:c.border,margin:"14px 0"}}/>
    <p style={{fontSize:9.5,color:c.textMuted,letterSpacing:1.8,fontWeight:700,textTransform:"uppercase",marginBottom:9,paddingLeft:2}}>{isRu?"Отдых":"Rest Days"}</p>
    <Toggle icon={Ic.rest} label={isRu?"Авто-отдых":"Auto Rest Days"} desc={isRu?"Автоматически считать пропущенные дни днями отдыха":"Automatically count missed days as rest days"} checked={autoRestEnabled} onChange={setAutoRestEnabled}/>

    <div style={{height:1,background:c.border,margin:"14px 0"}}/>
    <p style={{fontSize:9.5,color:c.textMuted,letterSpacing:1.8,fontWeight:700,textTransform:"uppercase",marginBottom:9,paddingLeft:2}}>{t.helpSupport}</p>
    <button onClick={()=>{if(onOpenPrivacy)onOpenPrivacy();}} style={{width:"100%",background:c.surface,border:`1px solid ${c.border}`,borderRadius:11,padding:"11px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,marginBottom:7,textAlign:"left",fontFamily:"'DM Sans',sans-serif"}}><div style={{width:30,height:30,borderRadius:8,background:c.primaryDim,display:"flex",alignItems:"center",justifyContent:"center",color:c.primary,flexShrink:0}}>{Ic.shield}</div><div><p style={{fontSize:13,fontWeight:500,color:c.textPrimary,margin:0}}>{isRu?"Политика конфиденциальности":"Privacy Policy"}</p></div></button>
    <button onClick={()=>{if(onOpenTerms)onOpenTerms();}} style={{width:"100%",background:c.surface,border:`1px solid ${c.border}`,borderRadius:11,padding:"11px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,marginBottom:7,textAlign:"left",fontFamily:"'DM Sans',sans-serif"}}><div style={{width:30,height:30,borderRadius:8,background:c.primaryDim,display:"flex",alignItems:"center",justifyContent:"center",color:c.primary,flexShrink:0}}>{Ic.fileText}</div><div><p style={{fontSize:13,fontWeight:500,color:c.textPrimary,margin:0}}>{isRu?"Условия использования":"Terms of Service"}</p></div></button>

    <div style={{height:1,background:"rgba(176,80,80,0.2)",margin:"18px 0 14px"}}/>
    <p style={{fontSize:9.5,color:"#B05050",letterSpacing:1.8,fontWeight:700,textTransform:"uppercase",marginBottom:9,paddingLeft:2}}>{isRu?"Опасная зона":"Danger Zone"}</p>
    <DangerBtn label={isRu?"Сбросить прогресс":"Reset Progress"} sub={isRu?"Удалить все тренировки и дни отдыха":"Delete all workouts and rest days"} action={onResetProgress} confirmKey="reset"/>
    <DangerBtn label={isRu?"Очистить все данные":"Clear All Data"} sub={isRu?"Сбросить приложение к начальному состоянию":"Reset app to initial state"} action={onClearData} confirmKey="clear"/>
    {window.__kinaraSignOut&&<DangerBtn label={isRu?"Удалить аккаунт":"Delete Account"} sub={isRu?"Навсегда удалить аккаунт и все данные":"Permanently delete your account and all data"} action={onDeleteAccount} confirmKey="delete"/>}

    <p style={{fontSize:10.5,color:c.textMuted,textAlign:"center",marginTop:14}}>{t.allDataLocal}</p>
  </div></div>);
}
