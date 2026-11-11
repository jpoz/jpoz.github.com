---
title: "The Squeezed Middle"
meta_title: ""
description: "AI labs are taking the big opportunities from above, AI-built internal tools are replacing small SaaS from below. What's left is a narrow middle band."
date: 2026-10-07T05:00:00Z
image: "/images/posts/the-squeeze.webp"
categories: ["thoughts"]
authors: ["jpoz"]
tags: ["ai"]
draft: true
---

<!--
Still to do before publishing:
- "Where I'm placing my bets" needs my real answer.
- Opening/closing: did we actually build the Linear replacement, or just scope it? Adjust both to match.
- Flip draft back to true until it's ready.
-->

My coworker hates Linear.

Not in a dramatic way. Just the slow, daily kind of hate you develop for a tool you're forced to open fifty times a day. So I started wondering: what would it actually take to replace it?

We're a small team. We don't need most of what Linear does. We need issues, a few states, assignees, maybe a board view, and a way to link things to pull requests. Once I wrote that list down, the answer was almost disappointing.

It's just a web app. A pretty simple one.

A few years ago, "just a web app" still meant weeks of someone's time, plus the ongoing burden of owning it. Nobody would seriously propose building their own issue tracker. Today, with an agent doing all of the coding, it's a reasonable afternoon-to-weekend project, shaped exactly around how we work and with no per-seat bill.

That one small question changes the whole map of where the opportunities in AI are.

## The squeeze

Here's how I've started to picture it. It's the diagram at the top of this post.

At the top are the AI labs. They're taking the big, obvious opportunities, and they're taking them fast.

You used to reach for Notion. Now there's [ChatGPT Space](https://finance.yahoo.com/technology/ai/articles/openai-chatgpt-space-now-workplace-111040763.html). You used to write in Google Docs. Now there's [Claude Docs](https://www.axios.com/2026/09/16/anthropic-claude-docs-microsoft). Gamma for a deck? [Claude Slides](https://venturebeat.com/technology/anthropic-is-killing-off-cowork-and-folding-it-into-claude-launching-claude-docs-and-claude-slides). Zapier to wire your apps together? OpenAI's [Agent Builder](https://geekflare.com/news/openai-will-compete-with-n8n-and-zapier-with-new-agent-builder). An AI analyst to build your pitch books? Codex now has an [investment banking plugin](https://techcrunch.com/2026/06/02/openai-launches-new-codex-tools-for-white-collar-work/). A browser? [ChatGPT Atlas](https://www.vice.com/en/article/chatgpt-atlas-ai-browser-launches). An AI code editor? Claude Code and Codex.

Every one of those was somebody else's product category first.

At the bottom is a growing pile of small SaaS products that companies can now just build for themselves.

In between is a thin band of opportunities that neither side can easily eat.

The uncomfortable part is that both sides are moving toward the middle. Every new model release makes the labs more capable, and it makes building your own software cheaper. The squeeze tightens from both ends at once.

## From above: the labs take the big swings

Think about the AI products that felt like startup ideas two years ago. A coding assistant. A research tool that searches the web and writes you a report. Something that drafts slides, reads your email, or remembers things about you between conversations.

Most of those are features now. Features inside apps the labs already ship.

That's not an accident. The pattern is simple: if your product is "model + prompt + nice UI," it's sitting on a lab's roadmap. Maybe not this quarter. But eventually.

And the labs have every advantage in that fight.

They own the surface. Millions of people already open their apps every day. You have to convince someone to try your product. They just have to ship a button.

They pay the least for compute. You're paying retail for the same model they're serving at cost.

They see what everyone is doing. Usage tells them which use cases matter, which is a pretty good way to decide what to build next.

And they build horizontally. A lab isn't trying to win one vertical. Anything general enough to be useful to lots of people is in scope.

Mac developers used to call this getting Sherlocked. You build a great utility, and then Apple ships it as a built-in feature. The difference now is the pace. Apple did it once a year. The labs do it every few months.

So if your pitch is "a better general-purpose assistant for X," be honest about what you're building. It might be their next feature.

## From below: small SaaS gets rebuilt in-house

Now go back to the Linear question.

Linear is good software. That's not the point. The point is that it's built for everyone, and we're not everyone. We're a small team with a specific way of working and a short list of needs.

The same is true for a lot of SaaS. Take a CRM. Most companies don't need a platform. They need a few tables, a pipeline view, some automations, and maybe a weekly report. An agent can build exactly that, around exactly how they sell, in a day or two.

The list of candidates is long: form builders, internal dashboards, project trackers, scheduling tools, lightweight ticketing, reporting. Anything where the product is mostly CRUD, plus some workflow, plus a UI.

And it's not just me wondering. In McKinsey's 2026 State of AI survey, [32% of organizations](https://startupfortune.com/mckinsey-survey-finds-32-of-firms-now-building-software-instead-of-buying-it/) said they'd decided against buying at least one software product and built it with AI coding tools instead. In tech companies, it was 41%. Retool's build vs. buy research found 35% of teams had already replaced at least one SaaS tool with something they built themselves.

It shows up at the small end too. One founder [cancelled a €360/year scheduling tool](https://hackernoon.com/why-i-cancelled-a-euro360year-saas-subscription-with-claude-code) in a single evening. Claude Code wired their own booking engine into the demo funnel, four pull requests, and the subscription was gone.

And at the big end, even the labs are doing it. Anthropic just wrote about [building their own source control](https://www.anthropic.com/engineering/redesigning-source-control): a new version control system to replace git for their monorepo, their own code review tool, and their own code search. A team of seven did it in five months. Claude wrote most of the code. In their words, the engineers' main job was often to tell Claude "no."

Their reason wasn't that git or their tools were bad. It was that they were built for humans. When agents are landing over 30,000 merges a day, "good enough for everyone" stops being good enough.

Investors noticed. Early this year, after Anthropic released Claude Cowork, software stocks sold off so hard that people started calling it the [SaaSpocalypse](https://techcrunch.com/?p=3097359). Hundreds of billions in market value, gone in days, on the fear that customers would stop buying seats.

What changed is the math.

The cost of building collapsed. The cost of buying didn't move. You still pay per seat. You still work around features that don't fit. You still fight integrations, and you still get locked in.

For most of software history, custom software was the luxury option. You built your own once you were big enough to afford it. Now it's often the cheap option.

To be fair, building isn't free. Somebody has to own the thing. It needs updates. The person who built it might leave. Those costs are real, and anyone who says otherwise hasn't maintained an internal tool. But the agents that write the code are getting pretty good at maintaining it too, and the gap between owning software and renting it is a lot smaller than it used to be.

## The middle band: what survives

So what's left? If the labs take the general stuff and companies build the simple stuff themselves, where are the real opportunities?

I think they share a few traits. You don't need all of them, but you probably need at least one.

**Proprietary or compounding data.** If your product gets better with every customer, no single company can build it for themselves. Their internal tool only learns from them. Yours learns from everyone.

Look at what happened with Codex's finance plugins. OpenAI went straight at the AI analyst layer, the pitch books and comps and diligence summaries. But it didn't try to replace the data underneath. It [partnered](https://mlq.ai/news/openai-launches-six-codex-plug-ins-targeting-investment-banking-equity-research-and-sales/) with FactSet, S&P Global, PitchBook, LSEG, and Moody's. The lab squeezed the workflow. The data providers got a new distribution channel.

**Multi-party coordination.** You can build your own CRM. You can't build your own payments network. Marketplaces, networks, and anything that spans multiple companies needs someone in the middle, and an internal tool can't be that.

**Liability and trust.** In health, finance, legal, insurance, and compliance, customers aren't just buying software. They're buying someone to be accountable: certifications, audits, and somebody to call when things go wrong. That doesn't come out of an afternoon with an agent.

**Hard contact with the real world.** Hardware, logistics, physical operations, gnarly legacy integrations. The code might be easy. The world isn't.

**Deep domain workflows where correctness is the product.** When being 95% right is worthless, the moat isn't the model. It's the evals, the edge cases, and the years spent learning what "right" means in that domain.

**Infrastructure for agents.** If everyone is building with agents, the agents need things. Sandboxes to run in. Evals to check them. Observability to debug them. Permissions to keep them in check. Ways to pay for stuff. Classic picks and shovels.

**Selling the outcome, not the tool.** Don't sell a seat to the person doing the work. Do the work. If you sell finished outcomes, a better model improves your margins instead of making you obsolete.

## A quick test for any idea

When I look at an idea now, I run it through a few questions:

1. When the next model comes out, does this get better, or does it become obsolete?
2. Could a decent engineer with an agent build 80% of it over a weekend?
3. Does it get better with more customers?
4. Is there liability, regulation, or coordination that someone has to own?
5. Is it sitting on a lab's natural roadmap?

The answers you want are: better, no, yes, yes, no.

Most ideas fail at least one. That's fine. But if an idea fails the first two, I'd think hard before spending a year on it.

## Where this could be wrong

The middle band moves. What's safe today might not be in 18 months. Models keep getting better, and some of what feels like a moat now will turn out to be a speed bump.

Enterprises will keep buying SaaS longer than people like me expect. Procurement is slow, compliance is real, and there's a lot of value in having a vendor to blame. Even Klarna, the poster child for "we replaced Salesforce with AI," [later clarified](https://www.cxtoday.com/?p=65960) that it moved to a mix of other SaaS tools and in-house software.

Plenty of these internal tools will rot. Somebody builds a CRM over a weekend, leaves the company, and now nobody knows how it works. That might turn into its own market: maintaining all the software companies built for themselves.

And the labs can't do everything. They have to choose, just like everyone else. Some big opportunities will sit there for a while simply because the labs are busy.

## Where I'm placing my bets

**[TODO: What am I building, avoiding, or watching? A few short paragraphs in the same voice. This is what makes the post feel earned instead of abstract.]**

## Build the thing the next model makes better

Back to Linear. Whether we actually replace it isn't really the interesting part. The interesting part is that it's suddenly a reasonable question to ask, and a lot of companies are asking it about a lot of tools.

The middle band is narrow. But it's deep. The companies that win there will be the ones that get stronger every time the models improve, not weaker.

So build the thing the next model release makes better. Not the thing it makes unnecessary.
