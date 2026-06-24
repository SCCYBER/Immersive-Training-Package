(function(){
function addStyles(){
 if(document.getElementById('sccyberLaserStyles'))return;
 var s=document.createElement('style');s.id='sccyberLaserStyles';
 s.textContent='.laser-zone{position:fixed;inset:0;pointer-events:none;z-index:3;overflow:hidden}.laser-beam{position:absolute;height:2px;width:42vw;opacity:.0;transform-origin:left center;animation:laserShoot .9s ease-out forwards}.laser-beam.green{background:#59ff9d;box-shadow:0 0 10px #59ff9d,0 0 24px rgba(89,255,157,.65)}.laser-beam.purple{background:#a94cff;box-shadow:0 0 10px #a94cff,0 0 24px rgba(169,76,255,.65)}@keyframes laserShoot{0%{opacity:0;transform:translateX(-55vw) rotate(var(--laser-angle)) scaleX(.25)}12%{opacity:.85}72%{opacity:.75}100%{opacity:0;transform:translateX(120vw) rotate(var(--laser-angle)) scaleX(1)}}';
 document.head.appendChild(s);
}
function zone(){var z=document.getElementById('laserZone');if(z)return z;z=document.createElement('div');z.id='laserZone';z.className='laser-zone';document.body.appendChild(z);return z}
function visible(){var l=document.getElementById('sccyberLanding');return !!(l&&!l.classList.contains('hidden'))}
function shoot(){
 if(!visible())return;
 var b=document.createElement('div');
 b.className='laser-beam '+(Math.random()>.5?'green':'purple');
 b.style.top=(18+Math.floor(Math.random()*64))+'%';
 b.style.left='-10vw';
 b.style.setProperty('--laser-angle',(Math.random()>.5?'8deg':'-8deg'));
 zone().appendChild(b);
 setTimeout(function(){if(b.parentNode)b.parentNode.removeChild(b)},1000);
}
function loop(){shoot();setTimeout(loop,5200+Math.floor(Math.random()*4500))}
function start(){addStyles();zone();setTimeout(loop,1800)}
window.addEventListener('load',start);if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(start,150);
})();