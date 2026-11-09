import test from 'node:test';
import assert from 'node:assert/strict';
import {direction,facing,PLAYER,CRAWLER} from '../src/config/game.js';
import {CrawlerAI} from '../src/systems/EnemyAI.js';
test('diagonal input has identical speed to cardinal input',()=>{assert.ok(Math.abs(Math.hypot(...Object.values(direction(1,1,190)))-190)<1e-10);assert.deepEqual(direction(0,0,190),{x:0,y:0});assert.equal(direction(-1,0,190).x,-190);});
test('aim resolves all four directional sprite states',()=>{assert.equal(facing(10,1),'east');assert.equal(facing(-10,1),'west');assert.equal(facing(1,-10),'north');assert.equal(facing(1,10),'south');});
test('crawler telegraphs, attacks, recovers, and stays dead',()=>{const ai=new CrawlerAI(CRAWLER),enemy={x:0,y:0},player={x:50,y:0};ai.until=0;assert.deepEqual(ai.update(enemy,player,0),{x:0,y:0});assert.equal(ai.state,'telegraph');assert.equal(ai.update(enemy,player,450).x,230);assert.equal(ai.state,'attack');assert.deepEqual(ai.update(enemy,player,590),{x:0,y:0});assert.equal(ai.state,'recover');ai.state='dead';assert.deepEqual(ai.update(enemy,player,10000),{x:0,y:0});});
test('independent player stat copies leave base definition immutable',()=>{const a={...PLAYER},b={...PLAYER};a.damage=20;assert.equal(b.damage,8);assert.ok(Object.isFrozen(PLAYER));});

