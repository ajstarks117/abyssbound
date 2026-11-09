import {createServer} from 'vite';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const server=await createServer({server:{host:'127.0.0.1',port:5210}});await server.listen();
const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(server.resolvedUrls.local[0]+'?test&seed=campaign-qa');await page.waitForFunction(()=>window.__game?.scene.isActive('Menu'));await page.keyboard.press('Enter');await page.waitForFunction(()=>window.__game.scene.isActive('Story'));await page.keyboard.press('Space');await page.waitForTimeout(350);
 const result=await page.evaluate(async()=>{
 const s=window.__game.scene.getScene('Game'),wait=ms=>new Promise(r=>setTimeout(r,ms)),ok=(v,msg)=>{if(!v)throw Error(msg);};
 const {DOORS}=await import('/src/systems/RoomManager.js');const {campaign}=await import('/src/systems/Campaign.js');const {validateDungeon}=await import('/src/systems/DungeonGenerator.js');
 const roster=new Set();for(let seed=0;seed<100;seed++)for(let floor=1;floor<=6;floor++){const run=campaign(String(seed),floor);validateDungeon(run);run.rooms.forEach(r=>r.enemies.forEach(e=>roster.add(e.kind)));}ok(roster.size===15,'ten enemies and five bosses');
 const {Enemy}=await import('/src/entities/Enemy.js');
 const spawn=(kind)=>{const e=new Enemy(s,690,400,kind);s.enemies.add(e);return e;};
 const host=spawn('host');host.hit(1,500);ok(s.combat.hostile.countActive(true)===4,'host vents spores');host.hit(1,510);ok(s.combat.enemyShots===4,'spore release cooldown');
 const scribe=spawn('scribe');scribe.update(500,s.player);scribe.update(1300,s.player);ok(s.combat.ink.length===1,'scribe ink pool');s.combat.update(2000);ok(s.player.inkUntil>2000,'ink slows');s.combat.update(4100);ok(!s.combat.ink.length,'ink expires');
 const wraith=spawn('ink');wraith.update(500,s.player);ok(wraith.alpha<.2,'wraith vanishes');wraith.update(1250,s.player);ok(wraith.alpha===1,'wraith reappears');wraith.update(1450,s.player);ok(s.combat.bursts===1,'wraith strikes');
 const spore=spawn('spore');spore.update(500,s.player);ok(spore.ai.state==='telegraph'&&spore.active,'spore warning');spore.update(1500,s.player);ok(!spore.active&&s.combat.bursts===2,'spore detonates');
 for(const e of [host,scribe,wraith])e.hit(9999,1600);s.combat.clearHostiles();s.player.inkUntil=0;
 s.relics.collect(4);s.relics.collect(1);s.player.hp=5;
 for(let floor=1;floor<=6;floor++){
 ok(s.run.floor===floor&&s.run.seed==='campaign-qa','floor and seed');ok(s.relics.active().some(f=>f[0]==='Frozen Barrage'),'fusion retained');
 s.player.body.reset(255,490);s.input.keyboard.emit('keydown-E');ok(s.reading&&s.dialog.querySelector('p').textContent.includes('Day '+floor),'entry document');if(floor>1){const title=s.dialog.querySelector('h2').textContent;const buttons=[...s.dialog.querySelectorAll('button')];buttons.find(b=>b.textContent==='Previous').click();ok(s.dialog.querySelector('h2').textContent!==title,'previous entry');buttons.find(b=>b.textContent==='Next').click();ok(s.dialog.querySelector('h2').textContent===title,'next entry');}s.dialog.close();await wait(50);ok(!s.reading,'close document');
 for(const destination of ['healing','boss']){const rooms=s.run.rooms,goal=rooms.find(r=>r.type===destination).id,queue=[[s.run.current,[]]],seen=new Set();let path;
 while(queue.length){const [id,p]=queue.shift();if(id===goal){path=p;break;}if(seen.has(id))continue;seen.add(id);for(const [d,n] of Object.entries(rooms[id].links))queue.push([n,[...p,d]]);}
 for(const d of path){s.enemies.getChildren().filter(e=>e.active).forEach(e=>e.hit(9999,s.clock));const pos=DOORS[d];s.player.body.reset(pos.x,pos.y);ok(s.roomManager.travel(d),'door transition');await wait(450);}
 if(destination==='healing'){s.player.body.reset(255,490);s.input.keyboard.emit('keydown-E');ok(s.dialog?.querySelector('p').textContent.length>90,'fountain document');s.dialog.close();await wait(60);}
 }
 if(floor>1){const boss=s.enemies.getFirstAlive();ok(boss.boss&&s.roomManager.locked,'boss lock');s.player.body.reset(640,400);s.roomManager.interact();ok(!s.transitioning,'cannot skip boss');
 ok(boss.kind===[null,null,'warden','architect','archivist','commander','heart'][floor],'floor guardian');
 let t=2000;boss.update(t,s.player);boss.update(++t,s.player);ok(boss.ai.state==='telegraph','warn before attack');boss.update(boss.until-1,s.player);ok(boss.ai.state==='telegraph','full warning');t=boss.until;boss.update(t,s.player);ok(boss.ai.state==='attack','attack');
 s.run.elapsed+=21000;ok(s.combat.effects.activate(true),"manual barrage");const shots=s.combat.group.getChildren().filter(p=>p.active);ok(shots.length===3,'manual frost volley');s.combat.effects.hit(shots[0],boss);ok(boss.hp<boss.stats.hp&&boss.slow>s.clock,'boss affected by relic');
 boss.hp=boss.stats.hp*.49;boss.update(++t,s.player);ok(boss.phase===2&&boss.ai.state==='phaseTransition','phase 2');const until=boss.until;boss.update(++t,s.player);ok(boss.until===until,'phase transition only once');
 if(floor===6){boss.hp=boss.stats.hp*.24;boss.update(++t,s.player);ok(boss.phase===3,'final phase');}
 if(floor>=3&&floor<=5){
 const moves={3:['Spore fan','Culture bed'],4:['Index wheel','Rune trap','Blink'],5:['Sword measure','Counter guard','Charge']}[floor];
 for(const move of moves){boss.move=move;boss.ai.state='telegraph';if(move==='Counter guard'){boss.hit(1,t);ok(boss.counterArmed,'armed counter');}
 const hazards=boss.hazards.length,shots=s.combat.enemyShots,oldX=boss.x;boss.attack(t,s.player);
 if(move==='Blink')ok(boss.x!==oldX,'archive teleport');else if(move==='Spore fan')ok(s.combat.enemyShots>shots,'spore fan');else if(move!=='Charge')ok(boss.hazards.length>hazards,'new warning '+move);}
 }
 boss.move='Summon';boss.attack(t,s.player);ok(s.enemies.countActive(true)>=3,'summoned minions');
 boss.hit(9999,s.clock);ok(!s.enemies.countActive(true)&&!s.combat.hostile.countActive(true),'arena cleaned');ok(!s.roomManager.locked,'exit unlocked');}
 if(floor<6){const hp=s.player.hp;s.player.body.reset(640,400);s.roomManager.interact();await wait(550);ok(s.player.hp===hp,'health preserved');}
 }
 await wait(250);ok(window.__game.scene.isActive('Story'),'ending starts');ok(s.run.lore.length===12,'twelve expedition papers');ok(window.__game.scene.getScene('Story').panels[2][2].includes('cylinder'),'evidence ending');window.__game.scene.getScene('Story').leave();await wait(200);ok(s.ended&&!s.player.dead&&s.overlay.some(o=>o.text==='THE CURSE IS BROKEN'),'victory');ok(!s.combat.hurtPlayer({x:0,y:0}),'no loss after win');
 return 'six floors complete';});assert.equal(result,'six floors complete');await page.waitForFunction(()=>window.__game.scene.getScene('Game').resultShown);await page.waitForTimeout(120);await page.mouse.click(640,345);await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>window.__game.scene.getScene('Game').run.floor),1);await page.evaluate(async()=>{const s=window.__game.scene.getScene('Game'),{campaign}=await import('/src/systems/Campaign.js');const run=campaign('death',6);run.current=run.rooms.find(r=>r.type==='boss').id;s.scene.restart({run});});await page.waitForTimeout(400);
 await page.evaluate(()=>{const s=window.__game.scene.getScene('Game'),boss=s.enemies.getFirstAlive();s.player.body.reset(640,400);boss.body.reset(760,415);boss.until=99999;s.player.hp=1;s.combat.enemyFire(boss,s.player,s.clock);});
 await page.waitForFunction(()=>window.__game.scene.getScene('Game').player.dead,{},{timeout:5000});assert.ok(await page.evaluate(()=>window.__game.scene.getScene('Game').ended));await page.waitForFunction(()=>window.__game.scene.getScene('Game').resultShown);await page.waitForTimeout(120);await page.mouse.click(640,345);await page.waitForTimeout(400);assert.ok(await page.evaluate(()=>!window.__game.scene.getScene('Game').player.dead));assert.deepEqual(errors,[]);console.log(result,'— restart and runtime checks passed');
}finally{await browser.close();await server.close();}

