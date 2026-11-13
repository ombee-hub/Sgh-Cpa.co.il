/* ──────────────────────────────────────────────
   ששון גוטהלף הרץ — יישומון נגישות (תו נגישות)
   מותאם לשפת העיצוב של האתר: חום/זהב, גופן Assistant.
   כל אפשרות היא <button> עם aria-pressed — נגיש גם במקלדת.
────────────────────────────────────────────── */
(function () {
  "use strict";
  var KEY = 'sgh-a11y';
  var SV = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

  var features = [
    { id:'contrast',   label:'ניגודיות גבוהה', icon:`<svg ${SV}><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/></svg>` },
    { id:'grayscale',  label:'גווני אפור',      icon:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5s-6.5 7-6.5 12a6.5 6.5 0 0 0 13 0c0-5-6.5-12-6.5-12z" fill="currentColor"/></svg>` },
    { id:'bigText',    label:'הגדלת טקסט',      icon:`<svg ${SV}><path d="M3 8V6h9v2"/><path d="M7.5 6v12"/><path d="M6 18h3"/><path d="M13 12v-1.5h8V12"/><path d="M17 10.5V18"/><path d="M15.8 18h2.4"/></svg>` },
    { id:'links',      label:'הדגשת קישורים',   icon:`<svg ${SV}><path d="M9 8H7a4 4 0 0 0 0 8h2"/><path d="M15 8h2a4 4 0 0 1 0 8h-2"/><path d="M8 12h8"/></svg>` },
    { id:'spacing',    label:'ריווח אותיות',    icon:`<svg ${SV}><path d="M6 9l-3 3 3 3"/><path d="M18 9l3 3-3 3"/><path d="M3 12h2M8 12h2M14 12h2M19 12h2"/></svg>` },
    { id:'lineHeight', label:'גובה שורה',       icon:`<svg ${SV}><path d="M10 6h11M10 10h11M10 14h11M10 18h11"/><path d="M5 4v16"/><path d="M3 6l2-2 2 2"/><path d="M3 18l2 2 2-2"/></svg>` },
    { id:'dyslexia',   label:'גופן קריא',       icon:`<svg ${SV} stroke-width="2"><path d="M3 5h3.5a7 7 0 0 1 0 14H3z"/><path d="M17 19V9.5A3.5 3.5 0 0 1 20.5 6"/><path d="M14.5 11.5h6"/></svg>` },
    { id:'bigCursor',  label:'סמן גדול',        icon:`<svg ${SV}><path d="M5 3l6.5 17 2.4-7.1L21 10.5z"/></svg>` },
    { id:'stopAnim',   label:'עצירת הנפשות',    icon:`<svg ${SV}><circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/></svg>` },
    { id:'hideImages', label:'הסתרת תמונות',    icon:`<svg ${SV}><path d="M14 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5L5 20"/><path d="M17 3l4 4M21 3l-4 4"/></svg>` },
    { id:'textAlign',  label:'יישור לימין',     icon:`<svg ${SV}><path d="M3 6h18M3 10h18M3 14h18M9 18h12"/></svg>` },
    { id:'altText',    label:'תיאורי תמונות',   icon:`<svg ${SV}><path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-8l-4 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M12 9.5V13"/><path d="M12 7h.01" stroke-width="2.4"/></svg>` }
  ];

  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}

  /* ── Inject CSS ── */
  var style = document.createElement('style');
  style.textContent = `
.sgh-a11y-btn::before{content:"";position:absolute;inset:5px;border:2px solid #e2a446;border-radius:50%;pointer-events:none}
.sgh-a11y-btn{position:fixed;bottom:24px;left:24px;z-index:10000;width:50px;height:50px;border-radius:50%;border:none;background:linear-gradient(145deg,#4a382b,#2c2016);color:#fff;cursor:pointer;box-shadow:0 6px 22px rgba(44,32,22,.45);display:flex;align-items:center;justify-content:center;transition:transform .3s ease,box-shadow .3s ease}
.sgh-a11y-btn:hover{transform:scale(1.08);box-shadow:0 8px 28px rgba(44,32,22,.55)}
.sgh-a11y-btn:focus-visible{outline:3px solid #d18e36;outline-offset:3px}
.sgh-a11y-btn svg{width:26px;height:26px}
.sgh-a11y-count{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:#d18e36;color:#2c2016;font:700 11px/20px 'Assistant',sans-serif;text-align:center;display:none;box-shadow:0 0 0 2px #faf6ec}
.sgh-a11y-btn.active .sgh-a11y-count{display:block}

.sgh-a11y-overlay{position:fixed;inset:0;z-index:10000;background:rgba(44,32,22,.4);opacity:0;pointer-events:none;transition:opacity .3s ease}
.sgh-a11y-overlay.open{opacity:1;pointer-events:all}

.sgh-a11y-panel{position:fixed;top:0;bottom:0;left:0;z-index:10001;width:300px;max-width:100vw;overflow-y:auto;overscroll-behavior:contain;background:#faf6ec;border-radius:0 18px 18px 0;box-shadow:8px 0 40px rgba(44,32,22,.28);transform:translateX(-105%);visibility:hidden;transition:transform .35s cubic-bezier(.4,0,.2,1),visibility 0s linear .35s;direction:rtl;font-family:'Assistant',sans-serif;color:#2e2419}
.sgh-a11y-panel.open{transform:none;visibility:visible;transition:transform .35s cubic-bezier(.4,0,.2,1)}
.sgh-a11y-panel::-webkit-scrollbar{width:6px}
.sgh-a11y-panel::-webkit-scrollbar-thumb{background:rgba(209,142,54,.4);border-radius:6px}

.sgh-a11y-header{position:sticky;top:0;z-index:2;background:#2c2016;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:16px}
.sgh-a11y-title{font-size:18px;font-weight:700;color:#fff;margin:0;display:flex;align-items:center;gap:9px;font-family:'Assistant',sans-serif}
.sgh-a11y-title-ico{color:#e2a446;display:flex;align-items:center;flex-shrink:0}
.sgh-a11y-title-ico svg{width:26px;height:26px}
.sgh-a11y-close{width:30px;height:30px;border-radius:50%;border:none;background:rgba(255,255,255,.14);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s}
.sgh-a11y-close:hover{background:#d18e36}
.sgh-a11y-close svg{width:15px;height:15px}
.sgh-a11y-close:focus-visible{outline:3px solid #e2a446;outline-offset:2px}

.sgh-a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px 14px 10px}
.sgh-a11y-item{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:11px;min-height:104px;padding:14px 6px;position:relative;border:2px solid #ece2cd;border-radius:12px;background:#fff;color:#2e2419;font-family:'Assistant',sans-serif;cursor:pointer;text-align:center;box-shadow:0 2px 10px rgba(44,32,22,.08);transition:border-color .2s,box-shadow .2s,background .2s,color .2s}
.sgh-a11y-item:hover{border-color:#d18e36;box-shadow:0 6px 16px rgba(44,32,22,.14)}
.sgh-a11y-item:focus-visible{outline:3px solid #4a382b;outline-offset:2px}
.sgh-a11y-item[aria-pressed="true"]{background:#d18e36;border-color:#d18e36;color:#fff}
.sgh-a11y-ico{display:flex;align-items:center;justify-content:center;width:30px;height:30px;color:#d18e36}
.sgh-a11y-item[aria-pressed="true"] .sgh-a11y-ico{color:#fff}
.sgh-a11y-ico svg{width:100%;height:100%}
.sgh-a11y-item-label{font-size:13.5px;font-weight:700;line-height:1.25}
.sgh-a11y-check{position:absolute;top:7px;right:7px;width:18px;height:18px;border-radius:50%;background:#fff;color:#d18e36;display:none;align-items:center;justify-content:center}
.sgh-a11y-check svg{width:11px;height:11px}
.sgh-a11y-item[aria-pressed="true"] .sgh-a11y-check{display:flex}

.sgh-a11y-reset{display:flex;align-items:center;justify-content:center;gap:10px;width:calc(100% - 28px);margin:6px 14px 12px;padding:13px 14px;border:none;border-radius:10px;background:#4a382b;color:#fff;box-shadow:0 6px 18px rgba(44,32,22,.25);font:700 14px 'Assistant',sans-serif;cursor:pointer;transition:background .2s}
.sgh-a11y-reset:hover{background:#2c2016}
.sgh-a11y-reset:focus-visible{outline:3px solid #d18e36;outline-offset:2px}
.sgh-a11y-reset svg{width:20px;height:20px;flex-shrink:0}

.sgh-a11y-bottom{padding:0 14px 16px;display:grid;grid-template-columns:1fr 1fr;gap:10px}
.sgh-a11y-bottom a{display:flex;align-items:center;justify-content:center;gap:6px;padding:12px 4px;border-radius:10px;background:#fff;border:1.5px solid #d18e36;font:700 12.5px 'Assistant',sans-serif;color:#7a5214;text-decoration:none;transition:background .2s,color .2s}
.sgh-a11y-bottom a:hover{background:#d18e36;color:#fff}
.sgh-a11y-bottom a:focus-visible{outline:3px solid #4a382b;outline-offset:2px}
.sgh-a11y-bottom svg{width:16px;height:16px;flex-shrink:0}

/* ── Applied styles ── */
html.a11y-contrast{filter:contrast(1.4)!important}
html.a11y-grayscale{filter:grayscale(1)!important}
html.a11y-contrast.a11y-grayscale{filter:contrast(1.4) grayscale(1)!important}
html.a11y-bigText body>:not(.sgh-a11y-root) :is(p,li,a,span,label,h1,h2,h3,h4,h5,h6,td,blockquote,button,input,textarea):not(:is(p,li,a,span,label,h1,h2,h3,h4,h5,h6,td,blockquote,button,input,textarea) *){zoom:1.15}
html.a11y-spacing body>:not(.sgh-a11y-root) *{letter-spacing:.06em!important;word-spacing:.14em!important}
html.a11y-lineHeight body>:not(.sgh-a11y-root) :is(p,li,a,span,label,h1,h2,h3,h4,td,div){line-height:2!important}
html.a11y-links body>:not(.sgh-a11y-root) a{text-decoration:underline!important;outline:2px solid #d18e36!important;outline-offset:2px!important}
html.a11y-hideImages body>:not(.sgh-a11y-root) img{opacity:0!important}
html.a11y-stopAnim *,html.a11y-stopAnim *::before,html.a11y-stopAnim *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
html.a11y-bigCursor,html.a11y-bigCursor *{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M8 8l12 30 5-15 15-5z' fill='%23d18e36' stroke='%23fff' stroke-width='2.5'/%3E%3C/svg%3E") 8 8,auto!important}
html.a11y-dyslexia body>:not(.sgh-a11y-root) *{font-family:Arial,'Segoe UI',sans-serif!important}
html.a11y-textAlign body>:not(.sgh-a11y-root) :is(p,li,h1,h2,h3,h4,td,blockquote){text-align:right!important}
.sgh-alt-cap{display:block;font:600 12px/1.4 'Assistant',sans-serif;color:#2c2016;background:#f4ead0;border:1px solid #ded5a6;padding:4px 8px;border-radius:6px;margin:4px auto;max-width:92%;direction:rtl;text-align:center}

@media(max-width:480px){.sgh-a11y-btn{bottom:16px;left:16px}}
@media(prefers-reduced-motion:reduce){.sgh-a11y-panel,.sgh-a11y-overlay,.sgh-a11y-btn{transition:none}}
`;
  document.head.appendChild(style);

  var A11Y_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="3.8" r="2.2"/><path d="M20.5 8.7c-2.6.7-5.5 1.1-8.5 1.1s-5.9-.4-8.5-1.1c-.5-.1-1 .2-1.1.7-.1.5.2 1 .7 1.1 2.3.6 4.7 1 7.2 1.1v3.6L7.5 21c-.2.5 0 1.1.5 1.3.5.2 1.1 0 1.3-.5L11.7 16h.6l2.4 5.8c.2.5.8.7 1.3.5.5-.2.7-.8.5-1.3L13.7 15v-3.5c2.5-.1 4.9-.5 7.2-1.1.5-.1.8-.6.7-1.1-.1-.5-.6-.8-1.1-.7z"/></svg>';

  /* ── Build ── */
  var wrapper = document.createElement('div');
  wrapper.className = 'sgh-a11y-root';
  wrapper.innerHTML = `
<button class="sgh-a11y-btn" type="button" aria-label="פתיחת תפריט נגישות" aria-haspopup="dialog" aria-expanded="false" aria-controls="sghA11yPanel" title="נגישות">
  ${A11Y_ICON}<span class="sgh-a11y-count" aria-hidden="true"></span>
</button>
<div class="sgh-a11y-overlay"></div>
<div class="sgh-a11y-panel" id="sghA11yPanel" role="dialog" aria-modal="true" aria-label="תפריט נגישות">
  <div class="sgh-a11y-header">
    <h2 class="sgh-a11y-title"><span class="sgh-a11y-title-ico">${A11Y_ICON}</span>תפריט נגישות</h2>
    <button class="sgh-a11y-close" type="button" aria-label="סגירת תפריט הנגישות">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
    </button>
  </div>
  <div class="sgh-a11y-grid">
    ${features.map(function (f) { return `
      <button type="button" class="sgh-a11y-item" data-feature="${f.id}" aria-pressed="false">
        <span class="sgh-a11y-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></span>
        <span class="sgh-a11y-ico">${f.icon}</span>
        <span class="sgh-a11y-item-label">${f.label}</span>
      </button>`; }).join('')}
  </div>
  <button class="sgh-a11y-reset" type="button">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 21v-5h-5"/></svg>
    איפוס כל הגדרות הנגישות
  </button>
  <div class="sgh-a11y-bottom">
    <a href="accessibility-statement.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>הצהרת נגישות</a>
    <a href="privacy-policy.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>מדיניות פרטיות</a>
  </div>
</div>`;

  document.body.appendChild(wrapper);

  var btn     = wrapper.querySelector('.sgh-a11y-btn');
  var count   = wrapper.querySelector('.sgh-a11y-count');
  var panel   = wrapper.querySelector('.sgh-a11y-panel');
  var overlay = wrapper.querySelector('.sgh-a11y-overlay');
  var closeBtn = wrapper.querySelector('.sgh-a11y-close');
  var items   = wrapper.querySelectorAll('.sgh-a11y-item');
  var resetBtn = wrapper.querySelector('.sgh-a11y-reset');

  function openPanel() {
    panel.classList.add('open'); overlay.classList.add('open');
    btn.style.visibility = 'hidden'; btn.setAttribute('aria-expanded', 'true');
    setTimeout(function () { closeBtn.focus(); }, 50);
  }
  function closePanel() {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open'); overlay.classList.remove('open');
    btn.style.visibility = ''; btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  }

  function setAltCaptions(on) {
    document.querySelectorAll('.sgh-alt-cap').forEach(function (c) { c.remove(); });
    if (!on) return;
    document.querySelectorAll('body img[alt]').forEach(function (img) {
      if (!img.alt.trim() || wrapper.contains(img)) return;
      var cap = document.createElement('span');
      cap.className = 'sgh-alt-cap';
      cap.textContent = img.alt;
      img.insertAdjacentElement('afterend', cap);
    });
  }

  function applyState() {
    var n = 0;
    features.forEach(function (f) {
      var isOn = !!state[f.id];
      if (isOn) n++;
      document.documentElement.classList.toggle('a11y-' + f.id, isOn);
      var el = wrapper.querySelector('[data-feature="' + f.id + '"]');
      if (el) el.setAttribute('aria-pressed', String(isOn));
    });
    setAltCaptions(!!state.altText);
    btn.classList.toggle('active', n > 0);
    count.textContent = n || '';
    btn.setAttribute('aria-label', n ? 'פתיחת תפריט נגישות (' + n + ' הגדרות פעילות)' : 'פתיחת תפריט נגישות');
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyState);
  else applyState();

  btn.addEventListener('click', function (e) { e.stopPropagation(); openPanel(); });
  closeBtn.addEventListener('click', function (e) { e.stopPropagation(); closePanel(); });
  overlay.addEventListener('click', closePanel);

  items.forEach(function (item) {
    item.addEventListener('click', function () {
      var id = item.dataset.feature;
      state[id] = !state[id];
      save();
      applyState();
    });
  });

  resetBtn.addEventListener('click', function () {
    state = {};
    save();
    applyState();
  });

  document.addEventListener('keydown', function (e) {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') { closePanel(); return; }
    if (e.key !== 'Tab') return;
    var f = Array.prototype.slice.call(panel.querySelectorAll('button,a[href]')).filter(function (el) { return el.offsetParent !== null; });
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
