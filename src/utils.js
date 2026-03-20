export const DOW_SHORT=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export const localDateStr=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

/**
 * Schedule-based streak calculation.
 * A streak counts consecutive days where the user followed their schedule:
 * - Workout days (schedule has a plan ID): must have a logged workout
 * - Free days (schedule is null): automatically count — anything the user does is fine
 * - Rest days logged explicitly: always count
 * - Sick days: protect the streak (max 3 per rolling 30 days to prevent abuse)
 * - Extra rest tolerance: up to 2 unscheduled rest/free days per week without breaking
 *
 * If the user misses a scheduled workout day and doesn't log rest/sick, streak breaks.
 */
export const calcStreak=(sessions,restDaysLog=[],schedule={},sickDaysLog=[])=>{
  const today=new Date();today.setHours(0,0,0,0);
  const todayS=localDateStr(today);
  const workoutDates=new Set(sessions.map(s=>s.date));
  const restDates=new Set(restDaysLog);
  const sickDates=new Set(sickDaysLog);
  // Start from today (or yesterday if nothing logged today yet)
  const hasToday=workoutDates.has(todayS)||restDates.has(todayS)||sickDates.has(todayS);
  const startOff=hasToday?0:1;
  let streak=0;
  let weekMissedCount=0; // track missed scheduled days in current rolling 7-day window
  for(let i=startOff;i<365;i++){
    const d=new Date(today);d.setDate(today.getDate()-i);
    const ds=localDateStr(d);
    const dow=d.getDay();
    const scheduledPlan=schedule[dow];
    const didWorkout=workoutDates.has(ds);
    const didRest=restDates.has(ds);
    const isSick=sickDates.has(ds);
    // Reset weekly miss counter every 7 days
    if(i>startOff&&(i-startOff)%7===0)weekMissedCount=0;
    if(didWorkout||didRest||isSick){
      // Any logged activity counts toward streak
      streak++;
    } else if(scheduledPlan===null||scheduledPlan===undefined){
      // Free day — counts automatically, no action required
      streak++;
    } else {
      // Scheduled workout day but nothing logged
      // Allow up to 2 grace misses per week (extra rest tolerance)
      weekMissedCount++;
      if(weekMissedCount<=2){
        streak++; // grace — treat as implicit rest
      } else {
        break; // streak broken
      }
    }
  }
  return streak;
};

/** Count how many sick days were used in the last 30 days */
export const sickDaysUsedLast30=(sickDaysLog=[])=>{
  const cutoff=new Date();cutoff.setDate(cutoff.getDate()-30);
  return sickDaysLog.filter(ds=>new Date(ds)>=cutoff).length;
};

/** Max sick days allowed per 30-day rolling window */
export const MAX_SICK_DAYS_PER_30=3;

export const calcTrainingLoads=(sessions)=>{if(!sessions.length)return{atl:0,ctl:0,tsb:0};const daily={};sessions.forEach(s=>{daily[s.date]=(daily[s.date]||0)+s.totalVolume;});const maxV=Math.max(...Object.values(daily),1);const kA=1-Math.exp(-1/7),kC=1-Math.exp(-1/42);let atl=0,ctl=0;const today=new Date();for(let i=83;i>=0;i--){const d=new Date(today);d.setDate(today.getDate()-i);const load=((daily[localDateStr(d)]||0)/maxV)*100;atl+=kA*(load-atl);ctl+=kC*(load-ctl);}return{atl:Math.round(atl*10)/10,ctl:Math.round(ctl*10)/10,tsb:Math.round((ctl-atl)*10)/10};};

export const detectPlateaus=(sessions)=>{const exData={};sessions.forEach(s=>s.exercises.forEach(ex=>{if(!exData[ex.name])exData[ex.name]=[];const maxW=Math.max(...ex.sets.map(s2=>parseFloat(s2.weight)||0),0);if(maxW>0)exData[ex.name].push({date:s.date,w:maxW});}));const res={};const now=new Date();Object.entries(exData).forEach(([name,data])=>{data.sort((a,b)=>new Date(a.date)-new Date(b.date));const c1=new Date(now);c1.setDate(now.getDate()-21);const c2=new Date(now);c2.setDate(now.getDate()-42);const rec=data.filter(d=>new Date(d.date)>=c1);const prev=data.filter(d=>new Date(d.date)>=c2&&new Date(d.date)<c1);const rMax=rec.length?Math.max(...rec.map(d=>d.w)):0;const pMax=prev.length?Math.max(...prev.map(d=>d.w)):0;if(rMax>0)res[name]={rMax,pMax,ok:pMax===0||rMax>pMax,change:pMax>0?((rMax-pMax)/pMax*100).toFixed(1):null};});return res;};

export const calcConsistency=(sessions,wks=8)=>{if(!sessions.length)return 0;const now=new Date();let hit=0;for(let w=0;w<wks;w++){const s=new Date(now);s.setDate(now.getDate()-(w+1)*7);const e=new Date(now);e.setDate(now.getDate()-w*7);if(sessions.some(x=>new Date(x.date)>=s&&new Date(x.date)<e))hit++;}return Math.round((hit/wks)*100);};

export const getAchievements=(sessions,restDaysLog,exPRs)=>{const streak=calcStreak(sessions,restDaysLog);const totalVol=sessions.reduce((a,s)=>a+s.totalVolume,0);const weekMap={};sessions.forEach(s=>{const d=new Date(s.date);const wk=`${d.getFullYear()}-W${Math.ceil(d.getDate()/7)}`;weekMap[wk]=(weekMap[wk]||0)+1;});const maxWeekSessions=Math.max(...Object.values(weekMap),0);const prCount=Object.keys(exPRs).length;const restCount=restDaysLog.length;const exNameSet=new Set();const exFreqMap={};sessions.forEach(s=>s.exercises.forEach(ex=>{exNameSet.add(ex.name);exFreqMap[ex.name]=(exFreqMap[ex.name]||0)+1;}));const uniqueExercises=exNameSet.size;const maxExFreq=Math.max(...Object.values(exFreqMap),0);const maxSessionSets=sessions.length?Math.max(...sessions.map(s=>s.exercises.reduce((a,ex)=>a+ex.sets.length,0))):0;const maxSessionDuration=sessions.length?Math.max(...sessions.map(s=>s.duration||0)):0;const consistency=calcConsistency(sessions);return[{id:"first",icon:"target",label:"First Blood",desc:"Complete your first workout",earned:sessions.length>=1,current:Math.min(sessions.length,1),target:1},{id:"week3",icon:"calendar",label:"Week Warrior",desc:"3 workouts in one week",earned:maxWeekSessions>=3,current:Math.min(maxWeekSessions,3),target:3},{id:"streak7",icon:"fire",label:"On Fire",desc:"7-day activity streak",earned:streak>=7,current:Math.min(streak,7),target:7},{id:"streak30",icon:"lightning",label:"Unstoppable",desc:"30-day streak",earned:streak>=30,current:Math.min(streak,30),target:30},{id:"pr5",icon:"trophy",label:"PR Hunter",desc:"Set 5 personal records",earned:prCount>=5,current:Math.min(prCount,5),target:5},{id:"s10",icon:"dumbbell",label:"Dedicated",desc:"Complete 10 workouts",earned:sessions.length>=10,current:Math.min(sessions.length,10),target:10},{id:"s50",icon:"lion",label:"Veteran",desc:"Complete 50 workouts",earned:sessions.length>=50,current:Math.min(sessions.length,50),target:50},{id:"vol10k",icon:"strength",label:"Heavy Lifter",desc:"10,000 kg total volume",earned:totalVol>=10000,current:Math.min(Math.round(totalVol),10000),target:10000},{id:"pr10",icon:"crown",label:"Record Breaker",desc:"10 personal records",earned:prCount>=10,current:Math.min(prCount,10),target:10},{id:"s100",icon:"star",label:"Legend",desc:"Complete 100 workouts",earned:sessions.length>=100,current:Math.min(sessions.length,100),target:100},{id:"streak14",icon:"shield",label:"Warrior",desc:"14-day activity streak",earned:streak>=14,current:Math.min(streak,14),target:14},{id:"streak60",icon:"chain",label:"Iron Will",desc:"60-day streak",earned:streak>=60,current:Math.min(streak,60),target:60},{id:"streak100",icon:"diamond",label:"Immortal",desc:"100-day streak",earned:streak>=100,current:Math.min(streak,100),target:100},{id:"pr20",icon:"medal",label:"PR Machine",desc:"20 personal records",earned:prCount>=20,current:Math.min(prCount,20),target:20},{id:"s200",icon:"medal",label:"Marathon Runner",desc:"Complete 200 workouts",earned:sessions.length>=200,current:Math.min(sessions.length,200),target:200},{id:"vol50k",icon:"bomb",label:"Volume King",desc:"50,000 kg total volume",earned:totalVol>=50000,current:Math.min(Math.round(totalVol),50000),target:50000},{id:"vol100k",icon:"pillar",label:"Titan",desc:"100,000 kg total volume",earned:totalVol>=100000,current:Math.min(Math.round(totalVol),100000),target:100000},{id:"rest10",icon:"moon",label:"Rest Master",desc:"Log 10 rest days",earned:restCount>=10,current:Math.min(restCount,10),target:10},{id:"rest30",icon:"lotus",label:"Recovery Pro",desc:"Log 30 rest days",earned:restCount>=30,current:Math.min(restCount,30),target:30},{id:"diverse10",icon:"palette",label:"Diversified",desc:"Train 10 different exercises",earned:uniqueExercises>=10,current:Math.min(uniqueExercises,10),target:10},{id:"specialist",icon:"microscope",label:"Specialist",desc:"Train one exercise 20+ times",earned:maxExFreq>=20,current:Math.min(maxExFreq,20),target:20},{id:"week5",icon:"explosion",label:"Power Week",desc:"5 workouts in one week",earned:maxWeekSessions>=5,current:Math.min(maxWeekSessions,5),target:5},{id:"consistent",icon:"chart",label:"Consistent",desc:"80%+ consistency last 8 weeks",earned:consistency>=80,current:consistency,target:80},{id:"endurance",icon:"heart",label:"Endurance",desc:"Complete a 60+ minute workout",earned:maxSessionDuration>=3600,current:Math.min(maxSessionDuration>=3600?1:0,1),target:1},{id:"centurion",icon:"pillar",label:"Centurion",desc:"100 total sets in a single workout",earned:maxSessionSets>=100,current:Math.min(maxSessionSets>=100?1:0,1),target:1}];};

export const getPlanBg=(panel,isDark)=>{const dm={push:`linear-gradient(145deg,#1C1210,#241608,#281408)`,pull:`linear-gradient(145deg,#121218,#141420,#161628)`,legs:`linear-gradient(145deg,#1A1010,#220E0E,#281010)`,upper:`linear-gradient(145deg,#101814,#101E14,#102414)`};const lm={push:`linear-gradient(145deg,#F5EBE6,#FAF2ED,#FFF8F5)`,pull:`linear-gradient(145deg,#EAEBF8,#EEF2FA,#F5F2FF)`,legs:`linear-gradient(145deg,#F5E8E8,#FAF0EF,#FFF5F5)`,upper:`linear-gradient(145deg,#E8F5EC,#EFF8F1,#F5FFF7)`};return(isDark?dm:lm)[panel]||(isDark?dm.push:lm.push);};

export function playBeeps(){try{const ctx=new(window.AudioContext||window.webkitAudioContext)();[[0,880],[0.22,880],[0.44,1047]].forEach(([t,f])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(0.35,ctx.currentTime+t);g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.18);o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+0.2);});}catch(e){}}

export function autoFillRestDays(sessions,restDaysLog){
  const actDates=new Set([...sessions.map(s=>s.date),...restDaysLog]);
  if(actDates.size===0)return[];
  const sorted=[...actDates].sort();
  const firstDate=new Date(sorted[0]);
  const today=new Date();today.setHours(0,0,0,0);
  const newRest=[];
  const d=new Date(firstDate);d.setDate(d.getDate()+1);
  while(d<today){
    const ds=localDateStr(d);
    if(!actDates.has(ds))newRest.push(ds);
    d.setDate(d.getDate()+1);
  }
  return newRest;
}

export function getThisWeekMonday(){const t=new Date();const d=t.getDay();const diff=d===0?-6:1-d;const m=new Date(t);m.setDate(t.getDate()+diff);m.setHours(0,0,0,0);return m;}

export function getUpNextDays(schedule,plans,count=3){const res=[];const today=new Date();for(let i=0;i<14&&res.length<count;i++){const d=new Date(today);d.setDate(today.getDate()+i);const pid=schedule[d.getDay()];if(pid&&pid!=="rest"){const plan=plans.find(p=>p.id===pid);if(plan)res.push({d,dow:d.getDay(),plan,isToday:i===0,daysFrom:i});}}return res;}
