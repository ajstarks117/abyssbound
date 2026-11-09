// Route around the padded footprint of a column, including the enemy body.
function clear(a,b,blocks){
 const steps=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/10);
 for(let i=1;i<=steps;i++){
  const x=a.x+(b.x-a.x)*i/steps,y=a.y+(b.y-a.y)*i/steps;
  if(blocks.some(p=>Math.abs(x-p.x)<54&&Math.abs(y-p.y-18)<53))return false;
 }
 return true;
}
export function waypoint(enemy,player,pillars){
 if(clear(enemy,player,pillars))return player;
 const corners=pillars.flatMap(p=>[-66,66].flatMap(dx=>[-65,65].map(dy=>({x:p.x+dx,y:p.y+18+dy}))))
 .filter(p=>p.x>138&&p.x<1140&&p.y>208&&p.y<586);
 // Breadth-first search through visible corners. The first waypoint is retained along each route.
 const queue=[{p:enemy,first:null}],visited=new Set();
 for(const {p,first} of queue){
  if(first&&clear(p,player,pillars))return first;
  for(const q of corners.filter(q=>!visited.has(q)).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))){
   if(clear(p,q,pillars)){visited.add(q);queue.push({p:q,first:first||q});}
  }
 }
 return player;
}
