(function(){"use strict";
var d=document, b=d.body, home=b.hasAttribute('data-home'),
    reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* mobile menu */
var burger=d.getElementById('burger'), mnav=d.getElementById('mnav');
if(burger&&mnav){
  burger.addEventListener('click',function(){
    var open=burger.getAttribute('aria-expanded')==='true';
    burger.setAttribute('aria-expanded',String(!open)); mnav.classList.toggle('open',!open);
  });
  mnav.addEventListener('click',function(e){ if(e.target.closest('a')){ burger.setAttribute('aria-expanded','false'); mnav.classList.remove('open'); } });
  addEventListener('keydown',function(e){ if(e.key==='Escape'){ burger.setAttribute('aria-expanded','false'); mnav.classList.remove('open'); } });
}

/* nav state, progress, back-to-top (home page runs its own) */
if(!home){
  var nav=d.getElementById('nav'), prog=d.getElementById('prog'), topBtn=d.getElementById('topBtn'), t=false;
  var fr=function(){ var y=scrollY, h=d.documentElement.scrollHeight-innerHeight;
    if(prog) prog.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';
    if(nav) nav.classList.toggle('stuck',y>20); if(topBtn) topBtn.classList.toggle('on',y>800); t=false; };
  addEventListener('scroll',function(){ if(!t){ requestAnimationFrame(fr); t=true; } },{passive:true}); fr();
  if(topBtn) topBtn.addEventListener('click',function(){ scrollTo({top:0,behavior:reduce?'auto':'smooth'}); });
}

/* reveals: .rise (non-home), .hdiv and .ink everywhere */
var sel=home?'.hdiv,.ink':'.rise,.hdiv,.ink';
if('IntersectionObserver' in window && !reduce){
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  d.querySelectorAll(sel).forEach(function(el){ if(!el.classList.contains('in')) io.observe(el); });
} else { d.querySelectorAll(sel).forEach(function(el){ el.classList.add('in'); }); }

/* FAQ (home runs its own) */
if(!home) d.querySelectorAll('.q').forEach(function(btn){
  btn.addEventListener('click',function(){
    var qa=btn.parentElement, p=qa.querySelector('.a'), open=qa.classList.contains('open');
    d.querySelectorAll('.qa.open').forEach(function(o){ o.classList.remove('open'); o.querySelector('.q').setAttribute('aria-expanded','false'); o.querySelector('.a').style.maxHeight=''; });
    if(!open){ qa.classList.add('open'); btn.setAttribute('aria-expanded','true'); p.style.maxHeight=p.scrollHeight+'px'; }
  });
});

/* email links assembled at runtime */
d.querySelectorAll('a.eml[data-a]').forEach(function(a){
  try{ var ad=atob(a.getAttribute('data-a'))+String.fromCharCode(64)+atob(a.getAttribute('data-b'));
    a.href='mailto:'+ad; if(a.getAttribute('data-show')) a.textContent=ad; }catch(ig){}
});

/* drifting hearts */
var hf=d.querySelector('.hfloat');
if(hf && !reduce){
  var cols=['#F5177F','#FF6B6B','#FFC93C','#7C3AED','#1FB6F0'], n=innerWidth<700?7:12, h='';
  for(var i=0;i<n;i++){
    var s=10+Math.random()*18, c=cols[i%cols.length];
    h+='<i style="left:'+(Math.random()*100).toFixed(1)+'%;--s:'+s.toFixed(0)+'px;--d:'+(16+Math.random()*16).toFixed(1)+'s;--w:-'+(Math.random()*24).toFixed(1)+'s;--x:'+(Math.random()*80-40).toFixed(0)+'px"><svg viewBox="0 0 24 22"><path d="M12 21S1.5 14.2 1.5 7.4A5.4 5.4 0 0 1 12 4.3a5.4 5.4 0 0 1 10.5 3.1C22.5 14.2 12 21 12 21Z" fill="none" stroke="'+c+'" stroke-width="1.8"/></svg></i>';
  }
  hf.innerHTML=h;
}

/* heart constellation canvas */
var cv=d.getElementById('heartfield');
if(cv && cv.getContext){
  var ctx=cv.getContext('2d'), dpr=Math.min(devicePixelRatio||1,2), W=0, H=0, pts=[], outer=[], mx=-9999, my=-9999, run=true, raf=0;
  var heart=function(t){ return [16*Math.pow(Math.sin(t),3), -(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))]; };
  var build=function(){
    var r=cv.getBoundingClientRect(); W=r.width; H=r.height; if(!W||!H) return;
    cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); ctx.setTransform(dpr,0,0,dpr,0,0);
    var sc=Math.min(W,H)/40, cx=W/2, cy=H/2-sc*1.5, N=W<500?64:96; pts=[]; outer=[];
    var rings=[[1,N],[0.68,Math.round(N*.55)],[0.38,Math.round(N*.3)]];
    rings.forEach(function(rg,ri){ for(var i=0;i<rg[1];i++){
      var tt=(i/rg[1])*Math.PI*2+ri*.2, p=heart(tt), k=rg[0];
      var x=cx+p[0]*sc*k, y=cy+p[1]*sc*k;
      var o={tx:x,ty:y,x:x+(Math.random()-.5)*80,y:y+(Math.random()-.5)*80,ph:Math.random()*6.28,r:ri===0?2:1.4,c:i/rg[1],ring:ri};
      pts.push(o); if(ri===0) outer.push(o);
    }});
  };
  var draw=function(time){
    ctx.clearRect(0,0,W,H); var tm=(time||0)/1000;
    for(var i=0;i<pts.length;i++){ var p=pts[i];
      var ox=Math.cos(tm*.7+p.ph)*2.2, oy=Math.sin(tm*.9+p.ph)*2.2, dx=p.x-mx, dy=p.y-my, dd=dx*dx+dy*dy;
      var gx=p.tx+ox, gy=p.ty+oy; if(dd<9000){ var f=(9000-dd)/9000*18; gx+=dx/Math.sqrt(dd+1)*f; gy+=dy/Math.sqrt(dd+1)*f; }
      p.x+=(gx-p.x)*.06; p.y+=(gy-p.y)*.06; }
    if(outer.length){ var gr=ctx.createLinearGradient(0,0,W,0); gr.addColorStop(0,'rgba(124,58,237,.55)'); gr.addColorStop(.5,'rgba(245,23,127,.6)'); gr.addColorStop(1,'rgba(255,107,107,.55)');
      ctx.strokeStyle=gr; ctx.lineWidth=1.6; ctx.beginPath(); ctx.moveTo(outer[0].x,outer[0].y); for(var q0=1;q0<outer.length;q0++) ctx.lineTo(outer[q0].x,outer[q0].y); ctx.closePath(); ctx.stroke(); }
    for(i=0;i<pts.length;i++){ for(var j=i+1;j<pts.length;j++){
      var a=pts[i], c=pts[j], ddx=a.x-c.x, ddy=a.y-c.y, dist=ddx*ddx+ddy*ddy;
      if(dist<2200 && a.ring!==c.ring){ var al=(1-dist/2200)*.4; ctx.strokeStyle='rgba('+Math.round(245-120*a.c)+','+Math.round(23+35*a.c)+','+Math.round(127+110*a.c)+','+al.toFixed(3)+')'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(c.x,c.y); ctx.stroke(); } } }
    for(i=0;i<pts.length;i++){ var q=pts[i], tw=.65+.35*Math.sin(tm*1.3+q.ph);
      ctx.fillStyle='rgba('+Math.round(245-120*q.c)+','+Math.round(23+35*q.c)+','+Math.round(127+110*q.c)+','+tw.toFixed(2)+')';
      ctx.beginPath(); ctx.arc(q.x,q.y,q.r,0,6.284); ctx.fill(); }
    if(run && !reduce) raf=requestAnimationFrame(draw);
  };
  build();
  if(reduce){ pts.forEach(function(p){ p.x=p.tx; p.y=p.ty; }); draw(0); }
  else {
    raf=requestAnimationFrame(draw);
    if('IntersectionObserver' in window){ new IntersectionObserver(function(es){ es.forEach(function(e){ run=e.isIntersecting; if(run){ cancelAnimationFrame(raf); raf=requestAnimationFrame(draw);} }); }).observe(cv); }
    cv.parentElement.addEventListener('pointermove',function(e){ var r=cv.getBoundingClientRect(); mx=e.clientX-r.left; my=e.clientY-r.top; },{passive:true});
    cv.parentElement.addEventListener('pointerleave',function(){ mx=my=-9999; });
  }
  var rt; addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(function(){ build(); if(reduce){ pts.forEach(function(p){p.x=p.tx;p.y=p.ty;}); draw(0);} },150); });
}

/* lead forms (Lead Net) */
d.querySelectorAll('form[data-lead]').forEach(function(form){
  var msg=form.querySelector('.form-msg'), send=form.querySelector('[type=submit]'), born=Date.now(), touched=false;
  ['keydown','pointerdown'].forEach(function(t){ form.addEventListener(t,function(){ touched=true; },{once:true}); });
  form.addEventListener('submit',function(e){
    e.preventDefault(); msg.textContent=''; msg.classList.remove('ok');
    var stop=function(m){ msg.textContent=m; };
    if((form._honey&&form._honey.value)||(form.website&&form.website.value)) return;
    if(Date.now()-born<3500||!touched) return stop('Give the form a moment, then send again.');
    var req=form.querySelectorAll('[required]');
    for(var i=0;i<req.length;i++){ var el=req[i]; if(el.type==='checkbox'?!el.checked:!el.value.trim()){ el.focus(); return stop(el.getAttribute('data-err')||'Please fill in the required fields.'); } }
    var em=form.querySelector('[type=email]'); if(em && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim())) return stop('That email address does not look right.');
    var bodyEl=form.querySelector('textarea'); if(bodyEl && (bodyEl.value.match(/https?:\/\/|www\.|\[url|<a\s/gi)||[]).length>1) return stop('Please take the links out before sending.');
    var key='apal_'+(form.id||'f');
    try{ var last=parseInt(localStorage.getItem(key)||'0',10); if(Date.now()-last<3600000) return stop('You already sent one in the last hour. Use the contact page if you need to send another.'); }catch(ig){}
    var p=new URLSearchParams(), fd=new FormData(form), lines=[];
    fd.forEach(function(v,k){ if(k==='_honey'||k==='website') return; p.append(k,v); if(k.charAt(0)!=='_') lines.push(k.replace(/_/g,' ')+': '+v); });
    p.append('page',location.href); p.append('dwell',Math.round((Date.now()-born)/1000)+'s'); p.append('message',lines.join('\n'));
    var url; try{ url=atob(form.getAttribute('data-l1'))+atob(form.getAttribute('data-l2')); }catch(ig){ return stop('Something went wrong. Please try again later.'); }
    var html=send.innerHTML; send.disabled=true; send.innerHTML='Sending…';
    fetch(url,{method:'POST',headers:{Accept:'application/json'},body:p})
      .then(function(r){ return r.text().then(function(t){ var j={}; try{ j=JSON.parse(t); }catch(ig){} if(!r.ok||j.ok===false||j.success===false) throw new Error('x'); return j; }); })
      .then(function(){ try{ localStorage.setItem(key,String(Date.now())); }catch(ig){} msg.classList.add('ok'); msg.textContent=form.getAttribute('data-ok')||'Sent. Thank you.'; form.reset(); send.innerHTML=html; send.disabled=false; if(typeof gtag==='function') try{ gtag('event','generate_lead',{form_id:form.id}); }catch(ig){} })
      .catch(function(){ msg.textContent='That did not go through. Please try again in a few minutes, or use the contact page.'; send.disabled=false; send.innerHTML=html; });
  });
});
})();
