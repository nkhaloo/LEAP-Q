// Optional browser integration checks: requires Playwright and an installed Chromium.
// Run against a local preview with: node tests/browser.cjs
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.LEAPQ_TEST_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  let sent=[];
  await page.route('**/config.js',route=>route.fulfill({contentType:'application/javascript',body:'window.LEAPQ_CONFIG={appsScriptUrl:"https://script.google.com/macros/s/test/exec"};'}));
  await page.route('https://script.google.com/macros/s/test/exec',route=>{
   const data=new URLSearchParams(route.request().postData());
   const payload=JSON.parse(data.get('payload'));sent.push(payload);
   const result={type:'leapq-submission',nonce:data.get('nonce'),submission_id:payload.submission_id,ok:sent.length>1,error:'Simulated receiver failure.'};
   route.fulfill({contentType:'text/html',body:'<!doctype html><script>window.top.postMessage('+JSON.stringify(result)+','+JSON.stringify(base)+');</script>'});
  });
  await page.goto(base);
  await page.locator('#next').click();assert(await page.locator('#errors').isVisible());
  await page.locator('#dominance_1').fill('English');await page.locator('#dominance_2').fill('Spanish');
  await page.locator('#acquisition_1').fill('Spanish');await page.locator('#acquisition_2').fill('English');
  await page.locator('#next').click();assert.equal(await page.locator('h2').innerText(),'Experience & background');
  for(const g of ['current','reading','speaking']){await page.locator('#'+g+'_1').fill('60');await page.locator('#'+g+'_2').fill('40');}
  await page.locator('#next').click();assert.equal(await page.locator('h2').innerText(),'English');
  assert.equal(await page.locator('#l1_order').inputValue(),'Second');
  await page.locator('#back').click();await page.locator('#back').click();
  // Swap dominance order; percentage responses must stay with their language.
  await page.locator('#dominance_1').fill('Spanish');await page.locator('#dominance_2').fill('English');
  await page.locator('#next').click();assert.equal(await page.locator('#current_1').inputValue(),'40');assert.equal(await page.locator('#current_2').inputValue(),'60');
  await page.locator('#next').click();assert.equal(await page.locator('h2').innerText(),'Spanish');assert.equal(await page.locator('#l1_order').inputValue(),'Native');
  for(let i=1;i<=2;i++){
   await page.locator('#next').click();assert(await page.locator('#errors').isVisible());
   await page.locator('#panel input').evaluateAll(inputs=>inputs.forEach(input=>{input.value=input.type==='number'?'0':'N/A';input.dispatchEvent(new Event('input',{bubbles:true}));}));
   await page.locator('#panel select').evaluateAll(inputs=>inputs.forEach(input=>{if(input.id.endsWith('_order'))return;input.value='0';input.dispatchEvent(new Event('change',{bubbles:true}));}));
   if(i===1){await page.locator('#l1_age_0').fill('5');}
   await page.locator('#next').click();
  }
  assert.equal(await page.locator('h2').innerText(),'Review your answers');
  await page.locator('#back').click();assert.equal(await page.locator('#l2_accent').inputValue(),'0');
  await page.locator('#back').click();assert.equal(await page.locator('#l1_age_0').inputValue(),'5');
  await page.locator('#next').click();await page.locator('#next').click();
  await page.locator('#next').click();await page.waitForFunction(()=>document.getElementById('submission-status').textContent.includes('Simulated receiver failure.'));
  assert.equal(await page.locator('h2').innerText(),'Review your answers');
  await page.locator('#next').click();await page.waitForSelector('.success');
  assert.equal(sent.length,2);assert.equal(sent[0].submission_id,sent[1].submission_id);
  assert.equal(sent[1].answers.dominance_1,'Spanish');assert.equal(sent[1].answers.current_1,'40');assert.equal(sent[1].answers.l1_age_0,'5');
  assert.equal(await page.locator('.success p').first().innerText(),'Your questionnaire has been saved.');
  const mobile=await browser.newPage({viewport:{width:375,height:812},isMobile:true,hasTouch:true});
  await mobile.goto(base);assert(await mobile.locator('#setup-notice').isVisible());
  await mobile.screenshot({path:'/tmp/leapq-mobile.png',fullPage:true});
  const overflow=await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);
  await mobile.locator('#dominance_1').fill('English');await mobile.locator('#acquisition_1').fill('English');await mobile.locator('#next').click();
  assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  for(const g of ['current','reading','speaking'])await mobile.locator('#'+g+'_1').fill('100');
  await mobile.locator('#next').click();assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await mobile.screenshot({path:'/tmp/leapq-mobile-language.png',fullPage:true});
  assert.deepEqual(errors,[]);
  console.log('Browser checks passed: two-language flow, zero/N/A answers, back navigation, language reorder, failed save, confirmed retry, same submission ID, mobile layout, unconfigured notice.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
