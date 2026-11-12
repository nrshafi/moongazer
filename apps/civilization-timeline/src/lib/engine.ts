export interface DateBand { start:number; end:number; }
export function compareBands(a: DateBand, b: DateBand) {
  for (const band of [a,b]) {
    if (!Number.isInteger(band.start) || !Number.isInteger(band.end) || band.start > band.end) throw new Error('Invalid date band');
  }
  const start = Math.max(a.start,b.start);
  const end = Math.min(a.end,b.end);
  return start <= end
    ? { overlap:true, start, end, gap:0 }
    : { overlap:false, start:Math.min(a.end,b.end), end:Math.max(a.start,b.start), gap:Math.max(a.start,b.start)-Math.min(a.end,b.end) };
}
