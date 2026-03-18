import { useState } from 'react';
import { Ic } from '../icons.jsx';

export function StatCard({label,value,unit,accent,info,c}){
  const [open,setOpen]=useState(false);
  return(<div className="kb-card-hover" style={{background:c.card,border:`1px solid ${open?c.primary+"55":c.border}`,borderRadius:13,padding:"14px 16px",transition:"all 0.18s",position:"relative",boxShadow:open?`0 4px 16px ${c.primary}22`:"0 1px 4px rgba(0,0,0,0.06)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:42,fontWeight:900,color:accent,lineHeight:1}}>{value}</p>
      {info&&<button onClick={e=>{e.stopPropagation();setOpen(!open);}} style={{width:20,height:20,borderRadius:"50%",background:open?c.primaryDim:"transparent",border:`1px solid ${open?c.primary+"66":c.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:open?c.primary:c.textMuted,flexShrink:0,transition:"all 0.15s",marginTop:2}}>{Ic.info}</button>}
    </div>
    <p style={{fontSize:9.5,color:c.textMuted,marginTop:1}}>{unit}</p>
    <p style={{fontSize:11.5,color:c.textSecondary,marginTop:2}}>{label}</p>
    {open&&info&&<div style={{marginTop:9,padding:"9px 11px",background:c.primaryDim,borderRadius:8,border:`1px solid ${c.primary}22`,animation:"fadeUp 0.15s ease"}}><p style={{fontSize:11,color:c.textSecondary,lineHeight:1.65}}>{info}</p></div>}
  </div>);
}
