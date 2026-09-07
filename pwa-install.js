(function () {
  "use strict";

  var STORAGE_KEY = "dolachat-install-dismissed";
  var DISMISS_MS = 14 * 24 * 60 * 60 * 1000;
  var STYLE_ID = "dolachat-pwa-install-styles";
  var ROOT_ID = "dolachat-pwa-install";

  var deferredPrompt = null;
  var card = null;
  var shown = false;

  function isStandalone() {
    return (
      (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      window.navigator.standalone === true
    );
  }

  function isIos() {
    var ua = window.navigator.userAgent || "";
    var iOSDevice = /iPad|iPhone|iPod/.test(ua);
    var iPadOs = window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1;
    return (iOSDevice || iPadOs) && !window.MSStream;
  }

  function isLocalPreview() {
    var host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1";
  }

  function wantsForcedPreview() {
    try {
      return new URLSearchParams(window.location.search).has("preview-install");
    } catch (e) {
      return false;
    }
  }

  function wasDismissed() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var ts = parseInt(raw, 10);
      if (!Number.isFinite(ts)) return true;
      return Date.now() - ts < DISMISS_MS;
    } catch (e) {
      return false;
    }
  }

  function rememberDismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch (e) {}
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      "#" + ROOT_ID + "{position:fixed;z-index:60;top:50%;right:max(12px,env(safe-area-inset-right,0px));left:auto;bottom:auto;width:168px;height:168px;max-width:calc(100vw - 24px);box-sizing:border-box;padding:16px 12px 12px;border-radius:20px;background:#fff;color:#0f172a;box-shadow:0 10px 30px -8px rgba(15,23,42,.22),0 2px 8px rgba(15,23,42,.08);font-family:Inter,ui-sans-serif,system-ui,sans-serif;pointer-events:auto;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;transform:translateY(-50%);transform-origin:center right;animation:dolachat-pwa-in .6s cubic-bezier(.22,1.4,.36,1) both,dolachat-pwa-pop 2.4s ease-in-out .7s infinite}" +
      "#" + ROOT_ID + " *{box-sizing:border-box}" +
      "#" + ROOT_ID + " .dolachat-pwa-body{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:100%;min-width:0}" +
      "#" + ROOT_ID + " .dolachat-pwa-logo{width:48px;height:48px;border-radius:14px;object-fit:cover;flex:0 0 auto;box-shadow:0 0 0 1px rgba(14,124,123,.25);animation:dolachat-pwa-logo-pop 2.4s ease-in-out .7s infinite}" +
      "#" + ROOT_ID + " .dolachat-pwa-copy{min-width:0;width:100%}" +
      "#" + ROOT_ID + " .dolachat-pwa-title{font-family:\"Plus Jakarta Sans\",Inter,ui-sans-serif,system-ui,sans-serif;font-size:13px;font-weight:800;line-height:1.2;color:#0f172a}" +
      "#" + ROOT_ID + " .dolachat-pwa-sub{margin-top:2px;font-size:10px;font-weight:500;color:#64748b}" +
      "#" + ROOT_ID + " .dolachat-pwa-btn{width:100%;border:0;border-radius:999px;background:#ff6b5b;color:#fff;font-size:12px;font-weight:700;padding:7px 12px;cursor:pointer;white-space:nowrap;animation:dolachat-pwa-btn-pop 2.4s ease-in-out .7s infinite}" +
      "#" + ROOT_ID + " .dolachat-pwa-btn:hover{opacity:.92;animation-play-state:paused}" +
      "#" + ROOT_ID + " .dolachat-pwa-btn:active{transform:scale(.97)}" +
      "#" + ROOT_ID + " .dolachat-pwa-ios{display:none;margin:0;padding:6px 8px;border-radius:8px;background:#f8fafc;color:#475569;font-size:9px;line-height:1.35}" +
      "#" + ROOT_ID + "[data-ios=\"true\"]{height:auto;min-height:168px;width:168px}" +
      "#" + ROOT_ID + "[data-ios=\"true\"] .dolachat-pwa-ios{display:block}" +
      "@media (max-width:640px){#" + ROOT_ID + "{width:150px;height:150px;right:max(8px,env(safe-area-inset-right,0px));top:50%;transform:translateY(-50%)}}" +
      "@keyframes dolachat-pwa-in{0%{opacity:0;transform:translate(18px,-50%) scale(.4)}55%{opacity:1;transform:translate(0,-50%) scale(1.14)}75%{transform:translate(0,-50%) scale(.94)}100%{opacity:1;transform:translate(0,-50%) scale(1)}}" +
      "@keyframes dolachat-pwa-pop{0%,70%,100%{transform:translateY(-50%) scale(1);box-shadow:0 10px 30px -8px rgba(15,23,42,.22),0 2px 8px rgba(15,23,42,.08)}78%{transform:translateY(-54%) scale(1.08);box-shadow:0 16px 36px -8px rgba(255,107,91,.35),0 4px 12px rgba(15,23,42,.1)}88%{transform:translateY(-48%) scale(.97)}94%{transform:translateY(-51%) scale(1.03)}}" +
      "@keyframes dolachat-pwa-logo-pop{0%,70%,100%{transform:scale(1)}78%{transform:scale(1.1)}88%{transform:scale(.96)}}" +
      "@keyframes dolachat-pwa-btn-pop{0%,70%,100%{transform:scale(1)}78%{transform:scale(1.06)}88%{transform:scale(.98)}}" +
      "@media (prefers-reduced-motion:reduce){#" + ROOT_ID + ",#" + ROOT_ID + " .dolachat-pwa-logo,#" + ROOT_ID + " .dolachat-pwa-btn{animation:none}}";
    document.head.appendChild(style);
  }

  function hideCard() {
    if (card && card.parentNode) card.parentNode.removeChild(card);
    card = null;
    shown = false;
  }

  function showCard() {
    if (shown || isStandalone()) return;
    if (!document.body) return;

    injectStyles();
    hideCard();

    var ios = isIos();
    card = document.createElement("div");
    card.id = ROOT_ID;
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-label", "Install DolaChat");
    if (ios) card.setAttribute("data-ios", "true");

    card.innerHTML =
      '<div class="dolachat-pwa-body">' +
        '<img class="dolachat-pwa-logo" src="/denichat-logo.webp" width="48" height="48" alt="DolaChat logo">' +
        '<div class="dolachat-pwa-copy">' +
          '<div class="dolachat-pwa-title">Install DolaChat</div>' +
          '<div class="dolachat-pwa-sub">Android • iPhone</div>' +
        "</div>" +
        '<button type="button" class="dolachat-pwa-btn">Install</button>' +
        '<p class="dolachat-pwa-ios">To install DolaChat:<br>Tap Share → Add to Home Screen</p>' +
      "</div>";

    card.querySelector(".dolachat-pwa-btn").addEventListener("click", function () {
      if (deferredPrompt) {
        var promptEvent = deferredPrompt;
        deferredPrompt = null;
        promptEvent.prompt();
        promptEvent.userChoice.then(function (choice) {
          if (choice && choice.outcome === "accepted") {
            hideCard();
          }
        }).catch(function () {});
        return;
      }
      if (ios) {
        var hint = card.querySelector(".dolachat-pwa-ios");
        if (hint) hint.style.display = "block";
      }
    });

    document.body.appendChild(card);
    shown = true;
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(function () {});
  }

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferredPrompt = event;
    if (!isStandalone()) showCard();
  });

  window.addEventListener("appinstalled", function () {
    deferredPrompt = null;
    hideCard();
  });

  function start() {
    registerServiceWorker();
    if (isStandalone()) return;
    if (isIos() || isLocalPreview() || wantsForcedPreview()) {
      window.setTimeout(showCard, 600);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
