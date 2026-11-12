from pathlib import Path
import runpy,json,random,itertools
D=runpy.run_path(str(Path(__file__).with_name('batch3-data.py')));ROOT=D['ROOT'];passage=D['passage'];save=D['save']
groups=[]
def group(id,title,terms,refs,note):groups.append(dict(id=id,title=title,terms=terms,passages=[passage(r) for r in refs],note=note))
group('animal-titles','Animals in these surah titles',['The Cow','The Bee','The Ant','The Spider'],['2:67','16:68','27:18','29:41'],'English labels for Al-Baqarah, An-Nahl, An-Naml, and Al-Ankabut. The cited passages also mention the animals.')
group('metals','Metals in the selected readings',['Iron','Copper','Gold','Silver'],['18:96','9:34'],'18:96 names iron and molten copper; 9:34 names gold and silver.')
group('day-night','Images in 91:1–4',['Sun','Moon','Day','Night'],['91:1-4'],'The opening oaths name the sun, moon, day, and night.')
group('requested-crops','Requested foods in 2:61',['Cucumbers','Corn','Lentils','Onions'],['2:61'],'These English labels follow the selected Pickthall wording. The group is a selection from the longer list.')
group('prophets','Named together in 6:84',['Dawud','Sulayman','Ayyub','Yusuf'],['6:84'],'Pickthall uses the names David, Solomon, Job, and Joseph. These are the corresponding familiar Arabic names.')
group('storm','Images in 2:19',['Rain','Darkness','Thunder','Lightning'],['2:19'],'All four occur in the rainstorm comparison. The category concerns the named imagery, not a weather forecast.')
group('colors','Colors in the selected readings',['White','Red','Black','Green'],['35:27','18:31'],'35:27 names white, red, and black mountain streaks; 18:31 mentions green garments.')
group('neighbors','People named in 4:36',['Parents','Kinsfolk','Orphans','The needy'],['4:36'],'These four are part of the passage’s longer list of people to whom kindness is directed.')
group('qul','Selected surahs opening with Qul',['Al-Kafirun','Al-Ikhlas','Al-Falaq','An-Nas'],['109:1','112:1','113:1','114:1'],'These four selected chapters begin with Qul, rendered “Say” in English. This is not a claim that they are the only chapters that do so.')
group('worship','Acts in the selected worship readings',['Salah','Zakat','Fasting','Hajj'],['2:43','2:183','2:196'],'These labels correspond to worship/prayer, giving the due, fasting, and pilgrimage in the cited texts. This grouping is not a full legal definition.')
group('fruit','Fruits in 6:99',['Dates','Grapes','Olives','Pomegranates'],['6:99'],'The passage names date palms, grapes, olives, and pomegranates. “Dates” is the fruit label used for the palm entry.')
group('body','Body parts in these readings',['Eyes','Tongue','Lips','Hands'],['90:8-9','24:24'],'90:8–9 names eyes, tongue, and lips. 24:24 names hands alongside other body parts.')
group('angels','Names in the selected angel readings',['Jibril','Mikail','Harut','Marut'],['2:97-98','2:102'],'These names occur in the cited passages, using the familiar Arabic forms rather than Pickthall’s Gabriel and Michael.')
group('divine-names','Names in the selected 59:23 wording',['The Sovereign Lord','The Holy One','Peace','The Guardian'],['59:23'],'These labels follow names in Pickthall’s rendering of this ayah. They are a selection, not an exhaustive list.')
group('textiles','Materials named in 16:80',['Hides','Wool','Fur','Hair'],['16:80'],'The passage describes shelter and furnishings, mentioning hides and the wool, fur, and hair of animals.')
group('times','Surah titles associated with time',['Al-Fajr','Ad-Duha','Al-Layl','Al-Asr'],['89:1','93:1','92:1','103:1'],'The opening readings concern dawn, morning brightness, night, and time. The labels are chapter titles.')
group('scriptures','Names of revealed scriptures',['Tawrat','Injil','Zabur','Quran'],['3:3','4:163','17:9'],'The source passages mention the Torah, Gospel, Psalms, and Quran. This is a naming exercise, not a discussion of textual history.')
group('animals','Animals in 16:5–8',['Cattle','Horses','Mules','Donkeys'],['16:5-8'],'The selected passage names cattle, horses, mules, and asses. “Donkeys” is the tile label for asses.')
group('qualities','Four elements in 103:3',['Belief','Good works','Truth','Endurance'],['103:3'],'The ayah names belief and good works, and mutual exhortation to truth and endurance.')
group('places','Place names in these readings',['Makkah','Madinah','Egypt','Midian'],['48:24','9:101','12:99','28:22'],'These are places named in the selected texts. They are not all cities and the group does not assign ancient coordinates.')
sets=[(0,1,2,3),(4,5,6,7),(8,9,10,11),(12,13,14,15),(15,16,17,18),(19,1,3,9),(4,10,13,15),(0,5,14,18),(6,8,16,19),(2,7,12,17),(3,11,15,18),(1,4,8,14),(5,9,13,19),(0,6,12,16),(2,10,14,19),(7,11,16,18)]
puzzles=[]
for i,selection in enumerate(sets):
 chosen=[groups[n] for n in selection];terms=[term for g in chosen for term in g['terms']];assert len(set(terms))==16
 puzzles.append(dict(id=f'board-{i+1:02}',number=i+1,title=['First connections','A closer look','Words and readings','Across the passages'][i%4],level='Starter' if i<4 else 'Mixed',groups=[g['id'] for g in chosen]))
save('word-groups',dict(groups=groups,puzzles=puzzles,methodology='Sixteen editorial puzzles ask for four intended groups of four terms. Group explanations cite canonical readings and distinguish familiar Arabic names from Pickthall’s historical English forms. Categories are selected learning groupings, not exclusive definitions. Unlike Quran Connections, this app groups term tiles rather than identifying one theme across passages. Scores are informal and all answers are inspectable in client code.'))
history=json.loads((ROOT/'apps/seerah-timeline/src/data/content.json').read_text(encoding='utf-8'))['events']
indices=[0,4,10,16,17,19,21,24,26,27,30,32,33,35]
events=[history[i] for i in indices]
packs=[];combinations=list(itertools.combinations(range(len(events)),4));random.Random(1313).shuffle(combinations)
selections=[(0,2,4,6),(2,3,5,6),(6,8,9,12),(9,10,11,13)]+combinations[:8]
for i,selection in enumerate(selections):
 ordered=sorted([events[n] for n in selection],key=lambda e:e['year']);packs.append(dict(id=f'challenge-{i+1:02}',number=i+1,title=['Across the mission','After the migration','Journeys and returns','The later years'][i%4],events=[e['id'] for e in ordered]))
save('islamic-history-timeline-challenge',dict(events=events,packs=packs,methodology='Prophetic mission edition: twelve four-event challenges use fourteen event records spanning the first revelation to the Prophet’s death. Broad conventional chronology determines the intended order; the linked reports support the events but do not necessarily establish their CE dates. Approximate dates and source limits are revealed with each answer. This is a sequence game, not the browsing timeline or a claim to cover all Islamic history.'))
