const qs=(s,p=document)=>p.querySelector(s),qsa=(s,p=document)=>[...p.querySelectorAll(s)];
const body=document.body;

const flagMap={
  'English':'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#012169"/><path d="M0 0l24 16M24 0L0 16" stroke="#fff" stroke-width="3"/></svg>',
  'Deutsch':'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#000"/><rect y="5.3" width="24" height="5.3" fill="#d00"/><rect y="10.6" width="24" height="5.4" fill="#ffce00"/></svg>',
  'Français':'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="8" height="16" fill="#0055a4"/><rect x="8" width="8" height="16" fill="#fff"/><rect x="16" width="8" height="16" fill="#ef4135"/></svg>',
  'Español':'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#c60b1e"/><rect y="4" width="24" height="8" fill="#ffc400"/></svg>',
  'Italiano':'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="8" height="16" fill="#009246"/><rect x="8" width="8" height="16" fill="#fff"/><rect x="16" width="8" height="16" fill="#ce2b37"/></svg>',
  'Türkçe':'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#e30a17"/><circle cx="10" cy="8" r="4" fill="#fff"/><circle cx="11" cy="8" r="3.2" fill="#e30a17"/></svg>',
  'Português':'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="10" height="16" fill="#006633"/><rect x="10" width="14" height="16" fill="#ff0000"/></svg>',
  '日本語':'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" fill="#fff"/><circle cx="12" cy="8" r="4" fill="#bc002d"/></svg>',
  'Slovenčina':'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="5.3" fill="#fff"/><rect y="5.3" width="24" height="5.3" fill="#0b4ea2"/><rect y="10.6" width="24" height="5.4" fill="#ee1c25"/></svg>',
  'Nederlands':'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="5.3" fill="#ae1c28"/><rect y="5.3" width="24" height="5.3" fill="#fff"/><rect y="10.6" width="24" height="5.4" fill="#21468b"/></svg>',
  'Belgium':'<svg viewBox="0 0 24 16" aria-hidden="true"><rect width="8" height="16" fill="#000"/><rect x="8" width="8" height="16" fill="#ffe936"/><rect x="16" width="8" height="16" fill="#ef3340"/></svg>'
};

qsa('.lang-menu a').forEach(a=>{const txt=a.textContent.trim();if(flagMap[txt])a.insertAdjacentHTML('afterbegin',flagMap[txt]);});

qsa('.lang-pill').forEach(btn=>{btn.addEventListener('click',()=>btn.parentElement.classList.toggle('open'));});
document.addEventListener('click',e=>{if(!e.target.closest('.lang-wrap'))qsa('.lang-wrap').forEach(w=>w.classList.remove('open'));});

const drawer=qs('.mobile-drawer'),burger=qs('.burger'),closeBtn=qs('.close-drawer');
let lastFocus=null;
const focusables='a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])';
function trap(container,e){const nodes=qsa(focusables,container);if(!nodes.length)return;const first=nodes[0],last=nodes[nodes.length-1];if(e.key==='Tab'){if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}
function openDrawer(){lastFocus=document.activeElement;drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');body.style.overflow='hidden';qsa(focusables,drawer)[0]?.focus();}
function closeDrawer(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');body.style.overflow='';lastFocus?.focus();}
burger?.addEventListener('click',openDrawer);closeBtn?.addEventListener('click',closeDrawer);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDrawer();closeModal();}if(drawer.classList.contains('open'))trap(drawer,e);if(modal?.classList.contains('show'))trap(modalPanel,e);});
document.addEventListener('click',e=>{if(drawer.classList.contains('open')&&!e.target.closest('.mobile-drawer')&&!e.target.closest('.burger'))closeDrawer();});

const slider=qs('.months-slider'),pill=qs('.months-pill');
const low=qs('.low-val'),base=qs('.base-val'),high=qs('.high-val');
let amount=10000;
const locale=body.dataset.locale||'en-US';
const currency=body.dataset.currency||'USD';
const unit=(pill?.textContent.trim().split(' ').slice(1).join(' '))||'months';
function fmt(v){return new Intl.NumberFormat(locale,{style:'currency',currency,maximumFractionDigits:0}).format(v)}
function calc(){const m=Number(slider?.value||12);if(pill)pill.textContent=`${m} ${unit}`;if(low)low.textContent=fmt(amount*Math.pow(1.08,m));if(base)base.textContent=fmt(amount*Math.pow(1.115,m));if(high)high.textContent=fmt(amount*Math.pow(1.15,m));}
qsa('.seg-btn').forEach(b=>b.addEventListener('click',()=>{qsa('.seg-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');amount=Number(b.dataset.amount);calc();}));
slider?.addEventListener('input',calc);calc();

const modal=qs('.modal'),modalPanel=qs('.modal-panel');
function openModal(){modal.classList.add('show');modal.setAttribute('aria-hidden','false');body.style.overflow='hidden';qs('.modal-x')?.focus();}
function closeModal(){modal?.classList.remove('show');modal?.setAttribute('aria-hidden','true');if(!drawer.classList.contains('open'))body.style.overflow='';}
qs('.privacy-open')?.addEventListener('click',openModal);qs('.modal-x')?.addEventListener('click',closeModal);qs('.modal-close')?.addEventListener('click',closeModal);
modal?.addEventListener('click',e=>{if(e.target===modal)closeModal();});

const io=new IntersectionObserver((entries)=>entries.forEach(x=>x.isIntersecting&&x.target.classList.add('in')),{threshold:.1});
qsa('main section').forEach(s=>{s.classList.add('reveal');io.observe(s)});
qsa('.faq-list details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)qsa('.faq-list details').forEach(o=>o!==d&&(o.open=false));}));
