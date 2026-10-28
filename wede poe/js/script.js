/* ===========================================
   Kwacha Coffee Roasters — script.js (Part 3)
   Animates the FAQ accordion open/close instead
   of relying on the browser's instant native
   toggle. No other page has scripted behaviour —
   the site's one piece of interaction-driven
   motion lives where a person actually acts.
   =========================================== */

(function () {
    var items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    var prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    items.forEach(function (item) {
        var summary = item.querySelector("summary");
        var body = item.querySelector(".faq-body");
        if (!summary || !body) return;

        summary.addEventListener("click", function (event) {
            event.preventDefault();

            if (prefersReducedMotion) {
                item.open = !item.open;
                return;
            }

            var isOpen = item.hasAttribute("open");

            if (isOpen) {
                // Closing: fix the current height, then collapse to 0 so
                // there's something for the browser to transition from.
                body.style.maxHeight = body.scrollHeight + "px";
                requestAnimationFrame(function () {
                    body.style.maxHeight = "0px";
                });
                body.addEventListener(
                    "transitionend",
                    function handler() {
                        item.removeAttribute("open");
                        body.style.maxHeight = "";
                        body.removeEventListener("transitionend", handler);
                    },
                    { once: true }
                );
            } else {
                item.setAttribute("open", "");
                body.style.maxHeight = "0px";
                requestAnimationFrame(function () {
                    body.style.maxHeight = body.scrollHeight + "px";
                });
                body.addEventListener(
                    "transitionend",
                    function handler() {
                        body.style.maxHeight = "";
                        body.removeEventListener("transitionend", handler);
                    },
                    { once: true }
                );
            }
        });
    });
})();
