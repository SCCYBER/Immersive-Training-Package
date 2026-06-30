(function(){
function addStyles(){
 if(document.getElementById('comingSoonTileStyles'))return;
 var s=document.createElement('style');
 s.id='comingSoonTileStyles';
 s.textContent='.coming-soon-card{opacity:.92;position:relative;overflow:hidden}.coming-soon-card:after{content:"COMING SOON";position:absolute;top:14px;right:-38px;transform:rotate(35deg);background:#59ff9d;color:#090216;font-family:"Press Start 2P",cursive;font-size:7px;padding:7px 36px;box-shadow:0 0 18px rgba(89,255,157,.45)}.coming-soon-card.admin-preview-card:after{content:"ADMIN PREVIEW";right:-48px;background:#ffd44d}.coming-soon-card .launch-btn{opacity:.75;cursor:not-allowed}.coming-soon-card.admin-preview-card .launch-btn{opacity:1;cursor:pointer;background:linear-gradient(90deg,#6f1dce,#a94cff)}';
 document.head.appendChild(s);
}
function isAdmin(){
 try{
  var p=JSON.parse(localStorage.getItem('sccyberPortalProfile')||'null');
  return !!(p&&p.isAdmin===true);
 }catch(e){return false}
}
function launchAdminPreview(){
 if(typeof openGame!=='function')return;
 openGame('AI Risk Radar','ai-risk-radar/index.html?portal=1&preview=admin','ai-risk-radar');
}
function configureTile(card){
 var admin=isAdmin();
 card.className='game-card live coming-soon-card'+(admin?' admin-preview-card':'');
 card.setAttribute('data-premium','true');
 card.setAttribute('data-reporting','excluded');
 card.setAttribute('data-status','admin-preview');
 card.innerHTML='<div class="game-icon">🤖</div><div class="game-type">PREMIUM MODULE</div><h2>AI Risk Radar</h2><p>Work through 10 AI security scenarios covering data sharing, shadow AI, deepfakes and safe use of AI tools.</p><div class="game-score" id="score-ai-risk-radar">'+(admin?'Admin preview only':'Coming soon')+'</div><div class="game-meta"><span>Premium</span><span>Easy</span><span>AI Security</span></div><button class="launch-btn '+(admin?'ai-preview-btn':'')+'" type="button" '+(admin?'':'disabled')+'>'+(admin?'Admin Preview':'Coming Soon')+'</button>';
 if(admin){
  card.querySelector('.ai-preview-btn').addEventListener('click',function(event){
   event.preventDefault();
   event.stopPropagation();
   launchAdminPreview();
  });
 }
}
function addTile(){
 addStyles();
 var existing=document.querySelector('[data-game="ai-risk-radar"]');
 if(existing){configureTile(existing);return;}
 var grid=document.querySelector('.games-grid');
 if(!grid)return;
 var card=document.createElement('article');
 card.setAttribute('data-game','ai-risk-radar');
 configureTile(card);
 grid.appendChild(card);
}
window.addEventListener('load',addTile);
if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(addTile,150);
setTimeout(addTile,800);
})();
