#!/usr/bin/env python3
"""Audit built HTML for text joined with no whitespace across element boundaries.

Usage (after building the apps and the homepage):
  python _implementation/audit-text-joins.py            # list unexplained joins
  python _implementation/audit-text-joins.py --summary  # counts per app
  python _implementation/audit-text-joins.py --bdi      # Arabic text outside dir=rtl/<bdi> next to Latin text
  python _implementation/audit-text-joins.py --all      # also show allowlisted joins

Allowlist: _implementation/audit-text-joins.allow, one context substring per line followed by "  # reason".
Exit code 1 when unexplained joins (or BDI findings with --bdi) remain.
"""
import re, sys, glob, os
from html.parser import HTMLParser
from collections import OrderedDict

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
MARK = '⟨|⟩'
SKIP = {'script', 'style', 'template', 'svg', 'noscript', 'head', 'title', 'select', 'datalist'}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}
INLINE = {'span', 'a', 'small', 'strong', 'em', 'b', 'i', 'time', 'code', 'label', 'button', 'abbr', 'mark',
          'cite', 'q', 'sup', 'sub', 'bdi', 'bdo', 'kbd', 'samp', 'var', 'u', 's', 'dfn', 'data'}
BLOCK = {'div', 'li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section', 'article', 'header', 'footer', 'nav',
         'ul', 'ol', 'dl', 'dt', 'dd', 'figure', 'figcaption', 'blockquote', 'main', 'aside', 'details',
         'summary', 'table', 'tr', 'td', 'th', 'form', 'fieldset', 'legend', 'pre', 'option', 'select',
         'textarea'}
BREAKERS = {'br', 'hr'}
CONTAINERISH = {'a', 'button', 'summary', 'label'}
ARABIC = re.compile('[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]')
LATIN = re.compile('[A-Za-z]')
CLOSERS = set(')]}.,;:!?\'"”’%»')
SPACES = ' \t\r\n '


def flex_classes(css_text):
    out = set()
    for m in re.finditer(r'([^{}]+)\{([^{}]*)\}', css_text):
        sel, body = m.group(1), m.group(2)
        if re.search(r'display\s*:\s*(inline-)?(flex|grid)', body):
            for c in re.findall(r'\.([A-Za-z_][\w-]*)', sel):
                out.add(c)
    return out


class El:
    __slots__ = ('tag', 'attrs', 'parent')

    def __init__(self, tag, attrs, parent):
        self.tag, self.attrs, self.parent = tag, dict(attrs), parent

    def chain(self):
        e, out = self, []
        while e is not None:
            out.append(e)
            e = e.parent
        return out[::-1]


class Walker(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.cur = None
        self.skip_depth = 0
        self.nodes = []  # (text, element, break_before)
        self.brk = False
        self.stack = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in BREAKERS:
            self.brk = True
        if tag in VOID:
            return
        el = El(tag, attrs, self.cur)
        self.cur = el
        self.stack.append(el)
        if tag in SKIP or 'hidden' in a or a.get('aria-hidden') == 'true':
            self.skip_depth += 1
            el.attrs['__skip'] = '1'

    def handle_startendtag(self, tag, attrs):
        if tag in BREAKERS:
            self.brk = True

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i].tag == tag:
                while len(self.stack) > i:
                    el = self.stack.pop()
                    if el.attrs.get('__skip'):
                        self.skip_depth -= 1
                self.cur = self.stack[-1] if self.stack else None
                return

    def handle_data(self, data):
        if self.skip_depth or not data or self.cur is None:
            return
        self.nodes.append((data, self.cur, self.brk))
        self.brk = False


def load_allow():
    path = os.path.join(ROOT, '_implementation', 'audit-text-joins.allow')
    items = []
    if os.path.exists(path):
        for line in open(path, encoding='utf-8'):
            line = line.rstrip('\n')
            if not line.strip() or line.lstrip().startswith('#'):
                continue
            pat = line.split('  #')[0].strip()
            if pat:
                items.append(pat)
    return items


def pages():
    for d in sorted(glob.glob(os.path.join(ROOT, 'apps', '*', 'dist'))):
        app = os.path.basename(os.path.dirname(d))
        for f in sorted(glob.glob(os.path.join(d, '**', '*.html'), recursive=True)):
            yield app, d, f
    d = os.path.join(ROOT, 'homepage', 'dist')
    for f in sorted(glob.glob(os.path.join(d, '**', '*.html'), recursive=True)):
        yield 'homepage', d, f


def css_for(dist):
    txt = ''
    for f in glob.glob(os.path.join(dist, '**', '*.css'), recursive=True):
        txt += open(f, encoding='utf-8', errors='replace').read()
    return txt


def is_flex(el, flex):
    cls = (el.attrs.get('class') or '').split()
    if any(c in flex for c in cls):
        return True
    return bool(re.search(r'display\s*:\s*(inline-)?(flex|grid)', el.attrs.get('style') or ''))


def find_joins(nodes, flex):
    res = []
    prev = None
    for text, el, brk in nodes:
        if not text.strip():
            prev = None  # whitespace-only node separates
            continue
        if prev is not None and not brk:
            ptext, pel = prev
            a, b = ptext[-1], text[0]
            if a not in SPACES and b not in SPACES and (a.isalnum() or a in CLOSERS) and b.isalnum() \
                    and pel is not el and not (ARABIC.match(a) and ARABIC.match(b)):
                ca, cb = pel.chain(), el.chain()
                d = 0
                while d < min(len(ca), len(cb)) and ca[d] is cb[d]:
                    d += 1
                lca = ca[d - 1] if d else None
                sides = ca[d:] + cb[d:]
                has_block = any(e.tag in BLOCK for e in sides)
                has_inline = any(e.tag in INLINE for e in sides)
                container = lca is not None and (is_flex(lca, flex) or any(e.tag in CONTAINERISH for e in ca[:d]))
                if (has_inline and not has_block) or (has_block and container):
                    sa = ca[d] if len(ca) > d else None
                    sb = cb[d] if len(cb) > d else None
                    sig = tuple((e.tag, (e.attrs.get('class') or '')) if e else ('#text', '') for e in (sa, sb))
                    res.append((ptext, text, sig))
        prev = (text, el)
    return res


def ctx(a, b, width=30):
    a = re.sub(r'\s+', ' ', a)[-width:]
    b = re.sub(r'\s+', ' ', b)[:width]
    return f'{a}{MARK}{b}'


def bdi_findings(nodes):
    out = []
    for text, el, _ in nodes:
        t = text.replace('ﷺ', '')
        if not ARABIC.search(t) or not LATIN.search(t):
            continue
        e, ok = el, False
        while e is not None:
            if e.tag == 'bdi' or (e.attrs.get('dir') or '').lower() == 'rtl':
                ok = True
                break
            e = e.parent
        if not ok:
            s = re.sub(r'\s+', ' ', t)
            i = max(0, ARABIC.search(s).start() - 30)
            out.append(f'<{el.tag}> ...{s[i:i + 70]}...')
    return out


def main():
    args = sys.argv[1:]
    bdi, summary, show_all = '--bdi' in args, '--summary' in args, '--all' in args
    allow = load_allow()
    flexcache = {}
    found, allowed = OrderedDict(), OrderedDict()
    files = 0
    sigs = {}
    for app, dist, f in pages():
        files += 1
        w = Walker()
        w.feed(open(f, encoding='utf-8', errors='replace').read())
        rel = os.path.relpath(f, ROOT).replace('\\', '/')
        if bdi:
            for c in bdi_findings(w.nodes):
                found.setdefault((app, c), []).append(rel)
            continue
        if dist not in flexcache:
            flexcache[dist] = flex_classes(css_for(dist))
        for a, b, sig in find_joins(w.nodes, flexcache[dist]):
            sigs.setdefault(app, set()).add(sig)
            c = ctx(a, b)
            (allowed if any(p in c for p in allow) else found).setdefault((app, c), []).append(rel)
    if '--signatures' in args:
        import json
        out = {a: sorted(list(x) for x in v) for a, v in sigs.items()}
        json.dump(out, open(args[args.index('--signatures') + 1], 'w'))
    counts, total = {}, 0
    for (app, c), fl in found.items():
        counts[app] = counts.get(app, 0) + len(fl)
        total += len(fl)
    if summary:
        for app, n in sorted(counts.items()):
            print(f'{app}: {n}')
        print(f'unique={len(found)} occurrences={total} allowlisted_unique={len(allowed)} pages={files}')
    else:
        for (app, c), fl in found.items():
            print(f'{app}\t{fl[0]}' + (f' (+{len(fl) - 1} more)' if len(fl) > 1 else '') + f'\t{c}')
        if show_all:
            for (app, c), fl in allowed.items():
                print(f'ALLOWED {app}\t{fl[0]}\t{c}')
        label = 'BDI findings' if bdi else 'unexplained joins'
        print(f'-- {label}: unique={len(found)} occurrences={total} pages={files}')
    sys.exit(1 if found else 0)


if __name__ == '__main__':
    main()
