export const textStyle={fontFamily:'Georgia, serif',color:'#f2ebdc'};
export function text(s,x,y,label,size=18,color='#f2ebdc'){return s.add.text(x,y,label,{...textStyle,fontSize:`${size}px`,color});}
export function button(s,x,y,label,fn,width=280){const box=s.add.rectangle(x,y,width,50,0x172633,.95).setStrokeStyle(1,0x8e805d).setInteractive({useHandCursor:true});const t=text(s,x,y,label,17,'#e8d4ab').setOrigin(.5);box.on('pointerover',()=>box.setFillStyle(0x263e4a)).on('pointerout',()=>box.setFillStyle(0x172633)).on('pointerdown',()=>{s.audio?.play('menu');fn();});return [box,t];}
