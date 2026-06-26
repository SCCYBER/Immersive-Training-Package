async function sccyberCheckPremiumSeat(profile){
 try{
  var client=window.supabaseClient||supabaseClient;
  if(!client||!profile||!profile.supabaseUserId)return false;

  var pr=await client.from('profiles').select('username').eq('id',profile.supabaseUserId).single();
  if(pr.error||!pr.data)return false;

  var username=String(pr.data.username||profile.username||'').trim().toLowerCase();
  if(!username)return false;

  var lr=await client.from('learners').select('id,username,organisation_id,active,created_at').ilike('username',username).single();
  if(lr.error||!lr.data||lr.data.active!==true||!lr.data.organisation_id)return false;

  var orgId=lr.data.organisation_id;
  var or=await client.from('organisations').select('id,premium_enabled,licence_count,billing_status').eq('id',orgId).single();
  if(or.error||!or.data)return false;

  var licences=Number(or.data.licence_count||0);
  if(or.data.premium_enabled!==true||licences<1||or.data.billing_status==='removed')return false;

  var all=await client.from('learners').select('id,username,created_at,active').eq('organisation_id',orgId).eq('active',true).order('created_at',{ascending:true});
  var list=all.data||[];
  var index=list.findIndex(function(x){return String(x.username||'').trim().toLowerCase()===username});

  return index>=0&&index<licences;
 }catch(e){return false}
}
window.sccyberCheckPremiumSeat=sccyberCheckPremiumSeat;
