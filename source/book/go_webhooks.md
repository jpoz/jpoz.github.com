
# Go and Github Webhooks

## Introduction

Over the last couple years the Go programming language has been on a meteoric rise in popularity. Conceived in 2007 Go's main purpose was to increase a programmers efficiency in their day-to-day work. Go's standard library comes with built in modern tools to excel in today's web focus clustered multicore environments.

Go is all about making the programmer's life easier. With built in support for JSON, HTML, HTTP, templating and concurrency Go is ready for any project.

Describing Go to another programmer often feels like being the host of infomercial. Remember those long compile times? Gone! Remember the endless bickering over
formatting and documentation? Gone!

Documentation and formatting are taken care of at the language level. Getting the documentation for a particular library is as easy as going to godoc.org. Making sure your code is formatted properly is as easy as `go fmt`.

## Go Getting Started

Luckily if you're new to Go it's has a very user friendly installation process.

Visit: http://golang.org/doc/install

I would recommend using an installer. You can also download an archive or source and install it manually. The package install is nice in that it will take care of almost everything for you. You can download it at:

http://golang.org/dl/

I would also recommend the latest "stable" version. At the time of writing this the latest stable version is 1.3.1. Also make sure you grab the right one for your architecture and OS.

## GOPATH

There is one very important environment variable that we will discuss next:
GOPATH

The `GOPATH` environment variable is a comma delimited list of locations where go will look for packages. It is where the source for your code with live alone with the code
you need to import to run your code. Each location in the `GOPATH` needs to have three specific directories in it: bin, src and pkg.

The `bin` directory is where the compiled binaries live.

The `pkg` directory has all the installed package objects. You'll rarely have to go into the pkg directory yourself. If peek in you'll find a subdirectory for each operating system and architecture the packages that were build for it.

Finally the `src` directory. This is where you'll spend most of your time. Nested in the `src` directory is the import path for each package.

For our use case we're going to keep it simple and have just one location in our `GOPATH`. Depending on how you installed Go you might already have GOPATH set.
To check run:

  $ echo $GOPATH

This will print of the current value of the GOPATH environment variable. Lets set our GOPATH to a subdirectory in our `HOME` directory:

  $ export GOPATH=$HOME/go

This would be a good time to add the line above your bash/zsh profile so when you start your next terminal session GOPATH is set for you.

## What we are going to build

You can build almost anything with Go but today we're going to build ourselves a webserver that responds to Github Webhooks.

Our goal will be to create a server that renders HTML from Markdown files hosted on Github. When a Markdown file is created or updated on Github our service will automatically render the markdown into HTML.

## Introduction to Github webhooks

Until now most of the interaction we've had with Github is pushing, viewing or
requesting information from github. But what if we want github to provide us
with some information when events happen on github? Well, this is where github
webhooks come into play.

https://developer.github.com/webhooks/

Github webhooks provide the ability for your service to push data from Github.
When and event happens on Github your service will get notified. By setting up
a webhook you're telling github: when something happens tell me. When an event
happens on github your service will recieve a post of JSON. The JSON or
"payload" of the post will contain information about what event happened, when
and to which repository.

To view all supported events visit: https://developer.github.com/webhooks/#events

## Our Project

You can uses these webhooks to start builds, notifiy your team on commits or
anything else your mind can come up with. For our project we will be rendering
Markdown files into HTML when they're created or updated on Github. A CMS of
sorts for Markdown data.

The basic idea is: someone updates a file on Github, github sends us an event
then we update or create the needed HTML files from the Markdown files on Github.

This project isn't just a weekend hacking project. What we'll be creating is the
base for a tool used in production to keep HTML documents up-to-date and easy to
edit at Simple (https://www.simple.com/).

To make our web server we'll need to be able to connect and interact with the
Github api. For this we'll use `go-github` written by Google. You can find
the sounce code here:

https://github.com/google/go-github

To get you acclimatized to Go's ecosystem lets look at the godoc for this
libary. To view the documenation prepend "godoc.org" into the url:

https://godoc.org/github.com/google/go-github

GoDoc has he ability to generate documentation for Go packages hosted on
Bitbucket, GitHub, Launchpad and Google Project Hosting. It's an amazing tool
one, if you plan on taking up Go, you should get accustom to.

Take a minute to look over the `github` package documentation. You can see
just about everything in Github's API is mapped out in this package. We will be
using two sections of the package:

  WebHookPayload: http://godoc.org/github.com/google/go-github/github#WebHookPayload
  Markdown fuction: http://godoc.org/github.com/google/go-github/github#Client.Markdown

These two sections of the package will allow us to digest a webhook payload and
render any markdown files that might have changed.

## Project structure

Time to start writing some Go code. Let setup our workspace so we can get
started.

The go tool is setup to work with pubic open source software. When you import
packages into your go code you actually use the public locations of the code.
For example when we import Google's go-github package we will actually import
the location of the code on the public internet: "github.com/google/go-github"

Similary the location of the package locally mirrors the package's location on
the public internet. Inside our src directory Google's go-github package will
be located in: src/github.com/google/go-github

As you can see go code's directory structure is intrinsically linked to the
public location of the code. Our project should too. You don't actually have to
create a repo on github but make a directory structure where your code would be
if hosted on github. The name of our project will be 'gowebhooks' so for me
that would be:

src/github.com/jpoz/gowebhooks

To create the directory I'll run:

  $ mkdir -p $GOPATH/src/github.com/jpoz/gowebhooks

And move into our project directory:

  $ cd $GOPATH/src/github.com/jpoz/gowebhooks

Now lets talk about the structure of the files within our project directory. We going to build a web server executable and build a package the web server will import.

Below is how we'll have our project structured:

.
├── cmd
│   └── gowebhooks-server
│       └── main.go
└── gowebhooks.go

To create the structure above run the following commands:

  $ touch gowebhooks.go
  $ mkdir -p cmd/gowebhooks-server
  $ touch cmd/gowebhooks-server/main.go

We could write our whole server in one file but then we would be restricted to only using the 'main' package since all executables need to be in the 'main' package. Building our server and related code in its own package allows it to
have the ability to be imported into other projects. Maybe not totally needed for this project but is a good practice.

Our executable will be pretty simple. Just a file to load in our package and start it up.

main.go

```go
package main

import (
  "github.com/jpoz/gowebhooks"
)

func main() {
  gowebhooks.StartServer()
}
```

Our `gowebhooks.go` file will have the meat of our project. To start lets make sure Go is installed properly and setup a simple webserver:


gowebhooks.go

```go
package gowebhooks

import (
	"fmt"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello %s", r.URL.Path[1:])
}

func StartServer() {
	http.HandleFunc("/", handler)

	fmt.Println("Listening on 8080")
	http.ListenAndServe(":8080", nil)
}
```

Lets run our project to make sure we've got everything working. In our project
directory lets run:

  $ go run cmd/gowebhooks-server/main.go

Navigate your browser to http://localhost:8080/ and you should see a page greeting you.

## Receiving webhooks from Github

First step in receiving webhooks is turning them on at github.com. Navigate to the project you'd like to receive webhooks from or create a new project to test out webhooks.

I'm going to create a new project called "JollyRoger" (Captain Hook's Ship's Name).

In the settings panel you'll find "Webhooks & Services". There you should find a "Add Webhook" button. Click it and lets get started.

To create our webhook we need to provide a "Payload URL". In this case we're going to want github to send webhooks to our local computer. Giving github "localhost" won't do us any good. Since we're not on the same network at github we need a public address for our local computer. To allow github to have connectivity to our local computer we'll need to tunnel a public address to our local computer.

The Github documentation recommends "ngrok.com" for this task. Ngrok runs a small daemon on our local machine that tunnels traffic back and forth to a public address on their site. So any traffic that hit the given unique address will be proxied by ngrok.com to our local machine. Visa versa if we send anything to the daemon it will be proxied to
ngrok.com and sent by their servers.

To get ngrok install follow the instructions at "https://ngrok.com/download". Or if you're a homebrew user: `brew install ngrok`

We want to proxy all traffic from port 80 (default http port) from ngrok to our server's port locally (8080).

Quick warning before we start up ngrok. When we start up the ngrok daemon we will be opening up port 8080 of our local computer to the **entire** internet. Sound a little scary but ngork gives us a unique subdomain and we can always shutdown the daemon to close the connection.

To start tunneling traffic run:

	$ ngrok 8080

You should see the tunnel starting up and tunnel status of "online". Below that should be your unique ngrok url. The url should look something like: http://1a2b3c4d.ngrok.com

Leave that terminal running. In another terminal navigate back to your project directory and restart your server:

	$ go run cmd/gowebhooks-server/main.go

Now navigate your browser to your unique ngrok url. You should see the same page as when you connected to the sever locally.

# TODO go over ngrok http/in interface

We can now tell Github where to send our webhooks. Go back to your repository's "Add webhook" page and enter in your unique ngrok url followed by `/webhook`. For me that's: `http://1a2b3c4d.ngrok.com/webhook`.

Make sure the content type is `application/json` and set the secret to something you'll remember. Something like: "DangerZone". We'll just be working with push events. So you can leave "Just the push event" selected. Click "Add webhook" to save your settings.

When a new webhook is created Github sends a ping test. To see if we received it we can check ngrok.
