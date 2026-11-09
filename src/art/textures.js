// Original pixel artwork. Each frame is painted on a transparent 32px canvas.
const P={ink:'#0b101c',navy:'#202c49',mid:'#354b6a',light:'#516e87',gold:'#d6a85c',cyan:'#50d9e8',bone:'#d4c5a2'};
function paint(scene,key,w,h,draw){const t=scene.textures.createCanvas(key,w,h);const c=t.context;c.imageSmoothingEnabled=false;draw(c);t.refresh();return t;}
function rect(c,color,x,y,w,h){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);}
function poly(c,color,points){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
export function makeTextures(scene){
 for(const face of ['south','north','east','west'])for(const state of ['idle','walk','cast']){
 const count=state==='walk'?6:4;
 for(let f=0;f<count;f++)paint(scene,`kael-${face}-${state}-${f}`,32,32,c=>{
 c.save();if(face==='west'){c.translate(32,0);c.scale(-1,1);}
 const step=state==='walk'?Math.round(Math.sin(f/6*Math.PI*2)*2):0,bob=state==='idle'?(f===2?1:0):Math.abs(step)>1?-1:0;
 rect(c,P.ink,9,25+step,6,5);rect(c,'#785339',10,25+step,4,3);rect(c,P.ink,18,25-step,6,5);rect(c,'#99704a',19,25-step,4,3);
 c.translate(0,bob);
 poly(c,P.ink,[[9,12],[23,12],[27,26],[23,28],[17,26],[9,28],[5,25]]);
 poly(c,P.navy,[[9,13],[23,13],[24,25],[19,24],[13,26],[7,24]]);
 poly(c,P.mid,[[10,15],[13,16],[11,24],[8,25]]);rect(c,'#172239',19,16,3,9);
 if(face!=='north'){rect(c,'#654735',12,16,9,7);rect(c,'#96704a',13,17,6,4);rect(c,P.gold,11,22,11,2);rect(c,'#f7d38b',16,21,3,4);rect(c,P.ink,17,22,1,2);}
 poly(c,P.ink,[[9,4],[13,1],[21,2],[25,7],[25,16],[21,19],[9,17],[6,11]]);
 poly(c,P.navy,[[10,5],[14,3],[20,3],[23,7],[23,15],[20,17],[9,15],[8,10]]);
 poly(c,P.mid,[[10,6],[14,4],[20,4],[21,6],[13,6],[10,11]]);
 rect(c,P.light,12,4,6,1);
 if(face!=='north'){
 poly(c,'#090d17',face==='east'?[[17,8],[24,9],[24,14],[18,16],[14,13]]:[[11,8],[21,8],[22,13],[19,16],[12,14]]);
 rect(c,P.cyan,face==='east'?20:12,11,2,2);if(face==='south')rect(c,P.cyan,18,11,2,2);
 rect(c,'#b7f8f2',face==='east'?21:13,11,1,1);
 }else{poly(c,'#2b3d5a',[[15,7],[19,6],[22,14],[17,16],[12,13]]);rect(c,P.gold,15,18,3,2);}
 const cast=state==='cast'?(f<2?2:1):0;
 rect(c,P.ink,24+cast,16-cast,4,7);rect(c,'#957044',24+cast,17-cast,3,4);rect(c,P.gold,26+cast,12-cast,2,10);
 rect(c,'#236c8d',24+cast,11-cast,5,5);rect(c,P.cyan,25+cast,10-cast,3,4);rect(c,'#d1ffff',26+cast,10-cast,1,2);
 c.restore();
 });
 scene.anims.create({key:`kael-${face}-${state}`,frames:Array.from({length:count},(_,i)=>({key:`kael-${face}-${state}-${i}`})),frameRate:state==='walk'?11:state==='cast'?14:5,repeat:state==='cast'?0:-1});
 }
 for(let f=0;f<4;f++)paint(scene,`crawler-${f}`,32,32,c=>{
 const d=f%2?2:0;
 for(const [x,y] of [[5,21+d],[23,21-d],[8,25-d],[21,25+d]]){rect(c,P.ink,x-1,y-1,6,5);rect(c,'#9a8a77',x,y,4,2);rect(c,P.bone,x-2,y+2,5,2);}
 poly(c,P.ink,[[8,13],[12,9],[23,10],[27,17],[23,24],[9,23],[5,19]]);
 rect(c,'#716d68',9,14,15,7);rect(c,P.bone,11,13,12,2);
 for(let i=0;i<4;i++){rect(c,'#e9dbb6',11+i*3,15,2,5);rect(c,P.ink,12+i*3,16,1,3);}
 rect(c,P.ink,8,6,15,12);rect(c,'#ad9c84',9,6,13,10);rect(c,'#e1d5b7',10,5,10,8);rect(c,'#f3e6c8',11,5,7,2);
 rect(c,P.ink,10,10,4,4);rect(c,P.ink,17,10,4,4);rect(c,'#ff5267',11,11,2,2);rect(c,'#ff5267',18,11,2,2);rect(c,'#5e4f49',15,13,2,2);rect(c,P.bone,12,15,8,3);for(let i=0;i<3;i++)rect(c,P.ink,13+i*2,16,1,2);
 });
 scene.anims.create({key:'crawler-walk',frames:[0,1,2,3].map(i=>({key:`crawler-${i}`})),frameRate:8,repeat:-1});
 paint(scene,'orb',16,16,c=>{for(const [color,x,y,w,h]of [['#123446',1,5,14,6],['#216888',3,3,10,10],[P.cyan,4,4,8,8],['#d5ffff',6,5,5,5],['#ffffff',7,5,2,2]])rect(c,color,x,y,w,h);});
 paint(scene,'spark',4,4,c=>rect(c,'#ffffff',0,0,4,4));
 paint(scene,'shadow',32,12,c=>{c.fillStyle='#070c17';c.beginPath();c.ellipse(16,6,14,5,0,0,7);c.fill();});
 for(let v=0;v<8;v++)paint(scene,`floor-${v}`,48,48,c=>{
 rect(c,'#161c2a',0,0,48,48);rect(c,['#252d3c','#283140','#232c3b','#293140'][v%4],1,1,46,45);rect(c,'#344050',2,1,44,1);rect(c,'#1b2230',2,45,44,2);
 for(let i=0;i<16;i++){const x=(i*17+v*11)%44+2,y=(i*29+v*7)%42+3;rect(c,i%3?'#2e3746':'#202837',x,y,2+(i%3),1);}
 if(v%3===0){c.strokeStyle='#171f2e';c.lineWidth=1;c.beginPath();c.moveTo(6,0);c.lineTo(14,9);c.lineTo(12,17);c.lineTo(21,23);c.stroke();}
 if(v===4)for(let i=0;i<8;i++)rect(c,'#354841',3+i*3,38+i%3,3,2);
 });
 paint(scene,'pillar',48,64,c=>{rect(c,'#101725',2,13,44,48);rect(c,'#4a5360',5,8,38,8);rect(c,'#72757a',7,7,34,3);rect(c,'#303b4c',9,16,30,34);rect(c,'#586171',10,16,6,32);rect(c,'#424d60',19,16,12,32);rect(c,'#1d283c',33,16,5,34);rect(c,'#626978',5,49,38,4);rect(c,'#343f51',3,53,42,8);rect(c,'#8b8065',17,8,14,2);rect(c,'#257389',23,24,3,13);rect(c,P.cyan,21,28,7,2);});
 paint(scene,'urn',24,32,c=>{rect(c,'#101522',5,9,16,21);poly(c,'#725950',[[6,10],[18,10],[22,19],[19,28],[6,28],[3,20]]);rect(c,'#a18063',7,12,4,12);rect(c,'#b1936d',5,7,15,4);rect(c,'#302d38',8,7,9,2);rect(c,'#cfaa70',4,18,17,2);});
}
