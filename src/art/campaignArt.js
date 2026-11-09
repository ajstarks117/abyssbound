import {chronicleSizes,paintChronicle} from './chronicleCreatures.js';
// Each pose is painted on its own transparent logical canvas.
export function campaignArt(scene){
 const sizes={...chronicleSizes,sentinel:48,leech:24,watcher:40,warden:96,heart:128};
 for(const [kind,size] of Object.entries(sizes)){
  for(let frame=0;frame<4;frame++){
   const t=scene.textures.createCanvas(kind+'-'+frame,size,size),c=t.context;
   const rect=(color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
   const poly=(color,...points)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
   c.translate(size/2,size/2);const bob=frame%2;
   if(kind in chronicleSizes)paintChronicle(kind,frame,size,c,rect,poly);
   else if(kind==='warden'||kind==='sentinel'){
    c.scale(size/48,size/48);c.translate(0,bob);
    for(const side of [-1,1]){rect('#141925',side*8-3,12,7,9-bob);rect('#665349',side*8-2,14,5,5);}
    poly('#222937',[-15,-10],[13,-11],[14,7],[7,16],[-8,16],[-15,5]);
    rect('#4f5868',-12,-10,22,17);rect('#c79551',-13,-9,3,15);rect('#d7ac60',-15,-12,11,5);rect('#c08a42',6,-13,10,6);
    rect(kind==='warden'?'#bcb294':'#838a94',-7,-19,15,12);rect('#171925',-6,-15,12,4);rect('#ff5367',-5,-14,3,2);rect('#ff5367',2,-14,3,2);
    poly('#902d4c',[0,-6],[5,0],[0,6],[-5,0]);rect('#ff8776',-1,-3,3,5);
    if(kind==='warden'){poly('#171925',[-11,-8],[-6,-5],[-9,-3],[-5,2],[-11,-3],[-8,-5]);rect('#dcb470',6,2,3,1);c.translate(13,4);c.rotate((frame-1)*.14);rect('#986c4d',0,-11,3,24);poly('#707580',[-5,-17],[2,-22],[8,-16],[7,-8],[-5,-7]);rect('#312c38',0,-18,2,8);rect('#ffc96b',-2,-16,5,1);rect('#ff9f52',0,-15,1,4);}
   }else if(kind==='leech'){for(let i=-1;i<2;i++){rect('#cd5060',-10,i*4+bob,6,2);rect('#ab374d',4,i*4-bob,6,2);}poly('#6b263e',[0,-10],[6,-4],[4,7],[0,10],[-5,4],[-5,-5]);rect('#dc5e67',-2,-7,3,12);rect('#ffd3a0',1,-6,2,2);}
   else{
    const heart=kind==='heart',r=heart?27:9;c.translate(0,bob*2);c.scale(1+bob*.04,1+bob*.04);
    for(let i=0;i<8;i++){const a=i*Math.PI/4+frame*.13,x=Math.round(Math.cos(a)*r*1.7),y=Math.round(Math.sin(a)*r*1.1);poly('#9165bf',[x,y-5],[x+3,y],[x,y+6],[x-3,y]);}
    c.strokeStyle='#8355ac';c.lineWidth=heart?3:1;c.beginPath();c.ellipse(0,0,r*1.5,r*.8,frame*.14,0,7);c.stroke();
    poly(heart?'#88334e':'#433552',[-r,-r/2],[-r/2,-r],[0,-r*.65],[r/2,-r],[r,-r/3],[r*.7,r*.45],[0,r*1.2],[-r*.7,r*.5]);
    rect(heart?'#e25570':'#a684d6',-r*.6,-r*.5,r*.6,r*.5);rect('#f3c8d8',0,-2,heart?8:4,4);
   }t.refresh();
  }
  scene.anims.create({key:kind+'-walk',frames:[0,1,2,3].map(i=>({key:kind+'-'+i})),frameRate:7,repeat:-1});
 }
}
