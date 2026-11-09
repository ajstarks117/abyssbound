// Original 32px animated enemies in the existing limited palette.
export function makeCombatTextures(scene){
 const paint=(key,draw)=>{const t=scene.textures.createCanvas(key,32,32),c=t.context;const r=(color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};draw(c,r);t.refresh();};
 for(const key of ['treasure','healing','boss','crate','statue'])paint(key,(c,r)=>{r('#10121c',3,12,26,18);r('#42485a',5,14,22,13);r('#717788',4,12,24,4);if(key==='treasure'||key==='crate'){r('#79533b',6,10,20,16);r('#d6a85c',8,10,3,16);r('#d6a85c',22,10,3,16);r('#eed39a',14,17,4,4);}else if(key==='statue'){r('#717788',11,4,10,20);r('#a4a7ac',10,3,12,8);}else {r(key==='healing'?'#50d9e8':'#9c67e8',8,16,16,6);r('#d4f7ef',12,6,7,13);}});
 for(const kind of ['spitter','wisp']){
 for(let f=0;f<4;f++)paint(`${kind}-${f}`,(c,r)=>{
 const b=f%2;
 if(kind==='spitter'){
 r('#0b1520',5,12+b,23,14);r('#305c48',7,11+b,19,13);r('#559064',9,9+b,14,13);r('#70c48c',12,9+b,8,3);
 r('#172a28',3,23-b,9,5);r('#809b55',4,23-b,7,3);r('#172a28',22,23+b,8,5);r('#809b55',23,23+b,6,3);
 r('#acbf5c',5,15+b,5,7);r('#d5da89',6,15+b,2,3);r('#acbf5c',23,14+b,5,8);r('#d5da89',24,14+b,2,4);
 r('#172a28',11,11+b,5,4);r('#172a28',20,11+b,5,4);r('#e8d97a',12,11+b,3,2);r('#e8d97a',21,11+b,3,2);
 r('#15272b',13,18+b,10,4);r('#d1c786',14,18+b,2,2);r('#d1c786',20,18+b,2,2);r('#a7dc74',17,22+b,3,3);
 }else{
 r('#19172e',10,5+b,14,20);r('#46315e',7,10+b,20,12);r('#66478a',10,6+b,14,15);r('#9c67e8',12,5+b,9,4);r('#c29af2',14,5+b,5,2);
 r('#241a3d',11,12+b,13,7);r('#c8f2ef',12,12+b,3,3);r('#c8f2ef',20,12+b,3,3);r('#ffffff',13,12+b,1,1);
 r('#634383',10,21+b,13,3);r('#46315e',8+b*2,24,13,3);r('#302442',5+b*3,27,11,2);r('#9c67e8',4,15-b,2,3);r('#c29af2',28,9+b,2,2);
 }});
 scene.anims.create({key:`${kind}-walk`,frames:[0,1,2,3].map(i=>({key:`${kind}-${i}`})),frameRate:kind==='wisp'?7:6,repeat:-1});
 }
 paint('poison',(c,r)=>{r('#163b37',10,8,12,16);r('#416c49',8,11,16,10);r('#70c48c',11,9,10,13);r('#c6e784',13,10,6,6);r('#f2f7bc',14,10,2,2);});
}
