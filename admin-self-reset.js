(function(){
function profile(){try{return JSON.parse(localStorage.getItem('sccyberPortalProfile')||'null')}catch(e){return null}}
function addButton(){
 var p=profile();
 if(!p||p.isAdmin!==true)return;
 if(document.getElementById('adminSelfResetBtn'))return;
 var viewBtn=document.getElementById('viewReportBtn');
 if(!viewBtn||!viewBtn.parentElement)return;
 var btn=document.createElement('button');
 btn.id='adminSelfResetBtn';
 btn.type='button';
 btn.className='small-btn';
 btn.textContent='Reset My Scores';
 btn.style.marginLeft='10px';
 viewBtn.insertAdjacentElement('afterend',btn);
 btn.addEventListener('click',resetSelf);
}
async function resetSelf(){
 var p=profile();
 if(!p||p.isAdmin!==true||!p.supabaseUserId)return;
 if(!confirm('Reset your own test scores? This will remove your attempts from this browser and Supabase.'))return;
 try{
  p.attempts=[];
  p.scores={};
  localStorage.setItem('sccyberPortalProfile',JSON.stringify(p));
  Object.keys(localStorage).forEach(function(k){if(k.toLowerCase().includes('leaderboard'))localStorage.removeItem(k)});
 }catch(e){}
 try{
  var client=window.supabaseClient||supabaseClient;
  if(client)await client.from('attempts').delete().eq('user_id',p.supabaseUserId);
  if(typeof sccyberAudit==='function')await sccyberAudit('admin_self_scores_reset','profile',p.supabaseUserId,{profile_id:p.supabaseUserId});
 }catch(e){}
 if(typeof updateDashboard==='function')updateDashboard();
 alert('Your test scores have been reset.');
}
function run(){addButton();setTimeout(addButton,300);setTimeout(addButton,1000)}
window.addEventListener('load',run);if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(run,100);
})();
