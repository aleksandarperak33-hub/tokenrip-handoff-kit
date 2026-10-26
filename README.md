# Tokenrip Handoff Kit

A small, free tool for carrying one task between AI assistants. It turns six pieces of context into a portable Markdown handoff: task, current state, decision and reason, evidence, next action, and the condition for being done.

**[Try the browser tool](https://bundles.tokenrip.com/345c9d58-c84b-47f8-9ad2-427d9e8ad16e/?from=github)** — no account needed. Copy or download the handoff and use it anywhere.

The optional Tokenrip workflow saves the record in a workspace, then asks a second assistant to read it before continuing. [Tokenrip](https://tokenrip.com/) stores shared work; it does not execute the assistants. Its [free plan](https://tokenrip.com/pricing) currently includes 1 GB. Your assistant may have separate requirements.

## Try one real task

1. Open the tool. Start with your current work, or load a clearly labeled fictional example.
2. Fill all six fields. The check only verifies that fields are filled, not that their content is correct.
3. Copy the handoff into your next assistant, or copy the Tokenrip setup + task prompt into your first assistant.
4. With Tokenrip, use the workspace you choose. Ask your connected assistant for the current connection instructions for your second assistant.
5. Have that second assistant read the saved record, state the decision and next action, then do the authorized next step and save the evidence.

Success means useful work continued from the saved record. A signup or two reads by the same assistant does not prove that.

## Install the agent skill

For tools supporting the Agent Skills format, inspect [SKILL.md](skills/tokenrip-handoff/SKILL.md), then install it in the project you choose:

```sh
npx skills add aleksandarperak33-hub/tokenrip-handoff-kit --skill tokenrip-handoff
```

Or copy `skills/tokenrip-handoff/` into your tool's skill directory. The skill does not include credentials or connect you automatically. Use it with a request such as:

> Use tokenrip-handoff to save this task in my Tokenrip workspace and prepare it for my next assistant. Preserve the decision and its reason, check the current source, and give me the next action.

The `skills` installer is a separate open-source tool with its own [anonymous install telemetry](https://skills.sh/docs). Installing this skill is not permission to upload unrelated files, publish work, or run outreach.

## Run locally and check

No dependencies, build step, model API, or paid services are needed for the browser tool.

```sh
python3 -m http.server 8769 --bind 127.0.0.1 --directory site
# Open http://127.0.0.1:8769
node --test tests/core.test.mjs
```

Use a local HTTP server rather than opening `index.html` as a file, because the JavaScript uses modules.

## Privacy and limits

- Task text stays in the page until you copy or download it. It is not stored in local storage and reload clears it.
- There are no analytics scripts, trackers, model calls, or data submission endpoints in the tool. Hosting providers can record ordinary access logs.
- The setup-guide link contains a campaign/source tag. It contains no task text and does not establish signup attribution.
- Copying the setup prompt and using it in an assistant shares the task with that assistant; saving it in Tokenrip shares it according to the workspace's access settings. Existing team workspaces may be visible to teammates.
- The examples are synthetic. The tool does not verify evidence freshness, factual accuracy, host compatibility, or user permissions. The receiving assistant must do those checks.
- The agent skill is guidance, not an enforcement boundary or a background worker.

## Feedback and help

[Open an issue](https://github.com/aleksandarperak33-hub/tokenrip-handoff-kit/issues) with a redacted reproduction, or [ask for setup help](mailto:alek@tokenrip.com?subject=Tokenrip%20Handoff%20Kit%20help). Never post credentials, private task files, or sign-in codes. Support may be provided by the founder's AI assistant.

Built and tested by an AI assistant for Aleksandar Perak, Tokenrip's cofounder. This repository contains original public-safe code and fictional examples, not customer work. MIT licensed.
