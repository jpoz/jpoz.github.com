---
title: Why we wrote our own XML/JSON parsers for LLMs
meta_title: ""
description: "meta description"
date: 2025-01-06T05:00:00Z
image: "/images/posts/02.webp"
categories: ["codez"]
authors: ["jpoz"]
tags: ["xml", "json", "go"]
draft: false
---

LLMs typically generate unstructured text optimized for human readability. But when you're building real-world applications, you may need that text to follow strict formats like XML and JSON. This created an interesting challenge for our team: how do we maintain the natural, high-quality output of LLMs while ensuring it fits into structured data formats? The solution we developed involved creating custom XML and JSON parsers designed specifically for LLM output. This approach has two key innovations:

1. Error Tolerance: Instead of failing when encountering minor syntax errors (like missing tags or trailing commas), our parsers intelligently reconstruct the intended structure.

2. Streaming Capability: The parsers can stream back segments of structured output in real-time, rather than waiting for the entire response to process.

This solution lets us maintain the high-quality, natural language output of LLMs while ensuring it works reliably in structured data formats. It gives us the best of both worlds - we can use any LLM while still getting dependable structured output for our applications.

One of the key challenges when working with LLM-generated structured output is handling those almost-perfect responses. The LLM returns perfectly valid XML or JSON, except for that one missing closing tag or that trailing comma. While a human can instantly understand the intended structure, traditional parsers throw errors and halt execution. This is why we developed parsers with built-in error tolerance. Instead of failing on minor syntactic issues, our solution intelligently reconstructs the intended structure, maintaining system stability without compromising the semantic content. This approach has been particularly valuable in production environments where robustness is crucial.

The second major advantage of our custom parsers is their ability to enhance user experience by streaming back sections of a structured output. For example, let's say we have a response with an explanation of what's happening, followed by the actual updates, and finally a conclusion. Rather than making users wait for the entire response to complete processing, we can stream back segments in real-time. This means users see meaningful content immediately, starting with the explanation, while the system processes the more complex structured components. We've found this approach dramatically improves perceived responsiveness and user engagement, especially during longer operations where traditional approaches would leave users staring at a blank screen.

While there are LLMs that guarantee structured output, like OpenAI's, we discovered these come with meaningful trade-offs in output quality. In our testing, models optimized for strict structural compliance often produce less nuanced, less natural writing compared to their unconstrained counterparts. I realize this is entirely subjective, but with our custom parser, we don't need to choose - we can let users use any LLM and not restrict them to only LLMs that support structured outputs.

Our parsing solution has significantly improved the developer experience when working with LLM outputs. It provides the reliability needed for production systems while maintaining the high-quality output that makes LLMs valuable. If there's interest, we're considering open-sourcing our parsers. Share your thoughts in the comments.

Written with Revi.so
