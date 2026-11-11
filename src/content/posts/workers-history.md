---
title: Who gets the money when machines get faster?
meta_title: ""
description: "What history's productivity revolutions tell us about AI and the future of software engineering"
date: 2026-02-16T05:00:00Z
image: "/images/posts/4C6F3CC7-283C-4DBD-A7FA-F5B57D53DDD6.webp"
categories: ["thoughts"]
authors: ["jpoz"]
tags: ["ai"]
draft: false
---


### What history's productivity revolutions tell us about AI and the future of software engineering

Every few generations, a tool comes along that makes a job dramatically more productive. A farmer feeds 150 people instead of 4. A single operator replaces a room full of typesetters. A container crane does the work of a hundred longshoremen.

Today, software engineers are living through their version of this moment. AI coding assistants are making individual developers measurably more productive. In a 2023 trial run by Microsoft Research, developers using GitHub Copilot completed a coding task 55.8% faster.[^1] A larger 2024 study spanning Microsoft and Accenture found productivity boosts of 8-22% depending on the company.[^2] As of 2025, 84% of developers are using or plan to use AI tools according to Stack Overflow's developer survey,[^3] and roughly 41% of all new code is AI-generated.[^4] The gains are unevenly distributed, with less experienced developers consistently seeing the largest boosts while senior engineers see more modest improvements, but the direction is clear.

But "more productive" has never been a simple story. Productivity gains always flow somewhere: to the worker, the company, or the consumer. History has a lot to say about which way they go, and why. When you look across the major productivity revolutions of the past two centuries, a pattern emerges: the gains don't land randomly. Who wins depends on power, institutions, and the nature of the technology itself.

-----

## When capital wins: the long shadow of the loom

The darkest outcomes for workers share a common signature: technology that makes the individual replaceable. When that happens, capital captures nearly everything.

The textile revolution set the template. Between 1780 and 1840, output per worker in Britain rose by 46%, but real wages for the working class increased by only 12%.[^5] Economist Robert C. Allen coined the term "Engels' Pause" to describe this phenomenon: a sustained period where the economy grows but workers see almost none of the benefit, with nearly all the gains accruing to capital instead. The profit rate doubled. Capital's share of national income expanded at the expense of both labor and land. Friedrich Engels himself, the 24-year-old son of a textile industrialist, walked the streets of Manchester in 1842 and found mortality in industrial cities running at 1 in 30, compared to 1 in 45 in the countryside.[^6] Child mortality in the industrial town of Carlisle rose measurably after the introduction of mills. The skilled cottage weavers who had once commanded decent livelihoods found themselves redundant, replaced by factory hands who needed only enough skill to tend a machine.

The Bessemer process told the same story in steel. Andrew Carnegie's adoption of new steelmaking technology made production dramatically cheaper, with the price of rolled-steel products dropping from $35 a gross ton to $22 between 1890 and 1892.[^7] But the workers didn't share in the windfall. When the Amalgamated Association of Iron and Steel Workers' contract came up for renewal in 1892, Carnegie's operations manager Henry Clay Frick proposed an 18% wage cut. The skilled workers at Homestead had been among the best-paid in the industry, and Frick viewed that as the problem. "The mills have never been able to turn out the product they should, owing to being held back by the Amalgamated men," he wrote to Carnegie. Carnegie, publicly pro-labor, privately told Frick to break the union: "The Firm has decided that the minority must give way to the majority."

What followed was one of the bloodiest labor conflicts in American history. Three hundred Pinkerton agents arrived on barges. A twelve-hour gun battle left seven workers dead. The National Guard was called in with 8,500 troops. The union lost.[^8] In the fifteen years after Homestead, daily wages for skilled steelworkers at the plant fell by a fifth while shifts lengthened from eight hours to twelve.[^9] Amalgamated membership collapsed from 24,000 to 8,000 within three years. Carnegie Steel's profits, meanwhile, rose to a staggering $106 million in the nine years after the strike.[^10] Union organizing among steelworkers was effectively crushed for 26 years, until the final months of World War I.

The pattern didn't end in the 19th century. Between 2000 and 2020, manufacturing robots arrived in American factories, and MIT economists Daron Acemoglu and Pascual Restrepo measured the damage: each additional robot replaced roughly 3.3 workers nationally and 6.6 locally.[^11] Michigan auto employment fell from 91,000 to 49,000, a 46% decline. But here's what makes this case darker than Carnegie's steel mills: the productivity gains were surprisingly small. Acemoglu found that automation accounted for half the increase in US wage inequality between 1980 and 2016, while total factor productivity grew by only 3.4% over those 36 years.[^12] He calls this "so-so automation," technology that performs only marginally better than humans but costs less, allowing capital to capture savings through labor replacement rather than genuine productivity improvement. The workers lost their jobs. The economy didn't get dramatically more productive. It just got cheaper.

The common thread across centuries: technology reduced workers' leverage by making them easier to replace. The spinning jenny didn't need a skilled weaver. The Bessemer process didn't need a craftsman with decades of experience. The factory robot didn't need a union member with benefits. When the irreplaceable becomes replaceable, capital moves in. The gains flow not to the person operating the machine, but to the person who owns it.

For software engineers, this is the bear case. And it has a specific, data-driven shape. Across multiple studies, less experienced developers consistently see the largest gains from AI coding tools, while senior developers see more modest improvements. Erik Brynjolfsson's landmark study of AI in customer service found the same pattern: less-skilled workers improved dramatically, while the most experienced saw smaller gains.[^13] This is precisely the dynamic that preceded the Engels' Pause in textiles: technology that disproportionately boosts the output of less-skilled workers compresses the skill premium. If a junior engineer with AI tools can produce 80% of what a senior engineer produces, the senior engineer's bargaining position erodes, even if they're still more productive in absolute terms. The same dynamic that let Frick tell the Amalgamated workers they were expendable could let a tech company's CFO reach the same conclusion about a layer of mid-level engineers.

## When workers win: the power to say no

But capital doesn't always capture the gains. In a handful of cases, workers held on and even thrived. These cases look nothing like the textile mills or the Homestead steel plant, and the reasons why are instructive.

Start with surgery. Surgeons are one of the only professions where productivity-enhancing technology (anesthesia, antiseptics, imaging, robotics) consistently made the workers *richer* rather than poorer. The key difference is that the technology was complementary: better tools made the surgeon more capable without replacing the surgeon's judgment. The value stayed in the person, not the machine.

But complementary technology alone wasn't enough. Surgeons also built institutional power that goes far beyond anything a union could achieve. The AMA didn't just negotiate for better wages. It controlled the pipeline of who could become a surgeon in the first place. In the 1980s and 1990s, the AMA lobbied to restrict the number of foreign-trained doctors entering the US and to limit training slots. In 1997, a consortium of medical organizations including the AMA recommended reducing residency positions by 25%, from roughly 25,000 slots down to 19,000, to prevent what they warned was an impending "physician oversupply." Congress froze Medicare's training funding that same year in the Balanced Budget Act, capping the number of residency slots each hospital could fill at 1996 levels.[^14] That cap remained essentially unchanged for over 25 years, even as the US population grew by 70 million. Medical school enrollment has risen 52% since 2002, but residency positions haven't kept pace.[^15] The average applicant now submits 73 applications, and each slot receives more than 60. The AMA has spent an average of $18 million per year on lobbying between 1998 and 2020.[^16] Surgeons didn't just unionize. They became the gatekeepers of their own profession.

The Linotype operators pulled off something similar, if more modestly and more temporarily. When Ottmar Mergenthaler patented the Linotype in 1886, a machine that let a single operator set 6,000 characters per hour (many times faster than a hand compositor), the International Typographical Union didn't resist.[^17] Instead, it absorbed the new technology into its sphere of control. The ITU controlled apprenticeships, mandated skill certifications, and insisted on operator-friendly machine features through collective bargaining. Membership surged from about 5,000 in the mid-1880s to over 30,000 by 1900, peaking at 100,000 in the 1960s. The ITU won a 48-hour workweek and a standard wage scale as early as 1897. During the Great Depression, it pioneered the 40-hour workweek across the printing industry, an initiative that eventually became federal law.

For decades, Linotype operators captured a real share of the productivity gains. The machine was complex enough that operating it well was a genuine skill, and the union ensured that complexity translated into wages and job security.

The West Coast longshoremen took perhaps the most calculated gamble of all. Before containerization, loading a ship was backbreaking work controlled entirely by the ILWU through its hiring halls. Eight-man crews were the norm, and the union had fought strike after strike (most famously the 1934 Pacific Coast strike that shut down every port) to maintain that control.[^18] Then containers arrived, and the tonnage of cargo moved per hour per worker jumped from 1.5 tons to 37.5 tons. Harry Bridges, the Australian-born president of the ILWU, faced a choice: resist the technology and lose, or negotiate the terms of its arrival.

On October 18, 1960, Bridges signed the Mechanization and Modernization Agreement with the Pacific Maritime Association.[^19] The deal was stark: the union would accept containerization without interference. In exchange, fully registered union members got guaranteed employment, shortened work weeks, and early retirement bonuses. By 1966, a $13 million M&M fund had accumulated, and the union paid $1,200 bonuses to all 10,000 full-time longshoremen on the coast. Subsequent contracts raised lump-sum retirement bonuses to $13,000. The surviving longshoremen became, and remain, a well-compensated labor aristocracy earning six figures.

What do surgeons, Linotype operators, and longshoremen have in common? Three things. First, the technology complemented their skills rather than replacing them, at least for a time. Second, they organized and controlled chokepoints: the AMA controlled medical school accreditation, the ITU controlled hiring halls and apprenticeships, the ILWU controlled physical ports. Third, they couldn't be easily offshored or replaced by cheaper labor elsewhere. You can't outsource an appendectomy, you couldn't fax a newspaper page across the ocean in 1920, and you can't move the Port of Oakland to a cheaper jurisdiction.

But there's a crucial caveat embedded in this hopeful story. The Linotype operators' victory was temporary. Desktop publishing arrived in the 1980s, and the entire profession collapsed. The ITU lost a quarter of its membership by 1980. The 1962-63 New York City newspaper strike, where Local 6 walked out for 114 days over computerized typesetting, halting seven major dailies and eliminating 5.7 million copies of daily circulation, was a $100 million last stand that only accelerated the transition.[^20] By 1986, the ITU merged into the Communications Workers of America.[^21]

And Bridges' M&M deal, for all its fame, wasn't painless. 42% of ILWU members voted against the 1966 renewal. The less-senior "B" men and casual workers bore the brunt of the cuts with no vote and no protection. Man-hours on the West Coast dropped from 26.7 million in 1966 to 19.7 million by 1970. The Bay Area workforce plunged from 5,000 to around 1,500.[^22] The 1971-72 strike, the longest in US maritime history, reflected deep rank-and-file anger. Critics noted the East Coast ILA, which fought containerization through six strikes, retained more crew per job: 18 ILA men did the work that 12 ILWU men performed.

The lesson: even when workers win, they win by accepting a smaller, richer workforce. The gains go to the survivors. Everyone else goes home.

## When it flows downstream: the consumer windfall

There's a third pattern that gets less attention, perhaps because it's less dramatic than bloody strikes or surgical wealth: sometimes the gains flow past both capital and labor and land squarely on consumers and on entirely new categories of work that didn't exist before.

Agriculture is the purest example. Farm productivity increased by roughly 40x over two centuries.[^23] The result? Food got cheap. Spectacularly, historically cheap. But neither the farmers nor the farm owners were the primary beneficiaries. Ninety percent of the farming workforce simply ceased to exist. The remaining farmers aren't poor, exactly, but they're not the ones who got rich. The value accrued to equipment manufacturers (John Deere), seed companies (Monsanto), distributors (Cargill), and grocery retailers. The real winner was every consumer who spends a smaller fraction of their income on food than any previous generation in human history.

The spreadsheet revolution followed a remarkably similar pattern, albeit in white-collar work. And it may be the most instructive parallel for what AI will do to software engineering.

The origin story is now legend: in the spring of 1978, Dan Bricklin sat in a Harvard Business School classroom watching his professor update a financial model on a blackboard ruled into rows and columns. Every time the professor changed a parameter, he had to erase and rewrite entries by hand. Bricklin realized a computer could do this instantly. He and his MIT classmate Bob Frankston built VisiCalc over the winter of 1978-79, launching it on the Apple II in October 1979 at $100.[^24]

The impact was immediate. Allen Sneider, an accountant, walked into his local computer store and became VisiCalc's first registered user. As Bricklin later recalled: if you showed VisiCalc to a programmer, he'd say "Yeah, that's neat, so what?" But if you showed it to someone who did financial work with real spreadsheets, "he'd start shaking and say, 'I spent all week doing that.'" Within a year VisiCalc was selling 12,000 copies a month. More than 25% of Apple IIs sold in 1979 were reportedly purchased just to run VisiCalc. Steve Jobs said the program propelled Apple to its success more than any other single event.

Here's the economic story that matters: VisiCalc and its successors didn't eliminate accounting. They eliminated a *specific kind* of accounting job and caused an explosion in a different kind. Since 1980, the US has lost roughly 400,000 bookkeeping and accounting clerk positions. But it has gained about 600,000 accountant and auditor jobs.[^25] The bookkeeper who maintained ledgers and performed routine calculations was automated away. The accountant who interpreted numbers, built models, and exercised judgment became more valuable, because when analysis gets cheaper to produce, you produce vastly more of it. Tim Harford, examining the data, concluded it's hard to argue that accountancy was decimated by the spreadsheet: there are more accountants than ever, merely outsourcing the arithmetic to the machine.

But the optimism of that framing conceals a harsher detail. The 400,000 displaced bookkeepers were not the 600,000 new accountants. They were different people with different educations and different credentials. The bookkeepers who lost their jobs did not retrain as financial analysts. They went elsewhere, or nowhere. The VisiCalc story is a net positive for the economy (more total jobs, more interesting work, more value created), but it was not a net positive for the people who were actually displaced. This distinction matters enormously for the AI parallel: "the industry will be fine" and "you will be fine" are not the same statement.

The gains flowed in three directions at once. Companies got leaner finance departments (good for capital). A new, larger class of analyst-accountants earned good wages doing more interesting work (good for adapters, bad for clerks). And businesses of every size gained access to financial modeling that had previously been the province of large corporations with big staffs (great for consumers and small businesses). A task that once required a team of clerks and an adding machine could be done by one person with an Apple II, which meant that the corner hardware store could now do financial projections that used to require a Fortune 500 back office.

The ATM tells an even stranger version of this story. Economist James Bessen found that in the 45 years after ATMs appeared, bank teller jobs roughly *doubled*, from about 250,000 to 500,000.[^26] ATMs reduced the cost of operating a branch: tellers per branch dropped from 20 to 13 between 1988 and 2004. But cheaper branches meant *more* branches. Urban bank branches increased 43%. Teller work shifted from counting cash to selling financial products and managing customer relationships. The technology didn't replace the worker or flow to the consumer. It made the business unit cheaper, demand expanded, and total employment grew even as the job description changed entirely. This is the Jevons Paradox at work: when you make something cheaper, you sometimes get vastly more of it.

The agriculture, spreadsheet, and ATM stories share a crucial feature: the technology didn't just make existing work faster. It made entirely new things possible. Cheap food enabled urbanization, industrialization, and every economic transformation that followed. Cheap financial analysis enabled startups, small-business growth, and the explosion of financial services. Cheap banking infrastructure enabled the branch network that brought financial services to every neighborhood. The gains weren't captured by the original workers or even the original employers. They were captured by the *next* economy that the productivity made possible.

## So which story is AI writing for software engineers?

Every one of these historical cases contains a plausible version of what's coming for the software industry. But the honest answer requires grappling with two things the simple productivity narrative ignores: the global dimension, and a specific economic theory that might be the best lens we have.

**The global dimension is already brutal.** India's median compensation for engineering roles collapsed roughly 40% in 2025, the steepest decline in the country's tech history.[^27] Indian IT services firms cut 60,000 jobs, the first mass layoffs in two decades. The Nifty IT index suffered its worst monthly decline in 18 years. The mechanism is straightforward: AI automates the routine coding, testing, and data processing that built India's $315 billion outsourcing industry. When software can perform those tasks at near-zero marginal cost regardless of geography, the labor arbitrage that once made offshore development irresistible simply evaporates. The longshoremen had geographic monopoly as a bargaining chip; you can't move the Port of Oakland. Indian IT workers do not. AI doesn't accelerate offshoring. It threatens to eliminate the economic rationale for it entirely.

**Is AI a loom, or a scalpel?** The most important question is whether AI is *substitutive* (replacing the worker's judgment, like the power loom replaced the weaver's skill) or *complementary* (amplifying the worker's judgment, like imaging technology amplified the surgeon's). The answer, inconveniently, is both. For routine tasks like generating boilerplate, writing tests, and implementing well-specified features, AI is already substitutive. For architectural decisions, novel debugging, and system design, it remains complementary. The textile workers of 1780 also had a few decades where new machines complemented their skills before making them irrelevant. The trajectory matters more than the current state.

**Do engineers have a chokepoint?** Every group of workers that captured productivity gains controlled something scarce. Surgeons controlled credentialing through the AMA's lobbying machine. Linotype operators controlled hiring halls and apprenticeships through the ITU. Longshoremen controlled physical ports that couldn't be moved or duplicated. Software engineers control... what, exactly? They have no licensing body, no union, no physical infrastructure that creates a bottleneck. Their leverage has always come from skill scarcity alone. And AI is specifically designed to reduce skill scarcity.

**The spreadsheet pattern versus the agriculture pattern.** The most optimistic model is the VisiCalc story, amplified by the ATM example: AI eliminates routine coding while creating an explosion in the total amount of software being built, and cheaper software means *more* software. The net effect is more engineering jobs, not fewer, just different ones. The scarier model is farming: AI makes building software so accessible that the value migrates entirely away from the people who write code and toward the platforms they write it on, the companies that deploy it, and the end users who consume it. Individual engineers become like individual farmers: necessary but not where the money concentrates.

**Who goes home?** Even in the best-case scenarios, some workers lose. Harry Bridges saved the "A" men and let the casuals absorb the blow. The ITU's 100,000 members dwindled to a merged remnant. The bookkeeping clerks lost their livelihoods even as a larger class of accountants emerged to take jobs they would never hold. Every productivity revolution creates a line between those who adapt and those who are displaced. The question is never "will anyone lose?" It's "how many, and how fast?"

-----

Here's what I think the evidence actually points to, and it's more specific than "several patterns at once."

The economist William Baumol observed in the 1960s that in sectors where productivity growth is difficult (live performance, healthcare, education), wages must still rise to compete with sectors where productivity *is* growing.[^28] A string quartet can't play the piece faster, but musicians' wages must keep pace with factory workers who can produce more per hour. The "stagnant" sector gets more expensive relative to everything else, even though nothing about it has changed.

Apply this to software engineering and you get a surprisingly precise prediction: if AI automates code *production* but cannot automate architectural judgment, system design, and the debugging of novel problems, then those judgment-intensive functions become Baumol's string quartet. Their relative value rises precisely because the routine work around them gets cheaper. And the early wage data is consistent with this. According to Levels.fyi's 2025 compensation report, staff engineers saw a 7.5% raise while entry-level engineers got just 1.6%.[^29]

The middle is being hollowed out. The engineers who can orchestrate AI, design systems, and exercise judgment that the machine cannot replicate are becoming more valuable, not less, like surgeons whose scalpels keep getting sharper. The engineers doing work that AI can approximate are facing the same pressure as cottage weavers after the spinning jenny, or bookkeeping clerks after VisiCalc, or Indian outsourcing firms after the cost of a line of code dropped toward zero. And the biggest winners of all may be neither group, but the companies and consumers who benefit from a world where building software is dramatically cheaper, just as the biggest winners of agricultural productivity weren't farmers or farm owners, but everyone who eats.

The historical precedent that should haunt us isn't the worst case (textiles, where capital captured everything for 60 years) or the best case (surgery, where workers controlled the gate). It's the most common case: a long, uneven transition where capital moves faster than labor, where the gains are real but unevenly distributed, and where the workers who adapt thrive while the rest discover that "more productive" and "better off" aren't the same thing.

The productivity is coming whether anyone wants it or not. The question, as always, is who gets the money when the machine gets faster.

[^1]: Sida Peng et al., "The Impact of AI on Developer Productivity: Evidence from GitHub Copilot," arXiv preprint 2302.06590, February 2023. [Link](https://arxiv.org/abs/2302.06590)

[^2]: K. Z. Cui et al., "The Effects of Generative AI on High Skilled Work: Evidence from Three Field Experiments with Software Developers," 2024. [Link](https://economics.mit.edu/sites/default/files/inline-files/draft_copilot_experiments.pdf)

[^3]: Stack Overflow, "2025 Developer Survey: AI Section." [Link](https://survey.stackoverflow.co/2025/ai/)

[^4]: GitHub / Thomas Dohmke, public statements on GitHub Copilot usage data, 2024-2025. [Link](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/)

[^5]: Robert C. Allen, "Engels' Pause: Technical Change, Capital Accumulation, and Inequality in the British Industrial Revolution," *Explorations in Economic History*, Vol. 46, No. 4, pp. 418-435, 2009. [Link](https://www.nuff.ox.ac.uk/Users/Allen/engelspause.pdf)

[^6]: Friedrich Engels, *The Condition of the Working Class in England*, 1845. [Link](https://www.gutenberg.org/ebooks/17306)

[^7]: Paul Krause, *The Battle for Homestead, 1880-1892: Politics, Culture, and Steel*, University of Pittsburgh Press, 1992.

[^8]: "Homestead Strike," AFL-CIO Labor History. [Link](https://aflcio.org/about/history/labor-history-events/1892-homestead-strike)

[^9]: David Brody, *Steelworkers in America: The Nonunion Era*, Harvard University Press, 1960.

[^10]: Sidney Lens, *The Labor Wars: From the Molly Maguires to the Sit-Downs*, Doubleday, 1973.

[^11]: Daron Acemoglu and Pascual Restrepo, "Robots and Jobs: Evidence from US Labor Markets," *Journal of Political Economy*, Vol. 128, No. 6, pp. 2188-2244, 2020. [Link](https://www.nber.org/papers/w23285)

[^12]: Daron Acemoglu and Pascual Restrepo, "Tasks, Automation, and the Rise in U.S. Wage Inequality," *Econometrica*, Vol. 90, No. 5, pp. 1973-2016, 2022. [Link](https://onlinelibrary.wiley.com/doi/full/10.3982/ECTA19815)

[^13]: Erik Brynjolfsson, Danielle Li, and Lindsey R. Raymond, "Generative AI at Work," *Quarterly Journal of Economics*, 2024. Originally NBER Working Paper No. 31161, April 2023. [Link](https://www.nber.org/papers/w31161)

[^14]: U.S. Congress, Balanced Budget Act of 1997 (P.L. 105-33), Section 4421. See also Salsberg & Forte, "US Residency Training Before and After the 1997 Balanced Budget Act," *JAMA*, 2002. [Link](https://jamanetwork.com/journals/jama/fullarticle/182532)

[^15]: AAMC, "U.S. Medical School Enrollment" data, 2019. [Link](https://www.aamc.org/news/us-medical-school-enrollment-rises-30)

[^16]: OpenSecrets, American Medical Association lobbying data, 1998-2020. [Link](https://www.opensecrets.org/orgs/american-medical-assn/lobbying?id=D000000068)

[^17]: Jay L. Zagorsky, "What today's labor leaders can learn from the explosive rise and quick fall of the typesetters union," *The Conversation*, October 2023. [Link](https://theconversation.com/what-todays-labor-leaders-can-learn-from-the-explosive-rise-and-quick-fall-of-the-typesetters-union-214519)

[^18]: Bruce Nelson, *Workers on the Waterfront: Seamen, Longshoremen, and Unionism in the 1930s*, University of Illinois Press, 1988. See also ILWU, "Bloody Thursday 1934." [Link](https://www.ilwu.org/bloody-thursday-1934-the-strike-that-shook-san-francisco-rocked-the-pacific-coast/)

[^19]: "Mechanization on the Waterfront," FoundSF. [Link](https://www.foundsf.org/index.php?title=Mechanization_on_the_Waterfront)

[^20]: "1962-1963 New York City Newspaper Strike," Wikipedia. [Link](https://en.wikipedia.org/wiki/1962%E2%80%931963_New_York_City_newspaper_strike)

[^21]: UPI Archives, "Historic ITU to merge with expanding CWA," November 27, 1986. [Link](https://www.upi.com/Archives/1986/11/27/Historic-ITU-to-merge-with-expanding-CWA/6777533451600/)

[^22]: Harvey Schwartz, *Solidarity Stories: An Oral History of the ILWU*, University of Washington Press, 2009. See also FoundSF, "Why the 1971-72 ILWU Strike Failed."

[^23]: USDA Economic Research Service, "Agricultural Productivity in the United States." [Link](https://www.ers.usda.gov/data-products/agricultural-productivity-in-the-united-states)

[^24]: Steven Levy, "A Spreadsheet Way of Knowledge," *Harper's Magazine*, November 1984. See also Dan Bricklin's VisiCalc history. [Link](http://www.bricklin.com/visicalc.htm)

[^25]: Bureau of Labor Statistics, Occupational Employment Statistics, various years. See also James Bessen, *Learning by Doing: The Real Connection between Innovation, Wages, and Wealth*, Yale University Press, 2015.

[^26]: James Bessen, "Toil and Technology," *Finance & Development* (IMF), Vol. 52, No. 1, March 2015. [Link](https://www.imf.org/external/pubs/ft/fandd/2015/03/bessen.htm)

[^27]: Deel and Carta, "India tech pay plunges 40%," reported in CIO.com, 2025. [Link](https://www.cio.com/article/4083886/india-tech-pay-plunges-40-signaling-a-shift-in-offshoring-dynamics.html)

[^28]: William J. Baumol and William G. Bowen, *Performing Arts: The Economic Dilemma*, MIT Press, 1966. See also Baumol, "Macroeconomics of Unbalanced Growth: The Anatomy of Urban Crisis," *American Economic Review*, Vol. 57, No. 3, 1967.

[^29]: Levels.fyi, "End of Year Pay Report 2025." [Link](https://www.levels.fyi/2025/)
