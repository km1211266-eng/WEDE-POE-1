/* ===========================================
   Kwacha Coffee Roasters - tabs.js (Part 3)
   Accessible tabs: click or use Left/Right,
   Home and End keys to switch panels.
   =========================================== */

(function () {
    "use strict";

    document.querySelectorAll("[data-tabs]").forEach(function (group) {
        var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));
        var indicator = document.createElement("span");
        indicator.className = "tab-indicator";
        indicator.setAttribute("aria-hidden", "true");
        group.querySelector(".tab-list").appendChild(indicator);

        function moveIndicator() {
            var on = group.querySelector('[role="tab"][aria-selected="true"]');
            if (!on) { return; }
            indicator.style.width = on.offsetWidth + "px";
            indicator.style.transform = "translateX(" + on.offsetLeft + "px)";
        }
        window.addEventListener("resize", moveIndicator);
        window.addEventListener("load", moveIndicator);
        if (document.fonts && document.fonts.ready) { document.fonts.ready.then(moveIndicator); }

        function select(tab, focus) {
            tabs.forEach(function (t) {
                var on = t === tab;
                t.setAttribute("aria-selected", on ? "true" : "false");
                t.tabIndex = on ? 0 : -1;
                document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
            });
            moveIndicator();
            if (focus) { tab.focus(); }
        }

        moveIndicator();
        tabs.forEach(function (tab, i) {
            tab.addEventListener("click", function () { select(tab, false); });
            tab.addEventListener("keydown", function (e) {
                var next = null;
                if (e.key === "ArrowRight") { next = tabs[(i + 1) % tabs.length]; }
                else if (e.key === "ArrowLeft") { next = tabs[(i - 1 + tabs.length) % tabs.length]; }
                else if (e.key === "Home") { next = tabs[0]; }
                else if (e.key === "End") { next = tabs[tabs.length - 1]; }
                if (next) { e.preventDefault(); select(next, true); }
            });
        });
    });
})();
