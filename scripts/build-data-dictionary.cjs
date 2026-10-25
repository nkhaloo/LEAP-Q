const fs=require('node:fs');
require('../qsf-data.js');
const Q=require('../questionnaire.js');
const plain=s=>String(s).replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/\|/g,'\\|').replace(/\$\{lm:\/\/Field\/1\}/g,'[language]');
let text='# QSF response field dictionary\n\nGenerated from `LEAP-Q_full.qsf`. Radio choices store the original QSF choice IDs. Slider values are numeric 0–10; untouched sliders are blank. Checkboxes are stored as Yes/No. `L1_` keys below repeat as `L2_` through `L5_`, corresponding to the original dominance slot.\n\n| Field | Type | Question / row |\n| --- | --- | --- |\n';
for(const f of Q.fields.filter(f=>!f.slot||f.slot==='1'))text+='| `'+f.key+'` | '+f.type+' | '+plain(f.label)+' |\n';
text+='\n## Radio/checkbox choice IDs\n\n';
for(const [qid,q] of Object.entries(Q.source.questions))if(q.QuestionType==='MC'){
 text+='### '+qid+'\n\n'+plain(q.QuestionText)+'\n\n';
 for(const id of Q.choiceOrder(q))text+='- **'+id+'**: '+plain(q.Choices[id].Display)+'\n';
 text+='\n';
}
fs.writeFileSync('DATA_DICTIONARY.md',text);
