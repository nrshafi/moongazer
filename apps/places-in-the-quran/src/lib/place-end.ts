import {renderSessionEnd} from './session-end';
// End of session for a place page (P5): no score. Shown when the page loads; the text uses only the entry's own name, reference and note.
const box=document.getElementById('session-end');
if(box){
  const d=box.dataset;
  renderSessionEnd(box,{
    result:`You opened ${d.name} in Places in the Quran.`,
    learned:[d.note!,`Source: Quran ${d.ref}.`],
    shareText:'Places in the Quran: a map of the places the Quran names, and where certainty ends. https://places-in-the-quran.moongazer.tech/',
    itemId:d.id!,
    next:{name:d.nextName!,url:d.nextUrl!},
    heading:'Place reading complete',
  });
}
