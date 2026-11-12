"""Generate lossless WOFF2 derivatives from licensed fonts. Social cards: _implementation/art/social-cards.mjs."""
from pathlib import Path
import json,sys,shutil
ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'deployment/.tmp/seo-python'))
from fontTools.ttLib import TTFont,woff2

fonts=ROOT/'apps/guess-the-surah/public/fonts'
cache=ROOT/'deployment/.tmp/seo-fonts'
cache.mkdir(parents=True,exist_ok=True)
records=[]
for name in ['dm-sans','newsreader','amiri']:
    source=fonts/(name+'.ttf');target=cache/(name+'.woff2')
    woff2.compress(str(source),str(target))
    original=TTFont(source);converted=TTFont(target)
    assert original.getBestCmap()==converted.getBestCmap(),name
    assert original['maxp'].numGlyphs==converted['maxp'].numGlyphs,name
    records.append({'font':name,'ttfBytes':source.stat().st_size,'woff2Bytes':target.stat().st_size,'glyphs':original['maxp'].numGlyphs,'cmapPreserved':True})
for app in (ROOT/'apps').iterdir():
    for source in cache.glob('*.woff2'):shutil.copyfile(source,app/'public/fonts'/source.name)

# Social cards moved to _implementation/art/social-cards.mjs (2026-11-13 redesign); this script now only converts fonts.
(ROOT/'deployment/evidence/seo/font-conversion.json').write_text(json.dumps(records,indent=2))
print(json.dumps({'fonts':records},indent=2))
