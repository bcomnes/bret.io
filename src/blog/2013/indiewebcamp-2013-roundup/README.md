---
layout: article
title: "IndieWebCamp 2013 Roundup"
publishDate: "2013-06-28"
legacyDate: "2013-06-28 21:44"
handlebars: false
redirectFrom:
  - "/2013/06/28/indiewebcamp-2013-roundup/"
tags: [Indieweb, IndieWebCamp, Portland, IWC2013, Webfist, Webfinger, Camlistore, Smallest-Federated-Wiki, IndieAuth, Persona]
---

> **Archived post — originally published 2013-06-28.**
>
> **Historical context:** Project capabilities and the SMS example describe the 2013 event, not current authentication guidance. Five original Flickr illustrations are unavailable.

This past weekend I attended [IndieWebCamp 2013](http://indiewebcamp.com/Main_Page), a small, two day [barcamp](http://barcampportland.org/about/) style conference in [Portland, OR](http://goo.gl/maps/okB7X).  I have never been to anything like this before, but needless to say, given all of the [amazing ideas and fantastic projects people](http://tantek.com/2013/175/t2/indiewebcamp-hacks-sms-login-webfist-favoriting) came and left with, I had a fantastic time and left inspired.

# Projects that blew my mind
Every project at IWC2013 was interesting and important in its own way. They are the product of everyone scratching their own itch, [doing things their own way](https://www.youtube.com/watch?v=1OFyh8ihzEs), finding [common](http://microformats.org/) [ground](http://www.whatwg.org/specs/web-apps/current-work/multipage/) with others and ultimately avoiding [monoculture](http://indiewebcamp.com/monoculture).  That being said, the following projects really blew my mind.

## IndieAuth: Passwordless Authentication and Persona
<figure>
  <p><strong>Image unavailable.</strong> <a href="http://farm4.staticflickr.com/3717/9157793342_8c0b1c266e_o.png">Original image URL</a></p>
  <figcaption>Original illustration; no caption supplied.</figcaption>
</figure>

[IndiAuth](https://indieauth.com/) added two additional authentication methods over the weekend, SMS and Persona.  [Austin King](http://ozten.com/psto/) and [Francois Marier](http://fmarier.org/), both Mozilla Developers, as well as as [Aaron Parecki](http://aaronparecki.com/) worked their magic and made this happen.

- #### IndiAuth now supports Persona when provided an email address.

[Mozilla Persona](https://www.mozilla.org/en-US/persona/) [has many benefits](http://identity.mozilla.com/post/46374271364/persona-is-distributed-today) over the siloed implementations of ~~openID~~OAuth.  You can now add a `rel="me"` to an email address on your web page and authenticate using Persona in IndieAuth.  Apparently this could also work the other way, where IndieAuth serves as an authentication provider for Persona.  There was also discussion about ways to use Persona with IndieAuth without having to have an email address posted publicly.  [These last two items have not been implemented yet](http://indiewebcamp.com/2013/demos#Aaron_Parecki_and_Francois_Marier).  More can be read on [Francois's blog](http://feeding.cloud.geek.nz/posts/indieauth-as-a-persona-identity-provider/)

- #### SMS Authentication killed the password

[Aaron](http://aaronparecki.com/) also managed implemented SMS authentication.  If you add 

```html
<a rel="me" href="sms:+15035555555">(503) 555-5555</a> 
```

to your identifying website, IndieAuth allows you to authenticate with your domain and the associated phone number alone.  No passwords.

*This is a big idea.*

[Lots](http://gizmodo.com/5977040/googles-making-moves-to-kill-the-password) [of](http://www.fool.com/investing/general/2013/05/14/paypal-and-apple-want-to-kill-your-password.aspx) influential tech companies talk about killing passwords.  IndieWebCamp has a working model for this today.  If only we could associate phone numbers with email addresses, maybe we could speed up adoption...

## Webfist
<figure>
  <a href="./Fist.png"><img src="./Fist.png" width="1122" height="1596" alt="Black silhouette of a raised fist" loading="lazy"></a>
  <figcaption>Source: <a href="https://commons.wikimedia.org/wiki/File:Fist.png">Wikimedia Commons</a> (marked public domain; creator unspecified).</figcaption>
</figure>

What happens when two incredibly skilled Google engineers sit down for a day and hack on the solution to corporations who are too stubborn and/or slow to adopt open web technologies?  

- #### The answer to that is [Webfist](http://webfist.org/).

Developed by [Brett Slatkin](http://www.onebigfluke.com/) and [Brad Fitzpatrick](http://bradfitz.com/), Webfist is the the answer to the slow rate at which [Webfinger](http://webfinger.org/) is being implemented by basically everyone.

- #### Here are the details I remember from the weekend.

Webfinger lets you associate arbitrary pieces of information to an email address so that services can discover that information simply by knowing your email address.  This is done by relying on the email host to implement Webfinger.  Examples of information you might want associated with your email address.

- A (link to a) profile photo
- Public encryption key
- Website URL
- Phone number
- Bitcoin Address
- Preferred authentication method(s)

The only problem is that the major email providers have not yet implemented Webfinger, even though the engineers behind the scene are clamoring for it, and may or may not have already even dark launched it.

Webfist is the software used to run a distributed fallback network that allows webfinger attributes to be associated with *any* email address, even if the email provider has not yet implemented Webfinger support.  [The way it actually works is kind of complicated](http://www.onebigfluke.com/2013/06/bootstrapping-webfinger-with-webfist.html), but it uses [some kind of fancy cryptographic header information](http://www.dkim.org/) that the major players *have* implemented to help fight spam.  This cryptographic header information also happens to be a convenient way to allow an email address to associate Webfinger data with itself securely.

- #### How can I start using it today?

After speaking with Brad, it sounds like it wont be necessary for many individuals to run a Webfist server, although its completely possible for anyone to run a node in the distributed network.  It sounds like the developers have a number of connections that can provide the necessary infrastructure to get the network off the ground.

I still have not found dead simple example showing exactly how to get data into the Webfist network.

- #### What about the whole own your domain thing?

There was [some controversy surrounding Webfinger](http://indiewebcamp.com/WebFinger) during the discussion session on Webfist.  On the one hand, this powerful discoverability tool could potentially pull wind away from people seeing the need to represent themselves on a domain name (IE, why would I need a domain name if I can assert my identity using my email address).  The other perspective is that it could act as a transitional bridge away from silos serving as identity authorities for those without a domain name.

Oh, and I can't confirm or deny if **webfist.me** was purchased over the weekend.

## IndieWeb Implementations
<figure>
  <p><strong>Image unavailable.</strong> <a href="http://farm3.staticflickr.com/2807/9157907602_c9d5926a8a_o.png">Original image URL</a></p>
  <figcaption>Original illustration; no caption supplied.</figcaption>
</figure>

Shortly before IWC2013, an interesting thing happened at [eschnou.com](http://eschnou.com/entry/testing-indieweb-federation-with-waterpigscouk-aaronpareckicom-and--62-24908.html).  Using standard HTML, [Microformats](http://microformats.org/wiki/h-entry), and [Pingbacks](http://indiewebcamp.com/pingback)/[Webmentions](http://indiewebcamp.com/webmentions), a distributed commenting system emerged.  

- No central servers
- No company controlled APIs
- No single software stack

Anyone with some common HTML classes and dom structures with the ability to send dead simple HTTP requests [can participate](http://indiewebcamp.com/reply).  Post the reply on your own website noting your reply context, then notify the site about your activity using a webmention or pingback.  Here are some examples:

- [eschnou.com](http://eschnou.com/entry/testing-indieweb-federation-with-waterpigscouk-aaronpareckicom-and--62-24908.html)
- [aaronparecki.com](http://aaronparecki.com/notes/2013/06/23/3/indieauth-indiewebcamp#comments)
- [waterpigs.co.uk](http://waterpigs.co.uk/notes/4QeMP9/)
- [sandeep.io](http://www.sandeep.io/73) (featuring the original Indie "Likes"!)
- [werd.io](http://werd.io/view/51c8fc19bed7de5e23600fb1)
- [willnorris.com](https://willnorris.com/2013/06/testing-indieweb-comments)

Some implementations display like a traditional comment system, others follow the twitter UX for handling replies.  Some people are even experimenting with threads.  The key to success here is that everyone is [selfdogfooding](http://indiewebcamp.com/selfdogfood).

- #### Idno posting [Chickens](http://werd.io/view/51cba40ebed7de0162d02f9e), [Events](http://indiewebcamp.com/event), [RSVPs](http://indiewebcamp.com/rsvp) and [CRUD](http://indiewebcamp.com/reply#Update_a_comment)

<figure>
  <p><strong>Image unavailable.</strong> <a href="http://farm8.staticflickr.com/7385/9155902415_53114141a4_o.png">Original image URL</a></p>
  <figcaption>Original illustration; no caption supplied.</figcaption>
</figure>

After Sunday, it became apparent that everyone still had momentum from the weekend.  [Ben Werdmuller](http://werd.io/) and I decided that [rounding up anyone still in Portland was a good idea](http://bret.io/2013/06/24/t6/).

A few hours (or just an hour?), Ben managed to implement an [event post and a working RSVP model](http://werd.io/event/51c94deebed7de5c2386a1b4/unofficial-portland-post-indiewebcamp-meetup)!  After realizing the original announcement details needed to be updated after posting, [tantek](http://tantek.com/2013/178/t2/federated-indieweb-comments-likes-event-rsvp-demo-crud) helped draft comment updates+deletes (CRUD), which Ben implemented a day later.

- #### The indieweb delete protocol is aptly named the [*Pilgrim Protocol*](http://indiewebcamp.com/delete)

Hats off to Ben and the [Idno](http://idno.co/) project, as well as everyone else involved, for the impressive speed at implementing these important concepts.  [Aaron already has his RSVP](http://aaronparecki.com/replies/2013/06/27/1/indieweb) implementation working!

This stuff is developing fast!  Just the other evening [Aaron *also* implemented IndieWeb IRC replies](http://aaronparecki.com/replies/2013/06/28/1/indieweb)!

# Things that looked rad but I did not fully understand
The following projects look super interesting but I am still confused about exactly what they are or how they work.

## [Camlistore](https://camlistore.org/)
<figure>
  <p><strong>Image unavailable.</strong> <a href="http://farm4.staticflickr.com/3674/9158159070_bb685d1fa3_o.png">Original image URL</a></p>
  <figcaption>Original illustration; no caption supplied.</figcaption>
</figure>

[Brad](http://bradfitz.com/) gave a talk on [Camlistore](https://camlistore.org/).  It appears to be way to store data in some kind of blob tree which offers a lot of flexibility on how it can be accessed and stored.  It also sounds like it could enable distributed file sharing in really interesting ways.  It also has versioning built in by design.  *Apparently you will eventually be able to rent out space to others for Bitcoins*.

I myself, am sitting on a pile of data at home, unsatisfied 
with how its stored and accessed. This sounds like it has a huge potential for providing some satisfaction to my data problem.

*Update: A video has surfaced of basically what we saw during the conference!  [Check it out](/2013/07/02/camlistore-intro-status-update/).*

## [Smallest-Federated-Wiki](http://fed.wiki.org/welcome-visitors.html)

<figure>
  <p><strong>Image unavailable.</strong> <a href="http://farm4.staticflickr.com/3716/9155969247_91e0319a12_o.png">Original image URL</a></p>
  <figcaption>Original illustration; no caption supplied.</figcaption>
</figure>

I missed the discussion on this project, and I wish I hadn't.   The [Smallest-Federated-Wiki](http://fed.wiki.org/welcome-visitors.html) is a wiki that allows anyone to fork pages from someone else's wiki to their own instance the wiki, and allows others to pull those changes in...  Or display content from another wiki?  I think.  The implementation looks really slick and has a lot of interesting client side stuff going on.  Check out some of the [demo videos](http://wardcunningham.github.io/).  I might jump on this and set up my own instance eventually.

## IFTTT Everything
[Paul Fenwick](https://twitter.com/pjf) led an interesting discussion and gave some demos about implementing APIs, data collection and automated actions where there previously was nothing.

Having little experience or skills relevant to this topic, I found myself kind of lost, but the automation and interfacing with data sources was impressive.  There are some interesting links from that sessions [etherpad](https://etherpad.mozilla.org/indiewebcamp-exobrain).

# Other Ideas that resonated with me

- [Academic Markdown and Citations](http://indiewebcamp.com/2013/Citations_and_Scholarly_Markdown)
- [Forking the Commons](http://www.harlantwood.net/pub/Harlan_T_Wood/)
- [TheBrain](http://indiewebcamp.com/2013/Sessions#Personal_Data_Storage_Solutions)

# Ideas for next year

- ### IRC Brainstorm

    [IRC](http://indiewebcamp.com/IRC) plays an integral role in developing these projects, as it serves as the primary channel of real-time communication for those involved.  It is my wager that the recent IndieWeb commenting system would not have arisen without this channel.  It can be tough for new users of IRC to participate this way because the software is hard to use, or complicated to set up in many cases.  I would like to see discussions about how people use IRC in relation to the IndieWeb, as well as look for new uses for this communication tool.

    We could also just demo everyones exotic IRC setups, and help newcomers get started.

- ### Static Sites

    Static websites are fairly easy create, and dead simple to host.  I would like to discuss how people can participate on the Indieweb with only static HTML and client side JS.  I am primarily curious how others over come some of the challenges of doing everything at compile time.  I would also be happy sharing what I have learned from my own experiments.

# How I can contribute going forward

- ### Increase my [IndieMark](http://indiewebcamp.com/IndieMark) score by implementing all post types
- ### Display Webmentions/Pingbacks I have received on [Pingback.me](http://pingback.me/)

- ### Automate webmentions and pingbacks

- ### Look into [Unhosted](https://unhosted.org/) posting methods

<figure>
  <a href="./indie-web-camp-2013.webp"><img src="./indie-web-camp-2013.webp" width="3936" height="2328" alt="IndieWebCamp 2013 participants posing together in front of a projection screen" loading="lazy"></a>
  <figcaption>Group photo from <a href="https://indieweb.org/File:indie-web-camp-2013.jpg">IndieWeb’s file page</a>, uploaded by Aaron Parecki; <a href="http://www.flickr.com/photos/aaronpk/9120799605/">original Flickr photo</a>.</figcaption>
</figure>

*It was an honor, IWC2013!*

### Historical syndication

- [IndieNews](http://news.indiewebcamp.com/post)
