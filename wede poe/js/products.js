/* ===========================================
   Kwacha Coffee Roasters - products.js (Part 3)
   Dynamic content: builds the roast list from
   JSON and adds live search, roast-level filter
   and sorting. Uses advanced DOM methods
   (createElement, DocumentFragment, textContent)
   rather than innerHTML for safety.
   =========================================== */

(function () {
    "use strict";

    var list = document.getElementById("roast-list");
    if (!list) { return; }

    var searchInput = document.getElementById("roast-search");
    var filterSelect = document.getElementById("roast-filter");
    var sortSelect = document.getElementById("roast-sort");
    var status = document.getElementById("roast-status");
    var resetBtn = document.getElementById("roast-reset");
    var roasts = [];

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) { node.className = className; }
        if (text !== undefined) { node.textContent = text; }
        return node;
    }

    function buildEntry(r) {
        var stock = KwachaData.stockLabel(r.stock);
        var entry = el("article", "roast-entry");
        entry.dataset.id = r.id;

        var head = el("div", "roast-entry-head");
        head.appendChild(el("h3", null, r.name));
        head.appendChild(el("span", "price", KwachaData.money(r.price) + " / 250g"));
        entry.appendChild(head);

        entry.appendChild(el("p", "roast-meta",
            r.origin + " \u00B7 " + r.altitude.toLocaleString("en-ZA") + "m \u00B7 " +
            r.process + " \u00B7 " + r.roast + " roast"));
        entry.appendChild(el("p", null, r.notes));

        var chips = el("ul", "flavour-chips");
        chips.setAttribute("aria-label", "Flavour notes");
        (r.flavours || []).forEach(function (f, i) {
            var li = el("li", null, f);
            li.style.animationDelay = (0.25 + i * 0.1) + "s";
            chips.appendChild(li);
        });
        entry.appendChild(chips);

        var level = { "medium": 3, "medium-dark": 4, "dark": 5 }[r.roast] || 3;
        var meter = el("div", "roast-meter");
        meter.setAttribute("role", "img");
        meter.setAttribute("aria-label", "Roast level " + level + " out of 5");
        meter.appendChild(el("span", "roast-meter-label", "Roast"));
        for (var n = 1; n <= 5; n++) {
            var bean = el("span", "meter-bean" + (n <= level ? " on" : ""));
            bean.style.transitionDelay = (0.3 + n * 0.12) + "s";
            meter.appendChild(bean);
        }
        entry.appendChild(meter);
        entry.appendChild(el("span", "stock-badge " + stock.cls, stock.text));

        var link = el("a", "cta-button-small", r.stock > 0 ? "Enquire about this roast" : "Ask when it's back");
        link.href = "enquiry.html?roast=" + encodeURIComponent(r.id);
        entry.appendChild(link);
        return entry;
    }

    function render() {
        var q = searchInput.value.trim().toLowerCase();
        var level = filterSelect.value;
        var sort = sortSelect.value;

        var shown = roasts.filter(function (r) {
            var haystack = (r.name + " " + r.origin + " " + r.country + " " + r.process + " " +
                            r.roast + " " + r.notes).toLowerCase();
            return (!q || haystack.indexOf(q) !== -1) && (level === "all" || r.roast === level);
        });

        shown.sort(function (a, b) {
            if (sort === "price-asc") { return a.price - b.price; }
            if (sort === "price-desc") { return b.price - a.price; }
            if (sort === "altitude") { return b.altitude - a.altitude; }
            return a.name.localeCompare(b.name);
        });

        var frag = document.createDocumentFragment();
        shown.forEach(function (r) { frag.appendChild(buildEntry(r)); });
        list.replaceChildren(frag);

        if (!shown.length) {
            list.appendChild(el("p", "empty-state", "No roasts match that search. Try a different word or reset the filters."));
        }
        status.textContent = shown.length + (shown.length === 1 ? " roast" : " roasts") + " showing";
    }

    function reset() {
        searchInput.value = "";
        filterSelect.value = "all";
        sortSelect.value = "name";
        render();
        searchInput.focus();
    }

    KwachaData.load().then(function (data) {
        roasts = data.roasts;
        render();
    });

    searchInput.addEventListener("input", render);
    filterSelect.addEventListener("change", render);
    sortSelect.addEventListener("change", render);
    resetBtn.addEventListener("click", reset);
})();
