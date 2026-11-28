/* Loads Excel tables from assets/tables/ and renders them as HTML tables.

   Usage in any page (load assets/vendor/xlsx.full.min.js and site.js first):
       <div data-table="assets/tables/rules.xlsx"></div>
   Add data-columns="3" to the div to show only the first 3 columns.

   How the Excel files are read:
     - Only the FIRST sheet is used. Row 1 is the header row.
     - Press Alt+Enter inside a cell to start a new line.
     - A cell with an Excel hyperlink becomes a link. You can also type
       [link text](https://example.com) inside a cell. Use [link text](#section-id)
       to link to a section on the same page.
     - Lines that start with "- " are shown as bullet points.
     - Text between double asterisks, like **this**, is shown in bold.
     - Any cell that contains "to be added" is shown in grey italics.
   The file name becomes a CSS class (rules.xlsx -> t-rules) for column widths. */

(function () {
  function inline(text) {
    var s = esc(text);
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/\[([^\]]+)\]\((#[A-Za-z0-9_-]+)\)/g, '<a href="$2">$1</a>');
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/&lt;br\s*\/?&gt;/gi, "<br>");
    /* Lines that start with "- " become a bullet list; other lines are joined with line breaks. */
    var out = "", list = false, first = true;
    s.split(/\r?\n/).forEach(function (line) {
      var m = /^\s*-\s+(.*)$/.exec(line);
      if (m) {
        out += (list ? "" : "<ul>") + "<li>" + m[1] + "</li>";
        list = true;
      } else {
        out += (list ? "</ul>" : (first ? "" : "<br>")) + line;
        list = false;
      }
      first = false;
    });
    return out + (list ? "</ul>" : "");
  }

  function safeUrl(url) {
    return /^(https?:|mailto:)/i.test(url) ? url : "";
  }

  /* Turns one worksheet cell into HTML. */
  function cellHtml(cell) {
    if (!cell || cell.v === undefined || cell.v === null) { return ""; }
    var text = typeof cell.v === "string" ? cell.v : String(cell.w !== undefined ? cell.w : cell.v);
    var html = inline(text);
    var url = cell.l && cell.l.Target ? safeUrl(cell.l.Target) : "";
    if (url && html.indexOf("<a ") === -1) {
      html = '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + html + "</a>";
    } else if (/to be added/i.test(text) && !url) {
      html = "<em>" + html + "</em>";
    }
    return html;
  }

  function parse(ws) {
    if (!ws || !ws["!ref"]) { return null; }
    var range = XLSX.utils.decode_range(ws["!ref"]);
    var rows = [];
    for (var r = range.s.r; r <= range.e.r; r++) {
      var row = [], empty = true;
      for (var c = range.s.c; c <= range.e.c; c++) {
        var html = cellHtml(ws[XLSX.utils.encode_cell({ r: r, c: c })]);
        if (html !== "") { empty = false; }
        row.push(html);
      }
      if (!empty) { rows.push(row); }
    }
    return rows.length > 1 ? { head: rows[0], rows: rows.slice(1) } : null;
  }

  function render(el, t) {
    /* data-columns="3" shows only the first 3 columns of the file. */
    var limit = parseInt(el.getAttribute("data-columns"), 10);
    if (limit > 0) {
      t = { head: t.head.slice(0, limit), rows: t.rows.map(function (r) { return r.slice(0, limit); }) };
    }
    var name = el.getAttribute("data-table").split("/").pop().replace(/\.xlsx$/, "");
    el.innerHTML = '<div class="table-wrap t-' + esc(name) + '"><table><thead><tr>' +
      t.head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" +
      t.rows.map(function (r) {
        return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
  }

  function fail(el, path) {
    el.innerHTML = '<div class="table-wrap"><p class="table-error">The table ' + esc(path) +
      " could not be loaded. If you opened this file directly, start a local server instead (see the README).</p></div>";
  }

  document.querySelectorAll("[data-table]").forEach(function (el) {
    var path = el.getAttribute("data-table");
    if (typeof XLSX === "undefined") { fail(el, path); return; }
    /* "no-cache" makes the browser re-check the file, so uploaded edits show up right away. */
    fetch(path, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.arrayBuffer(); })
      .then(function (buf) {
        var wb = XLSX.read(buf, { type: "array" });
        var t = parse(wb.Sheets[wb.SheetNames[0]]);
        if (t) { render(el, t); } else { fail(el, path); }
      })
      .catch(function () { fail(el, path); });
  });
})();
