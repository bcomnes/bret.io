---
layout: article
title: "Stupid Lockfile Tricks"
serif: true
publishDate: "2024-02-15T19:35:38.818Z"
published: false
description: "Stupid lockfile tricks and some history."
image: ./img/og.jpeg
---

In October 2016, the [`yarn` package manager is released](https://classic.yarnpkg.com/blog/2016/10/11/introducing-yarn/) ([archive.ph/xRZ8H](https://archive.ph/xRZ8H)).
`yarn` introduced a new file into your projects called `yarn.lock`.
`yarn.lock` was modeled after the ruby `bundler` lockfile [`Gemfile.lock`](https://bundler.io/guides/rationale.html).

<figure class="borderless">
  <a href="https://classic.yarnpkg.com/blog/2016/10/11/introducing-yarn/">
    <img loading="auto" src="./img/yarn-intro.png" alt="Screenshot of yarn's intro blogpost">
  </a>
  <figcaption>Yarn's introduction blog post.</figcaption>
</figure>

Lockfiles were introduced in an attempt to solve a problem for people feeling growing pains of large dependency trees[^deptree] constantly optimistically updating their dependencies within their specified [semver](https://semver.org) ranges on every install, and then encountering breaking updates somewhere in their transitive dependency[^transitive] tree which they did not have direct control over.

A short while later, npm responded with their version of a lockfile `package-lock.json`:

- [npm Blog Archive: Hello, Yarn!](https://blog.npmjs.org/post/151660845210/hello-yarn.html) ([archive.ph/6htXJ](https://archive.ph/6htXJ))
- [npm@5, specifications, and our RFC process](https://blog.npmjs.org/post/154473364440/npm5-specifications-and-our-rfc-process.html) ([archive.ph/29uVE](https://archive.ph/29uVE))
- [v5.0.0](https://blog.npmjs.org/post/161081169345/v500.html) ([archive.ph/pEQiV](https://archive.ph/pEQiV))

<figure>
  <a href="https://blog.npmjs.org/post/161081169345/v500.html">
    <img loading="auto" src="./img/npm-5.png" alt="Screenshot of npm@5 anouncement blogpost">
  </a>
  <figcaption>npm followed suit with <code>package-lock.json</code>.</figcaption>
</figure>

One of the more controversial directives yarn's lockfile shipped with was that one [MUST commit `yarn.lock` to your git repo](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/) ([archive.ph/PTYoQ](https://archive.ph/PTYoQ)), apps **and libraries** inclusive, because this offered a solution to the “Works On My Machine” problem AKA the "In-range Breaking Change". This directive included some tenuous examples that arguably remained unaddressed by lockfiles, but none the less set a strong precedent: commit your lockfiles!

The source of the directive's controversy came in two forms:

1. Lockfile workflows were a stark departure from an ecosystem which successfully embraced minor semver ranges by default (`^`) up until that point.
2. Lockfiles were next to useless when used around module code (because they are not published with modules or consumed by dependents) and even hazardous due to their nature of creating divergent resolution behavior relative to the modules dependents during module development.

Despite these controversies, lockfiles were a useful tool which made the following new capabilities possible:

1. Being able to capture a lightweight representation of a full dependency tree resolution, and the ability to use that representation to recreate it repeatably (usually).
2. The ability to capture odd dependency tree state manipulations that are generated from applying add/remove/update actions on an already resolved dependency tree (this state would be lost otherwise...).

From this point and to this day, if you ask around the general consensus regarding "best practice" lockfile use splits into two widely accepted answers:

- **Apps**: Generate and commit lockfiles to the repo and attempt to
follow the lockfile minimal update "happy path".
- **Modules**: Avoid generating and/or committing lockfiles to the repo, because they don't actually help anything in the context of module code. [sindresorhus's](https://github.com/sindresorhus/ama/issues/479#issuecomment-310661514) offers the most well known rendition of this approach.

<figure class="borderless">
  <a href="https://github.com/sindresorhus/ama/issues/479#issuecomment-310661514">
    <img loading="auto" src="./img/sindre.png" alt="Screenshot of why sindre doen't use lockfiles.">
  </a>
  <figcaption>Module developers ~17x more likely to choose to not use lockfiles in module development.</figcaption>
</figure>

## The Lockfile "Happy Path"

In a perfect world, the lockfile workflow would look something like this:

- After `npm init`, you would install dependencies with `npm i foo --save` or `npm i bar --save-dev`.
- These top level dependencies are captured in your list of direct dependencies in your projects `package.json`.
- `npm` installs these dependencies to `node_modules`, along with their dependencies, so on and so forth, following its resolution algorithm, and then captures what it does in full in the `package-lock.json` lockfile.
  - The resolution algorithm performs various optimizations with duplicate dependencies by "flattening" and de-duplicated within overlapping semver ranges.
  - These optimized resolution "solutions" are are extremely implementation dependent, vary with tool versions, network conditions and pre-existing `node_module` state.
  - The result of the resolution is captured in the `package-lock.json`. Fresh resolutions in a lockfile will perfectly match the recursive semver specification of all dependencies at that given time. Further mutations on an existing resolution will begin to introduce permutations of this resolution solution over time.
- You commit your `package-lock.json` and `package.json` to your repo, and go about your merry day.
- In the future, you check for top level dependency updates with `npm outdated` and apply them with `npm update`, install new dependencies, remove dependencies, and fingers crossed the mutations roughly resolve to what a fresh resolution would resolve to (the ideal state, as defined by the tree of semver ranges in all `package.json`'s).
- Merge-conflicts due to concurrent mutations made by team mates on the dependency tree are resolve correctly (hopefully) by the package manager and you can keep this process going forever into the future.

<figure class="borderless">
  <a href="./img/updates.png">
    <img loading="auto" src="./img/updates.png" alt="A list of available updates!">
  </a>
  <figcaption>Now all you need to do is keep on top of updates for 1200 transitive dependencies and you should be good!</figcaption>
</figure>

## The Realistic Lockfile Lifecycle

As you perform mutations, either directly with `npm` ors use something like [Dependabot](https://docs.github.com/en/code-security/dependabot/working-with-dependabot) or [Renovate](https://docs.renovatebot.com), these lockfiles end up capturing resolution state.

The de-duplication algorithms end up solving your dependency tree resolutions in different arrangements according to the application of tree manipulations relative to what a fresh, full resolution would generate without a lockfile on a given date.

These random resolution permutations are common and cause bugs.

Did an update or install only refresh transitive versions in part of your tree?

Bug.

Did a set of transitives originating out of a monorepo push out a patch fix on 6 related modules, and you somehow only update 3 of them?

Bug.

The accepted solution when your lockfile accumulates to much "state" and the addition, removal or update of a dependency begins to cause problems in your project code, is to delete `node_modules`, delete `package-lock.json`, and re-install and capture a new lockfile from a fresh semver resolution for your entire tree. Further mutation or performing surgery on a 26k+ line machine generated lockfile simply becomes unfeasible.

This situation is more common than "in-range breaking changes".

So in reality the lockfile workflow looks more like:

- Generate a fresh lockfile from a set of top level dependencies in `package.json`.
- Capture the `pacakge-lock.json` into git, 'freezing' the dependency resolution in **time**.
- Perform these dependency mutations on this initial resolution state to try and keep up to date with your upstream dependencies, all the while further diverging from the 'ideal' semver specification that evolves through time.
- Eventually run into some odd permutation of dependency resolutions and declare lockfile bankruptcy[^lfbank] and regenerate your lockfile.

Oh, and also don't forget, despite looking like a text file that its comitted into git, it's unwise to allow git to attempt automatic merges of lockfiles, because this could introduce resolution errors. Be sure to add the following to your `.gitattributes` so git treats it like a binary file:

```
pnpm-lock.yaml               merge=binary
shrinkwrap.yaml              merge=binary
npm-shrinkwrap.json          merge=binary
yarn.lock                    merge=binary
```

Okay, so with all that out of the way, here are some stupid tricks you can do to make the most of lockfiles while also avoiding a lot of their pain.

## Trick 1: `.gitignore` lockfiles

A common alternative to the default "commit to git" lockfile workflow is the "no lockfile" approach.
This approach is commonly found in module code, because developing module code **with** a lockfile unhelpfully introduces the problem of running all future CI test results against the last date at which the lockfile was regenerated and committed, or worse, against some unique resolution permutation none of your users will ever encounter.
This is a problem because locking your tests to a specific and unique resolution **can and will** hide bugs that your users will encounter when installing.

To take this approach you simply add lockfiles to your `.gitignore`:

```
yarn.lock
package-lock.json
pnpm-lock.yaml
```

You can optionally disable lockfile generation for the repo by adding an `.npmrc` file to the repo with the following setting:

```
package-lock=false
```

In this workflow, I recommend the `.gitignore` approach, and omitting `.npmrc`.
That way developers can choose locally if they want to generate lockfiles during development or not.

This approach effectively returns to a pre-lockfile workflow and is the most realistic arrangement for your module dependents.
If your module is unable to reliably develop with this level of variability, then your dependents will also inherit those same defects.

### What about app code?

I think there is a strong pragmatic argument to be made when working on project code with teams (aka code that doesn't have direct dependents or published versions) that freezing your dependency tree with a lockfile makes sense.
These tend to be large codebases, and you will have issues with dependencies. It's preferable to choose when to deal with those issues on your own schedule versus in real time.

That said, these other ideals should be factored in, but are often overlooked:

- A good goal should be to engineer your project and its dependencies such that it would work most of the year in a dev environment *as if there was no lockfile committed*. If this isn't possible, your dependency foundation will be a major source of instability, lockfile or none.
- You should feel comfortable and frequently fully regenerate your lockfiles. Your dependencies specify and test against this behavior. You should allow for this process to occur.
- You should avoid mutating your lockfile over too long of a period of time. This isn't desirable and you diverge from what your dependencies want and test with.
- You should use your lockfiles strategically for reproducibility on tests and deploys. You shouldn't leave your development environment in a broken state for long stretches of time by using a lockfile to pretend that it isn't.
- Consider that fixing one isolated dependency issue a week will take less time than dealing with 4 simultaneous dependency issues once a month and calibrate your regeneration schedule around this.

## Trick 2: Strategic Lockfiles Snapshots

Lockfiles are useful artifacts for generating a deterministic reproduction of fresh installations performed in the past.
When working with uncommitted lockfiles, if you generate fresh lockfiles at strategic moments, such as CI test runs, or deploy pipelines, it can be helpful to archive them in case you ever need to go back and reproduce for debugging purposes.

GitHub actions makes this very simple.
To strategically archive lockfiles from test runs, you can add a step similar this to any Action run after a `npm i` or equivalent is run.

```yaml
    - run: npm i
    - name: Archive lockfile
      uses: actions/upload-artifact@v4
      with:
        name: pacakge-lock.json
        path: package-lock.json
```

If in the event you need the lockfile to recreate the dependency set of a failing test or working or broken deploy, you simply download the lockfile and use it, temporarily commit it etc.

<figure class="borderless">
  <a href="./img/artifact.png">
    <img loading="auto" src="./img/artifact.png" alt="A screenshot of GitHub actions artifacting a package-lock.package-json">
  </a>
  <figcaption>You can artifact things during CI and deploys. Lockfiles are a great candidate for this!</figcaption>
</figure>

## Trick 3: `npm i --before`

`npm` now has a `--before` config flag that can be used to perform a dependency tree resolution as if it were run on the provided date.

```bash
npm i --before "2021-01-27T19:04:22.125Z"
```

The primary purpose of a lockfile is to deterministically re-assemble a dependency tree from a previous install.

Remember, though, that npm is a (mostly) immutable package registry. This means that re-resolving your dependency tree at a given date (even without a lockfile) will *also be deterministic* (save for oddball undefined behaviors like network speeds, host conditions and various optional and peer dependency conditions).

If `lockfiles` are a "lightweight" 25k line text file that can recreate `node_modules` arrangements from the past, (lighter than archiving `node_modules` in a zip archive or docker container), then we can also agree that `2021-01-27T19:04:22.125Z` is an even lighter weight string that can deterministically recreate `node_modules` arrangements from the past.

If you are crazy, you can even commit this to your git repo in the form of an `.npmrc`:

```
#.npmrc
before=2021-01-27T19:04:22.125Z
```

### Pros of `--before`

- Re-creates the ideal tree resolution at a given date time (avoids state, gives you what you actually want)
- Nearly deterministic
- Less diff noise
- Simple to understand and audit and update

### Cons of `--before`

- Nobody knows about it.
- No `npm ci` style speedup (if you aren't generating or committing lockfiles)
- Still subject to non-deterministic and undefined behavior of the resolution step of the used package manager.

I learned about this flag in the writing of this blogpost and wish I knew about it sooner! Even with lockfiles, time travel is an incredible investigative tool when dealing with transitive dependency bugs you have no clue where they are originating.

## Trick 4: `package.json` Overrides

"But wait", you say, "I don't just want my dependencies to resolve correctly and perfectly according to their semver spec at a given date, I want to make sure I capture all the weird state permutations me and the team accumulated over time to fix this one weird transitive dependency issue I had 6 months ago".

Hey fair enough, I've been there. But there is a more human-centric solution available now for fixing bad transitive versions: [`package.json` overrides](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#overrides).

Where you might have previously performed strategic lockfile surgery or upgrade or downgraded transitive dependencies on an existing resolution tree and committed those mutations to a lockfile, you now have the ability to apply specific override patterns to your entire dependency tree.

```
{
  "overrides": {
    "foo": "1.0.0"
  }
}
```

This is a lot easier to understand than a 105 line patch on in a machine managed lockfile that MUST NOT CHANGE less the transitive dependency issue comes back.

## Trick 5: Use everything all the time all together

The point here isn't to say lockfiles serve as a bad solution and are annoying to use and introduce problems in place of the problems they set out to solve, but rather, consider their strategic use, their history and the ecosystem they apply over. They offer a set of unique capabilities, and you can utilize these to your advantage, and you don't need to subject yourself to them when they aren't helpful.

Running into transitive dependency issues during updates?

- Clear your lockfile and `node_modules` and time travel back to a known good date with `--before`.
- Compare the lockfile generated at that point against the one generating today.
- Use this data to generate an `override`, a much more maintainable solution than lockfile line diffs.
- Maybe even consider removing or avoiding dependencies that resolve poorly consistently over time.
- Commit or don't commit lockfiles. Dare to make a pragmatic decision rather than one of pure tradition, convention or decree. Try it, you'll like it. JavaScript is the big tent ecosystem, and there isn't a single authority in the room.

## Conclusion

Even with these alternative workflows, tricks and tools that limit the necessity of lockfiles, Node.js, `npm`, `node_modules` and the wider ecosystem is not without fundamental flaws.

One of the primary examples used in `yarn`'s argument for git committed lockfiles was that dev tools are complicated and break a lot and lockfiles solve this.

Is this a fundamental reality? Or was this just common in the ecosystem `yarn` was born out of at the time? Was the use of `lerna`, the tool that pioneered lockstep multi-module patching, in this ecosystem a contributing factor in these published defects that necessitated the guarding of a lockfile? Does resolving, optimizing and de-duplicating developer dependencies into the same dependency tree as your production dependencies even make sense fundamentally? What are we optimizing for here, disk space during development?

Imagine the wider set of possible solutions for this one specific problem:

- What if devDependencies resolved into a separate folder than `node_modules`?
- What if devDependencies that only served to provide a dev time `bin` didn't contribute any transitives to `node_modules`?
- What would the ecosystem look like if more `devDependencies` published built or bundled tools by convention? Would we loose something by reducing shared library overlap with our production `node_modules`?
- What if `node_modules` was virtualized? Is there a fundamental reason that Node.js has to perform a Rube Goldberg resolution algorithm against a directory structure on disk?
- What if instead of defaulting to lockfiles, projects used "lockdates" + strategic `overrides`? What would a purely `before` + `overrides` workflow look like.

Ah one can only imagine the possibilities. In the meantime, give some of these simplifcations a shot and see what you think!
Maybe you've been making dependency management harder than it needs to be all these years.


[^transitive]: Transitive dependencies are dependencies of your direct dependencies, so on and so forth. In older versions of `npm`, it was difficult for top-level dependents to customize how these resolved and there was a sense of 'loss of control' of ones dependency tree.

[^lfbank]: Lockfile bankruptcy: when no matter the mutational operation you take on your lockfile, you cannot get a working dependency resolution for a variety of reasons. The easiest solution is deleting the lockfile and starting over.

[^deptree]: For the purpose of this post, dependency tree refers to the the final state that the `npm` or `yarn` package managers construct in a projects `node_modules` folder (the folder full of all of your projects shared libraries and dependencies).
