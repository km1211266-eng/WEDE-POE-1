/* Kwacha Coffee Roasters - reveal.js (Part 3)
   Fades sections up as they scroll into view. Content stays visible
   if JavaScript or IntersectionObserver is unavailable. */
(function () {
    "use strict";
    if (!("IntersectionObserver" in window)) { return; }
    document.documentElement.classList.add("js");
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll(".intro, .process-inner, .row, .content-block, .gallery, .tabs, .photo-band, .roast-tools, .faq-list, .stat, .marquee, .page-header")
        .forEach(function (el) {
            // Stagger siblings of the same kind (cards, stats, rows) so they cascade in.
            var sibs = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (c) { return c.className.replace(" reveal", "") === el.className.replace(" reveal", ""); }) : [];
            var idx = sibs.indexOf(el);
            if (idx > 0) { el.style.transitionDelay = Math.min(idx, 5) * 90 + "ms"; }
            el.classList.add("reveal"); io.observe(el);
        });
    // Roast cards are added later by products.js, so watch for them too.
    var list = document.getElementById("roast-list");
    if (list) {
        new MutationObserver(function () {
            list.querySelectorAll(".roast-entry:not(.reveal)").forEach(function (el) {
                el.classList.add("reveal"); io.observe(el);
            });
        }).observe(list, { childList: true });
    }
})();
