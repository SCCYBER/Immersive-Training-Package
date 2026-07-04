async function sccyberCheckPremiumSeat(profile){
 try{
  var client=window.supabaseClient||supabaseClient;
  if(!client||!profile||!profile.supabaseUserId)return false;

  var rpc=await client.rpc('check_my_premium_access');
  if(!rpc.error&&rpc.data!==null&&rpc.data!==undefined)return rpc.data===true;

  var pr=await client.from('profiles').select('id,is_admin,premium_enabled').eq('id',profile.supabaseUserId).maybeSingle();
  if(!pr||pr.error||!pr.data)return false;
  if(pr.data.is_admin===true)return true;

  var learner=await client.from('learners').select('id,active,organisation_id').eq('user_id',profile.supabaseUserId).maybeSingle();
  if(!learner||learner.error||!learner.data||learner.data.active===false||!learner.data.organisation_id)return false;

  var org=await client.from('organisations').select('id,billing_status,premium_enabled').eq('id',learner.data.organisation_id).maybeSingle();
  if(!org||org.error||!org.data||String(org.data.billing_status||'').toLowerCase()==='removed')return false;

  return !!(pr.data.premium_enabled===true||org.data.premium_enabled===true);
 }catch(e){return false}
}
window.sccyberCheckPremiumSeat=sccyberCheckPremiumSeat;
