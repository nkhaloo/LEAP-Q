/* Shared questionnaire definition and validation. Also embedded in apps-script.txt. */
(function (root) {
  'use strict';
  const scales = {
    identification: ['no identification','very low identification','','','','moderate identification','','','','','complete identification'],
    proficiency: ['none','very low','low','fair','slightly less than adequate','adequate','slightly more than adequate','good','very good','excellent','perfect'],
    contribution: ['not a contributor','minimal contributor','','','','moderate contributor','','','','','most important contributor'],
    exposure: ['never','almost never','','','','half of the time','','','','','always'],
    accent: ['none','almost none','very light','light','some','moderate','considerable','heavy','very heavy','extremely heavy','pervasive']
  };
  const education = ['Less than High School','High School','Professional Training','Some College','College','Some Graduate School','Masters','Ph.D./M.D./J.D.','Other'];
  const groups = [
    {id:'proficiency', number:3, question:'On a scale from zero to ten, please select your level of proficiency in speaking, understanding, and reading in this language:', scale:'proficiency', items:['Speaking','Understanding spoken language','Reading']},
    {id:'learning', number:4, question:'On a scale from zero to ten, please select how much the following factors contributed to you learning this language:', scale:'contribution', items:['Interacting with friends','Interacting with family','Reading','Language tapes/self instruction','Watching TV','Listening to the radio']},
    {id:'exposure', number:5, question:'Please rate to what extent you are currently exposed to this language in the following contexts:', scale:'exposure', items:['Interacting with friends','Interacting with family','Watching TV','Listening to radio/music','Reading','Language-lab/self-instruction']}
  ];
  const milestones = ['began acquiring this language','became fluent in this language','began reading in this language','became fluent reading in this language'];
  const environments = ['A country where this language is spoken','A family where this language is spoken','A school and/or working environment where this language is spoken'];
  const percentages = [
    {id:'current',number:3,question:'Please list what percentage of the time you are currently and on average exposed to each language.'},
    {id:'reading',number:4,question:'When choosing to read a text available in all your languages, in what percentage of cases would you choose to read it in each of your languages? Assume that the original was written in another language, which is unknown to you.'},
    {id:'speaking',number:5,question:'When choosing a language to speak with a person who is equally fluent in all your languages, what percentage of time would you choose to speak each language? Please report percent of total time.'}
  ];
  const fields = [];
  function add(key,label,type,extra) { fields.push(Object.assign({key,label,type:type||'text'},extra||{})); }
  [['last_name','Last Name'],['first_name','First Name'],['today','Today’s Date','date'],['age','Age','age'],['birth_date','Date of Birth','date'],['sex','Male / Female','choice']].forEach(x=>add(...x));
  for(let i=1;i<=5;i++) add('dominance_'+i,'Dominance — language '+i);
  for(let i=1;i<=5;i++) add('acquisition_'+i,'Acquisition — language '+i);
  percentages.forEach(g=>{for(let i=1;i<=5;i++) add(g.id+'_'+i,g.question+' — language '+i,'percent');});
  for(let i=1;i<=5;i++){add('culture_'+i,'Culture '+i);add('culture_rating_'+i,'Culture '+i+' — identification','rating');}
  add('education_years','Years of formal education','age');add('education_level','Highest education level','choice');add('education_other','Other education level');
  add('immigration_usa','Date of immigration to the USA, if applicable');add('immigration_other','Other country and date of immigration','textarea');
  ['vision problem','hearing impairment','language disability','learning disability'].forEach((label,i)=>add('health_'+i,label,'checkbox'));
  add('health_explanation','If yes, please explain (including any corrections)','textarea');
  for(let i=1;i<=5;i++){
    add('l'+i+'_order','Language '+i+' — This is my … language','choice');
    milestones.forEach((label,j)=>add('l'+i+'_age_'+j,'Language '+i+' — Age when you '+label));
    environments.forEach((label,j)=>['years','months'].forEach(unit=>add('l'+i+'_environment_'+j+'_'+unit,'Language '+i+' — '+label+' — '+unit,unit)));
    groups.forEach(g=>g.items.forEach((label,j)=>add('l'+i+'_'+g.id+'_'+j,'Language '+i+' — '+g.id+' — '+label,'rating')));
    add('l'+i+'_accent','Language '+i+' — Perceived foreign accent','rating');
    add('l'+i+'_identified','Language '+i+' — Identified as a non-native speaker based on accent','rating');
  }
  function languages(a){return Array.from({length:5},(_,i)=>String(a['dominance_'+(i+1)]||'').trim()).filter(Boolean);}
  function validate(a,section){
    const errors=[]; const issue=(key,message)=>errors.push({key,message});
    const val=k=>String(a[k]===undefined?'':a[k]).trim();
    const present=k=>val(k)!=='';
    const num=(key,min,max,required,label,integer)=>{
      const v=val(key);if(!v){if(required)issue(key,'Please answer: '+label+'.');return;}
      if(!Number.isFinite(Number(v))||Number(v)<min||Number(v)>max||(integer&&!Number.isInteger(Number(v))))issue(key,label+' must be '+(integer?'a whole number':'a number')+' from '+min+' to '+max+'.');
    };
    const ls=languages(a);
    if(section===undefined||section===0){
      if(!ls.length)issue('dominance_1','Please list at least one language.');
      let gap=false;const seen=[];
      for(let i=1;i<=5;i++){
        const v=val('dominance_'+i);if(!v)gap=true;else{if(gap)issue('dominance_'+i,'List languages consecutively, starting at 1.');if(seen.includes(v.toLowerCase()))issue('dominance_'+i,'List each language only once.');seen.push(v.toLowerCase());}
      }
      const acq=Array.from({length:ls.length},(_,i)=>val('acquisition_'+(i+1)).toLowerCase());
      if(acq.length!==new Set(acq).size||acq.some(v=>!ls.map(x=>x.toLowerCase()).includes(v)))issue('acquisition_1','List the same languages once each in order of acquisition.');
      for(let i=ls.length+1;i<=5;i++)if(present('acquisition_'+i))issue('acquisition_'+i,'Only list languages included in your dominance list.');
      num('age',0,120,false,'Age',false);
      ['today','birth_date'].forEach(k=>{if(present(k)&&(!/^\d{4}-\d{2}-\d{2}$/.test(val(k))||!Number.isFinite(Date.parse(val(k)))||new Date(val(k)).toISOString().slice(0,10)!==val(k)))issue(k,'Please enter a valid date.');});
      if(present('sex')&&!['Male','Female'].includes(val('sex')))issue('sex','Please select Male or Female, or leave this blank.');
    }
    if(section===undefined||section===1){
      percentages.forEach(g=>{let total=0;ls.forEach((l,j)=>{const k=g.id+'_'+(j+1);num(k,0,100,true,l+' percentage',false);total+=Number(val(k));});if(Math.abs(total-100)>.001)issue(g.id+'_1','Question '+g.number+': percentages must add up to 100% (currently '+total+'%).');});
      for(let i=1;i<=5;i++){if(present('culture_'+i))num('culture_rating_'+i,0,10,true,'Identification with '+val('culture_'+i),true);else if(present('culture_rating_'+i))issue('culture_'+i,'Please name the culture for this rating.');}
      num('education_years',0,100,false,'Years of formal education',false);
      if(present('education_level')&&!education.includes(val('education_level')))issue('education_level','Please choose an education level from the list.');
      if(val('education_level')==='Other'&&!present('education_other'))issue('education_other','Please specify your other education level.');
      if(['0','1','2','3'].some(i=>a['health_'+i]===true)&&!present('health_explanation'))issue('health_explanation','Please explain the applicable condition(s), including any corrections.');
    }
    ls.forEach((l,j)=>{
      if(section!==undefined&&section!==j+2)return;
      const i=j+1;const prefix='l'+i+'_';
      if(!['Native','Second','Third','Fourth','Fifth'].includes(val(prefix+'order')))issue(prefix+'order','Please select the acquisition position for '+l+'.');
      milestones.forEach((label,k)=>{const key=prefix+'age_'+k,v=val(key);if(!v)issue(key,'Please enter the age when you '+label+', or N/A.');else if(!/^n\/?a$/i.test(v))num(key,0,120,true,'Age when you '+label,false);});
      environments.forEach((label,k)=>{num(prefix+'environment_'+k+'_years',0,120,true,label+' — years',false);num(prefix+'environment_'+k+'_months',0,11,true,label+' — months',true);});
      groups.forEach(g=>g.items.forEach((label,k)=>num(prefix+g.id+'_'+k,0,10,true,g.id+': '+label,true)));
      num(prefix+'accent',0,10,true,'Perceived foreign accent',true);num(prefix+'identified',0,10,true,'Frequency others identify you as a non-native speaker',true);
    });
    if(section===undefined)fields.forEach(f=>{if(val(f.key).length>5000)issue(f.key,f.label+' is too long (maximum 5,000 characters).');});
    return errors;
  }
  root.LeapQ={version:'LEAP-Q-2007-English-web-1',scales,education,groups,milestones,environments,percentages,fields,languages,validate};
})(typeof globalThis!=='undefined'?globalThis:this);
if(typeof module!=='undefined')module.exports=globalThis.LeapQ;
