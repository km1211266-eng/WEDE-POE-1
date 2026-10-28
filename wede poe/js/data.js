/* ===========================================
   Kwacha Coffee Roasters - data.js (Part 3)
   Loads the roast list with AJAX (fetch) from
   data/products.json. If the request fails (for
   example when the site is opened straight from
   the file system), an identical built-in copy is
   used so the page still works.
   =========================================== */

window.KwachaData = (function () {
    "use strict";

    var FALLBACK = {
    "deliveryFee": 60,
    "freeDeliveryOver": 400,
    "wholesaleMinBags": 10,
    "wholesaleDiscount": 0.15,
    "roasts": [
        {
            "id": "highveld-sunrise",
            "name": "Highveld Sunrise",
            "origin": "Magoebaskloof, Limpopo",
            "country": "South Africa",
            "altitude": 1200,
            "process": "washed",
            "roast": "medium",
            "price": 145,
            "stock": 38,
            "notes": "Bright and citrus-forward with a caramel finish. Our lightest roast, and the one to skip if you take your coffee with a lot of milk.",
            "flavours": [
                "Citrus",
                "Caramel",
                "Bright"
            ]
        },
        {
            "id": "midnight-kraal",
            "name": "Midnight Kraal",
            "origin": "Mzuzu, Malawi",
            "country": "Malawi",
            "altitude": 1400,
            "process": "natural",
            "roast": "dark",
            "price": 160,
            "stock": 6,
            "notes": "Bold and smoky, with dark chocolate carrying through into the finish. Holds up well in a moka pot or French press.",
            "flavours": [
                "Dark chocolate",
                "Smoky",
                "Bold"
            ]
        },
        {
            "id": "karoo-gold",
            "name": "Karoo Gold",
            "origin": "Copperbelt, Zambia",
            "country": "Zambia",
            "altitude": 1300,
            "process": "washed",
            "roast": "medium-dark",
            "price": 150,
            "stock": 0,
            "notes": "Smooth and nutty with a honey finish that lingers. The one we hand people who say they don't really like coffee.",
            "flavours": [
                "Nutty",
                "Honey",
                "Smooth"
            ]
        }
    ]
};

    function load() {
        return fetch("data/products.json", { headers: { Accept: "application/json" } })
            .then(function (res) {
                if (!res.ok) { throw new Error("HTTP " + res.status); }
                return res.json();
            })
            .catch(function () { return FALLBACK; });
    }

    function stockLabel(stock) {
        if (stock <= 0) { return { text: "Sold out", cls: "stock-out" }; }
        if (stock <= 10) { return { text: "Low stock - " + stock + " bags left", cls: "stock-low" }; }
        return { text: "In stock", cls: "stock-in" };
    }

    function money(n) { return "R" + n.toFixed(2).replace(/\.00$/, ""); }

    return { load: load, stockLabel: stockLabel, money: money };
})();
