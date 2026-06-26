(function(){
  function loadCurrentProfile(){
    try{return JSON.parse(localStorage.getItem("sccyberPortalProfile")||"null")}catch(e){return null}
  }

  async function writeAuditLog(action,targetType,targetId,details){
    try{
      var client=window.supabaseClient||supabaseClient;
      var profile=loadCurrentProfile();
      if(!client||!profile||profile.isAdmin!==true||!profile.supabaseUserId)return;
      await client.from("admin_audit_logs").insert({
        admin_user_id:profile.supabaseUserId,
        admin_username:profile.username||profile.name||"admin",
        action:action,
        target_type:targetType||null,
        target_id:targetId||null,
        details:details||{},
        created_at:new Date().toISOString()
      });
    }catch(e){}
  }

  window.sccyberWriteAuditLog=writeAuditLog;

  function patchAdminActions(){
    if(window.sccyberAdminAuditPatched)return;
    if(typeof addCompany!=="function"||typeof updateCompany!=="function"||typeof removeLearnerRecord!=="function"||typeof resetLearnerScores!=="function")return;
    window.sccyberAdminAuditPatched=true;

    var originalAddCompany=addCompany;
    addCompany=async function(){
      var name=(newCompanyName&&newCompanyName.value||"").trim();
      var licences=newCompanyLicences?newCompanyLicences.value:"";
      var premium=newCompanyPremium?newCompanyPremium.value:"";
      var billing=newCompanyBilling?newCompanyBilling.value:"";
      await originalAddCompany.apply(this,arguments);
      await writeAuditLog("company_add","organisation",name,{name:name,licences:licences,premium:premium,billing_status:billing});
    };

    var originalUpdateCompany=updateCompany;
    updateCompany=async function(id){
      var row=document.querySelector('[data-org-row="'+id+'"]');
      var details={};
      if(row){
        details.licences=row.querySelector(".org-licences")?row.querySelector(".org-licences").value:null;
        details.premium=row.querySelector(".org-premium")?row.querySelector(".org-premium").value:null;
        details.billing_status=row.querySelector(".org-billing")?row.querySelector(".org-billing").value:null;
      }
      await originalUpdateCompany.apply(this,arguments);
      await writeAuditLog("company_update","organisation",id,details);
    };

    var originalRemoveLearner=removeLearnerRecord;
    removeLearnerRecord=async function(id,username){
      await originalRemoveLearner.apply(this,arguments);
      await writeAuditLog("learner_remove","learner",id,{username:username||""});
    };

    var originalResetScores=resetLearnerScores;
    resetLearnerScores=async function(id){
      await originalResetScores.apply(this,arguments);
      await writeAuditLog("learner_scores_reset","profile",id,{profile_id:id});
    };
  }

  function install(){patchAdminActions()}
  install();
  window.addEventListener("load",install);
  setTimeout(install,250);
  setTimeout(install,1000);
})();
