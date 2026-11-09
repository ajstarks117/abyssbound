import {createServer} from 'vite';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const server=await createServer({server:{host:'127.0.0.1',port:5224}});await server.listen();
const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(server.resolvedUrls.local[0]+'?test');await page.waitForFunction(()=>window.__game?.scene.isActive('Menu'));
 await page.mouse.click(243,650);await page.waitForFunction(()=>window.__game.scene.isActive('Story'));await page.mouse.click(1180,45);await page.waitForFunction(()=>window.__game.scene.isActive('Menu'));
 await page.keyboard.press('Enter');await page.waitForFunction(()=>window.__game.scene.isActive('Story'));await page.waitForTimeout(700);await page.screenshot({path:'tests/artifacts/eldoria.png'});
 for(let i=0;i<6;i++){await page.waitForFunction(i=>window.__game.scene.getScene('Story').index===i,i);assert.ok(await page.evaluate(()=>{const s=window.__game.scene.getScene('Story');return s.caption.text.length>10&&!window.__game.scene.isActive('Game')&&(s.index===5||s.art.frame.width>100);}));}
 await page.waitForFunction(()=>window.__game.scene.isActive('Game'));
 const cdp=await page.context().newCDPSession(page);
 const heap=[];
 for(let i=0;i<=6;i++){
   if(i){const seed=await page.evaluate(()=>window.__game.scene.getScene('Game').run.seed);await page.keyboard.press('Escape');await page.waitForFunction(()=>window.__game.scene.getScene('Game').paused);await page.waitForTimeout(150);await page.mouse.click(640,399);await page.waitForFunction(old=>window.__game.scene.getScene('Game').run.seed!==old,seed);}
   await page.waitForTimeout(350);
   await cdp.send('HeapProfiler.collectGarbage');
   heap.push(Math.round((await cdp.send('Runtime.getHeapUsage')).usedSize/1048576*10)/10);
   assert.equal(await page.evaluate(()=>window.__game.scene.getScene('Game').input.keyboard.listenerCount('keydown-E')),1);
 }
 console.log('Post-GC JavaScript heap (MiB), initial plus six restarts:',heap);
 await page.evaluate(()=>{const s=window.__game.scene.getScene('Game');s.player.body.reset(255,490);});await page.keyboard.press('e');await page.locator('dialog').waitFor();await page.getByRole('button',{name:'Back'}).click();await page.waitForTimeout(100);assert.ok(await page.evaluate(()=>{const s=window.__game.scene.getScene('Game');return !s.reading&&s.run.lore.length===1;}));
 for(const floor of [2,6]){
 await page.evaluate(async floor=>{const s=window.__game.scene.getScene('Game'),{campaign}=await import('/src/systems/Campaign.js');const run=campaign('release-battle',floor);run.current=run.rooms.find(r=>r.type==='boss').id;s.scene.restart({run,spawn:{x:390,y:390}});},floor);
 await page.waitForTimeout(250);
 // Arrival is a fixture. From here only keyboard and mouse input affects the fight.
 const frames=await page.evaluate(()=>{window.samples=[];window.sampleFrame=(_t,d)=>window.samples.push(d);window.__game.events.on('step',window.sampleFrame);return true;});
 let shoot='',held='',peak=0,outcome='timeout';
 for(let i=0;i<350;i++){const q=await page.evaluate(()=>{const s=window.__game.scene.getScene('Game'),b=s.enemies.getChildren().find(e=>e.boss);return {active:b?.active,dead:s.player.dead,x:b?.x,y:b?.y,px:s.player.x,py:s.player.y,count:s.combat.hostile.countActive(true),move:b?.move,state:b?.ai.state,safe:b?.safeAt(s.player.x),dodge:s.clock>=s.player.nextDodge};});
 if(q.dead||!q.active){outcome=q.dead?'defeat':'boss defeated';break;}peak=Math.max(peak,q.count);const shot=q.x>q.px?'ArrowRight':'ArrowLeft';if(shot!==shoot){if(shoot)await page.keyboard.up(shoot);await page.keyboard.down(shot);shoot=shot;}
 let key=Math.abs(q.py-q.y)>9?(q.py<q.y?'s':'w'):'';if(q.py<235)key='s';if(q.py>555)key='w';if(q.move==='Abyssal Collapse'&&q.state==='telegraph')key=q.safe?'':'d';
 if(key!==held){if(held)await page.keyboard.up(held);if(key)await page.keyboard.down(key);held=key;}
 if(q.dodge&&q.state==='attack'&&Math.hypot(q.x-q.px,q.y-q.py)<175)await page.keyboard.press('Space',{delay:35});
 await page.waitForTimeout(135);}
 if(shoot)await page.keyboard.up(shoot);if(held)await page.keyboard.up(held);
 const perf=await page.evaluate(()=>{window.__game.events.off('step',window.sampleFrame);const a=window.samples.slice(5);return {frames:a.length,meanFps:Math.round(1000*a.length/a.reduce((s,d)=>s+d,0))};});console.log({floor,outcome,peak,...perf});
 }
 assert.deepEqual(errors,[]);console.log('Opening six timed panels, replay/skip, lore and runtime checks passed.');
}finally{await browser.close();await server.close();}

