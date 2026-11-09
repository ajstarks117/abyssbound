import {direction} from '../config/game.js';
// Pure state machines emit actions, independently of physics and rendering.
export class EnemyAI{
 constructor(stats,kind='crawler'){this.stats=stats;this.kind=kind;this.state='idle';this.until=350;this.nextTeleport=2500;this.attackDirection={x:0,y:0};}
 update(enemy,player,time,obstructed=false){
 const dx=player.x-enemy.x,dy=player.y-enemy.y,distance=Math.hypot(dx,dy),out={x:0,y:0};
 if(this.state==='dead')return out;
 if(!['idle','chase','recover','attack','telegraph'].includes(this.state)||!Number.isFinite(this.until)){this.state='recover';this.until=time+200;}
 if(obstructed&&this.state==='telegraph'){this.state='recover';this.until=time+200;}
 if(this.state==='idle'&&time>=this.until)this.state='chase';
 if(this.state==='recover'&&time>=this.until)this.state='chase';
 if(this.state==='attack'&&time>=this.until){this.state='recover';this.until=time+this.stats.recovery;}
 if(this.state==='telegraph'&&time>=this.until){this.state='attack';this.until=time+this.stats.attackDuration;this.attackDirection=direction(dx,dy,this.kind==='sentinel'?395:230);out.action=({spore:'explode',scribe:'inkshot',ink:'burst'})[this.kind]??(this.kind==='watcher'?'spread':this.kind==='spitter'?'shoot':this.kind==='wisp'?'burst':null);}
 if(this.state==='chase'){
 if(!obstructed&&distance<this.stats.range){this.state='telegraph';this.until=time+this.stats.windup;}
 else if(this.kind==='wisp'){const v=direction(dx,dy,this.stats.speed);Object.assign(out,direction(v.x+Math.cos(time/230)*28,v.y+Math.sin(time/270)*28,this.stats.speed));}
 else if(this.kind==='leech')Object.assign(out,direction(dx,dy+Math.sin(time/230+enemy.x/80)*45,this.stats.speed));else Object.assign(out,direction(dx,dy,this.stats.speed));
 }
 if(this.kind==='spitter'&&this.state==='recover'&&distance<210)Object.assign(out,direction(-dx,-dy,this.stats.speed));
 if(this.kind==='wisp'&&this.state==='recover'&&time>=this.nextTeleport){out.teleport=true;this.nextTeleport=time+3200;}
 if(this.state==='attack'&&['crawler','sentinel','leech','host'].includes(this.kind))Object.assign(out,this.attackDirection);
 return out;
 }
}
export class CrawlerAI extends EnemyAI{constructor(stats){super({...stats,range:92,attackDuration:140},'crawler');}}
