async function sccyberCheckPremiumSeat(profile){
 try{
  var client=window.supabaseClient||supabaseClient;
  if(!client||!profile||!profile.supabaseUserId)return false;

  var rpc=await client.rpc('check_my_premium_access');
  if(!rpc.error&&rpc.data!==null&&rpc.data!==undefined)return rpc.data===true;

  var pr=await client.from('profiles').select('premium_enabled').eq('id',profile.supabaseUserId).single();
  return !!(pr&&!pr.error&&pr.data&&pr.data.premium_enabled===true);
 }catch(e){return false}
}
window.sccyberCheckPremiumSeat=sccyberCheckPremiumSeat;
