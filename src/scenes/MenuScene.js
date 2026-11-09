import {openDialog} from '../ui/MenuDialog.js';
import {AudioManager,settings} from '../systems/AudioManager.js';
import Phaser from 'phaser';
import {text,button} from '../ui/widgets.js';
export class MenuScene extends Phaser.Scene{
 constructor(){super('Menu');}
 begin(){if(this.dialog)return;if(settings.fullscreen&&document.fullscreenEnabled&&!document.fullscreenElement)document.documentElement.requestFullscreen().catch(()=>{});this.scene.start('Story',{mode:'start'});}
 create(){this.audio=new AudioManager(this);this.audio.theme("menu");const backdrop=this.add.image(640,360,'title-art').setDisplaySize(1300,868);this.tweens.add({targets:backdrop,y:368,duration:9000,yoyo:true,repeat:-1});this.add.rectangle(300,360,600,720,0x080e19,.55);this.add.rectangle(640,360,1240,680).setStrokeStyle(1,0x8d7954,.6);
 text(this,100,118,'A B Y S S B O U N D',46,'#e9cf99');text(this,103,180,'E C H O E S   O F   T H E   F O R G O T T E N',14,'#a4b9c8');this.add.rectangle(155,233,104,2,0xd6a85c);
 text(this,103,270,'The Lost Chronicles',24);text(this,103,313,'Enter the Forgotten Crypt as Kael, the Last Warden.\nFollow Aldren’s expedition through six floors.',17,'#a4b3c5').setLineSpacing(10);
 button(this,243,429,'ENTER THE CRYPT   →',()=>this.begin());text(this,103,477,'WASD  move     ARROWS  shoot     Q/R  abilities',13,'#a4b3c5');text(this,103,504,'SPACE dodge   ESC pause   M sound',13,'#a4b3c5');
 ['How to Play','Settings','Credits'].forEach((name,i)=>button(this,165+i*156,580,name,()=>openDialog(this,name),145));
 button(this,243,650,'Replay introduction',()=>this.scene.start('Story',{mode:'replay'}));this.input.keyboard.once('keydown-ENTER',()=>this.begin());
 this.add.particles(0,0,'spark',{x:{min:600,max:1150},y:{min:240,max:680},speedY:{min:-12,max:-25},speedX:{min:-7,max:7},lifespan:4000,frequency:200,scale:{start:.45,end:0},alpha:{start:.5,end:0},tint:0x50d9e8});}
}

