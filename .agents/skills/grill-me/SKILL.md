---
name: grill-me
description: Grill the user relentlessly about a plan, decision, design or idea through interactive multiple-choice questions, each with a recommended answer and room for the user's own reply. Use when the user wants to stress-test or sharpen their thinking, or says "grill me", "grill this", "interrogate my plan" or similar.
---

Interview the user relentlessly until you reach a shared understanding. Map the work as a **design tree**: every decision branches into the decisions that hang off it.

## Ask through the interactive question tool, never in chat

Every question goes through the host's structured question tool, so the user can pick an option or type their own answer:

- Claude Code: `AskUserQuestion`.
- Codex or another host: its equivalent structured-input tool (for example `request_user_input`).
- Only if the host has no such tool, fall back to a numbered list in chat that follows the same rules below, and say once that the interactive tool is unavailable.

Do not write the questions, options or your reasoning into chat before calling the tool. At most, send one short line of context (for example, "Round 2: storage decisions"). The tool's dialog may hide earlier chat, so everything the user needs to decide must be inside the question itself.

### Shaping each question

- **question**: one complete, self-contained question ending in "?". If it depends on a fact you found or an earlier answer, state that briefly in the question.
- **header**: a chip label of 12 characters or fewer, such as "Storage", "Auth", "Scope".
- **options**: 2 to 4 distinct choices.
  - Put your recommended choice **first** and end its label with ` (Recommended)`.
  - Give every option a `description` that states its consequence or trade-off in one or two sentences, not a restatement of the label.
  - Do not add an "Other", "Something else" or "Custom" option. The tool adds a free-text choice automatically; that is where the user disagrees or writes their own answer.
- Use `multiSelect: true` only when the choices genuinely are not mutually exclusive (for example, "Which of these platforms must v1 support?"). Then mark each recommended option with ` (Recommended)`.
- Use the option `preview` field when the user must compare concrete artifacts side by side: layout mockups, code shapes, schemas, config snippets. Previews work only on single-select questions. Skip previews for simple preference choices.
- If a question has no sensible recommendation, say so in the question text and still order options by your preference.

## Rounds and the frontier

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you have not heard yet.

- Ask the whole frontier each round. One tool call holds at most 4 questions; if the frontier is larger, ask the most foundational 4 first, then continue with the rest in further calls before recomputing the frontier.
- A question whose answer depends on another question still open in this round belongs to a _later_ round.
- When the user picks free text, read it carefully. If it is ambiguous or opens new branches, add follow-up questions to the next round rather than assuming.
- After each round, recompute the frontier: settled decisions push it outward and unblock questions that depended on them.

Keep a running decision log in your working memory (decision, chosen answer, whether it was the recommendation or the user's own). Do not dump it into chat between rounds.

## Facts are yours, decisions are the user's

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (files, docs, tools, the web), look it up yourself before asking, or use a sub-agent if the host and the user's instructions allow it. Do not ask the user for anything you could look up. A pending lookup is an unsettled prerequisite: only the questions downstream of it wait; ask the rest of the frontier now.

The _decisions_ belong to the user: put each one to them through the tool and wait for the answer.

## Finishing

The session is done when the frontier is empty: every branch of the design tree visited and nothing left silently assumed. Then:

1. Post a compact summary of the settled decisions in chat, grouped by branch, marking any answer where the user overrode your recommendation.
2. Ask through the question tool whether this is the shared understanding, with options such as "Yes, that's right (Recommended)" and "Revisit a decision"; the free-text choice covers corrections.
3. Do not act on the plan until the user confirms. If they want to revisit something, reopen that branch and continue the rounds.
