(function(){
async function archiveOrg(id){
 try{
  var c=window.supabaseClient||supabaseClient;
  if(!c||!id)return false;
  var r=await c.from('organisations').update({billing_status:'removed',premium_enabled:false,licence_count:0}).eq('id',id);
  return !r.error;
 }catch(e){return false}
}
window.sccyberArchiveOrg=archiveOrg;
})();