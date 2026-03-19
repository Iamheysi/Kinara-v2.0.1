export function PrivacyPolicy({open,onClose,c,lang}){
  if(!open)return null;
  const isRu=lang==="ru";

  const h1={fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:c.textPrimary,margin:0};
  const h2={fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,color:c.textPrimary,margin:"22px 0 8px"};
  const h3={fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,color:c.textPrimary,margin:"14px 0 6px"};
  const p={fontSize:13,lineHeight:1.65,color:c.textSecondary,margin:"0 0 10px",fontFamily:"'DM Sans',sans-serif"};
  const ul={fontSize:13,lineHeight:1.65,color:c.textSecondary,margin:"0 0 10px",paddingLeft:20,fontFamily:"'DM Sans',sans-serif"};
  const strong={color:c.textPrimary,fontWeight:600};
  const muted={fontSize:11.5,color:c.textMuted,fontFamily:"'DM Sans',sans-serif"};

  const en=(
    <>
      <p style={muted}>Last updated: March 2026</p>

      <p style={p}>
        This Privacy Policy explains how Kinara ("we", "us", "our") collects, uses, stores, and protects your personal data when you use the Kinara fitness tracking application ("the App"). By using the App, you consent to the practices described in this policy.
      </p>

      <p style={h2}>1. Data We Collect</p>
      <p style={p}>We collect and process the following categories of personal data:</p>

      <p style={h3}>1.1 Account &amp; Authentication</p>
      <ul style={ul}>
        <li>Email address — used for account creation, authentication, and account recovery.</li>
      </ul>

      <p style={h3}>1.2 Profile Information</p>
      <ul style={ul}>
        <li>Display name</li>
        <li>Bio / personal description</li>
        <li>Fitness goal (e.g., strength, endurance, weight loss)</li>
        <li>Profile photo</li>
      </ul>

      <p style={h3}>1.3 Workout &amp; Training Data</p>
      <ul style={ul}>
        <li>Workout sessions (date, duration, notes)</li>
        <li>Training plans and program configurations</li>
        <li>Exercises performed (names, sets, repetitions, weights)</li>
        <li>Rest day logs and recovery entries</li>
      </ul>

      <p style={h2}>2. How We Use Your Data</p>
      <p style={p}>Your data is used exclusively to provide and improve the App's functionality:</p>
      <ul style={ul}>
        <li>Authenticate you and maintain your session</li>
        <li>Display your workout history, progress, and statistics</li>
        <li>Synchronize data across your devices</li>
        <li>Generate personalized training insights</li>
      </ul>
      <p style={p}>We do <span style={strong}>not</span> sell, rent, or share your personal data with advertisers or data brokers. We do <span style={strong}>not</span> use your data for profiling or automated decision-making beyond the core features of the App.</p>

      <p style={h2}>3. Data Storage &amp; Security</p>

      <p style={h3}>3.1 Local Storage</p>
      <p style={p}>
        The App stores workout data, preferences, and cached content in your browser's localStorage. This data remains on your device and is not transmitted unless cloud synchronization is active.
      </p>

      <p style={h3}>3.2 Cloud Storage</p>
      <p style={p}>
        When you create an account, your data is synchronized to a PostgreSQL database hosted and managed by <span style={strong}>Supabase Inc.</span> Supabase provides infrastructure-level encryption at rest (AES-256) and in transit (TLS 1.2+). Databases are hosted in secure data centers with SOC 2 Type II compliance.
      </p>

      <p style={h3}>3.3 Security Measures</p>
      <ul style={ul}>
        <li>All network communication uses HTTPS/TLS encryption</li>
        <li>Authentication tokens are securely managed by Supabase Auth</li>
        <li>Row-level security policies restrict data access to the owning user</li>
        <li>No plaintext passwords are ever stored — only hashed credentials</li>
      </ul>

      <p style={h2}>4. Cookies &amp; Tracking</p>
      <p style={p}>
        Kinara does <span style={strong}>not</span> use cookies for tracking, analytics, or advertising purposes. We do not employ third-party tracking pixels, fingerprinting, or behavioral analytics. Session management relies on secure tokens stored in localStorage.
      </p>

      <p style={h2}>5. Third-Party Services</p>
      <p style={p}>The App relies on the following third-party service providers:</p>
      <ul style={ul}>
        <li><span style={strong}>Supabase Inc.</span> — authentication, database hosting, and real-time data synchronization. Supabase processes data under their own privacy policy and acts as a data processor on our behalf.</li>
        <li><span style={strong}>Vercel Inc.</span> — application hosting and content delivery. Vercel serves the App's static assets and may process standard HTTP access logs (IP address, user agent, timestamps). Vercel does not have access to your workout data or account information.</li>
      </ul>

      <p style={h2}>6. Your Rights</p>
      <p style={p}>You have the following rights regarding your personal data:</p>
      <ul style={ul}>
        <li><span style={strong}>Access &amp; Export</span> — You can export all your data at any time in JSON format through the Settings menu.</li>
        <li><span style={strong}>Rectification</span> — You can modify your profile information, workout entries, and training plans directly within the App.</li>
        <li><span style={strong}>Erasure</span> — You can delete your account and all associated data. Upon deletion, your data is permanently removed from our cloud database within 30 days. Local data is cleared immediately.</li>
        <li><span style={strong}>Data Portability</span> — The JSON export feature provides your data in a structured, machine-readable format.</li>
        <li><span style={strong}>Withdrawal of Consent</span> — You may stop using the App and delete your account at any time.</li>
      </ul>

      <p style={h2}>7. GDPR Compliance</p>
      <p style={p}>
        If you are located in the European Economic Area (EEA), the United Kingdom, or Switzerland, your data is processed in accordance with the General Data Protection Regulation (EU) 2016/679 (GDPR). The legal basis for processing your data is your consent (Article 6(1)(a)) and the performance of the contract between you and Kinara (Article 6(1)(b)).
      </p>
      <p style={p}>
        You have the right to lodge a complaint with your local data protection supervisory authority if you believe your data is being processed unlawfully.
      </p>

      <p style={h2}>8. Russian Federation — Federal Law No. 152-FZ</p>
      <p style={p}>
        If you are located in the Russian Federation, your personal data is processed in compliance with Federal Law No. 152-FZ "On Personal Data" dated July 27, 2006. By using the App and providing your personal data, you give your informed and voluntary consent to the processing of your data for the purposes described in this policy.
      </p>
      <p style={p}>
        You have the right to request information about the processing of your personal data, demand corrections to inaccurate data, and request the deletion of your data by contacting us. Upon receiving a legitimate request, we will cease processing your personal data within 30 days.
      </p>

      <p style={h2}>9. Age Requirement</p>
      <p style={p}>
        The App is intended for users aged <span style={strong}>16 years and older</span>. We do not knowingly collect personal data from individuals under 16. If we become aware that a user under 16 has provided personal data, we will take steps to delete that data promptly.
      </p>

      <p style={h2}>10. Data Retention</p>
      <p style={p}>
        We retain your personal data for as long as your account is active. If you delete your account, all associated data is permanently erased from our cloud systems within 30 days. Backup copies, if any, are purged within 90 days.
      </p>

      <p style={h2}>11. Changes to This Policy</p>
      <p style={p}>
        We may update this Privacy Policy from time to time. Material changes will be communicated through the App. Continued use of the App after changes take effect constitutes acceptance of the revised policy.
      </p>

      <p style={h2}>12. Contact Us</p>
      <p style={p}>
        If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at:
      </p>
      <p style={{...p,color:c.primary,fontWeight:600}}>support@kinara.app</p>
    </>
  );

  const ru=(
    <>
      <p style={muted}>Последнее обновление: март 2026 г.</p>

      <p style={p}>
        Настоящая Политика конфиденциальности описывает, каким образом приложение для отслеживания тренировок Kinara («мы», «наше», «приложение») собирает, использует, хранит и защищает ваши персональные данные. Используя приложение, вы подтверждаете своё согласие с условиями данной Политики.
      </p>

      <p style={h2}>1. Какие данные мы собираем</p>
      <p style={p}>Мы собираем и обрабатываем следующие категории персональных данных:</p>

      <p style={h3}>1.1 Учётная запись и аутентификация</p>
      <ul style={ul}>
        <li>Адрес электронной почты — используется для создания учётной записи, входа в систему и восстановления доступа.</li>
      </ul>

      <p style={h3}>1.2 Данные профиля</p>
      <ul style={ul}>
        <li>Отображаемое имя</li>
        <li>Описание / биография</li>
        <li>Фитнес-цель (например, сила, выносливость, снижение веса)</li>
        <li>Фотография профиля</li>
      </ul>

      <p style={h3}>1.3 Тренировочные данные</p>
      <ul style={ul}>
        <li>Тренировочные сессии (дата, продолжительность, заметки)</li>
        <li>Тренировочные планы и программы</li>
        <li>Выполненные упражнения (названия, подходы, повторения, рабочие веса)</li>
        <li>Записи о днях отдыха и восстановления</li>
      </ul>

      <p style={h2}>2. Цели обработки данных</p>
      <p style={p}>Ваши данные используются исключительно для обеспечения работы приложения:</p>
      <ul style={ul}>
        <li>Аутентификация и поддержание сессии</li>
        <li>Отображение истории тренировок, прогресса и статистики</li>
        <li>Синхронизация данных между устройствами</li>
        <li>Формирование персонализированных рекомендаций по тренировкам</li>
      </ul>
      <p style={p}>Мы <span style={strong}>не продаём</span>, не передаём и не предоставляем ваши персональные данные рекламодателям или третьим лицам в маркетинговых целях. Мы <span style={strong}>не используем</span> ваши данные для профилирования или автоматизированного принятия решений за пределами основного функционала приложения.</p>

      <p style={h2}>3. Хранение и защита данных</p>

      <p style={h3}>3.1 Локальное хранение</p>
      <p style={p}>
        Приложение сохраняет данные о тренировках, настройки и кешированный контент в localStorage вашего браузера. Эти данные остаются на вашем устройстве и не передаются на сервер, если облачная синхронизация не активна.
      </p>

      <p style={h3}>3.2 Облачное хранение</p>
      <p style={p}>
        При создании учётной записи ваши данные синхронизируются с базой данных PostgreSQL, размещённой и управляемой компанией <span style={strong}>Supabase Inc.</span> Supabase обеспечивает шифрование данных при хранении (AES-256) и при передаче (TLS 1.2+). Серверы баз данных расположены в защищённых центрах обработки данных с сертификацией SOC 2 Type II.
      </p>

      <p style={h3}>3.3 Меры безопасности</p>
      <ul style={ul}>
        <li>Все сетевые соединения защищены шифрованием HTTPS/TLS</li>
        <li>Токены аутентификации управляются сервисом Supabase Auth</li>
        <li>Политики безопасности на уровне строк (RLS) ограничивают доступ к данным только их владельцу</li>
        <li>Пароли никогда не хранятся в открытом виде — используется только хеширование</li>
      </ul>

      <p style={h2}>4. Файлы cookie и отслеживание</p>
      <p style={p}>
        Kinara <span style={strong}>не использует</span> файлы cookie для отслеживания, аналитики или рекламных целей. Мы не применяем пиксели отслеживания, сбор цифровых отпечатков (fingerprinting) или поведенческую аналитику. Управление сессиями осуществляется через защищённые токены, хранящиеся в localStorage.
      </p>

      <p style={h2}>5. Сторонние сервисы</p>
      <p style={p}>Для работы приложения используются следующие сторонние поставщики услуг:</p>
      <ul style={ul}>
        <li><span style={strong}>Supabase Inc.</span> — аутентификация, хостинг базы данных и синхронизация данных в реальном времени. Supabase обрабатывает данные на основании собственной политики конфиденциальности и выступает в роли обработчика данных от нашего имени.</li>
        <li><span style={strong}>Vercel Inc.</span> — хостинг приложения и доставка контента. Vercel обслуживает статические файлы приложения и может обрабатывать стандартные журналы доступа HTTP (IP-адрес, user agent, временные метки). Vercel не имеет доступа к вашим тренировочным данным или информации учётной записи.</li>
      </ul>

      <p style={h2}>6. Ваши права</p>
      <p style={p}>Вы обладаете следующими правами в отношении своих персональных данных:</p>
      <ul style={ul}>
        <li><span style={strong}>Доступ и экспорт</span> — вы можете в любой момент выгрузить все свои данные в формате JSON через раздел «Настройки».</li>
        <li><span style={strong}>Исправление</span> — вы можете изменить информацию профиля, записи о тренировках и тренировочные планы непосредственно в приложении.</li>
        <li><span style={strong}>Удаление</span> — вы можете удалить свою учётную запись и все связанные с ней данные. После удаления данные безвозвратно стираются из облачной базы в течение 30 дней. Локальные данные удаляются немедленно.</li>
        <li><span style={strong}>Переносимость данных</span> — функция экспорта в JSON предоставляет ваши данные в структурированном, машиночитаемом формате.</li>
        <li><span style={strong}>Отзыв согласия</span> — вы можете прекратить использование приложения и удалить учётную запись в любое время.</li>
      </ul>

      <p style={h2}>7. Соответствие GDPR</p>
      <p style={p}>
        Если вы находитесь на территории Европейской экономической зоны (ЕЭЗ), Великобритании или Швейцарии, обработка ваших данных осуществляется в соответствии с Общим регламентом по защите данных (ЕС) 2016/679 (GDPR). Правовым основанием для обработки являются ваше согласие (статья 6(1)(a)) и исполнение договора между вами и Kinara (статья 6(1)(b)).
      </p>
      <p style={p}>
        Вы вправе обратиться с жалобой в местный надзорный орган по защите данных, если считаете, что ваши данные обрабатываются неправомерно.
      </p>

      <p style={h2}>8. Российская Федерация — Федеральный закон № 152-ФЗ</p>
      <p style={p}>
        Если вы находитесь на территории Российской Федерации, обработка ваших персональных данных осуществляется в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных». Используя приложение и предоставляя свои персональные данные, вы даёте своё информированное и добровольное согласие на обработку данных в целях, описанных в настоящей Политике.
      </p>
      <p style={p}>
        Вы вправе запросить информацию об обработке ваших персональных данных, потребовать исправления неточных данных, а также обратиться с требованием об удалении ваших данных, связавшись с нами. При получении обоснованного запроса мы прекращаем обработку персональных данных в срок, не превышающий 30 дней.
      </p>
      <p style={p}>
        Оператором персональных данных является Kinara. Обработка осуществляется на основании согласия субъекта персональных данных (п. 1 ч. 1 ст. 6 Федерального закона № 152-ФЗ).
      </p>

      <p style={h2}>9. Возрастные ограничения</p>
      <p style={p}>
        Приложение предназначено для пользователей в возрасте от <span style={strong}>16 лет и старше</span>. Мы не собираем персональные данные лиц младше 16 лет. Если нам станет известно, что несовершеннолетний пользователь предоставил свои персональные данные, мы примем меры для их незамедлительного удаления.
      </p>

      <p style={h2}>10. Сроки хранения данных</p>
      <p style={p}>
        Мы храним ваши персональные данные в течение всего периода существования учётной записи. При удалении учётной записи все связанные данные безвозвратно удаляются из облачных систем в течение 30 дней. Резервные копии, при их наличии, уничтожаются в течение 90 дней.
      </p>

      <p style={h2}>11. Изменения настоящей Политики</p>
      <p style={p}>
        Мы можем время от времени обновлять настоящую Политику конфиденциальности. О существенных изменениях мы уведомим через приложение. Продолжение использования приложения после вступления изменений в силу означает ваше согласие с обновлённой редакцией Политики.
      </p>

      <p style={h2}>12. Связь с нами</p>
      <p style={p}>
        Если у вас есть вопросы, замечания или запросы, касающиеся настоящей Политики конфиденциальности или обработки ваших персональных данных, свяжитесь с нами:
      </p>
      <p style={{...p,color:c.primary,fontWeight:600}}>support@kinara.app</p>
    </>
  );

  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,backdropFilter:"blur(6px)",padding:"16px"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:c.card,border:`1px solid ${c.border}`,borderRadius:20,padding:"28px 24px",width:520,maxWidth:"100%",boxShadow:"0 24px 60px rgba(0,0,0,0.4)",maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexShrink:0}}>
          <p style={h1}>{isRu?"Политика конфиденциальности":"Privacy Policy"}</p>
          <button onClick={onClose} style={{background:"none",border:`1px solid ${c.border}`,color:c.textSecondary,borderRadius:7,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15,flexShrink:0}}>✕</button>
        </div>
        <div style={{overflowY:"auto",flex:1,paddingRight:4}}>
          {isRu?ru:en}
        </div>
      </div>
    </div>
  );
}
