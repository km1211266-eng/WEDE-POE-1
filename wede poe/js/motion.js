/* ===========================================
   Kwacha Coffee Roasters - motion.js (Part 3)
   Page transitions (a sunrise curtain), the
   cursor glow, magnetic buttons with ripples,
   the lit-up process timeline and a bean
   confetti burst (window.KwachaFX.burst).
   Skipped for reduced-motion visitors.
   =========================================== */

(function () {
    "use strict";
    var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    /* ---- Bean confetti (also used by forms.js) ---- */
    window.KwachaFX = {
        burst: function (origin) {
            if (calm || !origin) { return; }
            var r = origin.getBoundingClientRect();
            var cx = r.left + r.width / 2, cy = r.top + Math.min(r.height / 2, 120);
            for (var i = 0; i < 26; i++) {
                var b = document.createElement("span");
                b.className = "confetti-bean";
                b.setAttribute("aria-hidden", "true");
                var angle = (Math.PI * 2 * i) / 26 + Math.random() * 0.5;
                var dist = 90 + Math.random() * 170;
                b.style.left = cx + "px";
                b.style.top = cy + "px";
                b.style.setProperty("--dx", Math.cos(angle) * dist + "px");
                b.style.setProperty("--dy", Math.sin(angle) * dist - 60 + "px");
                b.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
                b.style.setProperty("--size", (0.6 + Math.random() * 0.8).toFixed(2));
                b.style.animationDelay = (Math.random() * 0.12) + "s";
                document.body.appendChild(b);
                b.addEventListener("animationend", function (e) { e.target.remove(); });
            }
        }
    };

    if (calm) { return; }

    /* ---- Sunrise curtain: page transitions ---- */
    var seen = false;
    try { seen = sessionStorage.getItem("kwacha-intro") === "1"; } catch (e) { /* ignore */ }
    var curtain = document.createElement("div");
    curtain.className = "curtain cover" + (seen ? "" : " first-visit");
    curtain.setAttribute("aria-hidden", "true");
    curtain.innerHTML = '<div class="curtain-sun"></div><p class="curtain-word"><em>Kwacha</em> Coffee Roasters</p>';
    document.body.appendChild(curtain);
    window.setTimeout(function () {
        curtain.classList.remove("cover");
        try { sessionStorage.setItem("kwacha-intro", "1"); } catch (e) { /* ignore */ }
    }, seen ? 40 : 900);

    window.addEventListener("pageshow", function (e) {
        if (e.persisted) { curtain.classList.remove("cover", "first-visit"); }
    });

    document.addEventListener("click", function (e) {
        var a = e.target.closest && e.target.closest("a[href]");
        if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
        if (a.target || a.hasAttribute("download") || a.hasAttribute("data-lightbox")) { return; }
        var url = new URL(a.href, window.location.href);
        if (url.origin !== window.location.origin) { return; }
        if (!/(\.html|\/)$/.test(url.pathname)) { return; }
        if (url.pathname === window.location.pathname && url.hash) { return; }
        e.preventDefault();
        curtain.classList.remove("first-visit");
        curtain.classList.add("cover", "leaving");
        window.setTimeout(function () { window.location.href = url.href; }, 480);
    });

    /* ---- Cursor glow ---- */
    if (fine) {
        var glow = document.createElement("div");
        glow.className = "cursor-glow";
        glow.setAttribute("aria-hidden", "true");
        document.body.appendChild(glow);
        var gx = -400, gy = -400, tx = gx, ty = gy, running = false;
        function loop() {
            gx += (tx - gx) * 0.14; gy += (ty - gy) * 0.14;
            glow.style.transform = "translate(" + (gx - 190) + "px," + (gy - 190) + "px)";
            if (Math.abs(tx - gx) > 0.5 || Math.abs(ty - gy) > 0.5) { requestAnimationFrame(loop); } else { running = false; }
        }
        window.addEventListener("pointermove", function (e) {
            tx = e.clientX; ty = e.clientY;
            glow.classList.add("on");
            if (!running) { running = true; requestAnimationFrame(loop); }
        }, { passive: true });
        document.addEventListener("pointerleave", function () { glow.classList.remove("on"); });
    }

    /* ---- Magnetic buttons + ripple ---- */
    document.querySelectorAll(".cta-button, .cta-button-small").forEach(function (btn) {
        if (fine) {
            btn.addEventListener("pointermove", function (e) {
                var r = btn.getBoundingClientRect();
                var x = (e.clientX - (r.left + r.width / 2)) * 0.22;
                var y = (e.clientY - (r.top + r.height / 2)) * 0.3;
                btn.style.setProperty("--tx", x.toFixed(1) + "px");
                btn.style.setProperty("--ty", y.toFixed(1) + "px");
            });
            btn.addEventListener("pointerleave", function () {
                btn.style.setProperty("--tx", "0px");
                btn.style.setProperty("--ty", "0px");
            });
        }
        btn.addEventListener("pointerdown", function (e) {
            var r = btn.getBoundingClientRect();
            var dot = document.createElement("span");
            dot.className = "ripple";
            dot.style.left = (e.clientX - r.left) + "px";
            dot.style.top = (e.clientY - r.top) + "px";
            btn.appendChild(dot);
            dot.addEventListener("animationend", function () { dot.remove(); });
        });
    });

    /* ---- Process timeline: steps light up as you scroll ---- */
    var steps = document.querySelectorAll(".process-step");
    if ("IntersectionObserver" in window && steps.length) {
        var sio = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { e.target.classList.toggle("lit", e.isIntersecting); });
        }, { rootMargin: "-35% 0px -35% 0px" });
        steps.forEach(function (s) { sio.observe(s); });
    }
})();
