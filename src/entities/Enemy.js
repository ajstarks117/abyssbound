import Phaser from 'phaser';
import {direction} from '../config/game.js';
import {ENEMIES} from '../data/enemies.js';
import {waypoint} from '../systems/Pursuit.js';
import {EnemyAI} from '../systems/EnemyAI.js';
export class Enemy extends Phaser.Physics.Arcade.Sprite{
 constructor(s,x,y,kind='crawler',stats=ENEMIES[kind]){super(s,x,y,kind+'-0');s.add.existing(this);s.physics.add.existing(this);this.kind=kind;this.stats={...stats};this.setScale(2);this.body.setSize(20,17).setOffset(6,10);this.setCollideWorldBounds(true);this.hp=this.stats.hp;this.ai=new EnemyAI(this.stats,kind);this.shadow=s.add.image(x,y+20,'shadow').setScale(1.7).setAlpha(.65);this.warning=s.add.circle(x,y+15,kind==='wisp'||kind==='ink'?115:kind==='spore'?100:38).setStrokeStyle(2,this.stats.color).setAlpha(0);this.health=s.add.graphics();this.flashUntil=0;this.knockbackUntil=0;this.knockback={x:0,y:0};this.play(kind+'-walk');}
 update(time,player){if(!this.active)return;player=player?.active?player:this.scene.player;
 if(!player?.active||player.dead){this.setVelocity(0);return;}
 if(!this.routeAt||time>=this.routeAt){this.route=waypoint(this,player,this.scene.room.pillars);this.routeAt=time+180;}
 let v=this.ai.update(this,player,time,this.route!==player);
 if(this.ai.state==='chase'&&this.route!==player)v=direction(this.route.x-this.x,this.route.y-this.y,this.stats.speed);
 if(this.ai.state==='chase'&&(v.x||v.y)){
  if(!this.probe||time>=this.probe.at){
   if(this.probe&&Math.hypot(this.x-this.probe.x,this.y-this.probe.y)<5){this.escapeUntil=time+350;this.side=-(this.side||1);this.routeAt=0;}
   this.probe={x:this.x,y:this.y,at:time+600};
  }
  if(time<this.escapeUntil)v={x:-v.y*this.side,y:v.x*this.side};
 }else this.probe=null;
 if(this.kind==='ink'){
  if(this.ai.state==='telegraph'&&this.blinkUntil!==this.ai.until){this.blinkUntil=this.ai.until;this.teleport(player,time);}
  this.setAlpha(this.ai.state==='telegraph'&&this.ai.until-time>420?.12:1);
 }
 if(v.action==='explode'){this.scene.combat.burst(this,100);this.hit(this.hp,time);return;}
 if(v.action==='inkshot'){this.scene.combat.enemyFire(this,player,time);this.scene.combat.inkPool(player.x,player.y,time);}
 if(v.action==='spread'){const a=Math.atan2(player.y-this.y,player.x-this.x);for(const offset of [-.25,0,.25])this.scene.combat.enemyFire(this,{x:this.x+100*Math.cos(a+offset),y:this.y+100*Math.sin(a+offset)},time);}
 if(v.action==='shoot')this.scene.combat.enemyFire(this,player,time);
 if(v.action==='burst')this.scene.combat.burst(this,115);
 if(v.teleport)this.teleport(player,time);

 if(time<this.knockbackUntil)v=this.knockback;
 this.setAngle(this.ai.state==="telegraph"?Math.sin(time/55)*4:0);this.setVelocity(v.x,v.y);this.setFlipX(player.x<this.x);this.setDepth(this.y+20);this.shadow.setPosition(this.x,this.y+22);this.warning.setPosition(this.x,this.y+14).setAlpha(this.ai.state==='telegraph'?.45+Math.sin(time/50)*.2:0);if(time<this.flashUntil)this.setTintFill(0xffffff);else if(this.ai.state==='telegraph')this.setTint(this.stats.color);else this.clearTint();
 this.health.clear();if(this.hp<this.stats.hp)this.health.fillStyle(0x10121c).fillRect(this.x-22,this.y-37,44,5).fillStyle(this.stats.color).fillRect(this.x-21,this.y-36,42*this.hp/this.stats.hp,3);this.health.setDepth(800);}
 teleport(player,time){const s=this.scene,radius=this.kind==="ink"?80:190;for(let i=0;i<8;i++){const a=time/1000+i*Math.PI/4,x=player.x+Math.cos(a)*radius,y=player.y+Math.sin(a)*radius;if(x<155||x>1120||y<225||y>565||s.room.pillars.some(p=>Math.abs(x-p.x)<85&&Math.abs(y-p.y-18)<85)||s.enemies.getChildren().some(e=>e!==this&&e.active&&Math.hypot(e.x-x,e.y-y)<70))continue;s.combat.deathSparks.explode(12,this.x,this.y);this.body.reset(x,y);s.combat.deathSparks.explode(12,x,y);return true;}return false;}
 hit(damage,time,source){if(!this.active||this.ai.state==='dead')return false;if(this.kind==='host'&&time>=(this.puffAt||0)){this.puffAt=time+1200;for(let i=0;i<4;i++){const a=Math.PI*(i+.5)/2;this.scene.combat.enemyFire(this,{x:this.x+80*Math.cos(a),y:this.y+80*Math.sin(a)},time);}}
 this.hp=Math.max(0,this.hp-damage);this.flashUntil=time+90;if(source){this.knockback=direction(this.x-source.x,this.y-source.y,160);this.knockbackUntil=time+110;}if(this.hp<=0){this.ai.state='dead';this.shadow.destroy();this.warning.destroy();this.health.destroy();this.disableBody(true,true);this.scene.events.emit('enemy-killed',this);return true;}return false;}
}
