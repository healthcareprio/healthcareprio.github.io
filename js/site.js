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

  /* Brand mark: the project logo (assets/logo.svg). */
  var mark = '<img class="brand-mark" src="assets/logo.svg" alt="" width="38" height="38">';

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
