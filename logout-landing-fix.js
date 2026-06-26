(function(){
function hide(id){var el=document.getElementById(id);if(el)el.classList.add('hidden')}
function showLandingOnly(){
 document.body.classList.remove('sccyber-login-open');
 hide('authView');hide('dashboardView');hide('reportView');hide('gameView');hide('adminView');
 var landing=document.getElementById('sccyberLanding');
 if(landing){landing.classList.remove('hidden');landing.classList.remove('pixel-fizzle')}
 else if(typeof showLanding==='function'){showLanding()}
 window.scrollTo(0,0);
}
async function forceLogout(){
 try{localStorage.removeItem('sccyberPortalProfile')}catch(e){}
 try{if(window.supabaseClient)await window.supabaseClient.auth.signOut();else if(typeof supabaseClient!=='undefined'&&supabaseClient)await supabaseClient.auth.signOut()}catch(e){}
 var user=document.getElementById('usernameInput');if(user)user.value='';
 var pass=document.getElementById('passwordInput');if(pass)pass.value='';
 var msg=document.getElementById('authMessage');if(msg)msg.textContent='';
 showLandingOnly();
 setTimeout(showLandingOnly,100);
}
function loadLoginGuard(){
 if(document.getElementById('loginGuardScript'))return;
 var s=document.createElement('script');s.id='loginGuardScript';s.src='login-rate-limit.js?v=20260626a';document.body.appendChild(s);
}
document.addEventListener('click',function(e){
 var btn=e.target.closest('#logoutBtn');
 if(!btn)return;
 e.preventDefault();
 e.stopPropagation();
 e.stopImmediatePropagation();
 forceLogout();
},true);
window.sccyberForceLogoutToLanding=forceLogout;
window.addEventListener('load',loadLoginGuard);if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(loadLoginGuard,100);
})();