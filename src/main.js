import {StoryScene} from './scenes/StoryScene.js';
import Phaser from 'phaser';
import './style.css';
import {BootScene} from './scenes/BootScene.js';
import {MenuScene} from './scenes/MenuScene.js';
import {GameScene} from './scenes/GameScene.js';
const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:1280,height:720,backgroundColor:'#10121c',pixelArt:true,roundPixels:true,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},physics:{default:'arcade',arcade:{debug:false}},scene:[BootScene,MenuScene,GameScene,StoryScene]});
// Explicit test hook is excluded from ordinary sessions.
if(new URLSearchParams(location.search).has('test'))window.__game=game;
