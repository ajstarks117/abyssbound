export function atmosphere(scene){
 const floor=scene.run.floor,g=scene.add.graphics().setDepth(2),color=[0x50d9e8,0xf69a52,0xa4cd6c,0x66bbd2,0xb37af2,0xf07a8a][floor-1];
 const textureName='torch-halo';
 if(!scene.textures.exists(textureName)){
  const texture=scene.textures.createCanvas(textureName,128,128),ctx=texture.context;
  const light=ctx.createRadialGradient(64,64,2,64,64,64);light.addColorStop(0,'rgba(255,182,92,.5)');light.addColorStop(.35,'rgba(255,133,54,.2)');light.addColorStop(1,'rgba(255,92,24,0)');ctx.fillStyle=light;ctx.fillRect(0,0,128,128);texture.refresh();
 }
 for(const torch of scene.room.torches){const halo=scene.add.image(torch.x,torch.y,'torch-halo').setDepth(3).setScale(1.35);scene.tweens.add({targets:halo,alpha:.68,scale:1.5,duration:760+torch.x/3,yoyo:true,repeat:-1});}
 for(let i=0;i<10;i++){
 const x=154+(i*173+scene.room.variant*19)%960,y=i%2?575:212;
 if(floor===1){g.lineStyle(1,color,.35).lineBetween(x,y,x+5,y-6).lineBetween(x+5,y-6,x+10,y).lineBetween(x+5,y-6,x+5,y+5);}
 if(floor===2){g.lineStyle(2,0x191923,.9).lineBetween(x,y,x+11,y+6).lineBetween(x+11,y+6,x+19,y+3);g.lineStyle(1,color,.4).lineBetween(x+3,y+2,x+11,y+7);}
 if(floor===3){g.fillStyle(0x283a34,.9).fillRect(x-6,y-13,13,17);g.fillStyle(color,.65).fillRect(x-4,y-6,9,8).fillCircle(x-2,y-10,2);}
 if(floor===4){g.lineStyle(2,color,.4).strokeEllipse(x,y,49,9);g.fillStyle(0x706654).fillRect(x-8,y-5,16,7).fillRect(x-6,y-9,12,3);}
 if(floor===6){g.lineStyle(3,color,.42).lineBetween(x-15,y,x+2,y-6).lineBetween(x+2,y-6,x+10,y+3).lineBetween(x+2,y-6,x+5,y-14);}
 if(floor===5){g.fillStyle(0x553c77).fillTriangle(x-5,y+3,x+1,y-16,x+6,y);g.fillStyle(color,.65).fillTriangle(x+1,y-16,x+3,y,x+6,y);}
 }
 scene.add.particles(0,0,'spark',{x:{min:130,max:1150},y:{min:195,max:610},speedY:{min:-21,max:-5},speedX:{min:-4,max:4},frequency:240,lifespan:2200,maxParticles:12,tint:color,scale:{start:.55,end:0},alpha:{start:.55,end:0}}).setDepth(3);
}
export function playerDissolve(player,onComplete){const s=player.scene,echo=s.add.image(player.x,player.y,player.texture.key).setScale(2).setTint(0x80eaf0).setDepth(1900);s.tweens.add({targets:echo,y:echo.y-14,scaleX:.3,alpha:0,duration:230,onComplete});s.combat.sparks.explode(18,player.x,player.y);return echo;}

