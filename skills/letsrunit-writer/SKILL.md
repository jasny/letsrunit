---
name: letsrunit-writer
description: Write and maintain Letsrunit Gherkin feature tests. Use for creating scenarios, improving existing browser tests, or adding project-specific step definitions. Prefer the available built-in and project steps; add reusable custom steps only for a real gap.
---

# Letsrunit writer

Produce `.feature` files that describe user behavior and run with the project's Letsrunit setup. The feature is the lasting test; a successful exploratory browser run alone is not the deliverable.

## Understand the test contract

Read the requested behavior, the relevant UI or application code, neighboring features, support files, and `cucumber.js` (or its equivalent). Identify:

- The user-visible behavior and the outcome that proves it.
- The starting state and test data required to make the result reproducible.
- The distinct success and failure cases that matter to this change.
- Existing scenarios that already cover part of the behavior.

Write a new scenario only where it adds a distinct regression signal. Extend an existing scenario when it already owns the same behavior and the new assertion belongs to that flow. Keep unrelated behaviors in separate scenarios so a failure points to a useful cause. For a change to an existing feature, read [maintaining tests](references/maintaining-tests.md) when deciding whether a failing expectation or locator should change.

Decide coverage from the behavior, not the number of UI controls. A useful scenario usually has one principal action and one or more checks of its consequence. A separate scenario is warranted for a different permission, validation result, or state transition. Avoid assertions that only repeat the setup. For a bug fix, write a check that fails for the reported bug and passes for the intended result; retain it as a regression test.

## Reuse the available step vocabulary

Start a Letsrunit session and call `letsrunit_list_steps` with its `sessionId` when the MCP server is available. This is the source of truth for built-in and project steps loaded in that runtime. Without a live session, inspect the project's support files and installed step registry or reference. Check the exact expression and parameter type before using a step.

Map each proposed Given, When, and Then to an existing definition. Built-in steps cover page navigation, visible and hidden elements, containment, URL assertions, clicks and hover, form values, keys, clipboard, and mailbox interactions. Project support files may already express domain actions. Combine those steps into a readable user flow before considering new code.

Use the following order when matching a sentence:

1. Reuse the exact project step when it already expresses the domain concept.
2. Compose built-in steps for navigation, actions, and observations.
3. Improve a locator or scope if the step exists but targets the wrong element.
4. Add a custom definition only for an actual behavior gap.

Record the chosen expression before coding against it. A prose sentence that looks natural may still be undefined at runtime. Check `Given`, `When`, and `Then` types as well as expression text; `And` inherits the preceding type.

For example, the built-in vocabulary can express an ordinary sign-in flow:

```gherkin
Scenario: Sign in with a valid account
  Given I'm on page "/login"
  When I set field "Email" to "user@example.com"
  And I set field "Password" to "secret"
  And I click button "Sign in"
  Then I should be on page "/dashboard"
  And the page contains text "Welcome"
```

Treat this as a shape example. Use only expressions confirmed in the current project's step list. A relative path needs a configured base URL. A missing or ambiguous locator calls for inspection, not an immediate custom step. Read [complex locators](references/complex-locators.md) when accessible names, repeated controls, frames, or rich fields make an ordinary locator unreliable.

## Shape the feature

Name the feature and each scenario by the behavior being protected. Keep the sequence causal: Given establishes state, When performs the user action, Then checks the outcome. `And` and `But` continue the previous step type. Put shared setup in `Background` only when every scenario in the file needs it. Use a scenario outline when rows vary the data for the same behavior; use separate scenarios when the expected behavior differs.

Keep each step at the level of the user or domain. Prefer `When I click button "Approve"` over describing its CSS class. Include enough setup to make the scenario independent of execution order. If the project provides direct state setup, use it for data preconditions and keep the actual user behavior in the visible When steps. Do not hide the very action being tested in a fixture.

Assert something that could plausibly fail after a regression: a destination, visible state, message, persisted result, or absence of a forbidden result. A click that completed is an action, not an outcome. Keep test data stable and use the project's fixtures or test accounts. Keep secrets out of committed features.

Choose assertions close to the requirement. A success toast may show that a request was accepted while the requested state is still wrong; check the persisted or displayed state when that is the contract. For negative cases, check both the rejection and the absence of the forbidden change when observable. Avoid brittle assertions on unrelated copy, timestamps, generated IDs, or incidental ordering.

Choose semantic locators that express what users encounter: `button "Save"`, `link "Orders"`, `field "Email"`, or visible text. Scope repeated controls to a meaningful region with `within`. Use raw selectors only when the page lacks a usable accessible name or text and the selector is stable. Do not encode internal widget nodes in a user-facing feature to mask a Letsrunit field-resolution bug.

Keep navigation predictable. A scenario begins at a known page through a Given, directly or via Background. Confirm that `baseURL` is configured before using paths like `"/orders"`. Use explicit setup for authentication and records; do not depend on a previous scenario's browser state. Prefer a stable seeded record over creating unrelated data through a long UI journey.

## Add custom behavior only for a real gap

Before adding a definition, state which existing steps and compositions were considered and why they cannot express the behavior clearly or reliably. A reusable project-specific setup, domain action, or assertion may justify a custom step. A one-off click, field entry, or text assertion usually does not. Parameterize the varying business data rather than naming one record in the expression. Read [custom steps](references/custom-steps.md) only when this gap is established.

## Run and finish

Use a live MCP session to explore and run one scenario at a time when available. Start the flow with a navigation Given, directly or through Background. Inspect the `letsrunit_run` status, failed step, reason, and journal; use a snapshot or screenshot only for the state needed to diagnose a failure. Keep the session open while investigating and close it afterward.

Run the saved feature with the project's Cucumber command. This verifies support-file loading and the complete persisted scenario. Diagnose a failure against the requested behavior before editing an expectation. Report the feature path, scenarios and results, any custom definition added and why it was needed, and any verification that could not run.

Before finishing, confirm that every scenario has a clear precondition, meaningful action, and result; every step expression is registered; every locator identifies one intended target; and the saved feature passes in the project's runner. If execution is blocked, leave the test in its intended form and identify the missing application, data, or runtime dependency.

Use [letsrunit](../letsrunit/SKILL.md) when the task is primarily live browser investigation rather than authoring a persistent test.
