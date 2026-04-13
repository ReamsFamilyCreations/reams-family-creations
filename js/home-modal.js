(function () {
  "use strict";

  // #region agent log
  function dbg(message, data, hypothesisId) {
    fetch("http://127.0.0.1:7830/ingest/47d32347-f99b-477f-8405-477bb2132ee9", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "6ce618" },
      body: JSON.stringify({
        sessionId: "6ce618",
        location: "home-modal.js",
        message: message,
        data: data || {},
        timestamp: Date.now(),
        hypothesisId: hypothesisId || "H0",
      }),
    }).catch(function () {});
  }
  // #endregion

  var modal = document.getElementById("product-modal");
  if (!modal) {
    // #region agent log
    dbg("early_exit_no_modal", {}, "H2");
    // #endregion
    return;
  }

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

  // #region agent log
  dbg(
    "modal_dom_ready",
    {
      hasBackdrop: !!backdrop,
      hasClose: !!closeBtn,
      hasImg: !!imgEl,
      hasTitle: !!titleEl,
      hasDesc: !!descEl,
      hasPrev: !!prevBtn,
      hasNext: !!nextBtn,
      hasCount: !!countEl,
    },
    "H2"
  );
  // #endregion

  var TILES = {
    "cutting-board": {
      title: "Beautiful handcrafted cutting board — chef knife design",
      desc: "$50. A crossed chef-knife inlay, full perimeter juice groove (drip edge), and food-safe oil so it is ready to chop. This example is 16″ × 16″ in mixed hardwoods; ask us for other sizes, woods, or custom artwork.",
      ai: "images/ai/cutting-board.png",
      gallery: [
        {
          src: "images/chef-cutting-board-stripes-juice-groove.png",
          alt: "Square striped hardwood cutting board with crossed chef knives inlay and perimeter juice groove.",
        },
        {
          src: "images/chef-cutting-board-dark-border.png",
          alt: "Square chef knife cutting board with dark wood border, light center, and drip edge.",
        },
      ],
    },
    "wall-art": {
      title: "Washington & Idaho cribbage boards",
      desc: "State-shaped or classic rectangular tracks, engraved START / FINISH / WINS, and fully custom layouts. The back is hollowed and fitted with a sliding panel so pegs and a deck of cards stay with the board—great for travel and gifts. Shown: Washington silhouette, Idaho silhouette, a traditional board, and the storage back with our shop mark.",
      ai: "images/ai/wall-art.png",
      gallery: [
        {
          src: "images/cribbage-board-washington.png",
          alt: "Washington state-shaped wooden cribbage board with START, WINS, and FINISH.",
        },
        {
          src: "images/cribbage-board-idaho.png",
          alt: "Idaho state-shaped wooden cribbage board with track and engraved lettering.",
        },
        {
          src: "images/cribbage-board-classic-rectangular.png",
          alt: "Rectangular wooden cribbage board with START and FINISH and traditional peg holes.",
        },
        {
          src: "images/cribbage-board-back-storage.png",
          alt: "Back of cribbage board showing sliding storage panel and Reams Family Creations logo.",
        },
      ],
    },
    "key-holder": {
      title: "Beautiful handcrafted beach themed foyer / side table",
      desc: "Shown here at 37″ long × 14″ wide × 30″ tall. Live-edge wood, ocean blues, foamy whites, and sandy resin details on black hairpin legs—perfect beside a door or sofa. Yours can be fully custom: other resin colors, wood species, dimensions, and leg styles are all welcome.",
      ai: "images/ai/key-holder.png",
      gallery: [
        {
          src: "images/foyer-table-beach-angle.png",
          alt: "Handcrafted beach-themed foyer table with turquoise epoxy river and hairpin legs.",
        },
        {
          src: "images/foyer-table-beach-overhead.png",
          alt: "Overhead view of beach-themed epoxy river table with wood islands and wave details.",
        },
        {
          src: "images/foyer-table-beach-room.png",
          alt: "Beach-themed foyer or side table against a wall on wood flooring.",
        },
      ],
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
      title: "Beautiful handcrafted wildlife cutting board",
      desc: "Hand built from rich walnut with a contrasting light-wood scene: a buck among evergreens framed inside sweeping antler shapes. A routed drip edge (juice groove) follows the perimeter for everyday prep. This board is 22″ long × 13″ wide; tell us the size, species, and artwork you want for your kitchen.",
      ai: "images/ai/ring-holder.png",
      gallery: [
        {
          src: "images/wildlife-walnut-cutting-board-22x13-wide.png",
          alt: "Horizontal walnut wildlife cutting board with antler-framed buck and pine trees and juice groove.",
        },
        {
          src: "images/wildlife-walnut-cutting-board-22x13-close.png",
          alt: "Close-up of dark walnut wildlife cutting board with drip edge and inlaid antler scene.",
        },
      ],
    },
    charcuterie: {
      title: "Beautiful wildlife cutting board",
      desc: "Sized at 13″ × 12″ and finished with food-safe oil so it is ready for the kitchen. Light hardwood shows off a deep engraved scene: a buck among evergreens framed by antler silhouettes. We can design similar wildlife artwork, monograms, or other layouts on boards in the dimensions you need.",
      ai: "images/ai/charcuterie.png",
      gallery: [
        {
          src: "images/wildlife-cutting-board-full.png",
          alt: "Top view of square wildlife cutting board with deer and pine trees inside an antler outline.",
        },
        {
          src: "images/wildlife-cutting-board-detail.png",
          alt: "Close-up of engraved wildlife scene with buck, forest, and antler frame on light wood.",
        },
      ],
    },
    stool: {
      title: "Beautiful handcrafted silver maple foyer / side table",
      desc: "Pictured at 32″ wide × 13″ deep × 31″ tall. A thick silver maple demilune (half-moon) slab keeps the natural live edge along the front, finished glossy to highlight grain, spalting, and warm tones. The open black steel base tucks neatly along a wall in an entry or beside seating. We can adapt dimensions, wood species, edge profiles, and metal finishes to match your home.",
      ai: "images/ai/stool.png",
      gallery: [
        {
          src: "images/silver-maple-foyer-table-angle.png",
          alt: "Silver maple demilune foyer table with live edge top and black metal base.",
        },
        {
          src: "images/silver-maple-foyer-table-room.png",
          alt: "Silver maple half-moon side table against a wall showing grain and metal legs.",
        },
      ],
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
    // #region agent log
    dbg("showRelative", { delta: delta, slideIndex: slideIndex, slideCount: slides.length }, "H6");
    // #endregion
    renderSlide();
  }

  function openModal(id) {
    var tile = TILES[id];
    // #region agent log
    dbg("openModal", { id: id, hasTile: !!tile }, "H3");
    // #endregion
    if (!tile) return;
    slides = getSlides(tile);
    slideIndex = 0;
    // #region agent log
    dbg("openModal_slides", { id: id, slideCount: slides.length }, "H4");
    // #endregion
    lastFocus = document.activeElement;
    titleEl.textContent = tile.title;
    descEl.textContent = tile.desc;
    renderSlide();
    modal.hidden = false;
    document.body.classList.add("modal-open");
    closeBtn.focus();
  }

  function closeModal() {
    // #region agent log
    dbg("closeModal", {}, "H5");
    // #endregion
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
  // #region agent log
  dbg(
    "wireThumbs_done",
    { wiredCards: document.querySelectorAll(".card[data-tile-id]").length },
    "H4"
  );
  // #endregion
})();
