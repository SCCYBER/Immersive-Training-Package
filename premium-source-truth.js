(function(){
async function sync(){
 try{
  var client=window.supabaseClient||supabaseClient;
  var profile=JSON.parse(localStorage.getItem('sccyberPortalProfile')||'null');
  if(!client||!profile||profile.mode!=='live'||!profile.supabaseUserId||profile.isAdmin)return;
  var res=await client.rpc('check_my_premium_access');
  var allowed=!res.error&&res.data===true;
  if(profile.premiumEnabled!==allowed){
   profile.premiumEnabled=allowed;
   localStorage.setItem('sccyberPortalProfile',JSON.stringify(profile));
   if(typeof updateDashboard==='function')updateDashboard();
  }
 }catch(e){}
}
window.sccyberSyncPremiumFromOrganisation=sync;
window.addEventListener('load',function(){setTimeout(sync,300);setTimeout(sync,1200);setInterval(sync,15000)});
if(document.readyState==='interactive'||document.readyState==='complete'){setTimeout(sync,300);setTimeout(sync,1200);setInterval(sync,15000)}
})();
