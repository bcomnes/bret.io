---
layout: article
title: "async-neocities has a bin"
serif: false
publishDate: "2024-01-15T23:55:33.582Z"
handlebars: false
---

[`async-neocities`][an] [v3.0.0](https://github.com/bcomnes/async-neocities/releases/tag/v3.0.0) is now available and introduces a CLI.

```console
Usage: async-neocities [options]

    Example: async-neocities --src public

    --help, -h            print help text
    --src, -s             The directory to deploy to neocities (default: "public")
    --cleanup, -c         Destructively clean up orphaned files on neocities
    --protect, -p         String to minimatch files which will never be cleaned up
    --status              Print auth status of current working directory
    --print-key           Print api-key status of current working directory
    --clear-key           Remove the currently associated API key
    --force-auth          Force re-authorization of current working directory

async-neocities (v3.0.0)
```

When you run it, you will see something similar to this:

```console
> async-neocities --src public

Found siteName in config: bret
API Key found for bret
Starting inspecting stage...
Finished inspecting stage.
Starting diffing stage...
Finished diffing stage.
Skipping applying stage.
Deployed to Neocities in 743ms:
    Uploaded 0 files
    Orphaned 0 files
    Skipped 244 files
    0 protected files
```

[`async-neocities`][an] was previously available as a GitHub Action called [deploy-to-neocities](https://github.com/marketplace/actions/deploy-to-neocities). This Action API remains available, however the CLI offers a local-first workflow that was not previously offered.

## Local First Deploys

Now that `async-neocities` is available as a CLI, you can easily configure it as an `npm` script and run it locally when you want to push changes to [neocities](https://neocities.org) without relying on GitHub Actions.
It also works great in Actions with side benefit of deploys working exactly the same way in both local and remote environments.

Here is a quick example of that:

- Install `async-neocities@^3.0.0` to your project's `package.json`.
- Set up a `package.json` deploy script:
    ```json
     "scripts": {
        "build": "npm run clean && run-p build:*",
        "build:tb": "top-bun",
        "clean": "rm -rf public && mkdir -p public",
        "deploy": "run-s build deploy:*",
        "deploy:async-neocities": "async-neocities --src public --cleanup"
      },
    ```
- Run a deploy once locally to set up the `deploy-to-neocities.json` config file. Example config contents:
  ```json
  {"siteName":"bret"}
  ```
- Run deploys locally with `npm run deploy`.
- Configure your CI to run `npm run deploy` and configure the token secret.
    ```yaml
    name: Deploy to neociteis

    on:
      push:
        branches:
          - master

    env:
      node-version: 21
      FORCE_COLOR: 2

    concurrency: # prevent concurrent deploys doing starnge things
      group: deploy-to-neocities
      cancel-in-progress: true

    jobs:
      deploy:
        runs-on: ubuntu-latest

        steps:
        - uses: actions/checkout@v4
        - name: Create LFS file list
          run: git lfs ls-files -l | cut -d' ' -f1 | sort > .lfs-assets-id
        - name: Restore LFS cache
          uses: actions/cache@v3
          id: lfs-cache
          with:
            path: .git/lfs
            key: ${{ runner.os }}-lfs-${{ hashFiles('.lfs-assets-id') }}-v1
        - name: Git LFS Pull
          run: git lfs pull

        - name: Use Node.js
          uses: actions/setup-node@v4
          with:
            node-version: ${{env.node-version}}
        - run: npm i
        - run: npm run deploy
          env:
            NEOCITIES_API_TOKEN: ${{ secrets.NEOCITIES_API_TOKEN }}
    ```

The `async-neocities` CLI re-uses the same ENV name as `deploy-to-neocities` action so migrating to the CLI requires no additional changes to the Actions environment secrets.

## CLIs vs Actions

This prompts some questions regarding when are CLIs and when are actions most appropriate. Lets compare the two:


### CLIs

- Pro: Local deploys
- Pro: Easily re-usable in CI as well
- Con: Requires Node.js, but this is not a problem when already using Node.js

## Actions

- Pro: Works great with Non-node ecosystems without requiring a `package.json` or `node_modules`
- Con: Only runs in CI environments

## Conclusion

In addition to the CLI, `async-neocities` migrates to full Node.js `esm` and internally enables `ts-in-js` though the types were far to dynamic to export full type support with the time I had available.

With respect to an implementation plan going forward regarding CLIs vs actions, I've summarized my thoughts below:

Implement core functionality as a re-usable library.
Exposing a CLI makes that library an interactive tool that provides a local first workflow and is equally useful in CI.
Exposing the library in an action further opens up the library to a wider language ecosystem which would otherwise ignore the library due to foreign ecosystem ergonomic overhead.
The action is simpler to implement than a CLI but the CLI offers a superior experience within the implemented language ecosystem.




[an]: https://github.com/bcomnes/async-neocities
