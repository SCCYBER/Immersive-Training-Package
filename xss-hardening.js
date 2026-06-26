(function(){
  function escapeHtml(value){
    return String(value ?? "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#39;");
  }

  function safeNumber(value,fallback){
    var n=Number(value);
    return Number.isFinite(n)?n:(fallback||0);
  }

  function safeDate(value){
    var d=new Date(value);
    return Number.isNaN(d.getTime())?"":escapeHtml(d.toLocaleDateString());
  }

  window.sccyberEscapeHtml=escapeHtml;

  function patchCompanySelect(){
    if(typeof populateCompanySelect!=="function"||window.sccyberSafeCompanySelect)return;
    window.sccyberSafeCompanySelect=true;
    populateCompanySelect=function(){
      if(!newLearnerCompany)return;
      newLearnerCompany.textContent="";
      var first=document.createElement("option");
      first.value="";
      first.textContent="Select company";
      newLearnerCompany.appendChild(first);
      (adminOrgs||[]).forEach(function(org){
        var opt=document.createElement("option");
        opt.value=String(org.id||"");
        opt.textContent=String(org.name||"Unnamed company");
        newLearnerCompany.appendChild(opt);
      });
    };
  }

  function patchLearnerReport(){
    if(typeof renderRemoteLearnerReport!=="function"||window.sccyberSafeRemoteReport)return;
    window.sccyberSafeRemoteReport=true;
    renderRemoteLearnerReport=function(p,attempts){
      var s=buildRemoteSummary(attempts||[]);
      var name=(String(p.first_name||"")+" "+String(p.surname||"")).trim()||p.username||"Learner";
      var rows=(games||[]).map(function(g){
        var ga=(attempts||[]).filter(function(a){return a.game===g.key});
        if(!ga.length){
          return '<div class="report-line"><strong>'+escapeHtml(g.name)+'</strong><span>'+escapeHtml(g.tier)+'</span><span>Not started</span><span>Attempts: 0</span></div>';
        }
        var accs=ga.map(remoteAccuracy),best=Math.max.apply(null,accs),latest=remoteAccuracy(ga[ga.length-1]),avg=Math.round(accs.reduce(function(a,b){return a+b},0)/accs.length);
        return '<div class="report-line"><strong>'+escapeHtml(g.name)+'</strong><span>'+escapeHtml(g.tier)+'</span><span>Best '+safeNumber(best)+'% | Latest '+safeNumber(latest)+'% | Avg '+safeNumber(avg)+'%</span><span>Attempts: '+ga.length+'</span></div>';
      }).join("");
      return '<div class="report-section"><div class="report-section-title">Learner</div><p>'+escapeHtml(name)+' · '+escapeHtml(p.department_role||"No role")+'<br>Username: '+escapeHtml(p.username||"Not set")+'</p></div><div class="report-grid"><div class="report-card"><span>Average</span><strong>'+(s.completed?safeNumber(s.avg)+"%":"--")+'</strong></div><div class="report-card"><span>Completed</span><strong>'+safeNumber(s.completed)+' / '+safeNumber(games.length)+'</strong></div><div class="report-card"><span>Status</span><strong>'+escapeHtml(s.status)+'</strong></div></div><div class="report-section"><div class="report-section-title">Module Breakdown</div>'+rows+'</div><button class="small-btn admin-reset-scores" data-id="'+escapeHtml(p.id||"")+'">Reset Scores</button>';
    };
  }

  function patchLocalReport(){
    if(typeof updateReport!=="function"||window.sccyberSafeLocalReport)return;
    window.sccyberSafeLocalReport=true;
    updateReport=function(p,s){
      if(!validProfile(p)){
        reportBadge.textContent="AWAITING PROFILE";
        reportProgress.textContent="0 / "+games.length;
        reportAttempts.textContent="0";
        reportOutput.textContent="Enter learner details to start generating report data.";
        return;
      }
      reportProgress.textContent=s.completed+" / "+games.length;
      reportAttempts.textContent=s.totalAttempts;
      reportBadge.textContent=s.status;
      if(s.totalAttempts===0){reportOutput.textContent="Complete at least one module to generate report data.";return;}
      var lines=(games||[]).map(function(g){
        var a=attemptsFor(p,g.key);
        if(!a.length){
          return '<div class="report-line"><strong>'+escapeHtml(g.name)+'</strong><span>'+escapeHtml(g.tier)+'</span><span>'+(g.premium&&!hasPremiumAccess()?"Premium locked":"Not started")+'</span><span>Attempts: 0</span></div>';
        }
        return '<div class="report-line"><strong>'+escapeHtml(g.name)+'</strong><span>'+escapeHtml(g.tier)+'</span><span>Best '+safeNumber(bestAccuracy(a))+'% | Latest '+safeNumber(latestAccuracy(a))+'% | Avg '+safeNumber(averageAccuracy(a))+'%</span><span>Attempts: '+a.length+'</span></div>';
      }).join("");
      reportOutput.innerHTML='<div class="report-section"><div class="report-section-title">Learner</div><p>'+escapeHtml(p.name)+' · '+escapeHtml(p.departmentRole)+'</p></div><div class="report-section"><div class="report-section-title">Module Breakdown</div>'+lines+'</div>';
    };
  }

  function patchAdminRender(){
    if(typeof renderAdmin!=="function"||window.sccyberSafeAdminRender)return;
    window.sccyberSafeAdminRender=true;
    renderAdmin=function(learnerRows,billingRows){
      learnerRows=learnerRows||[];
      billingRows=billingRows||[];
      adminCompanyCount.textContent=(adminOrgs||[]).length;
      adminLicenceCount.textContent=(adminOrgs||[]).reduce(function(s,o){return s+safeNumber(o.licence_count)},0);
      adminLearnerCount.textContent=learnerRows.length;
      adminOutput.innerHTML=(adminOrgs||[]).map(function(o){
        var billing=String(o.billing_status||"trial");
        return '<div class="report-line" data-org-row="'+escapeHtml(o.id)+'"><strong>'+escapeHtml(o.name||"Unnamed company")+'</strong><span><input class="org-licences" type="number" value="'+safeNumber(o.licence_count)+'"></span><span><select class="org-premium"><option value="false" '+(!o.premium_enabled?"selected":"")+'>Premium off</option><option value="true" '+(o.premium_enabled?"selected":"")+'>Premium on</option></select><select class="org-billing"><option '+(billing==="trial"?"selected":"")+'>trial</option><option '+(billing==="pending"?"selected":"")+'>pending</option><option '+(billing==="paid"?"selected":"")+'>paid</option><option '+(billing==="overdue"?"selected":"")+'>overdue</option></select></span><span><button class="small-btn admin-update-org" data-id="'+escapeHtml(o.id)+'">Save</button></span></div>';
      }).join("")||"No companies yet.";
      adminLearnerOutput.innerHTML=learnerRows.map(function(l){
        var prof=(adminProfiles||[]).find(function(p){return p.id===l.user_id})||{};
        var org=(adminOrgs||[]).find(function(o){return o.id===l.organisation_id});
        var uid=l.user_id||"";
        return '<div class="report-line"><strong>'+escapeHtml(l.username||"No username")+'</strong><span>'+escapeHtml(org?org.name:"No company")+'</span><span>'+(uid?"Login active":"No login yet")+(prof.premium_enabled?" · Premium":"")+'</span><span>'+(uid?'<button class="small-btn admin-report" data-id="'+escapeHtml(uid)+'">View Report</button> ':"")+'<button class="small-btn admin-remove-learner" data-id="'+escapeHtml(l.id||"")+'" data-username="'+escapeHtml(l.username||"")+'">Remove</button></span></div>';
      }).join("")||"No learners yet.";
      billingOutput.innerHTML=billingRows.map(function(b){
        return '<div class="report-line"><strong>'+escapeHtml(b.event_type||"Event")+'</strong><span>'+escapeHtml(b.amount||"")+' '+escapeHtml(b.currency||"")+'</span><span>'+escapeHtml(b.status||"")+'</span><span>'+safeDate(b.created_at)+'</span></div>';
      }).join("")||"No billing events yet.";
    };
  }

  function patchAdminControlsV2(){
    if(typeof sccyberRenderLearnerRowsV2!=="function"||window.sccyberSafeAdminControlsV2)return;
    window.sccyberSafeAdminControlsV2=true;
    sccyberRenderLearnerRowsV2=function(rows){
      if(!window.adminLearnerOutput||!Array.isArray(rows))return;
      adminLearnerOutput.innerHTML=rows.map(function(row){
        var profile=(adminProfiles||[]).find(function(p){return p.id===row.user_id})||{};
        var org=(adminOrgs||[]).find(function(o){return o.id===row.organisation_id});
        var uid=row.user_id||"";
        return '<div class="report-line" data-fixed-admin-buttons="true" data-admin-controls-v2="true" data-learner-id="'+escapeHtml(row.id||"")+'" data-username="'+escapeHtml(row.username||"")+'" data-user-id="'+escapeHtml(uid)+'"><strong>'+escapeHtml(row.username||"No username")+'</strong><span>'+escapeHtml(org?org.name:"No company")+'</span><span>'+(uid?"Login active":"No login yet")+(profile.premium_enabled?" · Premium":"")+'</span><span></span></div>';
      }).join("")||"No learners yet.";
      adminLearnerOutput.querySelectorAll(".report-line[data-admin-controls-v2='true']").forEach(function(row){
        if(typeof sccyberBuildLearnerButtons==="function")sccyberBuildLearnerButtons(row,row.dataset.username,row.dataset.userId,row.dataset.learnerId);
      });
    };
  }

  function install(){
    patchCompanySelect();
    patchLearnerReport();
    patchLocalReport();
    patchAdminRender();
    patchAdminControlsV2();
  }

  install();
  window.addEventListener("load",install);
  setTimeout(install,250);
  setTimeout(install,1000);
})();
