(function(){
var hiddenKey='sccyberHiddenCompanyIds';
function getHidden(){try{return JSON.parse(localStorage.getItem(hiddenKey)||'[]')}catch(e){return[]}}
function setHidden(ids){localStorage.setItem(hiddenKey,JSON.stringify(Array.from(new Set(ids))))}
function addStyles(){
 if(document.getElementById('companyRemoveButtonStyles'))return;
 var s=document.createElement('style');
 s.id='companyRemoveButtonStyles';
 s.textContent='#adminOutput{visibility:hidden}.companies-ready #adminOutput{visibility:visible}.fixed-remove-company{display:none!important}.admin-remove-org{display:inline-block!important}';
 document.head.appendChild(s);
}
function markReady(){document.body.classList.add('companies-ready')}
function applyHidden(){
 var hidden=getHidden();
 document.querySelectorAll('[data-org-row]').forEach(function(row){
  if(hidden.indexOf(row.getAttribute('data-org-row'))!==-1)row.remove();
 });
 updateCounts();
 markReady();
}
function patchRender(){
 if(typeof renderAdmin!=='function'||window.sccyberCompanyRenderPatched)return;
 window.sccyberCompanyRenderPatched=true;
 var original=renderAdmin;
 renderAdmin=function(rows,billingRows){
  document.body.classList.remove('companies-ready');
  original(rows,billingRows);
  addButtons();
 };
}
function addButtons(){
 addStyles();
 applyHidden();
 document.querySelectorAll('[data-org-row]').forEach(function(row){
  if(row.querySelector('.admin-remove-org'))return;
  var save=row.querySelector('.admin-update-org');
  if(!save)return;
  var b=document.createElement('button');
  b.className='small-btn admin-remove-org';
  b.type='button';
  b.textContent='Remove';
  b.dataset.id=save.dataset.id;
  b.style.marginLeft='8px';
  save.parentElement.appendChild(b);
 });
 updateCounts();
 markReady();
}
function updateCounts(){
 var rows=document.querySelectorAll('[data-org-row]');
 var companyCount=document.getElementById('adminCompanyCount');
 var licenceCount=document.getElementById('adminLicenceCount');
 if(companyCount)companyCount.textContent=rows.length;
 if(licenceCount){
  var total=0;
  rows.forEach(function(row){
   var input=row.querySelector('.org-licences');
   total+=Number(input&&input.value?input.value:0);
  });
  licenceCount.textContent=total;
 }
}
document.addEventListener('input',function(e){if(e.target&&e.target.classList.contains('org-licences'))updateCounts();});
document.addEventListener('click',function(e){
 var b=e.target.closest('.admin-remove-org');
 if(!b)return;
 e.preventDefault();
 var row=b.closest('[data-org-row]');
 var id=b.dataset.id||row&&row.getAttribute('data-org-row');
 var name=row&&row.querySelector('strong')?row.querySelector('strong').textContent:'this company';
 if(!confirm('Remove '+name+' from this admin view?'))return;
 if(id){var hidden=getHidden();hidden.push(id);setHidden(hidden);}
 if(row)row.remove();
 updateCounts();
 alert('Removed from this admin view. It will stay hidden on this browser. For permanent removal, delete the company record in Supabase after deactivating its learners.');
});
window.addEventListener('load',function(){addStyles();patchRender();addButtons();setInterval(function(){patchRender();addButtons();updateCounts();},1000);});
if(document.readyState==='interactive'||document.readyState==='complete'){addStyles();patchRender();addButtons();setInterval(function(){patchRender();addButtons();updateCounts();},1000);}
})();