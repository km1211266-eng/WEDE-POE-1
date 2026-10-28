/* ===========================================
   Kwacha Coffee Roasters - life.js (Part 3)
   Small touches that make the site feel alive:
   scroll progress bar, shrinking header,
   headline word reveal, count-up numbers,
   cursor tilt on cards and the hero, a live
   "open now" badge and next-roast-day.
   Everything is skipped for visitors who
   prefer reduced motion.
   =========================================== */

(function () {
    "use strict";
    var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- Live opening status (Johannesburg time) ---- */
    function jhbNow() {
        var parts = new Intl.DateTimeFormat("en-ZA", {
            timeZone: "Africa/Johannesburg", weekday: "short", hour: "numeric", minute: "numeric", hour12: false
        }).formatToParts(new Date());
        var o = {};
        parts.forEach(function (p) { o[p.type] = p.value; });
        var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
        return { day: days[o.weekday.replace(".", "").slice(0, 3)], mins: (Number(o.hour) % 24) * 60 + Number(o.minute) };
    }

    var pill = document.getElementById("open-pill");
    var t = jhbNow();
    var open = t.day >= 2 && t.day <= 6 && t.mins >= 480 && t.mins < 960;
    if (pill) {
        var txt = document.getElementById("open-text");
        pill.classList.toggle("is-open", open);
        if (open) { txt.textContent = "Open now \u00B7 closes at 4pm"; }
        else if (t.day >= 2 && t.day <= 6 && t.mins < 480) { txt.textContent = "Closed \u00B7 opens today at 8am"; }
        else {
            var nextDay = (t.day >= 2 && t.day <= 5) ? "tomorrow" : "Tuesday";
            txt.textContent = "Closed \u00B7 opens " + nextDay + " at 8am";
        }
    }

    /* ---- Next roast day (Wed / Fri) ---- */
    var nr = document.getElementById("next-roast");
    if (nr) {
        var names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var add = 0;
        for (add = 0; add < 8; add++) {
            var d = (t.day + add) % 7;
            if ((d === 3 || d === 5) && !(add === 0 && t.mins > 600)) { break; }
        }
        var target = (t.day + add) % 7;
        nr.textContent = names[target].slice(0, 3);
        document.getElementById("next-roast-note").textContent =
            add === 0 ? "roasting today \u2014 the drum is on" : (add === 1 ? "next roast day \u2014 tomorrow" : "next roast day \u2014 in " + add + " days");
    }

    if (calm) { return; }

    /* ---- Scroll progress bar + shrinking header ---- */
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    var header = document.querySelector(".site-header");
    var ticking = false;
    function onScroll() {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
        if (header) { header.classList.toggle("is-compact", window.scrollY > 40); }
        document.documentElement.style.setProperty("--scroll", window.scrollY);
        ticking = false;
    }
    window.addEventListener("scroll", function () {
        if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    /* ---- Headline: words rise in one by one ---- */
    var h1 = document.querySelector(".hero-text h1");
    if (h1) {
        var words = h1.textContent.trim().split(/\s+/);
        h1.setAttribute("aria-label", h1.textContent.trim());
        h1.textContent = "";
        words.forEach(function (w, i) {
            var span = document.createElement("span");
            span.className = "word";
            span.setAttribute("aria-hidden", "true");
            span.style.animationDelay = (0.25 + i * 0.09) + "s";
            span.textContent = w;
            h1.appendChild(span);
            h1.appendChild(document.createTextNode(" "));
        });
    }

    /* ---- Count-up numbers when they scroll into view ---- */
    var counters = document.querySelectorAll("[data-count]");
    if ("IntersectionObserver" in window && counters.length) {
        var cio = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) { return; }
                cio.unobserve(e.target);
                var end = Number(e.target.dataset.count), start = performance.now(), dur = 1200;
                (function tick(now) {
                    var p = Math.min((now - start) / dur, 1);
                    e.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
                    if (p < 1) { requestAnimationFrame(tick); }
                })(start);
            });
        }, { threshold: 0.6 });
        counters.forEach(function (c) { c.textContent = "0"; cio.observe(c); });
    }

    /* ---- Cursor tilt: hero illustration and cards ---- */
    function tilt(el, max, lift) {
        el.addEventListener("pointermove", function (e) {
            if (e.pointerType === "touch") { return; }
            var r = el.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            el.style.setProperty("--ry", (x * max).toFixed(2) + "deg");
            el.style.setProperty("--rx", (-y * max).toFixed(2) + "deg");
            el.style.setProperty("--mx", ((x + 0.5) * 100).toFixed(0) + "%");
            el.style.setProperty("--my", ((y + 0.5) * 100).toFixed(0) + "%");
            el.classList.add("is-tilting");
        });
        el.addEventListener("pointerleave", function () {
            el.style.setProperty("--ry", "0deg");
            el.style.setProperty("--rx", "0deg");
            el.classList.remove("is-tilting");
        });
    }
    var heroArt = document.querySelector(".dawn-illustration");
    if (heroArt) { tilt(heroArt, 10); }
    function tiltCards(root) {
        root.querySelectorAll(".roast-entry:not([data-tilt]), .row:not([data-tilt])").forEach(function (c) {
            c.dataset.tilt = "1"; tilt(c, 4);
        });
    }
    tiltCards(document);
    var list = document.getElementById("roast-list");
    if (list) { new MutationObserver(function () { tiltCards(list); }).observe(list, { childList: true }); }

    /* ---- Spotlight that follows the cursor on the dark process band ---- */
    var band = document.querySelector(".process");
    if (band) {
        band.addEventListener("pointermove", function (e) {
            var r = band.getBoundingClientRect();
            band.style.setProperty("--sx", (e.clientX - r.left) + "px");
            band.style.setProperty("--sy", (e.clientY - r.top) + "px");
        });
    }
})();
