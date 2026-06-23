(function () {
  const style = document.createElement("style");
  style.id = "workplaceDefenderLayoutFix";
  style.textContent = `
    #startScreen{
      position:fixed !important;
      inset:0 !important;
      z-index:50 !important;
      min-height:100vh !important;
      width:100vw !important;
      display:flex !important;
      flex-direction:column !important;
      align-items:center !important;
      justify-content:center !important;
      text-align:center !important;
      padding:28px !important;
      margin:0 !important;
      background:radial-gradient(circle at 50% 25%, rgba(169,76,255,0.20), rgba(9,2,22,0.97) 56%), linear-gradient(180deg, rgba(24,6,55,0.98), rgba(7,2,17,0.99)) !important;
      box-sizing:border-box !important;
    }

    #startScreen.hidden{
      display:none !important;
      visibility:hidden !important;
      opacity:0 !important;
      height:0 !important;
      min-height:0 !important;
      padding:0 !important;
      margin:0 !important;
      overflow:hidden !important;
    }

    #startScreen .logo{
      margin-left:auto !important;
      margin-right:auto !important;
    }

    #startScreen .start-title-main,
    #startScreen h1,
    #startScreen p{
      text-align:center !important;
      margin-left:auto !important;
      margin-right:auto !important;
      max-width:880px !important;
    }

    #startScreen .arcade-green-btn{
      margin-left:auto !important;
      margin-right:auto !important;
    }

    #gamePanel{
      margin-top:0 !important;
    }

    .scene-character{
      position:absolute !important;
      width:44px !important;
      height:68px !important;
      z-index:5 !important;
      border:3px solid rgba(255,255,255,.82) !important;
      border-radius:12px 12px 7px 7px !important;
      box-shadow:0 0 14px rgba(169,76,255,.35) !important;
      animation:wdCharacterBob 1.5s ease-in-out infinite !important;
    }

    .scene-character:before{
      content:"";
      position:absolute;
      width:34px;
      height:28px;
      left:2px;
      top:-26px;
      border:3px solid rgba(255,255,255,.82);
      border-radius:10px;
      background:#ffd44d;
      box-shadow:0 0 12px rgba(255,212,77,.35);
    }

    .scene-character:after{
      content:"";
      position:absolute;
      width:8px;
      height:8px;
      left:9px;
      top:-15px;
      background:#090216;
      box-shadow:16px 0 #090216, 8px 10px #090216;
    }

    .hero-character{
      left:56% !important;
      bottom:22% !important;
      background:#59ff9d !important;
      border-color:#59ff9d !important;
    }

    .risk-character{
      right:13% !important;
      bottom:21% !important;
      background:#ff3b6b !important;
      border-color:#ff3b6b !important;
      animation-delay:.25s !important;
    }

    .risk-character:before{
      background:#ff3b6b !important;
      box-shadow:0 0 12px rgba(255,59,107,.45) !important;
    }

    .risk-character:after{
      background:#ffffff !important;
      box-shadow:16px 0 #ffffff, 8px 10px #ffffff !important;
    }

    .office .hero-character,
    .printer .hero-character,
    .laptop .hero-character,
    .update .hero-character{
      left:61% !important;
      bottom:25% !important;
    }

    .door .hero-character{
      left:55% !important;
      bottom:22% !important;
    }

    .door .risk-character{
      right:20% !important;
      bottom:22% !important;
    }

    .wifi .hero-character,
    .router .hero-character,
    .train .hero-character{
      left:59% !important;
      bottom:22% !important;
    }

    .cloud .hero-character,
    .extension .hero-character,
    .login .hero-character{
      left:50% !important;
      bottom:24% !important;
    }

    .cabinet .hero-character,
    .usb .hero-character,
    .incident .hero-character{
      left:59% !important;
      bottom:24% !important;
    }

    @keyframes wdCharacterBob{
      0%,100%{transform:translateY(0);}
      50%{transform:translateY(-8px);}
    }
  `;
  document.head.appendChild(style);
})();