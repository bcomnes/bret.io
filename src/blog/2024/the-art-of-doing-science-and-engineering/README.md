---
layout: "book-review"
title: "The Art of Doing Science and Engineering"
subtitle: "Learning To Learn: A few quotes and thoughts"
publishDate: "2024-02-13T18:24:49.707Z"
readDate: "2023-12-02T20:49:41.713Z"
serif: true
description: "A bunch of choice quotes from Richard W. Hamming's book"
image: ./img/og.jpeg

book:
  title: "The art of doing science and engineering : Learning to Learn"
  author: "Richard W. Hamming"
  publisher: "Stripe Press"
  publishDate: "2020"
  reference:
    amazon: "https://amzn.to/3TsRb4i"
    worldcat: "https://search.worldcat.org/title/1227304365"
  ISBN13: "9781732265172"
  ISBN: "1732265178"
  OCLC: "1227304365"
review:
  rating: 4
---

<figure>
  <a href="./img/cover.jpeg">
    <img loading="auto" src="./img/cover.jpeg" alt="Book Cover">
  </a>
  <figcaption>The art of doing science and engineering : Learning to Learn by Richard W. Hamming</figcaption>
</figure>

Richard Hamming's "The Art of Doing Science and Engineering" is a book capturing the lessons he taught in a course he gave at the U.S. Navy Postgraduate School in Monterey, CA.
He characterizes what he was trying to teach was "style" of thinking in science and engineering.

Having a physics degree myself, and also finding myself periodically ruminating on the agony of professional software development and hoping to find some overlap between my professional field and Hamming's life experience, I gave it a read.

The book is filled with nuggets of wisdom and illustrates a career of move-the-needle science and engineering at Bell Labs.
I didn't personally find much value in many of the algebraic walk-through's of various topics like information theory, but learning about how Hamming discovered error correcting codes definitely was interesting and worth a read.

The highlight of book comes in the second half where he includes interesting stories, analogies and observations on nearly every page. Below are my highlights I pulled while reading.

## On What Makes Good Design

> That brings up another point, which is now well recognized in software for computers but which applies to hardware too. Things change so fast that part of the system design problem is that the system will be constantly upgraded in ways you do not now know in any detail! Flexibility must be part of the modern design of things and processes. Flexibility built into the design means not only will you be better able to handle the changes which will come after installation, but it also contributes to your own work as the small changes which inevitably arise both in the later stages of design and in the field installation of the system...
>
> Thus rule two:
>
> **Part of systems engineering design is to prepare for changes so they can be gracefully made and still not degrade the other parts.**
>
> -- p.367

This quote is my favorite out of the entire book.
It feels like a constant fight in software engineering between the impulse to lock down runtime versions, specific dependency versions, and other environmental factors versus developing software in such a way that accommodates wide variance in all of these different component factors.
Both approaches argue reliability and flexibility, however which approach actually tests for it?

In my experience, the tighter the runtime dependency specifications, the faster fragility spreads, and it's satisfying to hear Hamming's experience echo this observation. Sadly though, his observation that those writing software will universally understand this simply hasn't held up.

> Good design protects you from the need for too many highly accurate components in the system. But such design principals are still, to this date, ill understood and need to be researched extensively. Not that good designers do not understand this intuitively, merely it is not easily incorporated into the design methods you were thought in school.
>
> Good minds are still need in spite of all the computing tools we have developed. The best mind will be the one who gets the principle into the design methods taught so it will be automatically available for lesser minds!.
>
> -- p.268

Here Hamming is describing H.S. Black's feedback circuit's tolerance for low accuracy components as what constitutes good design. I agree! Technology that works at any scale, made out of commodity parts with minimal runtime requirements tends to be what is most useful across the longest amount of time.

## On Committees

> Committee decisions, which tend to diffuse responsibility, are seldom the best in practice—most of the time they represent a compromise which has none of the virtues of any path and tends to end in mediocrity.
>
> -- p.274

I appreciated his observations on committees, and their tendency to launder responsibility.
They serve a purpose, but its important to understand their nature.


## On Data and Observation

> The Hawthorne effect strongly suggests the proper teaching method will always to be in a state of experimental change, and it hardly matters just what is done; all that matters is both the professor and the students believe in the change.
>
> -- p.288

> It has been my experience, as well as the experience of many others who have looked, that data is generally much less accurate than it is advertised to be. This is not a trivial point—we depend on initial data for many decisions, as well as for the input data for simulations which result in decisions.
>
> -- p.345

> Averages are meaningful for homogeneous groups (homogeneous with respect to the actions that may later be taken), but for diverse groups averages are often meaningless. As earlier remarked, the average adult has one breast and one testicle, but that does not represent the average person in our society.
>
> -- p.356

> You may think the title means that if you measure accurately you will get an accurate measurement, and if not then not, but it refers to a much more subtle thing—the way you choose to measure things controls to a large extent what happens. I repeat the story Eddington told about the fishermen who went fishing with a net. They examined the size of the fish they caught and concluded there was a minimum size to the fish in the sea. The instrument you use clearly affects what you see.
>
> -- p.373


Intuitively I think many people who attempt to measure anything understand that their approach reflects in the results to some degree.
I hadn't heard of the [Hawthorne effect](https://en.wikipedia.org/wiki/Hawthorne_effect) before, but intuitively it makes sense.

People with an idea on how to improve something implement their idea and it works, because they want it to work and allow the effects to be fully effective.
Someone else is prescribed this idea or brought into the fold where the idea is implemented and the benefits of the idea evaporate.

I've long suspected that in the context of professional software development, where highly unscrutinized benchmarks and soft data are the norm, people start with an opinion or theory and work back to data that supports it.
Could it just be that people need to believe that working in a certain way is necessary for them to work optimally? Could it be "data" is often just a work function used to out maneuver competing ideas?

Anyway, just another thing to factor for when data is plopped in your lap.

## On Theory

> Moral: there need not be a unique form of a theory to account for a body of observations; instead, two rather different-looking theories can agree on all the predicted details. You cannot go from a body of data to a unique theory! I noted this in the last chapter.
>
> --p.314

> Heisenberg derived the uncertainty principle that conjugate variables, meaning Fourier transforms, obeyed a condition in which the product of the uncertainties of the two had to exceed a fixed number, involving Planck's constant. I earlier commented, Chapter 17, this is a theorem in Fourier transforms-any linear theory must have a corresponding uncertainty principle, but among physicists it is still widely regarded as a physical effect from nature rather than a mathematical effect of the model.
>
> --p.316

I appreciate Hamming suggesting that some of our understanding of physical reality could be a byproduct of the model being used to describe it.
It's not exactly examined closely in undergraduate or graduate quantum mechanics, and I find it interesting Hamming, who's clearly highly intuitive with modeling, also raises this question.

## Predictions

> Let me now turn to predictions of the immediate future. It is fairly clear that in time "drop lines" from the street to the house (they may actually be buried, but will probably still be called "drop lines") will be fiber optics. Once a fiber-optic wire is installed, then potentially you have available almost all the information you could possibly want, including TV and radio, and possibly newspaper articles selected according to your interest profile (you pay the printing bill which occurs in your own house). There would be no need for separate information channels most of the time. At your end of the fiber there are one or more digital filters. Which channel you want, the phone, radio, or TV, can be selected by you much as you do now, and the channel is determined by the numbers put into the digital filter-thus the same filter can be multipurpose, if you wish. You will need one filter for each channel you wish to use at the same time (though it is possible a single time-sharing filter would be available) and each filter would be of the same standard design. Alternately, the filters may come with the particular equipment you buy.
>
> -- p.284-285

Here Hamming is predicting the internet. He got very close, and it's interesting to think that these signals would all just be piped to your house in a bundle you you pay for a filter to unlock access to the ones you want. Hey Cable TV worked that for a long time!

## On Leadership

> But a lot of evidence on what enabled people to make big contributions points to the conclusion that a famous prof was a terrible lecturer and the students had to work hard to learn it for themselves! I again suggest a rule:
>
> **What you learn from others you can use to follow;**
>
> **What you learn for yourself you can use to lead.**
>
> -- p.292

Learn by doing, not by following.

> **What you did to become successful is likely to be counterproductive when applied at a later date.**
>
> -- p.342

It's easy to blame changing trends in software development for the disgustingly short half-life of knowledge regarding development patterns and tools, but I think it's probably just the nature of knowledge based work.
Operating by yourself may be effective and work well, but its not a recipe for success at any given moment in time.

> A man was examining the construction of a cathedral. He asked a stonemason what he was doing chipping the stones, and the mason replied, "I am making stones." He asked a stone carver what he was doing; "I am carving a gargoyle." And so it went; each person said in detail what they were doing. Finally he came to an old woman who was sweeping the ground. She said, "I am helping build a cathedral."
> If, on the average campus, you asked a sample of professors what they were going to do in the next class hour, you would hear they were going to "teach partial fractions," "show how to find the moments of a normal distribution," "explain Young's modulus and how to measure it," etc. I doubt you would often hear a professor say, "I am going to educate the students and prepare them for their future careers."
> This myopic view is the chief characteristic of a bureaucrat. To rise to the top you should have the larger view—at least when you get there.
>
> -- p.360

Software bureaucrats aplenty. Really easy to fall into this role.

> I must come to the topic of "selling" new ideas. You must master three things to do this (Chapter 5):
>
> 1. Giving formal presentations,
> 2. Producing written reports, and
> 3. Mastering the art of informal presentations as they happen to occur.
>
> All three are essential—you must learn to sell your ideas, not by propaganda, but by force of clear presentation. I am sorry to have to point this out; many scientists and others think good ideas will win out automatically and need not be carefully presented. They are wrong;
>
> -- p.396

One thing I regret over the last 10 years of my career is not writing down more insights I have learned through experience.
Ideas simply don't transmit if they aren't written down or put into some consumable format like video or audio.
Nearly every annoying tool or developer trend you are forced to use is in play because it communicated the idea through blogs, videos and conference talks.
And those who watched echoed these messages.

## On Experts

> **An expert is one who knows everything about nothing; a generalist knows nothing about everything.**
>
> In an argument between a specialist and a generalist, the expert usually wins by simply (1) using unintelligible jargon, and (2) citing their specialist results, which are often completely irrelevant to the discussion. The expert is, therefore, a potent factor to be reckoned with in our society. Since experts both are necessary and also at times do great harm in blocking significant progress, they need to be examined closely. All too often the expert misunderstands the problem at hand, but the generalist cannot carry though their side to completion. The person who thinks they understand the problem and does not is usually more of a curse (blockage) than the person who knows they do not understand the problem.
>
> -- p.333

Understand when you are generalist and a specialist.

> Experts, in looking at something new, always bring their expertise with them, as well as their particular way of looking at things. Whatever does not fit into their frame of reference is dismissed, not seen, or forced to fit into their beliefs. Thus really new ideas seldom arise from the experts in the field. You cannot blame them too much, since it is more economical to try the old, successful ways before trying to find new ways of looking and thinking.
>
>   **If an expert says something can be done he is probably correct, but if he says it is impossible then consider getting another opinion.**
>
> -- p.336

Anyone wading into a technical field will encounter experts at every turn.
They have valuable information, but they are also going to give you dated, myopic advice (gatekeeping?).
I like Hamming's framing here and it reflects my experience when weighing expert opinion.

> In some respects the expert is the curse of our society, with their assurance they know everything, and without the decent humility to consider they might be wrong. Where the question looms so important, I suggested to you long ago to use in an argument, "What would you accept as evidence you are wrong?" Ask yourself regularly, "Why do I believe whatever I do?" Especially in the areas where you are so sure you know, the area of the paradigms of your field.
>
> -- p.340

I love this exercise. It will also drive you crazy. Tread carefully.

> Systems engineering is indeed a fascinating profession, but one which is hard to practice. There is a great need for real systems engineers, as well as perhaps a greater need to get rid of those who merely talk a good story but cannot play the game effectively.
>
> -- p.372

Controversial, harsh, but true.

## The Binding

The last thing I want to recognize is the beautiful cloth resin binding and quality printing of the book. Bravo Stripe Press for still producing beautiful artifacts at affordable pricing in the age of print on demand.
