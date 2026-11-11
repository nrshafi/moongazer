import {test,expect} from 'bun:test';
import {defaults,schedule,calendar,icsStamp} from '../src/lib/engine';

const now=new Date('2026-11-11T08:09:10.123Z');
const rows=schedule({...defaults,goal:5}).rows;
const lines=(ics:string)=>ics.split('\r\n');
const events=(ics:string)=>{const out:Record<string,string>[]=[];let cur:Record<string,string>|null=null;for(const l of lines(ics)){if(l==='BEGIN:VEVENT')cur={};else if(l==='END:VEVENT'){out.push(cur!);cur=null;}else if(cur){const i=l.indexOf(':');cur[l.slice(0,i)]=l.slice(i+1);}}return out;};

test('calendar PRODID is the Moongazer Hifz Plan identifier',()=>{
  const ics=calendar(rows,now);
  expect(lines(ics)).toContain('PRODID:-//Moongazer//Hifz Plan//EN');
  expect(ics).not.toContain('Islamic Product Lab');
  expect(ics).not.toContain('islamic-product.local');
  expect(ics).not.toContain('20261027T000000Z');
});

test('every UID ends in @moongazer.tech and is unique per event',()=>{
  const ev=events(calendar(rows,now));
  expect(ev.length).toBe(rows.length);
  const uids=ev.map(e=>e.UID!);
  for(const u of uids)expect(u.endsWith('@moongazer.tech')).toBe(true);
  expect(new Set(uids).size).toBe(uids.length);
});

test('UIDs stay unique across exports with different timestamps and distinct for different days',()=>{
  const a=events(calendar(rows,now)).map(e=>e.UID);
  const b=events(calendar(rows,new Date('2026-11-12T00:00:00Z'))).map(e=>e.UID);
  expect(a.some((u,i)=>u===b[i])).toBe(false);
});

test('DTSTAMP is the export time in YYYYMMDDTHHMMSSZ form',()=>{
  expect(icsStamp(now)).toBe('20261111T080910Z');
  const ev=events(calendar(rows,now));
  for(const e of ev){expect(e.DTSTAMP).toBe('20261111T080910Z');expect(e.DTSTAMP).toMatch(/^\d{8}T\d{6}Z$/);}
});

test('invalid export time is rejected',()=>{
  expect(()=>icsStamp(new Date('not a date'))).toThrow();
});
