import { chromium } from '/Users/gustavoguerra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:870}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4174/#settings/project');
 const data=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=180;c.height=100;const ctx=c.getContext('2d');ctx.fillStyle='#1e84eb';ctx.fillRect(0,0,180,100);return c.toDataURL().split(',')[1];});
 const fixture={name:'logo.png',mimeType:'image/png',buffer:Buffer.from(data,'base64')};
 const popup=page.locator('.image-upload-dialog');
 await page.getByRole('button',{name:'Upload company logo',exact:true}).click();
 assert(await popup.getByRole('button',{name:'Save',exact:true}).isDisabled());
 await page.waitForFunction(()=>[...document.images].every(i=>i.complete));await page.screenshot({path:'/private/tmp/b2b-upload-empty.png'});
 await popup.locator('input[type=file]').setInputFiles(fixture);await popup.getByRole('button',{name:'Save',exact:true}).waitFor();await page.waitForFunction(()=>!document.querySelector('[data-upload-save]').disabled);
 assert.equal(await page.locator('.project-logo.placeholder').count(),1);
 await page.screenshot({path:'/private/tmp/b2b-upload-preview.png'});
 await popup.getByRole('button',{name:'Cancel',exact:true}).click();assert.equal(await page.locator('.project-logo.placeholder').count(),1);
 await page.getByRole('button',{name:'Upload company logo',exact:true}).click();await popup.locator('input[type=file]').setInputFiles(fixture);await page.waitForFunction(()=>!document.querySelector('[data-upload-save]').disabled);await popup.getByRole('button',{name:'Save',exact:true}).click();
 const project=await page.locator('.project-logo img').getAttribute('src');assert(project.startsWith('blob:'));
 await page.getByRole('link',{name:'Digital asset',exact:true}).click();await page.getByRole('button',{name:'Upload digital asset image',exact:true}).click();
 await popup.locator('input[type=file]').setInputFiles({name:'bad.txt',mimeType:'text/plain',buffer:Buffer.from('invalid')});assert(await popup.getByRole('alert').isVisible());assert(await popup.getByRole('button',{name:'Save',exact:true}).isDisabled());
 await popup.locator('input[type=file]').setInputFiles({name:'bad.png',mimeType:'image/png',buffer:Buffer.from('not a real image')});await page.getByText('This image could not be opened. Please choose another file.').waitFor();
 await popup.locator('.image-dropzone').evaluate((el,data)=>{const binary=atob(data);const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));const transfer=new DataTransfer();transfer.items.add(new File([bytes],'dropped.png',{type:'image/png'}));el.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:transfer}));},data);
 await page.waitForFunction(()=>!document.querySelector('[data-upload-save]').disabled);await popup.getByRole('button',{name:'Save',exact:true}).click();assert.equal(await page.locator('.project-logo img').getAttribute('src'),project);
 const digital=await page.locator('[data-upload-kind=digital] img').getAttribute('src');assert.notEqual(digital,project);
 await page.getByRole('button',{name:'Upload digital asset image',exact:true}).click();await page.keyboard.press('Escape');assert(!(await popup.isVisible()));
 await page.goto('http://127.0.0.1:4174/#dashboard');assert.equal(await page.locator('.digital-asset-logo img').getAttribute('src'),digital);
 await page.goto('http://127.0.0.1:4174/#settings/digital');await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Upload digital asset image',exact:true}).click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);console.log('PASS: Figma upload dialog, preview, cancel, save, drag/drop, file validation, Escape, project/digital isolation, dashboard propagation, and mobile layout.');
}finally{await browser.close();}
