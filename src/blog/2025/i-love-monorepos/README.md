---
layout: article
title: "I Love Monorepos—Except When They Are Annoying"
serif: true
publishDate: "2025-03-09T21:53:14.740Z"
description: "All the ways monorepos are annoying, and also how they can be useful."
image: ./img/og.jpg
---

I love monorepos, but monorepos can be annoying, especially in open source.
They make sense in some cases, but they come with a lot of baggage and patterns I’ve noticed over the years—so I need to write about them.

I'm primarily talking about JS-based "monorepos," a.k.a. workspaces when used in open source packages, but the whole space is confused enough that I might stray a bit.

## Historical Context

JS monorepos (or "workspaces") emerged with tools like [`lerna`](https://github.com/lerna/lerna), later influencing similar features in [`npm`](https://docs.npmjs.com/cli/v11/using-npm/workspaces), [`yarn`](https://classic.yarnpkg.com/en/docs/workspaces#search) and [`pnpm`](https://pnpm.io/npmrc#workspace-settings). At their core, they allow developers to:

- Develop and publish multiple `npm` packages from a single `git` repository
- Streamline dependency management with automatic linking and consolidated lockfiles
- Allow for varying direct dependency versions in a single repo

This approach gained popularity largely as a response to:
- The frustrating fragility of `npm link`
- React's "unique" constraints that caused errors when linked across packages
- The exponential growth of tooling complexity costs (Babel, Webpack, CSS-in-JS, TS)
- The promise of O(1) tooling changes instead of O(n²) updates across multiple repositories

<figure>
  <img loading="auto" src="./img/og.jpg" alt="A picture of the tower of Babel">
  <figcaption>Babel is probably the most appropriately named project in open source history.</figcaption>
</figure>

## What I Love About Monorepos

Monorepos have utility in some circumstances.

Monorepos are ideal for scenarios like this: a project with a series of APIs, a website, and background worker processes where a team of developers works on the codebase together
Each process has its own set of unique and shared dependencies, and also has a set of common queries and types shared between two or more services.
The primary trade-off of course is that any changes to shared code has to be reflected in all dependents at the time of introduction.

Outside of this context, it's mostly just misery for dependents and contributors.

## All the Ways Monorepos (and Adjacent Hypertooling) Are Annoying

Most of the issues stem from "hypertooling", a generally bigger issue in all development ecosystems, but they manifest at scale in the monorepo arrangement, so it's a useful vehicle to point out these issues.

### "Let Me Just Fix This Little Bug"

You're using a dependency in your project.
That dependency has a bug, and you need to fix it.
Node.js was designed with the intention that you could just open up `node_modules` and edit the code to generate patches.

With packages sourced from monorepos, this is not the case!

You open up the code in `node_modules` now, and it's some franken-compile-to-es-1-ts-rollupviteparcel-webpack-babeldegook-lerna-pnpm-berry-workzone-playplace that has also been pre-minified for some reason. Also the sourcemaps and ESM type exports are broken for some reason.

### Packages Published from Monorepos Have More Bugs

This is completely anecdotal but also completely true.
Packages published from monorepos have more defects, and finding and fixing the defects is more challenging for dependents.
I believe this is due to two factors:

- The development environment (the monorepo) varies more from the deployment environment (`node_modules/foo`) than single repo = single package project organization.
- The developer who is prioritizing the monorepo DX over the consumption DX, has gone out of their way to avoid working in the deployment environment, and therefore fails to test things in realistic deployments.

These two factors, plus the inherent complexity of all the tools required to make monorepos work, lead to encountering more defects in monorepo-published packages.

Also, trying to fix or upstream work to monorepo packages is memorably more miserable and painful.

This really comes down to thermodynamics—more entropy, more problems—and it's true!

### Finding the Source Code to Fix Is a Lot Harder

Noodling around on your machine-generated direct runtime dependencies in `node_modules` may still be possible, and you may even identify a quick fix you want to upstream, but now you're tasked with actually finding the source code.
This leads to many additional challenges in monorepos!

### Package Metadata Is Often Stripped from `package.json`

Because you can't simply publish packages from a monorepo without a mountain of scripts and tooling, monorepo-sourced packages often rewrite `package.json` (we have to differentiate which `package.json` we’re talking about in a monorepo!) in a way that accidentally (or intentionally, for devs who prefer to move a bespoke minification step into the `npm publish` lifecycle for no stated reason) [strips useful and important metadata](https://docs.npmjs.com/cli/v6/configuring-npm/package-json#repository).

### Package Metadata Is Often Wrong or Incomplete

Okay, so we're lucky—this monorepo-published package has some metadata about the repo that created it.
But it only takes us to the repo homepage.
Now we have to find out if the package name matches the directory name used in the monorepo or how this thing is put together at all to hunt down the source code of the package.

### They probably don't have a README.md

The package probably has a super sub-par README.md or something that points to some random permutation of a (probably incomplete) docs website (that will go offline when the maintainer gets busy and forgets to renew the domain). If you are lucky you might get a generated typedoc website (good), but with zero JSDoc description  annotations (the part that describes things for humans) (bad).

Obviously, nothing in monorepos requires this to be the case, but the tools seem to facilitate this outcome.

### Each Monorepo Is a Unique Permutation of Opinion and Entropy

Because there are always weird variations on which tool is used and how, finding the package entry point becomes a chore.
It's hard to do on GitHub, and you basically have to clone the package and grep around, comparing the source code to try and find where the contents of the package tarball match up.

### Which Package Manager Are They Using for the Monorepo?

Okay, so the package itself has no hard requirements on which package manager you use, but the monorepo only works with `pnpm`.
No, wait, it requires `yarn`.
Oh, wait, not Yarn 1—why is that still the default? It needs Berry.
Why does this repo have more than one lockfile?!?
Oh crap, what is [`corepack`](https://nodejs.org/api/corepack.html), do I need that?

### Now You Have to Install More Tools

`corepack`, `yarn`, `berry`, `pnpm`, `lerna`, `volta`, `turborepo`, `nx`, etc., etc., etc....

By the way, Node.js ships with `npm`. It literally could be that easy—this is all opt-in hypertooling.

### No One Uses the Standard Node.js Tooling (`npm` Workspaces)

`npm` ships workspaces.
Nothing uses them.
To their credit, `npm` workspaces leave a lot to be desired.
Tools that support `workspaces` will often only work with `lerna` 1 workspaces or something like that, not `npm` workspaces for some reason.
Sad situation.

### The Monorepo Install Step Will Probably Fail

Because you have to install dependencies for N packages instead of 1 in a monorepo, and the chances of a monorepo dev running Gentoo or nix or something elite and weird are much higher than normal, don't expect this to work on your machine.
The external native dependencies are probably not documented anywhere, or buried in a README in one of the packages.!

Remember, at scale, rare events become common! More dependencies, more  places to break.

### The Tests Aren't Passing Locally

We got through the install step.
We had to switch Node versions or install `pkgconfig` or something.
We go to land our patch, but before we do, we run `yarn test`.
The tests fail!
Not on the package we want to work on, but somewhere else.

Now we get to look into how to narrow the test harness and see if the relevant suite works or not, or just submit the patch and hope it works in CI.

### The Tests Aren't Passing in CI

We submit the PR upstream, and CI fails—again, for the same unrelated package that we saw locally.
I'm not here for that, and fixing it looks hairy.
The maintainer merges your changes anyway.
Oof. Let's hope they have it under control despite appearances.

Isolated changes aren't actually isolated at all in monorepos.
They end up requiring the whole suite to pass.
Depending on the nature of your contribution, it may come down to you to look into why something stopped working, unrelated to the task at hand.

### All of the Devtools Fall Over

The scale of monorepos will often far exceed the performance envelope that the devtools were targeting (small to medium-sized repos).
JS and TS require dev tooling.
JS requires a parsing linter to catch well-known but easy-to-miss language hazards.
TS requires tools to type-check and build.

These tools operate fine at a specific range of scale and get extremely slow and crappy beyond that scale.
Monorepos are an excellent pattern to follow if you want to exceed that scale quickly.

### Needs Everything Rewritten in Rust

A big part of the effort to rewrite everything in Rust is because the JS-based tooling isn't fast enough for the size of the monorepos people throw them at.
But also, people are just sick of the mess they've been a part of and want to hop ecosystems.
Many monorepos are quick to adopt Rust-based tools, along with all of their fresh bugs and defects.

It's a good time to remind people that tools like the SASS compiler used to be written in C++ to be fast.
We've been here before!

### They Need VSCode Plugins

Many monorepos assume and encourage people to not only install devDependencies but also VSCode plugins to work effectively in them.
No, it's not available in Vim or Sublime or any other editors.
What, you don't use VSCode?!

### Monorepo Tooling Falls Out of Date Quickly

Maybe this is getting better these days, but why do I keep running into Yarn 1 and Lerna everywhere still?

Because any singular tooling change in a monorepo has to cover the workflow for N packages, it forces you to address any changes in ALL packages when making tooling updates.
This often leads to it never happening.

Remember the argument that monorepos promised O(1) tooling changes?
Well, that one change can't go in until N packages (* N times you have to make updates) are modified to work with that change.
This distinction is always overlooked.
Centralizing tooling means every change requires mass coordination.
If each package were in its own repo, you could selectively apply the tooling changes to the 2-3 you are actively working on and get around to the rest when it matters.

### They Ship Hoisting Bugs

Hoisting bugs are more common in monorepos and are easily captured in lockfiles, where they can't be reproduced by dependents.
Why install any dependencies when you can assume your peers have them?!?

`pnpm` forces you to fix these—great—but `pnpm` doesn't ship with Node, so only a fraction of monorepos address this.

### Versioning and Publishing Hazards

Monorepos inadvertently create several versioning challenges that single-package repos typically don't encounter:

- **Overactive Versioning**: Tooling automatically bumps multiple packages simultaneously, leading to unnecessary version noise for downstream dependents.

- **Hazardous Permutations**: When packages are published in groups but updated selectively by dependents, untested version permutations emerge—especially problematic with peer dependencies.

- **Partial Publishes**: Complex automations sometimes only publish a portion of interdependent changes, creating temporarily broken package states.

- **Cross-Module Side Effects**: Changes in unrelated modules in monorepos can introduce defects in the modules you depend on, something far less likely with separate repositories.

### Overmodularized internals

Overmodularizing (adding versioned module boundaries between code where just a separate file or export in the same module would do) is a hazard in general, but it seems to often be worse in monorepos.
This tends to be a mistake you see less experienced developers make, but monorepos deserve unique recognition here: by lowering the spin-up cost of modules, monorepos make this mistake easier and more common.

### Probably overusing peerDependencies

I actually don't understand this one, but modules out of monorepos tend to heavily utilize peer dependencies, where regular dependencies would actually be preferable.
I suspect its some frontend bundler need that somehow has leaked into the Node.js module graph but I haven't ever gotten an answer that makes sense on this one.

### Monorepos Break GitHub and Tooling

Because N projects run out of one repo, the entire GitHub resource model (One project = one repo) is made largely useless.
Issues, CI, and permissions now have to scale down to the folder level instead of hanging off the repo resource boundary.
This has incredible implementation costs for the entire tooling ecosystem as they attempt to accommodate large monorepos.

Most tools just simply fail to work by default in the monorepo arrangement because your monorepo is unique and bespoke compared to all the others. Because of its sheer size, tools have to implement complex scaling solutions just to listen to webhooks off monorepos. It really sucks.

### "But Google Does It!"

This comparison fundamentally misunderstands Google's approach.
Google doesn't use JS-based workspaces or monorepos in their organization (at least in the example everyone's reaching for)—they've built custom tooling with dedicated engineering teams specifically to make their monorepo approach viable at their scale.

Google has invested millions in proprietary build systems and infrastructure that most teams simply don't have access to.
The contexts are so different that the comparison provides little practical value for most JavaScript projects.

Your startup or open-source project operates under completely different constraints and with different goals than Google's engineering organization, on top of the fact Google isn't really a great company to emulate these days.

### "But `npm link` Sucks"

"I don't want to link 2+ repos together locally."

This is a legitimate pain point—`npm link` becomes tedious and fragile beyond a single layer of linking. However, this limitation actually encourages better architectural decisions about module boundaries and dependencies.

The core issue isn't that `npm link` is flawed; it's that we're often creating unnecessary dependencies between packages that could be designed with cleaner separation. When packages are truly independent enough to warrant separate publishing, they should rarely need simultaneous development.

For general-purpose libraries especially, isolating code into separate repositories with well-defined boundaries often leads to better design decisions and more maintainable code over time. Reaching for monorepos to avoid these challenges can sometimes mask architectural problems rather than solve them.

That said, every project has unique requirements—if yours genuinely benefits from the tight coupling a monorepo enables, that's a valid choice. The key is making that decision deliberately rather than defaulting to it out of convenience.

### "But Small Modules Are Annoying"

Monorepos and many/deep module graphs are pretty orthogonal, but I have heard this argument a few times.
The idea is that it’s okay to have many dependencies sourced from the same repo—this is better than having them sourced from many repos.
Okay, sure, as long as you can live with the above issues!

If all those repos are owned by the same person, I don't really see the issue.

Generally though, small modules aren't annoying because they live in a singularly scoped repo, (they are annoying because their they lack [API depth](https://web.stanford.edu/~ouster/cgi-bin/aposd.php)).
Annoying modules are annoying
Get rid of your annoying dependencies, and cross your fingers the replacement is less annoying.

### "All of These Problems Apply to Single-Package Repos Too!"

A lot of the above problems are just hazards with the Node module system.
Yes, you can run into a lot of the same issues with single-package repos.
But in practice, you don’t.
Monorepos act as a multiplier on these hazards on top of their own set of issues.

### "[Insert New Runtime] Fixes This!"

Give any JS ecosystem incumbent some time in the spotlight, and you will be surprised at the "wild" ideas people will come up with to make peoples lives more complicated!

### "I'm an overworked, underpaid maintainer, I need this"

This is probably true. Do whatever you need. Just enumerating a few common hazards to avoid.

### "You or someone should write up single package repo hazards"

Yeah Agreed.
Single module repo strategies are sadly very underdeveloped and misunderstood.

## Conclusion

Monorepos have legitimate uses in specific contexts—particularly when sharing code between multiple processes in a single project or coordinating work across closely related sub-projects and teams. In these situations, they can remove barriers to a developer workflow that would otherwise be necessary in open source.

But for open-source modules, the costs often outweigh the benefits and are actually creating a reputational hazard for an otherwise completely functional and scalable module system. Instead of defaulting to monorepos, consider these alternatives:

- **Focused Single-Package Repos**: For libraries with a clear, cohesive purpose, maintaining separate repositories provides cleaner boundaries and more reliable publishing workflows.

- **Minimal Dependencies**: Rather than splitting functionality across numerous tiny packages that require a monorepo to manage, consider whether your design truly benefits from such granular separation.

- **Strategic Module Boundaries**: Create module boundaries only where they provide genuine benefits—at natural seams in your architecture rather than arbitrary divisions.
Frequent cross boundary linking indicates unnecessary boundaries.

The JavaScript ecosystem moves quickly, but we should be careful not to adopt complex solutions for problems that could be solved more elegantly with simpler approaches. Sometimes the answer isn't more tooling or more packages—it's thoughtful design and careful consideration of the downstream experience.

Monorepos aren't inherently bad, but they're also not a silver bullet. Understanding when they help and when they hinder is key to using them effectively.
