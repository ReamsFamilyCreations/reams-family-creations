/**
 * Lightbox for .js-lightbox links: shows href image in an overlay.
 * Thumbnail is the visible <img>; href points at the real product photo.
 */
(function () {
  var overlay = null;
  var imgEl = null;
  var capEl = null;

  function close() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lb-open");
    if (imgEl) imgEl.removeAttribute("src");
  }

  function open(src, caption) {
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "lb-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", "Enlarged photo");
      overlay.innerHTML =
        '<button type="button" class="lb-close" aria-label="Close">&times;</button>' +
        '<img class="lb-img" alt="">' +
        '<p class="lb-caption"></p>';
      document.body.appendChild(overlay);
      imgEl = overlay.querySelector(".lb-img");
      capEl = overlay.querySelector(".lb-caption");
      overlay.querySelector(".lb-close").addEventListener("click", close);
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) close();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") close();
      });
    }
    imgEl.src = src;
    imgEl.alt = caption || "Product photo";
    capEl.textContent = caption || "";
    capEl.hidden = !caption;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("lb-open");
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a.js-lightbox");
    if (!a || !a.href) return;
    e.preventDefault();
    open(a.href, a.getAttribute("data-caption") || "");
  });
})();
