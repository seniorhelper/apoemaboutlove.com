(function(){"use strict";
var $=function(id){return document.getElementById(id);};
var form=$('genForm'); if(!form) return;
var out=$('genOut'), titleEl=$('genTitle'), card=$('genCard'), last=null;
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function clean(s,max){return (s||'').replace(/[<>]/g,'').replace(/\s+/g,' ').trim().slice(0,max||40);}

var SEASON={spring:['the first warm rain','lilacs on the fence','mud on our boots'],summer:['long light at nine p.m.','the screen door slamming','sunburned shoulders'],
  autumn:['leaves on the windshield','the first cold morning','a sweater that smells like woodsmoke'],winter:['frost on the glass','snow on the porch rail','two mugs steaming']};

var FREE={
 sweet:{open:['{N}, I keep a list of small things about you.','There is a version of every day that only {N} knows about.','I wasn\'t looking for anyone, {N}. Then you laughed at the wrong part of the movie.'],
   mid:['Like the way you {H},\nlike you don\'t know anyone is watching.\nI am always watching.','I remember {P},\nand how you said my name there\nlike it was something worth keeping.','Some mornings it\'s {S},\nand you\'re still half asleep,\nand I think: this. This is the whole thing.'],
   close:['Of everything I\'ve ever been given,\nyou are the one I\'d save from a fire.','I don\'t need the moon.\nI need you on the couch, asking how my day was.','If love is a place, {N},\nI know the way there now. It\'s you.']},
 deep:{open:['Before you, {N}, I thought I knew what quiet was.','I have tried to write this for years, {N}, and every draft comes back to your name.','There are rooms in me nobody had walked into, {N}, until you.'],
   mid:['You {H},\nand something in me that was braced for winter\nfinally sets the shovel down.','We went back to {P} once,\nand it was smaller than I remembered,\nbut you were exactly the same size: everything.','In {S}\nI watched you and understood\nthat being known is a kind of being saved.'],
   close:['Whatever I become, I want to become it next to you.','I am not afraid of growing old.\nI am only afraid of doing it without you.','You are the answer to a question\nI didn\'t know I was asking my whole life.']},
 playful:{open:['{N}, you steal the blankets. I\'ve made my peace with it.','Breaking news, {N}: I\'m still not over you, and it\'s been a while.','{N}, let\'s be honest, you are terrible at parallel parking and I adore you.'],
   mid:['You {H}\nand think nobody notices.\nI notice. I\'ve made a whole hobby of it.','Remember {P}?\nYou swore you knew a shortcut.\nWe are still, technically, on that shortcut.','It\'s {S},\nyou\'re humming the wrong words to a song,\nand I\'m too in love to correct you.'],
   close:['Anyway. I\'d pick you. I\'d pick you every time,\neven with the blankets.','So here\'s my plan: grow old, get louder, love you more.','You\'re my favorite notification.']},
 vow:{open:['{N}, today I\'m not making a promise. I\'m keeping one I made a long time ago.','{N}, I come to you with everything I am, and everything I\'m still learning to be.','{N}, they say a vow is just words. Mine are the most important ones I\'ll ever say.'],
   mid:['I promise to notice when you {H},\nand to love it on the hundredth day like the first.','I promise to remember {P},\nand to keep making places that are only ours.','I promise winters and summers, {S} and all the rest,\nthe easy years and the ones that ask more of us.'],
   close:['Here is my hand. Not for a season. For the whole long weather of us.','I choose you. Today, and every ordinary morning after.','Whatever comes, you will never face it alone. That\'s my vow.']},
 anniversary:{open:['Another year, {N}, and I\'d do every day of it again.','{N}, we\'ve been at this a while now, and I\'m still not finished being amazed by you.','Look at us, {N}: still here, still choosing.'],
   mid:['You still {H},\nand I still pretend I don\'t find it the best part of my day.','We started at {P},\nback when we didn\'t know the way to anything.','This year it was {S},\nand burnt toast, and bills, and your hand in mine through all of it.'],
   close:['Here\'s to the next one, and the one after that.','The best thing I ever did was say yes to you. The second best is every day since.','I would marry you again tomorrow. Probably at breakfast.']},
 distance:{open:['{N}, there are miles between us and I\'ve started to resent geography.','It\'s night where I am, {N}, and morning where you are, and I love you in both.','{N}, I keep turning to show you things that you\'re too far away to see.'],
   mid:['I miss the way you {H}.\nI didn\'t know you could miss something that small this much.','I think about {P},\nand count the days until it\'s us again.','It\'s {S} here.\nI hope it\'s something good where you are.'],
   close:['Every mile is just a little more road on the way back to you.','Same moon. Same promise. Coming home soon.','Distance is just a measurement. This is something else.']}
};

var RHYME={
 sweet:[['You make the ordinary shine,','I\'m grateful every day you\'re mine.'],['The coffee\'s warm, the morning\'s new,','and every good thing starts with you.'],['I didn\'t know a heart could hold','so much, and never once grow old.'],['Through every kind of weather, dear,','the best part of my day is here.']],
 deep:[['I searched for years and didn\'t know','the thing I searched for had a glow.'],['When all the noise of life is gone,','your love\'s the light I travel on.'],['You found the parts I kept inside','and gave them somewhere safe to hide.'],['If all I am should fade to dust,','I\'ll still have loved you. That\'s enough.']],
 playful:[['You hog the blankets every night,','but holding you just feels so right.'],['You sing off-key, you lose your keys,','and still you bring me to my knees.'],['You\'re late, you\'re loud, you eat my fries,','and I\'m in love. Surprise, surprise.'],['I\'d share my snacks, I\'d share my seat,','that\'s how I know you are my sweet.']],
 vow:[['I promise you the good and gray,','the lucky and the hardest day.'],['I\'ll keep the porch light burning bright','so you can always find the light.'],['Whatever storms the years may bring,','you\'ll be my one and only thing.'],['Today I give my word to you:','in all I am, I will be true.']],
 anniversary:[['Another year, another page,','our love gets better with its age.'],['We\'ve weathered more than we had planned,','and still I reach to hold your hand.'],['The years have only made it clear:','my favorite place is with you, here.'],['From then to now, from now to then,','I\'d choose you every time again.']],
 distance:[['The miles are long, the nights are too,','but every road leads back to you.'],['I count the days, I count the hours,','till I can bring you all the flowers.'],['The same moon shines on both of us,','I hold that close and never fuss.'],['Though far apart, we\'re not alone,','your voice is how I find my home.']]
};

var HAIKU={spring:[['Rain on the window,','your coat beside mine, still wet,','we are both home now.'],['Lilacs by the fence,','you tuck one behind my ear,','spring decides to stay.']],
 summer:[['Long light after nine,','your bare feet on the porch rail,','fireflies keep time.'],['Sunburned and laughing,','we share one cold glass of tea,','the day forgets dusk.']],
 autumn:[['Leaves on the windshield,','you write my name in the frost,','October, you stay.'],['Your sweater, my chair,','woodsmoke and an open book,','fall fits us like this.']],
 winter:[['Snow on the porch rail,','two mugs and one blanket, warm,','let the wind complain.'],['Frost on the window,','you draw a heart with one hand,','I keep it till spring.']]};

var ACRO={A:['Always the first face I look for in a room,','All my best days have your fingerprints on them,'],B:['Beside you, even the waiting rooms feel warm,','Because of you, I believe in mornings again,'],C:['Coffee for two and nowhere we need to be,','Close enough to hear you breathing, that\'s my heaven,'],D:['Dancing badly in the kitchen after midnight,','Days get softer when you are in them,'],E:['Every road I take bends back toward you,','Even the rain sounds like a song when you\'re here,'],F:['Forever sounded too long, until I met you,','Finding you was the luckiest wrong turn I ever took,'],G:['Gentle in a world that so rarely is,','Grateful, every single day, that you said yes,'],H:['Home is wherever you set your keys down,','Holding your hand still feels like the first time,'],I:['In every crowd, I only ever see you,','I\'d choose you on the hardest day, and the easy ones,'],J:['Just the sound of your laugh fixes most things,','Joy, for me, mostly looks like you,'],K:['Kind in the small ways nobody sees,','Keeping my heart safe like it\'s something rare,'],L:['Laughing until we can\'t breathe on a Tuesday,','Love, for me, has always had your name,'],M:['Make me coffee and I\'ll love you forever,','My favorite place in the world is next to you,'],N:['Never once have you made me feel small,','Nothing in my life makes sense the way you do,'],O:['Only you know what I mean when I go quiet,','Out of all the people in the world, you,'],P:['Patient with me when I\'m not patient with myself,','Partners in everything, especially the dishes,'],Q:['Quiet evenings are my favorite kind with you,','Quick to forgive and slow to let go,'],R:['Right here is where I want to grow old,','Reaching for your hand without even looking,'],S:['Soft spoken, and the strongest person I know,','Sunday mornings were made for the two of us,'],T:['Two cups, two coats, one porch light on,','Truly, you are the best thing that ever happened to me,'],U:['Under every ordinary day is you, holding it up,','Unfinished stories are my favorite, as long as they\'re ours,'],V:['Very simply, I would choose you again,','Velvet voice at the end of a long day,'],W:['Wherever you are is where I want to be,','Warm hands, warm heart, a warm place to land,'],X:['eXactly the person I hoped existed,','eXtra fries, extra love, extra everything with you,'],Y:['You are the yes I never stop saying,','Years from now, I\'ll still be looking at you like this,'],Z:['Zero regrets, a hundred reasons, one you,','Zigzag road, and you right beside me,']};

function fill(s,d){return s.replace(/\{N\}/g,d.name).replace(/\{H\}/g,d.habit).replace(/\{P\}/g,d.place).replace(/\{S\}/g,d.seasonLine);}

function generate(){
  var d={name:clean(form.their.value,30)||'my love',me:clean(form.me.value,30),tone:form.tone.value,form:form.shape.value,season:form.season.value,
    habit:clean(form.habit.value,60)||'hum while you cook',place:clean(form.place.value,40)||'that little diner by the highway'};
  d.habit=d.habit.replace(/^(you|she|he|they)\s+/i,'');
  d.seasonLine=pick(SEASON[d.season]);
  var lines=[], title='';
  if(d.form==='free'){
    var t=FREE[d.tone]; lines=[fill(pick(t.open),d),'',fill(pick(t.mid),d),'',fill(pick(t.close),d)];
    title=pick(['For '+d.name,'What I Mean, '+d.name,'A Poem for '+d.name,'Still You']);
  } else if(d.form==='rhyme'){
    var r=shuffle(RHYME[d.tone]).slice(0,3);
    lines=[d.name+',']; r.forEach(function(c,i){ lines.push(c[0]); lines.push(c[1]); if(i<2) lines.push(''); });
    title=pick(['A Rhyme for '+d.name,'Little Song for '+d.name,'To '+d.name]);
  } else if(d.form==='haiku'){
    var hk=HAIKU[d.season].concat(shuffle([HAIKU.spring,HAIKU.summer,HAIKU.autumn,HAIKU.winter].map(function(x){return x[0];})).slice(0,1));
    hk=shuffle(hk).slice(0,2);
    hk.forEach(function(h,i){ lines=lines.concat(h); if(i<hk.length-1) lines.push(''); });
    lines.push(''); lines.push('(for '+d.name+')');
    title='Haiku for '+d.name;
  } else {
    var letters=d.name.toUpperCase().replace(/[^A-Z]/g,'').slice(0,14)||'LOVE';
    for(var i=0;i<letters.length;i++){ lines.push(pick(ACRO[letters[i]])); }
    lines[lines.length-1]=lines[lines.length-1].replace(/,$/,'.');
    title=letters.split('').join('.')+'.';
  }
  if(d.me){ lines.push(''); lines.push('— '+d.me); }
  last={title:title,text:lines.join('\n'),acro:d.form==='acro'};
  render();
}
function render(){
  titleEl.textContent=last.title; out.innerHTML='';
  var ls=last.text.split('\n'), reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  ls.forEach(function(l,i){ var s=document.createElement('span'); s.className='gl';
    if(last.acro && l && l.charAt(0)!=='—'){ var b=document.createElement('b'); b.textContent=l.charAt(0); s.appendChild(b); s.appendChild(document.createTextNode(l.slice(1))); }
    else s.textContent=l||' ';
    if(!reduce){ s.style.animationDelay=(i*0.09)+'s'; } out.appendChild(s); });
  card.hidden=false; card.classList.remove('pop'); void card.offsetWidth; card.classList.add('pop');
  if(innerWidth<900) card.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
  try{ gtag('event','poem_generated',{form:form.shape.value,tone:form.tone.value}); }catch(e){}
}
form.addEventListener('submit',function(e){ e.preventDefault(); generate(); });
$('genAgain').addEventListener('click',generate);
$('genCopy').addEventListener('click',function(){ if(!last) return; var b=this, t=last.title+'\n\n'+last.text+'\n\nmade at apoemaboutlove.com';
  (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){ b.textContent='Copied ✓'; setTimeout(function(){ b.textContent='Copy'; },1500); }).catch(function(){ b.textContent='Select the text to copy'; }); });
$('genPrint').addEventListener('click',function(){ window.print(); });
$('genImg').addEventListener('click',function(){
  if(!last) return; var W=1080,H=1350,c=document.createElement('canvas'); c.width=W; c.height=H; var x=c.getContext('2d');
  var g=x.createLinearGradient(0,0,W,H); g.addColorStop(0,'#FFF0F6'); g.addColorStop(.5,'#FFFCF7'); g.addColorStop(1,'#F4ECFF'); x.fillStyle=g; x.fillRect(0,0,W,H);
  function hp(cx,cy,s,col,a){ x.save(); x.globalAlpha=a; x.fillStyle=col; x.beginPath(); for(var t=0;t<=6.3;t+=0.05){ var px=cx+s*16*Math.pow(Math.sin(t),3), py=cy-s*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t)); t===0?x.moveTo(px,py):x.lineTo(px,py);} x.fill(); x.restore(); }
  hp(930,150,6,'#F5177F',.18); hp(140,1210,8,'#7C3AED',.12); hp(980,1180,3,'#FFC93C',.35); hp(120,180,3,'#1FB6F0',.25);
  var grd=x.createLinearGradient(0,0,W,0); grd.addColorStop(0,'#7C3AED'); grd.addColorStop(.5,'#F5177F'); grd.addColorStop(1,'#FFC93C'); x.fillStyle=grd; x.fillRect(0,0,W,14);
  x.fillStyle='#1A0F2E'; x.textAlign='center'; x.font='700 64px "Cormorant Garamond", Georgia, serif'; x.fillText(last.title,W/2,170);
  var ls=last.text.split('\n'), size=ls.length>16?32:ls.length>12?36:42, lh=size*1.5, y=Math.max(260,(H-ls.length*lh)/2+40);
  x.font='400 '+size+'px "Newsreader", Georgia, serif'; x.fillStyle='#2C2043';
  ls.forEach(function(l){ var words=l.split(' '), line=''; words.forEach(function(w){ var tst=line?line+' '+w:w; if(x.measureText(tst).width>W-180&&line){ x.fillText(line,W/2,y); y+=lh; line=w; } else line=tst; }); x.fillText(line,W/2,y); y+=lh; });
  x.font='600 26px "Plus Jakarta Sans", sans-serif'; x.fillStyle='#C70F64'; x.fillText('apoemaboutlove.com',W/2,H-60);
  var a=document.createElement('a'); a.download='love-poem.png'; a.href=c.toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove();
});
})();
