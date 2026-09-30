import { chromium } from '/Users/gustavoguerra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const page=await browser.newPage();
 for(const reducedMotion of ['no-preference','reduce']){
  await page.emulateMedia({reducedMotion});
  await page.goto('http://127.0.0.1:4174/#setup/whitepaper');
  await page.getByLabel('Your whitepaper link').fill('https://acme.com/whitepaper');
  await page.getByRole('button',{name:'Continue',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.progress')?.dataset.progress==='40');
  const samples=await page.evaluate(()=>new Promise(resolve=>{const values=[];const sample=()=>{const bar=document.querySelector('.progress');const value=Number(bar.dataset.displayed);values.push(value);if(value===40)resolve(values);else requestAnimationFrame(sample);};sample();}));
  assert.equal(samples.at(-1),40);
  if(reducedMotion==='reduce')assert.equal(samples.length,1);
  else {assert(samples.some(v=>v>20&&v<40));assert(samples.every((v,i)=>i===0||v>=samples[i-1]));}
  assert.equal(await page.locator('.progress span').textContent(),'40%');
 }
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('http://127.0.0.1:4174/#setup/plan');await page.getByRole('button',{name:'Choose Starter'}).click();
 await page.waitForFunction(()=>document.querySelector('.progress')?.dataset.displayed==='80');
 await page.getByRole('button',{name:/Sign in$/}).click();await page.getByRole('button',{name:'Simulate verification',exact:true}).click();
 assert(await page.getByRole('button',{name:'Signed in to X as @acme_labs'}).isDisabled());
 const completion=await page.evaluate(()=>new Promise(resolve=>{const samples=[];const sample=()=>{const b=document.querySelector('.progress');samples.push({value:Number(b.dataset.displayed),green:b.classList.contains('complete')});if(b.dataset.displayed==='100')resolve(samples);else requestAnimationFrame(sample);};sample();}));
 assert(completion.some(s=>s.value>80&&s.value<100));assert(completion.every(s=>!s.green||s.value===100));
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('.progress .fill')).backgroundColor==='rgb(52, 199, 89)');
 await page.screenshot({path:'/private/tmp/b2b-setup-complete.png'});
 await page.getByRole('button',{name:'Go to dashboard'}).click();await page.getByRole('button',{name:'Account menu'}).click();assert(await page.getByRole('button',{name:'Finish setup',exact:true}).isDisabled());
 console.log('PASS: Progress animation, 80–100% completion before green fade, signed-in X button, dashboard navigation, disabled setup menu, and reduced motion.');
}finally{await browser.close();}
