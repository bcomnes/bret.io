---
layout: article
title: Simple TanStack Query with Preact
serif: false
publishDate: "2026-02-07T20:35:20.001Z"
updatedDate: "2026-02-12T16:22:51.308Z"
handlebars: false
description: "Use npm package aliases to get @tanstack/react-query working in Preact without any bundler config."
image: ./img/preact-tanstack.jpg
---

**UPDATE**

About 3 days after writing this, Tanstack [realeased a native preact tanstack query adapter](https://github.com/TanStack/query/pull/9935)! Just use that and ignore the rest. Thanks to everyone invovled in that.

- ([`@tanstack/preact-query`](https://www.npmjs.com/package/@tanstack/preact-query))

---

![](./img/preact-tanstack.jpg)

Here is a simple approach to getting [`@tanstack/react-query`](https://tanstack.com/query/latest) working in a [preact](https://preactjs.com/guide/v10/differences-to-react#features-exclusive-to-preactcompat) project.
I'm certain I'm not the only person to arrive at this, but I also didn't manage to find anyone suggesting this under the noise of your usual bundlerslop tutorials.

I'm intentionally trying to write this at more of a beginner's level, so if anything is confusing, feel free to ask questions.

[`@tanstack/react-query`](https://www.npmjs.com/package/@tanstack/react-query) internally imports and defines as a peerDependency [`react`](https://www.npmjs.com/package/react) (meaning they need to be installed together in your project).
When running a preact project, `react` generally shouldn't be installed, so it will be missing, or auto-installed alongside `@tanstack/react-query` in newer versions of `npm` (we don't want this!).

## Package alias to the rescue

So the simplest solution here is to define `react` as a project `dependency`, next to `@tanstack/react-query`, and specify its version to a dependency override ["package alias"](https://docs.npmjs.com/cli/v11/using-npm/package-spec#aliases) pointing at `@preact/compat`:

```jsonc
# package.json
{
  "dependencies": {
    "@tanstack/react-query": "^5.90.20",
    "preact": "^10.27.0",
    # This swaps react for @preact/compat in node_modules!
    "react": "npm:@preact/compat@^18.3.1"
  } 
}
```

This tells `npm`, `pnpm`, etc to install `@preact/compat` inside the `react` directory in `node_modules`.
Anything resolving `react` out of `node_modules` will instead import `@preact/compat`. Simple!

The advantage to this approach is ALL tools get the override, not just the frontend bundle.

If you do any kind of [`preact-render-to-string`](https://github.com/preactjs/preact-render-to-string) for SSR, or skeleton page generation or lightweight component testing inside of a Node.js process, things just work.
The code you run through a bundler which sits on top of `node_modules` will inject the correct dependency, without any additional bundler config.

You don't need to alias `react-dom`, unless something else is trying to import that. Typically, your DOM `render` function comes out of this package, but you are likely already using `preact` directly for this.

## TanStack Getting Started (Preact edition)

After performing the above alias, the getting started TanStack example becomes:

```ts
// client.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { html } from 'htm/preact'
import { render } from 'preact'
import { getTodos, postTodo } from '../my-api'

// Create a client
const queryClient = new QueryClient()

export function App() {
  return html`
    <${QueryClientProvider} client=${queryClient}>
      <${Todos} />
    <//>
  `
}

function Todos() {
  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const query = useQuery({ queryKey: ['todos'], queryFn: getTodos })

  // Mutations
  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return html`
    <div>
      <ul>
        ${query.data?.map((todo) => html`
          <li key=${todo.id}>${todo.title}</li>
        `)}
      </ul>

      <button
        onClick=${() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  `
}

if (typeof window !== 'undefined') {
  const container = document.getElementById('root')
  if (container) {
    render(html`<${App} />`, container)
  }
}
```

If you wanted a separate Node.js entrypoint that ran `preact-render-to-string` you could then do:

```ts
// ssr
import { html } from 'htm/preact'
import { App } from './client.js'
import { render } from 'preact-render-to-string'

const out = render(html`<${App} />`)
```

## Where this might not work

If you are importing a wide array of react components from npm, and any of them erroneously define a direct dependency on `react`, something else may download a second copy of `react`. 
`react` hates it when there is more than one copy of `react` in your bundle, so if you find yourself in this case, 
you may need to introduce bundler config to solve that.
The more general package manager override directives might also work if you have transitive copies of `react` you want to hammer out, however these are specific to the package manager you use ([npm](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides), [pnpm](https://pnpm.io/settings#overrides) etc).

If you rely heavily on [`jsx`](https://legacy.reactjs.org/docs/introducing-jsx.html) but still hope to directly run your `.tsx`/`.jsx` through node, you will also need to [find a solution](https://nodejs.org/api/module.html) to do that, or use something like [htm](https://github.com/developit/htm) if you want to avoid that problem altogether.
