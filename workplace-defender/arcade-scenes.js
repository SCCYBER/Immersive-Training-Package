(function () {
  function css() {
    return `<style>
      .arcade-scene-svg{width:100%;height:100%;display:block;background:#090216;image-rendering:pixelated;}
      .px{shape-rendering:crispEdges;}
      .neon{filter:drop-shadow(0 0 6px #a94cff)}
      .green-glow{filter:drop-shadow(0 0 7px #59ff9d)}
      .red-glow{filter:drop-shadow(0 0 7px #ff3b6b)}
      .amber-glow{filter:drop-shadow(0 0 7px #ffd44d)}
      .bob{animation:wdBob 1.25s steps(2,end) infinite;}
      .walkAway{animation:wdWalkAway 4.2s steps(8,end) infinite;}
      .paperOut{animation:wdPaperOut 2.2s steps(5,end) infinite;}
      .tailgate{animation:wdTailgate 3.3s steps(7,end) infinite;}
      .wifiPulse{animation:wdPulse 1.1s steps(2,end) infinite;}
      .trainMove{animation:wdTrainMove 2.8s steps(7,end) infinite;}
      .phoneShake{animation:wdShake 1.2s steps(3,end) infinite;}
      .cloudUpload{animation:wdCloudUpload 1.8s steps(4,end) infinite;}
      .cabinetDoor{animation:wdCabinetDoor 1.6s steps(2,end) infinite;transform-origin:325px 65px;}
      .usbPlug{animation:wdUsbPlug 1.7s steps(4,end) infinite;}
      .emailFly{animation:wdEmailFly 2.4s steps(7,end) infinite;}
      @keyframes wdBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      @keyframes wdWalkAway{0%,18%{transform:translate(0,0)}72%,100%{transform:translate(245px,0)}}
      @keyframes wdPaperOut{0%{transform:translateY(-20px);opacity:.2}45%,100%{transform:translateY(45px);opacity:1}}
      @keyframes wdTailgate{0%,20%{transform:translateX(0)}70%,100%{transform:translateX(155px)}}
      @keyframes wdPulse{0%,100%{opacity:1}50%{opacity:.25}}
      @keyframes wdTrainMove{0%{transform:translateX(-55px)}100%{transform:translateX(55px)}}
      @keyframes wdShake{0%,100%{transform:rotate(0deg)}33%{transform:rotate(-4deg)}66%{transform:rotate(4deg)}}
      @keyframes wdCloudUpload{0%{transform:translateY(35px);opacity:.25}70%,100%{transform:translateY(-25px);opacity:1}}
      @keyframes wdCabinetDoor{0%,100%{transform:skewY(0deg)}50%{transform:skewY(-8deg)}}
      @keyframes wdUsbPlug{0%,100%{transform:translateX(0)}50%{transform:translateX(-42px)}}
      @keyframes wdEmailFly{0%{transform:translateX(0)}72%,100%{transform:translateX(210px)}}
    </style>`;
  }

  function bg() {
    return `<defs>
      <linearGradient id="wdBg" x1="0" x2="1"><stop stop-color="#051d4d"/><stop offset=".5" stop-color="#17083e"/><stop offset="1" stop-color="#5c064d"/></linearGradient>
      <linearGradient id="screenGrad" x1="0" x2="1"><stop stop-color="#061b16"/><stop offset="1" stop-color="#103c47"/></linearGradient>
    </defs>
    <rect width="900" height="330" fill="#090216"/>
    <rect width="900" height="330" fill="url(#wdBg)" opacity=".98"/>
    <g opacity=".22">
      ${Array.from({ length: 30 }).map((_, i) => `<rect x="${18 + i * 31}" y="${18 + (i % 8) * 32}" width="${18 + (i % 3) * 18}" height="6" fill="${i % 3 === 0 ? '#59ff9d' : i % 3 === 1 ? '#a94cff' : '#ff3b6b'}"/>`).join("")}
    </g>
    <g opacity=".18">${Array.from({ length: 9 }).map((_, i) => `<line x1="0" y1="${40 + i * 32}" x2="900" y2="${40 + i * 32}" stroke="#ffffff" stroke-width="2"/>`).join("")}</g>`;
  }

  function man(x, y, cls = "bob") {
    return `<g class="px ${cls}" transform="translate(${x} ${y})">
      <rect x="10" y="6" width="82" height="28" fill="#183ea8" stroke="#070016" stroke-width="5"/>
      <rect x="0" y="28" width="96" height="72" fill="#c9855d" stroke="#070016" stroke-width="5"/>
      <rect x="20" y="51" width="11" height="11" fill="#070016"/><rect x="64" y="51" width="11" height="11" fill="#070016"/>
      <rect x="39" y="77" width="24" height="7" fill="#070016"/>
      <rect x="7" y="102" width="82" height="72" fill="#1556ff" stroke="#070016" stroke-width="5"/>
      <rect x="-12" y="112" width="24" height="58" fill="#c9855d" stroke="#070016" stroke-width="5"/>
      <rect x="84" y="112" width="24" height="58" fill="#c9855d" stroke="#070016" stroke-width="5"/>
      <rect x="21" y="174" width="25" height="42" fill="#07142e" stroke="#070016" stroke-width="5"/>
      <rect x="55" y="174" width="25" height="42" fill="#07142e" stroke="#070016" stroke-width="5"/>
    </g>`;
  }

  function woman(x, y, cls = "bob") {
    return `<g class="px ${cls}" transform="translate(${x} ${y})">
      <rect x="-2" y="0" width="106" height="90" fill="#ff4fa3" stroke="#070016" stroke-width="5"/>
      <rect x="15" y="34" width="74" height="66" fill="#efaa72" stroke="#070016" stroke-width="5"/>
      <rect x="31" y="57" width="11" height="11" fill="#070016"/><rect x="64" y="57" width="11" height="11" fill="#070016"/>
      <rect x="43" y="82" width="24" height="7" fill="#070016"/>
      <rect x="11" y="104" width="84" height="74" fill="#ffd44d" stroke="#070016" stroke-width="5"/>
      <rect x="-10" y="116" width="25" height="58" fill="#efaa72" stroke="#070016" stroke-width="5"/>
      <rect x="91" y="116" width="25" height="58" fill="#efaa72" stroke="#070016" stroke-width="5"/>
      <rect x="24" y="178" width="25" height="42" fill="#601a98" stroke="#070016" stroke-width="5"/>
      <rect x="58" y="178" width="25" height="42" fill="#601a98" stroke="#070016" stroke-width="5"/>
    </g>`;
  }

  function pc(x, y, label = "CUSTOMER DATA") {
    return `<g class="px green-glow" transform="translate(${x} ${y})">
      <rect x="0" y="0" width="210" height="124" rx="4" fill="#06142e" stroke="#59ff9d" stroke-width="7"/>
      <rect x="20" y="20" width="170" height="78" fill="url(#screenGrad)" stroke="#163f3f" stroke-width="4"/>
      <text x="32" y="45" fill="#59ff9d" font-size="13" font-family="monospace">${label}</text>
      <rect x="32" y="60" width="120" height="9" fill="#ffd44d"/><rect x="32" y="76" width="145" height="9" fill="#59ff9d"/><rect x="32" y="92" width="92" height="9" fill="#a94cff"/>
      <rect x="86" y="124" width="38" height="34" fill="#19124e" stroke="#59ff9d" stroke-width="5"/>
      <rect x="55" y="158" width="100" height="15" fill="#a94cff" stroke="#070016" stroke-width="5"/>
      <rect x="30" y="182" width="150" height="18" fill="#0c0730" stroke="#070016" stroke-width="4"/>
    </g>`;
  }

  function printer(x, y) {
    return `<g class="px neon" transform="translate(${x} ${y})">
      <rect x="32" y="0" width="150" height="58" fill="#07142e" stroke="#59ff9d" stroke-width="6"/>
      <rect x="0" y="50" width="215" height="100" fill="#24358d" stroke="#070016" stroke-width="7"/>
      <rect x="32" y="76" width="150" height="26" fill="#090216" stroke="#59ff9d" stroke-width="5"/>
      <rect class="paperOut" x="55" y="115" width="108" height="74" fill="#fff" stroke="#ff3b6b" stroke-width="5"/>
      <text x="68" y="145" fill="#090216" font-size="14" font-family="monospace">PAYROLL</text>
      <rect x="164" y="65" width="18" height="18" fill="#ffd44d"/>
    </g>`;
  }

  function door(x, y) {
    return `<g class="px neon" transform="translate(${x} ${y})">
      <rect x="0" y="0" width="136" height="205" fill="#07142e" stroke="#a94cff" stroke-width="7"/>
      <rect x="25" y="24" width="65" height="82" fill="#112b55" stroke="#59ff9d" stroke-width="5"/>
      <rect x="96" y="95" width="14" height="14" fill="#ffd44d"/>
      <text x="0" y="238" fill="#ffd44d" font-size="17" font-family="monospace">SECURE DOOR</text>
    </g>`;
  }

  function wifi(x, y) {
    return `<g class="px neon" transform="translate(${x} ${y})">
      <rect x="42" y="112" width="180" height="60" fill="#07142e" stroke="#59ff9d" stroke-width="6"/>
      <rect x="80" y="132" width="15" height="15" fill="#59ff9d"/><rect x="116" y="132" width="15" height="15" fill="#ffd44d"/><rect x="152" y="132" width="15" height="15" fill="#ff3b6b"/>
      <path class="wifiPulse" d="M64 78 Q132 8 200 78" fill="none" stroke="#ffd44d" stroke-width="9"/>
      <path class="wifiPulse" d="M88 96 Q132 52 176 96" fill="none" stroke="#59ff9d" stroke-width="9"/>
      <text x="30" y="208" fill="#fff" font-size="17" font-family="monospace">PUBLIC WIFI</text>
    </g>`;
  }

  function laptop(x, y, label = "UPDATE READY") {
    return `<g class="px green-glow" transform="translate(${x} ${y})">
      <rect x="0" y="0" width="215" height="120" fill="#06142e" stroke="#59ff9d" stroke-width="7"/>
      <rect x="24" y="24" width="167" height="72" fill="#10135d" stroke="#a94cff" stroke-width="4"/>
      <text x="34" y="65" fill="#ffd44d" font-size="16" font-family="monospace">${label}</text>
      <rect x="-22" y="123" width="260" height="28" fill="#a94cff" stroke="#070016" stroke-width="6"/>
    </g>`;
  }

  function phone(x, y) {
    return `<g class="px phoneShake red-glow" transform="translate(${x} ${y})">
      <rect x="0" y="0" width="92" height="165" rx="10" fill="#07142e" stroke="#59ff9d" stroke-width="7"/>
      <rect x="16" y="24" width="60" height="100" fill="#10135d" stroke="#a94cff" stroke-width="4"/>
      <rect x="37" y="138" width="18" height="9" fill="#ffd44d"/>
      <text x="-7" y="197" fill="#ff3b6b" font-size="17" font-family="monospace">LOST PHONE</text>
    </g>`;
  }

  function cloud(x, y, label = "UPLOAD?") {
    return `<g class="px neon" transform="translate(${x} ${y})">
      <rect x="35" y="55" width="185" height="80" rx="35" fill="#a94cff" stroke="#fff" stroke-width="6"/>
      <rect x="75" y="20" width="90" height="90" rx="42" fill="#a94cff" stroke="#fff" stroke-width="6"/>
      <text x="72" y="105" fill="#fff" font-size="22" font-family="monospace">${label}</text>
      <path class="cloudUpload" d="M130 190 L130 140 M100 168 L130 140 L160 168" stroke="#ffd44d" stroke-width="10" fill="none"/>
    </g>`;
  }

  function cabinet(x, y) {
    return `<g class="px neon" transform="translate(${x} ${y})">
      <rect x="0" y="0" width="130" height="215" fill="#07142e" stroke="#59ff9d" stroke-width="7"/>
      <rect x="22" y="22" width="85" height="24" fill="#a94cff"/><rect x="22" y="68" width="85" height="24" fill="#a94cff"/><rect x="22" y="114" width="85" height="24" fill="#a94cff"/>
      <rect class="cabinetDoor" x="108" y="0" width="98" height="215" fill="#090216" stroke="#ff3b6b" stroke-width="7"/>
      <path d="M32 170 C80 130 105 198 160 145" stroke="#ffd44d" stroke-width="7" fill="none"/>
      <text x="0" y="250" fill="#ff3b6b" font-size="17" font-family="monospace">OPEN CABINET</text>
    </g>`;
  }

  function usb(x, y) {
    return `<g class="px usbPlug red-glow" transform="translate(${x} ${y})">
      <rect x="0" y="48" width="155" height="58" fill="#ff3b6b" stroke="#fff" stroke-width="6"/>
      <rect x="155" y="62" width="58" height="30" fill="#ddd" stroke="#070016" stroke-width="6"/>
      <rect x="175" y="68" width="9" height="9" fill="#070016"/><rect x="196" y="68" width="9" height="9" fill="#070016"/>
      <text x="17" y="84" fill="#fff" font-size="16" font-family="monospace">UNKNOWN USB</text>
    </g>`;
  }

  function email(x, y) {
    return `<g class="px emailFly red-glow" transform="translate(${x} ${y})">
      <rect x="0" y="0" width="145" height="88" fill="#fff" stroke="#ff3b6b" stroke-width="6"/>
      <path d="M0 0 L72 50 L145 0" fill="none" stroke="#a94cff" stroke-width="6"/>
      <text x="10" y="122" fill="#ff3b6b" font-size="17" font-family="monospace">WRONG SEND</text>
    </g>`;
  }

  function warning(x, y, mark = "!") {
    return `<g class="px warn amber-glow" transform="translate(${x} ${y})"><rect x="0" y="0" width="70" height="70" fill="#ffd44d" stroke="#070016" stroke-width="6"/><text x="25" y="50" fill="#070016" font-size="42" font-family="monospace">${mark}</text></g>`;
  }

  function base(inner) {
    return `<svg class="arcade-scene-svg" viewBox="0 0 900 330" xmlns="http://www.w3.org/2000/svg">${css()}${bg()}${inner}</svg>`;
  }

  window.renderWorkplaceDefenderScene = function (scene) {
    const scenes = {
      office: base(`${pc(55,42)}<rect x="35" y="248" width="270" height="26" fill="#a94cff" stroke="#070016" stroke-width="6"/>${man(300,106,"walkAway")} ${woman(720,98,"bob")} ${warning(595,48)}`),
      printer: base(`${printer(55,48)}${man(330,105)}${woman(708,98)}${warning(598,48)}`),
      door: base(`${door(70,38)}${man(305,105)}${man(150,105,"tailgate")} ${woman(690,98)}${warning(560,48)}`),
      wifi: base(`${wifi(60,44)}${laptop(320,82,"VPN?")} ${woman(710,98)}${warning(610,48)}`),
      train: base(`<g class="trainMove"><rect x="45" y="150" width="460" height="94" fill="#07142e" stroke="#59ff9d" stroke-width="7"/><rect x="95" y="170" width="75" height="42" fill="#10135d" stroke="#a94cff" stroke-width="5"/><rect x="205" y="170" width="75" height="42" fill="#10135d" stroke="#a94cff" stroke-width="5"/></g><text x="105" y="275" fill="#ffd44d" font-size="20" font-family="monospace">PUBLIC TRAIN</text>${man(395,95)}${woman(705,98)}${warning(600,48)}`),
      router: base(`${wifi(55,44)}${laptop(335,82,"HOME ROUTER")} ${woman(720,98)}${warning(610,48)}`),
      update: base(`${laptop(60,82,"UPDATE READY")} ${man(350,105)} ${woman(705,98)} ${warning(610,48)}`),
      laptop: base(`${laptop(60,82,"WORK LAPTOP")} ${man(350,105)} ${woman(705,98)} ${warning(610,48)}`),
      phone: base(`${phone(105,58)} ${man(350,105)} ${woman(705,98)} ${warning(585,48)}`),
      cloud: base(`${pc(55,50,"CLIENT FILE")} ${cloud(350,38,"UPLOAD?")} ${woman(710,98)} ${warning(610,48)}`),
      extension: base(`${pc(55,50,"EXTENSION?")} ${cloud(350,38,"INSTALL")} ${woman(710,98)} ${warning(610,48)}`),
      login: base(`${pc(55,50,"SHARED LOGIN")} ${man(355,105)} ${woman(705,98)} ${warning(610,48)}`),
      cabinet: base(`${cabinet(65,32)} ${man(365,105)} ${woman(710,98)} ${warning(610,48)}`),
      usb: base(`${laptop(65,84,"COMPANY PC")} ${usb(380,112)} ${woman(720,98)} ${warning(620,48)}`),
      incident: base(`${pc(55,50,"SENSITIVE FILE")} ${email(350,72)} ${woman(720,98)} ${warning(615,48)}`)
    };
    return scenes[scene] || scenes.office;
  };
})();