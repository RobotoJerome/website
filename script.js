// Minimal email obfuscation to deter scrapers.
// Decodes a XOR-encoded address on click and on first hover.
(function () {
  var KEY = 0x12;
  var ENCODED = '78776077 7f6b7360 777c7666 52766771 793c717d 7f'.replace(/\s+/g, '');

  function decode() {
    var out = '';
    for (var i = 0; i < ENCODED.length; i += 2) {
      out += String.fromCharCode(parseInt(ENCODED.substr(i, 2), 16) ^ KEY);
    }
    return out;
  }

  var link = document.getElementById('email-link');
  if (!link) return;

  var revealed = false;
  function reveal() {
    if (revealed) return;
    revealed = true;
    var addr = decode();
    link.setAttribute('href', 'mailto:' + addr);
    link.setAttribute('aria-label', 'Email ' + addr);
  }

  link.addEventListener('mouseenter', reveal, { once: true });
  link.addEventListener('focus', reveal, { once: true });
  link.addEventListener('touchstart', reveal, { once: true, passive: true });
  link.addEventListener('click', function (e) {
    if (!revealed) {
      e.preventDefault();
      reveal();
      window.location.href = link.getAttribute('href');
    }
  });
})();

// Sidebar menu: one section visible at a time. The URL hash (#writing, #patents, ...)
// keeps each section linkable and makes back/forward work. No element carries those ids,
// so changing the hash never scrolls. The first paint is handled inline in <head>.
(function () {
  var root = document.documentElement;
  var links = document.querySelectorAll('.nav__link');
  if (!links.length) return;

  function sync() {
    var name = window.location.hash.slice(1);
    var active = links[0];
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('href') === '#' + name) active = links[i];
    }
    for (var j = 0; j < links.length; j++) {
      if (links[j] === active) links[j].setAttribute('aria-current', 'page');
      else links[j].removeAttribute('aria-current');
    }
    root.setAttribute('data-panel', active.getAttribute('href').slice(1));
  }

  window.addEventListener('hashchange', sync);
  sync();
})();
