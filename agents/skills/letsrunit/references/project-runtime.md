# Project runtime

Read this when a project step does not appear, support files changed during a live session, or MCP and Cucumber behave differently.

The MCP server loads project support files from the Cucumber configuration's `require` and `import` entries in project runtime mode. Check the effective project directory, configuration file, glob, module format, and whether the support module actually executes. `letsrunit_list_steps` shows what the live session can run, rather than what the repository appears to define.

After editing support files, call `letsrunit_reload` when available in project runtime mode. Start a fresh session and list steps again. If reload is unavailable, restart the MCP runtime. If a step still does not appear, inspect the module import and registry registration rather than repeatedly rerunning the feature.

Cucumber registers definitions present in the Letsrunit BDD registry when `@letsrunit/cucumber` is imported. For custom definitions registered through `@letsrunit/bdd`, import their support modules before `@letsrunit/cucumber` in the world setup. The writer skill's [custom steps](../../letsrunit-writer/references/custom-steps.md) reference gives the implementation pattern.

Use the project's configured Cucumber command to verify a saved feature. A live MCP result and a Cucumber result can differ when their support loading or environment differs. Check both configurations and report which run produced each result.
