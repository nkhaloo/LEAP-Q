const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const Q = require('../questionnaire.js');
function validAnswers(count=2) {
  const a=Object.fromEntries(Q.fields.map(f=>[f.key,f.type==='checkbox'?false:'']));
  for(let i=1;i<=count;i++) {
    a['dominance_'+i]=['English','Spanish','French','German','Japanese'][i-1];
    a['acquisition_'+i]=a['dominance_'+i];
    Q.percentages.forEach(g=>a[g.id+'_'+i]=i===1?'100':'0');
    a['l'+i+'_order']=['Native','Second','Third','Fourth','Fifth'][i-1];
    Q.milestones.forEach((_,j)=>a['l'+i+'_age_'+j]=j===3?'N/A':'0');
    Q.environments.forEach((_,j)=>['years','months'].forEach(u=>a['l'+i+'_environment_'+j+'_'+u]='0'));
    Q.groups.forEach(g=>g.items.forEach((_,j)=>a['l'+i+'_'+g.id+'_'+j]='0'));
    a['l'+i+'_accent']='0';a['l'+i+'_identified']='0';
  }
  return a;
}
module.exports={validAnswers};
test('complete mono-, bi-, and five-language questionnaires accept zero ratings and N/A ages',()=>{
  [1,2,5].forEach(n=>assert.deepEqual(Q.validate(validAnswers(n)),[]));
});
test('rejects empty languages, duplicate names, gaps, and mismatched acquisition lists',()=>{
  assert(Q.validate({}).some(e=>e.key==='dominance_1'));
  for (const edits of [{dominance_2:'english'}, {dominance_2:'',dominance_3:'Spanish'}, {acquisition_2:'French'}, {acquisition_2:'English'}]) {
    const a={...validAnswers(),...edits};assert(Q.validate(a,0).length);
  }
});
test('percentages must be bounded and total 100 in all three groups',()=>{
  for(const g of Q.percentages){
    const a=validAnswers();a[g.id+'_1']='99';assert(Q.validate(a,1).some(e=>e.key===g.id+'_1'));
    a[g.id+'_1']='101';a[g.id+'_2']='-1';assert(Q.validate(a,1).length);
    a[g.id+'_1']='33.33';a[g.id+'_2']='66.67';assert.deepEqual(Q.validate(a,1),[]);
  }
});
test('conditional culture, health, and education answers are checked',()=>{
  for(const edits of [{culture_1:'US-American'},{culture_rating_1:'0'},{health_0:true},{education_level:'Other'}])assert(Q.validate({...validAnswers(),...edits},1).length);
  const a={...validAnswers(),culture_1:'US-American',culture_rating_1:'0',health_0:true,health_explanation:'Corrected with glasses',education_level:'Other',education_other:'Certificate'};
  assert.deepEqual(Q.validate(a),[]);
});
test('ratings, ages, and durations validate on client and server',()=>{
  for(const [key,value] of [['l1_accent','11'],['l1_identified','0.5'],['l1_age_0','later'],['l1_environment_0_months','12'],['l1_proficiency_0','']]){
    const a={...validAnswers(),[key]:value};assert(Q.validate(a).some(e=>e.key===key));
  }
});
function backend() {
  const rows=[];let released=0;
  const sheet={
    getSheetId:()=>0,getMaxColumns:()=>400,getLastRow:()=>rows.length,setFrozenRows:()=>{},
    getRange:(r,c,n,w)=>({
      setValues:v=>v.forEach((row,i)=>{rows[r-1+i]=row.slice();}),
      getValues:()=>[rows[r-1].slice(c-1,c-1+w)],
      createTextFinder:id=>({matchEntireCell:()=>({findNext:()=>rows.slice(1).some(row=>row[1]===id)?{}:null})})
    })
  };
  const context=vm.createContext({console:{error:()=>{}},
    HtmlService:{createHtmlOutput:html=>({html,setXFrameOptionsMode(){return this;}}),XFrameOptionsMode:{ALLOWALL:'all'}},
    ContentService:{createTextOutput:t=>t},
    LockService:{getScriptLock:()=>({waitLock:()=>{},releaseLock:()=>released++})},
    SpreadsheetApp:{openById:id=>{assert.equal(id,'121p3XrVm4ssktWA2lbexkFAHo-MPBnNENyMQOrvL78A');return {getSheets:()=>[sheet]};},flush:()=>{}}
  });
  vm.runInContext(fs.readFileSync('apps-script.txt','utf8'),context);
  const id='12345678-1234-4234-8234-123456789012';
  function post(answers,extra={}){
    return context.doPost({parameter:{nonce:id,origin:'https://nkhaloo.github.io',payload:JSON.stringify({version:Q.version,submission_id:id,answers}),...extra}}).html;
  }
  return {rows,post,context,released:()=>released};
}
test('receiver saves a flat response once, confirms retries, and escapes spreadsheet formulas',()=>{
  const b=backend(),a=validAnswers();a.first_name='=IMPORTXML("https://example.com")';
  assert.match(b.post(a),/"ok":true/);assert.equal(b.rows.length,2);
  const index=b.rows[0].indexOf('first_name');assert.equal(b.rows[1][index],"'"+a.first_name);
  assert.match(b.post(a),/"ok":true/);assert.equal(b.rows.length,2);assert.equal(b.released(),2);
  assert.equal(b.rows[1][b.rows[0].indexOf('l1_accent')],0);
});
test('receiver rejects malformed, incomplete, and unapproved requests without writing',()=>{
  const b=backend();assert.match(b.post({}),/"ok":false/);
  assert.match(b.post(validAnswers(),{payload:'invalid'}),/"ok":false/);
  const a=validAnswers();a.health_0='true';assert.match(b.post(a),/"ok":false/);
  assert.match(b.post(validAnswers(),{origin:'https://untrusted.example'}),/not configured/);
  assert.equal(b.rows.length,0);
});
test('receiver refuses incompatible headers and releases the lock',()=>{
  const b=backend();b.rows.push(['existing data']);assert.match(b.post(validAnswers()),/"ok":false/);assert.equal(b.rows.length,1);assert.equal(b.released(),1);
});
test('generated Apps Script matches the shared schema and backend',()=>{
  const text=fs.readFileSync('apps-script.txt','utf8');assert(text.includes(fs.readFileSync('questionnaire.js','utf8')));assert(text.endsWith(fs.readFileSync('scripts/apps-script-backend.js','utf8')));
});
