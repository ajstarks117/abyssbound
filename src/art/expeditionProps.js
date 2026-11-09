// Evidence left beside each floor's entry document. These props have no collision bodies.
export function expeditionProp(scene){
 if(scene.room.type!=='start')return;
 const g=scene.add.graphics().setDepth(484),x=300,y=499;
 const bar=(dx,dy,w,h,color)=>g.fillStyle(color).fillRect(x+dx,y+dy,w,h);
 switch(scene.run.floor){
 case 1: // Five empty lamp hooks and one spare wick.
  bar(-20,-21,43,3,0x856949);for(let i=0;i<5;i++)bar(-18+i*8,-20,2,6,0xb6a17e);
  bar(17,-17,3,14,0xd4c493);break;
 case 2: // Varric's coat caught in the furnace grate.
  bar(-18,-19,37,21,0x181a20);for(let i=0;i<6;i++)bar(-15+i*6,-18,2,18,0x7a7262);
  g.fillStyle(0x984c49).fillTriangle(x-11,y-16,x+11,y-9,x+3,y+8);bar(-8,-14,4,2,0xe2b268);break;
 case 3: // Maera's field satchel beside two cracked sample vessels.
  bar(-16,-9,19,13,0x735242);bar(-12,-12,11,3,0xc6ad88);bar(-9,-5,5,2,0xe6dbc0);
  for(const i of [7,16]){bar(i,-13,5,14,0x799192);bar(i+1,-5,3,6,0xa6ce72);}break;
 case 4: // Elian's sluice wheel with a tally nailed to its spindle.
  g.lineStyle(3,0x8f7962).strokeCircle(x,y-8,13);
  for(let i=0;i<6;i++)g.lineBetween(x,y-8,x+12*Math.cos(i*Math.PI/3),y-8+12*Math.sin(i*Math.PI/3));
  bar(-4,-12,7,9,0xbcb18a);break;
 case 5: // Aldren's empty scabbard bears the same cyan inset as the Focus.
  bar(-16,-4,29,5,0x5b454d);bar(8,-5,5,7,0xb69a63);bar(-12,-3,4,2,0x7ad4d5);break;
 case 6: // Thorne's cylinder and a strip of punched recording foil.
  bar(-16,-11,20,14,0x96774a);bar(-14,-10,15,3,0xe0c591);bar(5,-5,13,4,0xcbbb96);
  for(let i=0;i<4;i++)bar(5+i*3,-4,1,1,0x423b46);break;
 }
}
