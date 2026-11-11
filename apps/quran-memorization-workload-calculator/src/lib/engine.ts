export interface Plan {memorized:number;goal:number;minutes:number;newMinutes:number;reviewMinutes:number;pace:number;cycle:number;days:number[];start:string}
export const defaults:Plan={memorized:0,goal:20,minutes:45,newMinutes:45,reviewMinutes:2,pace:.5,cycle:14,days:[1,2,3,4,5],start:'2026-10-27'};
export function valid(p:unknown):p is Plan {
 const v=p as Plan;if(!v||typeof v!=='object')return false;
 return ['memorized','goal','minutes','newMinutes','reviewMinutes','pace','cycle'].every(k=>typeof v[k as keyof Plan]==='number'&&Number.isFinite(v[k as keyof Plan]))&&v.memorized>=0&&v.goal>0&&v.goal+v.memorized<=604&&v.minutes>=1&&v.minutes<=1440&&v.newMinutes>=1&&v.newMinutes<=1440&&v.reviewMinutes>=.1&&v.reviewMinutes<=120&&v.pace>=.01&&v.pace<=20&&Number.isInteger(v.cycle)&&v.cycle>=1&&v.cycle<=365&&Array.isArray(v.days)&&v.days.length>0&&new Set(v.days).size===v.days.length&&v.days.every(d=>Number.isInteger(d)&&d>=0&&d<=6)&&/^\d{4}-\d{2}-\d{2}$/.test(v.start)&&Number.isFinite(Date.parse(v.start))&&new Date(v.start+'T00:00:00Z').toISOString().slice(0,10)===v.start;
}
export function schedule(p:Plan){
 if(!valid(p))throw new Error('Check page totals, positive time estimates, date, and at least one study day.');
 const target=p.memorized+p.goal,ceiling=p.minutes*p.cycle/p.reviewMinutes;
 const rows:{date:string;newPages:number;reviewPages:number;reviewTime:number;total:number;memorized:number}[]=[];
 let current=p.memorized,date=new Date(p.start+'T00:00:00Z'),status='complete';
 if(target>ceiling+1e-8)return {status:'capacity',rows,ceiling,target};
 for(let day=0;current<target-1e-7&&day<36500;day++,date.setUTCDate(date.getUTCDate()+1)){
  if(!p.days.includes(date.getUTCDay()))continue;
  if(rows.length===3650){status='horizon';break;}
  const reviewPages=current/p.cycle,reviewTime=reviewPages*p.reviewMinutes;
  const newPages=Math.min(p.pace,(p.minutes-reviewTime)/p.newMinutes,target-current);
  if(newPages<1e-9){status='capacity';break;}
  current+=newPages;rows.push({date:date.toISOString().slice(0,10),newPages,reviewPages,reviewTime,total:reviewTime+newPages*p.newMinutes,memorized:current});
 }
 if(current<target-1e-7&&status==='complete')status='horizon';
 return {status,rows,ceiling,target};
}
export function icsStamp(d:Date){
 if(Number.isNaN(d.getTime()))throw new Error('Export time must be a valid date.');
 return d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
}
export function calendar(rows:ReturnType<typeof schedule>['rows'],now:Date){
 const stamp=icsStamp(now);
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Moongazer//Hifz Plan//EN',...rows.slice(0,90).flatMap((r,i)=>['BEGIN:VEVENT',`UID:study-${r.date}-${i}-${stamp}@moongazer.tech`,`DTSTAMP:${stamp}`,`DTSTART;VALUE=DATE:${r.date.replaceAll('-','')}`,`SUMMARY:Quran study - ${r.newPages.toFixed(2)} new pages`,`DESCRIPTION:Review ${r.reviewPages.toFixed(2)} pages. Estimated total ${r.total.toFixed(0)} minutes. User estimates only.`,'END:VEVENT']),'END:VCALENDAR',''].join('\r\n');
}
