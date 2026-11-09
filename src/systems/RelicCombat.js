import {direction} from '../config/game.js';
const cooldowns={0:18,1:18,2:20,3:22,Thunderfire:25,'Frozen Barrage':20,'Gravity Well':28,'Crimson Echo':24,'Inferno Lance':22};
export class RelicCombat{
 constructor(combat){this.c=combat;this.s=combat.scene;this.zones=[];this.echo=null;this.random=Math.random;}
 fx(x,y,color,n=5){this.c.deathSparks.setParticleTint(color);this.c.deathSparks.explode(n,x,y);}
 bolt(aim,cast,offset=0){
  const s=this.s,p=s.player,b=this.c.group.get();if(!s.playable||!b)return;
  b.enableBody(true,p.x+aim.x*21-aim.y*offset,p.y+aim.y*21+aim.x*offset,true,true);
  b.setDepth(600).setScale(.8).setTint(cast.tint??0xd7fcff);b.body.setCircle(6,2,2);
  b.setVelocity(aim.x*p.stats.projectileSpeed,aim.y*p.stats.projectileSpeed);
  b.setBounce(cast.bounce?1:0);b.remaining=Number(!!cast.bounce);b.pierce=cast.pierce||0;b.victims=new Set();
  b.cast=cast;b.power=cast.power;b.expires=s.clock+1200;b.trailAt=0;b.fireAt=s.clock;this.c.shots++;
 }
 volley(time,aim){
  const s=this.s,r=s.relics,a=r.state,p=s.player;
  if(!s.playable||Math.abs(aim.x)+Math.abs(aim.y)!==1)return;
  const type=s.run.elapsed<a.until?a.enchant:null;
  const cast={basic:true,aim:{...aim},type,power:p.stats.damage*(r.has(9)&&p.hp<p.stats.hp*.4?1.15:1),tint:type===0?0xff915a:type===1?0x99edff:0xe0ffff};
  const success={counted:false};a.casts++;
  for(const offset of r.has(4)&&a.casts%5===0?[-8,8]:[0]){
   a.bolts++;this.bolt(aim,{...cast,success,pierce:Number(r.has(5)&&a.bolts%4===0),bounce:r.has(10)&&a.bolts%6===0},offset);
  }
  p.castUntil=time+220;s.audio.play('cast');
 }
 activate(fusion){
  const s=this.s,r=s.relics,a=r.state,id=r.selected(fusion),now=s.run.elapsed;
  const lock=fusion?'fusionLock':'activeLock';
  if(!s.playable||id===undefined||now<(a.ready[id]||0)||now<(a[lock]||0))return false;
  a.ready[id]=now+1000*cooldowns[id];a[lock]=now+ (fusion?2200:id<2?5000:id===3?2000:500);
  const aim=s.player.aim,cast={type:id,power:10,budget:new Map(),tint:0xffb767};
  if(id===0||id===1){a.enchant=id;a.until=now+5000;}
  else if(id===3||id==='Gravity Well'){
   const p=s.player;this.zone(Math.max(140,Math.min(1140,p.x+aim.x*105)),Math.max(205,Math.min(590,p.y+aim.y*105)),id==='Gravity Well'?105:80,2000,cast);
  }else{
   let offsets=[0];
   if(id===2){cast.tint=0x8ce6ff;}
   if(id==='Frozen Barrage'){offsets=[-16,0,16];cast.power=5;cast.tint=0x80dfff;}
   if(id==='Crimson Echo'){offsets=[-12,0,12];cast.power=s.player.hp<s.player.stats.hp*.4?7:6;cast.tint=0xff526b;}
   if(id==='Inferno Lance'){cast.pierce=3;cast.tint=0xff733b;}
   for(const offset of offsets)this.bolt(aim,cast,offset);
  }
  s.audio.play(fusion?'fusion':'relic');return true;
 }
 damage(enemy,amount,cast,source){
  if(!enemy.active||!this.s.playable)return;
  if(enemy.boss&&cast.budget){const used=cast.budget.get(enemy)||0;amount=Math.min(amount,14-used);if(amount<=0)return;cast.budget.set(enemy,used+amount);}
  enemy.hit(amount,this.s.clock,source);
 }
 wall(b){if(!b.active)return;if(b.remaining-->0){this.fx(b.x,b.y,0xffca63);return;}this.c.impact(b);}
 zone(x,y,r,ms,cast){if(this.zones.length>=20)return;const g=this.s.add.circle(x,y,r,cast.type==='Inferno Lance'?0xf77947:0xad68f0,.24);this.zones.push({g,r,cast,end:this.s.clock+ms,next:0});}
 burn(e,cast){if(e.active)e.burning={cast,left:2,next:this.s.clock+350};}
 hit(b,e){
  const s=this.s;if(!s.playable||!b.active||!e.active||b.victims.has(e))return;
  b.victims.add(e);this.c.hits++;const cast=b.cast,type=cast.type;
  this.damage(e,b.power,cast,{x:b.x-b.body.velocity.x,y:b.y-b.body.velocity.y});this.fx(e.x,e.y,cast.tint);s.audio.play('hit');s.audio.shake(60,.0006);
  if(cast.basic&&!cast.success.counted){cast.success.counted=true;if(s.relics.has(6)&&++s.relics.state.hits%5===0&&this.random()<.3)this.echo={at:s.clock+140,aim:cast.aim,power:b.power};}
  if(type===0||type==='Thunderfire')this.burn(e,cast);
  if(type===1||type==='Frozen Barrage')e.slow=s.clock+1000;
  if(type===2||type==='Thunderfire'){
   let origin=e;const visited=new Set([e]);
   for(let i=0;i<(type===2?2:3);i++){const next=s.enemies.getChildren().find(t=>t.active&&!visited.has(t)&&Math.hypot(t.x-origin.x,t.y-origin.y)<155&&this.c.hasLineOfSight(origin,t));if(!next)break;
    const arc=s.add.graphics().setDepth(640).lineStyle(2,cast.tint).lineBetween(origin.x,origin.y,next.x,next.y);s.time.delayedCall(100,()=>arc.destroy());
    this.damage(next,4,cast);if(type==='Thunderfire')this.burn(next,cast);visited.add(next);origin=next;}
  }
  if(b.pierce--<=0)this.c.impact(b);
 }
 cancel(){this.echo=null;for(const z of this.zones)z.g.destroy();this.zones=[];this.s.relics.state.until=0;}
 update(t){
  const s=this.s;if(!s.playable)return;
  if(this.echo&&t>=this.echo.at){this.bolt(this.echo.aim,{power:this.echo.power,tint:0xc392ff});this.echo=null;}
  for(const e of s.enemies.getChildren()){if(!e.active)continue;const burn=e.burning;
   if(burn&&t>=burn.next){burn.next=t+350;if(--burn.left===0)e.burning=null;this.damage(e,2,burn.cast);}
   if(e.active&&e.slow>t)e.body.velocity.scale(.65);
  }
  this.zones=this.zones.filter(z=>{if(t>=z.end){z.g.destroy();return false;}
   for(const e of s.enemies.getChildren()){if(!e.active||Math.hypot(e.x-z.g.x,e.y-z.g.y)>z.r)continue;
    if(z.cast.type!=='Inferno Lance'&&!e.boss){const v=direction(z.g.x-e.x,z.g.y-e.y,80);e.setVelocity(v.x,v.y);}
    if(t>=z.next&&z.cast.type!==3)this.damage(e,2,z.cast);
   }
   if(t>=z.next)z.next=t+440;return true;
  });
  this.c.group.children.iterate(b=>{if(b.active&&b.cast.type==='Inferno Lance'&&t>=b.fireAt){b.fireAt=t+120;this.zone(b.x,b.y,18,420,b.cast);}});
 }
}
