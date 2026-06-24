(function(){
function loadTile(){if(document.getElementById('comingSoonTileScript'))return;var s=document.createElement('script');s.id='comingSoonTileScript';s.src='dashboard-coming-soon.js?v=20260624b';document.body.appendChild(s)}
function loadCompanyButtons(){if(document.getElementById('companyButtonsScript'))return;var s=document.createElement('script');s.id='companyButtonsScript';s.src='admin-company-buttons.js?v=20260624a';document.body.appendChild(s)}
function removeRefresh(){var b=document.getElementById('refreshAdminBtn');if(b)b.remove()}
function run(){loadTile();loadCompanyButtons();removeRefresh();setTimeout(loadTile,300);setTimeout(loadCompanyButtons,300);setTimeout(loadTile,1000);setTimeout(loadCompanyButtons,1000);setInterval(loadTile,2000);setInterval(loadCompanyButtons,2000);setInterval(removeRefresh,2000)}
window.addEventListener('load',run);if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(run,100);
})();