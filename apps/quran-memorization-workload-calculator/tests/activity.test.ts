import {test,expect} from 'bun:test';
import {defaults,valid,schedule,calendar} from '../src/lib/engine';
test('revision grows while sessions remain within budget and reach exact goal',()=>{const p={...defaults,goal:20};const s=schedule(p);expect(s.status).toBe('complete');expect(s.rows.at(-1)!.memorized).toBeCloseTo(20);expect(s.rows.every(r=>r.total<=45.000001&&r.newPages<=.5&&r.newPages>0)).toBe(true);expect(s.rows.at(-1)!.reviewTime).toBeGreaterThan(s.rows[0]!.reviewTime);});
test('structural revision ceiling reports infeasible plans',()=>{expect(schedule({...defaults,memorized:200,goal:20,minutes:20,cycle:10,reviewMinutes:2}).status).toBe('capacity');});
test('invalid page totals, dates, and empty days are rejected',()=>{for(const x of [{...defaults,goal:605},{...defaults,days:[]},{...defaults,start:'2026-02-30'},{...defaults,minutes:NaN},{...defaults,reviewMinutes:0}])expect(valid(x)).toBe(false);});
test('date arithmetic respects leap day and selected weekdays',()=>{const s=schedule({...defaults,start:'2028-02-28',goal:1.5,days:[1,2,3,4,5,6,0]});expect(s.rows.map(r=>r.date)).toEqual(['2028-02-28','2028-02-29','2028-03-01']);});
test('very slow viable plans stop at the advertised horizon',()=>{const s=schedule({...defaults,goal:50,pace:.01});expect(s.status).toBe('horizon');expect(s.rows).toHaveLength(3650);});
test('calendar uses date-only events and limits exports to 90 sessions',()=>{const rows=schedule({...defaults,goal:100}).rows;const ics=calendar(rows,new Date('2026-11-11T08:09:10Z'));expect(ics.split('BEGIN:VEVENT')).toHaveLength(91);expect(ics).toContain('DTSTART;VALUE=DATE:20261027');expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);});

test('a final page may reach the revision ceiling when the session can finish it',()=>{const s=schedule({...defaults,memorized:9,goal:1,minutes:20,reviewMinutes:2,newMinutes:1,cycle:1,pace:1});expect(s.status).toBe('complete');expect(s.rows.at(-1)!.memorized).toBe(10);});
