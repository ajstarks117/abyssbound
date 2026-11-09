const defaults = {master:80, music:45, effects:80, shake:true, fullscreen:false};
const key = 'abyssbound-settings';
export const settings = {...defaults};
try { Object.assign(settings, JSON.parse(localStorage.getItem(key)) || {}); } catch {}
export function saveSetting(name,value){
 settings[name]=value;
 try {localStorage.setItem(key,JSON.stringify(settings));} catch {}
}
const cues = {
 culture:[96,43,.38,'sawtooth'],folio:[620,277,.35,'sine'],steel:[370,92,.25,'triangle'],
 menu:[392,588,.12], cast:[620,180,.09], impact:[210,60,.08,'triangle'],
 hit:[180,75,.09,'triangle'], hurt:[100,45,.22,'sawtooth'], dodge:[280,90,.16,'triangle'],
 death:[145,36,.25,'triangle'], relic:[440,880,.45], fusion:[370,1480,.7],
 clear:[330,880,.55], chest:[110,370,.28,'triangle'], start:[220,440,.3],
 intro:[110,55,.8,'triangle'], slam:[95,28,.34,'triangle'], rift:[170,740,.32],
 defeat:[185,740,.85], victory:[392,1047,1], loss:[196,49,1,'triangle']
};
const themes={menu:[146.8,220,261.6,196],explore:[110,164.8,130.8,146.8],boss:[98,103.8,146.8,123.5],victory:[196,246.9,293.7,392],loss:[130.8,123.5,98,65.4]};
export class AudioManager{
 constructor(scene){
  this.scene=scene;this.ctx=scene.sound.context;this.muted=false;
  try{this.muted=localStorage.getItem('abyssbound-muted')==='true';}catch{}
  if(!this.ctx)return;
  this.music=this.ctx.createGain();this.effects=this.ctx.createGain();this.music.connect(this.ctx.destination);this.effects.connect(this.ctx.destination);this.sync();
  this.unlock=()=>{if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});};
  window.addEventListener('pointerdown',this.unlock);window.addEventListener('keydown',this.unlock);
  scene.events.once('shutdown',()=>{window.removeEventListener('pointerdown',this.unlock);window.removeEventListener('keydown',this.unlock);this.music.disconnect();this.effects.disconnect();});
 }
 sync(){if(!this.ctx)return;const level=this.muted?0:settings.master/100;this.music.gain.value=this.silent?0:level*settings.music/100;this.effects.gain.value=level*settings.effects/100;}
 toggle(){this.muted=!this.muted;try{localStorage.setItem('abyssbound-muted',String(this.muted));}catch{}this.sync();return this.muted;}
 tone(bus,a,b,d,w='sine',volume=.08){if(!this.ctx||this.ctx.state!=='running')return;const ctx=this.ctx,t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type=w;o.frequency.setValueAtTime(a,t);o.frequency.exponentialRampToValueAtTime(b,t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+Math.min(.12,d/4));g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(bus);o.start(t);o.stop(t+d+.01);o.onended=()=>{o.disconnect();g.disconnect();};}
 play(kind){this.tone(this.effects,...(cues[kind]||cues.menu));}
 theme(name){this.beat?.remove();this.silent=false;this.sync();let step=0;const pulse=()=>{if(this.silent||this.muted)return;const notes=themes[name],n=notes[step++%notes.length];this.tone(this.music,n,n,1.7,'sine',.06);this.tone(this.music,n/2,n/2,2.1,'triangle',.028);};pulse();this.beat=this.scene.time.addEvent({delay:name==='boss'?660:1450,loop:true,callback:pulse});}
 pause(value){this.silent=value;this.sync();}
 shake(duration,intensity){if(settings.shake)this.scene.cameras.main.shake(duration,intensity);}
}
