import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {chromium} from 'playwright';

const server=await createServer({server:{host:'127.0.0.1',port:5256}});
await server.listen();
const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(server.resolvedUrls.local[0]+'?test');
 await page.waitForFunction(()=>window.__game?.scene.isActive('Menu'));
 await page.keyboard.press('Enter');await page.waitForFunction(()=>window.__game.scene.isActive('Story'));
 await page.keyboard.press('Space');await page.waitForFunction(()=>window.__game.scene.getScene('Game').player);
 await page.evaluate(async()=>{
  const s=window.__game.scene.getScene('Game'),{campaign}=await import('/src/systems/Campaign.js');
  const {DOORS}=await import('/src/systems/RoomManager.js');
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const check=(v,message)=>{if(!v)throw Error(message);};
  for(const [kind,order] of [['crawler',[0,2,1]],['leech',[1,0,2]],['spitter',[2,0,1]],['mixed',[0,1,2]]]){
   const run=campaign('survivors-'+kind),room=run.rooms.find(r=>r.type==='combat');
   run.current=room.id;room.enemies=[0,1,2].map(i=>({kind:kind==='mixed'?['wisp','leech','spitter'][i]:kind,x:510+i*100,y:400}));
   s.scene.restart({run});await wait(350);s.player.invulnerableUntil=100000;
   const enemies=s.enemies.getChildren().slice();
   for(const enemy of enemies){
    const update=enemy.update.bind(enemy);enemy.frames=0;
    enemy.update=(t,p)=>{enemy.frames++;check(p===s.player,'lost player');return update(t,p);};
   }
   for(const index of order){
    const victim=enemies[index];
    if(kind==='crawler'&&index===0){
     s.player.body.reset(420,400);victim.hp=1;s.combat.fire(s.clock,{x:1,y:0});
     for(let i=0;i<40&&victim.active;i++)await wait(40);
     check(!victim.active,'ordinary projectile failed to kill first crawler');
    }else victim.hit(1000,s.clock);
    const alive=enemies.filter(e=>e.active),before=alive.map(e=>e.frames);
    if(kind==='mixed'&&alive.length){s.player.dodge(s.clock);alive[0].slow=s.clock+500;}
    await wait(220);
    check(!victim.body.enable&&!victim.shadow.scene,'corpse cleanup');
    check(s.roomManager.locked===(alive.length>0),'door state');
    alive.forEach((e,i)=>{
     check(e.frames>before[i],kind+' survivor stopped updating after kill at index '+index);
     check(Math.hypot(e.shadow.x-e.x,e.shadow.y-e.y-22)<16,'survivor shadow stopped tracking');
    });
    if(alive.length===1){
     const survivor=alive[0];survivor.body.reset(160,400);s.player.body.reset(480,400);
     if(kind==='crawler'){
      const pillar=s.room.pillars[0];survivor.body.reset(pillar.x-115,pillar.y+18);
      s.player.body.reset(pillar.x+120,pillar.y+18);
     }
     let x=survivor.x;await wait(kind==='crawler'?4700:3300);
     if(kind==='crawler'||kind==='leech')check(survivor.x>x+40,'failed to pursue after death');
     s.player.body.reset(survivor.x+45,survivor.y);
     let attacked=false;for(let i=0;i<70&&!attacked;i++){await wait(50);attacked=survivor.ai.state==='attack';}
     check(attacked,'survivor failed to attack: '+kind);
    }
   }
   const d=Object.keys(room.links)[0],door=DOORS[d];s.player.body.reset(door.x,door.y);
   check(s.roomManager.travel(d),'cleared door unavailable');await wait(350);
   check(s.run.current===room.links[d]&&s.room.id===room.links[d],'failed travel');
  }
  const run=campaign('summon-survivors',2);run.current=run.rooms.find(r=>r.type==='boss').id;
  s.scene.restart({run});await wait(350);
  const boss=s.enemies.getFirstAlive();boss.move='Summon';boss.attack(s.clock,s.player);
  const [,first,last]=s.enemies.getChildren();first.hit(9999,s.clock);
  last.body.reset(280,400);s.player.body.reset(600,400);await wait(1400);
  const lastShot=s.combat.hostile.getChildren().at(-1);lastShot.enableBody(true,300,300,true,true);
  s.combat.clearHostiles();check(!lastShot.active&&!lastShot.body.enable,'sparse hostile pool cleanup');
  check(last.x>300&&Math.abs(last.shadow.x-last.x)<12&&boss.active&&s.roomManager.locked,'summon survivor');
 });
 assert.deepEqual(errors,[]);console.log('Survivor updates, pursuit, attacks, shadows, room locks, travel and boss summons passed.');
}finally{await browser.close();await server.close();}
