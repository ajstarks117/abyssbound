import {generateDungeon,validateDungeon} from './DungeonGenerator.js';
export const floors=['The Forgotten Crypt','The Ashen Catacombs','The Plague Laboratories','The Drowned Archives','The Hollow Sanctum','The Heart of the Abyss'];
export function campaign(seed,floor=1,previous={}){
 const run=generateDungeon(floor===1?seed:seed+' / '+floor,true);
 Object.assign(run,{seed,floor,abilities:previous.abilities,lore:previous.lore||[],elapsed:previous.elapsed||0,hp:previous.hp??6,inventory:[...(previous.inventory||[])],kills:previous.kills||0,lanternKills:previous.lanternKills||0});
 const bosses=[null,null,'warden','architect','archivist','commander','heart'];
 const roster=[[],[],['sentinel','leech','spitter'],['host','spore','leech'],['scribe','ink','watcher'],['sentinel','ink','wisp'],['host','watcher','scribe']][floor];
 for(const room of run.rooms){
  if(floor>1&&room.type==='combat'){
   room.enemies.forEach((e,i)=>e.kind=roster[(room.variant+i)%roster.length]);
   room.elite=room===run.rooms.find(r=>r.type==='combat');
   if(room.elite)room.enemies[0].kind=roster[0];
  }
  if(room.type==='boss'&&floor>1){room.cleared=false;room.pillars=[];room.enemies=[{kind:bosses[floor],x:790,y:390}];}
 }
 validateDungeon(run);return run;
}
