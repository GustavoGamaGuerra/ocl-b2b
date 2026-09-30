import { chromium } from '/Users/gustavoguerra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:870}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4174/#settings/billing');
 await page.getByRole('link',{name:'Payment details',exact:true}).click();
 await page.getByRole('heading',{name:'Balance',exact:true}).waitFor();
 assert.equal(await page.locator('dialog[open]').count(),0);
 await page.getByRole('combobox',{name:'Payment network'}).click();
 await page.getByRole('option',{name:'Polygon',exact:true}).click();
 assert.equal(await page.locator('[name=paymentNetwork]').inputValue(),'Polygon');
 await page.getByRole('link',{name:'Transactions',exact:true}).click();
 await page.locator('.billing-transactions').waitFor();
 assert.equal(await page.locator('.billing-currency').count(),9);
 assert.equal(await page.locator('.billing-result').filter({hasText:'Failed'}).count(),3);
 assert.equal(await page.locator('.billing-result').filter({hasText:'Completed'}).count(),6);
 await page.getByRole('link',{name:'Payment details',exact:true}).click();
 assert.equal(await page.locator('[name=paymentNetwork]').inputValue(),'Polygon');
 await page.getByRole('combobox',{name:'Payment network'}).click();await page.getByRole('option',{name:'Ethereum',exact:true}).click();
 for(const tab of ['payment','transactions']){
  await page.goto('http://127.0.0.1:4174/#settings/billing/'+tab);
  await page.locator('.billing-screen').waitFor();await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
  assert.deepEqual(await page.evaluate(()=>[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)),[]);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:'/private/tmp/b2b-billing-'+tab+'.png',fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});
 for(const tab of ['payment','transactions']){await page.goto('http://127.0.0.1:4174/#settings/billing/'+tab);await page.locator('.billing-screen').waitFor();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
 assert.deepEqual(errors,[]);console.log('PASS: Billing tabs, direct links, network selection persistence, nine payment records, statuses, local assets, desktop/mobile overflow, and browser errors.');
}finally{await browser.close();}
