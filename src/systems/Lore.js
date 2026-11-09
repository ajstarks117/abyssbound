import {expeditionProp} from '../art/expeditionProps.js';
import {openDialog} from '../ui/MenuDialog.js';
import {expedition} from '../data/expedition.js';
export function installLore(s){
 s.lore=null;s.run.lore??=[];if(!['start','healing'].includes(s.room.type))return;
 expeditionProp(s);const id=(s.run.floor-1)*2+Number(s.room.type==='healing');
 s.lore={id,x:255,y:490};s.add.image(255,490,'statue').setScale(1.8).setDepth(490);
 const paper=s.add.graphics().setDepth(492);paper.fillStyle(0x503a38).fillRect(242,482,28,15);paper.fillStyle(0xd8c69a).fillRect(243,480,24,13);
 for(let i=0;i<3;i++)paper.fillStyle(0x786553).fillRect(246,483+i*3,15-i*2,1);
 paper.fillStyle([0xaf514b,0xc7914c,0x8caa64,0x53899d,0x8577ad,0xba5269][s.run.floor-1]).fillRect(261,488,5,5);
 s.add.text(255,522,'E · '+expedition[id][0],{fontSize:'13px',color:'#d6bd87'}).setOrigin(.5);
}
export function readLore(s){const l=s.lore;if(!l||s.dialog||s.paused||s.ended||s.selecting||s.transitioning||Math.hypot(s.player.x-l.x,s.player.y-l.y)>65)return false;
 if(!s.run.lore.includes(l.id))s.run.lore.push(l.id);s.physics.pause();s.reading=true;s.input.setDefaultCursor('default');
 const ids=[...s.run.lore].sort((a,b)=>a-b);let page=ids.indexOf(l.id);
 openDialog(s,expedition[l.id][0],'',()=>{s.reading=false;s.physics.resume();s.input.setDefaultCursor('default');});
 const dialog=s.dialog,body=dialog.querySelector('p'),heading=dialog.querySelector('h2');
 const render=()=>{const [title,author,date,note]=expedition[ids[page]];heading.textContent=title;body.textContent=author+' · '+date+'\n\n'+note;body.style.whiteSpace='pre-line';};
 for(const [label,step] of [['Previous',-1],['Next',1]]){const b=document.createElement('button');b.textContent=label;b.disabled=ids.length===1;b.onclick=()=>{page=(page+step+ids.length)%ids.length;render();};dialog.insertBefore(b,dialog.lastChild);}
 render();return true;}

