(function () {
  "use strict";

  var modal = document.getElementById("product-modal");
  if (!modal) return;

  var backdrop = modal.querySelector(".product-modal__backdrop");
  var closeBtn = modal.querySelector(".product-modal__close");
  var imgEl = modal.querySelector(".product-modal__img");
  var titleEl = modal.querySelector(".product-modal__title");
  var descEl = modal.querySelector(".product-modal__desc");
  var prevBtn = modal.querySelector(".product-modal__arrow--prev");
  var nextBtn = modal.querySelector(".product-modal__arrow--next");
  var countEl = modal.querySelector(".product-modal__count");
  var lastFocus = null;
  var slides = [];
  var slideIndex = 0;

  var TILES = {
    "cutting-board": {
      title: "Cutting Boards",
      desc: "Custom sizes and wood species, with optional routed or inlaid artwork. Each board is finished for daily kitchen use.",
      ai: "images/ai/cutting-board.png",
      real: "images/cutting-board.png",
    },
    "wall-art": {
      title: "Cribbage & Game Boards",
      desc: "Precision-routed tracks, peg storage, and personalized details. Great for gifts and game rooms.",
      ai: "images/ai/wall-art.png",
      real: "images/wall-art.png",
    },
    "key-holder": {
      title: "Furniture & Tables",
      desc: "Live-edge tops, epoxy rivers, and sturdy bases—built for real homes, not showroom-only pieces.",
      ai: "images/ai/key-holder.png",
      real: "images/key-holder.png",
    },
    furniture: {
      title: "Idaho home sweet home key holder",
      desc: "Wall-mounted key racks cut to your state’s silhouette, with hooks and lettering in the finish you like. Shown here: several Idaho styles—we can build yours for any state and your own wording.",
      ai: "images/ai/furniture.png",
      gallery: [
        {
          src: "images/idaho-key-holder-variations-group.png",
          alt: "Three Idaho key holder variations with different stains and lettering.",
        },
        {
          src: "images/idaho-key-holder-home-sweet-home.png",
          alt: "Idaho key holder with HOME SWEET HOME and charred edge detail.",
        },
        {
          src: "images/idaho-key-holder-my-home-sweet-home.png",
          alt: "Idaho key holder with MY HOME SWEET HOME and five brass hooks.",
        },
      ],
    },
    "rustic-board": {
      title: "Inlaid cutting & serving boards",
      desc: "Striped walnut fields with wildlife silhouettes and contrasting inlays—serving-ready and built to last.",
      ai: "images/ai/rustic-board.png",
      real: "images/rustic-board.png",
    },
    "ring-holder": {
      title: "Statement inlay boards",
      desc: "Large-format boards with layered scenes—antler frames, forest backdrops, and dramatic center motifs.",
      ai: "images/ai/ring-holder.png",
      real: "images/ring-holder.png",
    },
    charcuterie: {
      title: "Cheese & Charcuterie Boards",
      desc: "Compact squares and generous platters for hosting—balanced proportions for spreads and easy carrying.",
      ai: "images/ai/charcuterie.png",
      real: "images/charcuterie.png",
    },
    stool: {
      title: "Live-edge tables",
      desc: "Custom profiles like half-moons and free-form slabs, paired with metal legs chosen for your space.",
      ai: "images/ai/stool.png",
      real: "images/stool.png",
    },
  };

  function getSlides(tile) {
    if (tile.gallery && tile.gallery.length) return tile.gallery.slice();
    if (tile.real) {
      return [
        {
          src: tile.real,
          alt: tile.title + " — photo of finished piece",
        },
      ];
    }
    return [];
  }

  function thumbFallback(tile) {
    if (tile.real) return tile.real;
    if (tile.gallery && tile.gallery[0]) return tile.gallery[0].src;
    return "";
  }

  function setThumbSrc(thumbImg, tile) {
    var ai = tile.ai;
    var fb = thumbFallback(tile);
    if (!ai) {
      if (fb) thumbImg.src = fb;
      return;
    }
    var probe = new Image();
    probe.onload = function () {
      thumbImg.src = ai;
    };
    probe.onerror = function () {
      if (fb) thumbImg.src = fb;
    };
    probe.src = ai;
  }

  function wireThumbs() {
    document.querySelectorAll(".card[data-tile-id]").forEach(function (card) {
      var id = card.getAttribute("data-tile-id");
      var tile = TILES[id];
      if (!tile) return;
      var thumb = card.querySelector(".card-image");
      if (thumb) setThumbSrc(thumb, tile);
    });
  }

  function updateGalleryChrome() {
    var multi = slides.length > 1;
    prevBtn.hidden = !multi;
    nextBtn.hidden = !multi;
    if (!countEl) return;
    if (multi) {
      countEl.hidden = false;
      countEl.textContent =
        "Photo " + (slideIndex + 1) + " of " + slides.length + " — use arrows or keyboard ← →";
    } else {
      countEl.hidden = true;
      countEl.textContent = "";
    }
  }

  function renderSlide() {
    if (!slides.length) {
      imgEl.removeAttribute("src");
      imgEl.alt = "";
      updateGalleryChrome();
      return;
    }
    var s = slides[slideIndex];
    imgEl.src = s.src;
    imgEl.alt = s.alt || "";
    updateGalleryChrome();
  }

  function showRelative(delta) {
    if (slides.length <= 1) return;
    slideIndex = (slideIndex + delta + slides.length) % slides.length;
    renderSlide();
  }

  function openModal(id) {
    var tile = TILES[id];
    if (!tile) return;
    slides = getSlides(tile);
    slideIndex = 0;
    lastFocus = document.activeElement;
    titleEl.textContent = tile.title;
    descEl.textContent = tile.desc;
    renderSlide();
    modal.hidden = false;
    document.body.classList.add("modal-open");
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    slides = [];
    slideIndex = 0;
    imgEl.removeAttribute("src");
    imgEl.alt = "";
    if (countEl) {
      countEl.hidden = true;
      countEl.textContent = "";
    }
    prevBtn.hidden = true;
    nextBtn.hidden = true;
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  document.querySelectorAll(".card[data-tile-id]").forEach(function (card) {
    card.addEventListener("click", function () {
      openModal(card.getAttribute("data-tile-id"));
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card.getAttribute("data-tile-id"));
      }
    });
  });

  prevBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    showRelative(-1);
  });
  nextBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    showRelative(1);
  });

  backdrop.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    if (slides.length > 1 && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      e.preventDefault();
      showRelative(e.key === "ArrowLeft" ? -1 : 1);
    }
  });

  wireThumbs();
})();
