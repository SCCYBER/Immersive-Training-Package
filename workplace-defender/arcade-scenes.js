(function () {
  function styles() {
    return `<style>
      .sceneSvg{width:100%;height:100%;display:block;background:#090216;image-rendering:pixelated;}
      .px{shape-rendering:crispEdges;}
      .g{filter:drop-shadow(0 0 7px #59ff9d)}.p{filter:drop-shadow(0 0 7px #a94cff)}.r{filter:drop-shadow(0 0 7px #ff3b6b)}.y{filter:drop-shadow(0 0 7px #ffd44d)}
      .bob{animation:bob 1.2s steps(2,end) infinite}.walk{animation:walk 4.2s steps(8,end) infinite}.paper{animation:paper 1.8s steps(4,end) infinite}.pulse{animation:pulse 1s steps(2,end) infinite}.shake{animation:shake .9s steps(3,end) infinite}.plug{animation:plug 1.5s steps(4,end) infinite}.fly{animation:fly 2.2s steps(6,end) infinite}.wifiPulse{animation:pulse 1.1s steps(2,end) infinite}
      @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
      @keyframes walk{0%,15%{transform:translateX(0)}70%,100%{transform:translateX(210px)}}
      @keyframes paper{0%{transform:translateY(-32px);opacity:.3}75%,100%{transform:translateY(42px);opacity:1}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
      @keyframes shake{0%,100%{transform:rotate(0deg)}33%{transform:rotate(-4deg)}66%{transform:rotate(4deg)}}
      @keyframes plug{0%,100%{transform:translateX(0)}50%{transform:translateX(-36px)}}
      @keyframes fly{0%{transform:translateX(0)}75%,100%{transform:translateX(165px)}}
    </style>`;
  }

  function bg() {
    return `<defs><linearGradient id="bg" x1="0" x2="1"><stop stop-color="#061b4d"/><stop offset=".55" stop-color="#17083e"/><stop offset="1" stop-color="#5c064d"/></linearGradient></defs><rect width="900" height="320" fill="#090216"/><rect width="900" height="320" fill="url(#bg)"/><g opacity=".18">${Array.from({length:24}).map((_,i)=>`<rect x="${18+i*38}" y="${20+(i%7)*36}" width="24" height="6" fill="${i%2?'#a94cff':'#59ff9d'}"/>`).join('')}</g><rect y="250" width="900" height="70" fill="#070018" opacity=".72"/>`;
  }

  function man(x,y,cls='bob') {
    return `<g class="px ${cls}" transform="translate(${x} ${y})"><rect x="14" y="0" width="66" height="24" fill="#1648d8" stroke="#070016" stroke-width="5"/><rect x="8" y="24" width="78" height="60" fill="#c9855d" stroke="#070016" stroke-width="5"/><rect x="26" y="46" width="10" height="10" fill="#070016"/><rect x="58" y="46" width="10" height="10" fill="#070016"/><rect x="38" y="66" width="22" height="6" fill="#070016"/><rect x="12" y="88" width="74" height="62" fill="#1d5fff" stroke="#070016" stroke-width="5"/><rect x="-6" y="96" width="22" height="52" fill="#c9855d" stroke="#070016" stroke-width="5"/><rect x="82" y="96" width="22" height="52" fill="#c9855d" stroke="#070016" stroke-width="5"/><rect x="24" y="150" width="24" height="38" fill="#07142e" stroke="#070016" stroke-width="5"/><rect x="54" y="150" width="24" height="38" fill="#07142e" stroke="#070016" stroke-width="5"/></g>`;
  }

  function woman(x,y,cls='bob') {
    return `<g class="px ${cls}" transform="translate(${x} ${y})"><rect x="0" y="0" width="96" height="76" fill="#ff4fa3" stroke="#070016" stroke-width="5"/><rect x="17" y="30" width="64" height="58" fill="#efaa72" stroke="#070016" stroke-width="5"/><rect x="32" y="51" width="10" height="10" fill="#070016"/><rect x="60" y="51" width="10" height="10" fill="#070016"/><rect x="42" y="72" width="22" height="6" fill="#070016"/><rect x="14" y="92" width="78" height="64" fill="#ffd44d" stroke="#070016" stroke-width="5"/><rect x="-6" y="100" width="22" height="52" fill="#efaa72" stroke="#070016" stroke-width="5"/><rect x="88" y="100" width="22" height="52" fill="#efaa72" stroke="#070016" stroke-width="5"/><rect x="26" y="156" width="24" height="38" fill="#601a98" stroke="#070016" stroke-width="5"/><rect x="58" y="156" width="24" height="38" fill="#601a98" stroke="#070016" stroke-width="5"/></g>`;
  }

  function pc(x,y,live=false) {
    const screen = live ? '<rect x="30" y="30" width="150" height="72" fill="#06291f"/><rect x="44" y="45" width="95" height="8" fill="#59ff9d"/><rect x="44" y="62" width="120" height="8" fill="#ffd44d"/><rect x="44" y="79" width="76" height="8" fill="#a94cff"/>' : '<rect x="30" y="30" width="150" height="72" fill="#10135d"/><rect x="62" y="56" width="86" height="18" fill="#59ff9d" opacity=".65"/>';
    return `<g class="px g" transform="translate(${x} ${y})"><rect x="0" y="0" width="210" height="130" rx="4" fill="#06142e" stroke="#59ff9d" stroke-width="7"/>${screen}<rect x="88" y="130" width="36" height="36" fill="#15104a" stroke="#59ff9d" stroke-width="5"/><rect x="55" y="166" width="105" height="16" fill="#a94cff" stroke="#070016" stroke-width="5"/><rect x="25" y="190" width="165" height="18" fill="#0c0730" stroke="#070016" stroke-width="4"/></g>`;
  }

  function laptop(x,y) { return `<g class="px g" transform="translate(${x} ${y})"><rect x="0" y="0" width="210" height="115" fill="#06142e" stroke="#59ff9d" stroke-width="7"/><rect x="24" y="25" width="162" height="66" fill="#10135d" stroke="#a94cff" stroke-width="4"/><rect x="68" y="48" width="78" height="17" fill="#ffd44d"/><rect x="-22" y="118" width="255" height="28" fill="#a94cff" stroke="#070016" stroke-width="6"/></g>`; }
  function printer(x,y) { return `<g class="px p" transform="translate(${x} ${y})"><rect x="34" y="0" width="145" height="58" fill="#07142e" stroke="#59ff9d" stroke-width="6"/><rect x="0" y="52" width="215" height="102" fill="#26358a" stroke="#070016" stroke-width="7"/><rect x="32" y="78" width="150" height="25" fill="#090216" stroke="#59ff9d" stroke-width="5"/><rect class="paper" x="55" y="108" width="108" height="80" fill="#fff" stroke="#ff3b6b" stroke-width="5"/><rect x="75" y="134" width="68" height="8" fill="#090216"/><rect x="75" y="151" width="45" height="8" fill="#090216"/><rect x="164" y="68" width="18" height="18" fill="#ffd44d"/></g>`; }
  function phone(x,y) { return `<g class="px r shake" transform="translate(${x} ${y})"><rect x="0" y="0" width="88" height="160" rx="10" fill="#07142e" stroke="#59ff9d" stroke-width="7"/><rect x="16" y="24" width="56" height="96" fill="#10135d" stroke="#a94cff" stroke-width="4"/><circle cx="44" cy="138" r="8" fill="#ffd44d"/><path class="pulse" d="M95 30 L128 2 M100 70 L138 70 M95 110 L128 138" stroke="#ff3b6b" stroke-width="8"/></g>`; }
  function router(x,y) { return `<g class="px g" transform="translate(${x} ${y})"><rect x="35" y="118" width="185" height="58" fill="#07142e" stroke="#59ff9d" stroke-width="6"/><rect x="74" y="138" width="15" height="15" fill="#59ff9d"/><rect x="110" y="138" width="15" height="15" fill="#ffd44d"/><rect x="146" y="138" width="15" height="15" fill="#ff3b6b"/><path class="wifiPulse" d="M56 84 Q128 10 200 84" fill="none" stroke="#ffd44d" stroke-width="10"/><path class="wifiPulse" d="M85 102 Q128 58 171 102" fill="none" stroke="#59ff9d" stroke-width="10"/></g>`; }
  function cloud(x,y) { return `<g class="px p" transform="translate(${x} ${y})"><rect x="32" y="66" width="190" height="82" rx="35" fill="#a94cff" stroke="#fff" stroke-width="6"/><rect x="78" y="25" width="92" height="92" rx="42" fill="#a94cff" stroke="#fff" stroke-width="6"/><path class="pulse" d="M126 198 L126 142 M96 171 L126 142 L156 171" stroke="#ffd44d" stroke-width="11" fill="none"/></g>`; }
  function cabinet(x,y) { return `<g class="px g" transform="translate(${x} ${y})"><rect x="0" y="0" width="135" height="220" fill="#07142e" stroke="#59ff9d" stroke-width="7"/><rect x="22" y="24" width="88" height="24" fill="#a94cff"/><rect x="22" y="72" width="88" height="24" fill="#a94cff"/><rect x="22" y="120" width="88" height="24" fill="#a94cff"/><rect class="pulse" x="108" y="0" width="96" height="220" fill="#090216" stroke="#ff3b6b" stroke-width="7"/><path d="M32 176 C80 138 108 198 166 148" stroke="#ffd44d" stroke-width="7" fill="none"/></g>`; }
  function usb(x,y) { return `<g class="px r plug" transform="translate(${x} ${y})"><rect x="0" y="48" width="155" height="58" fill="#ff3b6b" stroke="#fff" stroke-width="6"/><rect x="155" y="62" width="58" height="30" fill="#ddd" stroke="#070016" stroke-width="6"/><rect x="176" y="69" width="9" height="9" fill="#070016"/><rect x="196" y="69" width="9" height="9" fill="#070016"/></g>`; }
  function envelope(x,y) { return `<g class="px r fly" transform="translate(${x} ${y})"><rect x="0" y="0" width="145" height="88" fill="#fff" stroke="#ff3b6b" stroke-width="6"/><path d="M0 0 L72 50 L145 0" fill="none" stroke="#a94cff" stroke-width="6"/></g>`; }
  function door(x,y) { return `<g class="px p" transform="translate(${x} ${y})"><rect x="0" y="0" width="135" height="205" fill="#07142e" stroke="#a94cff" stroke-width="7"/><rect x="26" y="25" width="65" height="82" fill="#112b55" stroke="#59ff9d" stroke-width="5"/><rect x="95" y="98" width="14" height="14" fill="#ffd44d"/></g>`; }
  function warn(x,y) { return `<g class="px y pulse" transform="translate(${x} ${y})"><path d="M35 0 L70 68 H0 Z" fill="#ffd44d" stroke="#070016" stroke-width="6"/><rect x="31" y="25" width="8" height="22" fill="#070016"/><rect x="31" y="54" width="8" height="8" fill="#070016"/></g>`; }

  function base(inner) { return `<svg class="sceneSvg" viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg">${styles()}${bg()}${inner}</svg>`; }

  window.renderWorkplaceDefenderScene = function(scene){
    const s = {
      office: base(`${pc(45,42,true)}<rect x="30" y="246" width="270" height="26" fill="#a94cff" stroke="#070016" stroke-width="6"/>${man(360,96,'walk')} ${woman(735,90)} ${warn(620,48)}`),
      printer: base(`${printer(45,48)}${man(420,96)}${woman(735,90)}${warn(630,48)}`),
      door: base(`${door(45,45)}${man(360,96)}${man(215,96,'walk')} ${woman(735,90)}${warn(625,48)}`),
      wifi: base(`${router(45,45)}${laptop(335,88)}${woman(735,90)}${warn(635,48)}`),
      train: base(`<g class="px"><rect x="40" y="150" width="390" height="94" fill="#07142e" stroke="#59ff9d" stroke-width="7"/><rect x="85" y="170" width="75" height="42" fill="#10135d" stroke="#a94cff" stroke-width="5"/><rect x="195" y="170" width="75" height="42" fill="#10135d" stroke="#a94cff" stroke-width="5"/></g>${man(490,90)}${woman(735,90)}${warn(630,48)}`),
      router: base(`${router(45,45)}${laptop(335,88)}${woman(735,90)}${warn(635,48)}`),
      update: base(`${laptop(45,88)}${man(395,96)}${woman(735,90)}${warn(635,48)}`),
      laptop: base(`${laptop(45,88)}${man(395,96)}${woman(735,90)}${warn(635,48)}`),
      phone: base(`${phone(95,62)}${man(395,96)}${woman(735,90)}${warn(635,48)}`),
      cloud: base(`${pc(45,52,false)}${cloud(335,45)}${woman(735,90)}${warn(635,48)}`),
      extension: base(`${pc(45,52,false)}${cloud(335,45)}${woman(735,90)}${warn(635,48)}`),
      login: base(`${pc(45,52,false)}${man(395,96)}${woman(735,90)}${warn(635,48)}`),
      cabinet: base(`${cabinet(45,35)}${man(395,96)}${woman(735,90)}${warn(635,48)}`),
      usb: base(`${laptop(45,90)}${usb(355,108)}${woman(735,90)}${warn(635,48)}`),
      incident: base(`${pc(45,52,true)}${envelope(340,75)}${woman(735,90)}${warn(635,48)}`)
    };
    return s[scene] || s.office;
  };
})();