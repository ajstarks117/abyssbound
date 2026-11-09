import {createServer} from 'vite';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const server=await createServer({server:{host:'127.0.0.1',port:5252}});await server.listen();
const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const p=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
 p.on('pageerror',e=>{if(!errors.includes(e.message))console.log(e.stack);errors.push(e.message);});
 await p.goto(server.resolvedUrls.local[0]+'?test');await p.waitForFunction(()=>window.__game?.scene.isActive('Menu'));
 await p.keyboard.press('Enter');await p.waitForFunction(()=>window.__game.scene.isActive('Story'));await p.keyboard.press('Space');
 await p.waitForFunction(()=>window.__game.scene.getScene('Game').combat);
 const scene=fn=>p.evaluate(fn);
 await p.mouse.down();await p.waitForTimeout(480);await p.mouse.up();assert.equal(await scene(()=>window.__game.scene.getScene('Game').combat.shots),0);
 await p.keyboard.down('d');await p.keyboard.down('ArrowUp');await p.waitForTimeout(150);
 await p.keyboard.down('ArrowLeft');await p.waitForTimeout(480);
 assert.ok(await scene(()=>{const s=window.__game.scene.getScene('Game');return s.player.x>670&&s.player.aim.x===-1&&s.combat.group.getChildren().some(b=>b.active&&b.body.velocity.x===-380&&b.body.velocity.y===0);}));
 await p.keyboard.up('ArrowLeft');await p.waitForTimeout(450);await p.keyboard.up('d');await p.keyboard.up('ArrowUp');
 assert.ok(await scene(()=>window.__game.scene.getScene('Game').player.aim.y===-1));
 await scene(()=>{const s=window.__game.scene.getScene('Game');for(let i=0;i<12;i++)s.relics.collect(i);});
 await p.keyboard.press('Tab');await p.keyboard.press('q');await p.keyboard.press('Shift+Tab');await p.keyboard.press('r');
 assert.ok(await scene(()=>{const s=window.__game.scene.getScene('Game');return s.relics.state.enchant===1&&s.relics.selected(true)==='Frozen Barrage'&&s.relics.state.ready[1]>s.run.elapsed;}));
 await scene(async()=>{const s=window.__game.scene.getScene('Game'),{Enemy}=await import('/src/entities/Enemy.js');const e=new Enemy(s,s.player.x+70,s.player.y,'spitter');s.enemies.add(e);s.combat.enemyFire(e,s.player,s.clock);});
 await p.waitForFunction(()=>window.__game.scene.getScene('Game').player.hp===5);
 assert.ok(await scene(()=>{const s=window.__game.scene.getScene('Game');return s.player.visible&&s.player.active&&s.player.body.enable&&s.playable;}));
 for(const cause of ['contact','projectile','boss','hazard','activation','entry','queued door']){
  await p.evaluate(async cause=>{
   const s=window.__game.scene.getScene('Game');s.player.hp=1;s.player.invulnerableUntil=0;
   const {Enemy}=await import('/src/entities/Enemy.js'),{Boss}=await import('/src/entities/Boss.js');
   if(cause==='entry'||cause==='queued door'){
    const d=Object.keys(s.room.links)[0],{DOORS}=await import('/src/systems/RoomManager.js');
    s.player.body.reset(DOORS[d].x,DOORS[d].y);s.roomManager.travel(d);
    if(cause==='entry')await new Promise(r=>setTimeout(r,430));s.player.hp=1;s.player.damage(1,s.clock);
   }else if(cause==='activation'){s.relics.collect(0);s.combat.effects.activate(false);s.player.damage(1,s.clock);s.tweens.killAll();}
   else if(cause==='contact'||cause==='projectile'){
    const e=new Enemy(s,s.player.x+(cause==='projectile'?85:0),s.player.y,'crawler');s.enemies.add(e);e.ai.state='attack';e.ai.until=s.clock+1500;
    if(cause==='projectile')s.combat.enemyFire(e,s.player,s.clock);
   }else{
    const boss=new Boss(s,720,390,'heart');s.enemies.add(boss);
    if(cause==='boss'){boss.move='Abyssal Collapse';boss.safeParity=Math.floor((s.player.x-112)/132)%2===0?1:0;boss.attack(s.clock,s.player);}
    else{boss.hazard(s.player.x,s.player.y,s.clock-1000,'Rift');boss.tickHazards(s.clock,s.player);}
   }
  },cause);
  await p.waitForFunction(()=>window.__game.scene.getScene('Game').resultShown,null,{timeout:4500});
  const before=await scene(()=>window.__game.scene.getScene('Game').combat.shots);
  await p.keyboard.down('ArrowDown');await p.keyboard.press('q');await p.keyboard.press('r');await p.keyboard.press('Space');await p.keyboard.press('e');await p.waitForTimeout(470);await p.keyboard.up('ArrowDown');
  assert.ok(await p.evaluate(before=>{const s=window.__game.scene.getScene('Game');return s.player.dead&&!s.player.visible&&!s.player.shadow.visible&&!s.player.aura.visible&&!s.player.body.enable&&s.combat.shots===before&&!s.combat.hostile.countActive(true)&&s.overlay.filter(o=>o.text==='RETRY').length===1;},before),cause);
  await p.mouse.click(640,345);await p.waitForFunction(()=>window.__game.scene.getScene('Game').playable&&!window.__game.scene.getScene('Game').physics.world.isPaused);console.log('Death/retry:',cause);
 }
 // Record complete AI cycles across repeated attacks, a dodge and a temporary slow.
 await scene(async()=>{const s=window.__game.scene.getScene('Game'),{Enemy}=await import('/src/entities/Enemy.js');
  s.player.invulnerableUntil=s.clock+30000;window.hist={};
  for(const [i,kind] of ['crawler','spitter','wisp','sentinel','leech','watcher'].entries()){
   const e=new Enemy(s,640+95*Math.cos(i*Math.PI/3),400+85*Math.sin(i*Math.PI/3),kind);s.enemies.add(e);e.slow=s.clock+800;
   window.hist[kind]=[];s.events.on('postupdate',()=>{const h=window.hist[kind];if(h.at(-1)!==e.ai.state)h.push(e.ai.state);});}
 });
 await p.keyboard.press('Space');await p.waitForTimeout(12000);
 const states=await scene(()=>window.hist);for(const [kind,h] of Object.entries(states))assert.ok(h.includes('attack')&&h.includes('recover')&&h.filter(v=>v==='telegraph').length>=2,kind+JSON.stringify(h));
 assert.deepEqual(errors,[]);console.log('All six enemies repeated attack cycles. Direction priority, tab selection and mouse removal passed.');
}finally{await browser.close();await server.close();}

