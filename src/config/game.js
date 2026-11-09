export const PLAYER = Object.freeze({hp:6,speed:190,damage:8,interval:420,projectileSpeed:380,invulnerability:800,dodgeDuration:180,dodgeCooldown:1200,dodgeSpeed:520});
export const CRAWLER = Object.freeze({hp:25,speed:90,damage:1,windup:450,recovery:900});
export function direction(x,y,speed=1){const length=Math.hypot(x,y);return length?{x:x/length*speed,y:y/length*speed}:{x:0,y:0};}
export function facing(x,y){return Math.abs(x)>Math.abs(y)?(x>0?'east':'west'):(y<0?'north':'south');}
