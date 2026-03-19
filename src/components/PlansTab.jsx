import { useState, useRef } from 'react';
import { Ic } from '../icons.jsx';
import { DARK } from '../constants.js';
import { getPlanBg } from '../utils.js';

const PRESET_IMAGES=[
  {id:"chest",label:"Chest",gradient:"linear-gradient(135deg,#8B4513 0%,#A0522D 30%,#CD853F 70%,#D2691E 100%)"},
  {id:"back",label:"Back",gradient:"linear-gradient(135deg,#1B2838 0%,#2C4A6E 30%,#3B6BA5 70%,#1B3A5C 100%)"},
  {id:"legs",label:"Legs",gradient:"linear-gradient(135deg,#5B0E2D 0%,#8B1A3A 30%,#A52A4A 70%,#6B1530 100%)"},
  {id:"shoulders",label:"Shoulders",gradient:"linear-gradient(135deg,#1A4D2E 0%,#2D7A4A 30%,#3D9B5F 70%,#1A5C35 100%)"},
  {id:"arms",label:"Arms",gradient:"linear-gradient(135deg,#3B1F6E 0%,#5B3A9E 30%,#7B52C4 70%,#4A2888 100%)"},
  {id:"full",label:"Full Body",gradient:"linear-gradient(135deg,#1A1A3E 0%,#2D2D6B 30%,#3D3D8B 70%,#252560 100%)"},
];

export function PlansTab({c,t,theme,plans,setPlans,onStart,onDeletePlan,showToast}){
  const [selected,setSelected]=useState(null);const [editMode,setEditMode]=useState(false);const [newExName,setNewExName]=useState("");const [confirmDelDetail,setConfirmDelDetail]=useState(false);const [confirmDelId,setConfirmDelId]=useState(null);
  const [showImagePicker,setShowImagePicker]=useState(false);
  const imgInputRef=useRef(null);
  const isDark=theme==="dark";const pTxt=isDark?"#FFF":c.textPrimary;const pSub=isDark?"rgba(255,255,255,0.5)":c.textSecondary;
  const accentOf=p=>p.accent==="clay"?DARK.primary:p.accent==="purple"?DARK.purple:p.accent==="red"?"#B05050":DARK.success;

  const handleCardImage=(e)=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const img=new Image();
      img.onload=()=>{
        const canvas=document.createElement("canvas");
        canvas.width=480;canvas.height=270;
        const ctx=canvas.getContext("2d");
        const ratio=Math.max(480/img.width,270/img.height);
        const w=img.width*ratio,h=img.height*ratio;
        ctx.drawImage(img,(480-w)/2,(270-h)/2,w,h);
        setPlans(p=>p.map((x,i)=>i===selected?{...x,image:canvas.toDataURL("image/jpeg",0.75)}:x));
        setShowImagePicker(false);
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);e.target.value="";
  };
  const setPresetImage=(gradient)=>{
    setPlans(p=>p.map((x,i)=>i===selected?{...x,image:null,presetBg:gradient}:x));
    setShowImagePicker(false);
  };

  if(selected!==null){
    const plan=plans[selected];if(!plan){setSelected(null);return null;}
    const acc=accentOf(plan);
    const addEx=()=>{if(!newExName.trim())return;setPlans(p=>p.map((x,i)=>i===selected?{...x,exercises:[...x.exercises,{id:Date.now(),name:newExName.trim(),sets:3,reps:10,rest:60}]}:x));setNewExName("");};
    const rmEx=eid=>setPlans(p=>p.map((x,i)=>i===selected?{...x,exercises:x.exercises.filter(e=>e.id!==eid)}:x));
    const updEx=(eid,field,val)=>setPlans(p=>p.map((x,i)=>i===selected?{...x,exercises:x.exercises.map(e=>e.id===eid?{...e,[field]:Number(val)||val}:e)}:x));
    const cardBg=plan.image?`url(${plan.image}) center/cover`:plan.presetBg||getPlanBg(plan.panel,isDark);
    const saveAndExit=()=>{setEditMode(false);if(showToast)showToast(t.woSession||"Saved!");};

    return(<div style={{maxWidth:880,margin:"0 auto"}}>
      <input ref={imgInputRef} type="file" accept="image/*" onChange={handleCardImage} style={{display:"none"}}/>
      <button onClick={()=>{setSelected(null);setEditMode(false);setConfirmDelDetail(false);setShowImagePicker(false);}} style={{background:"none",border:"none",color:c.textSecondary,cursor:"pointer",fontSize:13,marginBottom:14,display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Sans',sans-serif"}}>{t.backToPlans}</button>
      <div style={{position:"relative",height:140,borderRadius:18,overflow:"hidden",marginBottom:20,background:cardBg}}>
        {!plan.image&&<svg style={{position:"absolute",right:0,top:0,opacity:isDark?0.08:0.15}} width="220" height="140" viewBox="0 0 220 140"><circle cx="175" cy="70" r="60" stroke={acc} strokeWidth="1" fill="none"/></svg>}
        <div style={{position:"absolute",inset:0,background:plan.image?"linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 60%)":"none"}}/>
        <div style={{position:"absolute",inset:0,padding:"16px 22px",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
          {editMode?(<>
            <input value={plan.name} onChange={e=>setPlans(p=>p.map((x,i)=>i===selected?{...x,name:e.target.value}:x))} style={{background:isDark?"rgba(0,0,0,0.5)":"rgba(255,255,255,0.75)",border:`1px solid ${acc}55`,borderRadius:8,padding:"5px 10px",color:pTxt,fontSize:26,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,width:"fit-content",marginBottom:4}}/>
            <input value={plan.notes||""} onChange={e=>setPlans(p=>p.map((x,i)=>i===selected?{...x,notes:e.target.value}:x))} placeholder={t.addNotes||"Add notes (e.g., Shoulders, chest, triceps)…"} style={{background:isDark?"rgba(0,0,0,0.4)":"rgba(255,255,255,0.65)",border:`1px solid ${isDark?"rgba(255,255,255,0.15)":c.border}`,borderRadius:6,padding:"4px 9px",color:pSub,fontSize:11.5,fontFamily:"'DM Sans',sans-serif",width:"60%",marginTop:2}}/>
          </>):(<><h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:900,color:plan.image?"#fff":pTxt}}>{plan.name}</h2>{plan.notes&&<p style={{fontSize:11.5,color:plan.image?"rgba(255,255,255,0.65)":pSub,marginTop:2}}>{plan.notes}</p>}<p style={{fontSize:11,color:plan.image?"rgba(255,255,255,0.5)":pSub,marginTop:1}}>{plan.exercises.length} {t.exercises}</p></>)}
        </div>
        <div style={{position:"absolute",top:10,right:10,display:"flex",gap:7}}>
          <button onClick={()=>onStart(plan)} style={{background:acc,color:"#fff",border:"none",borderRadius:8,padding:"7px 16px",fontSize:13,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",cursor:"pointer",boxShadow:`0 3px 12px ${acc}55`}}>▶ {t.startWorkout}</button>
          {editMode?(<button onClick={saveAndExit} style={{background:c.success,color:"#fff",border:"none",borderRadius:8,padding:"7px 14px",fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>{Ic.save} {t.saveProfile||"Save"}</button>):(<button onClick={()=>setEditMode(true)} style={{background:isDark?"rgba(0,0,0,0.5)":"rgba(255,255,255,0.75)",color:isDark?"rgba(255,255,255,0.7)":c.textSecondary,border:`1px solid ${isDark?"rgba(255,255,255,0.15)":c.border}`,borderRadius:8,padding:"7px 12px",fontSize:13,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>{t.editPlan}</button>)}
          {editMode&&<button onClick={()=>setShowImagePicker(!showImagePicker)} style={{background:isDark?"rgba(0,0,0,0.5)":"rgba(255,255,255,0.75)",color:isDark?"rgba(255,255,255,0.7)":c.textSecondary,border:`1px solid ${isDark?"rgba(255,255,255,0.15)":c.border}`,borderRadius:8,padding:"7px 10px",cursor:"pointer",display:"flex",alignItems:"center"}}>{Ic.image}</button>}
          {!confirmDelDetail?(<button onClick={()=>setConfirmDelDetail(true)} style={{background:isDark?"rgba(80,20,20,0.7)":"rgba(176,80,80,0.15)",color:"#B05050",border:"1px solid rgba(176,80,80,0.3)",borderRadius:8,padding:"7px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>{Ic.trash}</button>):(<div style={{display:"flex",gap:5,alignItems:"center"}}><span style={{fontSize:11,color:"#B05050",background:isDark?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.88)",borderRadius:6,padding:"5px 8px",whiteSpace:"nowrap"}}>{t.confirmDelete}</span><button onClick={()=>{onDeletePlan(plan.id);setSelected(null);setConfirmDelDetail(false);}} style={{background:"#B05050",color:"#fff",border:"none",borderRadius:7,padding:"6px 10px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Yes</button><button onClick={()=>setConfirmDelDetail(false)} style={{background:isDark?"rgba(0,0,0,0.5)":"rgba(255,255,255,0.75)",color:isDark?"rgba(255,255,255,0.7)":c.textSecondary,border:`1px solid ${isDark?"rgba(255,255,255,0.15)":c.border}`,borderRadius:7,padding:"6px 10px",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>No</button></div>)}
        </div>
      </div>

      {/* Image Picker */}
      {showImagePicker&&editMode&&(<div style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:12,padding:"14px 16px",marginBottom:14}}>
        <p style={{fontSize:12,fontWeight:600,color:c.textPrimary,marginBottom:10}}>{t.chooseImage||"Choose Card Image"}</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:10}}>
          {PRESET_IMAGES.map(p=>(<button key={p.id} onClick={()=>setPresetImage(p.gradient)} style={{height:60,borderRadius:10,background:p.gradient,border:`2px solid ${c.border}`,cursor:"pointer",display:"flex",alignItems:"flex-end",padding:"0 10px 8px",boxShadow:"inset 0 -20px 30px rgba(0,0,0,0.3)",transition:"transform 0.15s, border-color 0.15s"}}><span style={{fontSize:11,fontWeight:600,color:"#fff",textShadow:"0 1px 4px rgba(0,0,0,0.7)",fontFamily:"'DM Sans',sans-serif"}}>{p.label}</span></button>))}
        </div>
        <button onClick={()=>imgInputRef.current?.click()} style={{width:"100%",background:c.surface,border:`1px solid ${c.border}`,borderRadius:8,padding:"8px",fontSize:12,color:c.textSecondary,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>{Ic.image} {t.uploadPhoto||"Upload Image"}</button>
        {plan.image&&<button onClick={()=>setPlans(p=>p.map((x,i)=>i===selected?{...x,image:null,presetBg:null}:x))} style={{width:"100%",marginTop:6,background:"none",border:`1px solid ${c.border}`,borderRadius:8,padding:"6px",fontSize:11,color:c.textMuted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{t.removeImage||"Remove Image"}</button>}
      </div>)}

      {plan.exercises.map((ex,i)=>(<div key={ex.id} style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:11,padding:"12px 15px",marginBottom:7,display:"flex",alignItems:"center",gap:10}}><div style={{width:22,height:22,borderRadius:6,background:c.primaryDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:c.primary,fontWeight:700,flexShrink:0}}>{i+1}</div><div style={{flex:1}}><p style={{fontSize:13,fontWeight:500,color:c.textPrimary}}>{ex.name}</p>{editMode?(<div style={{display:"flex",gap:7,marginTop:5,alignItems:"center",flexWrap:"wrap"}}>{[["sets","Sets",1,10],["reps","Reps",1,30],["rest","Rest(s)",15,300]].map(([field,label,min,max])=>(<label key={field} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:c.textSecondary}}>{label}:<input type="number" min={min} max={max} value={ex[field]} onChange={e=>updEx(ex.id,field,e.target.value)} style={{width:46,background:c.inputBg,border:`1px solid ${c.border}`,borderRadius:5,padding:"3px 5px",color:c.textPrimary,fontSize:11,fontFamily:"'JetBrains Mono',monospace",textAlign:"center"}}/></label>))}</div>):(<p style={{fontSize:11,color:c.textSecondary,marginTop:2}}>{ex.sets} × {ex.reps} reps · {ex.rest}s rest</p>)}</div>{editMode&&<button onClick={()=>rmEx(ex.id)} style={{background:"none",border:"none",color:"#B05050",cursor:"pointer",padding:"4px"}}>{Ic.trash}</button>}</div>))}
      {editMode&&(<div style={{display:"flex",gap:8,marginTop:7}}><input value={newExName} onChange={e=>setNewExName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addEx()} placeholder="Exercise name…" style={{flex:1,background:c.inputBg,border:`1px solid ${c.borderMid}`,borderRadius:9,padding:"10px 13px",color:c.textPrimary,fontSize:13,fontFamily:"'DM Sans',sans-serif"}}/><button onClick={addEx} style={{background:c.primary,color:"#fff",border:"none",borderRadius:9,padding:"10px 15px",cursor:"pointer"}}>{Ic.plus}</button></div>)}
    </div>);
  }

  return(<div style={{maxWidth:1100,margin:"0 auto"}}>
    <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:20}}><div><p style={{fontSize:10,color:c.primary,letterSpacing:1.8,textTransform:"uppercase",fontWeight:700,marginBottom:3}}>{t.myPlans}</p><h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:38,fontWeight:900,color:c.textPrimary}}>{t.trainingPlans}</h2></div><button onClick={()=>{setPlans(p=>[...p,{id:Date.now(),name:"New Plan",panel:"upper",accent:"clay",warmup:{enabled:true,duration:300},notes:"",exercises:[]}]);setSelected(plans.length);setEditMode(true);}} style={{background:c.primary,color:"#fff",border:"none",borderRadius:10,padding:"10px 18px",fontSize:13,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",cursor:"pointer",boxShadow:`0 3px 12px ${c.primary}44`}}>{t.newPlan}</button></div>
    <div className="kb-plans-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
      {plans.map((p,i)=>{const acc=accentOf(p);const isConfirming=confirmDelId===p.id;const cardBg=p.image?`url(${p.image}) center/cover`:p.presetBg||getPlanBg(p.panel,isDark);return(<div key={p.id} className="kb-card-hover" onClick={()=>!isConfirming&&setSelected(i)} style={{background:c.card,border:`1px solid ${isConfirming?"#B05050":c.border}`,borderRadius:16,overflow:"hidden",cursor:isConfirming?"default":"pointer",transition:"all 0.2s",boxShadow:"0 2px 10px rgba(0,0,0,0.08)"}}>
        <div style={{position:"relative",height:110,background:cardBg,overflow:"hidden"}}>
          {!p.image&&<svg style={{position:"absolute",right:0,top:0,opacity:isDark?0.08:0.2}} width="160" height="110" viewBox="0 0 160 110"><circle cx="130" cy="55" r="45" stroke={acc} strokeWidth="1" fill="none"/></svg>}
          <div style={{position:"absolute",inset:0,background:p.image?"linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 55%)":isDark?"linear-gradient(to bottom,transparent 20%,rgba(0,0,0,0.75))":"linear-gradient(to bottom,transparent 20%,rgba(0,0,0,0.4))"}}/>
          <div style={{position:"absolute",bottom:8,left:14,right:14}}>
            <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:21,fontWeight:900,color:"#fff"}}>{p.name}</h3>
            {p.notes&&<p style={{fontSize:10.5,color:"rgba(255,255,255,0.6)",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.notes}</p>}
          </div>
          <div style={{position:"absolute",top:7,right:7,width:6,height:6,borderRadius:"50%",background:acc,boxShadow:`0 0 6px ${acc}`}}/>
        </div>
        <div style={{padding:"10px 14px"}}>
          {isConfirming?(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#B05050",fontWeight:500}}>{t.confirmDelete}</span><div style={{display:"flex",gap:6}}><button onClick={e=>{e.stopPropagation();onDeletePlan(p.id);setConfirmDelId(null);}} style={{background:"#B05050",color:"#fff",border:"none",borderRadius:7,padding:"5px 13px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Yes</button><button onClick={e=>{e.stopPropagation();setConfirmDelId(null);}} style={{background:c.bg,color:c.textSecondary,border:`1px solid ${c.border}`,borderRadius:7,padding:"5px 10px",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>No</button></div></div>):(
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <p style={{fontSize:11.5,color:c.textSecondary}}>{p.exercises.length} {t.exercises}</p>
              <div style={{display:"flex",gap:6}}>
                <button onClick={e=>{e.stopPropagation();onStart(p);}} style={{background:acc,color:"#fff",border:"none",borderRadius:7,padding:"5px 12px",fontSize:12,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",cursor:"pointer",boxShadow:`0 2px 8px ${acc}44`}}>▶</button>
                <button onClick={e=>{e.stopPropagation();setSelected(i);}} style={{background:c.bg,color:c.textSecondary,border:`1px solid ${c.border}`,borderRadius:7,padding:"5px 10px",fontSize:11.5,cursor:"pointer"}}>{t.editPlan}</button>
                <button onClick={e=>{e.stopPropagation();setConfirmDelId(p.id);}} style={{background:"none",border:`1px solid ${c.border}`,color:"#B05050",borderRadius:7,padding:"5px 8px",cursor:"pointer",display:"flex",alignItems:"center"}}>{Ic.trash}</button>
              </div>
            </div>
          )}
        </div>
      </div>);})}
    </div>
  </div>);
}
