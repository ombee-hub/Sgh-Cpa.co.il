/* ──────────────────────────────────────────────
   ששון גוטהלף הרץ — באנר עוגיות (Cookie Consent)
   רחב, בתחתית המסך, בשפת העיצוב של האתר: חום/זהב.
   מוצג רק בדף הבית, ומופיע מחדש בכל כניסה חדשה לאתר
   (נשמר ב-sessionStorage — לא חוזר תוך אותה גלישה לאחר בחירה).
────────────────────────────────────────────── */
(function () {
  "use strict";
  var KEY = 'sgh-cookie';

  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}

  var COOKIE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5h.01"/><path d="M16 15.5h.01"/><path d="M12 12h.01"/><path d="M7 14h.01"/><path d="M17 9h.01"/></svg>';

  var style = document.createElement('style');
  style.textContent = `
.sgh-cookie{position:fixed;left:0;right:0;bottom:0;z-index:9998;direction:rtl;
  font-family:'Assistant',sans-serif;color:#fff;
  background:linear-gradient(120deg,#2c2016 0%,#3a2c1e 100%);
  border-top:3px solid #d18e36;box-shadow:0 -10px 40px rgba(44,32,22,.35);
  transform:translateY(120%);transition:transform .45s cubic-bezier(.4,0,.2,1)}
.sgh-cookie.show{transform:none}
.sgh-cookie-in{max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:26px;
  padding:16px 24px;flex-wrap:wrap}
.sgh-cookie-ico{flex:none;width:46px;height:46px;border-radius:12px;display:flex;align-items:center;
  justify-content:center;background:rgba(210,142,54,.16);color:#e2a446}
.sgh-cookie-ico svg{width:26px;height:26px}
.sgh-cookie-txt{flex:1 1 320px;min-width:260px;font-size:14.5px;line-height:1.55;color:#ece3d2}
.sgh-cookie-txt b{color:#fff;font-weight:700}
.sgh-cookie-txt a{color:#e2a446;font-weight:700;text-decoration:underline;text-underline-offset:2px}
.sgh-cookie-txt a:hover{color:#f0c072}
.sgh-cookie-actions{flex:none;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.sgh-cookie-btn{font-family:'Assistant',sans-serif;font-weight:700;font-size:14.5px;cursor:pointer;
  border-radius:9px;padding:11px 24px;border:1.6px solid transparent;transition:transform .2s,box-shadow .2s,background .2s,color .2s}
.sgh-cookie-btn:focus-visible{outline:3px solid #e2a446;outline-offset:2px}
.sgh-cookie-accept{background:#d18e36;color:#2c2016;box-shadow:0 6px 18px rgba(209,142,54,.3)}
.sgh-cookie-accept:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(209,142,54,.42)}
.sgh-cookie-reject{background:transparent;color:#ece3d2;border-color:rgba(255,255,255,.28)}
.sgh-cookie-reject:hover{background:rgba(255,255,255,.1);border-color:#d18e36;color:#fff}
@media(max-width:620px){
  .sgh-cookie-in{gap:14px;padding:16px}
  .sgh-cookie-ico{display:none}
  .sgh-cookie-actions{width:100%}
  .sgh-cookie-btn{flex:1 1 auto;text-align:center}
}
@media(prefers-reduced-motion:reduce){.sgh-cookie{transition:none}}
`;
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.className = 'sgh-cookie';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-live', 'polite');
  bar.setAttribute('aria-label', 'הודעת שימוש בעוגיות');
  bar.innerHTML = `
<div class="sgh-cookie-in">
  <div class="sgh-cookie-ico">${COOKIE_ICON}</div>
  <div class="sgh-cookie-txt">
    <b>אנחנו משתמשים בעוגיות (Cookies)</b> כדי לשפר את חוויית הגלישה שלכם, להתאים תכנים ולנתח את התנועה באתר.
    המשך הגלישה מהווה הסכמה למדיניות שלנו. למידע נוסף — <a href="privacy-policy.html">מדיניות הפרטיות</a>.
  </div>
  <div class="sgh-cookie-actions">
    <button type="button" class="sgh-cookie-btn sgh-cookie-accept">מאשר/ת</button>
    <button type="button" class="sgh-cookie-btn sgh-cookie-reject">ביטול</button>
  </div>
</div>`;

  function mount() {
    document.body.appendChild(bar);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { bar.classList.add('show'); });
    });

    function choose(val) {
      try { sessionStorage.setItem(KEY, val); } catch (e) {}
      bar.classList.remove('show');
      setTimeout(function () { bar.remove(); }, 450);
    }
    bar.querySelector('.sgh-cookie-accept').addEventListener('click', function () { choose('all'); });
    bar.querySelector('.sgh-cookie-reject').addEventListener('click', function () { choose('essential'); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
