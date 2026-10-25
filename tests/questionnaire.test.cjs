const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
require('../qsf-data.js');
const Q=require('../questionnaire.js');
function validAnswers(slots=['1']) {
 const a=Object.fromEntries(Q.fields.map(f=>[f.key,f.type==='checkbox'?false:'']));
 Object.assign(a,{QID2:'30',QID3:'3',QID3_3_TEXT:'Nonbinary',QID5_1:'Spanish',QID6_1:'100',QID7_1:'100',QID8_1:'100',QID9_1:'US-American',QID10:'16',QID11_5:true});
 slots.forEach((slot,index)=>{
  a['QID4_'+slot]=['English','Spanish','French','German','Japanese'][index];
  ['QID24','QID39','QID38','QID41','QID42'].forEach(qid=>a[Q.key(qid,null,slot)]='1');
 });
 return a;
}
module.exports={validAnswers};
test('QSF flow, questions, choices, validation, and controls match the original file',()=>{
 const qsf=JSON.parse(fs.readFileSync('LEAP-Q_full.qsf','utf8'));
 const originals=Object.fromEntries(qsf.SurveyElements.filter(e=>e.Element==='SQ').map(e=>[e.PrimaryAttribute,e.Payload]));
 assert.deepEqual(Q.source.pages.map(p=>p.questions),[
  ['QID2','QID3','QID4','QID5'],
  ['QID6','QID7','QID8','QID9','QID10','QID11','QID43','QID44','QID12'],
  ['QID21','QID22','QID23','QID24','QID39','QID38','QID25','QID40','QID41','QID42']
 ]);
 for(const [qid,q] of Object.entries(Q.source.questions))for(const [k,v] of Object.entries(q))assert.deepEqual(v,originals[qid][k],qid+': '+k);
 assert.equal(Q.source.options.BackButton,'false');assert.equal(Q.source.options.ProgressBarDisplay,'None');
});
test('minimum required answers work for one and five languages; optional fields stay blank',()=>{
 for(const slots of [['1'],['1','2','3','4','5']])assert.deepEqual(Q.validate(validAnswers(slots)),[]);
 const keys=Q.fields.map(f=>f.key);assert(!keys.some(k=>/name|birth|culture_rating|_order/.test(k)));
});
test('exact QSF requiredness: age, gender, first list rows, first culture, numeric education, education choice, proficiency/accent',()=>{
 const base=validAnswers();
 for(const key of ['QID2','QID3','QID4_1','QID5_1','QID9_1','QID10','L1_QID24','L1_QID39','L1_QID38','L1_QID41','L1_QID42']){
  assert(Q.validate({...base,[key]:''}).some(e=>e.key===key),key);
 }
 assert(Q.validate({...base,QID11_5:false}).some(e=>e.key==='QID11_1'));
 assert(Q.validate({...base,QID10:'many'}).some(e=>e.key==='QID10'));
 // Age has ForceResponse ON but no numeric content validation in the QSF.
 assert.deepEqual(Q.validate({...base,QID2:'thirty'}),[]);
});
test('does not invent language-list constraints, extra text requirements, or age/duration bounds',()=>{
 const a=validAnswers(['1','3']);a.QID4_3='English';a.QID5_1='Different acquisition entry';a.L1_QID22_1='Not yet';a.L1_QID23_1='2 years, 15 months';a.QID12_1=true;a.QID11_9=true;a.QID3_3_TEXT='';
 assert.deepEqual(Q.validate(a),[]);assert.deepEqual(Q.languages(a).map(l=>l.slot),['1','3']);assert.equal(Q.pages(a).length,4);
});
test('constant sums total 100, permit blank rows and respect EnforceRange OFF',()=>{
 const a=validAnswers();a.QID6_1='101';a.QID6_2='-1';assert.deepEqual(Q.validate(a),[]);
 a.QID7_1='99';assert(Q.validate(a).some(e=>e.key==='QID7_1'));
 a.QID7_1='33.33';a.QID7_2='66.67';assert.deepEqual(Q.validate(a),[]);
 a.QID8_1='bad';assert(Q.validate(a).some(e=>e.key==='QID8_1'));
});
test('radio codes match QSF IDs; slider rows are optional, numeric 0–10',()=>{
 const a=validAnswers();a.L1_QID24='0';assert(Q.validate(a).some(e=>e.key==='L1_QID24'));
 a.L1_QID24='11';a.L1_QID25_1='0';a.L1_QID40_6='10';assert.deepEqual(Q.validate(a),[]);
 a.L1_QID25_1='11';assert(Q.validate(a).some(e=>e.key==='L1_QID25_1'));
});
function backend() {
 const rows=[];let released=0,created=0;
 const sheet={getMaxColumns:()=>400,getLastRow:()=>rows.length,setFrozenRows:()=>{},getRange:(r,c,n,w)=>({
  setValues:v=>v.forEach((row,i)=>rows[r-1+i]=row.slice()),getValues:()=>[rows[r-1].slice(c-1,c-1+w)],
  createTextFinder:id=>({matchEntireCell:()=>({findNext:()=>rows.slice(1).some(row=>row[1]===id)?{}:null})})
 })};
 const context=vm.createContext({console:{error:()=>{}},HtmlService:{createHtmlOutput:html=>({html,setXFrameOptionsMode(){return this;}}),XFrameOptionsMode:{ALLOWALL:'all'}},ContentService:{createTextOutput:t=>t},LockService:{getScriptLock:()=>({waitLock:()=>{},releaseLock:()=>released++})},SpreadsheetApp:{
  openById:id=>{assert.equal(id,'121p3XrVm4ssktWA2lbexkFAHo-MPBnNENyMQOrvL78A');return {getSheetByName:name=>{assert.equal(name,'LEAP-Q QSF');return created?sheet:null;},insertSheet:name=>{assert.equal(name,'LEAP-Q QSF');created++;return sheet;}};},flush:()=>{}
 }});
 vm.runInContext(fs.readFileSync('apps-script.txt','utf8'),context);
 const id='12345678-1234-4234-8234-123456789012';
 const post=(answers,extra={})=>context.doPost({parameter:{nonce:id,origin:'https://nkhaloo.github.io',payload:JSON.stringify({version:Q.version,submission_id:id,answers}),...extra}}).html;
 return {rows,post,released:()=>released};
}
test('receiver creates dedicated QSF tab, saves blank vs zero, neutralizes formulas, and deduplicates retries',()=>{
 const b=backend(),a=validAnswers();a.QID12_1_TEXT='=IMPORTXML("https://example.com")';a.L1_QID25_1='0';
 assert.match(b.post(a),/"ok":true/);assert.equal(b.rows.length,2);
 const cell=key=>b.rows[1][b.rows[0].indexOf(key)];
 assert.equal(cell('QID12_1_TEXT'),"'"+a.QID12_1_TEXT);assert.equal(cell('L1_QID25_1'),0);assert.equal(cell('L1_QID25_2'),'');assert.equal(cell('QID3'),'3');
 assert.match(b.post(a),/"ok":true/);assert.equal(b.rows.length,2);assert.equal(b.released(),2);
});
test('receiver rejects incomplete, malformed, wrong-version, and unapproved requests without saving',()=>{
 const b=backend();assert.match(b.post({}),/"ok":false/);assert.match(b.post(validAnswers(),{payload:'bad'}),/"ok":false/);
 const a=validAnswers();a.QID11_5='true';assert.match(b.post(a),/"ok":false/);
 assert.match(b.post(validAnswers(),{payload:JSON.stringify({version:'old',submission_id:'12345678-1234-4234-8234-123456789012',answers:validAnswers()})}),/version mismatch/);
 assert.match(b.post(validAnswers(),{origin:'https://unknown.example'}),/not configured/);assert.equal(b.rows.length,0);
});
test('receiver refuses incompatible headers without overwriting and releases lock',()=>{
 const b=backend();b.rows.push(['unrelated data']);assert.match(b.post(validAnswers()),/"ok":false/);assert.equal(b.rows.length,1);assert.equal(b.released(),1);
});
test('generated receiver embeds the current QSF, validator, and backend',()=>{
 const text=fs.readFileSync('apps-script.txt','utf8');for(const path of ['qsf-data.js','questionnaire.js'])assert(text.includes(fs.readFileSync(path,'utf8')));
 assert(text.endsWith(fs.readFileSync('scripts/apps-script-backend.js','utf8')));
});
