/* ==========================================================================
   DEMO MODEL  -  placeholder values used only until the Excel tables are filled in.

   The real model is NOT edited here. The simulator builds it from the Excel files
   in assets/tables/ (see js/model-loader.js for the exact format):
     02-decision-variables-options.xlsx, 03-indicators.xlsx,
     04-rules.xlsx, 05-interactions.xlsx
   If those files are not filled in yet, the simulator shows this demo model instead.

   The baseline and the category colours below are also used for the real model.
   ========================================================================== */

var MODEL = {
  baseline: 50, /* every indicator starts here, 0-100 */

  /* category -> tag class + ring colour. The assignment requires equity,
     governance and sustainability, plus any other dimensions. */
  categories: {
    equity: { label: "Equity and social justice", cls: "tag-equity", color: "#0f7f8c" },
    gov: { label: "Governance and responsible innovation", cls: "tag-gov", color: "#2f6db5" },
    sus: { label: "Computing and sustainability", cls: "tag-sus", color: "#3c9a5f" },
    other: { label: "Other dimension", cls: "tag-other", color: "#c98a1b" }
  },

  indicators: [
    { id: "c1", label: "Consequence A", category: "equity", meaning: "Placeholder meaning of Consequence A." },
    { id: "c2", label: "Consequence B", category: "gov", meaning: "Placeholder meaning of Consequence B." },
    { id: "c3", label: "Consequence C", category: "sus", meaning: "Placeholder meaning of Consequence C." },
    { id: "c4", label: "Consequence D", category: "other", meaning: "Placeholder meaning of Consequence D." },
    { id: "c5", label: "Consequence E", category: "other", meaning: "Placeholder meaning of Consequence E." }
  ],

  decisions: [
    {
      id: "d1", label: "Decision A", hint: "Placeholder: what this decision controls.",
      options: [
        { id: "o1", label: "Option 1", blurb: "Lorem ipsum dolor sit amet.", effects: { c1: 10, c2: -5, c3: 0, c4: 5, c5: 0 }, who: "Placeholder: who gains or loses under Decision A, Option 1." },
        { id: "o2", label: "Option 2", blurb: "Consectetur adipiscing elit.", effects: { c1: -10, c2: 10, c3: 5, c4: 0, c5: 5 }, who: "Placeholder: who gains or loses under Decision A, Option 2." },
        { id: "o3", label: "Option 3", blurb: "Sed do eiusmod tempor.", effects: { c1: 5, c2: 5, c3: -10, c4: -5, c5: 10 }, who: "Placeholder: who gains or loses under Decision A, Option 3." }
      ]
    },
    {
      id: "d2", label: "Decision B", hint: "Placeholder: what this decision controls.",
      options: [
        { id: "o1", label: "Option 1", blurb: "Lorem ipsum dolor sit amet.", effects: { c1: 0, c2: 15, c3: -5, c4: 10, c5: -5 }, who: "Placeholder: who gains or loses under Decision B, Option 1." },
        { id: "o2", label: "Option 2", blurb: "Consectetur adipiscing elit.", effects: { c1: 10, c2: -10, c3: 10, c4: -5, c5: 0 }, who: "Placeholder: who gains or loses under Decision B, Option 2." }
      ]
    },
    {
      id: "d3", label: "Decision C", hint: "Placeholder: what this decision controls.",
      options: [
        { id: "o1", label: "Option 1", blurb: "Lorem ipsum dolor sit amet.", effects: { c1: -5, c2: 0, c3: 15, c4: 0, c5: 5 }, who: "Placeholder: who gains or loses under Decision C, Option 1." },
        { id: "o2", label: "Option 2", blurb: "Consectetur adipiscing elit.", effects: { c1: 5, c2: 5, c3: 0, c4: -10, c5: 0 }, who: "Placeholder: who gains or loses under Decision C, Option 2." },
        { id: "o3", label: "Option 3", blurb: "Sed do eiusmod tempor.", effects: { c1: 0, c2: -5, c3: -10, c4: 10, c5: 10 }, who: "Placeholder: who gains or loses under Decision C, Option 3." }
      ]
    },
    {
      id: "d4", label: "Decision D", hint: "Placeholder: what this decision controls.",
      options: [
        { id: "o1", label: "Option 1", blurb: "Lorem ipsum dolor sit amet.", effects: { c1: 5, c2: 10, c3: 0, c4: -10, c5: 0 }, who: "Placeholder: who gains or loses under Decision D, Option 1." },
        { id: "o2", label: "Option 2", blurb: "Consectetur adipiscing elit.", effects: { c1: -5, c2: -5, c3: 5, c4: 15, c5: -5 }, who: "Placeholder: who gains or loses under Decision D, Option 2." }
      ]
    },
    {
      id: "d5", label: "Decision E", hint: "Placeholder: what this decision controls.",
      options: [
        { id: "o1", label: "Option 1", blurb: "Lorem ipsum dolor sit amet.", effects: { c1: 0, c2: 5, c3: 10, c4: 0, c5: -10 }, who: "Placeholder: who gains or loses under Decision E, Option 1." },
        { id: "o2", label: "Option 2", blurb: "Consectetur adipiscing elit.", effects: { c1: 10, c2: 0, c3: -5, c4: 5, c5: 10 }, who: "Placeholder: who gains or loses under Decision E, Option 2." },
        { id: "o3", label: "Option 3", blurb: "Sed do eiusmod tempor.", effects: { c1: -10, c2: 10, c3: 0, c4: 0, c5: 5 }, who: "Placeholder: who gains or loses under Decision E, Option 3." }
      ]
    }
  ],

  /* An interaction applies ONLY when both conditions hold at once. The assignment
     needs 4+ interactions, each on a different pair of decisions, each justified. */
  interactions: [
    { id: "i1", when: [["d1", "o1"], ["d2", "o1"]], effects: { c1: 15 }, why: "Placeholder: Decision A Option 1 and Decision B Option 1 reinforce each other." },
    { id: "i2", when: [["d2", "o2"], ["d3", "o3"]], effects: { c2: -15 }, why: "Placeholder: Decision B Option 2 weakens when paired with Decision C Option 3." },
    { id: "i3", when: [["d3", "o1"], ["d4", "o2"]], effects: { c3: 10, c4: -10 }, why: "Placeholder: Decision C Option 1 with Decision D Option 2 shifts cost between indicators." },
    { id: "i4", when: [["d4", "o1"], ["d5", "o2"]], effects: { c5: 15 }, why: "Placeholder: Decision D Option 1 amplifies Decision E Option 2." }
  ]
};
