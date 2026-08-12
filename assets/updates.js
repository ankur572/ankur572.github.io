(() => {
  const track=document.getElementById("updatesTrack");
  if(!track) return;
  const cards=track.querySelectorAll(".update-card");
  const prev=document.getElementById("updatePrev"), next=document.getElementById("updateNext");
  let i=0;
  function visible(){return innerWidth<600?1:innerWidth<850?2:3}
  function draw(){const w=cards[0].offsetWidth+24; track.style.transform=`translateX(-${i*w}px)`}
  next.addEventListener("click",()=>{i=Math.min(i+1,Math.max(0,cards.length-visible()));draw()});
  prev.addEventListener("click",()=>{i=Math.max(i-1,0);draw()});
  addEventListener("resize",()=>{i=0;draw()});
})();
