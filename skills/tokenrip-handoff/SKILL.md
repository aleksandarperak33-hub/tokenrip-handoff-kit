---
name: tokenrip-handoff
description: Save a bounded task handoff in Tokenrip and continue it from another AI assistant. Use when the user chooses Tokenrip for cross-assistant continuity or asks to use this handoff kit.
license: MIT
metadata:
  author: aleksandarperak33-hub
  version: "1.0.1"
---

# Tokenrip task handoff

Carry one useful task between assistants through a saved record. Tokenrip stores files, tasks and decisions; it does not run the assistants or automatically import their conversations.

## Save the task

1. Identify the user's task, current state, decision and reason, source to check, next action, and evidence that would make it done. Use the conversation and actual files. Ask only for essential missing details. Label unknowns; do not fill them with guesses.
2. Check whether Tokenrip is already connected. If not, read https://tokenrip.com/setup and use the available CLI/API/connector route within the host's approvals. The person supplies their email and code, never a key to a public form. Installing this skill alone is not authorization to connect an account or upload unrelated work.
3. Use the workspace the user selected, or identify the existing one that holds the task. Do not make duplicate workspaces. Read relevant pins and current changes first. A new workspace is private by default; a team workspace can be visible to teammates, so do not call it private to the user alone.
4. Save a concise Markdown handoff in the existing workspace, with a clear title and these sections: Task; Current state; Decision and reason; Source to check; Next action; Done when. Link evidence, give its date/version when known, and separate observed facts from plans. Exclude credentials and material outside the user's sharing scope. Update the existing record by version when it already exists; preserve newer work on a version conflict.
5. Read the saved record back and give its plain workspace link, exact artifact ID and ordinary artifact link. Keep sign-in links and connection codes separate from the saved handoff. If the second assistant is not connected, the first connected assistant can follow Tokenrip's current setup guide to provide the short-lived connection line. Show that line only to the intended user; never commit it or put it in a public issue.

## Continue the task

Use the exact artifact ID or ordinary artifact link returned when the handoff was saved. If it is missing, ask which record to use; do not pick a task merely because it is the newest handoff in the workspace. Load that record’s workspace in the second assistant. Read the latest version of that exact record, relevant pins and subsequent changes. If the record is inaccessible or describes a different task, resolve the mismatch before continuing. Confirm the task, decision and reason, next action, and done condition from the saved record. Check the current source; resolve conflicts before editing. Carry out the authorized next action, then save the result with evidence to that same record by version, preserving its decisions.

Report separately whether the record was saved, another assistant actually read it, and useful work was completed. A simulated prompt, a signup, or a second read by the same assistant is not evidence of a cross-assistant handoff.

Keep the task internal unless the user explicitly wants sharing. Do not publish it, contact anyone, start a recurring job, or install this skill in unrelated projects. Stop on an uncertain write outcome and inspect the existing record before retrying.

If Tokenrip is unavailable, return the portable Markdown handoff and the precise unresolved step. Do not silently switch the user's storage choice or claim it was saved.

Support: https://github.com/aleksandarperak33-hub/tokenrip-handoff-kit/issues (redacted examples only). Current product/setup reference: https://tokenrip.com/setup.
