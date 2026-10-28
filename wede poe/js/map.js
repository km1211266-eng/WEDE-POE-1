/* ===========================================
   Kwacha Coffee Roasters - map.js (Part 3)
   Interactive map (Leaflet + OpenStreetMap):
   the roastery marker plus the delivery area.
   Location-based feature: "Find my distance"
   uses the visitor's position, only when they
   press the button and allow it.
   =========================================== */

(function () {
    "use strict";

    var mapEl = document.getElementById("map");
    if (!mapEl || typeof L === "undefined") { return; }

    var roastery = [-26.1937, 28.0036];
    var map = L.map("map", { scrollWheelZoom: false }).setView(roastery, 12);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.circle(roastery, {
        radius: 15000, color: "#B4592B", weight: 1.5, fillColor: "#C0973C", fillOpacity: 0.12
    }).addTo(map).bindTooltip("Johannesburg delivery area (about 15 km)");

    L.marker(roastery).addTo(map)
        .bindPopup("<strong>Kwacha Coffee Roasters</strong><br>4th Avenue, Brixton<br>Tue\u2013Sat, 8am\u20134pm")
        .openPopup();

    // Wheel-zoom only after the map has been clicked, so the page still scrolls.
    map.on("click", function () { map.scrollWheelZoom.enable(); });

    var btn = document.getElementById("locate-btn");
    var out = document.getElementById("locate-result");
    if (btn && out && "geolocation" in navigator) {
        btn.hidden = false;
        btn.addEventListener("click", function () {
            out.textContent = "Finding your position\u2026";
            navigator.geolocation.getCurrentPosition(function (pos) {
                var me = L.latLng(pos.coords.latitude, pos.coords.longitude);
                var km = (me.distanceTo(L.latLng(roastery)) / 1000);
                L.marker(me).addTo(map).bindPopup("You are here").openPopup();
                map.fitBounds(L.latLngBounds([me, roastery]).pad(0.3));
                out.textContent = "You are about " + km.toFixed(1) + " km from the roastery" +
                    (km <= 15 ? " \u2014 inside our delivery area." : " \u2014 outside our usual delivery area, so collection or courier may suit you better.");
            }, function () {
                out.textContent = "We couldn't get your location. You can still use the map above.";
            });
        });
    }
})();
