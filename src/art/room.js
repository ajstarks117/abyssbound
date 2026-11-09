import {crypt} from '../data/rooms.js';
export function drawRoom(s){
 s.add.graphics().fillStyle(0x070c16).fillRect(0,80,1280,640);
 for(let row=0;row<10;row++)for(let col=0;col<22;col++)s.add.image(112+col*48,160+row*48,`floor-${(col*13+row*7+(s.room.variant||0))%8}`).setOrigin(0);
 const g=s.add.graphics();
 // Masonry crown with individual offset blocks and bevels.
 for(let r=0;r<3;r++)for(let col=0;col<24;col++){
 const x=64+col*48+(r%2?24:0),y=100+r*24;
 g.fillStyle(0x111827).fillRect(x,y,47,23);g.fillStyle([0x343e50,0x394355,0x303a4d][(col+r)%3]).fillRect(x+1,y+1,45,20);g.fillStyle(0x51576a).fillRect(x+2,y+1,43,2);
 }
 g.fillStyle(0x0d1421).fillRect(80,172,1120,12);g.fillStyle(0x576073).fillRect(80,172,1120,3);
 for(let y=184;y<616;y+=48)for(const x of [80,1168]){g.fillStyle(0x121c2a).fillRect(x,y,32,48);g.fillStyle(0x3b465a).fillRect(x+2,y+1,28,45);g.fillStyle(0x566075).fillRect(x+2,y+1,4,43);}
 g.fillStyle(0x111a29).fillRect(80,616,1120,32);g.fillStyle(0x4b5669).fillRect(80,616,1120,5);g.fillStyle(0x263245).fillRect(80,623,1120,12);
 // Arch and independently animated locking bars.
 g.fillStyle(0x090e19).fillRoundedRect(598,110,84,67,24);g.lineStyle(6,0x626071).strokeRoundedRect(592,108,96,70,25);
 s.doorBars=s.add.graphics();for(let i=0;i<5;i++){s.doorBars.fillStyle(0x313b50).fillRect(608+i*14,123,5,53);s.doorBars.fillStyle(0x9b8055).fillRect(609+i*14,145,3,3);}
 g.lineStyle(1,0x374b59,0.65).strokeCircle(640,400,95).strokeCircle(640,400,82);
 for(let i=0;i<12;i++){const a=i*Math.PI/6,x=640+Math.cos(a)*89,y=400+Math.sin(a)*89;g.lineStyle(2,0x3a5962,0.65).lineBetween(x-3,y-4,x+3,y+4);}
 g.lineStyle(2,0x304753,0.7).strokeTriangle(640,340,588,430,692,430);
 for(const {x,y} of s.room.pillars){s.add.image(x+8,y+30,'shadow').setScale(2.5,2).setAlpha(.65);s.add.image(x,y,'pillar').setScale(1.5).setDepth(y+30);}
 s.add.image(210+(s.room.variant%3)*35,550,s.room.variant%2?'crate':'statue').setScale(2).setDepth(550);
 for(const [x,y]of [[160,220],[1115,570],[1118,221],[160,570]])s.add.image(x,y,'urn').setScale(1.5).setDepth(y);
 s.torches=crypt.torches.map(({x,y})=>{g.fillStyle(0x101522).fillRect(x-8,y-4,16,27);g.fillStyle(0x9c794f).fillRect(x-5,y+3,10,5);const glow=s.add.circle(x,y-4,42,0xe99448,.07);const flame=s.add.graphics({x,y});flame.fillStyle(0xb64a39).fillTriangle(-7,2,6,2,3,-21);flame.fillStyle(0xf4a74e).fillTriangle(-5,1,5,1,-1,-17);flame.fillStyle(0xffe6a5).fillTriangle(-2,0,3,0,0,-10);return {glow,flame};});
 for(let i=0;i<35;i++){const x=130+(i*137)%1020,y=200+(i*83)%400;const dust=s.add.image(x,y,'spark').setScale(.35).setTint(0x91a6b6).setAlpha(.16);s.tweens.add({targets:dust,y:y-22,alpha:.03,duration:2500+i*70,yoyo:true,repeat:-1});}
 // Floor-edge occlusion leaves the central combat space readable.
 for(let i=0;i<8;i++){g.fillStyle(0x080e1b,.045).fillRect(112,184+i*4,1056,4);g.fillRect(112,612-i*4,1056,4);}
}



