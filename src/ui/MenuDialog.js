import {settings,saveSetting} from '../systems/AudioManager.js';
const pages={
 'How to Play':'Move with WASD. Hold an arrow key to shoot while moving. Tab selects a relic and Q activates it. Shift + Tab selects a fusion and R activates it. Press Space to dodge. Press E beside a marked door, fountain, portal or relic pedestal. Clear each chamber to unlock its doors. Choose relics to discover fusions. Escape pauses, M toggles sound.',
 Credits:'ABYSSBOUND: Echoes of the Forgotten. Built with Phaser and Vite. Original procedural pixel artwork, animation and synthesized audio created for this project. Title illustration generated with OpenAI image generation.'
};
export function openDialog(scene,title,bodyText,onClose){
 if(scene.dialog)return;const dialog=document.createElement('dialog');scene.dialog=dialog;dialog.className='crypt-dialog';
 const heading=document.createElement('h2');heading.textContent=title;dialog.append(heading);
 if(title==='Settings'){
 for(const [name,label] of [['master','Master volume'],['music','Music volume'],['effects','Sound effects'],['shake','Screen shake'],['fullscreen','Fullscreen']]){
 const row=document.createElement('label'),input=document.createElement('input'),value=document.createElement('output');row.append(label,input,value);dialog.append(row);
 const toggle=typeof settings[name]==='boolean';input.type=toggle?'checkbox':'range';
 if(toggle)input.checked=name==='fullscreen'?!!document.fullscreenElement:settings[name];else{input.value=settings[name];value.textContent=input.value+'%';}
 if(name==='fullscreen')input.disabled=!document.fullscreenEnabled;
 input.addEventListener('input',async()=>{if(name==='fullscreen'){try{if(input.checked)await document.documentElement.requestFullscreen();else if(document.fullscreenElement)await document.exitFullscreen();}catch{}input.checked=!!document.fullscreenElement;}
 saveSetting(name,toggle?input.checked:Number(input.value));if(!toggle)value.textContent=input.value+'%';scene.audio.sync();});input.onchange=()=>scene.audio.play('menu');
 }
 }else{const body=document.createElement('p');body.textContent=bodyText??pages[title];dialog.append(body);}
 const back=document.createElement('button');back.textContent='Back';back.onclick=()=>dialog.close();dialog.append(back);document.body.append(dialog);
 const keyboard=scene.input.keyboard;keyboard.enabled=false;
 const cleanup=()=>{dialog.remove();scene.dialog=null;keyboard.enabled=true;onClose?.();scene.events.off('shutdown',cleanup);};
 scene.events.once('shutdown',cleanup);dialog.addEventListener('close',cleanup,{once:true});dialog.showModal();back.focus();
}
