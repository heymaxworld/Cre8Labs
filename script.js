/* ========================================
   Cre8Labs — 10/10 Premium Interactions
   GSAP + Three.js + Lenis + Cursor
   ======================================== */

'use strict';

// === LENIS SMOOTH SCROLL ===
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({ lerp:0.08, wheelMultiplier:0.8, smoothWheel:true });
  lenis.on('scroll', () => ScrollTrigger.update());
  (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })(0);
}

// === CUSTOM CURSOR ===
const cursor=document.getElementById('cursor'), follower=document.getElementById('cursorFollower');
let mx=0, my=0, fx=0, fy=0;
if(cursor&&follower){
  document.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; cursor.style.left=mx+'px'; cursor.style.top=my+'px'; });
  (function anim(){ fx+=(mx-fx)*.12; fy+=(my-fy)*.12; follower.style.left=fx+'px'; follower.style.top=fy+'px'; requestAnimationFrame(anim) })();
  document.querySelectorAll('a,button,.switcher__card,.audience__card').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor--grow'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor--grow'));
  });
}

// === NAVBAR / HEADER SCROLL ===
const navEl=document.getElementById('navbar') || document.getElementById('header');
let ticking=false;
window.addEventListener('scroll',()=>{
  if(!ticking){ requestAnimationFrame(()=>{ 
    if (!navEl) { ticking=false; return; }
    if (navEl.id==='navbar') navEl.classList.toggle('navbar--scrolled',window.pageYOffset>80);
    else navEl.classList.toggle('header--scrolled',window.pageYOffset>80);
    ticking=false 
  }); ticking=true }
},{passive:true});

// === MOBILE MENU TOGGLE ===
const navToggle=document.getElementById('navToggle');
const hamburger=document.getElementById('hamburger');
const navLinks=document.querySelector('.navbar__links');
const navList=document.querySelector('.nav__list');
function toggleMenu(){
  if(navLinks) navLinks.style.display=navLinks.style.display==='flex'?'none':'flex';
  if(navList) navList.style.display=navList.style.display==='flex'?'none':'flex';
  if(navToggle) navToggle.classList.toggle('navbar__toggle--active');
}
if(navToggle) navToggle.addEventListener('click',toggleMenu);
if(hamburger) hamburger.addEventListener('click',toggleMenu);
// Close menu on link click
document.querySelectorAll('.navbar__link,.nav__link').forEach(l=>l.addEventListener('click',()=>{
  if(window.innerWidth<=768){
    if(navLinks) navLinks.style.display='none';
    if(navList) navList.style.display='none';
    if(navToggle) navToggle.classList.remove('navbar__toggle--active');
  }
}));

// === THREE.JS 3D ORB ===
function initOrb(){
  const container=document.getElementById('orbContainer');
  if(!container||typeof THREE==='undefined')return;
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(45,1,.1,1000);
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
  renderer.setSize(600,600); renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  container.appendChild(renderer.domElement); camera.position.z=4;

  const mesh=new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.4,2),
    new THREE.MeshPhysicalMaterial({color:0x50e3c2,emissive:0x50e3c2,emissiveIntensity:.08,metalness:.4,roughness:.2,wireframe:true,transparent:true,opacity:.5})
  );
  scene.add(mesh);

  const inner=new THREE.Mesh(
    new THREE.SphereGeometry(.8,32,32),
    new THREE.MeshPhysicalMaterial({color:0x50e3c2,emissive:0x50e3c2,emissiveIntensity:.15,transparent:true,opacity:.15,roughness:0,metalness:0})
  );
  scene.add(inner);

  const g=new THREE.BufferGeometry();
  const p=new Float32Array(600);
  for(let i=0;i<600;i++){ const r=2+Math.random()*1.5, th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1); p[i*3]=r*Math.sin(ph)*Math.cos(th); p[i*3+1]=r*Math.sin(ph)*Math.sin(th); p[i*3+2]=r*Math.cos(ph); }
  g.setAttribute('position',new THREE.BufferAttribute(p,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({color:0x50e3c2,size:.02,transparent:true,opacity:.4}));
  scene.add(pts);

  let m3x=0,m3y=0;
  document.addEventListener('mousemove',e=>{ m3x=(e.clientX/window.innerWidth-.5)*2; m3y=-(e.clientY/window.innerHeight-.5)*2 });

  (function anim(){
    requestAnimationFrame(anim);
    mesh.rotation.x+=.003; mesh.rotation.y+=.005;
    inner.rotation.x=mesh.rotation.x*.5; inner.rotation.y=mesh.rotation.y*.5;
    pts.rotation.x+=.001; pts.rotation.y+=.002;
    mesh.position.x+=(m3x*.15-mesh.position.x)*.05; mesh.position.y+=(m3y*.15-mesh.position.y)*.05;
    pts.position.x=mesh.position.x; pts.position.y=mesh.position.y;
    renderer.render(scene,camera);
  })();
}

// === GSAP HERO ENTRANCE ===
gsap.timeline({delay:.3})
  .to('.hero__eyebrow',{opacity:1,y:0,duration:.6,ease:'power3.out'})
  .to('.hero__title .line span',{opacity:1,y:0,duration:.8,stagger:.08,ease:'power4.out'},'-=.3')
  .to('.hero__subtitle',{opacity:1,y:0,duration:.6,ease:'power3.out'},'-=.4')
  .to('.hero__actions',{opacity:1,y:0,duration:.5,ease:'power3.out'},'-=.3');

// === GSAP SCROLL REVEAL ===
document.querySelectorAll('[data-reveal]').forEach(el=>{ ScrollTrigger.create({trigger:el,start:'top 85%',onEnter:()=>el.classList.add('is-visible')}) });

// === FRAMEWORK PROGRESS ===
const fSteps=document.querySelectorAll('.framework__step'), fLine=document.querySelector('.framework__line');
fSteps.forEach((step,i)=>{
  ScrollTrigger.create({trigger:step,start:'top 75%',onEnter:()=>{
    step.classList.add('is-visible');
    gsap.to(step,{opacity:1,y:0,duration:.6,ease:'power3.out'});
    if(fLine){ const p=((i+1)/fSteps.length)*100; fLine.style.background=`linear-gradient(90deg,var(--teal) ${p}%,var(--teal-border) ${p}%)`; }
  }});
});

// === SERVICE SWITCHER ===
const svcData=[
  {title:'High-Converting Copy That Sells',desc:'Strategic copywriting crafted to speak directly to your ideal customer and drive action — not just engagement. Every word earns its place.',orb:'radial-gradient(circle at 40% 30%,rgba(80,227,194,.25),transparent 70%)',svc:'Conversion Copywriting'},
  {title:'Paid Ads That Generate ROI',desc:'Meta and Google ad campaigns built on data, not guesses. We optimize for conversions, not clicks — with full-funnel retargeting.',orb:'radial-gradient(circle at 60% 40%,rgba(80,227,194,.25),transparent 70%)',svc:'Paid Ads (Meta + Google)'},
  {title:'Lead Funnels That Convert',desc:'End-to-end funnel systems that turn cold traffic into qualified leads. Landing pages, lead magnets, email automation — on autopilot.',orb:'radial-gradient(circle at 30% 60%,rgba(80,227,194,.25),transparent 70%)',svc:'Lead-Gen Funnels'},
  {title:'SEO — Get Found on Google',desc:'Search engine optimization that drives organic traffic — on-page SEO, technical audits, local SEO, and content strategy to get your business found.',orb:'radial-gradient(circle at 50% 30%,rgba(80,227,194,.25),transparent 70%)',svc:'SEO'},
  {title:'AI Automation Systems',desc:'Custom AI workflows for lead nurturing, follow-ups, reporting, and CRM integration. Reduce manual work and scale without hiring.',orb:'radial-gradient(circle at 45% 50%,rgba(80,227,194,.25),transparent 70%)',svc:'AI Automation'},
];

const sCards=document.querySelectorAll('.switcher__card'), sTitle=document.getElementById('switcherTitle'), sDesc=document.getElementById('switcherDesc'), sOrb=document.getElementById('switcherOrb'), sCTA=document.getElementById('switcherCTA');
let curSvc=0;

function switchSvc(i){
  if(i===curSvc)return;
  sCards.forEach(c=>c.classList.remove('is-active')); sCards[i].classList.add('is-active');
  const d=svcData[i];
  gsap.timeline()
    .to(sOrb,{scale:.8,opacity:.3,rotation:-15,duration:.3,ease:'power2.in'})
    .to(sTitle,{opacity:0,y:-10,duration:.2,ease:'power2.in'},'-=.2')
    .to(sDesc,{opacity:0,y:-8,duration:.2,ease:'power2.in'},'-=.15')
    .call(()=>{ sTitle.textContent=d.title; sDesc.textContent=d.desc; sOrb.style.background=d.orb; if(sCTA) sCTA.href='contact.html?service='+encodeURIComponent(d.svc); })
    .to(sOrb,{scale:1,opacity:1,rotation:0,duration:.5,ease:'back.out(1.7)'})
    .to(sTitle,{opacity:1,y:0,duration:.4,ease:'power3.out'},'-=.3')
    .to(sDesc,{opacity:1,y:0,duration:.35,ease:'power3.out'},'-=.25');
  curSvc=i;
}
sCards.forEach((c,i)=>c.addEventListener('click',()=>switchSvc(i)));

let autoRotate=setInterval(()=>switchSvc((curSvc+1)%svcData.length),5000);
document.querySelector('.switcher__cards')?.addEventListener('mouseenter',()=>clearInterval(autoRotate));
document.querySelector('.switcher__cards')?.addEventListener('mouseleave',()=>{ autoRotate=setInterval(()=>switchSvc((curSvc+1)%svcData.length),5000) });

// === STATS COUNTERS ===
const statsSec=document.querySelector('.stats'); let cntDone=false;
if(statsSec){
  new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting&&!cntDone){
        cntDone=true;
        document.querySelectorAll('.stat__num[data-target]').forEach(c=>{
          gsap.to(c,{innerText:parseInt(c.dataset.target,10),duration:2,ease:'power3.out',snap:{innerText:1},onUpdate:()=>{ c.textContent=Math.round(c.textContent) }});
        });
      }
    });
  },{threshold:.3}).observe(statsSec);
}

// === INIT ===
initOrb();
