export function TermsOfService({open,onClose,c,lang}){
  if(!open)return null;
  const ru=lang==="ru";

  const H=({children})=>(<h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,color:c.textPrimary,margin:"22px 0 8px"}}>{children}</h2>);
  const P=({children})=>(<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,lineHeight:1.7,color:c.textSecondary,margin:"0 0 10px"}}>{children}</p>);

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,backdropFilter:"blur(6px)",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:c.card,border:`1px solid ${c.borderMid}`,borderRadius:20,padding:"28px 24px",width:520,maxWidth:"100%",boxShadow:"0 24px 60px rgba(0,0,0,0.4)",maxHeight:"85vh",display:"flex",flexDirection:"column"}}>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexShrink:0}}>
          <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:c.textPrimary,margin:0}}>{ru?"Условия использования":"Terms of Service"}</p>
          <button onClick={onClose} style={{background:"none",border:`1px solid ${c.border}`,color:c.textSecondary,borderRadius:7,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:15,lineHeight:1,flexShrink:0}}>&#10005;</button>
        </div>

        <div style={{overflowY:"auto",flex:1,paddingRight:6}}>

          <P>{ru
            ?"Дата вступления в силу: март 2026 г."
            :"Effective date: March 2026"}</P>

          {/* 1. Acceptance */}
          <H>{ru?"1. Принятие условий":"1. Acceptance of Terms"}</H>
          <P>{ru
            ?"Используя приложение Kinara (далее \u2014 \u00abСервис\u00bb), вы подтверждаете, что прочитали, поняли и согласны соблюдать настоящие Условия использования. Если вы не согласны с какой-либо частью этих условий, пожалуйста, прекратите использование Сервиса."
            :"By accessing or using the Kinara application (the \u201cService\u201d), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the Service."}</P>

          {/* 2. Description */}
          <H>{ru?"2. Описание Сервиса":"2. Description of Service"}</H>
          <P>{ru
            ?"Kinara \u2014 это веб- и мобильное приложение для отслеживания фитнес-активности. Сервис позволяет пользователям записывать тренировки, создавать планы занятий, отслеживать прогресс и анализировать статистику. Данные хранятся локально на устройстве пользователя, а облачная синхронизация может быть добавлена в будущих обновлениях."
            :"Kinara is a fitness tracking web and mobile application. The Service allows users to log workouts, create training plans, track progress, and view performance statistics. Data is stored locally on the user\u2019s device, and cloud synchronization may be introduced in future updates."}</P>

          {/* 3. User Accounts */}
          <H>{ru?"3. Учётная запись пользователя":"3. User Account Responsibility"}</H>
          <P>{ru
            ?"Вы несёте ответственность за сохранность данных своей учётной записи и за все действия, совершённые с её использованием. Вы обязуетесь незамедлительно уведомить нас о любом несанкционированном доступе к вашему аккаунту. Kinara не несёт ответственности за убытки, возникшие вследствие несанкционированного использования вашей учётной записи."
            :"You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized access. Kinara is not liable for any loss arising from unauthorized use of your account."}</P>

          {/* 4. Acceptable Use */}
          <H>{ru?"4. Допустимое использование":"4. Acceptable Use"}</H>
          <P>{ru
            ?"Вы обязуетесь не использовать Сервис для размещения вредоносного, оскорбительного или незаконного контента. Запрещается осуществлять обратную разработку (reverse engineering), декомпиляцию, дизассемблирование или иное извлечение исходного кода Сервиса. Любые попытки нарушить безопасность или стабильность работы приложения также запрещены."
            :"You agree not to use the Service to distribute harmful, abusive, or unlawful content. You shall not reverse engineer, decompile, disassemble, or otherwise attempt to extract the source code of the Service. Any attempt to compromise the security or stability of the application is prohibited."}</P>

          {/* 5. Intellectual Property */}
          <H>{ru?"5. Интеллектуальная собственность":"5. Intellectual Property"}</H>
          <P>{ru
            ?"Торговая марка Kinara, логотип, дизайн пользовательского интерфейса, графика и весь программный код являются интеллектуальной собственностью Kinara и защищены законодательством об авторском праве и товарных знаках. Воспроизведение, распространение или создание производных работ без нашего письменного согласия запрещено."
            :"The Kinara brand, logo, user interface design, graphics, and all software code are the intellectual property of Kinara and are protected by copyright and trademark laws. Reproduction, distribution, or creation of derivative works without our prior written consent is prohibited."}</P>

          {/* 6. User-Generated Content */}
          <H>{ru?"6. Пользовательские данные":"6. User-Generated Content"}</H>
          <P>{ru
            ?"Данные о тренировках, планы занятий и иной контент, созданный вами в приложении, принадлежат вам. Kinara не претендует на права собственности в отношении ваших пользовательских данных. Вы можете экспортировать или удалить свои данные в любое время через настройки приложения."
            :"Workout data, training plans, and other content you create within the application belong to you. Kinara does not claim ownership of your user-generated content. You may export or delete your data at any time through the application settings."}</P>

          {/* 7. Medical Disclaimer */}
          <H>{ru?"7. Отказ от медицинской ответственности":"7. Medical Disclaimer"}</H>
          <P>{ru
            ?"Kinara не является медицинским приложением и не предоставляет медицинских консультаций, диагностики или рекомендаций по лечению. Информация, представленная в Сервисе, носит исключительно информационный характер и не заменяет профессиональную медицинскую помощь. Перед началом любой программы тренировок проконсультируйтесь с квалифицированным врачом."
            :"Kinara is not a medical application and does not provide medical advice, diagnosis, or treatment recommendations. The information presented in the Service is for informational purposes only and is not a substitute for professional medical guidance. Consult a qualified healthcare provider before starting any exercise program."}</P>

          {/* 8. Limitation of Liability */}
          <H>{ru?"8. Ограничение ответственности":"8. Limitation of Liability"}</H>
          <P>{ru
            ?"В максимальной степени, допустимой применимым законодательством, Kinara и её разработчики не несут ответственности за любые прямые, косвенные, случайные, штрафные или последующие убытки, возникающие в связи с использованием или невозможностью использования Сервиса. Сервис предоставляется на условиях \u00abкак есть\u00bb и \u00abкак доступно\u00bb без каких-либо гарантий, явных или подразумеваемых."
            :"To the fullest extent permitted by applicable law, Kinara and its developers shall not be liable for any direct, indirect, incidental, punitive, or consequential damages arising from your use of, or inability to use, the Service. The Service is provided on an \u201cas is\u201d and \u201cas available\u201d basis without warranties of any kind, express or implied."}</P>

          {/* 9. Modification of Terms */}
          <H>{ru?"9. Изменение условий":"9. Modification of Terms"}</H>
          <P>{ru
            ?"Мы оставляем за собой право изменять настоящие Условия использования в любое время. В случае внесения существенных изменений мы уведомим пользователей через приложение. Продолжение использования Сервиса после публикации изменений означает ваше согласие с обновлёнными условиями."
            :"We reserve the right to modify these Terms of Service at any time. If we make material changes, we will notify users through the application. Your continued use of the Service after changes are posted constitutes acceptance of the updated terms."}</P>

          {/* 10. Termination */}
          <H>{ru?"10. Прекращение использования":"10. Termination"}</H>
          <P>{ru
            ?"Вы вправе прекратить использование Сервиса и удалить свою учётную запись в любое время. При удалении учётной записи все связанные данные будут безвозвратно удалены с вашего устройства. Мы также оставляем за собой право приостановить или прекратить доступ к Сервису в случае нарушения настоящих Условий."
            :"You may stop using the Service and delete your account at any time. Upon account deletion, all associated data will be permanently removed from your device. We also reserve the right to suspend or terminate access to the Service if you violate these Terms."}</P>

          {/* 11. Governing Law */}
          <H>{ru?"11. Применимое право":"11. Governing Law"}</H>
          <P>{ru
            ?"Для пользователей, загрузивших приложение через RuStore или использующих Сервис на территории Российской Федерации, настоящие Условия регулируются и толкуются в соответствии с законодательством Российской Федерации, включая Закон РФ \u00abО защите прав потребителей\u00bb и Федеральный закон \u00abО персональных данных\u00bb (152-ФЗ). Споры подлежат рассмотрению в компетентных судах по месту нахождения пользователя в соответствии с законодательством РФ. Для остальных пользователей споры разрешаются путём обязательного арбитража в соответствии с правилами международного коммерческого арбитража, и стороны отказываются от права на участие в коллективных исках."
            :"For users who downloaded the application via RuStore or who use the Service within the Russian Federation, these Terms are governed by and construed in accordance with the laws of the Russian Federation, including the Consumer Protection Law and Federal Law No. 152-FZ on Personal Data. Disputes shall be resolved by competent courts at the user\u2019s place of residence in accordance with Russian law. For all other users, disputes shall be resolved through binding international arbitration, and the parties waive the right to participate in class-action lawsuits."}</P>

          {/* 12. Contact */}
          <H>{ru?"12. Контактная информация":"12. Contact Information"}</H>
          <P>{ru
            ?"Если у вас есть вопросы или замечания относительно настоящих Условий использования, свяжитесь с нами по электронной почте:"
            :"If you have any questions or concerns about these Terms of Service, please contact us at:"}</P>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:c.primary,margin:"0 0 20px"}}>kinarasupport@gmail.com</p>

        </div>
      </div>
    </div>
  );
}
