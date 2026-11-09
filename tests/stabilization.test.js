import assert from 'node:assert/strict';
import test from 'node:test';
import {campaign} from '../src/systems/Campaign.js';
import {RelicManager} from '../src/systems/RelicManager.js';
import {EnemyAI} from '../src/systems/EnemyAI.js';
import {ENEMIES} from '../src/data/enemies.js';
import {waypoint} from '../src/systems/Pursuit.js';
import {RelicCombat} from '../src/systems/RelicCombat.js';

test('individual cooldowns and selections survive next floor and reset on a new run',()=>{
 const first=campaign('relic-clock'),r=new RelicManager(first);
 [0,1,2,4].forEach(id=>r.collect(id));r.cycle(false);r.cycle(true);
 first.elapsed=2300;r.state.ready[1]=20300;r.state.ready['Frozen Barrage']=22300;
 const next=campaign(first.seed,2,first),restored=new RelicManager(next);
 assert.equal(restored.selected(false),1);assert.equal(restored.selected(true),'Frozen Barrage');
 assert.equal(restored.state.ready[1]-next.elapsed,18000);
 assert.equal(restored.state.ready['Frozen Barrage']-next.elapsed,20000);
 assert.deepEqual(new RelicManager(campaign('new-run')).state.ready,{});
});
test('blocked line of sight routes a spitter around a column and interrupts its windup',()=>{
 const e={x:240,y:300},p={x:480,y:300},columns=[{x:350,y:282}];
 assert.notEqual(waypoint(e,p,columns),p);assert.equal(waypoint(e,p,[]),p);
 const ai=new EnemyAI(ENEMIES.spitter,'spitter');ai.update(e,p,400);assert.equal(ai.state,'telegraph');
 ai.update(e,p,450,true);assert.equal(ai.state,'recover');ai.update(e,p,700,true);assert.equal(ai.state,'chase');
 ai.until=NaN;ai.update(e,p,800);assert.equal(ai.state,'recover');assert.ok(Number.isFinite(ai.until));
});
test('each ability has a single damage budget per boss across direct, chain and field hits',()=>{
 const combat=new RelicCombat({scene:{playable:true,clock:10}});
 const boss={active:true,boss:true,total:0,hit(n){this.total+=n;}};
 const cast={budget:new Map()};for(let i=0;i<30;i++)combat.damage(boss,7,cast);
 assert.equal(boss.total,14);
});
