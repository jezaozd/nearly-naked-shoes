(function () {
  'use strict';
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function cl(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function sm(a, b, v) { var t = cl((v - a) / (b - a)); return t * t * (3 - 2 * t); }

  var th = document.getElementById('theatre'), stage = th.querySelector('.th-stage');
  var pas = document.getElementById('pas'), track = document.getElementById('track');

  function sizePas() {
    var extra = Math.max(0, track.scrollWidth - window.innerWidth);
    pas.style.setProperty('--pas-h', (window.innerHeight + extra * 1.1) + 'px');
  }

  function frame() {
    var vh = window.innerHeight;
    var r = th.getBoundingClientRect(), p = cl(-r.top / (th.offsetHeight - vh));
    var o = sm(.04, .55, p);
    stage.style.setProperty('--o', o.toFixed(3));
    stage.style.setProperty('--p', sm(.1, .7, p).toFixed(3));
    stage.style.setProperty('--tt', sm(.6, .85, p).toFixed(3));
    var pr = pas.getBoundingClientRect(), span = pas.offsetHeight - vh, q = span > 0 ? cl(-pr.top / span) : 0;
    var extra = Math.max(0, track.scrollWidth - window.innerWidth);
    track.style.setProperty('--tx', (-q * extra).toFixed(1) + 'px');
  }

  if (calm) {
    stage.style.setProperty('--o', 1); stage.style.setProperty('--p', 1); stage.style.setProperty('--tt', 1);
    th.style.height = '100vh'; track.style.flexWrap = 'wrap'; pas.style.height = 'auto';
    pas.querySelector('.pas-pin').style.position = 'relative'; pas.querySelector('.pas-pin').style.height = 'auto';
  } else {
    var tk = false;
    window.addEventListener('scroll', function () { if (!tk) { tk = true; requestAnimationFrame(function () { tk = false; frame(); }); } }, { passive: true });
    window.addEventListener('resize', function () { sizePas(); frame(); });
    window.addEventListener('load', function () { sizePas(); frame(); });
    sizePas(); frame();
  }

  var els = document.querySelectorAll('.bill-in, .tr-h, .cast li, .pz-t, .prize figure, .ticket');
  if (calm || !('IntersectionObserver' in window)) return;
  els.forEach(function (el) { el.classList.add('rv'); });
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
  }, { threshold: .15 });
  els.forEach(function (el) { io.observe(el); });
})();
