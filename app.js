'use strict';
const Q=window.LeapQ;
const form=document.getElementById('survey');
const panel=document.getElementById('panel');
const errorBox=document.getElementById('errors');
const next=document.getElementById('next');
const statusBox=document.getElementById('submission-status');
const storageKey='leapq-qsf-progress-v1';
const retention=7*24*60*60*1000;
let answers={},step=0,pending=false,complete=false;
let submissionId=crypto.randomUUID();
let savedPayload=null;
const configured=/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(window.LEAPQ_CONFIG.appsScriptUrl);
document.getElementById('setup-notice').hidden=configured;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Keep the QSF's emphasis, while treating imported HTML and piped answers as data.
function content(raw,page={}) {
  const template=document.createElement('template');template.innerHTML=raw||'';
  function clean(node){
    if(node.nodeType===Node.TEXT_NODE){
      const chunks=node.textContent.split(/(\$\{lm:\/\/Field\/1\}|\$\{q:\/\/QID4\/ChoiceTextEntryValue\/[1-5]\})/g);
      return chunks.map(chunk=>{
        if(chunk==='${lm://Field/1}')return escape(page.language||'');
        const match=chunk.match(/^\$\{q:\/\/QID4\/ChoiceTextEntryValue\/([1-5])\}$/);
        return escape(match?answers['QID4_'+match[1]]||'':chunk);
      }).join('');
    }
    if(node.nodeType!==Node.ELEMENT_NODE&&node.nodeType!==Node.DOCUMENT_FRAGMENT_NODE)return '';
    if(['SCRIPT','STYLE','IFRAME','OBJECT'].includes(node.tagName))return '';
    const inner=Array.from(node.childNodes).map(clean).join('');
    if(node.tagName==='BR')return '<br>';
    if(['STRONG','B'].includes(node.tagName)||(node.tagName==='SPAN'&&node.style.fontWeight==='700'))return '<strong>'+inner+'</strong>';
    if(['EM','I'].includes(node.tagName))return '<em>'+inner+'</em>';
    return inner;
  }
  return clean(template.content);
}
function saveProgress(){
  if(complete)return;
  try{localStorage.setItem(storageKey,JSON.stringify({version:Q.version,answers,step,submissionId,savedPayload,updatedAt:Date.now()}));}
  catch{document.getElementById('storage-note').textContent='Progress could not be saved on this device. Please keep this tab open.';}
}
function restoreProgress(){
  try{
    const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
    if(!saved)return;
    if(saved.version!==Q.version||Date.now()-saved.updatedAt>retention){localStorage.removeItem(storageKey);return;}
    if(!saved.answers||typeof saved.answers!=='object'||Array.isArray(saved.answers))return;
    Q.fields.forEach(f=>{const v=saved.answers[f.key];if(f.type==='checkbox'&&typeof v==='boolean'||f.type!=='checkbox'&&typeof v==='string')answers[f.key]=v;});
    const max=Q.pages(answers).length-1;
    if(Number.isInteger(saved.step)&&saved.step>=0&&saved.step<=max)step=saved.step;
    if(/^[a-f0-9-]{36}$/i.test(saved.submissionId||''))submissionId=saved.submissionId;
    if(typeof saved.savedPayload==='string')savedPayload=saved.savedPayload;
  }catch{/* A corrupt or unavailable local draft must not prevent a fresh response. */}
}
function input(key,label,opts={}){
  return '<label class="text-row" for="'+key+'"><span>'+label+'</span><input type="'+(opts.type||'text')+'" id="'+key+'" name="'+key+'" '+(opts.type==='number'?'step="any" ':'maxlength="5000" ')+(opts.single?'class="single-input" ':'')+'autocomplete="off"></label>';
}
function question(qid,page){
  const q=Q.source.questions[qid],ids=Q.choiceOrder(q),key=id=>Q.key(qid,id,page.slot);
  if(q.QuestionType==='DB')return '<div class="language-intro" data-question="'+qid+'">'+content(q.QuestionText,page)+'</div>';
  let body='';
  if(q.QuestionType==='TE'){
    if(q.Selector==='FORM')body='<div class="text-form">'+ids.map(id=>input(key(id),content(q.Choices[id].Display,page))).join('')+'</div>';
    else body='<input class="'+(qid==='QID43'||qid==='QID44'?'wide-input':'single-input')+'" type="text" id="'+key()+'" name="'+key()+'" maxlength="5000" aria-labelledby="legend-'+key()+'" autocomplete="off">';
  }else if(q.QuestionType==='MC'){
    const multiple=q.Selector==='MAVR';
    body='<div class="choice-list">'+ids.map(id=>{
      const choice=q.Choices[id],choiceKey=key(id),textKey=key(id+'_TEXT');
      return '<div class="choice-item"><label class="choice-label"><input type="'+(multiple?'checkbox':'radio')+'" id="'+choiceKey+'" name="'+(multiple?choiceKey:key())+'" value="'+id+'"><span>'+content(choice.Display,page)+'</span></label>'+
        (choice.TextEntry?'<input class="choice-text" type="text" name="'+textKey+'" id="'+textKey+'" maxlength="5000" aria-label="'+escape(q.Choices[id].Display.replace(/<[^>]*>/g,''))+' — text entry" data-select-choice="'+choiceKey+'" autocomplete="off">':'')+'</div>';
    }).join('')+'</div>';
  }else if(q.QuestionType==='CS'){
    body='<div class="constant-sum">'+ids.map(id=>'<div class="percent-row">'+input(key(id),content(q.Choices[id].Display,page),{type:'number'})+'<span aria-hidden="true">%</span></div>').join('')+'</div><p class="total" id="total-'+qid+'" aria-live="polite"></p>';
  }else if(q.QuestionType==='Slider'){
    const cfg=q.Configuration;
    body='<div class="slider-group">'+ids.map(id=>{
      const position=cfg.SliderStartPositions[id]*(cfg.CSSliderMax-cfg.CSSliderMin)+cfg.CSSliderMin;
      return '<div class="slider-row"><label for="'+key(id)+'">'+content(q.Choices[id].Display,page)+'</label><div class="slider-control"><div class="slider-numbers" aria-hidden="true">'+Array.from({length:11},(_,i)=>'<span>'+i+'</span>').join('')+'</div><input type="range" id="'+key(id)+'" name="'+key(id)+'" min="'+cfg.CSSliderMin+'" max="'+cfg.CSSliderMax+'" step="any" value="'+position+'" data-slider="true" data-answered="false" aria-describedby="anchors-'+key(id)+'"><div class="slider-anchors" id="anchors-'+key(id)+'">'+Object.keys(q.Labels).map(id=>'<span>'+content(q.Labels[id].Display,page)+'</span>').join('')+'</div></div></div>';
    }).join('')+'</div>';
  }
  return '<fieldset class="question" data-question="'+qid+'"><legend id="legend-'+key()+'">'+content(q.QuestionText,page)+'</legend>'+body+'</fieldset>';
}
function collect(){
  panel.querySelectorAll('[name]').forEach(el=>{
    if(el.type==='radio'){if(el.checked)answers[el.name]=el.value;}
    else if(el.type==='checkbox')answers[el.name]=el.checked;
    else if(el.dataset.slider){if(el.dataset.answered==='true')answers[el.name]=String(Math.round(Number(el.value)));}
    else answers[el.name]=el.value;
  });
}
function restore(){
  panel.querySelectorAll('[name]').forEach(el=>{
    const v=answers[el.name];
    if(el.type==='radio')el.checked=v===el.value;
    else if(el.type==='checkbox')el.checked=v===true;
    else if(el.dataset.slider){if(v!==undefined&&v!==''){el.value=v;el.dataset.answered='true';}}
    else el.value=v===undefined?'':v;
  });
}
function totals(){
  ['QID6','QID7','QID8'].forEach(qid=>{
    const el=document.getElementById('total-'+qid);if(!el)return;
    const total=Q.choiceOrder(Q.source.questions[qid]).reduce((sum,id)=>sum+(Number(answers[Q.key(qid,id)])||0),0);
    el.textContent='Total: '+Math.round(total*1000000)/1000000+'%';
    el.classList.toggle('valid',Math.abs(total-100)<0.000001);
  });
}
function render(focus=true){
  const page=Q.pages(answers)[step];
  errorBox.hidden=true;statusBox.textContent='';
  panel.innerHTML=page.questions.map(qid=>question(qid,page)).join('');
  restore();totals();next.textContent=Q.source.options.NextButton.trim();
  next.setAttribute('aria-label','Next');
  if(focus){const first=panel.querySelector('legend,.language-intro');first.tabIndex=-1;first.focus();window.scrollTo({top:0,behavior:'instant'});}
}
function showErrors(errors){
  panel.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
  // Single-choice groups use a shared name, with IDs on individual options.
  function target(key){return document.getElementById(key)||Array.from(panel.querySelectorAll('[name]')).find(el=>el.name===key);}
  errorBox.innerHTML='<strong>Please check the following:</strong><ul>'+errors.map(e=>'<li><a href="#'+escape(target(e.key)?.id||e.key)+'">'+escape(e.message)+'</a></li>').join('')+'</ul>';errorBox.hidden=false;
  errors.forEach(e=>{const el=target(e.key);if(el)el.setAttribute('aria-invalid','true');});errorBox.focus();
}
function changed(event){
  const el=event.target;
  if(el.dataset.slider)el.dataset.answered='true';
  if(el.dataset.selectChoice&&el.value){const choice=document.getElementById(el.dataset.selectChoice);choice.checked=true;}
  collect();totals();saveProgress();
}
panel.addEventListener('input',changed);panel.addEventListener('change',changed);
form.addEventListener('submit',async event=>{
  event.preventDefault();if(pending||complete)return;collect();
  const errors=Q.validate(answers,step);if(errors.length){showErrors(errors);return;}
  if(step<Q.pages(answers).length-1){step++;saveProgress();render();return;}
  const allErrors=Q.validate(answers);
  if(allErrors.length){statusBox.textContent='The saved response is incomplete. Please contact the researcher.';return;}
  if(!configured){statusBox.textContent='Submission is not configured. Please contact the researcher.';return;}
  pending=true;next.disabled=true;next.setAttribute('aria-label','Saving');next.textContent='…';statusBox.textContent='Saving your questionnaire. Please keep this tab open.';
  const serialized=JSON.stringify(Q.fields.map(f=>[f.key,answers[f.key]??(f.type==='checkbox'?false:'')]));
  if(savedPayload!==null&&savedPayload!==serialized)submissionId=crypto.randomUUID();savedPayload=serialized;saveProgress();
  try{
    await send({version:Q.version,submission_id:submissionId,answers});
    complete=true;panel.innerHTML='<div class="success"><h1>Thank you for taking this survey.</h1><p>Your response has been recorded.</p></div>';
    panel.querySelector('h1').tabIndex=-1;panel.querySelector('h1').focus();document.querySelector('.actions').hidden=true;statusBox.textContent='';
    answers={};savedPayload=null;try{localStorage.removeItem(storageKey);}catch{}
    document.getElementById('storage-note').hidden=true;
  }catch(error){statusBox.textContent=error.message+' Your answers have been kept. Select the arrow to try again.';next.textContent='→';next.setAttribute('aria-label','Retry submission');}
  finally{pending=false;next.disabled=false;}
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
window.addEventListener('beforeunload',event=>{if(pending){event.preventDefault();event.returnValue='';}});
restoreProgress();render(false);
