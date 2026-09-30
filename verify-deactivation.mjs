import { chromium } from '/Users/gustavoguerra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:870}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4174/#settings/deactivate');await page.getByRole('button',{name:'Deactivate account',exact:true}).click();
 const modal=page.locator('.deactivation-dialog');
 assert.equal(await modal.evaluate(el=>getComputedStyle(el,'::backdrop').backgroundColor),'rgba(243, 245, 250, 0.7)');
 assert(await modal.getByRole('button',{name:'Continue to deactivate account'}).isDisabled());
 await modal.screenshot({path:'/private/tmp/deactivate-1.png'});
 await modal.getByLabel('Other reason',{exact:true}).check();assert(await modal.getByRole('button',{name:'Continue to deactivate account'}).isDisabled());
 await modal.getByRole('textbox',{name:'Tell us your reason'}).fill('Testing the prototype flow');await modal.getByRole('button',{name:'Continue to deactivate account'}).click();
 assert(await modal.getByRole('button',{name:'Deactivate account',exact:true}).isDisabled());await modal.screenshot({path:'/private/tmp/deactivate-2.png'});
 await modal.getByRole('checkbox').check();await modal.getByRole('button',{name:'Deactivate account',exact:true}).click();await modal.getByRole('button',{name:'Reactivate account'}).waitFor();await modal.screenshot({path:'/private/tmp/deactivate-3.png'});
 await modal.getByRole('button',{name:'Reactivate account'}).click();await page.waitForURL('**/#dashboard');
 await page.goto('http://127.0.0.1:4174/#settings/deactivate');await page.getByRole('button',{name:'Deactivate account',exact:true}).click();await modal.getByRole('button',{name:'Skip',exact:true}).click();await modal.getByRole('checkbox').check();await modal.getByRole('button',{name:'Deactivate account',exact:true}).click();await modal.getByRole('button',{name:'Close',exact:true}).click();await page.waitForURL('**/#signin');
 await page.getByRole('textbox',{name:'Your Email'}).fill('demo@example.com');await page.getByRole('button',{name:'Continue',exact:true}).click();for(let i=0;i<6;i++)await page.getByRole('textbox',{name:`Code digit ${i+1}`}).fill('371824'[i]);await page.getByRole('button',{name:'Continue',exact:true}).click();await page.waitForURL('**/#dashboard');
 await page.goto('http://127.0.0.1:4174/#settings/deactivate');await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Deactivate account',exact:true}).click();assert.equal(await modal.evaluate(el=>el.scrollWidth>el.clientWidth),false);await page.keyboard.press('Escape');assert(!(await modal.isVisible()));
 assert.deepEqual(errors,[]);console.log('PASS: reason/other validation, skip, required acknowledgement, completion, close, reactivation, sign-in reactivation, overlay, Escape and mobile.');
}finally{await browser.close();}
