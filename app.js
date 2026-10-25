'use strict';
const Q = window.LeapQ;
const answers = {};
const form = document.getElementById('survey');
const panel = document.getElementById('panel');
const errorBox = document.getElementById('errors');
const back = document.getElementById('back');
const next = document.getElementById('next');
const statusBox = document.getElementById('submission-status');
let step = 0;
let pending = false;
let submissionId = crypto.randomUUID();
let savedPayload = null;
let committedLanguages = [];
const configured = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(window.LEAPQ_CONFIG.appsScriptUrl);
document.getElementById('setup-notice').hidden = configured;
const escape = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function options(values,empty='Select…') { return '<option value="">'+empty+'</option>'+values.map(v=>'<option value="'+escape(v)+'">'+escape(v)+'</option>').join(''); }
function field(key,label,type='text',attrs='') {
  const input=type==='textarea'?'<textarea id="'+key+'" name="'+key+'" maxlength="5000" '+attrs+'></textarea>':'<input id="'+key+'" name="'+key+'" type="'+type+'" '+(type==='text'?'maxlength="5000" ':'')+attrs+'>';
  return '<label class="field" for="'+key+'"><span>'+escape(label)+'</span>'+input+'</label>';
}
function select(key,label,values) { return '<label class="field" for="'+key+'"><span>'+escape(label)+'</span><select id="'+key+'" name="'+key+'">'+options(values)+'</select></label>'; }
function rating(key,label,scale) {return '<label class="rating-row" for="'+key+'"><span>'+escape(label)+'</span>'+ratingSelect(key,label,scale)+'</label>';}
function ratingSelect(key,label,scale) {return '<select id="'+key+'" name="'+key+'" aria-label="'+escape(label)+'"><option value="">Select a rating…</option>'+Q.scales[scale].map((s,i)=>'<option value="'+i+'">'+i+(s?' — '+escape(s):'')+'</option>').join('')+'</select>';}
function question(n,text,body) {return '<fieldset><legend><span class="question-number">'+n.toString().padStart(2,'0')+'</span>'+escape(text)+'</legend>'+body+'</fieldset>';}
function collect(){panel.querySelectorAll('[name]').forEach(el=>{answers[el.name]=el.type==='checkbox'?el.checked:el.value;});}
function restore(){panel.querySelectorAll('[name]').forEach(el=>{if(el.type==='checkbox')el.checked=answers[el.name]===true;else el.value=answers[el.name]===undefined?'':answers[el.name];});}
function background(){
  let html='<h2>Language background</h2><p class="hint">List up to five languages. Leave unused language rows blank. Personal details may be left blank.</p>';
  html+='<div class="field-grid">'+field('last_name','Last Name','text','autocomplete="family-name"')+field('first_name','First Name','text','autocomplete="given-name"')+field('today','Today’s Date','date')+field('age','Age','number','min="0" max="120" step="any"')+field('birth_date','Date of Birth','date')+select('sex','Male / Female',['Male','Female'])+'</div>';
  html+=question(1,'Please list all the languages you know in order of dominance:','<div class="stack">'+Array.from({length:5},(_,i)=>'<div class="rank-row"><span>'+(i+1)+'</span>'+field('dominance_'+(i+1),'Language '+(i+1))+'</div>').join('')+'</div>');
  html+=question(2,'Please list all the languages you know in order of acquisition (your native language first):','<div class="stack">'+Array.from({length:5},(_,i)=>'<div class="rank-row"><span>'+(i+1)+'</span>'+field('acquisition_'+(i+1),'Language '+(i+1))+'</div>').join('')+'</div>');return html;
}
function overview(){
  const ls=Q.languages(answers);
  let html='<h2>Experience &amp; background</h2><p class="hint">Answer for all of your languages. Each percentage group should total 100%. Use 0 when applicable.</p>';
  Q.percentages.forEach(g=>{html+=question(g.number,g.question,'<p class="hint">(Your percentages should add up to 100%):</p><div class="stack">'+ls.map((l,i)=>'<div class="percent-row"><span>'+escape(l)+'</span>'+field(g.id+'_'+(i+1),l+' (%)','number','min="0" max="100" step="any" inputmode="decimal"')+'</div>').join('')+'</div><p class="total" id="total-'+g.id+'" aria-live="polite"></p>');});
  html+=question(6,'Please name the cultures with which you identify. On a scale from zero to ten, please rate the extent to which you identify with each culture. (Examples of possible cultures include US-American, Chinese, Jewish-Orthodox, etc):','<div class="stack">'+Array.from({length:5},(_,i)=>'<div class="culture-row">'+field('culture_'+(i+1),'Culture '+(i+1))+ratingSelect('culture_rating_'+(i+1),'Culture '+(i+1)+' — identification','identification')+'</div>').join('')+'</div>');
  html+=question(7,'How many years of formal education do you have?',field('education_years','Years','number','min="0" max="100" step="any"')+'<p class="hint" style="margin-top:20px">Please check your highest education level (or the approximate US equivalent to a degree obtained in another country):</p><div class="field-grid">'+select('education_level','Highest education level',Q.education)+field('education_other','Other:')+'</div>');
  html+=question(8,'Date of immigration to the USA, if applicable',field('immigration_usa','Date of immigration to the USA')+'<div style="margin-top:16px">'+field('immigration_other','If you have ever immigrated to another country, please provide name of country and date of immigration here.','textarea')+'</div>');
  html+=question(9,'Have you ever had a vision problem, hearing impairment, language disability, or learning disability? (Check all applicable).','<div class="checks">'+['vision problem','hearing impairment','language disability','learning disability'].map((l,i)=>'<label><input type="checkbox" name="health_'+i+'" id="health_'+i+'">'+escape(l)+'</label>').join('')+'</div><div style="margin-top:18px">'+field('health_explanation','If yes, please explain (including any corrections):','textarea')+'</div>');
  return html;
}
function language(index){
  const ls=Q.languages(answers),i=index+1,prefix='l'+i+'_';
  let html='<p class="eyebrow">LANGUAGE '+i+' OF '+ls.length+'</p><h2>'+escape(ls[index])+'</h2><p class="hint">All questions below refer to your knowledge of '+escape(ls[index])+'. For an age that does not apply, enter N/A. For time spent in an environment, enter 0 if none.</p>';
  html+=select(prefix+'order','This is my … language.',['Native','Second','Third','Fourth','Fifth']);
  html+=question(1,'Age when you…:','<div class="field-grid">'+Q.milestones.map((l,k)=>field(prefix+'age_'+k,l+':','text','inputmode="text"')).join('')+'</div>');
  html+=question(2,'Please list the number of years and months you spent in each language environment:',Q.environments.map((l,k)=>'<div class="duration-row"><span>'+escape(l)+'</span>'+field(prefix+'environment_'+k+'_years','Years','number','min="0" max="120" step="any"')+field(prefix+'environment_'+k+'_months','Months','number','min="0" max="11" step="1"')+'</div>').join(''));
  Q.groups.forEach(g=>{html+=question(g.number,g.question,g.items.map((l,k)=>rating(prefix+g.id+'_'+k,l,g.scale)).join(''));});
  html+=question(6,'In your perception, how much of a foreign accent do you have in this language?',rating(prefix+'accent','Foreign accent','accent'));
  html+=question(7,'Please rate how frequently others identify you as a non-native speaker based on your accent in this language:',rating(prefix+'identified','Frequency','exposure'));
  return html;
}
function review(){
  const ls=Q.languages(answers);
  const blocks=[{title:'Language background',fields:Q.fields.filter(f=>/^(last_name|first_name|today|age|birth_date|sex|dominance_|acquisition_)/.test(f.key))},{title:'Experience & background',fields:Q.fields.filter(f=>!/^(last_name$|first_name$|today$|age$|birth_date$|sex$|dominance_|acquisition_|l\d_)/.test(f.key))}];
  ls.forEach((l,i)=>blocks.push({title:l,fields:Q.fields.filter(f=>f.key.startsWith('l'+(i+1)+'_'))}));
  return '<h2>Review your answers</h2><p class="hint">You can go back to make changes. Select “Submit questionnaire” to save your answers to the researcher’s spreadsheet.</p>'+blocks.map(b=>'<details class="review-block"><summary>'+escape(b.title)+'</summary><dl>'+b.fields.filter(f=>answers[f.key]!==undefined&&answers[f.key]!==''&&answers[f.key]!==false).map(f=>'<dt>'+escape(f.label)+'</dt><dd>'+escape(answers[f.key]===true?'Checked':answers[f.key])+'</dd>').join('')+'</dl></details>').join('');
}
// Preserve language-specific answers when the dominance list is reordered.
function reconcileLanguages(){
  const names=Q.languages(answers),old={...answers};
  names.forEach((name,j)=>{
    const previous=committedLanguages.findIndex(l=>l.toLowerCase()===name.toLowerCase());
    Q.percentages.forEach(g=>{answers[g.id+'_'+(j+1)]=previous<0?'':old[g.id+'_'+(previous+1)]||'';});
    Q.fields.filter(f=>f.key.startsWith('l'+(j+1)+'_')).forEach(f=>{
      const suffix=f.key.slice(3);answers[f.key]=previous<0?'':old['l'+(previous+1)+'_'+suffix]||'';
    });
    if(!answers['l'+(j+1)+'_order']){
      const position=Array.from({length:names.length},(_,k)=>String(answers['acquisition_'+(k+1)]||'').toLowerCase()).indexOf(name.toLowerCase());
      answers['l'+(j+1)+'_order']=['Native','Second','Third','Fourth','Fifth'][position]||'';
    }
  });
  for(let j=names.length+1;j<=5;j++){
    Q.percentages.forEach(g=>delete answers[g.id+'_'+j]);
    Q.fields.filter(f=>f.key.startsWith('l'+j+'_')).forEach(f=>delete answers[f.key]);
  }
  committedLanguages=names.slice();
}
function updateTotals(){Q.percentages.forEach(g=>{const el=document.getElementById('total-'+g.id);if(!el)return;let total=0;panel.querySelectorAll('[name^="'+g.id+'_"]').forEach(input=>total+=Number(input.value)||0);el.textContent='Total: '+Math.round(total*1000)/1000+' / 100%';el.classList.toggle('valid',Math.abs(total-100)<.001);});}
function render(focus=true){
  errorBox.hidden=true;statusBox.textContent='';
  const ls=Q.languages(answers),last=ls.length+2;
  document.getElementById('step-label').textContent=step===0?'Language background':step===1?'Experience & background':step===last?'Review & submit':ls[step-2];
  document.getElementById('step-count').textContent='Step '+(step+1)+' of '+(last+1);
  document.getElementById('progress').style.width=((step+1)/(last+1)*100)+'%';
  panel.innerHTML=step===0?background():step===1?overview():step===last?review():language(step-2);
  restore();updateTotals();back.hidden=step===0;
  next.innerHTML=step===last?'Submit questionnaire':'Continue <span aria-hidden="true">→</span>';
  if(focus){panel.querySelector('h2').tabIndex=-1;panel.querySelector('h2').focus();document.querySelector('.survey-shell').scrollIntoView({behavior:'smooth',block:'start'});}
}
function showErrors(errors){
  panel.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
  errorBox.innerHTML='<strong>Please check the following:</strong><ul>'+errors.map(e=>'<li><a href="#'+escape(e.key)+'">'+escape(e.message)+'</a></li>').join('')+'</ul>';errorBox.hidden=false;
  errors.forEach(e=>{const el=document.getElementById(e.key);if(el)el.setAttribute('aria-invalid','true');});errorBox.focus();
}
panel.addEventListener('input',()=>{collect();updateTotals();});panel.addEventListener('change',collect);
back.addEventListener('click',()=>{if(pending)return;collect();step--;render();});
form.addEventListener('submit',async e=>{
  e.preventDefault();if(pending)return;collect();
  const last=Q.languages(answers).length+2;
  const errors=Q.validate(answers,step===last?undefined:step);
  if(errors.length){if(step===last){const key=errors[0].key;step=/^l\d_/.test(key)?Number(key[1])+1:/^(current_|reading_|speaking_|culture_|education_|immigration_|health_)/.test(key)?1:0;render();}showErrors(errors);return;}
  if(step<last){if(step===0)reconcileLanguages();step++;render();return;}
  if(!configured){statusBox.textContent='Submission is not configured. Please contact the researcher; your answers are still in this tab.';return;}
  pending=true;next.disabled=true;back.disabled=true;next.textContent='Saving…';statusBox.textContent='Saving your questionnaire. Please keep this tab open.';
  // Retrying the same answers uses the same ID; edited answers receive a new ID.
  const serialized=JSON.stringify(answers);if(savedPayload!==null&&savedPayload!==serialized)submissionId=crypto.randomUUID();savedPayload=serialized;
  try{
    await send({version:Q.version,submission_id:submissionId,answers});
    panel.innerHTML='<div class="success"><div class="success-mark" aria-hidden="true">✓</div><h2>Thank you.</h2><p>Your questionnaire has been saved.</p><p class="hint">You may now close this tab.</p></div>';
    panel.querySelector('h2').tabIndex=-1;panel.querySelector('h2').focus();document.querySelector('.actions').hidden=true;statusBox.textContent='';document.getElementById('step-label').textContent='Questionnaire complete';
    Object.keys(answers).forEach(k=>delete answers[k]);savedPayload=null;
  }catch(error){statusBox.textContent=error.message+' Your answers remain in this tab. You can try submitting again.';next.textContent='Try submitting again';}
  finally{pending=false;next.disabled=false;back.disabled=false;}
});
function send(payload){
  return new Promise((resolve,reject)=>{
    const nonce=crypto.randomUUID();const frame=document.createElement('iframe');frame.name='leapq-'+nonce;frame.hidden=true;frame.title='Questionnaire submission';
    const post=document.createElement('form');post.method='POST';post.action=window.LEAPQ_CONFIG.appsScriptUrl;post.target=frame.name;post.hidden=true;
    const data={payload:JSON.stringify(payload),nonce,origin:location.origin};
    Object.entries(data).forEach(([name,value])=>{const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;post.append(input);});
    const cleanup=()=>{clearTimeout(timer);window.removeEventListener('message',receive);post.remove();frame.remove();};
    function receive(event){
      const trusted=event.origin==='https://script.google.com'||/^https:\/\/[a-z0-9-]+\.googleusercontent\.com$/.test(event.origin);
      if(!trusted||!event.data||event.data.type!=='leapq-submission'||event.data.nonce!==nonce||event.data.submission_id!==payload.submission_id)return;
      cleanup();if(event.data.ok)resolve();else reject(new Error(event.data.error||'The questionnaire could not be saved.'));
    }
    const timer=setTimeout(()=>{cleanup();reject(new Error('The server did not confirm the save.'));},60000);
    window.addEventListener('message',receive);document.body.append(frame,post);post.submit();
  });
}
window.addEventListener('beforeunload',e=>{if(pending||Object.values(answers).some(v=>v!==''&&v!==false)){e.preventDefault();e.returnValue='';}});
render(false);
