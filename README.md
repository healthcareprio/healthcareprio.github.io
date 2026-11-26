# Healthcare Prioritization Simulator

This is the final project for IS 201 Computer Ethics. It is a four-page website where visitors change decisions about prioritizing patients in a public hospital. A rule-based model then shows the consequences for equity, governance, and sustainability.

## Pages

| Page                | File                | Purpose                                                                  |
| ------------------- | ------------------- | ------------------------------------------------------------------------ |
| Home                | `index.html`        | Scenario overview, project video, and the team                           |
| Simulator           | `simulator.html`    | Decisions go in, and the consequence dashboard and explanations come out |
| How the Model Works | `how-it-works.html` | Diagram, rules, interactions, assumptions, and limitations               |
| References          | `references.html`   | Sources, declaration of AI use, and who did what                         |

## Technology choices

| Topic         | Choice                             | Reason                                                                             |
| ------------- | ---------------------------------- | ---------------------------------------------------------------------------------- |
| Languages     | HTML, CSS, and plain JavaScript    | The course requires them                                                           |
| Build step    | None                               | The course does not allow frameworks that need one, such as React, Vue, or Next.js |
| Database      | None                               | The site is static and runs on GitHub Pages                                        |
| Node.js       | Not required                       | There is nothing to install or compile                                             |
| Table content | Markdown files in `assets/tables/` | Teammates can edit tables without touching the HTML                                |
| Hosting       | GitHub Pages                       | The course requires a public repository and a Pages link                           |

## Run locally

1. Clone the repository and open the folder.

   ```bash
   git clone git@github.com:healthcareprio/healthcareprio.github.io.git project-upou-is201-healthcare-prio-sims
   cd project-upou-is201-healthcare-prio-sims
   ```

2. Start a local web server. Use either option below.

   **Option 1: Python (recommended)**

   ```bash
   python -m http.server 8000
   ```

   **Option 2: VS Code**

   Install the Live Server extension, right-click `index.html`, and choose **Open with Live Server**.

3. Open the site in a web browser.

   ```text
   http://localhost:8000
   ```

4. Stop the Python server with `Ctrl+C` when you are done.

> **Note:** The tables are loaded from the files in `assets/tables/`. Browsers block this when `index.html` is opened directly from disk, so the pages show an error message in place of the tables. Always use a local server.

## Deploy to GitHub Pages

The site is deployed from the `healthcareprio` GitHub organization. To create the organization and move the repository into it, see [Set up the GitHub organization](#set-up-the-github-organization).

The course requires a **public** repository.

1. Push your changes to GitHub. The default branch is `master`.

   ```bash
   git add .
   git commit -m "Update site"
   git push origin master
   ```

2. Make sure the repository is public: **Settings ➜ General ➜ Danger Zone ➜ Change visibility**.
3. Open **Settings ➜ Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Select the branch `master` and the folder `/ (root)`, then click **Save**.
6. Wait about a minute. The site is published at this address:

   ```text
   https://healthcareprio.github.io/
   ```

7. Open the link in a private browser window and click through all four pages before submitting. The link must load as submitted.

Every later push to `master` redeploys the site automatically.

## Set up the GitHub organization

A site address like `healthcareprio.github.io` is a GitHub organization site. It requires an organization named `healthcareprio` that owns a repository named exactly `healthcareprio.github.io`.

### 1. Create the GitHub organization

1. Go to the page below.

   ```text
   https://github.com/account/organizations/new
   ```

2. Select the appropriate GitHub plan.
3. Enter the organization account name: `healthcareprio`.
4. Provide your contact email.
5. Select **My personal account** when asked who the organization belongs to.
6. Add the organization members.
7. Complete the organization creation.

If the name is available, the organization is created at this address:

```text
https://github.com/healthcareprio
```

### 2. Transfer the existing repository

1. Open the existing repository.

   ```text
   https://github.com/joseeden/project-upou-mis-is201-healthcare-prio-sims
   ```

2. Go to **Settings ➜ General ➜ Danger Zone ➜ Transfer ownership**.
3. Choose the `healthcareprio` organization as the new owner.

### 3. Rename the repository

1. In the transferred repository, go to **Settings ➜ General**.
2. Change the repository name to `healthcareprio.github.io` and click **Rename**.

### 4. Update the local Git remote

Check the current remote.

```bash
git remote -v
```

```text
origin  git@github.com:joseeden/project-upou-mis-is201-healthcare-prio-sims.git (fetch)
origin  git@github.com:joseeden/project-upou-mis-is201-healthcare-prio-sims.git (push)
```

Point it at the new location.

```bash
git remote set-url origin git@github.com:healthcareprio/healthcareprio.github.io.git
```

Confirm the change.

```bash
git remote -v
```

```text
origin  git@github.com:healthcareprio/healthcareprio.github.io.git (fetch)
origin  git@github.com:healthcareprio/healthcareprio.github.io.git (push)
```

Transferring and renaming the repository does not affect:

- Commit history
- Existing branches
- Collaborators and permissions
- Issues and pull requests
- The local project folder name

You can rename the local folder to anything you like. Git does not care about the folder name.

## Editing the model

| File                     | What it controls                                                                |
| ------------------------ | ------------------------------------------------------------------------------- |
| `js/model-config.js`     | Decisions, options, indicators, effects, and interactions used by the simulator |
| `js/site.js`             | Site name and the list of team members                                          |
| `index.html`             | The Home text and the YouTube embed (replace the marked placeholder block)      |
| `assets/images/hero.jpg` | The photo shown in the Home hero (optional)                                     |

Notes on how the scores work:

- Each indicator starts at 50.
- Each selected option adds its effect to the indicators.
- Matching interactions add extra effects.
- The final score is capped between 0 and 100.
- After you change a number in `js/model-config.js`, update the matching row in `assets/tables/rules.md` or `assets/tables/interactions.md` so the How the Model Works page stays accurate.

## Editing the tables

Every table on the site is a Markdown file in `assets/tables/`. Edit the file and the page updates. No HTML changes are needed.

| File                    | Page                | Content                                       |
| ----------------------- | ------------------- | --------------------------------------------- |
| `indicators.md`         | How the Model Works | What each consequence measures                |
| `rules.md`              | How the Model Works | Effect, evidence, and weight for every option |
| `interactions.md`       | How the Model Works | The pairs of decisions that change a result   |
| `online-references.md`  | References          | Online sources                                |
| `ai-use.md`             | References          | Declaration of AI use                         |
| `contributions.md`      | References          | Who did what                                  |
| `design-inspiration.md` | References          | Design references                             |

Rules for editing a table file:

- Keep the header row and the separator row (the one with dashes).
- Each row must start and end with a pipe character.
- Pipes do not need to line up, but aligned pipes are easier to read.
- Write links as `[text](https://example.com)`, bold as `**text**`, and italics as `_text_`.
- Write `\|` for a literal pipe inside a cell.

The flow diagram on the How the Model Works page is `assets/diagrams/decisions-to-consequences.drawio`. Open it at [app.diagrams.net](https://app.diagrams.net), edit it, then export it as SVG to `assets/diagrams/decisions-to-consequences.svg`.

## Project structure

| Path                                                                   | Purpose                                            |
| ---------------------------------------------------------------------- | -------------------------------------------------- |
| `index.html`, `simulator.html`, `how-it-works.html`, `references.html` | The four pages                                     |
| `css/styles.css`                                                       | Design tokens and styles                           |
| `js/site.js`                                                           | Navbar, footer, and team data                      |
| `js/model-config.js`                                                   | The model used by the simulator                    |
| `js/simulator.js`                                                      | Simulator interface and calculation engine         |
| `js/tables.js`                                                         | Loads the Markdown tables and renders them as HTML |
| `assets/tables/`                                                       | Markdown source for every table                    |
| `assets/diagrams/`                                                     | Diagram sources (`.drawio`) and exports (`.svg`)   |
| `assets/images/`                                                       | Photos                                             |
| `PROMPT.md`                                                            | The prompt used to generate this site              |

## Disclaimer

This site is an educational simulation. It illustrates ethical trade-offs and does not predict real outcomes. It is not medical advice, and it is not intended for clinical use. All numeric values are hypothetical.
