(function(){
var hiddenKey='sccyberHiddenCompanyIds';
function getHidden(){try{return JSON.parse(localStorage.getItem(hiddenKey)||'[]')}catch(e){return[]}}
function setHidden(ids){localStorage.setItem(hiddenKey,JSON.stringify(Array.from(new Set(ids))))}
function addStyles(){
 if(document.getElementById('companyRemoveButtonStyles'))return;
 var s=document.createElement('style');
 s.id='companyRemoveButtonStyles';
 s.textContent='.fixed-remove-company{display:none!important}.admin-remove-org{display:inline-block!important}';
 document.head.appendChild(s);
}
function applyHidden(){
 var hidden=getHidden();
 document.querySelectorAll('[data-org-row]').forEach(function(row){
  if(hidden.indexOf(row.getAttribute('data-org-row'))!==-1)row.remove();
 });
 updateCounts();
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
}
function updateCounts(){
 var companyCount=document.getElementById('adminCompanyCount');
 if(companyCount)companyCount.textContent=document.querySelectorAll('[data-org-row]').length;
}
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
window.addEventListener('load',function(){addButtons();setInterval(addButtons,1000);});
if(document.readyState==='interactive'||document.readyState==='complete'){addButtons();setInterval(addButtons,1000);}
})();