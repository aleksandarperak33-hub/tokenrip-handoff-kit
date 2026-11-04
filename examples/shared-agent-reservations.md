# How to prevent duplicate action claims across AI agents

Use one stable action key, an enforced unique column, and a confirmed successful plain append before acting. A shared handoff alone does not prevent duplicate actions. Tokenrip's [table coordination docs](https://docs.tokenrip.com/concepts/tables#coordinating-agents) explain this claim procedure.

This synthetic exercise complements the [Handoff Kit](https://github.com/aleksandarperak33-hub/tokenrip-handoff-kit). It contains no customer data and sends nothing. The CLI recipe was checked against a dedicated synthetic table on November 3, 2026. It is not a concurrency benchmark.

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

## Observed CLI check

| Step | Observed result |
| --- | --- |
| First plain append | Succeeded; one row, revision 1, holder `agent-a` |
| Same key, holder `agent-b` | Rejected: `DUPLICATE_UNIQUE_VALUE`; still one row |
| Completion with revision 1 | Succeeded; revision 2, state `completed`, expected sentence saved |
| Another update using revision 1 | Rejected: `CONFLICT`, current revision 2; completed result unchanged |

These were sequential requests from one existing authenticated agent with two synthetic holder labels. The check did not exercise concurrent claimants, separate hosts/identities, REST HTTP statuses or MCP error translation. The dedicated test table was moved to restorable trash afterward. No signup, customer usage or external effect occurred.

## What this does and does not establish

A read-then-write check can race. A plain append with an enforced unique key chooses one claimant at the write. Normalize the key identically across agents; different spellings are different actions.

Keep the reservation if an action's outcome is uncertain. If a process crashes after a send but before recording completion, inspect destination receipts and reconcile the outcome before retrying. Use destination idempotency only where supported, within its documented retention and parameter rules. A crash after reservation can also leave work unfinished. This procedure favors avoiding duplicate attempts; it does not guarantee completion, roll back an external effect, stop an agent that ignores the procedure, or provide a cross-service transaction. Do not expire or delete claims automatically for irreversible actions.

To try the exercise, [connect your agent](https://tokenrip.com/setup), choose a dedicated workspace, and ask it to explain the reservation before running these synthetic commands. Agents remain in their existing hosts.

Sources: [Tables and coordination](https://docs.tokenrip.com/concepts/tables), [MCP write requirements](https://docs.tokenrip.com/getting-started/mcp-server#where-to-start), and current official `rip artifact publish`, `table append` and `table update` command help. AI assistance was used to prepare this example.


## Follow-up: two-process claim check, November 4, 2026 UTC

An AI assistant ran three pairs of local Tokenrip CLI 2.6.14 processes against a new strict-schema table containing only fictional records, internal to the Tokenrip team. This is a separate follow-up to the sequential November 3 check above. Both processes used the same existing authenticated agent on one host, with two synthetic holder labels.

For each pair, two workers and their coordinator met at a start barrier. Each worker then invoked one plain append, without `--upsert`, using the same unique key. Each new pair used a fresh key. After both invocations completed, a read of that key compared the persisted row with the successful receipt. A final table read checked that only the three expected rows existed.

| Pair | Accepted appends | Duplicate refusals | Rows read back | CLI invocation interval overlap |
| --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | 527.805 ms |
| 2 | 1 | 1 | 1 | 803.379 ms |
| 3 | 1 | 1 | 1 | 555.695 ms |

Each accepted append exited successfully and returned one created row. Each other invocation exited with `DUPLICATE_UNIQUE_VALUE`. Each readback contained exactly one reserved row matching the successful receipt's row ID, holder and revision. The final read contained three rows. No backoff messages were observed, and the harness performed no retries. The check used 13 normal CLI invocations, not a measured count of network requests. No external action or completion update was attempted; the synthetic table was retained internally for receipt review.

The measured intervals run from immediately after `Popen` returned to immediately after `communicate` completed. Their overlap establishes overlapping **CLI invocation intervals**, not instrumented process lifetimes, simultaneous network requests or overlapping server transactions. The bounds were 15 seconds at the barrier, 60 seconds per CLI invocation and 240 seconds overall. These three pairs are a bounded functional check, not a load, latency or concurrency benchmark or proof for every possible race. They did not test separate hosts or authenticated identities, crashes, timeout recovery, REST HTTP statuses or MCP error translation. A reservation still does not guarantee completion or exactly-once external effects.

[Sanitized results and method](shared-agent-reservations-2026-11-04-results.json) omit internal workspace, table and row identifiers, process IDs, credentials and access links. No public guide command was changed by this follow-up.
