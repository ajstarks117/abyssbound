import test from 'node:test';
import assert from 'node:assert/strict';
import {ENEMIES} from '../src/data/enemies.js';
import {EnemyAI} from '../src/systems/EnemyAI.js';
for(const kind of Object.keys(ENEMIES))test(`${kind}: idle, chase, warning, one attack, recovery and permanent death`,()=>{
 const ai=new EnemyAI(ENEMIES[kind],kind),e={x:0,y:0},far={x:500,y:0},near={x:50,y:0};
 ai.update(e,far,0);assert.equal(ai.state,'idle');ai.update(e,far,400);assert.equal(ai.state,'chase');ai.update(e,near,500);assert.equal(ai.state,'telegraph');const at=500+ENEMIES[kind].windup,attack=ai.update(e,near,at);assert.equal(ai.state,'attack');assert.equal(attack.action,({spore:'explode',scribe:'inkshot',ink:'burst'})[kind]??(kind==='watcher'?'spread':kind==='spitter'?'shoot':kind==='wisp'?'burst':null));assert.equal(ai.update(e,near,at+1).action,undefined);ai.update(e,near,at+ENEMIES[kind].attackDuration);assert.equal(ai.state,'recover');ai.state='dead';assert.deepEqual(ai.update(e,near,100000),{x:0,y:0});
});
test('spitter retreats during recovery',()=>{const ai=new EnemyAI(ENEMIES.spitter,'spitter');ai.state='recover';ai.until=1000;assert.ok(ai.update({x:0,y:0},{x:50,y:0},500).x<0);});
test('wisp teleport request has a cooldown',()=>{const ai=new EnemyAI(ENEMIES.wisp,'wisp');ai.state='recover';ai.until=10000;assert.equal(ai.update({x:0,y:0},{x:50,y:0},3000).teleport,true);assert.equal(ai.update({x:0,y:0},{x:50,y:0},3001).teleport,undefined);});
