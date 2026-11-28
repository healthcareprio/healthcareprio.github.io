# Build prompt: Healthcare Prioritization Simulator website

This is the prompt written for an AI coding assistant (such as Claude Code) to build the front end of our final project. It is kept in the repository for transparency about AI use. It has been revised to match the current state of the site.

## 1. Role and goal

You are a senior front-end developer with an eye for healthcare-grade visual design. Build a four-page static website for a graduate course project called **Healthcare Prioritization Simulator**. A visitor changes decisions about how patients are prioritized in a public hospital, and a rule-based model updates several consequence indicators.

Build the complete **front end and interface only**. The real decision variables, consequences, or rules have not been decided yet, and every member must be able to contribute to them. Use clearly marked placeholders (Decision A, Option 1, Consequence A, lorem ipsum) and make them easy to replace without editing HTML.

## 2. Context

- Course: IS 201 Computer Ethics. The final project is a Technology and Society Ethics Simulator.
- Our scenario is **Healthcare Prioritization**: patient prioritization in a public hospital. The group has five members.
- Hosting: **GitHub Pages**, from a public repository in the `healthcareprio` organization, served at `https://healthcareprio.github.io/`. There is no server and no database.
- The course describes the scenario as "AI-assisted patient prioritization in a public hospital", so the Scenario overview heading on Home uses the phrase "AI-assisted". Do not mention any university name in the site or the README.

### Course requirements that constrain the build

- The site is built with **HTML, CSS, and JavaScript**. 
- Libraries from a CDN are allowed. 
- **Frameworks that need a build step (React, Vue, Next.js, Nest, and similar) are not allowed.**
- Use plain static files.
- The link must load and run as submitted, with no setup.
- The final model needs 5 or more decision variables (each with 2 or more options), 5 or more indicators (covering equity, governance, and sustainability, plus others), and 4 or more interactions (each on a different pair of variables, each justified). 
- Indicators update automatically, several variables can affect the same indicator, and trade-offs are real rather than right or wrong.
- There are four pages: 
   - Home
   - Simulator
   - How the Model Works
   - References (which also holds AI use and contributions)

- A 10 to 12 minute YouTube video is embedded on Home.
- A course sample simulator exists, and it uses pill buttons and horizontal bars. Our simulator must look and feel different from it.

## 3. Tech stack and constraints

- Plain HTML5, CSS3, and vanilla JavaScript in classic `<script>` tags (no ES modules, no bundler, no package.json, no database).
- Use **relative paths only** (no leading `/`).
- Google Fonts (Figtree) is the only external resource.
- Include an empty `.nojekyll` file.
- Tables are loaded with `fetch()` from Excel (`.xlsx`) files and read in the browser with the SheetJS library (stored in `assets/vendor/`), so the site needs a web server. 
- Opening a page directly from disk shows a clear error message in place of each table. 
- The README must say to use a local server.

## 4. Visual design direction

The site must feel **premium, calm, and hospital-related**, like a modern health system, not a startup landing page.

- **Palette:** clinical teal as the primary (`#0f7f8c`), deep navy for text and dark bands (`#0b2540`), a soft cool-grey page background (`#f5f8fa`), and white cards. Supporting accents are blue, green, amber, and a restrained coral for urgent states. Define every color as a CSS custom property in `:root`.
- **Typography:** one clean **sans-serif** family (Figtree), weights 400 to 800. **No serif fonts.**
- **It must not look AI-generated.** Avoid purple or pink gradients, glassmorphism, neon glows, sparkle or robot or brain imagery, emoji, gradient text, hype copy, and heavy rounding everywhere. Use flat surfaces, thin borders, soft shadows, and generous whitespace.
- **Layout:** content width about 1160px, 20px gutters on mobile, a sticky white header (no banner above it), and alternating white and tinted section bands.
- **Responsive:** works from 360px to wide desktop, with the mobile navigation collapsing into a toggle.
- **Accessibility:** semantic landmarks, a skip link, visible focus rings, `aria-current="page"` on the active nav link, sufficient contrast, `prefers-reduced-motion` respected, and real radio inputs with labels.
- **Copy style:** write complete sentences everywhere. Avoid fragments such as "Educational simulation. Not a triage tool."

## 5. Shared chrome (`js/site.js`)

- **Navbar** with exactly four links: Home, Simulator, How the Model Works, References. It shows the brand mark and name on the left and highlights the active page.
- **Footer** on every page with a brand block and a short disclaimer sentence, an Explore link list, a **The Team** list of member names, and a legal line reading "© 2026 IS 201 Computer Ethics · Final Project" next to "This simulation is not for clinical use."
- The site name, course name, and member list (names only) are editable constants at the top of the file.

## 6. Page specifications

### Page 1: Home (`index.html`)

1. **Hero:** an eyebrow about patient prioritization in public hospitals, a large headline ("Who gets care first, and what does it cost the rest?"), a lorem ipsum lede, two buttons (Open the simulator, How the model works), and a one-sentence note that this is an educational simulation, is not a triage tool, and should not guide real patient decisions. No statistics row. On the right, a **photo** loaded from `assets/images/hero.jpg` that shows people in a caring, trustworthy hospital setting (for example a nurse holding an elderly patient's hand). While that file is missing, show a designed fallback card with an ECG line and a four-row patient queue. Switch to the photo automatically when it loads.
2. **Scenario overview:** context, societal significance, and affected stakeholders as three cards with lorem ipsum.
3. **How to use this site:** three numbered steps.
4. **Project video:** a 16:9 placeholder with an HTML comment showing how to paste the YouTube iframe.
5. **The team behind the application:** one card per member with an initials avatar and the full name, with no role line. Show all five in one row on wide screens, then wrap on smaller ones.
6. **Closing call to action** on a dark band with a button to the simulator.

### Page 2: Simulator (`simulator.html`)

- A page header, plus a **Draft model** notice stating that the simulator illustrates ethical trade-offs, uses hypothetical values, does not predict real outcomes, and is not a triage tool. Do not use "medical advice" wording, because the site gives no health information.
- **Decisions panel (left):** five decisions named Decision A to E. Each is a fieldset with a legend, a hint line, and two or three options named Option 1, 2, 3, shown as **selectable cards** (real radio inputs). Do not use pills, segmented buttons, or sliders. The panel subtitle reads "Choose one option for each of the 5 decisions." and a Reset button is included.
- **Consequences panel (right, sticky on desktop):** five indicators named Consequence A to E, each as a **circular ring gauge** (SVG) with the score from 0 to 100, a dimension tag, and an up or down delta after each change. The subtitle reads "Each of the 5 indicators is scored from 0 to 100." Rings animate smoothly.
- **Reading the result panel (full width):** three **tables**, generated by JavaScript on every change: "Why the scores changed" (cause and effect, with a labelled badge when an interaction fires), "Who gains, who loses" (one row per decision), and "The trade-off" (strongest indicator, weakest indicator, and what is traded off).
- A visible callout below, "Want the rules behind the numbers? See How the Model Works ➜", styled so it stands out.
- **Logic (placeholder, data-driven):** all numbers live in `js/model-config.js`. The engine in `js/simulator.js` starts every indicator at 50, adds each selected option's effects, adds an interaction's effects only when both of its conditions are selected, and clamps the result to 0 to 100. 
- Provide dummy effects that vary enough that combinations visibly change the rings, and **at least four placeholder interactions on different decision pairs**. No network calls.

### Page 3: How the Model Works (`how-it-works.html`)

- A short intro stating that every score comes from a fixed, visible rule and can be traced back to its decisions. Do not mention AI judgments, and do not add a "this is placeholder" sentence.
- **From decisions to consequences:** two separate lines of text (a longer lorem ipsum paragraph, then a sentence about baseline, added effects, and the 0 to 100 cap), followed by the diagram.
- **Diagram:** `assets/diagrams/decisions-to-consequences.svg` shown with an `<img>` tag, plus an editable `assets/diagrams/decisions-to-consequences.drawio` with the same layout. Both use **right-angle (orthogonal) connectors with rounded corners**, never curves.
- **What each consequence measures:** two separate lines (lorem ipsum, then the sentence about covering equity, governance, and sustainability), then the indicators table.
- **Rules and their justification:** the text "A rule is a fixed relationship:" followed by a bulleted list (IF a decision takes some value, THEN an indicator changes, BECAUSE of evidence or reasoning), then "Effects are points added to the baseline of 50.", then the rules table.
- **Interactions:** a short intro and the interactions table.
- Two cards for model-wide assumptions and limitations, and a closing line that values are hypothetical.

### Page 4: References (`references.html`)

Sections, in order (the page title is "References, AI use, and contributions"):
1. **Online references:** a short intro in complete sentences, then a table of Source and Notes for these links, described honestly from what each page is:
   - <https://github.com/NeelDevenShah/MediPriority> and its presentation PDF <https://github.com/NeelDevenShah/MediPriority/blob/main/assets/presentation.pdf>
   - <https://github.com/BishnuTimilsena/Hospital-Simulation>
   - <https://github.com/SudharsanSaravanan/Hospital_Mangement_System>
   - <https://github.com/The-Swarm-Corporation/HospitalSim>
   - <https://github.com/ehtishambangash/EmergencyDepartmentSimulation>
   - <https://github.com/Aayush-ui/AarogyaQ>
   - <https://github.com/mahmouddattiaa/Hospital-Management-System>
   - <https://github.com/Dakshmulundkar/Hospital-management>
   - <https://inyabuto.github.io/im-data-hub/hnqis.html>
   - <https://github.com/pranavpatel08/Optimizing-Healthcare-Scheduling-Systems>
   - <https://github.com/saiharshavarma/SmartQ-Priority-Based-Patient-Queue-Generating-System>
   - <https://pmc.ncbi.nlm.nih.gov/articles/PMC12808140/>
   - <https://physionet.org/content/persona-patientsim/1.0.0/>
2. **Declaration of AI use:** a table with the columns Tool, How it was used, and How outputs were verified. The first row is **Claude Code** (website scaffolding, placeholder content, and documents, verified by the developer in the browser). Add one placeholder row. Do not add a separate Task column.
3. **Who did what** (eyebrow "Teamwork"): a table with the columns Member and Contributions, with no Role column.
4. **Design inspiration:** a table of Source and What it informed, covering the public healthcare sites used for general tone and structure plus the typeface. Do not list the course sample site. Do not add a course-references section.

### Extra page: Notes (
otes.html)

A draft proposal page for the group, served at /notes (GitHub Pages serves 
otes.html at that address). It is not in the navbar and has 
oindex. It has a sticky on-this-page list, and its tables are Excel files named ssets/tables/notes-*.xlsx. The text is neutral and does not mention who wrote it or who builds the site. It has no timeline.

## 7. Tables live in Excel files

**No table may be written inline in an HTML file.** Every static table is an Excel file in `assets/tables/` so teammates can edit it in Excel and upload it to GitHub without touching HTML:

`03-indicators.xlsx`, `04-rules.xlsx`, `05-interactions.xlsx`, `20-references-online-references.xlsx`, `21-references-declarations-of-ai-use.xlsx`, `22-references-contributions.xlsx`, `23-references-design-inspiration.xlsx`

- In a page, a table is a container such as `<div data-table="assets/tables/04-rules.xlsx"></div>`.
- `js/tables.js` fetches each file (with `cache: "no-cache"`), reads the first sheet with SheetJS (row 1 is the header), and renders an HTML table inside a scrolling `.table-wrap`. The file name becomes a CSS class (`t-rules`) for column widths.
- Cells support `[links](https://example.com)`, `**bold**`, `_italic_`, `` `code` ``, and `\|` for a literal pipe. All other text is escaped.
- If a file fails to load, show a readable error message in place of the table.
- Cells support line breaks (Alt+Enter), Excel hyperlinks, and `[text](url)` links. Any cell containing "to be added" is shown in grey italics. Empty rows are skipped.
- The simulator's own result tables are generated by JavaScript because they change with every choice. They are the only tables not stored in files.
- `04-rules.xlsx` and `05-interactions.xlsx` mirror the numbers in `js/model-config.js`. State in the README and in the config header that both must be updated together.

## 8. File structure

```text
index.html  simulator.html  how-it-works.html  references.html
css/styles.css
js/site.js  js/tables.js  js/model-config.js  js/simulator.js
assets/favicon.svg
assets/images/hero.jpg            (added by the team; optional)
assets/diagrams/*.drawio, *.svg
assets/tables/*.xlsx
assets/vendor/xlsx.full.min.js     (SheetJS, Apache-2.0)
docs/images/*.png                 (README screenshots)
.nojekyll  README.md  PROMPT.md
```

## 9. `js/model-config.js` contract

A single global `MODEL` object with `baseline` (50), `categories` (equity, gov, sus, other, each with a label, tag class, and color), `indicators[]` (id, label, category, meaning), `decisions[]` (id, label, hint, and `options[]` with id, label, blurb, an `effects` map of indicator id to integer points, and a `who` sentence), and `interactions[]` (id, `when` as pairs of decision id and option id, `effects`, and `why`). The header comment explains in four numbered steps how teammates replace the placeholders, including updating the tables. Keep the file free of logic.

## 10. README requirements

Write complete sentences and align the pipes in every Markdown table in the README. Use "➜" (not ">") between steps in navigation paths. Put every URL in a code block on its own line. Include:

- A one-paragraph description and a table of the four pages.
- A technology table (topic, choice, reason).
- **Run locally:** clone the repository first, start a local server (Python or VS Code Live Server), open the address, and a note that opening files directly does not load the tables.
- **Deploy to GitHub Pages**, stating that the site is deployed from the organization and linking to the organization setup section.
- **Set up the GitHub organization:** create the organization, transfer the repository, rename it to `healthcareprio.github.io`, update the local remote with `git remote set-url`, and list what the transfer does not affect.
- Tables for editing the model and the project structure, plus an "Edit and upload table files" section that explains, step by step, how members download a table from GitHub, edit it in Excel, upload it back, and check the result (with a screenshot).
- A closing disclaimer section with complete sentences.

## 11. Acceptance criteria

- All four pages load from a local server with **zero console errors** and no 404s.
- Changing any decision changes at least one ring. A pair that triggers an interaction shows an Interaction badge in the "Why the scores changed" table.
- Replacing an Excel file in `assets/tables/` changes the matching table with no HTML edit.
- Keyboard-only use works end to end, and focus is always visible.
- No serif fonts, no emoji, no gradient text, and no sparkle icons anywhere.
- No mention of any university name anywhere in the site or README.
- Every page has Open Graph and Twitter card tags, with an absolute `og:image` URL pointing to `assets/images/social-preview.jpg` (1200 × 630 pixels, under 300 KB, showing the logo, the headline, and the hero photo), so shared links show a thumbnail.
- The layout has no horizontal scroll at 360px (tables scroll inside their own container).
- No real triage logic, clinical rules, or medical claims are implemented.

## 12. Working style

Write clean, commented, beginner-readable code, because everyone will edit the data and table files. Add no dependencies. When done, summarize what was built, how to run it, and any decision that deviates from this prompt.
