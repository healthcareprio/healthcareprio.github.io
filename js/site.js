/* Shared site chrome: navbar, footer, and team data.
   This is a classic script (no modules). To rename the site or edit the
   team list, change the constants below. */

var SITE = {
  name: "Healthcare Prioritization Simulator",
  short: "Healthcare Prio",
  tagline: "Simulator Project",
  course: "IS 201 Computer Ethics"
};

var TEAM = [
  "Karol Anne F. Panaligan",
  "Mickole S. Malgapo",
  "Marianne Sabio",
  "Don Pancho",
  "Jose Eden"
];

var NAV = [
  { href: "index.html", label: "Home", id: "home" },
  { href: "simulator.html", label: "Simulator", id: "simulator" },
  { href: "how-it-works.html", label: "How the Model Works", id: "model" },
  { href: "references.html", label: "References", id: "references" }
];

function initials(name) {
  var parts = name.replace(/\b[A-Z]\.\s*/g, "").split(/\s+/).filter(Boolean);
  return (parts[0][0] + (parts[parts.length - 1][0] || "")).toUpperCase();
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

(function () {
  var page = document.body.getAttribute("data-page");

  /* Brand mark: a minimal hand holding a heart (care and trust). */
  var mark =
    '<span class="brand-mark" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/>' +
    '<path d="m7 20 1.6 1.4c.3.4.8.6 1.4.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/>' +
    '<path d="m2 15 6 6"/></svg></span>';

  var navLinks = NAV.map(function (n) {
    return '<a href="' + n.href + '"' + (n.id === page ? ' aria-current="page"' : "") + ">" + n.label + "</a>";
  }).join("");

  var brand = function (href) {
    return '<a class="brand" href="' + href + '" aria-label="' + SITE.name + ' home">' + mark +
      '<span class="brand-text"><b>' + SITE.short + "</b><span>" + SITE.tagline + "</span></span></a>";
  };

  var header =
    '<a class="skip" href="#main">Skip to content</a>' +
    '<header class="site-header"><div class="wrap">' + brand("index.html") +
    '<button class="nav-toggle" aria-expanded="false" aria-controls="nav" aria-label="Toggle menu">' +
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
    '<nav class="nav" id="nav" aria-label="Main">' + navLinks + "</nav></div></header>";

  var footer =
    '<footer class="site-footer"><div class="wrap"><div class="cols">' +
    "<div>" + brand("index.html") +
    "<p>This site is an educational simulation. It illustrates ethical trade-offs and does not replace medical advice.</p></div>" +
    "<div><h4>Explore</h4><ul>" + NAV.map(function (n) { return '<li><a href="' + n.href + '">' + n.label + "</a></li>"; }).join("") + "</ul></div>" +
    "<div><h4>The Team</h4><ul>" + TEAM.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>" +
    '</div><div class="legal"><span>&copy; 2026 ' + SITE.course + " &middot; Final Project</span>" +
    "<span>This simulation is not for clinical use.</span></div></div></footer>";

  document.body.insertAdjacentHTML("afterbegin", header);
  document.body.insertAdjacentHTML("beforeend", footer);

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();
