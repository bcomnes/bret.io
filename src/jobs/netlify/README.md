# [Netlify](http://www.netlify.com) Portfolio

I am lucky to be able to contribute to many features and experiences that affect Netlify's massive user base.  Here are some examples of things that I worked on.

## **Platform**

After working on the Product team for slightly over a year, I switched to working on Netlify's platform team.  The team has a strong DevOps focus and maintains a redundant, highly available multi-cloud infrastructure on which Netlify and and all of its services run.  My focus on the team is to maintain, develop, scale and improve various critical services and libraries.  Below are some examples of larger projects I worked on.

### Buildbot

One of my primary responsibilities upon joining the team is to maintain the Buildbot that all customer site builds run on.  It is partially open-source so customers can explore the container in a more freeform matter locally.

<ul>
  <li class="lang docker"><a href="https://github.com/netlify/build-image">netlify/build-image</a> - Docker file which defines the container builds run in.</li>
  <li class="lang go"><a href="https://godoc.org/github.com/netlify/open-api/go">netlify/open-api/go</a> - Go open-api client used in the bot.</li>
</ul>

<figure>
  <a href="./buildbot.png"><img src="./buildbot.png" alt="screenshot of buildbot logs"></a>
  <figcaption>Screenshot of the users view of the buildbot doing its thing.</figcaption>
</figure>

#### Selectable build images

One of the first feature additions I launched for the Buidlbot was selectable build images.  This project required adding the concept of additional build images to the API and UI and to develop an upgrade path allowing users to migrate their websites to the new build image image wile also allowing them to roll back to the old image if they needed more time to accommodate the update.

Additionally, I performed intake on a number of user contributed build-image additions and merged other various potential breaking changes within a development window before releasing.  I also helped develop the changes to the Ruby on Rails API, additions to the React UI, as well as write the user documentation.  It was widely cross cutting project.

<figure>
  <a href="https://www.netlify.com/blog/2019/03/14/a-more-flexible-build-architecture-with-updated-linux/"><img src="./build-image-blog.png" alt="screenshot of buildbot image blogpost"></a>
  <figcaption><a href="https://www.netlify.com/blog/2019/03/14/a-more-flexible-build-architecture-with-updated-linux/">Blog post</a> on the launch of the selectable build images.</figcaption>
</figure>

<figure>
  <a href="./image-selection.png"><img src="./image-selection.png" alt="screenshot of buildbot settings"></a>
  <figcaption>Build image selection UI.</figcaption>
</figure>

### Open API

I help maintain and further develop Netlify's Open-API (aka Swagger) API definition, website and surrounding client ecosystem.  While open-api can be cumbersome, it has been a decent way to synchronize projects written in different language ecosystems in a unified way.

<ul>
  <li class="lang go"><a href="https://github.com/netlify/open-api">netlify/open-api</a> - API definition and Golang client</li>
  <li class="lang js"><a href="https://github.com/netlify/js-client">netlify/js-client</a> - Node.JS and Browser JS client</li>
</ul>

<figure>
  <a href="https://open-api.netlify.com"><img src="./open-api-web.png" alt="screenshot of the open-api website"></a>
  <figcaption>Netlify's <a href="https://open-api.netlify.com">open-api website</a></figcaption>
</figure>

### Other platform projects I work on

<ul>
  <li class="lang go"><a href="http://github.com/netlify/gotrue">netlify/gotrue</a> - Netlify's Identity service</li>
  <li class="lang go"><a href="http://github.com/netlify/gocommerce">netlify/gocommerce</a> - Netlify's Commerce service</li>
  <li class="lang js"><a href="https://github.com/netlify/zip-it-and-ship-it">netlify/zip-it-and-ship-it</a> - Netlify's Lambda function packaging algorithm</li>
</ul>

## **Product**

I worked on Neltify's Product team for a bit over a year and completed many successful user facing projects.  Here are just a few examples:

### CLI

I was primary author on Netlify's current CLI codebase.

<ul>
  <li class="lang js"><a href="http://github.com/netlify/cli">netlify/cli</a> - Netlify's extensible CLI</li>
  <li class="lang js"><a href="https://github.com/netlify/js-client">netlify/js-client</a> - The API client used to make all API calls in the CLI</li>
  <li class="lang js"><a href="https://github.com/netlify/cli-utils">netlify/cli-utils</a> - A common utility class for loading and saving configuration from a CLI command</li>
</ul>

<figure>
  <video controls width="100%">
    <source src="./netlify-cli.mp4" type="video/mp4">
  </video>
  <figcaption>Build image selection UI.</figcaption>
</figure>

<figure>
  <a href="https://www.netlify.com/blog/2018/09/10/netlify-cli-2.0-now-in-beta-/"><img src="./cli-blog.png" alt="screenshot of the cli announcement blog post"></a>
  <figcaption>Read more about the CLI in our <a href="https://www.netlify.com/blog/2018/09/10/netlify-cli-2.0-now-in-beta-/">blog post announcement</a>.</figcaption>
</figure>

### JAMStack slides

### Identity Widget

### Domains

### Functions

### Dashboard

### Security Audit Log

### Zero Config Split Testing
