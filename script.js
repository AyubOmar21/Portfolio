/* ===== YOUR EMAIL: put your address here (used by the footer link and the collaborate form) ===== */
var CONTACT_EMAIL='ayubomar2005@gmail.com';

(function(){
  var b=document.getElementById('burger'),m=document.getElementById('menu'),o=document.getElementById('scrim');
  function set(open){m.classList.toggle('open',open);o.classList.toggle('open',open);b.setAttribute('aria-expanded',open);b.setAttribute('aria-label',open?'Close menu':'Open menu');document.body.style.overflow=open?'hidden':''}
  b.addEventListener('click',function(){set(b.getAttribute('aria-expanded')!=='true')});
  o.addEventListener('click',function(){set(false)});
  m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){set(false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});
  matchMedia('(min-width:861px)').addEventListener('change',function(){set(false)});
})();

/* ===== SCROLL REVEAL (plays once, when ~40% of a section is in view) ===== */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sections=document.querySelectorAll('[data-reveal]');

  sections.forEach(function(sec){
    var step=parseFloat(sec.dataset.step)||.25;
    sec.querySelectorAll('[data-a]').forEach(function(el){
      el.style.setProperty('--d',(.1+(parseFloat(el.dataset.o)||0)*step).toFixed(2)+'s');
      el.addEventListener('transitionend',function(e){
        if(e.target===el&&e.propertyName==='opacity')el.classList.add('done');
      });
    });
  });

  /* typed heading: full text stays in layout (hidden) so nothing jumps */
  var typers=[];
  if(!reduce){
    document.querySelectorAll('[data-type]').forEach(function(h){
      var text=h.textContent.trim();
      h.setAttribute('aria-label',text);
      h.textContent='';
      var wrap=document.createElement('span');wrap.setAttribute('aria-hidden','true');
      var tv=document.createElement('span');
      var caret=document.createElement('span');caret.className='caret off';
      var th=document.createElement('span');th.style.visibility='hidden';th.textContent=text;
      wrap.appendChild(tv);wrap.appendChild(caret);wrap.appendChild(th);h.appendChild(wrap);
      h._type=function(done){
        var i=0;caret.classList.remove('off');
        (function tick(){
          i++;tv.textContent=text.slice(0,i);th.textContent=text.slice(i);
          if(i<text.length){setTimeout(tick,55)}
          else{done();setTimeout(function(){caret.classList.add('off')},1200)}
        })();
      };
    });
  }

  function reveal(sec){
    var h=sec.querySelector('[data-type]');
    if(h&&h._type){h._type(function(){setTimeout(function(){sec.classList.add('in')},150)})}
    else sec.classList.add('in');
  }

  if(reduce||!('IntersectionObserver' in window)){
    sections.forEach(function(s){s.classList.add('in')});
    return;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting)return;
      /* 40% of the section, or 40% of the screen for sections taller than that */
      var enough=e.intersectionRatio>=.4||e.intersectionRect.height>=innerHeight*.4;
      if(enough){reveal(e.target);io.unobserve(e.target)}
    });
  },{threshold:[0,.1,.2,.3,.4,.5,.6,.8,1]});
  sections.forEach(function(s){io.observe(s)});
})();

/* ===== LIGHTBOX (click an image to enlarge) ===== */
(function(){
  var imgs=[].slice.call(document.querySelectorAll('img.zoom'));
  if(!imgs.length)return;
  var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');
  lb.innerHTML='<button class="x" aria-label="Close">&times;</button><button class="pv" aria-label="Previous">&lsaquo;</button><img alt=""><button class="nx" aria-label="Next">&rsaquo;</button>';
  document.body.appendChild(lb);
  var big=lb.querySelector('img'),i=0;
  function show(n){i=(n+imgs.length)%imgs.length;big.src=imgs[i].currentSrc||imgs[i].src;big.alt=imgs[i].alt}
  function open(n){show(n);lb.classList.add('open');document.body.style.overflow='hidden';lb.querySelector('.x').focus()}
  function close(){lb.classList.remove('open');document.body.style.overflow=''}
  imgs.forEach(function(im,n){
    im.addEventListener('click',function(){open(n)});
    im.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open(n)}});
  });
  lb.querySelector('.x').addEventListener('click',close);
  lb.querySelector('.pv').addEventListener('click',function(){show(i-1)});
  lb.querySelector('.nx').addEventListener('click',function(){show(i+1)});
  lb.addEventListener('click',function(e){if(e.target===lb)close()});
  document.addEventListener('keydown',function(e){
    if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')close();
    if(e.key==='ArrowLeft')show(i-1);
    if(e.key==='ArrowRight')show(i+1);
  });
})();

/* ===== COLLABORATE DROPDOWN (footer "Let's collaborate" button) ===== */
(function(){
  var btn=document.querySelector('.final .btn');
  if(!btn)return;
  var groups=[
    {q:'What do you need?',k:'Need',o:['Brand identity','UX &amp; UI design','Web &amp; app design','Something else']},
    {q:'When would you like it?',k:'Timing',o:['As soon as possible','In a month or two','Just exploring']}
  ];
  var html='<div><div class="collab-card">';
  groups.forEach(function(g,n){
    html+='<p class="q" id="collab-q'+n+'">'+g.q+'</p><div class="chips" role="group" aria-labelledby="collab-q'+n+'" data-k="'+g.k+'">'+
      g.o.map(function(t){return '<button type="button" class="chip" aria-pressed="false">'+t+'</button>'}).join('')+'</div>';
  });
  html+='<details class="note" open><summary>Add a note about your project</summary><textarea aria-label="Note about your project" placeholder="What is the project for? Who is it for? Anything you already know you need?"></textarea></details>'+
    '<div class="send"><button type="button" class="btn primary" id="collab-send">Email me this brief <span>&rarr;</span></button><p class="hint">Opens your email app. Nothing is sent until you press send.</p></div>'+
    '<div class="own"><span class="own-l">Or write it yourself</span><a class="own-a" id="collab-mail"><span></span><span aria-hidden="true">&#8599;</span></a><button type="button" class="btn copy" id="collab-copy">Copy email</button></div></div></div>';

  var panel=document.createElement('div');
  panel.className='collab';panel.id='collab';panel.setAttribute('inert','');panel.innerHTML=html;
  btn.parentNode.appendChild(panel);
  btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls','collab');

  function setOpen(open){
    panel.classList.toggle('open',open);
    if(open)panel.removeAttribute('inert');else panel.setAttribute('inert','');
    btn.setAttribute('aria-expanded',open);
    if(open)setTimeout(function(){panel.scrollIntoView({behavior:'smooth',block:'nearest'})},900);
  }
  btn.addEventListener('click',function(e){e.preventDefault();setOpen(!panel.classList.contains('open'))});
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&panel.classList.contains('open')&&panel.contains(document.activeElement)){setOpen(false);btn.focus()}
  });

  panel.querySelectorAll('.chips').forEach(function(box){
    box.addEventListener('click',function(e){
      var chip=e.target.closest('.chip');if(!chip)return;
      var on=chip.getAttribute('aria-pressed')==='true';
      box.querySelectorAll('.chip').forEach(function(c){c.setAttribute('aria-pressed','false')});
      if(!on)chip.setAttribute('aria-pressed','true');
    });
  });

  var mail=document.getElementById('collab-mail');
  mail.href='mailto:'+CONTACT_EMAIL;mail.firstChild.textContent=CONTACT_EMAIL;
  var copy=document.getElementById('collab-copy');
  copy.addEventListener('click',function(){
    function done(){copy.textContent='Copied';setTimeout(function(){copy.textContent='Copy email'},2000)}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(CONTACT_EMAIL).then(done,function(){})}
    else{var t=document.createElement('textarea');t.value=CONTACT_EMAIL;document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(e){}t.remove()}
  });

  document.getElementById('collab-send').addEventListener('click',function(){
    var lines=[];
    panel.querySelectorAll('.chips').forEach(function(box){
      var on=box.querySelector('.chip[aria-pressed="true"]');
      lines.push(box.dataset.k+': '+(on?on.textContent:'Not specified'));
    });
    var note=panel.querySelector('textarea').value.trim();
    if(note)lines.push('','Note:',note);
    location.href='mailto:'+CONTACT_EMAIL+'?subject='+encodeURIComponent('Project enquiry')+'&body='+encodeURIComponent(lines.join('\n'));
  });
})();