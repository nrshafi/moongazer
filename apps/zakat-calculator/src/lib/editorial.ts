// Editorial text helpers for the method pages (build time). Honorifics are added to our own wording only, never to Quran text.
import { esc, withHonorifics } from './utils';

/** Escapes plain text and renders the honorific after "the Prophet" (the shared glyph markup, with its accessible name). */
export function editorial(text: string): string {
  return withHonorifics(esc(text).replace(/\b([Tt]he Prophet)\b(?! ﷺ)/g, '$1 ﷺ'));
}

export const COLLECTIONS: Record<string, string> = {
  bukhari: 'Sahih al-Bukhari',
  muslim: 'Sahih Muslim',
  abudawud: 'Sunan Abi Dawud',
  tirmidhi: 'Jami` at-Tirmidhi',
  ibnmajah: 'Sunan Ibn Majah',
  nasai: "Sunan an-Nasa'i",
};
