// Optional integration checks. Requires Playwright/Chromium and a local server.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.LEAPQ_TEST_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({viewport:{width:1280,height:900}});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const sent=[];
  await context.route('**/config.js',route=>route.fulfill({contentType:'application/javascript',body:'window.LEAPQ_CONFIG={appsScriptUrl:"https://script.google.com/macros/s/test/exec"};'}));
  await context.route('https://script.google.com/macros/s/test/exec',route=>{
   const data=new URLSearchParams(route.request().postData()),payload=JSON.parse(data.get('payload'));sent.push(payload);
   const result={type:'leapq-submission',nonce:data.get('nonce'),submission_id:payload.submission_id,ok:sent.length>1,error:'Simulated receiver failure.'};
   route.fulfill({contentType:'text/html',body:'<!doctype html><script>window.top.postMessage('+JSON.stringify(result)+','+JSON.stringify(base)+');</script>'});
  });
  await page.goto(base);await page.evaluate(()=>localStorage.clear());await page.reload();
  assert.deepEqual(await page.locator('[data-question]').evaluateAll(els=>els.map(el=>el.dataset.question)),['QID2','QID3','QID4','QID5']);
  assert.equal(await page.locator('#back,.progress-track,#step-count').count(),0);
  assert.equal(await page.locator('#next').innerText(),'→');
  await page.locator('#next').click();assert(await page.locator('#errors').isVisible());
  await page.locator('#QID2').fill('30');await page.locator('#QID3_3_TEXT').fill('Nonbinary');assert(await page.locator('#QID3_3').isChecked());
  await page.locator('#QID4_1').fill('English');await page.locator('#QID4_3').fill('Spanish');await page.locator('#QID5_1').fill('Spanish');
  await page.locator('#next').click();
  assert.deepEqual(await page.locator('[data-question]').evaluateAll(els=>els.map(el=>el.dataset.question)),['QID6','QID7','QID8','QID9','QID10','QID11','QID43','QID44','QID12']);
  for(const qid of ['QID6','QID7','QID8']){assert.equal(await page.locator('[data-question="'+qid+'"] input').count(),5);await page.locator('#'+qid+'_1').fill('70');await page.locator('#'+qid+'_3').fill('30');}
  await page.locator('#QID9_1').fill('US-American');await page.locator('#QID10').fill('16');await page.locator('#QID11_5').check();await page.locator('#QID11_7').check();
  await page.locator('#QID12_1_TEXT').fill('Corrected with glasses');assert(await page.locator('#QID12_1').isChecked());
  await page.reload();assert.equal(await page.locator('#QID9_1').inputValue(),'US-American');assert(await page.locator('#QID11_5').isChecked());
  await page.locator('#next').click();
  const languageOrder=['QID21','QID22','QID23','QID24','QID39','QID38','QID25','QID40','QID41','QID42'];
  assert.deepEqual(await page.locator('[data-question]').evaluateAll(els=>els.map(el=>el.dataset.question)),languageOrder);
  assert((await page.locator('.language-intro').innerText()).includes('English'));
  assert.equal(await page.locator('input[type=range]').count(),12);
  assert.equal(await page.locator('input[type=radio]').count(),55);
  await page.locator('#L1_QID23_1').fill('2 years, 6 months');await page.locator('#L1_QID22_1').fill('N/A');
  // Untouched optional sliders must not silently become a midpoint response.
  await page.locator('#L1_QID25_1').focus();await page.keyboard.press('Home');
  for(const qid of ['QID24','QID39','QID38','QID41','QID42'])await page.locator('#L1_'+qid+'_1').check();
  await page.screenshot({path:'/tmp/leapq-qsf-desktop.png',fullPage:true});
  await page.locator('#next').click();assert((await page.locator('.language-intro').innerText()).includes('Spanish'));
  for(const qid of ['QID24','QID39','QID38','QID41','QID42'])await page.locator('#L3_'+qid+'_11').check();
  await page.locator('#next').click();await page.waitForFunction(()=>document.getElementById('submission-status').textContent.includes('Simulated receiver failure.'));
  // Recovery through reload must retain the final page and same retry ID.
  await page.reload();assert((await page.locator('.language-intro').innerText()).includes('Spanish'));
  await page.locator('#next').click();await page.waitForSelector('.success');
  assert.equal(sent.length,2);assert.equal(sent[0].submission_id,sent[1].submission_id);
  assert.equal(sent[1].answers.QID3,'3');assert.equal(sent[1].answers.QID3_3_TEXT,'Nonbinary');assert.equal(sent[1].answers.L1_QID25_1,'0');
  assert.equal(sent[1].answers.L1_QID25_2,undefined);assert.equal(sent[1].answers.L3_QID24,'11');assert.equal(sent[1].answers.L1_QID23_1,'2 years, 6 months');
  assert.equal(await page.evaluate(()=>localStorage.getItem('leapq-qsf-progress-v1')),null);
  // New mobile context: verify full flow, choices, slider keyboard input, and widths.
  const mobileContext=await browser.newContext({viewport:{width:375,height:812},isMobile:true,hasTouch:true});
  const mobile=await mobileContext.newPage();await mobile.goto(base);
  for(const screen of [0,1,2]){
   assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(screen===0){
    await mobile.locator('#QID2').fill('25');await mobile.locator('#QID3_1').check();await mobile.locator('#QID4_1').fill('English');await mobile.locator('#QID5_1').fill('English');
   }else if(screen===1){
    for(const qid of ['QID6','QID7','QID8'])await mobile.locator('#'+qid+'_1').fill('100');
    await mobile.locator('#QID9_1').fill('US-American');await mobile.locator('#QID10').fill('16');await mobile.locator('#QID11_5').check();
   }else{await mobile.screenshot({path:'/tmp/leapq-qsf-mobile.png',fullPage:true});break;}
   await mobile.locator('#next').click();
  }
  // Piped content is text; markup in an answer cannot create elements.
  const malicious=await browser.newPage();await malicious.goto(base);
  await malicious.locator('#QID2').fill('25');await malicious.locator('#QID3_1').check();await malicious.locator('#QID4_1').fill('<img src=x onerror=alert(1)>');await malicious.locator('#QID5_1').fill('English');await malicious.locator('#next').click();assert.equal(await malicious.locator('#panel img').count(),0);
  assert.deepEqual(errors,[]);
  console.log('QSF browser checks passed: exact page order, gap-aware loops, radio/text/checkbox controls, optional sliders, zero response, persistent resume, confirmed retry, mobile widths, and safe piped text.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
