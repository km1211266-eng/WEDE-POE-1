/* ===========================================
   Kwacha Coffee Roasters - forms.js (Part 3)
   Client-side validation, error handling and
   AJAX submission for both forms.

   enquiry.html - validated order/wholesale
     enquiry; the page replies with an instant
     quote and stock availability.
   contact.html - validated general message;
     sent with AJAX, then compiled into an
     email the visitor can send to RECIPIENT.
   =========================================== */

(function () {
    "use strict";

    // Where finished messages are addressed.
    var RECIPIENT = "hello@kwachacoffee.co.za";
    // Demo AJAX endpoint (echoes the data back). Replace with a real form
    // service URL (e.g. Formspree) when the site goes live.
    var AJAX_ENDPOINT = "https://jsonplaceholder.typicode.com/posts";

    /* ---------- shared helpers ---------- */
    var RULES = {
        name: function (v) {
            if (v.length < 2) { return "Please enter your full name (at least 2 characters)."; }
            if (!/^[A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F '\u2019.-]*$/.test(v)) { return "Names can only contain letters, spaces, apostrophes, full stops and hyphens."; }
            return "";
        },
        email: function (v) {
            if (!v) { return "Please enter your email address."; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { return "That doesn't look like a valid email address (e.g. name@example.com)."; }
            return "";
        },
        phone: function (v, optional) {
            if (!v) { return optional ? "" : "Please enter a phone number."; }
            // South African numbers: 0821234567, 082 123 4567 or +27 82 123 4567
            var digits = v.replace(/[\s()-]/g, "");
            if (!/^(\+27|0)[1-9]\d{8}$/.test(digits)) { return "Use a South African number, e.g. 082 123 4567 or +27 82 123 4567."; }
            return "";
        },
        select: function (v) { return v ? "" : "Please choose an option."; },
        quantity: function (v) {
            var n = Number(v);
            if (!v) { return "Please enter how many bags you need."; }
            if (!Number.isInteger(n) || n < 1 || n > 100) { return "Quantity must be a whole number from 1 to 100."; }
            return "";
        },
        message: function (v) {
            if (v.length < 20) { return "Please write at least 20 characters so we can help properly (" + v.length + "/20)."; }
            if (v.length > 600) { return "Please keep your message under 600 characters."; }
            return "";
        },
        subject: function (v) {
            if (v.length < 3) { return "Please add a short subject (at least 3 characters)."; }
            if (v.length > 80) { return "Subject must be 80 characters or fewer."; }
            return "";
        }
    };

    function errorBox(field) { return document.getElementById(field.id + "-error"); }

    function setError(field, message) {
        var box = errorBox(field);
        if (box) { box.textContent = message; }
        field.classList.toggle("is-invalid", !!message);
        field.classList.toggle("is-valid", !message && field.value !== "");
        if (message) { field.setAttribute("aria-invalid", "true"); } else { field.removeAttribute("aria-invalid"); }
        return !message;
    }

    function check(field) {
        var rule = field.dataset.rule;
        if (!rule || !RULES[rule]) { return true; }
        var value = field.value.trim();
        var msg = RULES[rule](value, field.dataset.optional === "true");
        return setError(field, msg);
    }

    function wire(form) {
        var fields = Array.prototype.slice.call(form.querySelectorAll("[data-rule]"));
        fields.forEach(function (f) {
            f.addEventListener("blur", function () { check(f); });
            f.addEventListener("input", function () { if (f.classList.contains("is-invalid")) { check(f); } });
        });
        return fields;
    }

    function validateAll(fields) {
        var firstBad = null;
        fields.forEach(function (f) { if (!check(f) && !firstBad) { firstBad = f; } });
        if (firstBad) { firstBad.focus(); }
        return !firstBad;
    }

    function postJSON(payload) {
        return fetch(AJAX_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: JSON.stringify(payload)
        }).then(function (res) {
            if (!res.ok) { throw new Error("Server replied " + res.status); }
            return res.json();
        });
    }

    function setBusy(btn, busy, idleText) {
        btn.disabled = busy;
        btn.textContent = busy ? "Sending\u2026" : idleText;
    }

    /* ---------- contact form ---------- */
    var contact = document.getElementById("contact-form");
    if (contact) {
        var cFields = wire(contact);
        var msgField = document.getElementById("message");
        var counter = document.getElementById("message-count");
        msgField.addEventListener("input", function () {
            counter.textContent = msgField.value.length + " / 600";
        });

        contact.addEventListener("submit", function (e) {
            e.preventDefault();
            var feedback = document.getElementById("contact-feedback");
            feedback.className = "form-feedback";
            feedback.textContent = "";
            if (!validateAll(cFields)) {
                feedback.className = "form-feedback is-error";
                feedback.textContent = "Please fix the highlighted fields and try again.";
                return;
            }
            var data = {
                name: contact.elements.name.value.trim(),
                email: contact.elements.email.value.trim(),
                phone: contact.elements.phone.value.trim(),
                type: contact.elements.type.value,
                subject: contact.elements.subject.value.trim(),
                message: contact.elements.message.value.trim()
            };
            var btn = contact.querySelector("button[type=submit]");
            setBusy(btn, true, "Send message");

            var body = "Hello Kwacha Coffee Roasters,\n\n" + data.message +
                "\n\n\u2014\nName: " + data.name + "\nEmail: " + data.email +
                (data.phone ? "\nPhone: " + data.phone : "") + "\nMessage type: " + data.type;
            var mailto = "mailto:" + RECIPIENT + "?subject=" +
                encodeURIComponent("[" + data.type + "] " + data.subject) + "&body=" + encodeURIComponent(body);

            postJSON(data).then(function () {
                feedback.className = "form-feedback is-success";
                feedback.innerHTML = "";
                var p = document.createElement("p");
                p.textContent = "Thanks, " + data.name.split(" ")[0] + " \u2014 your message is ready. Press the button below to send it from your email app to " + RECIPIENT + ".";
                var a = document.createElement("a");
                a.href = mailto;
                a.className = "cta-button-small";
                a.textContent = "Open email and send";
                feedback.appendChild(p);
                feedback.appendChild(a);
                if (window.KwachaFX) { KwachaFX.burst(feedback); }
                contact.reset();
                counter.textContent = "0 / 600";
                Array.prototype.forEach.call(contact.querySelectorAll(".is-valid"), function (f) { f.classList.remove("is-valid"); });
            }).catch(function () {
                feedback.className = "form-feedback is-error";
                feedback.innerHTML = "";
                var p = document.createElement("p");
                p.textContent = "We couldn't reach the server, but your message is safe. You can still send it by email:";
                var a = document.createElement("a");
                a.href = mailto;
                a.className = "cta-button-small";
                a.textContent = "Send by email instead";
                feedback.appendChild(p);
                feedback.appendChild(a);
            }).then(function () { setBusy(btn, false, "Send message"); });
        });
    }

    /* ---------- enquiry form ---------- */
    var enquiry = document.getElementById("enquiry-form");
    if (enquiry) {
        var eFields = wire(enquiry);
        var roastSelect = document.getElementById("roast");
        var pricing = null;

        KwachaData.load().then(function (data) {
            pricing = data;
            data.roasts.forEach(function (r) {
                var o = document.createElement("option");
                o.value = r.id;
                o.textContent = r.name + " \u2014 " + KwachaData.money(r.price) + " / 250g";
                roastSelect.appendChild(o);
            });
            var wanted = new URLSearchParams(window.location.search).get("roast");
            if (wanted) { roastSelect.value = wanted; }
        });

        enquiry.addEventListener("submit", function (e) {
            e.preventDefault();
            var result = document.getElementById("enquiry-result");
            result.hidden = true;
            if (!validateAll(eFields)) { return; }
            if (!pricing) { return; }

            var roast = pricing.roasts.filter(function (r) { return r.id === roastSelect.value; })[0];
            var qty = Number(enquiry.elements.quantity.value);
            var kind = enquiry.elements.type.value;
            var delivery = enquiry.elements.delivery.value;
            var subtotal = roast.price * qty;
            var discount = (kind === "Wholesale" && qty >= pricing.wholesaleMinBags) ? subtotal * pricing.wholesaleDiscount : 0;
            var after = subtotal - discount;
            var fee = (delivery === "delivery" && after < pricing.freeDeliveryOver) ? pricing.deliveryFee : 0;
            var total = after + fee;
            var stock = KwachaData.stockLabel(roast.stock);

            var lines = [];
            lines.push(["Roast", roast.name + " (" + roast.roast + " roast)"]);
            lines.push(["Quantity", qty + " \u00D7 250g bag" + (qty > 1 ? "s" : "") + " @ " + KwachaData.money(roast.price)]);
            lines.push(["Subtotal", KwachaData.money(subtotal)]);
            if (discount) { lines.push(["Wholesale discount (15%)", "\u2212" + KwachaData.money(discount)]); }
            lines.push([delivery === "delivery" ? "Delivery (Johannesburg)" : "Collection (Brixton)",
                        fee ? KwachaData.money(fee) : (delivery === "delivery" ? "Free (order over " + KwachaData.money(pricing.freeDeliveryOver) + ")" : "Free")]);
            lines.push(["Estimated total", KwachaData.money(total)]);

            var availability;
            if (roast.stock <= 0) {
                availability = roast.name + " is sold out right now. We'll email " + enquiry.elements.email.value.trim() + " the moment the next roast is bagged.";
            } else if (qty > roast.stock) {
                availability = "We only have " + roast.stock + " bag" + (roast.stock > 1 ? "s" : "") + " of " + roast.name + " at the moment. We can supply " + roast.stock + " now and the rest from the next roast (Wednesday or Friday).";
            } else {
                availability = "Good news \u2014 " + roast.name + " is available. " + (delivery === "delivery" ? "We deliver within Johannesburg within 2 working days." : "Your bags will be held for collection, Tuesday to Saturday, 8am\u20134pm.");
            }

            result.innerHTML = "";
            var h = document.createElement("h2");
            h.textContent = "Thanks, " + enquiry.elements.name.value.trim().split(" ")[0] + " \u2014 here's your quote";
            result.appendChild(h);
            var badge = document.createElement("span");
            badge.className = "stock-badge " + stock.cls;
            badge.textContent = stock.text;
            result.appendChild(badge);
            var dl = document.createElement("dl");
            dl.className = "quote";
            lines.forEach(function (l, i) {
                var dt = document.createElement("dt"); dt.textContent = l[0];
                var dd = document.createElement("dd"); dd.textContent = l[1];
                if (i === lines.length - 1) { dt.className = dd.className = "quote-total"; }
                dl.appendChild(dt); dl.appendChild(dd);
            });
            result.appendChild(dl);
            var p = document.createElement("p");
            p.textContent = availability;
            result.appendChild(p);
            var note = document.createElement("p");
            note.className = "form-note";
            note.textContent = "This is an estimate. We'll confirm the final price and payment details by email within two working days.";
            result.appendChild(note);
            result.hidden = false;
            result.focus();
            if (window.KwachaFX) { KwachaFX.burst(result); }

            // Send the enquiry to the server in the background (AJAX).
            postJSON({
                name: enquiry.elements.name.value.trim(), email: enquiry.elements.email.value.trim(),
                phone: enquiry.elements.phone.value.trim(), type: kind, roast: roast.id,
                quantity: qty, delivery: delivery, grind: enquiry.elements.grind.value,
                notes: enquiry.elements.notes.value.trim(), estimatedTotal: total
            }).catch(function () { /* quote is already shown; nothing else to do */ });
        });
    }
})();
