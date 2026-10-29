"""Generate local social cards and lossless WOFF2 derivatives from licensed fonts."""
from pathlib import Path
import json,sys,shutil
ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'deployment/.tmp/seo-python'))
from PIL import Image,ImageDraw,ImageFont
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

catalog=json.loads((ROOT/'deployment/targets.json').read_text())
cards=[{'slug':'homepage','name':'Free Islamic learning apps','category':'Quran, Seerah & everyday learning'}]+catalog
for card in cards:
    image=Image.new('RGB',(1200,630),'#12263d');draw=ImageDraw.Draw(image)
    sans=lambda size:ImageFont.truetype(str(fonts/'dm-sans.ttf'),size)
    serif=lambda size:ImageFont.truetype(str(fonts/'newsreader.ttf'),size)
    draw.ellipse((840,95,1160,415),outline='#344d65',width=2)
    draw.ellipse((872,128,1128,384),fill='#e9c992')
    draw.ellipse((931,94,1165,328),fill='#12263d')
    draw.line((804,434,1160,66),fill='#435b70',width=2)
    for x,y,r in [(835,117,5),(1145,442,4),(980,460,3),(1090,56,3)]:draw.ellipse((x-r,y-r,x+r,y+r),fill='#e9c992')
    draw.text((66,54),'moongazer.',font=sans(34),fill='#e9c992')
    draw.text((67,133),card['category'].upper(),font=sans(16),fill='#bdcbd8')
    title=card['name'];lines=[]
    for size in [64,60,56,52,48,44]:
        face=serif(size);lines=[];line=''
        for word in title.split():
            candidate=(line+' '+word).strip()
            if draw.textlength(candidate,font=face)>710 and line:lines.append(line);line=word
            else:line=candidate
        if line:lines.append(line)
        if len(lines)<=3:break
    assert len(lines)<=3,title
    y=203
    for line in lines:
        assert draw.textlength(line,font=face)<=710,title
        draw.text((64,y),line,font=face,fill='#f4f7fb');y+=size+14
    draw.line((67,521,1133,521),fill='#344d65',width=2)
    hostname='moongazer.tech' if card['slug']=='homepage' else card['slug']+'.moongazer.tech'
    draw.text((67,551),hostname,font=sans(18),fill='#bdcbd8')
    draw.text((971,550),'Free to use',font=sans(17),fill='#e9c992')
    out=ROOT/'homepage/social-card.png' if card['slug']=='homepage' else ROOT/'apps'/card['slug']/'public/social-card.png'
    image.save(out,optimize=True)
(ROOT/'deployment/evidence/seo/font-conversion.json').write_text(json.dumps(records,indent=2))
print(json.dumps({'socialCards':len(cards),'fonts':records},indent=2))
