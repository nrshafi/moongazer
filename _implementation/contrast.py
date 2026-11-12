"""WCAG 2.x contrast ratios for the D20 family tokens (P5, T5.2). Prints the table used in DESIGN.md.
Run: python _implementation/contrast.py
"""
FAMILIES = {
    'quran': {
        'light': dict(bg='#f5f8fa', surface='#ffffff', ink='#172a35', muted='#5c707b', accent='#087f75', accent_hover='#06665f', tint='#e5f3ef', accent_ink='#07685f', on_accent='#ffffff'),
        'dark': dict(bg='#101a24', surface='#16232e', ink='#edf4f7', muted='#a5b7c1', accent='#78d4c2', accent_hover='#9ce7d7', tint='#203d3c', accent_ink='#78d4c2', on_accent='#0b1a1f'),
    },
    'gold': {
        'light': dict(bg='#faf7f2', surface='#ffffff', ink='#2b2622', muted='#6b645c', accent='#b8860b', accent_hover='#cc9a22', tint='#fef8eb', accent_ink='#7a5a00', on_accent='#1f1a14'),
        'dark': dict(bg='#181512', surface='#221e1a', ink='#f7f4ed', muted='#a8a096', accent='#e5b94e', accent_hover='#f0cc75', tint='#332b1f', accent_ink='#e5b94e', on_accent='#1f1a14'),
    },
    'blue': {
        'light': dict(bg='#f5f7fc', surface='#ffffff', ink='#0e1b2e', muted='#53637a', accent='#2563eb', accent_hover='#1d4ed8', tint='#eff4fe', accent_ink='#1d4ed8', on_accent='#ffffff'),
        'dark': dict(bg='#0c121e', surface='#141c2c', ink='#eef2f9', muted='#95a3b8', accent='#60a5fa', accent_hover='#93c5fd', tint='#1c283f', accent_ink='#7cb5fb', on_accent='#0c121e'),
    },
    'violet': {
        'light': dict(bg='#f8f6fb', surface='#ffffff', ink='#261938', muted='#6e5c85', accent='#7c3aed', accent_hover='#6d28d9', tint='#f3effc', accent_ink='#6d28d9', on_accent='#ffffff'),
        'dark': dict(bg='#140e1f', surface='#1e152d', ink='#f5f2fa', muted='#b09fc7', accent='#a78bfa', accent_hover='#c4b5fd', tint='#2c1e42', accent_ink='#b7a1fb', on_accent='#140e1f'),
    },
}

def lum(hex_):
    r, g, b = (int(hex_[i:i + 2], 16) / 255 for i in (1, 3, 5))
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)

def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)

PAIRS = [('ink', 'bg'), ('ink', 'surface'), ('muted', 'bg'), ('muted', 'surface'), ('accent_ink', 'bg'), ('accent_ink', 'surface'), ('accent_ink', 'tint'), ('ink', 'tint'), ('on_accent', 'accent'), ('on_accent', 'accent_hover')]

if __name__ == '__main__':
    failures = 0
    print('| Family | Theme | ' + ' | '.join(f'{a} on {b}' for a, b in PAIRS) + ' |')
    print('|' + ' --- |' * (len(PAIRS) + 2))
    for family, themes in FAMILIES.items():
        for theme, t in themes.items():
            cells = []
            for a, b in PAIRS:
                r = ratio(t[a], t[b])
                ok = r >= 4.5
                failures += not ok
                cells.append(f'{r:.2f}' + ('' if ok else ' ✗'))
            print(f'| {family} | {theme} | ' + ' | '.join(cells) + ' |')
    print(f'\n{failures} pairs below 4.5:1')
