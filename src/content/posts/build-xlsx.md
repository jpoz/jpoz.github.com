---
title: "Building a Spreadsheet Formula Engine in a Weekend"
meta_title: ""
description: "How I orchestrated AI agents in parallel loops to build an XLSX calculation engine with 100+ formula functions in Go, from scratch, in a weekend."
date: 2026-03-22T03:30:00Z
image: "/images/posts/xlsx-ai.jpg"
categories: ["codez"]
authors: ["jpoz"]
tags: ["ai", "go", "spreadsheets"]
draft: false
---

Somewhere around 2 billion people use spreadsheets. Over half of all businesses worldwide run on it. The average office worker spends [38% of their time](https://www.acuitytraining.co.uk/news-tips/new-excel-facts-statistics/) in a spreadsheet. Bloomberg called it a ["multitrillion-dollar empire."](https://www.bloomberg.com/features/2025-microsoft-excel-ai-software/) When people talk about the software that runs the global economy, they usually mean databases or ERP systems. They're wrong. It's spreadsheets. It's always been spreadsheets.

But what does it take to make `=SUMPRODUCT((A1:A100="Yes")*(B1:B100))` actually work? Building a proper calculation engine for spreadsheets (one that can actually evaluate formulas) has always been a massive undertaking. The spec is enormous, the edge cases are endless, and the function library alone runs to hundreds of entries. It's the kind of project that teams spend years on. Which is why almost nobody has done it well outside of Microsoft and Google. But AI changed the math on what's possible for a solo developer with a free weekend.

I built the base of [werkbook](https://github.com/jpoz/werkbook), a library that can read an XLSX file, evaluate its formulas, and write the results back... in a weekend. No shelling out to Excel or LibreOffice. It has a proper lexer, parser, bytecode compiler, virtual machine, hundreds of function implementations.

Here's how the weekend went.

## Friday Night: The Architecture

The formula engine is a classic compiler pipeline, and getting the architecture right matters more than anything downstream. AI is great at filling in patterns, but it needs the patterns to exist first, and it needs someone deciding which patterns to use.

I set up four stages, working with AI to build each one but staying tight on every decision:

1. **Lexer**: tokenize `SUM(A1:B12)` into meaningful pieces
2. **Parser**: handle operator precedence and turn tokens into an AST
3. **Compiler**: compile the AST into stack-based instructions
4. **VM Evaluator**: execute the bytecode against actual cell data

AI was writing the code, but I was driving: what the instruction set should look like, how the stack should handle different value types, where to draw boundaries between stages. When something wasn't right, I'd course-correct immediately rather than letting bad decisions compound. With the skeleton in place and a handful of functions working end-to-end (basic arithmetic, `SUM`, `IF`), I had the scaffolding that AI could build on more autonomously.

I also pointed AI at the [XLSX file format](https://www.loc.gov/preservation/digital/formats/fdd/fdd000398.shtml), which is an open standard (it's just XML files in a zip), and had it build out the read/write capability: parsing the XML, resolving shared strings, handling styles. Tedious, spec-heavy work that AI handles well. Tedious, spec-heavy work that AI handles well.

This is still the part of the job that's entirely human. The problem was loosely defined, "I want server-side spreadsheet calculation in Go," and it was on me to turn that into a specific architecture. What stages? What data structures? What tradeoffs? AI can't make those calls because it doesn't know what you're optimizing for.

## Saturday: The Loop

With the architecture solid and a few reference implementations to learn from, the next step was obvious: there are hundreds of spreadsheet functions, and they mostly follow the same shape. Parse arguments, validate types, compute result, handle errors.

I set up an AI agent in a loop:

1. Find a formula function that isn't implemented yet
2. Implement it following the patterns established by the existing functions
3. Write tests for it
4. Move on to the next one

Every function got its own tests: table-driven cases covering normal inputs, edge cases, error conditions, and type coercion. The agent would build a mock spreadsheet in memory, evaluate the formula, and check the result. By the end of the weekend the test suite had thousands of cases across math, text, date, statistical, financial, lookup, and engineering functions.

This is where AI shines. Function #50 is structurally similar to function #5. The agent could look at how `AVERAGE` was implemented and produce `AVERAGEIF`. It could see how `LEFT` worked and build `RIGHT`, `MID`, `SUBSTITUTE`. The repetitive middle is AI's sweet spot.

By Saturday afternoon it was churning through math functions, statistical functions, text functions, date functions, logical functions, financial functions. The weirder corners of the spec too: Bessel functions, complex number arithmetic, the full `TEXT()` number formatting engine.

Before AI, this is the part that would have taken months. Not because any single function is hard, but because there are *so many of them*. The tedium is the bottleneck, not the complexity. AI removed the tedium entirely.

## Sunday: Real-World Validation

Unit tests are one thing. Real spreadsheets from real people are another. On Sunday I went hunting for xlsx files in the wild: government budget templates, corporate financial models, inventory trackers, project schedules, anything I could find shared publicly online. These are messy. They use formulas in ways no spec author anticipated. They're the real test.

Here's the trick that made this whole approach possible, and I think it's the most interesting part of the project: every xlsx file already contains its own answer key.

When someone saves a spreadsheet, the application writes the last-computed result into every formula cell. Those cached values sit right there in the XML. So you don't need a copy of the spreadsheet application to know what the right answer is. You just open the file, recalculate every formula with werkbook, and diff your results against the cached values. Any mismatch is a bug. You're testing against the same application that billions of people use every day, without ever running it.

I pointed an agent at the pile of downloaded spreadsheets and had it run this comparison loop: open a file, recalculate everything, report any cell where werkbook's result didn't match the cached value, move on to the next file. Hundreds of spreadsheets, thousands of formulas, all validated automatically.

It surfaced real issues. The best one: date serial number handling didn't account for the infamous 1900 leap year bug, where spreadsheets treat February 29, 1900 as a real date (it isn't) for backwards compatibility with Lotus 1-2-3. There were locale-sensitive number formatting quirks, functions that silently dropped precision on large values, and edge cases in how boolean values get coerced in arithmetic contexts. Then there's floating point: `0.1 + 0.2 - 0.3` doesn't equal `0` in IEEE 754 math, but spreadsheets round to 15 significant figures internally so it does. Werkbook had to learn to do the same. The kind of stuff you'd never catch with synthetic tests because you'd never think to write them.

## What I Ended Up With

By Sunday night: over 100 formula functions implemented, tested, and handling edge cases. Not a toy, something actually usable. You could hand it a real spreadsheet from a real business, change some input cells, recalculate, and get correct results back.

The conditional aggregates work (`SUMIFS`, `COUNTIFS` with wildcard matching). The lookup functions work (`VLOOKUP`, `INDEX`/`MATCH`). Dynamic array formulas work (`UNIQUE`, `FILTER`, `SORT` with spill ranges). Even the financial functions that nobody understands work.

## What's Happened Since

The weekend was a starting point, not the finish line. I've kept working on werkbook, and it now has 446 spreadsheet formula functions. I also built a website for it at [werkbook.io](https://werkbook.io), again with massive help from AI.

But the problems have gotten harder. The weekend work was mostly about breadth: implement a lot of functions, cover the common cases. The work since has been about depth, the kind of subtle, interconnected bugs that only surface when you push the engine into the spec's weirder corners.

Dynamic arrays and spill ranges have been the biggest headache. In a spreadsheet, a formula like `=FILTER(B:B, A:A="yes")` can return multiple values that "spill" into adjacent cells. Sounds simple. It is not.

For example: `SUM(B:B)` was only seeing the anchor cell of a spill, ignoring the values that spilled below it. So a FILTER that produced ten results would only contribute one value to a SUM over the same column. The fix required dynamically expanding evaluation bounds when spill arrays extend past the original range, while being careful not to expand unnecessarily and trigger circular references from unrelated formulas. One bug like that touches range evaluation, dependency tracking, and cycle detection all at once.

These aren't the kind of problems AI solves on its own. They require understanding how spreadsheets actually behave (often undocumented), reasoning about evaluation order across dependent cells, and making architectural decisions about caching and context propagation. AI is still writing most of the code, but I'm spending more time in the debugger, reading the raw XML output, and figuring out *what* correct even means before I can tell the agent to go fix it.

## The Job is Different Now. And the Same.

The way I spent my time that weekend would look alien to me five years ago. I wrote maybe 20% of the code by lines. I spent most of my time designing systems (architecture, agent workflows, verification strategies) and then reviewing what those systems produced. My job was to know what "correct" looks like and build processes that could get there.

But the job felt familiar. A developer's job has always been to take a complicated, loosely defined problem and turn it into something very specific that actually works. That hasn't changed. What's changed is where you spend your time.

Zoom out, and the job description hasn't changed at all. Someone said "I need server-side spreadsheet calculation," a vague, complicated problem. I turned it into a specific, working solution. That's what developers do. That's what we've always done. We take an ambiguous need and make it concrete.

What's different is the leverage. The hard part of this project was never "how do I implement `AVERAGEIF`." It was "how do I structure this so that hundreds of functions can be implemented correctly, and how do I know they're correct?" The architecture. The verification system. The taste for what matters.

AI didn't change the job. It changed where the bottleneck is. It used to be writing the code. Now it's knowing what to build and knowing when it's right. The developers who thrive with these tools won't be the ones who write the most code. They'll be the ones who can look at a messy, underspecified problem and see the system that solves it.

That part is still entirely human. And I don't think that's changing any time soon.
