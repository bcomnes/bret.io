# [Littlstar][ls] Portfolio 2020

After a short sabbatical in Denmark at [Hyperdivision](https://hyperdivision.dk), I joined [Littlstar][ls].  Here are some of the projects and accomplishments I worked on in 2020.

## NYCPF

This was an agency style project developing a novel VR reality training platform for [NYCPF](https://www.nycpolicefoundation.org), powered by a custom [hypercore](https://ghub.io/hypercore) p2p file sharing network, delivering in-house developed unity VR scenarios.
These scenarios could then be brought to various locations like schools or events where NYCPF could guide participants through various law enforcement scenarios with different outcomes.

By utilizing a p2p and offline first design approach, we were able to deliver an incredibly flexible and robust delivery platform that had all sorts of difficult features to develop for traditional file distribution platforms such as:

- Automated offline re-distribution to a fleet of devices.
- Bittorrent style inverted bandwidth characteristics (more demand = more availability).
- Extremely high performance content distribution speeds.
- WAN and LAN peering between devices.
- Centrally controlled editorial over available content, with eventual-consistency properties to offline or air-gapped clients.
- Cross platform codebase targeting Windows, MacOS and Linux. (In fact, the dev team utilized all 3 platforms during development, interchangeably)

While the project was built on the backs of giants like the Hypercore protocol, as well as the amazing work of my [colleges](https://github.com/jwerle), I contributed in a number of areas to move the project forward during my time contracting on it.

- Took over the existing React application codebase, maintaining it and moving progress forward.
- Simplify and many internal packages.
- Simplify internal state management to React state and contexts instead of the existing Redux state machine.
- Implement offline mode.
- Packaging and delivery tasks.
- Improved progress UI/UX.
- Contribute to native packaging tools build with [pkg](https://ghub.io/pgk).

Some of the discrete software packages that resulted from this project are described below:

### secure-rpc-protocol

Secure rpc-protocol over any duplex socket using noise-protocol.
This was a refactor of an existing RPC over websocket project was using.
It improved upon the previous secure RPC already used in the project by switching to using the [noise protocol](http://noiseprotocol.org) which implements well understood handshake patterns that can be shared and audited between projects.
It also decoupled the RPC protocol from the underlying socket being used, so that the RPC system could be used over any other channels we might want in the future.

https://github.com/little-core-labs/secure-rpc-protocol

### async-folder-walkers

An async generator that walks files.
This project was a refactor of an existing project called [folder-walker](https://ghub.io/folder-walker) implementing a high performance folder walk algorithm using a more modern async generator API.

https://github.com/bcomnes/async-folder-walker


### Unpacker with progress

A specialized package that unpacks archives, and provides a progress api in order to provide UI feedback.
One of the deficiencies with the NYCPF project when I started was lack of UI feedback during the extraction process.
VR files are very large, and are delivered compressed to the clients.
After the download is complete, the next step to processing the data is unpacking the content.
This step did not provide any sort of progress feedback to the user because the underlying unpacking libraries did not expose this information, or only exposed some of the information needed to display a progress bar.
This library implemented support for unpacking the various archive formats the project required, and also added an API providing uniform unpacking progress info that could be used in the UI during unpacking tasks.
I implemented and package the library, in addition to implementing it into the React app, thus improving the UX during the unpacking step of the download process.

https://github.com/little-core-labs/unpacker-with-progress

### Hchacha20

One of the more interesting side projects I worked on was porting over some of the [libsodium]() primitives to [libsodium-js]().
I utilized a technique I learned about at Hyperdivision where one can write web assembly by hand in the WAT format, providing a much wider set of data types, providing the type guarantees needed to write effective crypto.

While the WAT was written for HChaCha20, the effort was quite laborious and it kicked off a debate as to weather it would be better to just wrap libsodium-js (the official libsodium js port) in a wrapper that provided the [sodium-universal]() API.  This was achieved by another group in https://github.com/geut/sodium-javascript-plus which successfully ran hypercores in the browser using that wrapper.

Ultimately, it this effort was scrapped, determining that noise peer connections in the browser are redundant to webRTC encryption and https sockets.

https://github.com/little-core-labs/hchacha20

### Reconnecting sockets

The work underlying the secure-rpc-protocol work was a re-implementation and improvements of a reconnecting socket.
The react app talked to a program running locally on the machine that communicated over websockets.
There were a number of strange error modes that these two would get into, and it was suspected to a bad state transition between the two due to some unknown factors.
I implemented a reconnecting state machine with primitives to manage a socket, and then implemented a version for browser native websockets.
This helped eliminate some of these bad state transitions by implementing a well understood and tested state machine for managing a reconnecting socket.

https://github.com/little-core-labs/reconnecting-socket
https://github.com/little-core-labs/reconnecting-simple-websocket

## Had a baby

Helped my wife in labor!
Littlstar support me and my family through this wonderful and challenging life event.
Thanks!

## Little Core Labs

Broke off to develop the future technology rewrite of Littlstar: rad.live!

High level contributions:

- Terraform running in Github actions
- Provisioning AWS infrastructure.
- Helping come up with how all of this stuff will work.

This was an amazing founders-style opportunity to help rethink and re-implement years of work that had developed at Littlstar prior to myself joining.
Effectivly starting from 0, we re-though of the entire technology pipeline, from operations, to infrastructure, to deployment, resulting in something really nice, modern and malleable.

This work broke down into the following areas:

## Github Actions CI

Enabled CI for all package across little-core-labs.  From the NYCPF work, we had a bunch of new software packages in a fresh GitHub org, but hadn't really standardized on how to automate anything around the.
One of my first initiatives was to enable basic automation around CI tasks, using the relatively new GitHub actions services.
This project enabled automation around the majority of the projects we had established, and also helped lay out a patter for the rest of the org to follow.

## Terraform ops

A culmination of ingesting the "Terraform: Up & Running" and "AWS Certified Solutions Architect" books, as well as building off existing organizational experience with AWS, I helped research and design an operations plan using Terraform and GitHub actions.

This arrangement has proven powerful and flexible.
While it isn't perfect, it has been effective and reliable and cheap, despite its imperfections in relation to some of the more esoteric edge cases of Terraform.

A quick overview of how its arrange:

- We have a global terraform repository with segmented terraform files for various services.
- The `ops` global repo runs terraform in a bootstrapped GitHub actions environment.
- We can create service level repos from the `ops` terraform repo, that in turn contain their own Terraform files specific to that service.
- One of the benefits was that the GitHub environment worked along side a local environment, due to the use of AWS secrets manager and GitHub actions secrets (all managed in Terraform), so debugging was easy and flexible.

This has worked well, and works well for small teams, and this terraform infrastructure is effectively free.
One refactor I would like to make in the future is to switch over to Terraform Cloud instead of GitHub actions.
As long as the team remains relatively small, this should keep the cost to a minimum.
If things grow, we could assess a self hosted Atlantis service and how it compares the more expensive Terraform Cloud plans.

https://github.com/little-core-labs/ops/

## Github actions

One of the drawbacks of rolling our own Terraform CI infrastructure was that we had to tackle many small edge cases inside the GitHub actions environment.
It was nice to learn about the various types of custom GitHub actions one can write, as well as expand that knowlege to the rest of the org, but it also ate up a number of days focusing on DevOps problems specific to our CI environment.

Here are some of the problems I helped solve in the actions environment.

https://github.com/little-core-labs/install-terraform
https://github.com/little-core-labs/netrc-creds
https://github.com/little-core-labs/get-git-tag

## Package automation

A culmination of the GitHub action work I did for Little Core Labs as well as off-time open source work, I came up with a robust framework for package automation.  E.g. How can I automate the tedious parts of maintaining software packages and help reduce software rot.
Over a short vacation, I wrote up these ideas and tools into a lengthly blog post.
I then took many of the techniques and ideas described there and propagated them across many of the packages at LCL.
This work has been especially helpful when we need to fork quality, but unmaintained upstream open source work that we critically depend on, or if we need to fork something and make fundamental changes to to fit our needs.
The result is packages that are largely maintainable by bots, with a consistency layer that allows many different people interact with the automation in a uniform way.

https://bret.io/projects/package-automation/
https://github.com/bcomnes/npm-bump

## sdk-js

I helped lay the framework for the initial version of `sdk-js`, the Little Core Labs unified library used to talk to the various back-end services at Little Core Labs.
One of underlying design goals was to solve for the newly introduced native ESM features in node, in such a way that the package could be consumed directly in the browser, natively as ESM in node, but also work in dual CJS/ESM environments like Next.js.
While this did add some extra overhead to the project, it serves as a design patter we can pull from in the future, as well as a provide a highly compatible but modern API client.

https://github.com/little-core-labs/sdk-js
https://github.com/bcomnes/esm-template

## Rad.live

I was effectively the principal engineer on the new Rad.live website.
I established and implemented the tech stack for Rad.live, aiming to take a relatively conservative take on a code base that would maximize the readability and clarity for a Dev team that would eventually grow in size.

A high level, the application is simply an app written with:

- Next.js (React with a framework to provide standard bundling, SSR and routing features)
- SWR (Declarative data 'hooks', minimizing/eliminating complex state management throughout the app)
- GQLR (A simple GraphQL client tuned to 'just work')
- Styled JSX (A simple and understandable CSS-In-JS framework that minimizes orthogonal layout CSS)

From a development perspective, it was important to have testing and automation from (close to) the beginning.
For this we used:

- GitHub actions to run CI on every interaction.
- Organizational standard linting that supported the unique needs of React.
- Storybook for data/state independent component testing (Using the new and improved storybook API)
- Automated component testing, with a minimum of 'does it render' testing utilizing the storybook stories.
- Release automation.

Overall, the codebase has had two other seasoned developers (one familiar and one new at react) jump in and found it productive.
Additionally, it has been a relatively malleable code base that is easy to add MVP features to and is in a great position to grow.

https://github.com/little-core-labs/rad.live

### Vision.css

Implemented a custom design system working closely with our design team.
This project has worked out well, and has so far avoided 'css lockout', where only one developer can effectively make dramatic changes to an app layout due to an undefined and overly general orthoganal 'global style sheet'.
The way this was achieved was by focusing on a simple global CSS style sheet that implements the base HTML elements in accordance with the design system created by the design team.
While this does result in a few element variants that are based on a global style class name, they remain in the theme of only styling 'built in' html elements, so there is little question what might be found in the global style sheet, and what needs to be a scoped css style.

Some of the features we used for vision.css

- Standard CSS syntax with a selection of a few 'yet-to-be-released' css syntax features.
- A postcss build pipeline.
- Heavy use of CSS variables (lets use theme, down the road if we want a light-mode, for example).
- A website that contains a styleguide and preview of the various styled elements.

https://github.com/little-core-labs/vision.css

### Eslint shared config

Linting is the spell check of code, but its hard to agree on what rules to follow.
Like most things, having a standard set that is good-enough is always better than no rules, and usually better than an unpredictable and unmaintainable collection of project unique rules.
I put together a shared ESLint config that was flexible enough for most projects so far at Little Core Labs based on the 'StandardJS' ruleset, but remained flexible enough to modify unique org requirements.
Additionally, I've implemented it across many of the projects in the Github Org.

https://github.com/little-core-labs/eslint-config-12core

### GQLR

Fork and improved a GraphQL request library, bringing with it many improvements we would have a hard time landing upstream.
This relatively simple wrapper around the JS fetch API has a gaggle of upstream maintainers with various needs that don't really match our needs.
My fork simplified and reduced code redundancy, improved maintainability through automation, fixed bugs and weird edge cases and dramatically improved errors and error handling at the correct level of the tech stack.
These changes would have unlikely been accepted upstream, so by forking we are able to gain the value out of open source resources, while still being able to finely tune them for our needs, as well as offer those changes back to the world

https://github.com/little-core-labs/gqlr

### Strapi remote auth

Helped solve a major initial problem with our strapi microservice architecture quickly and in a way that is still in use today.
One of the major technological blockers we ran into was connecting our multi-strapi-instance microservice architecture together in a way that was uniform.
I helped research and develop a pattern that effectively solved a remote-strapi auth solution that also propagated user role information across services in a relatively well contained drop-in package.
It has even proven flexible enough for authenticating non-strapi microservices.

https://github.com/little-core-labs/strapi-remote-auth

### Community maintenance

Help maintain various packages we rely on using many of the underlying org tools we built this year.
Largely as a byproduct of the developments in automation and GitHub actions work we did at the beginning of the year, I'm able to dramatically increase my capacity to fork and maintain open source work that is no longer receiving necessary upstream work.

Some recent examples of our ability to do this is can be seen in the following forks we've made:

- https://github.com/little-core-labs/date-input-polyfill
- https://github.com/little-core-labs/chromafi

## 2021 Goals

Some goals for next year:

- Rad.live polish polish polish.
- Reduce bus factor on major infrastructure by 1 across strapi and web services (grow the team).
- Refactor and improve Ops flows where we left of.
- Revisit our p2p solutions and see how they can fit into our strapi infrastructure.
- Build a world class custom video player library for Rad.live.


[ls]: https://littlstar.info
