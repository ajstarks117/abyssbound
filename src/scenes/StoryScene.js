import Phaser from 'phaser';
import {AudioManager} from '../systems/AudioManager.js';
import {text,button} from '../ui/widgets.js';

export const opening=[
 [0,'The Forgotten Kingdom','Long ago, beneath the kingdom of Eldoria, the Wardens sealed away a darkness that should never have awakened.'],
 [1,'The Breaking Seal','For centuries, the seal held. Until the day the Abyss began to breathe again.'],
 [2,'The Fallen Wardens','Captain Varric took five lamps below. Commander Aldren left a sixth wick on the stair for Kael. None of the five returned.'],
 [3,'The Apprentice','Now only Kael remains. An apprentice carrying the burden of an order that has fallen.'],
 [4,'The Descent','Beyond the furnace, the expedition left a trail of sealed wards and drowned records. Somewhere below, his mentor still carries a lamp.'],
 [-1,'ABYSSBOUND','Every death is remembered. Every descent changes the Abyss.']
];
const closing=[
 [6,'The Heart Falls','The Heart was silenced. But its final echo revealed the truth.'],
 [7,'The Warden’s Secret','The Wardens had not discovered the Abyss. They had created it.'],
 [8,'First Light','Kael returned to a kingdom that would never know what its protectors had done.'],
 [-1,'','Some darkness is buried. Some must be remembered.']
];
export class StoryScene extends Phaser.Scene{
 constructor(){super('Story');}
 preload(){if(!this.textures.exists('chronicle'))this.load.image('chronicle','assets/ui/chronicle.png');}
 create({mode='start',discoveries=[]}={}){
  this.mode=mode;this.finished=false;this.index=0;this.panels=mode==='ending'?closing.map(p=>[...p]):opening;
  if(mode==='ending'){this.panels[2][2]=discoveries.includes(10)?'Kael brings Thorne’s cylinder into daylight. For the first time, the city will hear who built the Heart.':discoveries.includes(5)?'Kael carries Maera’s last letter home with Aldren’s sixth wick. The quarantine door held.':discoveries.length?'Kael brings the expedition’s papers into daylight. Beside Aldren’s name, he sets the sixth wick.':'Kael returns with Aldren’s Focus. At the empty muster table, he lights the sixth lamp.';}
  const sheet=this.textures.get('chronicle'),source=sheet.getSourceImage();
  const w=Math.floor(source.width/3),h=Math.floor(source.height/3);
  for(let i=0;i<9;i++)if(!sheet.has('page'+i))sheet.add('page'+i,0,(i%3)*w+2,Math.floor(i/3)*h+2,w-4,h-4);
  this.audio=new AudioManager(this);this.audio.theme(mode==='ending'?'victory':'menu');
  this.add.rectangle(640,360,1280,720,0x080c14);
  this.backdrop=this.add.image(640,265,'chronicle','page0').setTint(0x373745);
  this.art=this.add.image(640,265,'chronicle','page0');
  this.details=this.add.container();
  this.dust=this.add.particles(0,0,'spark',{x:{min:45,max:1235},y:{min:70,max:460},speedX:12,speedY:-6,frequency:260,lifespan:3600,alpha:{start:.35,end:0},scale:.42,tint:0xc7dbe4});
  this.add.rectangle(640,625,1280,190,0x0b101a);
  this.title=text(this,76,550,'',23,'#dbc18a');
  this.caption=text(this,76,594,'',23).setWordWrapWidth(1070).setLineSpacing(5);
  button(this,1180,45,'Skip ›',()=>this.leave(),116).forEach(o=>o.setDepth(5));
  const skip=event=>{if(!event.repeat)this.leave();};
  this.input.keyboard.on('keydown-SPACE',skip).on('keydown-ENTER',skip);
  this.events.once('shutdown',()=>{this.input.keyboard.off('keydown-SPACE',skip).off('keydown-ENTER',skip);});
  this.show();
 }
 show(){
  const [frame,title,line]=this.panels[this.index],duration=this.mode==='ending'?3700:8100;
  this.title.setText(title);this.caption.setText(line);this.backdrop.setVisible(frame>=0);this.art.setVisible(frame>=0);this.dust.setVisible(frame>=0);
  if(frame>=0){this.art.setFrame('page'+frame).setPosition(640,260);this.backdrop.setFrame('page'+frame).setScale(Math.max(1280/this.art.width,535/this.art.height));const zoom=Math.min(1200/this.art.width,503/this.art.height);this.art.setScale(zoom);this.tweens.add({targets:this.art,x:650,scale:zoom*1.035,duration});}
  else if(this.mode!=='ending'){text(this,640,250,'ABYSSBOUND',64,'#e5c991').setOrigin(.5);text(this,640,326,'Echoes of the Forgotten',25).setOrigin(.5);this.title.setText('');}
  this.details.removeAll(true);
  const layer=(obj,props)=>{this.details.add(obj);this.tweens.add({targets:obj,duration:duration-600,...props});};
  if(frame===0){for(let i=0;i<4;i++)layer(this.add.ellipse(430+i*95,73+i*6,165,11,0xb4c2d2,.09),{x:535+i*95,alpha:0});}
  if(frame===1){const crack=this.add.graphics().lineStyle(2,0xb46af4,.75);crack.beginPath().moveTo(638,260).lineTo(660,270).lineTo(655,284).lineTo(676,287).lineTo(694,301).strokePath();layer(crack.setAlpha(0),{alpha:.9});}
  if(frame===2)layer(this.add.rectangle(640,260,750,510,0x070914,0),{alpha:.64});
  if(frame===3)layer(this.add.ellipse(650,270,96,105,0x66fff5,.015),{alpha:.12,scale:1.4});
  if(frame===4){for(const sign of [-1,1])layer(this.add.rectangle(640+sign*30,267,60,213,0x151622,.85),{x:640+sign*85,alpha:0});}
  this.cameras.main.fadeIn(400);if(frame===1||frame===6){this.audio.shake(280,.002);this.audio.play('slam');}
  this.time.delayedCall(duration-360,()=>this.cameras.main.fadeOut(360));
  this.time.delayedCall(duration,()=>{if(++this.index<this.panels.length)this.show();else this.leave();});
 }
 leave(){if(this.finished)return;this.finished=true;if(this.mode==='ending'){this.scene.resume('Game');this.scene.get('Game').showResult(true);this.scene.stop();}else this.scene.start(this.mode==='replay'?'Menu':'Game');}
}
