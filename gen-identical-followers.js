const fs = require('fs');
// Copy the EXACT structure of likes.html, only change text and widget name
const html = `<!DOCTYPE html>
<html lang="ar" dir="ltr">
<head>
<meta charset="utf-8"/>
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Expires" content="0"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
@font-face{font-family:'Stranger';src:url('/fonts/Stranger-back-in-the-Night.ttf') format('truetype');font-weight:normal;font-style:normal;font-display:swap}
*{margin:0;padding:0;box-sizing:border-box}
body{background:transparent;font-family:'Segoe UI',sans-serif;overflow:hidden}
#root{width:100%;height:100vh;display:flex;align-items:center;justify-content:center}
.pill{display:none;align-items:center;gap:0;padding:8px 0;background:rgba(10,10,10,0.92);border-radius:30px;min-width:260px;overflow:hidden;position:relative;animation:fadeIn .3s ease-out}
.pill.show{display:flex}
@keyframes fadeIn{0%{opacity:0;transform:scale(.85) translateY(10px)}100%{opacity:1;transform:scale(1) translateY(0)}}
@keyframes pulseHeart{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}
@keyframes shimmer{0%{transform:translateX(-100%) skewX(-15deg)}100%{transform:translateX(400%) skewX(-15deg)}}
.shimmer-wrap{position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;border-radius:30px;pointer-events:none}
.shimmer-bar{position:absolute;top:0;left:-100%;width:40%;height:100%;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.03) 30%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.03) 70%,transparent 100%);animation:shimmer 3s ease-in-out infinite;pointer-events:none}
.avatar-wrap{position:relative;width:42px;height:40px;flex-shrink:0;margin-left:10px}
.avatar-circle{position:absolute;left:0;top:0;width:40px;height:40px;border-radius:50%;overflow:hidden}
.avatar-circle img{width:100%;height:100%;object-fit:cover}
.heart-icon{position:absolute;right:-4px;bottom:-2px;animation:pulseHeart 1.5s ease-in-out infinite}
.info{margin-left:10px;margin-top:-2px}
.label{font-size:10px;font-weight:600;line-height:1}
.thanks-name{font-size:18px;font-weight:900;color:#fff;line-height:1.1}
.spacer{flex:1}
.thanks-text{font-family:'Stranger',cursive;font-size:28px;font-weight:700;color:#fff;padding:0 20px 0 10px;letter-spacing:2px;text-transform:uppercase;white-space:nowrap}
</style>
</head>
<body>
<div id="root">
  <div class="pill" id="pill">
    <div class="shimmer-wrap"><div class="shimmer-bar"></div></div>
    <div class="avatar-wrap">
      <div class="avatar-circle" id="avatarCircle"><img id="avatar" src="" onerror="this.style.display='none'"/></div>
      <svg class="heart-icon" id="heartIcon" width="20" height="20" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </div>
    <div class="info">
      <div class="label" id="labelEl">New Follower!</div>
      <div class="thanks-name" id="name"></div>
    </div>
    <div class="spacer"></div>
    <div class="thanks-text" id="thanksEl">Thank you</div>
  </div>
</div>
<script>
(function(){
  var params=new URLSearchParams(window.location.search);
  var color=params.get('color')||'#a855f7';
  var duration=parseInt(params.get('duration')||'10')*1000;
  document.getElementById('pill').style.border='1px solid '+color+'30';
  document.getElementById('pill').style.boxShadow='0 0 40px '+color+'20';
  document.getElementById('avatarCircle').style.background='linear-gradient(135deg,'+color+'20,'+color+'08)';
  document.getElementById('avatarCircle').style.border='1.5px solid '+color+'50';
  document.getElementById('heartIcon').setAttribute('fill',color);
  document.getElementById('heartIcon').style.filter='drop-shadow(0 0 6px '+color+'80)';
  document.getElementById('labelEl').style.color=color+'cc';
  document.getElementById('name').style.textShadow='0 0 10px '+color+'30';
  document.getElementById('thanksEl').style.textShadow='0 0 12px '+color+'60';
  var pill=document.getElementById('pill');
  var nameEl=document.getElementById('name');
  var avatarEl=document.getElementById('avatar');
  var hideTimer=null;
  function show(nameStr,avatarUrl){
    nameEl.textContent=nameStr;
    if(avatarUrl){avatarEl.src=avatarUrl;avatarEl.style.display='';}else{avatarEl.style.display='none';}
    pill.classList.add('show');
    if(hideTimer)clearTimeout(hideTimer);
    hideTimer=setTimeout(function(){pill.classList.remove('show');},duration);
  }
  var username=params.get('user');
  if(!username)return;
  var clean=username.replace("@","").trim();
  setInterval(function(){
    fetch("/api/widgets/state?widget=followers&_t="+Date.now())
    .then(function(r){return r.json();})
    .then(function(d){
      if(d.demo){
        var names=["أحمد","سارة","عمر","ليلى","يوسف","نور","محمد","خالد","ريما","حسن","مريم","يوسف"];
        show(names[Math.floor(Math.random()*names.length)],"");
        fetch("/api/widgets/state",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget:"followers",demo:false})});
      }
    }).catch(function(){});
  },500);
  var retryCount=0;var evtSource=null;
  function connect(){
    try{
      evtSource=new EventSource(window.location.origin+"/api/tiktok/live-events?user="+clean);
      evtSource.onopen=function(){retryCount=0;};
      evtSource.onmessage=function(ev){
        try{var data=JSON.parse(ev.data);if(data.connected)return;if(data.type==="follower"){show(data.displayName||"New Follower",data.avatar||"");}}catch(e){}
      };
      evtSource.onerror=function(){evtSource.close();var delay=Math.min(1000*Math.pow(2,retryCount),30000);retryCount++;setTimeout(connect,delay);};
    }catch(e){setTimeout(connect,3000);}
  }
  connect();
})();
</script>
</body>
</html>`;

fs.writeFileSync('C:/Users/maike/OneDrive/Desktop/web/streamer-tools/public/overlay-widgets/followers.html', html);
console.log('followers.html written:', fs.statSync('C:/Users/maike/OneDrive/Desktop/web/streamer-tools/public/overlay-widgets/followers.html').size, 'bytes');
