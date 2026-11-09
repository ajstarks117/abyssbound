import {Enemy} from './Enemy.js';
import {direction} from '../config/game.js';
export const bossStats={warden:{name:'The Bone Warden',hp:185,color:0xc84959},heart:{name:'The Abyssal Heart',hp:260,color:0xaf6ce4}};
Object.assign(bossStats,{
 architect:{name:'The Plague Architect',hp:160,color:0xa6d572},
 archivist:{name:'The Archivist',hp:175,color:0x65cfdb},
 commander:{name:'Aldren · Fallen Commander',hp:205,color:0xe2ac62}
});
const patterns={
 architect:[['Spore fan','Culture bed','Summon'],['Culture bed','Spore fan','Summon','Spore fan']],
 archivist:[['Index wheel','Rune trap','Blink'],['Rune trap','Blink','Index wheel','Rune trap']],
 commander:[['Sword measure','Charge','Counter guard'],['Sword measure','Counter guard','Summon','Charge']],
 warden:[['Slam','Charge','Summon'],['Twin slam','Charge','Bone barrage','Summon']],heart:[['Pulse','Trident','Mines'],['Spiral','Blink','Summon','Rift','Pulse','Trident'],['Abyssal Collapse','Returning orbit','Rift','Blink','Trident','Nova']]};
export class Boss extends Enemy{
 constructor(scene,x,y,kind){super(scene,x,y,kind,bossStats[kind]);this.boss=true;this.phase=1;this.step=0;this.hazards=[];this.setScale(kind==="warden"?1.48:1.35);this.body.setSize(48,48,true);this.ai.state='idle';this.until=1300;this.caption=scene.add.text(640,95,this.stats.name,{fontFamily:'Georgia',fontSize:'20px',color:'#efd6ae',backgroundColor:'#10121c'}).setOrigin(.5,0).setDepth(1002);this.meter=scene.add.graphics().setDepth(1002);this.mark=scene.add.graphics().setDepth(500);}
 hit(amount,time,source){if(this.move==='Counter guard'&&this.ai.state==='telegraph'){this.counterArmed=true;amount*=.35;}
 return super.hit(amount*(this.exposed?1.65:.85),time,source);}
 get exposed(){return this.ai.state==='recover'&&['Spore fan','Index wheel','Sword measure','Counter guard','Slam','Twin slam','Charge','Returning orbit','Spiral','Pulse','Abyssal Collapse'].includes(this.move);}
 safeAt(x){return Math.floor((x-112)/132)%2===this.safeParity;}
 update(t,p){
  const s=this.scene;if(!this.active||s.ended)return;
  const heart=this.kind==='heart',ratio=this.hp/this.stats.hp;
  const phase=heart?(ratio<.30?3:ratio<.65?2:1):(ratio<.60?2:1);
  if(phase>this.phase){s.combat.deathSparks.setParticleTint(this.stats.color);s.combat.deathSparks.explode(26,this.x,this.y);this.phase=phase;this.step=0;this.ai.state='phaseTransition';this.until=t+850;s.audio.play('rift');}
  this.mark.clear();this.setVelocity(0);this.setDepth(this.y+25);this.shadow.setPosition(this.x,this.y+32);
  this.meter.clear().fillStyle(0x1a1424).fillRect(485,120,310,7).fillStyle(this.stats.color).fillRect(486,121,308*ratio,5);
  if(heart){this.mark.lineStyle(2,0xa478e2,.8).strokeEllipse(this.x,this.y,110,24+18*Math.sin(t/320));this.setScale(1.24+.035*Math.sin(t/170));}
  if(this.exposed){this.mark.lineStyle(3,0xffe0a1).strokeCircle(this.x,this.y,23+4*Math.sin(t/70));this.caption.setText(this.stats.name+'   ·   Core exposed');}
  if(heart&&!this.exposed)this.mark.lineStyle(2,0xe56c90,.65).strokeEllipse(this.x,this.y,36+15*Math.cos(t/240),99);
  if(this.kind==="warden"){for(const side of [-1,1])this.mark.fillStyle(0xc9b698).fillTriangle(this.x+side*49,this.y-32+Math.sin(t/180)*4,this.x+side*44,this.y-19,this.x+side*53,this.y-23);}
  if(this.phase>1)this.mark.lineStyle(3,this.stats.color,.6).strokeEllipse(this.x,this.y+15,105,76);
  this.setTint(t<this.flashUntil?0xffd5d5:0xffffff);this.tickHazards(t,p);
  if(this.ai.state==='telegraph'){this.mark.lineStyle(3,this.stats.color,.85);if(this.move==='Charge')this.mark.lineBetween(this.x,this.y,this.x+this.aim.x*360,this.y+this.aim.y*360);else this.mark.strokeCircle(this.x,this.y,58+Math.sin(t/85)*5);}
  if(this.ai.state==='attack'&&this.move==='Charge')this.setVelocity(this.aim.x*(this.phase===2?570:470),this.aim.y*(this.phase===2?570:470));
  if(this.ai.state==='recover'&&!heart){const v=direction(p.x-this.x,p.y-this.y,this.phase===1?55:95);this.setVelocity(v.x,v.y);}
  if(this.move==='Abyssal Collapse'&&this.ai.state==='telegraph'){for(let i=0;i<8;i++){const x=112+i*132,safe=this.safeAt(x+64);this.mark.fillStyle(safe?0x50d9c7:0xe94669,safe?.10:.30).fillRect(x,184,132,432);this.mark.lineStyle(2,safe?0x50d9c7:0xe94669,.85).strokeRect(x+1,185,130,430);}this.caption.setText('Abyssal Collapse · seek cyan · '+Math.max(0,(this.until-t)/1000).toFixed(1));}
  if(t<this.until)return;
  switch(this.ai.state){
  case 'idle':case 'recover':case 'phaseTransition':this.ai.state='selectAttack';break;
  case 'selectAttack':{const cycle=patterns[this.kind][this.phase-1];this.move=cycle[this.step++%cycle.length];this.counterArmed=false;this.aim=direction(p.x-this.x,p.y-this.y);this.ai.state='telegraph';this.until=t+(this.move==='Abyssal Collapse'?2500:heart?720:850);if(this.move==='Abyssal Collapse'){this.safeParity=this.step%2;s.combat.clearHostiles();for(const h of this.hazards)h.g?.destroy();this.hazards=[];}this.caption.setText(this.stats.name+'   ·   '+this.move);break;}
  case 'telegraph':this.ai.state='attack';this.until=t+(this.move==='Charge'?(this.phase===1?480:740):250);this.attack(t,p);break;
  case 'attack':this.ai.state='recover';this.until=t+(this.exposed?1250:this.phase===1?1050:750);this.caption.setText(this.stats.name);break;
  }
 }
 attack(t,p){const s=this.scene;if(!this.active||s.ended||p.dead)return;const fire=(a)=>s.combat.enemyFire(this,{x:this.x+Math.cos(a)*100,y:this.y+Math.sin(a)*100},t);const fan=(n,start,width)=>{for(let i=0;i<n;i++)fire(start+i*width/n);};
 s.audio.play(({architect:'culture',archivist:'folio',commander:'steel',heart:'rift'})[this.kind]||'slam');this.setAngle(this.kind==='heart'?6:-9);s.tweens.add({targets:this,angle:0,duration:220});
 switch(this.move){
 case 'Spore fan':fan(this.phase===1?5:7,Math.atan2(this.aim.y,this.aim.x)-.7,1.65);break;
 case 'Culture bed':case 'Rune trap':for(let i=0;i<(this.phase===1?2:3);i++)this.hazard(Math.max(160,Math.min(1110,p.x+(i===1?95:i===2?-95:0))),p.y,t+i*240,this.move);break;
 case 'Index wheel':for(let i=0;i<this.phase+1;i++)this.hazards.push({type:'volley',start:t+i*330,angle:this.step*.36+i*.21});break;
 case 'Sword measure':for(let i=0;i<this.phase+1;i++)this.hazard(this.x+this.aim.x*(50+i*45),this.y+this.aim.y*(50+i*45),t+i*210,'Slash');break;
 case 'Counter guard':if(this.counterArmed){this.hazard(p.x,p.y,t,'Riposte');}break;
 case 'Slam':case 'Twin slam':s.audio.shake(160,.002);this.hazard(this.x,this.y,t,'wave');if(this.phase===2)this.hazard(this.x,this.y,t+500,'wave');break;
 case 'Summon':if(t>=(this.summonAt||0))for(const side of [-1,1]){if(s.enemies.countActive(true)>=4)break;this.summonAt=t+5000;const e=new Enemy(s,640+side*200,350,({architect:'spore',commander:'sentinel',heart:'wisp'})[this.kind]||'crawler');if(this.kind==='commander'){e.spectral=true;e.setAlpha(.6);e.hp=25;}s.enemies.add(e);}break;
 case 'Bone barrage':fan(5,Math.atan2(this.aim.y,this.aim.x)-.44,1.1);break;
 case 'Abyssal Collapse':s.audio.shake(200,.004);if(!this.safeAt(p.x))s.combat.hurtPlayer(this,2);break;
 case 'Returning orbit':for(let i=0;i<12;i++){const a=i*Math.PI/6,shot=s.combat.enemyFire(this,{x:this.x+Math.cos(a)*100,y:this.y+Math.sin(a)*100},t);if(shot)shot.reverseAt=t+650;}break;
 case 'Pulse':fan(10,.2,Math.PI*2);break;
 case 'Trident':fan(3,Math.atan2(this.aim.y,this.aim.x)-.24,.72);break;
 case 'Nova':case 'Spiral':for(let j=0;j<(this.move==='Nova'?4:3);j++)this.hazards.push({type:'volley',start:t+j*260,angle:j*.28+this.step*.4});break;
 case 'Blink':this.teleport(p,t);break;
 case 'Mines':case 'Rift':for(let i=-1;i<=1;i++)this.hazard(p.x+i*85,p.y+(i?35:0),t+(this.phase===3?(i+1)*350:0),this.move);break;
 }}
 hazard(x,y,start,type){const g=this.scene.add.graphics().setDepth(490);this.hazards.push({x,y,start,type,g});}
 tickHazards(t,p){const s=this.scene;this.hazards=this.hazards.filter(h=>{const age=t-h.start;if(age<0)return true;if(h.type==='volley'){for(let i=0;i<8;i++){const a=h.angle+i*Math.PI/4;s.combat.enemyFire(this,{x:this.x+100*Math.cos(a),y:this.y+100*Math.sin(a)},t);}return false;}
 if(h.type==='Mines'){h.origin??=h.x;h.x=h.origin+Math.sin(age/850)*35;}const wave=h.type==='wave',radius=wave?age*.19:({Rift:48,'Rune trap':43,'Culture bed':56,Slash:48,Riposte:68})[h.type]||27;h.g.clear().lineStyle(wave?5:2,this.stats.color,.85).strokeCircle(h.x,h.y,radius);const d=Math.hypot(p.x-h.x,p.y-h.y);if(h.type==='Rune trap')h.g.strokeRect(h.x-26,h.y-26,52,52);if(!wave&&age>900)h.g.fillStyle(this.stats.color,.35).fillCircle(h.x,h.y,radius);if(!h.hit&&(wave?Math.abs(d-radius)<10:age>900&&d<radius)){if(s.combat.hurtPlayer(h))h.hit=true;}if(age>(wave?1650:2100)){h.g.destroy();return false;}return true;});}
 retire(){this.hazards.forEach(h=>h.g?.destroy());this.hazards=[];this.mark.destroy();this.meter.destroy();this.caption.destroy();const s=this.scene,ghost=s.add.image(this.x,this.y,this.texture.key).setScale(this.scaleX).setDepth(800);s.tweens.add({targets:ghost,angle:({heart:90,architect:12,archivist:180,commander:-90})[this.kind]??-70,scale:({heart:.1,architect:1.8,archivist:.15,commander:.8})[this.kind]??1.1,alpha:0,duration:650,onComplete:()=>ghost.destroy()});}
}
