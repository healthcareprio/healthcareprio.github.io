/* Builds the simulator model from the Excel tables, so the team only edits Excel.

   The simulator and the How the Model Works page read the SAME four files:
     02-decision-variables-options.xlsx   decision variables and their options
     03-indicators.xlsx                   the consequences (indicators)
     04-rules.xlsx                        what each option does to each consequence
     05-interactions.xlsx                 extra effects for a specific pair of options

   Rules the Excel files must follow (columns are found by their header text,
   so the column order does not matter):

   02-decision-variables-options.xlsx
     "Decision variable"  the name of the decision.
     "Description"        optional, a short line shown under the decision name.
     "Option 1", "Option 2", ...   one option per cell. The first line is the option
                          name. An optional second line (Alt+Enter) is a short description.
                          Each decision needs at least two options.

   03-indicators.xlsx
     "Indicator"          the consequence name.
     "Dimension"          Equity, Governance, Sustainability, or anything else.
     "What it measures"   a short explanation.

   04-rules.xlsx   (one row per option)
     "Rule"               "Decision variable name: Option name", for example
                          "Transparency: Black box". Use the exact names from the options file.
     "Effect on the indicators"   one effect per line, like "Accountability -15".
                          Use the exact indicator names. Do not use commas inside a name.
     "Who gains and who loses"    optional, shown in the simulator.

   05-interactions.xlsx
     "Applies when"       two or more lines like "Transparency: Black box".
     "Extra effect"       same format as the rule effects.
     "Justification"      why the pair matters.

   A cell that says "To be added" counts as empty. If the files are not filled in yet,
   the simulator falls back to the demo model in model-config.js. Problems found in the
   files are listed on the Simulator page so the team can fix them.

   Requires assets/vendor/xlsx.full.min.js, site.js, and model-config.js first. */

var ModelLoader = (function () {
  /* If you rename a file, change its path here too. */
  var FILES = {
    decisions: "assets/tables/02-decision-variables-options.xlsx",
    indicators: "assets/tables/03-indicators.xlsx",
    rules: "assets/tables/04-rules.xlsx",
    interactions: "assets/tables/05-interactions.xlsx"
  };

  function text(v) { return String(v === undefined || v === null ? "" : v).replace(/\r/g, "").trim(); }
  function isBlank(v) { var t = text(v); return t === "" || /^to be added$/i.test(t); }
  function norm(v) { return text(v).replace(/\s+/g, " ").toLowerCase(); }
  function fileName(path) { return path.split("/").pop(); }

  /* Reads the first sheet of an Excel file into { head: [...], rows: [[...], ...] }. */
  function readSheet(path) {
    return fetch(path, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.arrayBuffer(); })
      .then(function (buf) {
        var wb = XLSX.read(buf, { type: "array" });
        var all = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, raw: false, defval: "" });
        return { head: (all[0] || []).map(text), rows: all.slice(1) };
      });
  }

  function findCol(head, pattern, fallback) {
    for (var i = 0; i < head.length; i++) { if (pattern.test(head[i])) { return i; } }
    return fallback === undefined ? -1 : fallback;
  }

  function categoryOf(dimension) {
    var t = norm(dimension);
    if (/equity/.test(t)) { return "equity"; }
    if (/governance/.test(t)) { return "gov"; }
    if (/sustainab|computing/.test(t)) { return "sus"; }
    return "other";
  }

  /* "Accountability -15" lines -> { c2: -15 }. Problems are added to issues. */
  function parseEffects(cell, indicators, issues, where) {
    var effects = {};
    if (isBlank(cell)) { return effects; }
    text(cell).split(/[\n;,]+/).forEach(function (piece) {
      piece = text(piece);
      if (!piece) { return; }
      var m = /^(.*?)\s*([+\-−–])\s*(\d+(?:\.\d+)?)$/.exec(piece);
      if (!m) { issues.push(where + ': "' + piece + '" is not in the form "Indicator name +10".'); return; }
      var ind = indicators.filter(function (i) { return norm(i.label) === norm(m[1]); })[0];
      if (!ind) { issues.push(where + ': there is no indicator named "' + text(m[1]) + '".'); return; }
      effects[ind.id] = (effects[ind.id] || 0) + (m[2] === "+" ? 1 : -1) * parseFloat(m[3]);
    });
    return effects;
  }

  /* "Decision name: Option name" -> { decision, option } (the model objects), or null. */
  function findChoice(model, label, issues, where) {
    var m = /^([\s\S]*?):([\s\S]*)$/.exec(text(label));
    if (!m) { issues.push(where + ': "' + text(label).replace(/\s+/g, " ") + '" is not in the form "Decision variable: Option".'); return null; }
    var d = model.decisions.filter(function (x) { return norm(x.label) === norm(m[1]); })[0];
    if (!d) { issues.push(where + ': there is no decision variable named "' + text(m[1]) + '".'); return null; }
    var o = d.options.filter(function (x) { return norm(x.label) === norm(m[2]); })[0];
    if (!o) { issues.push(where + ': "' + text(m[1]) + '" has no option named "' + text(m[2]) + '".'); return null; }
    return { decision: d, option: o };
  }

  function buildIndicators(sheet, model, issues) {
    var cLabel = findCol(sheet.head, /^indicator|^consequence/i, 0);
    var cDim = findCol(sheet.head, /dimension/i, 1);
    var cMeaning = findCol(sheet.head, /measure|mean/i, 2);
    sheet.rows.forEach(function (row) {
      var label = isBlank(row[cLabel]) ? "" : text(row[cLabel]);
      if (!label) { return; }
      model.indicators.push({
        id: "c" + (model.indicators.length + 1), label: label,
        category: categoryOf(row[cDim]), meaning: isBlank(row[cMeaning]) ? "" : text(row[cMeaning])
      });
    });
  }

  function buildDecisions(sheet, model, issues) {
    var cName = findCol(sheet.head, /decision/i, 1);
    var cHint = findCol(sheet.head, /^description|controls/i);
    var optCols = [];
    sheet.head.forEach(function (h, i) { if (/^option\s*\d/i.test(h)) { optCols.push(i); } });
    sheet.rows.forEach(function (row) {
      var name = isBlank(row[cName]) ? "" : text(row[cName]);
      if (!name) { return; }
      var options = [];
      optCols.forEach(function (c) {
        if (isBlank(row[c])) { return; }
        var lines = text(row[c]).split(/\n/).map(text).filter(Boolean);
        options.push({
          id: "o" + (options.length + 1), label: lines[0], blurb: lines.slice(1).join(" "),
          effects: {}, who: ""
        });
      });
      if (options.length < 2) {
        issues.push('Decision variable "' + name + '" needs at least two options, so it was left out.');
        return;
      }
      model.decisions.push({
        id: "d" + (model.decisions.length + 1), label: name,
        hint: cHint >= 0 && !isBlank(row[cHint]) ? text(row[cHint]) : "", options: options
      });
    });
  }

  function buildRules(sheet, model, issues) {
    var cRule = findCol(sheet.head, /^rule/i, 0);
    var cEffect = findCol(sheet.head, /effect/i, 1);
    var cWho = findCol(sheet.head, /who gains/i);
    sheet.rows.forEach(function (row, n) {
      if (isBlank(row[cRule])) { return; }
      var where = "04-rules.xlsx, row " + (n + 2);
      var choice = findChoice(model, row[cRule], issues, where);
      if (!choice) { return; }
      choice.option.effects = parseEffects(row[cEffect], model.indicators, issues, where);
      choice.option.who = cWho >= 0 && !isBlank(row[cWho]) ? text(row[cWho]) : "";
      choice.option.hasRule = true;
    });
    model.decisions.forEach(function (d) {
      d.options.forEach(function (o) {
        if (!o.hasRule) { issues.push('04-rules.xlsx has no rule for "' + d.label + ": " + o.label + '".'); }
      });
    });
  }

  function buildInteractions(sheet, model, issues) {
    var cWhen = findCol(sheet.head, /applies/i, 1);
    var cEffect = findCol(sheet.head, /effect/i, 2);
    var cWhy = findCol(sheet.head, /justification|why/i, 3);
    sheet.rows.forEach(function (row, n) {
      if (isBlank(row[cWhen])) { return; }
      var where = "05-interactions.xlsx, row " + (n + 2);
      var lines = text(row[cWhen]).split(/\n/).map(function (l) { return text(l).replace(/,$/, ""); }).filter(Boolean);
      if (lines.length === 1) { lines = lines[0].split(/,\s*(?=[^,:]+:)/); }
      var when = [], ok = true;
      lines.forEach(function (l) {
        var c = findChoice(model, l, issues, where);
        if (c) { when.push([c.decision.id, c.option.id]); } else { ok = false; }
      });
      if (!ok) { return; }
      if (when.length < 2) { issues.push(where + ": an interaction needs two or more choices in \"Applies when\"."); return; }
      model.interactions.push({
        id: "i" + (model.interactions.length + 1), when: when,
        effects: parseEffects(row[cEffect], model.indicators, issues, where),
        why: cWhy >= 0 && !isBlank(row[cWhy]) ? text(row[cWhy]) : ""
      });
    });
  }

  /* Returns a promise for { model, issues, usedDemo }. Never rejects. */
  function load() {
    var demo = window.MODEL;
    function fallback(reason, issues) {
      return { model: demo, issues: issues || [], usedDemo: true, reason: reason };
    }
    if (typeof XLSX === "undefined") { return Promise.resolve(fallback("The Excel reader did not load.")); }

    return Promise.all([
      readSheet(FILES.decisions), readSheet(FILES.indicators), readSheet(FILES.rules), readSheet(FILES.interactions)
    ]).then(function (s) {
      var issues = [];
      var model = { baseline: demo.baseline, categories: demo.categories, indicators: [], decisions: [], interactions: [] };
      buildIndicators(s[1], model, issues);
      buildDecisions(s[0], model, issues);
      if (!model.indicators.length || !model.decisions.length) {
        return fallback("The decision variables and indicators are not filled in yet.");
      }
      buildRules(s[2], model, issues);
      buildInteractions(s[3], model, issues);
      return { model: model, issues: issues, usedDemo: false };
    }).catch(function (err) {
      return fallback("The Excel tables could not be loaded. If you opened the file directly, start a local server instead.");
    });
  }

  return { load: load, files: FILES };
})();
