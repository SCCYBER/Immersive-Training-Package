window.SCCYBER_SUPABASE_URL = "https://sjypdnwdoqogjwcwtpof.supabase.co";
window.SCCYBER_SUPABASE_ANON_KEY = "sb_publishable_vjQhz9eikWmpAXALGqz4QA_B_4fxc4Q";

(function(){
  function loadPremiumTruth(){
    if(document.getElementById('premiumTruthScript'))return;
    var s=document.createElement('script');
    s.id='premiumTruthScript';
    s.src='premium-source-truth.js?v=20260626a';
    document.body.appendChild(s);
  }
  window.addEventListener('load',loadPremiumTruth);
  if(document.readyState==='interactive'||document.readyState==='complete')setTimeout(loadPremiumTruth,100);
})();
