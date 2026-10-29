from pathlib import Path
import json,hashlib,random
ROOT=Path(__file__).resolve().parent.parent
R=ROOT/'_implementation/research'
q=json.loads((R/'quran-full.json').read_text(encoding='utf-8'))
prov=json.loads((R/'batch2-provenance.json').read_text(encoding='utf-8'))
def passage(ref):
 c,span=ref.split(':');a,b=span.split('-') if '-' in span else (span,span)
 parts=[q['verses'][f'{c}:{i}'] for i in range(int(a),int(b)+1)]
 return dict(ref=ref,arabic='\n'.join(v['arabic'] for v in parts),translation='\n'.join(v['translation'] for v in parts),url=f'https://quran.com/{ref}',translationUrl=f'https://quran.com/{ref}?translations=19')
topics=json.loads((ROOT/'apps/quran-connections/src/data/content.json').read_text(encoding='utf-8'))['puzzles']
groups={'Worship':['prayer','fasting','trust-in-allah','gratitude','hope'],'Community':['justice','giving','parents','keeping-commitments','privacy','human-relationships','orphans','consultation','reconciliation','hospitality'],'Reflection':['learning','time-and-effort','signs-in-creation','night-and-day','accountability','truth-and-falsehood']}
for t in topics:
 t['category']=next((g for g,ids in groups.items() if t['id'] in ids),'Character')
 peers=[p['id'] for p in topics if p['id']!=t['id'] and next((g for g,ids in groups.items() if p['id'] in ids),'Character')==t['category']]
 t['related']=peers[:4]
# Names identify Quranic subjects; selected passages are the content, not invented biographies.
profiles=[
 ('adam','Adam','Beginnings','2:30-39','7:19-23','The garden and repentance'),
 ('idris','Idris','Brief mentions','19:56-57','21:85-86','Truthfulness and patience'),
 ('nuh','Nuh','Perseverance','11:36-44','71:5-10','Calling his people and the ship'),
 ('hud','Hud','Calling to Allah','7:65-72','11:50-56','An address to the people of Aad'),
 ('salih','Salih','Calling to Allah','7:73-79','11:61-68','The she-camel and a warning'),
 ('ibrahim','Ibrahim','Trust and prayer','14:35-41','51:24-30','Prayer and guests'),
 ('lut','Lut','Calling to Allah','11:77-83','26:160-175','The messengers and his people'),
 ('ismail','Ismail','Trust and prayer','19:54-55','2:127-129','Keeping promises and prayer'),
 ('ishaq','Ishaq','Family','11:71-73','37:112-113','Good tidings and blessing'),
 ('yaqub','Yaqub','Family','12:18','12:86-87','Patience and hope'),
 ('yusuf','Yusuf','Perseverance','12:4-6','12:90-92','A dream and forgiveness'),
 ('ayyub','Ayyub','Perseverance','21:83-84','38:41-44','A call in adversity'),
 ('shuayb','Shuayb','Calling to Allah','7:85-93','11:84-88','Fair measure and honest trade'),
 ('musa','Musa','Trust and prayer','20:25-36','26:60-68','A prayer and the sea'),
 ('harun','Harun','Family','20:29-36','20:90-94','Support and a warning'),
 ('dhul-kifl','Dhul-Kifl','Brief mentions','21:85-86','38:48','Patience and the chosen'),
 ('dawud','Dawud','Wisdom','21:78-80','38:26','Judgment and responsibility'),
 ('sulayman','Sulayman','Wisdom','27:18-19','27:38-40','Gratitude for blessings'),
 ('ilyas','Ilyas','Calling to Allah','37:123-126','37:127-132','Calling his people to Allah'),
 ('al-yasa','Al-Yasa','Brief mentions','6:86','38:48','Among those named and praised'),
 ('yunus','Yunus','Trust and prayer','21:87-88','37:139-148','A call from the darkness'),
 ('zakariya','Zakariya','Family','3:38-41','19:2-9','A prayer for an heir'),
 ('yahya','Yahya','Family','3:39','19:12-15','Wisdom and care for parents'),
 ('isa','Isa','Calling to Allah','19:30-36','3:49-51','A servant and messenger'),
 ('muhammad','Muhammad','Calling to Allah','33:40','48:29','Messenger of Allah'),
]
people=[]
questions=json.loads((ROOT/'_implementation/batch2-questions.json').read_text(encoding='utf-8'))
for slug,name,category,ref1,ref2,focus in profiles:
 question,*answers,answerRef=questions[slug];correct=answers[0];random.Random(slug).shuffle(answers)
 people.append(dict(id=slug,name=name,category=category,focus=focus,brief=category=='Brief mentions',readings=[passage(ref1),passage(ref2)],question=question,options=answers,answer=answers.index(correct),answerRef=answerRef))
# Four source-reading locks per room; all clues are visible before answering.
rooms=[]
for i,topicid in enumerate(['patience','gratitude','justice','mercy','learning','keeping-commitments','hospitality','careful-speech']):
 t=next(t for t in topics if t['id']==topicid)
 rooms.append(dict(id=topicid,name=t['theme'],description=t['hint'],passages=t['passages'],hint=t['hint'],explanation=t['explanation'],commentaryUrl=t['commentaryUrl'],options=[t['theme']]+t['distractors'],answer=0,refs=t['refs']))
bundles={
 'quran-memorization-workload-calculator':dict(chapters=q['chapters'],layoutPages=604),
 'is-this-actually-in-the-quran':dict(chapters=q['chapters'],verseCount=6236),
 'quran-concept-atlas':dict(topics=topics),
 'islamic-knowledge-escape-room':dict(rooms=rooms),
 'stories-of-the-prophets-explorer':dict(people=people)}
for slug,data in bundles.items():
 app=ROOT/'apps'/slug
 text=json.dumps(data,ensure_ascii=False,indent=2)+'\n';(app/'src/data/content.json').write_text(text,encoding='utf-8')
 sources={}
 def collect(v):
  if isinstance(v,list):
   for x in v:collect(x)
  elif isinstance(v,dict):
   if 'translationUrl' in v:sources[v['translationUrl']]=dict(label='Quran '+v['ref']+' Â· Pickthall',url=v['translationUrl'],kind='Canonical passage')
   if 'commentaryUrl' in v:sources[v['commentaryUrl']]=dict(label='Al-Tafsir al-Muyassar Â· '+v.get('anchor',v.get('refs',[''])[0]),url=v['commentaryUrl'],kind='Arabic commentary')
   for x in v.values():collect(x)
 collect(data)
 if not sources:sources['https://mcp.quran.ai']=dict(label='Quran Foundation official MCP Â· canonical text and structural metadata',url='https://mcp.quran.ai',kind='Primary data source')
 if slug=='is-this-actually-in-the-quran':
  corpus=list(q['verses'].values());(app/'src/data/corpus.json').write_text(json.dumps(corpus,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
  for c in q['chapters']:sources[f'https://quran.com/{c["number"]}']=dict(label=f'{c["number"]}. {c["name_simple"]} Â· complete chapter',url=f'https://quran.com/{c["number"]}',kind='Arabic and Pickthall source')
  corpusHash=hashlib.sha256((app/'src/data/corpus.json').read_bytes()).hexdigest()
 else:corpusHash=None
 (app/'src/data/sources.json').write_text(json.dumps(list(sources.values()),ensure_ascii=False,indent=2),encoding='utf-8')
 (app/'src/data/provenance.json').write_text(json.dumps({**prov,'app':slug,'appContentSha256':hashlib.sha256((app/'src/data/content.json').read_bytes()).hexdigest(),'corpusSha256':corpusHash},indent=2),encoding='utf-8')
 print(slug,len(sources))
