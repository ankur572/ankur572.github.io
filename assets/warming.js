(() => {
  // C3S/ECMWF ERA5 annual global surface-air temperature anomalies (°C)
  // relative to the estimated 1850–1900 pre-industrial reference period.
  // Official series: 1940–2025 (C3S Global Climate Highlights 2025, Fig. 3a).
  const temps = {
    1940:0.1947,
    1941:0.2386,
    1942:0.1487,
    1943:0.1534,
    1944:0.3452,
    1945:0.2068,
    1946:0.2088,
    1947:0.2536,
    1948:0.1928,
    1949:0.2256,
    1950:0.1144,
    1951:0.2482,
    1952:0.2299,
    1953:0.3073,
    1954:0.1101,
    1955:0.0932,
    1956:0.0330,
    1957:0.2818,
    1958:0.3478,
    1959:0.3130,
    1960:0.2673,
    1961:0.3426,
    1962:0.2822,
    1963:0.3192,
    1964:0.1076,
    1965:0.1707,
    1966:0.2479,
    1967:0.2632,
    1968:0.1993,
    1969:0.3310,
    1970:0.3036,
    1971:0.1505,
    1972:0.2863,
    1973:0.3874,
    1974:0.1140,
    1975:0.1369,
    1976:0.0687,
    1977:0.3549,
    1978:0.2958,
    1979:0.4532,
    1980:0.5822,
    1981:0.6161,
    1982:0.4169,
    1983:0.6107,
    1984:0.3996,
    1985:0.3596,
    1986:0.4467,
    1987:0.6026,
    1988:0.6354,
    1989:0.5162,
    1990:0.7490,
    1991:0.6921,
    1992:0.4607,
    1993:0.5067,
    1994:0.5446,
    1995:0.7189,
    1996:0.5906,
    1997:0.7137,
    1998:0.9007,
    1999:0.6313,
    2000:0.6268,
    2001:0.7889,
    2002:0.8848,
    2003:0.8726,
    2004:0.8090,
    2005:0.9729,
    2006:0.9239,
    2007:0.9167,
    2008:0.7853,
    2009:0.9154,
    2010:1.0098,
    2011:0.8701,
    2012:0.9203,
    2013:0.9473,
    2014:0.9880,
    2015:1.1365,
    2016:1.3185,
    2017:1.2234,
    2018:1.1443,
    2019:1.2801,
    2020:1.3110,
    2021:1.1554,
    2022:1.1818,
    2023:1.4828,
    2024:1.5994,
    2025:1.4714
  };

  const years = Object.keys(temps).map(Number).sort((a,b)=>a-b);
  const min = Math.min(...Object.values(temps));
  const max = Math.max(...Object.values(temps));
  const clamp = (x,a,b) => Math.max(a,Math.min(b,x));

  // Soft pre-industrial warmth -> orange -> red; used for the site accent.
  function color(v) {
    const t = clamp((v-min)/(max-min),0,1);
    const stops = [[248,235,190],[239,184,108],[222,122,70],[177,62,52],[116,29,40]];
    const q=t*(stops.length-1), i=Math.min(stops.length-2,Math.floor(q)), f=q-i;
    return `rgb(${stops[i].map((c,j)=>Math.round(c+(stops[i+1][j]-c)*f)).join(',')})`;
  }
  function pale(v) {
    const t=clamp((v-min)/(max-min),0,1);
    return `rgb(255,${Math.round(250-18*t)},${Math.round(238-22*t)})`;
  }

  const host=document.querySelector('.warming-stripes');
  const readout=document.querySelector('.warming-readout');

  function apply(year,save) {
    const v=temps[year]; if(v===undefined) return;
    document.documentElement.style.setProperty('--warm-accent',color(v));
    document.documentElement.style.setProperty('--warm-pale',pale(v));
    if(readout) readout.textContent=`${year}  ·  ${v>=0?'+':''}${v.toFixed(2)} °C vs. 1850–1900`;
    if(host) host.querySelectorAll('.warming-stripe').forEach(x=>x.classList.toggle('selected',Number(x.dataset.year)===year));
    if(save) localStorage.setItem('warmingYear',year);
  }

  if(host) {
    years.forEach(y=>{
      const b=document.createElement('button');
      b.className='warming-stripe'; b.type='button'; b.dataset.year=y;
      b.style.background=color(temps[y]);
      b.title=`${y}: ${temps[y]>=0?'+':''}${temps[y].toFixed(2)} °C vs. 1850–1900`;
      b.setAttribute('aria-label',b.title);
      b.addEventListener('click',()=>apply(y,true));
      host.appendChild(b);
    });
  }

  const saved=Number(localStorage.getItem('warmingYear'));
  apply(temps[saved]!==undefined?saved:years[years.length-1],false);
})();
