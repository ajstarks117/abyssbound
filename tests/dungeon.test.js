import {generateDungeon,validateDungeon} from '../src/systems/DungeonGenerator.js';
import assert from 'node:assert/strict';
import test from 'node:test';
test('1000 seeds: deterministic connected graphs, reciprocal doors, safe corridors and required room types',()=>{for(let i=0;i<1000;i++){const r=generateDungeon(i);assert.ok(validateDungeon(r));assert.ok(r.rooms.length>=6&&r.rooms.length<=9);assert.deepEqual(r,generateDungeon(i));for(const type of ['start','combat','treasure','healing','boss'])assert.ok(r.rooms.some(r=>r.type===type));assert.ok(r.rooms.find(r=>r.type==='boss').distance>=3);}});
