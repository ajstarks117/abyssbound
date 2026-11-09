const directions={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};
export function installCombatKeys(scene){
 function press(event){
  if(!scene.playable)return;
  if(event.code==='Tab'||directions[event.code])event.preventDefault();
  if(event.repeat)return;
  if(directions[event.code]){
   release(event);scene.shotsHeld.push(event.code);scene.player.aim=directions[event.code];
  }else if(event.code==='KeyQ'||event.code==='KeyR')scene.combat.effects.activate(event.code==='KeyR');
  else if(event.code==='Tab')scene.relics.cycle(event.shiftKey);
 }
 function release(event){
  const i=scene.shotsHeld.indexOf(event.code);
  if(i>=0)scene.shotsHeld.splice(i,1);
  if(scene.shotsHeld.length)scene.player.aim=directions[scene.shotsHeld.at(-1)];
 }
 const clear=()=>{scene.shotsHeld.length=0;};
 window.addEventListener('keydown',press);window.addEventListener('keyup',release);
 window.addEventListener('blur',clear);
 scene.events.once('shutdown',()=>{window.removeEventListener('keydown',press);window.removeEventListener('keyup',release);window.removeEventListener('blur',clear);});
}
