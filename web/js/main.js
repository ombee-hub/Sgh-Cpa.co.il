(function () {
  "use strict";

  /* sticky header shadow */
  var header = document.getElementById("header");
  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 20);
    });
  }

  /* logo click → scroll to the very top, never jump down to #top */
  var brandTop = document.querySelector('.brand[href="#top"], .brand[href="#"]');
  if (brandTop) {
    brandTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (history.replaceState) history.replaceState(null, "", location.pathname);
    });
  }

  /* mobile menu */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") menu.classList.remove("open");
    });
  }

  /* reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* animated counters */
  function runCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var valEl = el.querySelector(".val");
    var start = null;
    var dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      valEl.textContent = Math.round(target * ease).toLocaleString("he-IL");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll(".num[data-count]");
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            runCount(en.target);
            io2.unobserve(en.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { io2.observe(el); });
    } else {
      counters.forEach(runCount);
    }
  }

  /* lead form (mock submit) */
  var form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = document.getElementById("formOk");
      if (ok) ok.classList.add("show");
      this.reset();
    });
  }

  /* blog category filter (articles page) */
  var filters = document.querySelectorAll(".blog-filters button");
  if (filters.length) {
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filters.forEach(function (b) { b.classList.remove("on"); });
        btn.classList.add("on");
        var cat = btn.getAttribute("data-cat");
        document.querySelectorAll(".art-grid .article").forEach(function (card) {
          var show = cat === "all" || card.getAttribute("data-cat") === cat;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }
})();
