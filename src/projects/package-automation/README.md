# Fully Automated Luxury Space Age Package Maintenance

<small>tldr;</small> The full package maintenance life cycle should be automated and can be broken down into the following levels of automation sophistication:

- <a href="#level-0">Level 0</a>: `git` + Github
- <a href="#level-1">Level 1</a>: Automated tests, running in CI
- <a href="#level-2">Level 2</a>: Use a dependency bot to keep on top of maintenance chores
- <a href="#level-3">Level 3</a>: Automated changelog and release consistency scripts
- <a href="#level-4">Level 4</a>: Human triggered, bot-run version cutting and publishing
- <a href="#level-5">Level 5</a>: Capture common automations into a boiler plate generator

These solutions focus on Node.js + npm packages, automated on Github Actions, but the underlying principals are general to any language or automation platform.

## Background

Maintaining lots of software packages is burdensome.
Scaling open source package maintenance beyond a single contributor who understands the release life cycle is challenging.
Long `CONTRIBUTING.md` files are often the goto solution, but are easily overlooked.

<figure>
  <img src="./shrek-swamp.jpg" alt="Shrek swamp">
  <figcaption>A pre-automation package is a lot like the shrek swamp.  Fixing things requires a slog through the mud, and its constantly at risk for overgrowth.  (<a href="https://shrek.fandom.com/wiki/Swamp">Img Source</a>)</figcaption>
</figure>

In the end, automating the package life cycle so that it can maintain itself, is the only way to realistically scale a large set of packages in a maintainable way.

<figure>
  <img src="./forerunner_structure.jpg" alt="Forerunne Archetecture">
  <figcaption>A fully automated luxury space age package maintains itself, re-activating after years of abandonment to operate the same as it did the day of its creation. This is about as much value I can get out of this silly analogy. (<a href="https://lortarkam.wordpress.com/2017/04/12/how-should-the-forerunners-really-look/">Img Source</a>)</figcaption>
</figure>

For a long time I didn't seek out automation solutions for package maintenance beyond a few simple solutions like testing and CI.
Instead I had a lengthly ritual that looked approximately like this:

```console
# 🔮
git checkout -b my-cool-branch
# do some work
# update tests
# update docs
npm run test
git commit -am 'Describe the changes'
git push -u
hub browse
# do the PR process
# merge the PR
git checkout master
git pull
git branch --delete my-cool-branch
# hand edit changelog
git add CHANGELOG.md
git commit -m 'CHANGELOG'
npm version {major,minor,patch}
git push && git push --follow-tags
npx gh-release
npm publish
# 😅
```

It was ritual, a muscle memory.

Over the years, I've managed to automate away large amount of raw labor to various bots, tools and platforms that tend to build on one another and are often usable in isolation or adopted one at a time.
I've broken various tools and opportunities for automation into levels, with each level building on the complexity contained in the level below.

## <span id="level-0">Level 0</span>: `git` and Github

You are already automating your packages to a large extent by your use of [`git`][git].
`git` automates the process of working on code across multiple computers and collaborating on it with other people, and [Github](https://github.com) is the central platform to coordinate and distribute that code.

<figure>
  <img src="./git.gif" alt="The old git header">
  <figcaption>The old git mascot knew what was up.</figcaption>
</figure>


If you are new to programming or learning `git`, its helpful to understand you are learning a tool used to automate the process by which you can cooperatively work on code with other people and bots.

<figure class="borderless">
  <picture>
    <source srcset="./fork-dark.png" media="(prefers-color-scheme: dark)">
    <img src="./fork-light.png" alt="Screenshot of Fork.app">
  </picture>
  <figcaption>Use the <a href="https://git-fork.com">tree view</a> Luke!</figcaption>
</figure>

This isn't an article about `git` though, so I won't dive more into that.

## <span id="level-1">Level 1</span>: Automated Tests + CI

There is no debate.
Software isn't "done" until it has tests.
The orthodox position is that you shouldn't be allowed to write code until the tests are written ([TDD](https://en.wikipedia.org/wiki/Test-driven_development)).
No matter the methodology, you are automating a verification process of the package that you would normally have to perform by hand.

### Test runners

These are my preferred test runners for Node.js:

- [tape](https://ghub.io/tape)
  - No "test harness".
  - Simple, reliable.  Just a library, with a CLI that supports [globbing](https://ghub.io/glob).
  - It's done. No surprises.
- [tap](https://ghub.io/tap)
  - Similar to tape.
  - Test runner defaults to improved default test globbing (e.g. `foo.test.js`).
  - async/await support
  - Built in [NYC][nyc] support.
  - Bad native ESM support.
  - Still room for evolution.

<figure class="borderless">
  <img src="./tap.png" alt="Screenshot of tap code">
  <figcaption>tap offers some nice test runner features and better async support.</figcaption>
</figure>

### Additional Tests

Unit tests that you run with a test runner are not the only type of test though.
There are lots of other easy tests you can throw at your package testing step that provide a ton of value:

- [Linting](https://en.wikipedia.org/wiki/Lint_(software)) ([`standard`](https://standardjs.com), [`eslint`](https://eslint.org) etc)
  - Enforce code style and catch errors!  Basically spell check on code.  This should really be the very first test on every package, since it helps you write correct code.
- [`dependency-check`](http://ghub.io/dependency-check)
  - Verify dependencies listed in `package.json` matches usage in the actual code.
  - This test fails if it finds packages in `package.json` that are no longer used in code or if it finds pacakges in use in the code that are not listed in `package.json` which would cause a runtime error.
- Running a build
  - Simply make `npm run build` part of your test life cycle.
  - If your package has some sort of build step, simply running a build and checking if it runs without error is a very helpful test. It's also simple to set up.
- Code Coverage metrics
  - [nyc][nyc] is the defacto test coverage tool (built into tap).
  - [c8](https://github.com/bcoe/c8) is a native V8 coverage tool, but is lest robust than nyc.
  - These don't need to be pass/fail in terms of coverage going up or down (but they can be).
  - These metrics help you validate the tests you wrote are actually running the parts of the code you expect (or don't expect).
  - Platform integration for ingesting these metrics are available, but usually not worth it.  Simply having console output is sufficient most of the time.
    - [coveralls.io](https://coveralls.io) is a nice indie service that provides coverage metrics reporting.

<figure class="borderless">
  <picture>
    <source srcset="./coveralls-dark.png" media="(prefers-color-scheme: dark)">
    <img src="./coveralls-light.png" alt="Screenshot of Coveralls">
  </picture>
  <figcaption>Platforms like coveralls provide nice coverage tracking, but the cost of setting up integrations makes them optional.</figcaption>
</figure>

### Managing complex test scripts

Running multiple tests under `npm test` can result in a long, difficult to maintain `test` script.  Install [`npm-run-all`][npm-run-all] as a `devDependency` to break each `package.json` `test` command into its own sub-script, and then use the globbing feature to run them all in parallel (`run-p`) or in series (`run-s`):

```json
{
  "scripts": {
    "test": "run-s test:*",
    "test:deps": "dependency-check . --no-dev --no-peer",
    "test:standard": "standard",
    "test:tap": "tap"
  }
}
```

When testing locally, and an individual test is failing, you can bypass the other tests and run just the failing test:

```console
# run just the dep tests
npm run test:deps
```

[`npm-run-all`][npm-run-all] is a fantastic tool to keep your [`npm run`](https://docs.npmjs.com/misc/scripts) scripts manageable.

This builds on the fantastic and 2014 classic Keith Cirkel blog post [How to Use npm as a Build Tool](https://www.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/).

### Actually automating the tests

While its obvious that writing automated tests is a form of automation, its still very common to see projects not take the actual step of automating the run step of the tests by hooking them up to a CI system that runs the tests on every interaction with the code on Github.
Services like [TravisCI][travis] have been available for **FREE** for years, and there is literally no valid excuse not to have this set up.

Although [TravisCI][travis] has served many projects well over the years, [Github Actions](https://github.com/features/actions) is a newer and platform native solution that many projects are now using.  Despite the confusing name, Github Actions is primarily a CI service.

<figure class="borderless">
  <picture>
    <source srcset="./actions-dark.png" media="(prefers-color-scheme: dark)">
    <img src="./actions-light.png" alt="Screenshot of Github actions">
  </picture>
  <figcaption>Github actions has its own oddities, but overall its proven to be an extremely flexible and useful CI service, built right into the platform you are using if you are doing any kind of open source.</figcaption>
</figure>

Create the following action file in your package repo and push it up to turn on CI.

```yaml
# .github/workflows/tests.yml
name: tests

on: [push]

jobs:
  test:
    runs-on: ${{ matrix.os }}

    strategy:
      matrix:
        os: [ubuntu-latest]
        node: [14]

    steps:
    - uses: actions/checkout@v2.3.2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v2.1.1
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm i
    - run: npm test
```

For more information on Action syntax and directives, see:

- [Actions Docs](https://docs.github.com/en/actions)
- [Actions context reference](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions)
- [Actions examples](https://docs.github.com/en/actions/learn-github-actions/managing-complex-workflows)

### Automated Checks

Once you have a test suite set up, running in CI, any pull request to you package features the results of the "Checks API".
Various tests and integrations will post their results on every change to the pull request in the form of "running", "pass" or "fail".

The benefit to the checks status in the pull request UI is, depending on the quality and robustness of your test suite, you can have some amount of confidence that you can safely merge the proposed changes, while still having things work the way you expect, including the newly proposed changes.
No matter the reliability of the test suite, it is still important to read and review the code.

<figure class="borderless">
  <picture>
    <source srcset="./checks-dark.png" media="(prefers-color-scheme: dark)">
    <img src="./checks-light.png" alt="Screenshot of Checks API UI">
  </picture>
</figure>

## <span id="level-2">Level 2</span>: Dependency Bots

Your package has dependences.  Be it your test runner, or other packages imported or required into your package.  They help provide valuable function with little upfront cost.

Dependencies form the foundation that your package is built upon.  But that foundation is made of shifting sands⏳.
Dependencies have their own dependencies, which all have to slowly morph and change with the underlying platform and dependency changes.
Like a garden, if you don't tend to the weeds and periodically water it with dependency updates, the plants will die.

With `npm`, you normally update dependencies by grabbing the latest copy of the code and [checking for outdated](https://docs.npmjs.com/cli-commands/outdated.html) packages:

```console
git checkout master
git pull
rm -rf node_modules
npm i
npm outdated
```

<figure class="borderless">
  <picture>
    <source srcset="./outdated-dark.png" media="(prefers-color-scheme: dark)">
    <img src="./outdated-light.png" alt="Screenshot of npm outdated output">
  </picture>
  <figcaption><a href="https://docs.npmjs.com/cli-commands/outdated.html"><code>npm outdated</code></a> will give you a list of your dependencies that have fallen behind their semver range and updates that are available outside of their semver range.</figcaption>
</figure>

Checking for updates any time you work on the package is not a bad strategy, but it becomes tiresome, and can present a large amount of maintenance work, unrelated to the prompting task at hand, if left to go a long time.  A good package doesn't need to change much, so it may rarely ever be revisited and rot indefinitely.

**Enter dependency bots.**

A dependency bot monitors your package repositories for dependency updates.
When a dependency update is found, it automatically creates a PR with the new version.
If you have Level 1 automation setup, this PR will run your tests with the updated version of the dependency.
The results will (mostly) inform you if its safe to apply the update, and also give you a button to press to apply the change.
No typing or console required! 🚽🤳

Level 1 automation isn't required to use a dependency bot, but you won't have any way to automatically validate the change, so they are much less useful in that case.

### Dependabot

<img height="275" src="./dependabot.svg">

Github now has a dependency bot built in called [dependabot][dependabot].
To turn it on, create the following file in your packages Github repo:

```yaml
# .github/dependabot.yml

version: 2
updates:
  # Enable version updates for npm
  - package-ecosystem: "npm"
    # Look for `package.json` and `lock` files in the `root` directory
    directory: "/"
    # Check the npm registry for updates every day (weekdays)
    schedule:
      interval: "daily"
  # Enable updates to github actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "daily"
```

This enables updates for npm and github actions.  It offers other ecosystems as well.  See the [dependabot docs](https://docs.github.com/en/github/administering-a-repository/configuration-options-for-dependency-updates) for more info.

### In-range breaking change 🚨

Before dependabot, there was a now-shut-down service called [Greenkeeper.io](https://greenkeeper.io) which provided a very similar service.  It offered a very interesting feature which I'm still not sure if dependabot has yet.

<figure class="borderless">
  <picture>
    <source srcset="./in-range-dark.png" media="(prefers-color-scheme: dark)">
    <img src="./in-range-light.png" alt="Screenshot of Greenkeepers in-range breaking change PRs">
  </picture>
  <figcaption>Greenkeeper would run continuous checks for every new dependency in an and out of your packages semver range, proactively identifying breaking changes that could sneak in.</figcaption>
</figure>

It would run tests every time a dependency in your package was updated, in and out of semver range.

For in range updates that passed, nothing would happen.
For in range updates that failed, it would open a PR alerting you that one of your dependencies inadvertently released a breaking change as a non-breaking change.
This was a fantastic feature, and really demonstrated the heights that automated tests, CI, an ecosystem that fully utilized semver and dependency bots could achieve together.

Sadly, I haven't seen other services or languages quite reach these heights of automation sophistication (many ecosystems even lack any kind of `major` version gate rage), but perhaps as awareness increases of these possibilities more people will demand it.

There is a lot more room for innovation in this space.  It would be great to get get periodic reports regarding the health of downstream dependency chains (e.g. if you are depending on a project that is slowly rotting and not maintaining its deps).
As of now, dependabot seems to be recovering from a [post acquisition engineering fallout](https://twitter.com/bcomnes/status/1303421464910192641), but I hope that they can get these kinds of features back into reality sooner than later.

### Linter bots?

There are bots out there that can send in automated code changes source off lint tests and other code analysis tools.  While this is 'cool', these tasks are better served at the testing level.
Automated code changes for failing lint tests should really just be apart of the human development cycle with whatever IDE or editor they use.
Still, the bot layer is open to experimentation, so go forth an experiment all you want, though note that external service integrations have a heavy integration cost usually. 🤖

## <span id="level-3">Level 3</span>: Automated Changelog and Release Consistency Scripts

Quick recap:

- [Level 0](#level-0): we've automated collaboration and are receiving patch PRs from humans.
- [Level 1](#level-1): We automatically validate code with a test suite that runs on every PR.
- [Level 2](#level-2): We have a bot sending in patches for tedious dependency management tasks.

That means our package is going to morph and change with time (hopefully not too much though).  We need a way way to communicate that clearly to downstream dependents, be that us, someone else on the team or a large base of [dark-matter developers](https://www.hanselman.com/blog/DarkMatterDevelopersTheUnseen99.aspx).

The way to do this is with a CHANGELOG.md file.  Or release notes in a Github release page. Or ideally both.  [keepachangelog.com][keepachangelog] offers a good overview on the correct format a CHANGELOG.md should follow.

<figure class="borderless">
  <picture>
    <source srcset="./changelog-dark.png" media="(prefers-color-scheme: dark)">
    <img src="./changelog-light.png" alt="Screenshot of various changelog specs">
  </picture>
  <figcaption><a href="https://keepachangelog.com">keepachangelog.com</a>, <a href="https://www.conventionalcommits.org/en/v1.0.0/">Conventional Commits</a> and <a href="https://semantic-release.gitbook.io/semantic-release/">Semantic Release</a> are all conventions and systems for documenting changes to a project.</figcaption>
</figure>

This is a tedious process.  If you work with other people, they might not be as motivated as you to handcraft an artisan CHANGELOG file.  In my experience, the handcrafted, artisan CHANGELOG is too much work and easy to forget about.  Also, I haven't found a good linter tool to enforce its maintenance.

### [`auto-changelog`][auto-changelog]

[`auto-changelog`][auto-changelog] is a tool that takes your git history and generates a CHANGELOG that is almost-just-as-good as the artisan handcrafted one.  Hooking this tool into your package's [`version` life cycle][npm-scripts] enforces that it is run when a new version is generated with `npm version {major,minor,patch}`.
While [keepachangelog.com][keepachangelog] advocates for the handcrafted version, and discourages 'git commit dumps', as long as you are halfway concious of your `git` commit logs (as you should be), the `auto-changelog` output is generally still useful.
You can even follow [conventionalcommits.org](https://www.conventionalcommits.org/en/v1.0.0/) if you want an even more structured git log.

Automating `auto-changelog` to run during `npm version`^[Just as a refresher, `npm version` is a command that bumps the version in `package.json`, creates a commit with that change titled `0.0.0`, then tags it `v0.0.0`. See [npm][npm-scripts] docs for more info.] is easy.
Install it as a `devDependency` and set up the following script in `package.json`:

```json
{
  "scripts": {
    "version": "auto-changelog -p --template keepachangelog auto-changelog --breaking-pattern 'BREAKING CHANGE:' && git add CHANGELOG.md"
  }
}
```

The `version` script is a `npm run` lifecycle script that runs after the `package.json` version is bumped, but before the git commit with the change are created. Kind of a mouthful, but with nice results.

<figure class="borderless">
  <picture>
    <source srcset="./changelog-example-dark.png" media="(prefers-color-scheme: dark)">
    <img src="./changelog-example-light.png" alt="Screenshot of an auto-changelog changelog.">
  </picture>
  <figcaption><a href="https://ghub.io/auto-changelog"><code>auto-changelog</code></a> generates satisfactory changelogs.  The consistency it provides exceeds the value a hand written changelog can provide due to its inconsistent nature.</figcaption>
</figure>

### Publishing consistency scripts

Ok, so we have local changes merged in, and we've created a new version of the module with an automated changelog generated as part of the `npm version` commit.  Time to get this all pushed out and published!  By hand we could do:

```console
git push --follow-tags
# copy contents of changelog
# create a new Github release on the new tag with the changelog contents
npm publish
```

But that is tedious.
And what happens when your colleague forgets to push the git commit/tag to Github and just publishes to `npm`?
Or more likely, they just forget to create the Github release, creating inconsistency in the release process.

The solution is to automate all of this!
Use the [`prepublishOnly`][npm-scripts] hook to run all of these tasks automatically before publishing to npm via `npm publish`.
Incorporate a tool like [`gh-release`][gh-release] to create a Github release page for the new tag with the contents of your freshly minted [`auto-changelog`][auto-changelog].

```json
{
  "scripts": {
    "prepublishOnly": "git push --follow-tags && gh-release -y"
  }
}
```

<figure>
  <video controls width="100%" preload="metadata">
    <source src="./gh-release-demo.mp4#t=0.5" type="video/mp4">
  </video>
  <figcaption><a href="https://ghub.io/gh-release"><code>gh-release</code></a> makes it easy to create Github releases from a CHANGELOG.md.</figcaption>
</figure>


The result of this is our release process is returned to the lowest common denominator of process dictated by npm:

```console
npm version {major,minor,patch}
npm publish
```

But we still get all of these results, completely automated:

- Automated changelog updating via [`auto-changelog`][auto-changelog]
- Automated version bumping and creating a new version `git` commit+tag.
- Automated pushing to Github (including new tags)
- Automated Github release creation via [`gh-release`][gh-release], with the new contents of CHANGELOG
- Published assets to `npm`.

### All together

Those two run scripts together:

```json
{
  "scripts": {
    "version": "auto-changelog -p --template keepachangelog auto-changelog --breaking-pattern 'BREAKING CHANGE:' && git add CHANGELOG.md",
    "prepublishOnly": "git push --follow-tags && gh-release -y"
  }
}
```

#### Extending with a build step

Some packages have builds steps.  No problem, these are easily incorporated into the above flow:


```json
{
  "scripts": {
    "build": "do some build command here",
    "prepare": "npm run build",
    "version": "run-s prepare version:*",
    "version:changelog": "auto-changelog -p --template keepachangelog auto-changelog --breaking-pattern 'BREAKING CHANGE:'",
    "version:git": "git add CHANGELOG.md dist",
    "prepublishOnly": "git push --follow-tags && gh-release -y"
  }
}
```

Since version becomes a bit more complex, we can break it down into pieces with [`npm-run-all`][npm-run-all] as we did in the testing step.  We ensure we run fresh builds on development install (`prepare`), and also when we `version`.  We capture any updated build outputs in `git` during the version step by staging the `dist` folder (or whatever else you want to capture in your `git` version commit).

This pattern was documented well by [@swyx](http://twitter.com/swyx): [Semi-Automatic npm and GitHub Releases with `gh-release` and `auto-changelog`](https://dev.to/swyx/semi-automatic-npm-and-github-releases-with-gh-release-and-auto-changelog-4b5a).

## <span id="level-4">Level 4</span>: Publishing Bots 🤖

We now have a process for fully managing the maintenance and release cycle of our package, but we are still left to pull down any changes from our Github repo and run these release commands, as simple as they are now.
You can't really do this on your phone (easily) and someone else on the project still might manage to **not** run `npm version` and just hand-bump the version number for some reason, bypassing all our wonderful automation.

What would be cool is if we could kick of a special CI program that would run `npm version && npm publish` for us, at the push of a button.

It turns out Github-Actions has a feature now called [`workflow_dispatch`][workflow-dispatch], which lets you press a button on the repos actions page on GitHub and trigger a CI flow with some input.

<figure class="borderless">
  <picture>
    <source srcset="./workflow-dispatch-dark.png" media="(prefers-color-scheme: dark)">
    <img src="./workflow-dispatch-light.png" alt="Screenshot of workflow dispatch UI">
  </picture>
  <figcaption><a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows#workflow_dispatch"><code>workflow_dispatch</code></a> actions lets you trigger an action from your browser, with simple textual inputs.  Use it as a simple shared deployment environment.</figcaption>
</figure>

Implementing [`workflow_dispatch`][workflow-dispatch] is easy: create a new action workflow file with the following contents:

```yaml
# .github/workflows/release.yml

name: npm version && npm publish

on:
  workflow_dispatch:
    inputs:
      newversion:
        description: 'npm version {major,minor,patch}'
        required: true

env:
  node_version: 14

jobs:
  version_and_release:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2.3.2
      with:
        # fetch full history so things like auto-changelog work properly
        fetch-depth: 0
    - name: Use Node.js ${{ env.node_version }}
      uses: actions/setup-node@v2.1.1
      with:
        node-version: ${{ env.node_version }}
        # setting a registry enables the NODE_AUTH_TOKEN env variable where we can set an npm token.  REQUIRED
        registry-url: 'https://registry.npmjs.org'
    - run: npm i
    - run: npm test
    - run: git config --global user.email "user@email.com"
    - run: git config --global user.name " ${{ github.actor }}"
    - run: npm version ${{ inputs.newversion }}
    - run: npm publish
      env:
        GH_RELEASE_GITHUB_API_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Next, [generate an npm token](https://docs.npmjs.com/creating-and-viewing-authentication-tokens) with publishing rights.

Then set that token as a [repo secret][gh-secrets] called `NPM_TOKEN`.

<figure class="borderless">
  <picture>
    <source srcset="./secrets-dark.png" media="(prefers-color-scheme: dark)">
    <img src="./secrets-light.png" alt="Screenshot of Github secrets">
  </picture>
  <figcaption><a href="https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets"><code>GitHub</code></a> secrets allows you to securely store tokens for use in your GitHub Actions runs.  It's not bulletproof, bit its pretty good.</figcaption>
</figure>

Now you can visit the actions tab on the repo, select the `npm version && npm publish` action, and press run, passing in either `major`, `minor`, or `patch` as the input, and a GitHub action will kick off running our Level 3 version and release automations along with publishing a release to npm and GitHub.

**Note:** Its recommended that you `.gitignore` `package-lock.json` files, otherwise they end up in a library source, where it provides little benefit and lots of drawbacks.

I created a small actions called [`npm-bump`][npm-bump] which can clean up some of the above action boilerplate:

```yaml
name: Version and Release

on:
  workflow_dispatch:
    inputs:
      newversion:
        description: 'npm version {major,minor,patch}'
        required: true

env:
  node_version: 14

jobs:
  version_and_release:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2.3.2
      with:
        # fetch full history so things like auto-changelog work properly
        fetch-depth: 0
    - name: Use Node.js ${{ env.node_version }}
      uses: actions/setup-node@v2.1.1
      with:
        node-version: ${{ env.node_version }}
        # setting a registry enables the NODE_AUTH_TOKEN env variable where we can set an npm token.  REQUIRED
        registry-url: 'https://registry.npmjs.org'
    - run: npm i
    - run: npm test
    - name: npm version && npm publish
      uses: bcomnes/npm-bump@v2.0.1
      with:
        git_email: bcomnes@gmail.com
        git_username: ${{ github.actor }}
        newversion: ${{ github.event.inputs.newversion }}
        github_token: ${{ secrets.GITHUB_TOKEN }} # built in actions token.  Passed tp gh-release if in use.
        npm_token: ${{ secrets.NPM_TOKEN }} # user set secret token generated at npm
```

<figure class="borderless">
  <picture>
    <source srcset="./npm-bump-dark.png" media="(prefers-color-scheme: dark)">
    <img src="./npm-bump-light.png" alt="Screenshot of npm-bump in the marketplace.">
  </picture>
  <figcaption><a href="https://github.com/marketplace/actions/npm-bump"><code>npm-bump</code></a> helps cut down on some of the npm version and release GitHub action boilerplate YAML.  Is it better? Not sure!</figcaption>
</figure>

So this is great! You can maintain packages by merging automatically generated pull requests, run your tests on them to ensure package validity, and when you are ready, fully release the package, with a CHANGELOG entry, all from the push of a button on your cell phone. Fully Automated Luxury Package Space Maintenance. 🛰🚽🤳

## <span id="level-5">Level 5</span>: Project generation

*What is the best way to manage all of these independent pieces?* A template!  Or, a template repo.

*You mean things like [yeoman](https://yeoman.io)?*  Maybe, though that tool is largely used to 'scaffold' [massive amounts of web framework boilerplate](https://github.com/facebook/create-react-app) and is a complex ecosystem.

Something simpler will be more constrained and easier to maintain over time.  [Github repo templates][gh-repo-templates] and [`create-project`][create-project] are good choices.

### Github Template Repos

Github offers a very simple solution called [template repos][gh-repo-templates].  You take any repo on GitHub, go into its settings page and designate it as a template repo.  You can create a new repo from a template repo page with the click of a button, or select it from a drop down in the github [create repo wizard](https://github.com/new).

<figure class="borderless">
  <picture>
    <source srcset="./gh-template-dark.png" media="(prefers-color-scheme: dark)">
    <img src="./gh-template-light.png" alt="Screenshot of creating a repo from a template.">
  </picture>
  <figcaption>Repos that are designated as templates show up in the new repo UI.</figcaption>
</figure>

The only issue, is that you then have to go through and modify all the repo specific parameters by hand.
Better than nothing!
But we can do better.

### [`create-project`][create-project] repos

[`create-project`][create-project] is a simple CLI tool that works similar to Github template repos, except it has a `{{variable}}` system that lets you insert values when spawning off a project repo.  You can designate your [`create-project`][create-project] template repos to also be a Github template repo, and create new projects either way you feel like it.

<figure>
  <video controls width="100%" preload="metadata">
    <source src="./create-project.mp4#t=0.5" type="video/mp4">
  </video>
  <figcaption><a href="https://ghub.io/create-project"><code>create-project</code></a> lets you spawn a new project from a git repo and inject values into special <code>{{variable}}</code> blocks.</figcaption>
</figure>

Here are some of my personal template repos:

- [bcomnes/templates][templates] - simple template for Node.js CJS code.
- [bcomnes/esm-template](https://github.com/bcomnes/esm-template) - template that includes complexity to publish an ESM module to npm with CJS fall back support. A topic for a future blog post!
- [bcomnes/go-template](https://github.com/bcomnes/go-template) - a [Go](https://golang.org) package boilerplate template that includes versioned dev tooling support.  `create-project` doesn't need to only manage boilerplate for Node.js projects.  Maybe a go tool would be better for this, but it does show the flexibility of the tools.

## What about docs?

There are various solutions for generating docs from comments that live close to the code.

- [jsdoc](https://jsdoc.app)
- [typedoc](https://typedoc.org)
- [documentation.js](https://documentation.js.org)
- [Type Safe JavaScript with JSDoc](https://medium.com/@trukrs/type-safe-javascript-with-jsdoc-7a2a63209b76)
- [Pelle Wessman on JSDoc-comments](https://voxpelli.com/2019/10/use-type-script-3-7-to-generate/)
- [deno doc](https://doc.deno.land/builtin/stable)

I haven't found a solution that satisfies my needs well enough to use one generally.
Its hard to exceed the quality docs written by hand for and by humans.
If you have a good solution please let me know!

<figure class="borderless">
  <picture>
    <source srcset="./deno-doc-dark.png" media="(prefers-color-scheme: dark)">
    <img src="./deno-doc-light.png" alt="Screenshot of deno doc.">
  </picture>
  <figcaption><a href="https://doc.deno.land">deno doc</a> is beautiful and keeps code and docs tightly coupled.  But is the human consumed result better? Or does it just lead to cutting corners in exchange for static type checking? Time will tell!</figcaption>
</figure>

## All together now

That was a lot to cover.
If you want to see a complete level 0 through level 5 example, check out my `create-template` [template repo][templates] snapshotted to the latest commit of the time of publishing.

<figure>
  <video controls width="100%" preload="metadata">
    <source src="./publish-flow.mp4#t=0.5" type="video/mp4">
  </video>
  <figcaption>Here we can see the various parts of level 0-4 automation in action together.  Changes are made to the git history, the module is versioned and published by a bot.  It includes a changelog and was automatically validated by tests.</figcaption>
</figure>


## Final thoughts

This collection is written in the context of the Node.js programming system, however the class of tools discussed apply to every other language ecosystem and these automation levels could serve as a framework for assessing the maturity of automation capabilities of other programming language systems.
Hopefully they can can provide some insights into the capabilities and common practices around modern JavaScript development for those unfamiliar with this ecosystem.

Additionally, this documents my personal suite of tools and processes that I have developed to automate package maintenance, and is by no means normative.  Modification and experimentation is always encouraged.

There are many subtle layers to the Node.js programming system, and this just covers the maintenance automation layer that can exist around a package.
Much more could be said about the versioned development tooling, standardized scripting hooks, diamond dependency problem solutions, localized dependencies, upstream package hacking/debugging conveniences and local package linking.  An even deeper dive could be made on the overlap these patterns have (and don't) have in other JS runtimes like [Deno](https://deno.land) which standardizes a lot around Level 1, or even other languages like Go or Rust.

If you enjoyed this article, have suggestions or feedback, or think I'm full of it, follow me on twitter ([@bcomnes][twitter]) and feel free to hop in the the accompanying thread.  I would love to hear your thoughts, ideas and examples!  Also subscribe to my [RSS](http://bret-dk.local:3000/feed.xml)/[JSON](http://bret-dk.local:3000/feed.json) Feed in your favorite RSS reader.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">&quot;Fully Automated Luxury Space Age Package Maintenance&quot;<br><br>I wrote up how tedious package maintenance tasks can be fully automated. <br><br>Hope someone enjoys!<a href="https://t.co/fvYIu2Wq0r">https://t.co/fvYIu2Wq0r</a> <a href="https://t.co/q220LTax8X">pic.twitter.com/q220LTax8X</a></p>&mdash; 🌌🌵🛸Bret🏜👨‍👩‍👧🚙 (@bcomnes) <a href="https://twitter.com/bcomnes/status/1311034520305569800?ref_src=twsrc%5Etfw">September 29, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### Syndications

- [/r/node](https://www.reddit.com/r/node/comments/j27pbt/fully_automated_luxury_space_age_package/)
- [Github Community Forum](https://github.community/t/fully-automated-luxury-space-age-package-maintenance-with-github-actions/135103)
- [twitter thread](https://twitter.com/bcomnes/status/1311034520305569800)

[keepachangelog]: https://keepachangelog.com/en/1.0.0/
[git]: https://git-scm.com
[nyc]: http://ghub.io/nyc
[npm-run-all]: http://ghub.io/npm-run-all
[travis]: https://travis-ci.org
[dependabot]: https://docs.github.com/en/github/administering-a-repository/enabling-and-disabling-version-updates
[auto-changelog]: https://ghub.io/auto-changelog
[npm-scripts]: https://docs.npmjs.com/misc/scripts
[gh-release]: https://ghub.io/gh-release
[workflow-dispatch]: https://docs.github.com/en/free-pro-team@latest/actions/reference/events-that-trigger-workflows#workflow_dispatch
[npm-bump]: https://github.com/marketplace/actions/npm-bump
[gh-secrets]: https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets
[gh-repo-templates]: https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/creating-a-template-repository
[create-project]: https://ghub.io/create-project
[templates]: https://github.com/bcomnes/templates/tree/5fd64ef3e919d5e9e0d64bec6fd176c2f746cf1a
[twitter]: https://twitter.com/bcomnes

*[Level 0]: git and Github
*[Level 1]: Automated Tests + CI
*[Level 2]: Dependency Bots
*[Level 3]: Automated Changelog and Release Consistency Scripts
*[Level 4]: Publishing Bots
*[Level 5]: Project Generation
*[CI]: Continuous Integration
*[semver]: Semantic Version
*[PR]: Pull Request
