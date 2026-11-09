import {campaignArt} from '../art/campaignArt.js';
import Phaser from 'phaser';
import {makeTextures} from '../art/textures.js';
import {makeCombatTextures} from '../art/combatTextures.js';
export class BootScene extends Phaser.Scene{constructor(){super('Boot');}preload(){this.load.image('title-art','assets/ui/title-art.png');}create(){makeTextures(this);makeCombatTextures(this);campaignArt(this);this.scene.start('Menu');}}
