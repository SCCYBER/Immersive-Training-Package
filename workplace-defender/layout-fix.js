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

    #startScreen .logo{margin-left:auto !important;margin-right:auto !important;}
    #startScreen .start-title-main,#startScreen h1,#startScreen p{text-align:center !important;margin-left:auto !important;margin-right:auto !important;max-width:880px !important;}
    #startScreen .arcade-green-btn{margin-left:auto !important;margin-right:auto !important;}
    #gamePanel{margin-top:0 !important;}

    .pixel-person{
      position:absolute !important;
      width:96px !important;
      height:148px !important;
      z-index:8 !important;
      image-rendering:pixelated !important;
      filter:drop-shadow(0 0 12px rgba(169,76,255,.55)) !important;
      animation:wdCharacterBob 1.6s ease-in-out infinite !important;
    }

    .pixel-person *{position:absolute !important;box-sizing:border-box !important;}

    .pixel-person .face{
      width:64px !important;
      height:58px !important;
      left:16px !important;
      top:28px !important;
      background:#f1a36d !important;
      border:4px solid #090216 !important;
      box-shadow:0 0 0 3px rgba(255,255,255,.72), inset -8px -8px rgba(78,31,79,.14) !important;
    }

    .pixel-person .hair{
      width:78px !important;
      height:34px !important;
      left:9px !important;
      top:13px !important;
      background:#22346f !important;
      border:4px solid #090216 !important;
      box-shadow:0 0 0 3px rgba(255,255,255,.42) !important;
    }

    .pixel-person .eye{
      width:9px !important;
      height:9px !important;
      top:20px !important;
      background:#090216 !important;
      box-shadow:0 0 0 2px rgba(255,255,255,.55) !important;
    }

    .pixel-person .eye.left{left:14px !important;}
    .pixel-person .eye.right{right:14px !important;}

    .pixel-person .mouth{
      width:25px !important;
      height:6px !important;
      left:19px !important;
      bottom:13px !important;
      background:#090216 !important;
    }

    .pixel-person .body{
      width:70px !important;
      height:58px !important;
      left:13px !important;
      top:88px !important;
      background:#1d5fff !important;
      border:4px solid #090216 !important;
      box-shadow:0 0 0 3px rgba(255,255,255,.46), inset -10px -8px rgba(9,2,22,.24) !important;
    }

    .pixel-person .arm{
      width:20px !important;
      height:56px !important;
      top:92px !important;
      background:#f1a36d !important;
      border:4px solid #090216 !important;
    }

    .pixel-person .arm.left{left:0 !important;transform:rotate(8deg) !important;}
    .pixel-person .arm.right{right:0 !important;transform:rotate(-8deg) !important;}

    .pixel-person .leg{
      width:24px !important;
      height:34px !important;
      top:138px !important;
      background:#07142e !important;
      border:4px solid #090216 !important;
    }

    .pixel-person .leg.left{left:18px !important;}
    .pixel-person .leg.right{right:18px !important;}

    .arcade-man{
      left:56% !important;
      bottom:12% !important;
    }

    .arcade-man .hair{
      background:#1d5fff !important;
      height:28px !important;
      top:10px !important;
      border-radius:2px !important;
    }

    .arcade-man .hair:after{
      content:"";
      position:absolute;
      width:34px;
      height:18px;
      right:-18px;
      top:5px;
      background:#1d5fff;
      border:4px solid #090216;
    }

    .arcade-man .face{
      background:#d8895d !important;
    }

    .arcade-man .body{
      background:#1336a8 !important;
    }

    .arcade-woman{
      right:11% !important;
      bottom:12% !important;
      animation-delay:.22s !important;
    }

    .arcade-woman .hair{
      width:88px !important;
      height:66px !important;
      left:4px !important;
      top:5px !important;
      background:#ff4fa3 !important;
      border-radius:14px 14px 6px 6px !important;
    }

    .arcade-woman .face{
      background:#f0b06f !important;
      top:34px !important;
    }

    .arcade-woman .body{
      background:#ffd44d !important;
    }

    .arcade-woman .leg{
      background:#601a98 !important;
    }

    .office .arcade-man,.printer .arcade-man,.laptop .arcade-man,.update .arcade-man{left:54% !important;bottom:12% !important;}
    .office .arcade-woman,.printer .arcade-woman,.laptop .arcade-woman,.update .arcade-woman{right:10% !important;bottom:12% !important;}

    .door .arcade-man{left:47% !important;bottom:11% !important;}
    .door .arcade-woman{right:15% !important;bottom:11% !important;}

    .wifi .arcade-man,.router .arcade-man,.train .arcade-man{left:53% !important;bottom:11% !important;}
    .wifi .arcade-woman,.router .arcade-woman,.train .arcade-woman{right:10% !important;bottom:11% !important;}

    .cloud .arcade-man,.extension .arcade-man,.login .arcade-man{left:48% !important;bottom:12% !important;}
    .cloud .arcade-woman,.extension .arcade-woman,.login .arcade-woman{right:10% !important;bottom:12% !important;}

    .cabinet .arcade-man,.usb .arcade-man,.incident .arcade-man{left:54% !important;bottom:12% !important;}
    .cabinet .arcade-woman,.usb .arcade-woman,.incident .arcade-woman{right:10% !important;bottom:12% !important;}

    .scene-character,.hero-character,.risk-character{display:none !important;}

    @keyframes wdCharacterBob{
      0%,100%{transform:translateY(0);}
      50%{transform:translateY(-7px);}
    }
  `;
  document.head.appendChild(style);
})();