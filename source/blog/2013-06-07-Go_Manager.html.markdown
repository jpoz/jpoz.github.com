---
title: Concurrency Manager in Go

---

Sometimes Go is just too damn fast. I recently ran into a situation where I was making too many calls too quickly to a third party API. The calls were coming from all over my application. I needed one place I could send calls that would manage their execution while rate limiting the them to the API.

Originally stolen from [here](http://michaelspeer.knome.net/2010/03/go-language-is-lovely.html), I added in rate limiting (with bursting) and the ability to give a go routine to the manager and wait for it's completion.

Basic Usage:

<pre><code data-language="go">package main

import "manager" // below

func main() {
  m := manager.New()

  for i := 0 ; i < 100 ; i++ {
    j := i
    m.Go(func(){
      time.Sleep( rand.Int63n( 1000000000 ) )
      fmt.Print( j , "\n" )

      // GoAndWait returns an chan error
      c := w.GoAndWait(func() (err error) {
        fmt.Print( j , " - started\n")      
        time.Sleep( rand.Int63n( 1000000000 ) )
        return
      })
      <- c
      fmt.Print( j , " - finished\n")
    })
 }
}

</code></pre>

I love Go. Here's the code:

### manager.go

<pre><code data-language="go">package manager

import "sync"
import "time"

type Manager interface {
	Go(func())
	Wait()
}

type manager struct {
	lock    sync.Mutex
	running uint
	waiting uint
	wakeup  chan bool
	burst   uint
	timeout time.Duration
	limiter chan time.Time
}

func New() *manager {
	m := new(manager)
	m.limiter = nil
	m.burst = 0
	m.timeout = 0
	m.wakeup = make(chan bool)
	return m
}

func (m *manager) RateLimit(burst uint, timeout time.Duration) {
	m.lock.Lock()

	m.limiter = make(chan time.Time, burst)

	go func() {
		for t := range time.Tick(time.Millisecond * timeout) {
			m.limiter <- t
		}
	}()

	m.lock.Unlock()
	return
}

func (m *manager) Go(fn func()) {
	m.lock.Lock()
	m.running++
	m.lock.Unlock()

	go func() {
		if m.timeout != 0 {
			<-m.limiter
		}
		fn()

		m.lock.Lock()
		m.running--
		if (m.running == 0) && (m.waiting > 0) {
			oc := m.wakeup
			nc := make(chan bool)
			i := m.waiting
			go func() {
				for ; i > 0; i-- {
					oc <- true
				}
			}()
			m.wakeup = nc
			m.waiting = 0
		}
		m.lock.Unlock()
	}()
}

func (m *manager) GoAndWait(fn func() error) chan error {
	m.lock.Lock()
	m.running++
	m.lock.Unlock()

	err_chan := make(chan error, 1)

	go func() {
		if m.timeout != 0 {
			<-m.limiter
		}
		err_chan <- fn()

		m.lock.Lock()
		m.running--
		if (m.running == 0) && (m.waiting > 0) {
			oc := m.wakeup
			nc := make(chan bool)
			i := m.waiting
			go func() {
				for ; i > 0; i-- {
					oc <- true
				}
			}()
			m.wakeup = nc
			m.waiting = 0
		}
		m.lock.Unlock()
	}()

	return err_chan
}

func (m *manager) Wait() {
	wait := false

	m.lock.Lock()
	if m.running > 0 {
		m.waiting++
		wait = true
	}
	m.lock.Unlock()

	if wait {
		<-m.wakeup
	}
}
</code></pre>
