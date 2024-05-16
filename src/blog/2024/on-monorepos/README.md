---
layout: article
title: "Thoughts on monorepos"
serif: true
publishDate: "2024-05-11T21:53:29.639Z"
published: false
description: "I finally came around to monorepos. Here is what I think about them."
image: ./img/og.jpeg
---

I've long been cool to the idea of monorepos. I dislike almost every quality about then and find working in and around them tedious and full of additional challenges that are never acknowledged by those that advocate for them, especially when used in open source library work.
Recently I have come around to the idea of their use under certain specific circumstances:

When you need to split a single process into two or more individual processes and need to share code between them, a monorepo workspace streamlines a workflow to facilitate development on shared code living between two independent targets.
Additionally, the shared code should generally lack value outside of this shared context (no need to publish discrete versions), otherwise it may be beneficial to develop it as a standalone module.

In effect, monorepo workspaces provide a similar workflow to npm modules or private npm modules, without the need to discretely version the shared portion of code.
This doesn't come without cost though.

Monorepos introduce a ton of additional configuration overhead.
Testing and deploying is complicated by multiplexing configuration for multiple targets into a single repo. In addition to the performance overhead of doing "everything in one" repo, working in a single repo tends to facilitate the illusion that all changes deploy atomically.
This is of course not the case with 2 or more processes.
Its key to not forget that you are still working in a distributed environment, as well as the nuances around that during deploy ordering and whatnot.
