// End-of-session block (P5, DESIGN.md section 5): result, what you learned, share, one next app, optional tomorrow slot, report-an-error link.
// The caller supplies every string. The share text is passed in by the caller and must never contain the answer;
// this module only encodes it (clipboard and wa.me), adds no tracking parameters and records the anonymous share_clicked count.
import { copy } from './utils';
import { track } from './counter';

export interface NextApp { name: string; url: string }
export interface SessionEndOptions {
  /** One line, for example "You scored 7 of 10". */
  result: string;
  /** "What you learned": 1-3 plain lines; references such as "Quran 2:255" are allowed. */
  learned: string[];
  /** Plain share text chosen by the caller (never the answer). */
  shareText: string;
  /** Counter item id for share_clicked (see counterItemId in counter.ts). */
  itemId: string;
  /** One recommended next app. */
  next: NextApp;
  /** Optional "New puzzle tomorrow" note for daily games. */
  tomorrow?: string;
  /** Accessible label of the block; defaults to "Session complete". */
  heading?: string;
}

const WHATSAPP = 'https://wa.me/';

/** WhatsApp share link: the URL-encoded plain text only, no other query parameters. */
export function whatsappUrl(text: string): string { return `${WHATSAPP}?text=${encodeURIComponent(text)}`; }

/** Joins non-empty plain lines with newlines for a share message. */
export function buildShareText(lines: readonly string[]): string { return lines.map(line => line.trim()).filter(Boolean).join('\n'); }

/** "What you learned" is limited to 1-3 non-empty lines. */
export function learnedLines(lines: readonly string[]): string[] { return lines.map(line => line.trim()).filter(Boolean).slice(0, 3); }

function isHttpUrl(value: string): boolean { try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:'; } catch { return false; } }

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** Renders the block into `container`, replacing its contents. Uses text nodes only (no HTML injection). */
export function renderSessionEnd(container: HTMLElement, options: SessionEndOptions): void {
  const root = el('section', 'session-end');
  root.setAttribute('aria-label', options.heading ?? 'Session complete');

  root.append(el('p', 'session-result', options.result));

  const learned = learnedLines(options.learned);
  if (learned.length) {
    const block = el('div', 'session-learned');
    block.append(el('h3', undefined, 'What you learned'));
    const list = el('ul');
    for (const line of learned) list.append(el('li', undefined, line));
    block.append(list);
    root.append(block);
  }

  const share = el('div', 'session-share actions');
  const copyButton = el('button', 'button secondary small', 'Copy');
  copyButton.type = 'button';
  copyButton.addEventListener('click', () => { track('share_clicked', options.itemId); void copy(options.shareText); });
  const whatsapp = el('a', 'button secondary small', 'WhatsApp');
  whatsapp.href = whatsappUrl(options.shareText);
  whatsapp.target = '_blank';
  whatsapp.rel = 'noopener noreferrer';
  whatsapp.addEventListener('click', () => { track('share_clicked', options.itemId); });
  share.append(el('span', 'label', 'Share'), copyButton, whatsapp);
  root.append(share);

  if (isHttpUrl(options.next.url)) {
    const next = el('p', 'session-next');
    next.append('Next: ');
    const link = el('a', undefined, options.next.name);
    link.href = options.next.url;
    next.append(link);
    root.append(next);
  }

  if (options.tomorrow) root.append(el('p', 'session-tomorrow muted', options.tomorrow));

  const report = el('p', 'session-report');
  const link = el('a', 'feedback-link');
  link.href = '#site-feedback';
  link.setAttribute('data-open-feedback', '');
  link.append('Report an error ');
  const arrow = el('span', undefined, '→');
  arrow.setAttribute('aria-hidden', 'true');
  link.append(arrow);
  report.append(link);
  root.append(report);

  container.replaceChildren(root);
}
