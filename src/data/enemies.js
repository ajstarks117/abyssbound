import {CRAWLER} from '../config/game.js';
export const ENEMIES={sentinel:{name:"Iron Sentinel",hp:85,speed:45,damage:2,range:240,windup:800,recovery:1200,attackDuration:560,color:0xd6a85c},leech:{name:"Blood Leech",hp:15,speed:150,damage:1,range:60,windup:180,recovery:550,attackDuration:230,color:0xca425b},watcher:{name:"Void Watcher",hp:45,speed:50,damage:1,range:400,windup:620,recovery:1050,attackDuration:120,color:0x9c67e8},crawler:{...CRAWLER,name:'Hollow Crawler',range:92,attackDuration:140,color:0xd4c5a2},spitter:{name:'Blight Spitter',hp:35,speed:65,damage:1,range:340,windup:600,recovery:1100,attackDuration:100,color:0x70c48c},wisp:{name:'Shade Wisp',hp:18,speed:120,damage:1,range:140,windup:650,recovery:1100,attackDuration:180,color:0x9c67e8}};

Object.assign(ENEMIES,{
 host:{name:'Plague Host',hp:32,speed:61,damage:1,range:78,windup:600,recovery:1000,attackDuration:200,color:0xadd966},
 spore:{name:'Spore Crawler',hp:14,speed:128,damage:1,range:86,windup:920,recovery:800,attackDuration:160,color:0xf6bd63},
 scribe:{name:'Drowned Scribe',hp:28,speed:55,damage:1,range:310,windup:770,recovery:1600,attackDuration:160,color:0x62bfcb},
 ink:{name:'Ink Wraith',hp:24,speed:83,damage:1,range:195,windup:920,recovery:1250,attackDuration:180,color:0xb59bdf}
});
