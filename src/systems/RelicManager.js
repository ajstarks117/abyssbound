import {PLAYER} from '../config/game.js';
const rows=[
['Ember Heart',"Q · Fire enchant for 5s.",'Uncommon',0xff863f,'0110110/1111111/1111111/0111110/0011100/0001000'],
['Frost Fang',"Q · Frost enchant for 5s.",'Common',0x91eaff,'0111110/0011110/0011100/0011000/0010000'],
['Storm Eye',"Q · Chain lightning up to two jumps.",'Rare',0xffdc73,'0011100/0110110/1101011/0110110/0011100'],
['Void Pearl',"Q · Pull enemies ahead for 2s.",'Rare',0xad77ef,'0011100/0110110/1100011/1110111/0111110/0011100'],
['Twin Sigil',"Every fifth cast fires a parallel bolt.",'Rare',0x68eee2,'0100010/1110111/0100010/0100010/0100010'],
['Piercing Thorn',"Every fourth bolt pierces once.",'Uncommon',0xdba6a0,'0000011/0000110/0101100/0111000/0011000/0100000'],
['Echo Crystal',"Every fifth successful cast may echo.",'Rare',0xbd9cff,'0001000/0011100/0110110/0111110/0011100/0001000'],
['Guardian Shell',"Gain one maximum health.",'Common',0xe2c17d,'0111110/1101011/1101011/0111110/0011100/0001000'],
['Swift Feather',"Move 8% faster.",'Common',0xacd88f,'0000111/0001111/0011101/0111100/0110000/1000000'],
['Blood Pact',"Deal 15% more damage below 40% HP.",'Rare',0xff6279,'0001000/0011100/0011100/0111110/0110110/0011100'],
['Ricochet Rune',"Every sixth bolt bounces once.",'Uncommon',0xf1b268,'1000001/0100001/0010101/0001111/0010001'],
['Soul Lantern',"Heal one HP per twelve kills.",'Uncommon',0x8befaa,'0011100/0010100/0111110/0101010/0111110/0011100']];
export const relics=rows.map(([name,desc,rarity,color,icon],id)=>({id,name,desc,rarity,color,icon}));
export const fusions=[['Thunderfire',0,2,'Chain lightning ignites its victim.'],['Frozen Barrage',1,4,'Cast a volley of three slowing bolts.'],['Gravity Well',3,10,'Create a damaging gravity field.'],['Crimson Echo',9,6,'Fire a crimson burst, stronger at low health.'],['Inferno Lance',5,0,'Cast a piercing lance with a burning trail.']];
export class RelicManager{
 constructor(run){this.run=run;run.inventory??=[];this.state=run.abilities??={active:null,fusion:null,ready:{},activeLock:0,fusionLock:0,enchant:null,until:0,casts:0,bolts:0,hits:0};}
 choices(fusion){return fusion?this.active().map(f=>f[0]):this.run.inventory.filter(id=>id<4);}
 selected(fusion){const list=this.choices(fusion),key=fusion?'fusion':'active';return list.includes(this.state[key])?this.state[key]:list[0];}
 cycle(fusion){const list=this.choices(fusion);if(list.length)this.state[fusion?'fusion':'active']=list[(list.indexOf(this.selected(fusion))+1)%list.length];}
 has(id){return this.run.inventory.includes(id);}
 active(){return fusions.filter(([,a,b])=>this.has(a)&&this.has(b));}
 collect(id){if(!relics[id]||this.has(id))return false;this.run.inventory.push(id);return true;}
 stats(){return {...PLAYER,hp:PLAYER.hp+(this.has(7)?1:0),speed:PLAYER.speed*(this.has(8)?1.08:1)};}
 offers(){return relics.filter(r=>!this.has(r.id)).map(r=>[Math.random(),r.id]).sort((a,b)=>a[0]-b[0]).slice(0,3).map(p=>p[1]);}
}
export function icons(scene){for(const r of relics){const k='relic'+r.id;if(scene.textures.exists(k))continue;const t=scene.textures.createCanvas(k,16,16),c=t.context;c.fillStyle='#16212f';c.fillRect(0,0,16,16);r.icon.split('/').forEach((line,y)=>[...line].forEach((v,x)=>{if(v==='1'){c.fillStyle='#'+r.color.toString(16);c.fillRect(1+x*2,2+y*2,2,2);if((x+y)%3===0){c.fillStyle='#f2ebdc';c.fillRect(1+x*2,2+y*2,1,1);}}}));t.refresh();}}

