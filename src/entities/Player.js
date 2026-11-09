
import Phaser from 'phaser';
import {PLAYER,direction,facing} from '../config/game.js';
export class Player extends Phaser.Physics.Arcade.Sprite{
 constructor(scene,x,y){super(scene,x,y,'kael-south-idle-0');scene.add.existing(this);scene.physics.add.existing(this);this.setScale(2);this.aura=scene.add.ellipse(x,y,50,54,0x50d9e8,.085).setVisible(false);this.body.setSize(14,13).setOffset(9,17);this.setCollideWorldBounds(true);this.stats={...PLAYER};this.aim={x:0,y:1};this.hp=this.stats.hp;this.invulnerableUntil=0;this.castUntil=0;this.face='south';this.shadow=scene.add.image(x,y+22,'shadow').setScale(1.6).setAlpha(.65);this.keys=scene.input.keyboard.addKeys('W,A,S,D,SPACE');this.lastMove={x:0,y:1};this.dodgeUntil=0;this.nextDodge=0;this.knockbackUntil=0;this.knockback={x:0,y:0};this.nextGhost=0;
 this.ghosts=Array.from({length:8},()=>scene.add.image(0,0,this.texture.key).setScale(2).setTint(0x50d9e8).setVisible(false));this.ghostIndex=0;
 }
 get dead(){return this.scene.terminal==="dead";}
 dodge(time,input=this.lastMove){if(time<this.nextDodge||this.hp<=0)return false;if(this.poisonAt){this.poisonAt=0;this.scene.objective.setText('Spores shed.');}this.dodgeVector=direction(input.x,input.y,this.stats.dodgeSpeed);this.dodgeUntil=time+this.stats.dodgeDuration;this.nextDodge=time+this.stats.dodgeCooldown;this.invulnerableUntil=Math.max(this.invulnerableUntil,this.dodgeUntil);this.knockbackUntil=0;this.scene.audio.play('dodge');return true;}
 update(time){if(this.dead)return;const k=this.keys;let v=direction(Number(k.D.isDown)-Number(k.A.isDown),Number(k.S.isDown)-Number(k.W.isDown),this.stats.speed*(time<this.inkUntil?.65:1));if(v.x||v.y)this.lastMove=direction(v.x,v.y);
 if(Phaser.Input.Keyboard.JustDown(k.SPACE))this.dodge(time);
 const dodging=time<this.dodgeUntil;
 if(dodging){v=this.dodgeVector;if(time>=this.nextGhost){this.nextGhost=time+30;const ghost=this.ghosts[this.ghostIndex++%this.ghosts.length];this.scene.tweens.killTweensOf(ghost);ghost.setTexture(this.texture.key).setPosition(this.x,this.y).setDepth(this.depth-1).setAlpha(.45).setVisible(true);this.scene.tweens.add({targets:ghost,alpha:0,duration:230,onComplete:()=>ghost.setVisible(false)});}}
 else if(time<this.knockbackUntil)v=this.knockback;
 this.setVelocity(v.x,v.y);if(this.scene.shotsHeld.length||this.castUntil>time)this.face=facing(this.aim.x,this.aim.y);else if(v.x||v.y)this.face=facing(v.x,v.y);const state=this.castUntil>time?'cast':v.x||v.y?'walk':'idle';this.play('kael-'+this.face+'-'+state,true);this.setAlpha(time<this.invulnerableUntil?(dodging?.65:Math.floor(time/70)%2?.35:1):1);if(time<this.knockbackUntil)this.setTintFill(0xffffff);else this.clearTint();this.aura.setPosition(this.x,this.y).setDepth(this.y+21).setVisible(!this.dead&&time<this.castUntil);this.setDepth(this.y+22);this.shadow.setAlpha(.42);this.shadow.setPosition(this.x,this.y+24);this.setAngle(dodging?this.lastMove.x*13:0);if(!dodging&&time<this.castUntil&&time>=this.knockbackUntil)this.setTint(0xc6ffff);}
 damage(amount,time,source){if(this.scene.ended||time<this.invulnerableUntil||this.hp<=0)return false;this.hp=Math.max(0,this.hp-amount);this.invulnerableUntil=time+this.stats.invulnerability;if(source){this.knockback=direction(this.x-source.x,this.y-source.y,210);this.knockbackUntil=time+130;}if(!this.hp)this.scene.finish(false);this.scene.events.emit('player-health',this.hp);return true;}
}
