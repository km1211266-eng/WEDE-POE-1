/* ===========================================
   Kwacha Coffee Roasters - lightbox.js (Part 3)
   Image gallery with a lightbox (modal dialog):
   click a thumbnail to view it larger; close
   with the button, the backdrop or Escape;
   move with the arrow buttons or arrow keys.
   Focus is trapped while open and returned to
   the thumbnail that opened it.
   =========================================== */

(function () {
    "use strict";

    var links = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
    if (!links.length) { return; }

    var current = 0;
    var opener = null;

    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Image viewer");
    box.hidden = true;
    box.innerHTML =
        '<div class="lightbox-backdrop" data-close></div>' +
        '<figure class="lightbox-figure">' +
        '<img class="lightbox-img" alt="">' +
        '<figcaption class="lightbox-caption"></figcaption>' +
        '</figure>' +
        '<button type="button" class="lightbox-btn lightbox-close" data-close aria-label="Close image viewer">&times;</button>' +
        '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous image">&#8592;</button>' +
        '<button type="button" class="lightbox-btn lightbox-next" aria-label="Next image">&#8594;</button>';
    document.body.appendChild(box);

    var img = box.querySelector(".lightbox-img");
    var caption = box.querySelector(".lightbox-caption");
    var prev = box.querySelector(".lightbox-prev");
    var next = box.querySelector(".lightbox-next");
    var closeBtn = box.querySelector(".lightbox-close");

    function show(i) {
        current = (i + links.length) % links.length;
        var a = links[current];
        var thumb = a.querySelector("img");
        img.src = a.getAttribute("href");
        img.alt = thumb ? thumb.alt : "";
        caption.textContent = (current + 1) + " / " + links.length + " \u2014 " + (a.dataset.caption || img.alt);
    }

    function open(i, trigger) {
        opener = trigger;
        show(i);
        box.hidden = false;
        document.body.classList.add("no-scroll");
        requestAnimationFrame(function () { box.classList.add("is-open"); });
        closeBtn.focus();
    }

    function close() {
        box.classList.remove("is-open");
        box.hidden = true;
        document.body.classList.remove("no-scroll");
        if (opener) { opener.focus(); }
    }

    links.forEach(function (a, i) {
        a.addEventListener("click", function (e) {
            e.preventDefault();
            open(i, a);
        });
    });

    box.addEventListener("click", function (e) {
        if (e.target.hasAttribute("data-close")) { close(); }
    });
    prev.addEventListener("click", function () { show(current - 1); });
    next.addEventListener("click", function () { show(current + 1); });

    document.addEventListener("keydown", function (e) {
        if (box.hidden) { return; }
        if (e.key === "Escape") { close(); }
        else if (e.key === "ArrowLeft") { show(current - 1); }
        else if (e.key === "ArrowRight") { show(current + 1); }
        else if (e.key === "Tab") {
            var focusables = [closeBtn, prev, next];
            var first = focusables[0], last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
})();
