(function(){
var key='sccyberLoginGuard';
var maxAttempts=5;
var windowMs=10*60*1000;
var lockMs=15*60*1000;
function now(){return Date.now()}
function load(){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch(e){return {}}}
function save(s){try{localStorage.setItem(key,JSON.stringify(s))}catch(e){}}
function reset(){try{localStorage.removeItem(key)}catch(e){}}
function state(){var s=load();if(!s.firstAttemptAt||now()-s.firstAttemptAt>windowMs){s={count:0,firstAttemptAt:now(),lockedUntil:0}}return s}
function remaining(ms){return Math.max(1,Math.ceil(ms/60000))}
function setMessage(text){var msg=document.getElementById('authMessage');if(msg)msg.textContent=text}
function button(){return document.getElementById('credentialLoginBtn')}
function locked(){var s=state();return s.lockedUntil&&now()<s.lockedUntil?s:null}
function refreshLockUi(){var b=button();var s=locked();if(!b)return;if(s){b.disabled=true;setMessage('Too many failed login attempts. Try again in '+remaining(s.lockedUntil-now())+' minute(s).')}else{b.disabled=false}}
function recordFailure(){var s=state();s.count=Number(s.count||0)+1;if(s.count>=maxAttempts){s.lockedUntil=now()+lockMs}save(s);refreshLockUi()}
function recordSuccess(){reset();refreshLockUi()}
function install(){var b=button();if(!b||b.dataset.sccyberLoginGuard)return;b.dataset.sccyberLoginGuard='true';b.addEventListener('click',function(e){var s=locked();if(!s)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();setMessage('Too many failed login attempts. Try again in '+remaining(s.lockedUntil-now())+' minute(s).')},true);var msg=document.getElementById('authMessage');if(msg){var last=msg.textContent;setInterval(function(){var t=msg.textContent||'';if(t!==last){last=t;if(t.toLowerCase().includes('login failed'))recordFailure();if(t.toLowerCase().includes('checking credentials'))refreshLockUi();if(t.toLowerCase().includes('supabase ready'))refreshLockUi()}},500)}refreshLockUi();setInterval(refreshLockUi,30000)}
window.sccyberLoginGuardFailure=recordFailure;
window.sccyberLoginGuardSuccess=recordSuccess;
window.addEventListener('load',install);if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(install,100);
})();
