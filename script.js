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

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
