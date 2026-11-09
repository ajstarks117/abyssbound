import {createServer} from 'vite';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const server=await createServer({server:{host:'127.0.0.1',port:5225}});await server.listen();
const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const p=await browser.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(server.resolvedUrls.local[0]+'?test');await p.waitForFunction(()=>window.__game?.scene.isActive('Menu'));await p.keyboard.press('Enter');await p.waitForFunction(()=>window.__game.scene.isActive('Story'));await p.keyboard.press('Enter');await p.waitForTimeout(350);
 await p.evaluate(async()=>{
 const s=window.__game.scene.getScene('Game'),{campaign}=await import('/src/systems/Campaign.js');
 const pause=ms=>new Promise(r=>setTimeout(r,ms)),ok=(v,m)=>{if(!v)throw Error(m);};
 for(const floor of [2,6]){
 const run=campaign('threshold',floor);run.current=run.rooms.find(r=>r.type==='boss').id;s.scene.restart({run});await pause(350);
 const b=s.enemies.getFirstAlive(),max=b.stats.hp,threshold=floor===2?.60:.65;b.hp=max*threshold;b.update(2000,s.player);ok(b.phase===1,'threshold equality');b.hp-=.1;b.update(2010,s.player);ok(b.phase===2,'second phase');
 b.ai.state='attack';b.move=floor===2?'Charge':'Spiral';let hp=b.hp;b.hit(10,2020);const guarded=hp-b.hp;b.ai.state='recover';hp=b.hp;b.hit(10,2030);ok(hp-b.hp>guarded*1.7,'exposed counter window');
 if(floor===2){b.aim={x:-1,y:0};b.move='Bone barrage';b.attack(2100,s.player);ok(s.combat.hostile.countActive(true)===5,'bone fan');continue;}
 b.hp=max*.30;b.update(2100,s.player);ok(b.phase===2,'final threshold equality');b.hp-=.1;b.update(2110,s.player);ok(b.phase===3,'third phase');b.ai.state='selectAttack';b.until=0;b.update(2200,s.player);ok(b.move==='Abyssal Collapse'&&b.until===4700,'collapse windup');
 for(const parity of [0,1]){b.safeParity=parity;for(let x=126;x<1155;x+=10)ok(Array.from({length:281},(_,i)=>i-140).some(dx=>x+dx>=126&&x+dx<=1154&&b.safeAt(x+dx)),'reachable safe lane');}
 s.player.hp=6;s.player.invulnerableUntil=0;s.player.x=310;b.safeParity=1;b.attack(4700,s.player);ok(s.player.hp===6,'safe lane');s.player.x=180;b.attack(4710,s.player);ok(s.player.hp===4,'hazard lane');b.move='Returning orbit';b.attack(5000,s.player);const shot=s.combat.hostile.getFirstAlive();const vx=shot.body.velocity.x;s.combat.update(5660);ok(shot.body.velocity.x*vx<0,'contracting ring');b.hit(10000,5700);const count=s.combat.enemyShots;b.attack(6000,s.player);ok(s.combat.enemyShots===count,'dead boss silence');
 }});
 await p.waitForFunction(()=>window.__game.scene.isActive('Story'));for(let i=0;i<4;i++)await p.waitForFunction(i=>window.__game.scene.getScene('Story').index===i,i);
 await p.waitForFunction(()=>window.__game.scene.isActive('Game')&&window.__game.scene.getScene('Game').overlay.some(o=>o.text==='THE CURSE IS BROKEN'));assert.deepEqual(errors,[]);console.log('Boss thresholds, both exposed cores, barrage, collapse, returning orbit, four-panel ending and victory passed.');
}finally{await browser.close();await server.close();}

