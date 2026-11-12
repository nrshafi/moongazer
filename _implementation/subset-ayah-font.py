"""P6 T6.6: subset Amiri to the characters in homepage/ayat-of-the-night.json for the directory's ayah of the night.
Run after the ayah list changes:
  PYTHONPATH=deployment/.tmp/seo-python python _implementation/subset-ayah-font.py
Source: apps/guess-the-surah/public/fonts/amiri.woff2 (SIL OFL 1.1, licence copied as homepage fonts/amiri-OFL.txt).
All OpenType layout features are kept so Arabic shaping and mark placement match the full font."""
import json
from pathlib import Path
from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
ayat = json.loads((ROOT / 'homepage/ayat-of-the-night.json').read_text(encoding='utf-8'))
chars = sorted({c for a in ayat for c in a['arabic'] if not c.isspace()} | {' ', '‌', '‍', '۝'})
opts = subset.Options()
opts.flavor = 'woff2'
opts.layout_features = ['*']
opts.name_IDs = ['*']
opts.notdef_outline = True
font = subset.load_font(str(ROOT / 'apps/guess-the-surah/public/fonts/amiri.woff2'), opts)
sub = subset.Subsetter(opts)
sub.populate(unicodes=[ord(c) for c in chars])
sub.subset(font)
out = ROOT / 'homepage/amiri-ayat.woff2'
subset.save_font(font, str(out), opts)
print(f'{len(chars)} characters, {out.stat().st_size} bytes -> {out.relative_to(ROOT)}')
