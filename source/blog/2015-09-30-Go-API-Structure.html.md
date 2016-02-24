---
title: Structuring a large Go project
published: false

---

One of the things that really pulled me towards Go was it's solid stance on
standardization. Tools like `go fmt` `golint` and `go vet` make it easy
contribute software to large projects without arguing about how code should be
structured.

But when it comes to how large projects should be organized I've found little
guidance or consensus from the community. Most say something along the
line of "follow the standard lib". But we're not all building libraries. What
about large applications? Say a large backend API project. How should it be
organized?

This question has always been in the back of my mind. Now with a few moderately
large projects under my belt. I thought I would write down what's worked and
what hasn't worked. I'm not saying I have the be all end all answer but some
little patterns and tricks have really helped.

## Sub packages

<p> </p>

#### What's worked:

<p> </p>

Sub packages are great for keeping your code clean, testable and in manageable
chunks for your team to work on. Not to mention in some cases you can import a
subproject of another large project to make life easier. But the biggest
benefit comes from how Go's import process works.

/* One of the more powerful practices is using sub packages to manage the inner */

When you import a package the compiler ensures the imported package's
`init()` function is called before the `init()` function of the package it's
being imported into. This means when you call: `import subpackage` you know
that it is initialized and ready to use. Structuring your sub packages correctly
you can precisely control how your project starts up and what gets initialized
in first.

That simple characteristic can be used to manage your own project's internal
dependency's in a clean and testable way. Let's look at an example.

Below we have our logging package.

<pre><code data-language="go">package logging

import (
	"log"
  "os"
)

var Log Logger

func init() {
  Log = log.New(os.Stdout, "project: ", log.Lshortfile)
}
</code></pre>

Now when we import our `logging` package into another package of our project
the `logging.Log` is initialized and ready to use.

<pre><code data-language="go">package main

import (
	"github.com/you/yourproject/logging"
)

func main() {
  logging.Log.Print("Hello Internet!")
}

</code></pre>

This is a pattern I've gotten a lot of mileage out of. Using sub packages while
you build your project split out the different concerns: API server, DB connection,
logging, return types just to name few.


#### What hasn't worked:

<p> </p>



## Configuration

<p> </p>

#### What's worked:

<p> </p>

I usually start out a new project by building the configuration package first.

I like to configure my project via the environment they live in. Even wrote
[a nice package](github.com/jpoz/env) to convert environment variables
into structs.

### 2. Config via the environment


### my_project/config/env.go`

```go
package config

import "github.com/jpoz/env/decoder"

var Env *Environment

type Environment struct {
  Addr string `expand:"$HOST:$PORT"`
  DNS string `expand:"postgres://$DB_USER:$DB_PASS@$DB_HOST:5432/my_project"
}

func init() {
  Env = *Environment{}
  decoder.Decode(&Env)
}
```


Now in all the packages that depend on values from the environment, I can
import the `config` package. Importing the package
