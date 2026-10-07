# Maintaining existing tests

Read this when an existing feature fails, a UI change requires test maintenance, or new coverage overlaps an existing scenario.

## Decide what the failure means

Compare the failed step with the behavior promised by the task and the current application. Inspect the Cucumber failure details and the live page. If available, compare with the last passing baseline using `letsrunit_diff`. Classify the cause before editing:

- **Application behavior changed unexpectedly:** keep the valid expectation and fix or report the application defect.
- **Requirement changed:** update the expectation and scenario name so they describe the new contract.
- **Locator lost its target:** keep the behavior assertion and replace the locator with a stable semantic name or scope.
- **Test setup or data changed:** repair the setup while keeping the user-visible outcome explicit.
- **Step registration failed:** check the support glob, load order, and runtime step list.

If evidence is insufficient, state the uncertainty and run the smallest check that distinguishes these causes. Do not make a test green by deleting the assertion that protects the behavior.

For a stale locator, change only the expression that identifies the element; preserve the Given/When/Then meaning. For a changed requirement, update the scenario title and all affected assertions so the file tells one coherent story. When application behavior is wrong, leave the failing expectation as the regression target and report or fix the product issue according to the task scope.

## Place new coverage

Extend an existing scenario when its action and outcome are the same and one additional assertion improves the signal. Add a separate scenario when setup, action, or expected behavior differs materially. Use `Background` only when the shared steps apply to every scenario after the change. Avoid repeating a long login journey if the project already has stable setup for authenticated state.

After maintenance, run the changed feature and at least the nearby scenarios that share its setup or custom definitions. Explain the behavior changed or preserved, not merely the lines edited.

## Avoid duplicate coverage

Search for scenarios with the same starting state, principal action, and expected result. If they only differ in wording, keep one. If a new case varies data but has the same outcome, consider a scenario outline. If it exercises a different authorization rule or validation path, give it a separate scenario. Do not merge cases so aggressively that a failure no longer identifies which behavior broke.

When a shared support step changes, inspect every feature that calls it. The step's wording is a contract with those features. Preserve its existing meaning or introduce a new, more precise step and migrate only the scenarios that need it.
