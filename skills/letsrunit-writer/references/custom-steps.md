# Custom step definitions

## Decide and design

Before coding, identify the intended Gherkin sentence, existing definitions considered, and why their composition is insufficient. Search project support code for a matching domain concept; extend a reusable step when it already owns the behavior.

Write a custom step for a domain action, setup, or assertion that several scenarios can name naturally. Parameterize changing values with Cucumber placeholders such as `{string}` instead of embedding one account, label, or record ID. Keep scope narrow and observable. An assertion step must fail when the behavior is absent. Avoid broad expressions that overlap built-in or project definitions, hidden state repair, and swallowed errors.

Use one step for one domain operation. A setup step can arrange an order or account through a project test API; it should not also click through the UI under test. An action step should do the named action; assertions belong in Then steps so the feature exposes what is expected. A custom assertion can check a domain invariant that built-in visibility and URL steps cannot express. Keep shared HTTP, database, or UI mechanics in helpers rather than copying them across definitions.

Choose wording with a clear namespace in the project's domain. `Given an order {string} awaiting approval` is narrower than `Given a record {string}`. Avoid expressions that can match the same sentence as another step. Use parameters for meaningful data variation and validate their values when an invalid value would otherwise produce a misleading browser failure.

Keep implementation in the project's support directory and follow its language and module conventions. A typical JavaScript setup loads `features/support/**/*.js` through `cucumber.js`; verify the actual `require` or `import` globs. Register steps with `@letsrunit/bdd` so the live MCP runtime can list and execute them. The step world provides `this.page`.

```js
import { Given } from '@letsrunit/bdd';

Given('an order {string} awaiting approval', async function (orderId) {
  const response = await this.page.request.post('/test-support/orders', {
    data: { id: orderId, status: 'awaiting-approval' },
  });
  if (!response.ok()) throw new Error(`Could not create order ${orderId}`);
});
```

This shows the registration shape for reusable setup through an application-specific test API; adapt the endpoint and request to the project. Use it only for a real gap in the available step vocabulary. For browser interactions prefer Playwright role, label, and text locators. For a complex field, inspect actual behavior and consider `@letsrunit/playwright` helpers such as `fuzzyLocator` and `setFieldValue`. Wait for relevant state instead of using arbitrary sleeps.

The handler runs with a world containing `this.page`. Keep it as a function declaration so Cucumber supplies that world as `this`. Return or await the operation so failures propagate to the scenario. For setup through an API, check the response and create only the state named by the step. For a UI action, wait for a condition tied to the action's result rather than a fixed delay. Use project secrets through environment or fixtures, never in the expression or source.

`@letsrunit/cucumber` registers the definitions present in the BDD registry when it is imported. For saved Cucumber runs, import the custom support module before `@letsrunit/cucumber` in the project's world setup. The Cucumber support glob may load the custom file again; module caching prevents duplicate execution. For example:

```js
import './custom-steps.js';
import '@letsrunit/cucumber';
```

Keep this order for every custom step module. Confirm that the project's module format and support glob load the same files in both runtimes.

## Verify

After editing a support file, call `letsrunit_reload` in project runtime mode when available, start a fresh session, and confirm the expression appears in `letsrunit_list_steps`. Otherwise restart the runtime. Run the new step in a scenario, then run the saved feature through project Cucumber setup. A missing expression points to support-file loading or registration; an ambiguous expression points to wording overlap. Verify both the action and the scenario's final assertion.

If the live MCP run recognizes the step but Cucumber reports it undefined, inspect whether the custom module was imported before `@letsrunit/cucumber`. If Cucumber recognizes it but MCP does not, inspect the MCP project directory, support glob, and reload result. A green custom step alone is insufficient: the feature must also assert the behavior it was created to enable.
