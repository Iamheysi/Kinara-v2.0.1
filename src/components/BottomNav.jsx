import { Ic } from '../icons.jsx';

export function BottomNav({tab,setTab,running,c,t}){
  const items=[{id:"home",icon:Ic.home,label:t.dashboard},{id:"plans",icon:Ic.plans,label:t.plans},{id:"log",icon:Ic.log,label:t.logWorkout},{id:"calendar",icon:Ic.cal,label:t.calendar},{id:"progress",icon:Ic.progress,label:t.progress},{id:"profile",icon:Ic.user,label:t.profile}];
  return(<nav className="kb-bottom-nav" style={{position:"fixed",bottom:0,left:0,right:0,background:c.surface,borderTop:`1px solid ${c.border}`,zIndex:200,paddingBottom:"env(safe-area-inset-bottom)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)"}}>
    <div style={{display:"flex",maxWidth:600,margin:"0 auto"}}>
      {items.map(item=>{const active=tab===item.id;return(<button key={item.id} onClick={()=>setTab(item.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"9px 4px 8px",color:active?c.primary:c.textSecondary,position:"relative",transition:"color 0.15s",minWidth:0}}>
        {item.id==="log"&&running&&<span style={{position:"absolute",top:7,right:"calc(50% - 14px)",width:6,height:6,borderRadius:"50%",background:c.success,animation:"pulse 1.5s infinite"}}/>}
        <span style={{color:active?c.primary:c.textSecondary,transition:"color 0.15s"}}>{item.icon}</span>
        <span style={{fontSize:9,fontWeight:active?700:400,fontFamily:"'DM Sans',sans-serif",letterSpacing:0.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:52}}>{item.label}</span>
        {active&&<div style={{position:"absolute",bottom:0,left:"20%",right:"20%",height:2,background:c.primary,borderRadius:"2px 2px 0 0"}}/>}
      </button>);})}
    </div>
  </nav>);
}
