/* Simulator UI and a generic engine.
   The engine only adds up the numbers in the model. The model comes from the Excel
   tables (see model-loader.js), or from the demo model in model-config.js while the
   tables are not filled in yet. Requires site.js, model-config.js, and model-loader.js. */

(function () {
  var state = {};
  var prev = null;
  var CIRC = 2 * Math.PI * 40;

  function optionOf(d, id) { return d.options.filter(function (o) { return o.id === id; })[0]; }
  function indicator(id) { return MODEL.indicators.filter(function (i) { return i.id === id; })[0]; }
  function signed(n) { return (n > 0 ? "+" : "−") + Math.abs(n); }

  function reset() {
    MODEL.decisions.forEach(function (d) { state[d.id] = d.options[0].id; });
    prev = null;
  }

  /* Formats an effects map as a list with one colored line per indicator:
     "Consequence A +10", "Consequence B -5", ... */
  function effectText(effects) {
    return '<ul class="effect-list">' + Object.keys(effects).filter(function (k) { return effects[k]; }).map(function (k) {
      return "<li>" + esc(indicator(k).label) + ' <span class="' + (effects[k] > 0 ? "pos" : "neg") + '">' + signed(effects[k]) + "</span></li>";
    }).join("") + "</ul>";
  }

  /* Pure function: state in, scores and explanation rows out. */
  function calculate() {
    var scores = {}, why = [], who = [];
    MODEL.indicators.forEach(function (i) { scores[i.id] = MODEL.baseline; });

    MODEL.decisions.forEach(function (d) {
      var o = optionOf(d, state[d.id]);
      Object.keys(o.effects).forEach(function (k) { scores[k] += o.effects[k]; });
      why.push({ cause: esc(d.label) + " ➜ " + esc(o.label), result: effectText(o.effects) });
      who.push({ decision: esc(d.label), text: esc(o.who || "Not described yet.") });
    });

    var fired = [];
    MODEL.interactions.forEach(function (ix, n) {
      var on = ix.when.every(function (c) { return state[c[0]] === c[1]; });
      if (!on) { return; }
      Object.keys(ix.effects).forEach(function (k) { scores[k] += ix.effects[k]; });
      fired.push({
        cause: '<span class="ix-tag">Interaction ' + (n + 1) + "</span>",
        result: effectText(ix.effects) + '<p class="ix-why">' + esc(ix.why) + "</p>"
      });
    });
    why = fired.concat(why);

    Object.keys(scores).forEach(function (k) { scores[k] = Math.max(0, Math.min(100, scores[k])); });

    var ranked = MODEL.indicators.slice().sort(function (a, b) { return scores[b.id] - scores[a.id]; });
    var hi = ranked[0], lo = ranked[ranked.length - 1];
    var trade = [
      { measure: "Strongest indicator", result: "<strong>" + esc(hi.label) + "</strong> (" + scores[hi.id] + ")" },
      { measure: "Weakest indicator", result: "<strong>" + esc(lo.label) + "</strong> (" + scores[lo.id] + ")" },
      { measure: "What is traded off", result: "Placeholder text. Gains in " + esc(hi.label) + " come at the expense of " + esc(lo.label) + " under this set of decisions." }
    ];
    return { scores: scores, why: why, who: who, trade: trade };
  }

  function table(head, rows, keys) {
    return '<div class="table-wrap"><table><thead><tr>' + head.map(function (h) { return "<th>" + h + "</th>"; }).join("") +
      "</tr></thead><tbody>" + rows.map(function (r) {
        return "<tr>" + keys.map(function (k) { return "<td>" + r[k] + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
  }

  function buildDecisions() {
    document.getElementById("decisions").innerHTML = MODEL.decisions.map(function (d) {
      var opts = d.options.map(function (o) {
        var id = d.id + "-" + o.id;
        return '<div class="opt"><input type="radio" name="' + d.id + '" id="' + id + '" value="' + o.id + '"' +
          (state[d.id] === o.id ? " checked" : "") + '><label for="' + id + '"><div><b>' + esc(o.label) +
          "</b><span>" + esc(o.blurb) + "</span></div></label></div>";
      }).join("");
      return '<fieldset class="decision"><legend>' + esc(d.label) + '</legend>' + (d.hint ? '<p class="hint">' + esc(d.hint) + "</p>" : "") +
        '<div class="options">' + opts + "</div></fieldset>";
    }).join("");
  }

  function buildGauges() {
    document.getElementById("gauges").innerHTML = MODEL.indicators.map(function (i) {
      var cat = MODEL.categories[i.category];
      return '<div class="gauge"><svg viewBox="0 0 100 100" role="img" aria-label="' + esc(i.label) + ' score">' +
        '<circle class="ring-bg" cx="50" cy="50" r="40" fill="none" stroke-width="9"/>' +
        '<circle class="ring-fg" id="r-' + i.id + '" cx="50" cy="50" r="40" fill="none" stroke-width="9" stroke-linecap="round" stroke="' + cat.color +
        '" stroke-dasharray="' + CIRC + '" stroke-dashoffset="' + CIRC + '" transform="rotate(-90 50 50)"/>' +
        '<text class="val" id="v-' + i.id + '" x="50" y="58" text-anchor="middle">50</text></svg>' +
        "<b>" + esc(i.label) + '</b><span class="delta" id="d-' + i.id + '" aria-live="polite"></span>' +
        '<span class="tag ' + cat.cls + '">' + cat.label.split(" and ")[0] + "</span></div>";
    }).join("");
  }

  function render() {
    var r = calculate();
    MODEL.indicators.forEach(function (i) {
      var s = r.scores[i.id];
      document.getElementById("v-" + i.id).textContent = s;
      document.getElementById("r-" + i.id).style.strokeDashoffset = CIRC * (1 - s / 100);
      var d = document.getElementById("d-" + i.id);
      if (prev && prev[i.id] !== s) {
        var diff = s - prev[i.id];
        d.textContent = (diff > 0 ? "▲ " : "▼ ") + signed(diff);
        d.className = "delta " + (diff > 0 ? "up" : "down");
      } else if (!prev) { d.textContent = ""; }
    });
    prev = r.scores;
    document.getElementById("why").innerHTML = table(["Cause", "Effect on the indicators"], r.why, ["cause", "result"]);
    document.getElementById("who").innerHTML = table(["Decision", "Who gains and who loses"], r.who, ["decision", "text"]);
    document.getElementById("trade").innerHTML = table(["Measure", "Result"], r.trade, ["measure", "result"]);
  }

  /* Tells the team when the Excel tables could not be used as written. */
  function showStatus(result) {
    var el = document.getElementById("model-status");
    if (!el || (!result.usedDemo && !result.issues.length)) { return; }
    var html = "<span>";
    if (result.usedDemo) {
      html += "<b>Placeholder values.</b> " + esc(result.reason) + " The simulator is showing demo values until the Excel tables are filled in.";
    } else {
      html += "<b>Some rows in the Excel tables could not be used.</b> Please fix them so the simulator is complete.";
    }
    if (result.issues.length) {
      html += "<ul>" + result.issues.slice(0, 8).map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") +
        (result.issues.length > 8 ? "<li>And " + (result.issues.length - 8) + " more.</li>" : "") + "</ul>";
    }
    el.innerHTML = html + "</span>";
    el.hidden = false;
  }

  function start() {
    reset();
    buildDecisions();
    buildGauges();
    render();

    document.getElementById("decisions").addEventListener("change", function (e) {
      if (e.target.type === "radio") { state[e.target.name] = e.target.value; render(); }
    });
    document.getElementById("reset").addEventListener("click", function () {
      reset(); buildDecisions(); render();
    });
  }

  ModelLoader.load().then(function (result) {
    MODEL = result.model;
    showStatus(result);
    start();
  });
})();
