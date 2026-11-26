/* Loads Markdown tables from assets/tables/ and renders them as HTML tables.

   Usage in any page:
       <div data-table="assets/tables/rules.md"></div>

   Editing: teammates change only the .md files. Supported inside cells:
       [link text](https://example.com)   **bold**   _italic_   `code`
   Use <br> to start a new line inside a cell, and \| for a literal pipe character.
   Needs site.js loaded first (for esc). */

(function () {
  function inline(text) {
    var s = esc(text);
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/(^|[\s(])_(.+?)_(?=[\s).,;:]|$)/g, "$1<em>$2</em>");
    s = s.replace(/&lt;br\s*\/?&gt;/gi, "<br>");
    return s;
  }

  function splitRow(line) {
    var body = line.trim().replace(/^\|/, "").replace(/\|$/, "");
    return body.split(/(?<!\\)\|/).map(function (c) { return c.trim().replace(/\\\|/g, "|"); });
  }

  function parse(md) {
    var lines = md.split(/\r?\n/).filter(function (l) { return l.trim().charAt(0) === "|"; });
    if (lines.length < 2) { return null; }
    return { head: splitRow(lines[0]), rows: lines.slice(2).map(splitRow) };
  }

  function render(el, t) {
    /* The file name becomes a CSS class (rules.md -> t-rules) for column widths. */
    var name = el.getAttribute("data-table").split("/").pop().replace(/\.md$/, "");
    var html = '<div class="table-wrap t-' + esc(name) + '"><table><thead><tr>' +
      t.head.map(function (h) { return "<th>" + inline(h) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      t.rows.map(function (r) {
        return "<tr>" + r.map(function (c) { return "<td>" + inline(c) + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
    el.innerHTML = html;
  }

  function fail(el, path) {
    el.innerHTML = '<div class="table-wrap"><p class="table-error">The table ' + esc(path) +
      " could not be loaded. If you opened this file directly, start a local server instead (see the README).</p></div>";
  }

  document.querySelectorAll("[data-table]").forEach(function (el) {
    var path = el.getAttribute("data-table");
    fetch(path)
      .then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.text(); })
      .then(function (md) { var t = parse(md); if (t) { render(el, t); } else { fail(el, path); } })
      .catch(function () { fail(el, path); });
  });
})();
