# One action key, two independent agents

A shared handoff tells the next agent what to do. It does not stop two agents doing it. Tokenrip's [table coordination docs](https://docs.tokenrip.com/concepts/tables#coordinating-agents) describe the additional procedure: give the intended effect one stable key, then append that key to a table that enforces uniqueness.

This synthetic exercise complements the [Handoff Kit](https://github.com/aleksandarperak33-hub/tokenrip-handoff-kit). It contains no customer data and sends nothing. The commands below are a recipe, not a reported execution or benchmark.

## Set up once

Use an authorized workspace for this exercise. Replace angle-bracket placeholders with actual IDs returned by Tokenrip. Both agents must use the same table and key.

```sh
rip --json artifact publish --type table \
  --title "Synthetic handoff reservations" \
  --workspace-id <workspaceId> --audience internal \
  --schema '[{"name":"key","type":"text","unique":true},{"name":"state","type":"text"},{"name":"holder","type":"text"},{"name":"result","type":"text"}]' \
  --why "Practice coordinating one synthetic handoff action."
```

Keep the returned table ID. Its `key` column must actually have `unique: true`; an ordinary text column does not coordinate agents.

## Both agents attempt the same reservation

Agent A uses this command; Agent B uses the same key with `holder` set to `agent-b`:

```sh
rip --json table append <tableId> \
  --data '{"key":"draft:demo-brief:v1","state":"reserved","holder":"agent-a"}' \
  --why "Practice coordinating one synthetic handoff action."
```

Use plain append, **without `--upsert`**. Expected behavior: one append succeeds; another append of that key is refused with `409 DUPLICATE_UNIQUE_VALUE` in CLI/REST, or `STATE_CONFLICT` over MCP. Only an agent with a confirmed successful reservation may continue. Other refusals or an uncertain response do not authorize the action.

The winner's synthetic action is to draft one sentence locally: “The team will compare two handoff approaches.” It then records that result using its returned row ID and revision:

```sh
rip --json table update <rowId> --expected-revision <revision> \
  --data '{"state":"completed","result":"The team will compare two handoff approaches."}' \
  --why "Practice coordinating one synthetic handoff action."
```

If the update conflicts, inspect the current row before changing it. Do not repeat the action because its completion record failed.

## What this does and does not establish

A read-then-write check can race. A plain append with an enforced unique key chooses one claimant at the write. Normalize the key identically across agents; different spellings are different actions.

Keep the reservation if an action's outcome is uncertain. A crash after reservation can leave work unfinished. This procedure favors avoiding duplicate attempts; it does not guarantee completion, roll back an external effect, stop an agent that ignores the procedure, or provide a cross-service transaction. Do not expire or delete claims automatically for irreversible actions.

To try the exercise, [connect your agent](https://tokenrip.com/setup), choose a dedicated workspace, and ask it to explain the reservation before running these synthetic commands. Agents remain in their existing hosts.

Sources: [Tables and coordination](https://docs.tokenrip.com/concepts/tables), [MCP write requirements](https://docs.tokenrip.com/getting-started/mcp-server#where-to-start), and current official `rip artifact publish`, `table append` and `table update` command help. AI assistance was used to prepare this example.
