export interface Filters { query:string; topic:string; region:string; age:string; from:string; to:string; }
export interface CatalogEntry { search:string; topic:string; region:string; age:string; start:number; end:number; }
export function normalize(value: string) { return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
export function matchesFilters(entry: CatalogEntry, filters: Filters) {
  const terms = normalize(filters.query).split(/\s+/).filter(Boolean);
  return terms.every(term => normalize(entry.search).includes(term)) && (!filters.topic || entry.topic === filters.topic) && (!filters.region || entry.region === filters.region) && (!filters.age || entry.age === filters.age) && (!filters.from || entry.end >= Number(filters.from)) && (!filters.to || entry.start <= Number(filters.to));
}
