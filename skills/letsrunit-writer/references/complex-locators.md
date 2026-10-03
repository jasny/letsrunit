# Complex locators

Read this when a locator is missing or ambiguous, the target is in a repeated region or iframe, or a labelled or rich field does not behave like a normal input.

## Inspect before narrowing

Use the live step failure and a targeted `letsrunit_snapshot` to inspect the target's visible text, accessible role and name, label, and parent region. Use a screenshot when visibility, overlays, or layout matter. Match the user's concept first, then choose the narrowest stable expression.

First separate three failures that look similar in a test log:

- **No match:** check whether the element exists at that point in the flow, whether its accessible name differs from the visible text, and whether a dialog or loading state has not appeared yet.
- **Several matches:** preserve the intended role or label and narrow by a meaningful region or unique name. Do not choose an arbitrary `first()` or index merely to make the step pass.
- **Match but not actionable:** check visibility, disabled state, overlays, scrolling, and whether the element belongs to a frame or shadow component.

For repeated controls, scope to the row, card, dialog, or section containing the relevant identifying text. For example, a Save button in a dialog should be scoped to that dialog rather than selected by position. Use `within` for a parent scope and `with` or `without` to filter a parent by descendants. For an iframe, scope with `within iframe "..."` using its title, name, aria-label, or ID; inspect if several frames match.

Prefer the region's visible heading or accessible name as the discriminator. An example from the locator syntax is ``button "Submit" within `#checkout-form```; use a semantic parent where the project exposes one. If multiple frames have the same name, inspect the frame attributes and make the scope more specific. A selector for a repeated row should identify its business data, not its position in the table.

If a field has a visible label but Letsrunit cannot set it, check whether the label actually names the interactive element and whether the framework's field resolver handles that component. A rich editor may expose a composite control rather than one input. Keep selectors for internal editor nodes in a dedicated reusable helper or fix the framework resolution where appropriate; do not leak those nodes into every feature step.

For a labelled field, try `field "Label"` before a CSS selector. For a composite picker, inspect which control receives focus and what interaction a user performs. If the public label is correct but the built-in field step fails, retain that label in the feature and diagnose the resolver. A domain-specific custom step is justified only when the interaction genuinely has domain semantics that built-in set, click, and key steps cannot express.

Use a raw selector in backticks only when semantic targeting cannot identify the element and the chosen attribute is stable. If the only available selector depends on generated classes or element position, report that fragility and consider improving application accessibility or a reusable helper.

After changing a locator, run the scenario from its initial Given. Verify that the new locator targets the intended element and that the final Then still proves the behavior. A passing click against the wrong repeated control is a false positive.
