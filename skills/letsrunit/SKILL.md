---
name: letsrunit
description: Verify and investigate web UI behavior in a real browser with Letsrunit. Use for running existing browser scenarios, exploring live page state, or diagnosing a failing flow. Use letsrunit-writer to author or maintain persistent feature tests and custom steps.
---

# Letsrunit

Run the relevant browser flow and report what happened. Keep the observed result separate from the requirement or test expectation. Use [letsrunit-writer](../letsrunit-writer/SKILL.md) when the task is to create or change a scenario or step definition.

## Choose the run

- **Existing saved feature:** use the project's configured Cucumber command for the feature or scenario. This checks the persisted test with its support files and runner configuration. Use a live MCP session to inspect a failure when the suite output is insufficient.
- **Live verification or exploration:** use the Letsrunit MCP session and run only the interactions needed to answer the question. Verify the expected outcome with an assertion or direct page evidence.
- **No configured Cucumber runner:** use MCP for the requested live check and report that a saved suite run was unavailable. Set up a runner only when that is part of the task.

Do not create a new regression feature merely because a live check is requested. Do not treat a successful click as proof of the requested outcome.

## Run with Cucumber

Run commands from the project root, where `cucumber.js` and the project's support files are configured. Prefer an existing project script if it sets required environment variables.
```bash
npx cucumber-js features/login.feature
npx cucumber-js features/login.feature --name '^Sign in with a valid account$'
npx cucumber-js
```
These run one feature, one named scenario, and the configured suite respectively. Replace the path and scenario name with those in the project. Make sure the application and required test services are running. Read the command's exit status and failure details; a failed runner setup is different from a failed browser assertion.

Assume Cucumber is already configured for Letsrunit. Its configuration automatically selects `@letsrunit/cucumber/agent` in a detected AI agent environment, which emits structured NDJSON for AI agent ingestion, including step results and failure details. Run the project's command without adding a `--format` flag.

## Live browser tools

| Tool | Use |
| --- | --- |
| `letsrunit_session_start` | Launch a browser and return a `sessionId`; it does not navigate. |
| `letsrunit_run` | Run step lines, a scenario, or a feature. Read `status`, step results, `reason`, `journal`, and `scenarioId`. The result does not contain page HTML. |
| `letsrunit_snapshot` | Inspect scrubbed HTML, optionally within a selector, to see text, structure, names, and current state. |
| `letsrunit_screenshot` | Inspect visual state; crop with `selector` or spotlight with `mask` when useful. |
| `letsrunit_diff` | Compare the live page with the last passing stored snapshot for a `scenarioId`, when that baseline exists. |
| `letsrunit_debug` | Evaluate targeted JavaScript on the page for a diagnostic question. |
| `letsrunit_list_steps` | Inspect the available step expressions when a needed expression is unknown or a step is reported missing. |
| `letsrunit_list_sessions` | Find active sessions when session ownership is unclear. |
| `letsrunit_session_close` | Release the browser after the check or investigation. |

For a live check, start a session, navigate with an available Given step, run the relevant action and outcome check with `letsrunit_run`, then close the session. Run small step batches while exploring; run the complete flow from a known starting state when verifying a result. Keep a failed session open until its page state has been inspected.

Use the application's expected behavior to choose the assertion. An observed page change can explain a failure but does not, by itself, redefine what should happen.

## Locator and run details

Use user-facing locators in live steps where possible: `button "Save"`, `link "Orders"`, `field "Email"`, `text "Saved"`, or an accessible role such as `menuitem "Profile"`. Scope repeated controls with `within`; use a raw selector in backticks when no meaningful name or text identifies the target. A relative page path such as `"/orders"` needs a configured base URL.

`letsrunit_run` can receive one step, several steps, or a full scenario. A session start alone leaves the browser at its initial page. The run result tells you which steps passed or failed; request a snapshot separately when you need DOM evidence. If a locator is ambiguous or missing, inspect the relevant subtree before retrying with a narrower expression.

## Investigate only when needed

For a failed run or an observed result that conflicts with the expectation, read [failure diagnosis](references/failure-diagnosis.md). Use the first failed step, reason, journal, and current page state to distinguish an application defect from a test, locator, setup, or registration problem. Use `letsrunit_diff` only when a passing baseline exists.

When project custom steps are missing, support files changed, or MCP and Cucumber disagree, read [project runtime](references/project-runtime.md). A live MCP result and a Cucumber suite result are separate pieces of evidence; report which produced each conclusion.

Finish with the flow or saved scenario tested, the observed result, the evidence used, and any unresolved blocker. Do not call an unrun scenario passing.
