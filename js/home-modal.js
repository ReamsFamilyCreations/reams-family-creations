(function () {
  "use strict";

  var modal = document.getElementById("product-modal");
  if (!modal) return;

  var backdrop = modal.querySelector(".product-modal__backdrop");
  var closeBtn = modal.querySelector(".product-modal__close");
  var imgEl = modal.querySelector(".product-modal__img");
  var titleEl = modal.querySelector(".product-modal__title");
  var descEl = modal.querySelector(".product-modal__desc");
  var lastFocus = null;

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
      title: "Key Holders",
      desc: "Wall-mounted racks in custom shapes (including home-state silhouettes) with hooks sized for keys and light gear.",
      ai: "images/ai/furniture.png",
      real: "images/furniture.png",
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

  function setThumbSrc(thumbImg, tile) {
    var ai = tile.ai;
    var real = tile.real;
    var probe = new Image();
    probe.onload = function () {
      thumbImg.src = ai;
    };
    probe.onerror = function () {
      thumbImg.src = real;
    };
    probe.src = ai;
  }

  function wireThumbs() {
    var cards = document.querySelectorAll(".card[data-tile-id]");
    cards.forEach(function (card) {
      var id = card.getAttribute("data-tile-id");
      var tile = TILES[id];
      if (!tile) return;
      var thumb = card.querySelector(".card-image");
      if (thumb) setThumbSrc(thumb, tile);
    });
  }

  function openModal(id) {
    var tile = TILES[id];
    if (!tile) return;
    lastFocus = document.activeElement;
    titleEl.textContent = tile.title;
    descEl.textContent = tile.desc;
    imgEl.src = tile.real;
    imgEl.alt = tile.title + " — photo of finished piece";
    modal.hidden = false;
    document.body.classList.add("modal-open");
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    imgEl.removeAttribute("src");
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

  backdrop.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  wireThumbs();
})();
