(function(){
function addButtons(){
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
 var name=row&&row.querySelector('strong')?row.querySelector('strong').textContent:'this company';
 if(!confirm('Remove '+name+' from this admin view?'))return;
 if(row)row.remove();
 updateCounts();
 alert('Removed from this screen. To remove permanently, also remove the company record in Supabase after deactivating its learners.');
});
window.addEventListener('load',function(){addButtons();setInterval(addButtons,1000);});
if(document.readyState==='interactive'||document.readyState==='complete'){addButtons();setInterval(addButtons,1000);}
})();