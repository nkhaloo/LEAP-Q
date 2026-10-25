/* QSF-driven field definitions and validation, shared by the website and Apps Script. */
(function(root) {
  'use strict';
  const source=root.LEAPQ_SOURCE;
  const fields=[];
  const choiceOrder=q=>(q.ChoiceOrder||[]).map(String);
  const key=(qid,choice,slot)=> (slot?'L'+slot+'_':'')+qid+(choice?'_'+choice:'');
  const languages=a=>choiceOrder(source.questions.QID4).map(slot=>({slot,name:String(a[key('QID4',slot)]||'').trim()})).filter(l=>l.name);
  function define(qid,slot) {
    const q=source.questions[qid],ids=choiceOrder(q);
    const add=(k,type,choice)=>fields.push({key:k,type,qid,slot:slot||null,choice:choice||null,label:q.QuestionText+(choice?' — '+q.Choices[choice].Display:'')});
    if(q.QuestionType==='DB')return;
    if(q.QuestionType==='TE'){
      if(q.Selector==='FORM')ids.forEach(id=>add(key(qid,id,slot),'text',id));
      else add(key(qid,null,slot),qid==='QID10'?'number':'text');
    }else if(q.QuestionType==='MC'){
      if(q.Selector==='MAVR')ids.forEach(id=>add(key(qid,id,slot),'checkbox',id));
      else add(key(qid,null,slot),'choice');
      ids.filter(id=>q.Choices[id].TextEntry).forEach(id=>add(key(qid,id+'_TEXT',slot),'text',id));
    }else if(q.QuestionType==='CS'||q.QuestionType==='Slider'){
      ids.forEach(id=>add(key(qid,id,slot),q.QuestionType==='CS'?'number':'slider',id));
    }else throw new Error('Unsupported QSF question type '+q.QuestionType);
  }
  source.pages.forEach(page=>{if(page.loop){for(let slot=1;slot<=5;slot++)page.questions.forEach(qid=>define(qid,String(slot)));}else page.questions.forEach(qid=>define(qid));});
  function pages(a) {
    return source.pages.flatMap(page=>page.loop?languages(a).map(l=>({questions:page.questions,slot:l.slot,language:l.name})): [{questions:page.questions}]);
  }
  function activeFields(a) {
    const slots=languages(a).map(l=>l.slot);
    return fields.filter(f=>!f.slot||slots.includes(f.slot));
  }
  function validate(a,pageIndex) {
    const errors=[];
    const value=k=>String(a[k]===undefined?'':a[k]).trim();
    const issue=(k,message)=>errors.push({key:k,message});
    pages(a).forEach((page,index)=>{
      if(pageIndex!==undefined&&pageIndex!==index)return;
      page.questions.forEach(qid=>{
        const q=source.questions[qid],ids=choiceOrder(q),settings=(q.Validation||{}).Settings||{};
        const k=(id)=>key(qid,id,page.slot),required=settings.ForceResponse==='ON';
        if(q.QuestionType==='DB')return;
        if(q.QuestionType==='TE'){
          if(q.Selector==='FORM'){
            // The QSF's custom validation only requires row 1 in these forms.
            if(settings.Type==='CustomValidation'&&!value(k('1')))issue(k('1'),'Please enter a response in the first row.');
          }else{
            if(required&&!value(k()))issue(k(),'Please answer this question.');
            if(value(k())&&settings.ContentType==='ValidNumber'&&!Number.isFinite(Number(value(k()))))issue(k(),'Please enter a valid number.');
          }
        }else if(q.QuestionType==='MC'){
          if(q.Selector==='MAVR'){
            if(required&&!ids.some(id=>a[k(id)]===true))issue(k(ids[0]),'Please select at least one answer.');
          }else{
            const v=value(k());
            if(required&&!v)issue(k(),'Please select an answer.');
            else if(v&&!ids.includes(v))issue(k(),'Please select one of the available answers.');
          }
          // TextEntry fields have no TextEntryForceResponse in this QSF.
        }else if(q.QuestionType==='CS'){
          let total=0,invalid=false;
          ids.forEach(id=>{const v=value(k(id));if(v&&!Number.isFinite(Number(v))){issue(k(id),'Please enter a valid number.');invalid=true;}else total+=Number(v||0);});
          if(!invalid&&Math.abs(total-Number(settings.ChoiceTotal))>0.000001)issue(k(ids[0]),'The total must equal '+settings.ChoiceTotal+'% (currently '+total+'%).');
          // EnforceRange is OFF: do not invent per-row bounds or require zeros in blank rows.
        }else if(q.QuestionType==='Slider'){
          ids.forEach(id=>{const v=value(k(id)),n=Number(v);if(v&&(!Number.isFinite(n)||n<q.Configuration.CSSliderMin||n>q.Configuration.CSSliderMax||!Number.isInteger(n)))issue(k(id),'Please use the slider to select a value from 0 to 10.');});
        }
      });
    });
    activeFields(a).forEach(f=>{if((pageIndex===undefined)&&value(f.key).length>5000)issue(f.key,'Please use no more than 5,000 characters.');});
    return errors;
  }
  root.LeapQ={version:'LEAP-Q-QSF-SV_2mgBwGk76i6HIdD-v1',source,fields,key,choiceOrder,languages,pages,activeFields,validate};
})(typeof globalThis!=='undefined'?globalThis:this);
if(typeof module!=='undefined')module.exports=globalThis.LeapQ;
