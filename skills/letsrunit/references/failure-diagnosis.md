# Failure diagnosis

Read this after a failed run or when observed behavior conflicts with the expected result.

1. Identify the first failed step, its reason, and any journal entry. Later skipped steps do not establish a second failure.
2. Inspect a small relevant HTML subtree with `letsrunit_snapshot`. Use `letsrunit_screenshot` if layout, overlay, or visibility could explain the result. Use `letsrunit_debug` only for a focused question the snapshot cannot answer.
3. If an element is missing or ambiguous, compare the locator with the accessible name, label, visible text, and parent scope. Retry with a more precise semantic locator when the target is present.
4. If an assertion differs from the page, compare the page with the product requirement and test contract. Determine whether the application is wrong, the expectation changed, or setup is incomplete.
5. If a regression is suspected, request `letsrunit_diff` with the scenario ID when a stored passing baseline exists.
6. If the step itself is unknown, refresh `letsrunit_list_steps` and inspect support loading using [project runtime](project-runtime.md).

State the best-supported cause: application behavior, test expectation, locator, setup, or registration. If evidence does not distinguish them, state the uncertainty and the next decisive check. Keep the session alive through diagnosis, then close it.

## Evidence by symptom

For a timeout before navigation, check the destination and application availability. For a click timeout, inspect the target's accessible name, visibility, enabled state, and overlays. For a form-value failure, inspect the actual interactive field and whether the control is composite. For a URL mismatch, record both the expected route and observed URL after the action. For a text assertion, distinguish absent content from content hidden outside the chosen scope.

The first failing step is the primary signal. A screenshot can explain a visible overlay; a snapshot can show labels and structure; a diff can show change from a stored passing baseline. Use the smallest evidence source that resolves the uncertainty. Do not classify the application as broken when the only observation is an undefined step or a locator that matched nothing.
