(function(){
function addStyles(){
 if(document.getElementById('sccyberLaserStyles'))return;
 var s=document.createElement('style');s.id='sccyberLaserStyles';
 s.textContent='.laser-zone{position:fixed;inset:0;pointer-events:none;z-index:3;overflow:hidden}.cyber-flyby{position:absolute;font-size:26px;line-height:1;opacity:0;filter:drop-shadow(0 0 10px rgba(169,76,255,.55));animation:cyberZip .9s linear forwards}.cyber-flyby.mail,.cyber-flyby.sms{color:#59ff9d;text-shadow:0 0 12px #59ff9d}.cyber-flyby.skull{color:#ff334d;text-shadow:0 0 14px #ff334d}@keyframes cyberZip{0%{opacity:0;transform:translate(var(--sx),var(--sy)) rotate(var(--r1)) scale(.85)}10%{opacity:.95}78%{opacity:.9}100%{opacity:0;transform:translate(var(--ex),var(--ey)) rotate(var(--r2)) scale(1.08)}}';
 document.head.appendChild(s);
}
function zone(){var z=document.getElementById('laserZone');if(z)return z;z=document.createElement('div');z.id='laserZone';z.className='laser-zone';document.body.appendChild(z);return z}
function visible(){var l=document.getElementById('sccyberLanding');return !!(l&&!l.classList.contains('hidden'))}
function shoot(){
 if(!visible())return;
 var icons=[['✉','mail'],['💬','sms'],['☠','skull']];
 var paths=[
  ['-15vw','18vh','115vw','18vh','0deg','8deg'],['115vw','32vh','-15vw','32vh','0deg','-8deg'],
  ['-15vw','72vh','115vw','42vh','-10deg','6deg'],['115vw','74vh','-15vw','46vh','10deg','-6deg'],
  ['20vw','-15vh','70vw','115vh','12deg','-10deg'],['78vw','115vh','28vw','-15vh','-12deg','10deg']
 ];
 var i=icons[Math.floor(Math.random()*icons.length)],p=paths[Math.floor(Math.random()*paths.length)];
 var b=document.createElement('div');
 b.className='cyber-flyby '+i[1];
 b.textContent=i[0];
 b.style.left='0';b.style.top='0';
 b.style.setProperty('--sx',p[0]);b.style.setProperty('--sy',p[1]);
 b.style.setProperty('--ex',p[2]);b.style.setProperty('--ey',p[3]);
 b.style.setProperty('--r1',p[4]);b.style.setProperty('--r2',p[5]);
 zone().appendChild(b);
 setTimeout(function(){if(b.parentNode)b.parentNode.removeChild(b)},1000);
}
function loop(){shoot();setTimeout(loop,3800+Math.floor(Math.random()*3200))}
function start(){addStyles();zone();setTimeout(loop,1600)}
window.addEventListener('load',start);if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(start,150);
})();