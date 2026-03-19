import { useState } from 'react';

const FAQ_EN=[
  {q:"How do I create a training plan?",a:"Go to the Plans tab and click '+ New Plan'. Give it a name, add exercises with sets/reps/rest times, and optionally add a card image."},
  {q:"How does the streak work?",a:"Your streak counts consecutive days with any logged activity — either a workout or a rest day. If you miss a day without logging anything, the streak resets. Enable 'Auto Rest Days' in Settings to automatically protect your streak."},
  {q:"What is the Training Load section?",a:"Training Load uses the Banister model to track your fatigue (ATL), fitness base (CTL), and freshness (TSB). It helps you know when to push hard and when to take a deload."},
  {q:"Can I export my data?",a:"Yes! Go to Settings → Data → Export Data. This downloads all your sessions, plans, and profile info as a JSON file."},
  {q:"How do I change the language?",a:"Open Settings (gear icon or burger menu) and switch between English and Russian."},
  {q:"Is my data safe?",a:"Your data is stored locally on your device and optionally synced to the cloud via Supabase with encryption in transit. You can export or delete your data at any time."},
];
const FAQ_RU=[
  {q:"Как создать план тренировок?",a:"Перейдите на вкладку «Планы» и нажмите «+ Новый план». Дайте ему название, добавьте упражнения с подходами, повторениями и временем отдыха, а также при желании добавьте изображение карточки."},
  {q:"Как работает серия дней?",a:"Серия считает последовательные дни с любой записанной активностью — тренировкой или днём отдыха. Если вы пропустите день без записи, серия сбрасывается. Включите «Авто-отдых» в настройках, чтобы автоматически защитить серию."},
  {q:"Что такое «Тренировочная нагрузка»?",a:"Этот раздел использует модель Банистера для отслеживания усталости (ATL), фитнес-базы (CTL) и свежести (TSB). Это помогает понять, когда тренироваться интенсивно, а когда сделать разгрузку."},
  {q:"Могу ли я экспортировать данные?",a:"Да! Перейдите в Настройки → Данные → Экспорт. Это скачает все ваши тренировки, планы и профиль в формате JSON."},
  {q:"Как поменять язык?",a:"Откройте Настройки (значок шестерёнки или боковое меню) и переключитесь между English и Русский."},
  {q:"Мои данные в безопасности?",a:"Данные хранятся локально на вашем устройстве и при желании синхронизируются в облако через Supabase с шифрованием при передаче. Вы можете экспортировать или удалить свои данные в любое время."},
];

export function HelpSupportModal({open,onClose,c,lang}){
  const [expandedIdx,setExpandedIdx]=useState(null);
  if(!open)return null;
  const isRu=lang==="ru";
  const faq=isRu?FAQ_RU:FAQ_EN;
  return(<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:550,backdropFilter:"blur(6px)",padding:16}}>
    <div onClick={e=>e.stopPropagation()} style={{background:c.card,border:`1px solid ${c.borderMid}`,borderRadius:20,padding:"28px 24px",width:460,maxWidth:"100%",boxShadow:"0 24px 60px rgba(0,0,0,0.4)",maxHeight:"85vh",overflow:"auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:c.textPrimary}}>{isRu?"Помощь и поддержка":"Help & Support"}</p>
        <button onClick={onClose} style={{background:"none",border:`1px solid ${c.border}`,color:c.textSecondary,borderRadius:7,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14}}>✕</button>
      </div>
      <p style={{fontSize:9.5,color:c.textMuted,letterSpacing:1.8,fontWeight:700,textTransform:"uppercase",marginBottom:12}}>{isRu?"Частые вопросы":"FAQ"}</p>
      {faq.map((item,i)=>(<div key={i} style={{marginBottom:8}}>
        <button onClick={()=>setExpandedIdx(expandedIdx===i?null:i)} style={{width:"100%",background:c.surface,border:`1px solid ${expandedIdx===i?c.primary+"44":c.border}`,borderRadius:expandedIdx===i?"10px 10px 0 0":"10px",padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"'DM Sans',sans-serif",textAlign:"left"}}>
          <span style={{fontSize:13,fontWeight:500,color:c.textPrimary,flex:1}}>{item.q}</span>
          <span style={{color:c.textMuted,fontSize:12,flexShrink:0,marginLeft:8}}>{expandedIdx===i?"−":"+"}</span>
        </button>
        {expandedIdx===i&&(<div style={{background:c.surface,border:`1px solid ${c.primary}44`,borderTop:"none",borderRadius:"0 0 10px 10px",padding:"10px 14px"}}>
          <p style={{fontSize:12.5,color:c.textSecondary,lineHeight:1.7}}>{item.a}</p>
        </div>)}
      </div>))}
      <div style={{height:1,background:c.border,margin:"18px 0"}}/>
      <p style={{fontSize:9.5,color:c.textMuted,letterSpacing:1.8,fontWeight:700,textTransform:"uppercase",marginBottom:10}}>{isRu?"Связаться с нами":"Contact Us"}</p>
      <div style={{background:c.surface,border:`1px solid ${c.border}`,borderRadius:11,padding:"14px 16px"}}>
        <p style={{fontSize:13,color:c.textPrimary,marginBottom:4}}>{isRu?"Напишите нам":"Email us"}</p>
        <p style={{fontSize:12,color:c.primary,fontFamily:"'JetBrains Mono',monospace"}}>support@kinara.app</p>
        <p style={{fontSize:11,color:c.textMuted,marginTop:8}}>{isRu?"Мы обычно отвечаем в течение 24 часов.":"We typically respond within 24 hours."}</p>
      </div>
      <p style={{fontSize:10,color:c.textMuted,textAlign:"center",marginTop:16}}>Kinara v0.7.0</p>
    </div>
  </div>);
}
