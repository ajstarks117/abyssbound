// Sprites use a common 32-pixel silhouette, expanded on the bosses' logical canvases.
export const chronicleSizes={host:36,spore:28,scribe:38,ink:36,architect:88,archivist:88,commander:88};
export function paintChronicle(kind,frame,size,c,rect,poly){
 const beat=[0,-1,0,1][frame],boss=size>60;
 c.scale(size/34,size/34);c.translate(0,beat);
 const book=(x,y)=>{poly('#674a45',[x-6,y-2],[x,y],[x+6,y-2],[x+6,y+3],[x,y+5],[x-6,y+3]);rect('#e3ca9b',x-5,y-2,4,3);rect('#f5dfb1',x+1,y-2,4,3);};
 if(kind==='spore'){
  for(const side of [-1,1])for(let j=0;j<3;j++)rect('#ba9a64',side*(8+j)-1,1+j*2+beat*side,4,2);
  poly('#733c42',[-12,0],[-8,-7],[-2,-11],[5,-9],[12,-2],[10,4],[-9,5]);rect('#d58453',-7,-5,13,7);rect('#ffd78a',-4,-8,4,3);rect('#ffecab',4,-4,3,2);rect('#312826',-4,3,9,3);
 }else if(kind==='host'||kind==='architect'){
  poly(boss?'#485c47':'#495047',[-7,-7],[6,-7],[10,6],[7,13],[-9,12],[-11,4]);rect('#adad82',-5,-12,9,8);rect('#332c37',-5,-8,9,2);
  for(let i=0;i<(boss?7:4);i++){const x=i%2?7+i%3:-8+i%3,y=-9+i*2;rect('#66754b',x,y,3,5);rect(i%2?'#9ebd60':'#d2cc73',x-2,y-1,7,3);}
  rect('#37323b',-7,11,5,4);rect('#37323b',3,12,5,3);rect('#d5ff99',1,-8,2,1);
  if(boss){rect('#d6c59f',-5,-3,9,12);rect('#638650',-1,-1,3,10);rect('#574651',10,-9,2,21);poly('#adcf7a',[8,-9],[11,-16],[14,-9],[11,-5]);}
 }else if(kind==='scribe'||kind==='archivist'){
  poly('#202f4d',[-5,-10],[5,-10],[10,4],[13,12],[3,10],[-3,14],[-11,10],[-7,1]);poly('#376580',[-4,-8],[2,-9],[5,5],[1,11],[-5,4]);rect('#76d9de',-3,-7,6,2);book(0,3);
  if(boss){for(const side of [-1,1]){book(side*10,-7+side*beat);rect('#e4bc72',side*8-1,-13,3,3);}rect('#83edf1',-2,-14,4,3);}
 }else if(kind==='ink'){
  poly('#262237',[0,-15],[7,-9],[5,-2],[12,8],[5,5],[8,13],[0,8],[-8,15],[-6,4],[-12,7],[-6,-4],[-5,-10]);poly('#605376',[-4,-8],[0,-12],[5,-8],[2,-5],[-1,-3]);rect('#d9c2f5',-4,-7,3,1);rect('#d9c2f5',2,-7,3,1);
 }else{
  poly('#633445',[-7,-9],[6,-9],[10,12],[2,10],[-9,14]);rect('#445164',-7,-7,13,14);rect('#bda26e',-9,-8,6,3);rect('#bda26e',4,-8,6,3);rect('#252936',-4,-14,9,7);rect('#e8ba8b',-3,-11,6,2);rect('#75d4da',-2,-2,3,4);rect('#2e3342',-6,7,4,8);rect('#2e3342',2,7,4,8);
  c.translate(10,2);c.rotate((frame-1)*.1);rect('#deba6a',-3,-2,7,2);poly('#c7d8db',[-1,-2],[-1,-13],[1,-16],[2,-2]);rect('#71544b',0,0,2,5);
 }
}
