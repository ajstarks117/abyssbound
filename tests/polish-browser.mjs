import {createServer} from 'vite';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const server=await createServer({server:{host:'127.0.0.1',port:5220}});await server.listen();
const b=await chromium.launch({executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const p=await b.newPage({viewport:{width:1280,height:720}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(server.resolvedUrls.local[0]+'?test');await p.waitForFunction(()=>window.__game?.scene.isActive('Menu'));
 await p.screenshot({path:'tests/artifacts/menu-m6.png'});
 for(const [x,name] of [[165,'How to Play'],[477,'Credits'],[321,'Settings']]){
 await p.mouse.click(x,580);await p.getByRole('heading',{name,exact:true}).waitFor();
 if(name==='Settings'){for(const [index,value] of [60,30,50].entries())await p.locator('input[type=range]').nth(index).fill(String(value));await p.getByLabel('Screen shake').uncheck();await p.getByLabel('Fullscreen').check();await p.waitForFunction(()=>!!document.fullscreenElement);await p.getByLabel('Fullscreen').uncheck();}
 await p.getByRole('button',{name:'Back'}).click();await p.locator('dialog').waitFor({state:'detached'});await p.waitForTimeout(100);}
 await p.reload();await p.waitForFunction(()=>window.__game?.scene.isActive('Menu'));await p.mouse.click(321,580);assert.equal(await p.locator('input').first().inputValue(),'60');await p.getByRole('button',{name:'Back'}).click();await p.locator('dialog').waitFor({state:'detached'});await p.waitForTimeout(100);await p.mouse.click(243,429);await p.waitForFunction(()=>window.__game.scene.isActive('Story'));await p.keyboard.press('Space');await p.waitForFunction(()=>window.__game.scene.isActive('Game'));await p.waitForTimeout(300);
 await p.screenshot({path:'tests/artifacts/crypt-m6.png'});await p.keyboard.press('Escape');await p.waitForTimeout(100);await p.mouse.click(640,453);await p.getByRole('heading',{name:'Settings'}).waitFor();assert.ok(await p.evaluate(()=>window.__game.scene.getScene('Game').paused));await p.getByRole('button',{name:'Back'}).click();await p.locator('dialog').waitFor({state:'detached'});await p.waitForTimeout(100);await p.mouse.click(640,345);await p.waitForTimeout(100);
 assert.ok(await p.evaluate(()=>{const s=window.__game.scene.getScene('Game');return !s.paused&&s.audio.ctx.state==='running'&&Math.abs(s.audio.music.gain.value-.18)<.001;}));
 await p.evaluate(()=>{const s=window.__game.scene.getScene('Game');s.player.damage(100,s.clock);});await p.waitForTimeout(450);assert.ok(await p.evaluate(()=>{const s=window.__game.scene.getScene('Game');return s.ended&&!s.player.visible&&!s.player.aura.visible&&!s.player.shadow.visible&&s.overlay.some(o=>o.text?.includes('Run time'));}));
 await p.mouse.click(640,345);await p.waitForTimeout(350);assert.ok(await p.evaluate(()=>!window.__game.scene.getScene('Game').player.dead));assert.deepEqual(errors,[]);console.log('Menu, settings, volume gains, fullscreen, persistence, pause, death and retry passed.');
}finally{await b.close();await server.close();}

