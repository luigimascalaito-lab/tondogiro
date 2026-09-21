
const NUCLEI = ['Primo nucleo: i girotondi','Secondo nucleo: l\u2019hula hoop'];
const riduci = matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Piazza: due cerchi che girano in senso opposto ---------- */
const palco = document.getElementById('palco');
const rima = document.getElementById('rimaGiro');
const esterni = OPERE.filter(o=>o.n===0), interni = OPERE.filter(o=>o.n===1);
const bimbi = [];
OPERE.forEach((o,i)=>{
  const b = document.createElement('button');
  b.className='bimbo'; b.type='button';
  b.setAttribute('aria-label', o.t + ', apri');
  const im = new Image(); im.src = 'img/opere/mini/'+o.file; im.alt=''; im.decoding='async';
  b.appendChild(im);
  b.addEventListener('click', e=>{ if(palco.dataset.mosso==='1'){e.preventDefault();return;} apri(i); });
  palco.appendChild(b);
  const gruppo = o.n===0 ? esterni : interni;
  bimbi.push({el:b, o, idx:gruppo.indexOf(o), tot:gruppo.length, off:{x:0,y:0,r:0}});
});

let giroA = 0;          // angolo del cerchio esterno (rad)
let vel = 0.045;        // rad/s, rotazione lenta a riposo
let pausaFino = 0, S = 0;
function misura(){ S = palco.clientWidth; }
new ResizeObserver(misura).observe(palco); misura();

function disegna(){
  const sole = {x:-0.55, y:-0.83};           // luce fissa: le ombre non girano
  bimbi.forEach(b=>{
    const est = b.o.n===0;
    const R = S*(est?0.41:0.188);
    const w = S*(est?0.115:0.095);
    const base = (b.idx/b.tot)*Math.PI*2 - Math.PI/2;
    const a = est ? base + giroA : base - giroA*1.35 + 0.4;
    const x = Math.cos(a)*R + b.off.x, y = Math.sin(a)*R + b.off.y;
    const rot = a*180/Math.PI + 90 + b.off.r;  // testa verso l'esterno, come chi fa il girotondo
    b.el.style.width = w+'px';
    b.el.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) rotate(${rot}deg)`;
    // ombra proiettata in direzione fissa, riportata nel sistema ruotato
    const rr = -rot*Math.PI/180, d = S*0.018;
    const sx = -sole.x*d, sy = -sole.y*d;
    b.el.style.setProperty('--sx', (sx*Math.cos(rr)-sy*Math.sin(rr)).toFixed(1)+'px');
    b.el.style.setProperty('--sy', (sx*Math.sin(rr)+sy*Math.cos(rr)).toFixed(1)+'px');
  });
  rima.setAttribute('transform', `rotate(${(-giroA*0.6*180/Math.PI).toFixed(2)})`);
}

let ultimo = performance.now();
function ciclo(t){
  const dt = Math.min(0.05,(t-ultimo)/1000); ultimo = t;
  if(!trascinando && !riduci.matches && t>pausaFino && !visoreAperto) giroA += vel*dt;
  if(inerzia && Math.abs(inerzia)>0.0005){ giroA += inerzia; inerzia *= 0.94; }
  disegna();
  requestAnimationFrame(ciclo);
}
requestAnimationFrame(ciclo);

/* trascinamento circolare */
let trascinando=false, a0=0, g0=0, inerzia=0, ultimaA=0, pid=null, mosso=0;
const angolo = e=>{ const r=palco.getBoundingClientRect(); return Math.atan2(e.clientY-(r.top+r.height/2), e.clientX-(r.left+r.width/2)); };
palco.addEventListener('pointerdown', e=>{
  if(e.target.closest('.centro')) return;
  trascinando=true; pid=e.pointerId; a0=angolo(e); g0=giroA; ultimaA=a0; inerzia=0; mosso=0;
  palco.dataset.mosso='0';
});
addEventListener('pointermove', e=>{
  if(!trascinando || e.pointerId!==pid) return;
  let a=angolo(e), d=a-ultimaA;
  if(d>Math.PI) d-=2*Math.PI; if(d<-Math.PI) d+=2*Math.PI;
  mosso += Math.abs(d);
  if(mosso>0.06){ palco.classList.add('trascina'); palco.dataset.mosso='1'; try{palco.setPointerCapture(pid)}catch(_){} }
  giroA += d; inerzia = d; ultimaA=a;
});
addEventListener('pointerup', e=>{
  if(!trascinando || e.pointerId!==pid) return;
  trascinando=false; palco.classList.remove('trascina'); pausaFino=performance.now()+4000;
  if(riduci.matches) inerzia=0;
  setTimeout(()=>palco.dataset.mosso='0',0);
});
palco.addEventListener('wheel', e=>{
  if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){ e.preventDefault(); giroA += e.deltaX*0.002; pausaFino=performance.now()+4000; }
},{passive:false});
addEventListener('keydown', e=>{
  if(visoreAperto) return;
  if(!palco.contains(document.activeElement) && document.activeElement!==document.body) return;
  if(e.key==='ArrowRight'){ giroA+=0.15; pausaFino=performance.now()+4000; }
  if(e.key==='ArrowLeft'){ giroA-=0.15; pausaFino=performance.now()+4000; }
});

/* casca il mondo, casca la terra, tutti giù per terra */
const casca = document.getElementById('casca');
let cadendo=false;
const ease = {in:t=>t*t*t, out:t=>1-Math.pow(1-t,3), inout:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
function tween(dur, fn, e){ return new Promise(res=>{ const t0=performance.now(); (function f(t){ const k=Math.min(1,(t-t0)/dur); fn(e(k)); k<1?requestAnimationFrame(f):res(); })(t0); }); }
casca.addEventListener('click', async ()=>{
  if(cadendo) return; cadendo=true; pausaFino=Infinity;
  if(riduci.matches){ cadendo=false; pausaFino=0; return; }
  const giroTarget = giroA; 
  const bersagli = bimbi.map((b,i)=>{
    const est=b.o.n===0, R=S*(est?0.41:0.188);
    const base=(b.idx/b.tot)*Math.PI*2-Math.PI/2, a=est?base+giroTarget:base-giroTarget*1.35+0.4;
    const y0=Math.sin(a)*R, x0=Math.cos(a)*R;
    const fx = (i-(bimbi.length-1)/2)*S*0.09 + (Math.random()-.5)*S*0.03;
    const rotNow = a*180/Math.PI+90;
    const piatto = Math.round((rotNow+ (Math.random()*50-25))/180)*180 - rotNow + (Math.random()*30-15);
    return {dx:fx-x0, dy:S*0.43-y0, r:piatto};
  });
  await Promise.all(bimbi.map((b,i)=> new Promise(r=>setTimeout(r,i*55)).then(()=>
    tween(620, k=>{ b.off.x=bersagli[i].dx*k; b.off.y=bersagli[i].dy*k; b.off.r=bersagli[i].r*k; }, ease.in)
      .then(()=>tween(180,k=>{ b.off.y=bersagli[i].dy - Math.sin(k*Math.PI)*S*0.025; }, ease.out))
  )));
  casca.textContent='giro giro tondo';
  await new Promise(r=>setTimeout(r,1300));
  await Promise.all(bimbi.map((b,i)=>{ const s={...b.off}; return new Promise(r=>setTimeout(r,(bimbi.length-i)*45)).then(()=>
    tween(900,k=>{ b.off.x=s.x*(1-k); b.off.y=s.y*(1-k); b.off.r=s.r*(1-k); }, ease.inout)); }));
  casca.textContent='tutti giù per terra!';
  cadendo=false; pausaFino=performance.now()+1500;
});

/* titolo che si ricompone: tondo+giro <-> giro+tondo */
const tit = document.querySelector('.titolo');
tit.addEventListener('mouseenter', ()=>{ if(riduci.matches) return; const [a,b]=tit.children; const wa=a.offsetWidth, wb=b.offsetWidth; a.style.transform=`translateX(${wb}px)`; b.style.transform=`translateX(${-wa}px)`; tit.setAttribute('aria-label','tondogiro'); });
tit.addEventListener('mouseleave', ()=>{ [...tit.children].forEach(s=>s.style.transform=''); });

/* ---------- Visore con zoom e lente tonda ---------- */
const V = {
  box:document.getElementById('visore'), fin:document.getElementById('finestra'), img:document.getElementById('vImg'),
  tit:document.getElementById('vTitolo'), nuc:document.getElementById('vNucleo'), conta:document.getElementById('vConta'),
  lente:document.getElementById('lente'), bLente:document.getElementById('vLente'), sugg:document.getElementById('sugg')
};
let visoreAperto=false, corrente=0, fit=1, sc=1, tx=0, ty=0, lenteOn=false, ritorno=null;
const LZ = 3; // ingrandimento della lente

function apri(i){
  ritorno = document.activeElement;
  visoreAperto=true; V.box.classList.add('aperto'); document.body.style.overflow='hidden';
  mostra(i); document.getElementById('vChiudi').focus();
  V.sugg.style.opacity=1; setTimeout(()=>V.sugg.style.opacity=0, 2600);
}
function chiudi(){
  visoreAperto=false; V.box.classList.remove('aperto'); document.body.style.overflow='';
  if(ritorno) ritorno.focus();
}
function mostra(i){
  corrente=(i+OPERE.length)%OPERE.length; const o=OPERE[corrente];
  V.box.style.setProperty('--tinta', o.c); V.box.classList.toggle('scuro', !!o.scuro);
  V.tit.textContent=o.t; V.nuc.textContent=NUCLEI[o.n]+', tecnica mista';
  V.conta.textContent=(corrente+1)+' di '+OPERE.length;
  V.img.alt=o.t; V.img.src='img/opere/'+o.file;
  V.lente.style.backgroundImage=`url(img/opere/${o.file})`;
  if(V.img.complete) adatta(); else V.img.onload=adatta;
}
function adatta(){
  const r=V.fin.getBoundingClientRect(), nw=V.img.naturalWidth, nh=V.img.naturalHeight;
  fit=Math.min((r.width*0.9)/nw,(r.height*0.92)/nh); sc=fit; tx=-nw*fit/2; ty=-nh*fit/2; applica();
}
function limita(){
  const r=V.fin.getBoundingClientRect(), w=V.img.naturalWidth*sc, h=V.img.naturalHeight*sc;
  const mx=Math.max(0,(w-r.width)/2+40), my=Math.max(0,(h-r.height)/2+40);
  tx=Math.min(-w/2+mx,Math.max(-w/2-mx,tx)); ty=Math.min(-h/2+my,Math.max(-h/2-my,ty));
}
function applica(){ limita(); V.img.style.transform=`translate(${tx}px,${ty}px) scale(${sc})`; V.fin.classList.toggle('zoomato', sc>fit*1.02); }
function zoomA(nuova, cx, cy){
  const r=V.fin.getBoundingClientRect();
  if(cx===undefined){cx=r.left+r.width/2; cy=r.top+r.height/2;}
  const px=cx-(r.left+r.width/2), py=cy-(r.top+r.height/2);
  nuova=Math.max(fit, Math.min(fit*6, nuova));
  tx = px-(px-tx)*(nuova/sc); ty = py-(py-ty)*(nuova/sc); sc=nuova; applica();
}
document.getElementById('vChiudi').onclick=chiudi;
document.getElementById('vPrec').onclick=()=>mostra(corrente-1);
document.getElementById('vSucc').onclick=()=>mostra(corrente+1);
document.getElementById('vPiu').onclick=()=>zoomA(sc*1.6);
document.getElementById('vMeno').onclick=()=>zoomA(sc/1.6);
V.bLente.onclick=()=>{ lenteOn=!lenteOn; if(lenteOn) adatta(); V.bLente.setAttribute('aria-pressed',lenteOn); V.fin.classList.toggle('lente-on',lenteOn); if(!lenteOn) V.lente.style.display='none'; };
addEventListener('resize', ()=>{ if(visoreAperto) adatta(); });
addEventListener('keydown', e=>{
  if(!visoreAperto) return;
  if(e.key==='Escape') chiudi();
  else if(e.key==='ArrowRight') mostra(corrente+1);
  else if(e.key==='ArrowLeft') mostra(corrente-1);
  else if(e.key==='+'||e.key==='=') zoomA(sc*1.4);
  else if(e.key==='-') zoomA(sc/1.4);
  else if(e.key.toLowerCase()==='l') V.bLente.click();
  else if(e.key==='Tab'){ // trappola del focus
    const f=[...V.box.querySelectorAll('button')]; const i=f.indexOf(document.activeElement);
    if(e.shiftKey && i<=0){e.preventDefault(); f[f.length-1].focus();}
    else if(!e.shiftKey && i===f.length-1){e.preventDefault(); f[0].focus();}
  }
});

function lenteSu(e){
  const ir=V.img.getBoundingClientRect(), fr=V.fin.getBoundingClientRect();
  const dentro = e.clientX>=ir.left&&e.clientX<=ir.right&&e.clientY>=ir.top&&e.clientY<=ir.bottom;
  if(!dentro){ V.lente.style.display='none'; return; }
  const d=V.lente.offsetWidth || 200;
  V.lente.style.display='block';
  V.lente.style.left=(e.clientX-fr.left)+'px';
  // su schermi touch la lente sta sopra il dito
  V.lente.style.top=(e.clientY-fr.top-(e.pointerType==='touch'?d*0.75:0))+'px';
  const bw=ir.width*LZ, bh=ir.height*LZ;
  V.lente.style.backgroundSize=`${bw}px ${bh}px`;
  V.lente.style.backgroundPosition=`${-(e.clientX-ir.left)*LZ+d/2}px ${-(e.clientY-ir.top)*LZ+d/2}px`;
}

/* gesti: trascinamento, pinch, rotellina, doppio tocco */
const punti=new Map(); let pinch0=null, pan0=null, tapT=0;
V.fin.addEventListener('pointerdown', e=>{
  V.fin.setPointerCapture(e.pointerId); punti.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(lenteOn){ lenteSu(e); return; }
  if(punti.size===2){ const [a,b]=[...punti.values()]; pinch0={d:Math.hypot(a.x-b.x,a.y-b.y), s:sc, cx:(a.x+b.x)/2, cy:(a.y+b.y)/2}; pan0=null; }
  else { pan0={x:e.clientX,y:e.clientY,tx,ty};
    const now=performance.now(); if(now-tapT<300){ sc>fit*1.05 ? adatta() : zoomA(fit*2.6,e.clientX,e.clientY); tapT=0; } else tapT=now; }
});
V.fin.addEventListener('pointermove', e=>{
  if(lenteOn){ lenteSu(e); if(punti.has(e.pointerId)) punti.set(e.pointerId,{x:e.clientX,y:e.clientY}); return; }
  if(!punti.has(e.pointerId)) return;
  punti.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pinch0 && punti.size===2){ const [a,b]=[...punti.values()]; zoomA(pinch0.s*Math.hypot(a.x-b.x,a.y-b.y)/pinch0.d, pinch0.cx, pinch0.cy); }
  else if(pan0 && sc>fit*1.02){ tx=pan0.tx+(e.clientX-pan0.x); ty=pan0.ty+(e.clientY-pan0.y); applica(); }
});
const fine=e=>{ punti.delete(e.pointerId); if(punti.size<2) pinch0=null; if(!punti.size) pan0=null; if(lenteOn && e.pointerType==='touch') V.lente.style.display='none'; };
V.fin.addEventListener('pointerup',fine); V.fin.addEventListener('pointercancel',fine);
V.fin.addEventListener('pointerleave',e=>{ if(lenteOn && e.pointerType!=='touch') V.lente.style.display='none'; });
V.fin.addEventListener('wheel', e=>{ e.preventDefault(); zoomA(sc*Math.exp(-e.deltaY*0.0018), e.clientX, e.clientY); },{passive:false});

/* Funzionamento senza rete: registra il service worker */
if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
