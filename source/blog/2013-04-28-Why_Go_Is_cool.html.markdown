---
title: Makefile + GoLang FTW

---

I like Go (Golang) because it keeps me busy and rarely annoyed. One thing that was annoying me was the lack of a build in dependency managment system. This honsetly scared me when I first started to learn Go. I would never know when I ran <code>go get ...</code> if i was getting the version of the dependency that I was supposed to get!

My solution: Keep everything in source control. This means that each project i work in has its own <code>GOPATH</code> and I commit all of <code>src/</code> to my repo. This might seem a bit bulky, but I'll never have to worry about accidental version or api changes in my projects.

### Example Makefile

<pre><code data-language="shell">default: run

.PHONY: default run

run:
		GOPATH=`pwd` go run src/{project}/main.go
</code></pre>
