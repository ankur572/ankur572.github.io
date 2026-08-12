(() => {
  // NASA GISTEMP annual global surface temperature anomalies (°C), baseline 1951–1980.
  // 1970–2018 values follow NASA/GISS Fig. A historical series; recent years use GISTEMP v4 releases.
  const temps = {
    1970:.07,1971:-.07,1972:-.02,1973:.22,1974:-.04,1975:.02,1976:-.17,1977:.22,1978:.14,1979:.21,
    1980:.35,1981:.44,1982:.14,1983:.40,1984:.22,1985:.20,1986:.25,1987:.41,1988:.52,1989:.38,
    1990:.54,1991:.53,1992:.24,1993:.27,1994:.39,1995:.57,1996:.49,1997:.55,1998:.84,1999:.59,
    2000:.57,2001:.67,2002:.79,2003:.77,2004:.68,2005:.87,2006:.76,2007:.85,2008:.64,2009:.78,
    2010:.91,2011:.78,2012:.76,2013:.81,2014:.87,2015:.97,2016:1.24,2017:1.13,2018:1.05,
    2019:.98,2020:1.02,2021:.85,2022:.89,2023:1.18,2024:1.28,2025:1.19
  };

  const years = Object.keys(temps).map(Number);
  const min = Math.min(...Object.values(temps));
  const max = Math.max(...Object.values(temps));
  const clamp = (x,a,b) => Math.max(a,Math.min(b,x));

  // Yellow -> orange -> deep red.
  function color(v){
    const t = clamp((v-min)/(max-min),0,1);
    const stops = [[255,238,140],[244,165,72],[214,79,51],[139,20,31]];
    const q=t*(stops.length-1), i=Math.min(stops.length-2,Math.floor(q)), f=q-i;
    return `rgb(${stops[i].map((c,j)=>Math.round(c+(stops[i+1][j]-c)*f)).join(',')})`;
  }
  function pale(v){
    const t=clamp((v-min)/(max-min),0,1);
    return `rgb(255,${Math.round(252-20*t)},${Math.round(235-31*t)})`;
  }

  const host=document.querySelector('.warming-stripes');
  const readout=document.querySelector('.warming-readout');

  function apply(year,save){
    const v=temps[year]; if(v===undefined) return;
    document.documentElement.style.setProperty('--warm-accent',color(v));
    document.documentElement.style.setProperty('--warm-pale',pale(v));
    if(readout) readout.textContent=`${year}  ·  ${v>=0?'+':''}${v.toFixed(2)} °C vs. 1951–1980`;
    if(host) host.querySelectorAll('.warming-stripe').forEach(x=>x.classList.toggle('selected',Number(x.dataset.year)===year));
    if(save) localStorage.setItem('warmingYear',year);
  }

  if(host){
    years.forEach(y=>{
      const b=document.createElement('button');
      b.className='warming-stripe'; b.type='button'; b.dataset.year=y;
      b.style.background=color(temps[y]);
      b.title=`${y}: ${temps[y]>=0?'+':''}${temps[y].toFixed(2)} °C`;
      b.setAttribute('aria-label',b.title);
      b.addEventListener('click',()=>apply(y,true));
      host.appendChild(b);
    });
  }

  const saved=Number(localStorage.getItem('warmingYear'));
  apply(temps[saved]!==undefined?saved:2025,false);
})();
