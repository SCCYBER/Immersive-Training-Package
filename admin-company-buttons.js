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
window.addEventListener('load',function(){addButtons();setInterval(addButtons,1000);});
if(document.readyState==='interactive'||document.readyState==='complete'){addButtons();setInterval(addButtons,1000);}
})();