---
title: Terminal Getting Started

---

I pretty much do everything in the my terminal now, but when I was starting my
developer journey I hated the command line. So for anyone that was like me and
hates the command line here are some tips to get your over the hump and start
loving the power of the command line.

## Basics

Before we get into commands you need to know a couple of basics:

* To stop any command use `control-c`. Some will stop on their own but this
is the general way to stop any command in the terminal.
* Arguments and flags. To control our commands we've got two tools: Arguments
that we pass to the command and flag (or switches) to tune functionality of the
command. Lets look at an example:

<pre><code data-language="shell">ls -l project_dir
</code></pre>

Above we have one flag `-l` and one argument `project_dir`.

* How to try this stuff out: Open up your "Terminal" app in the Utilities folder
of your Application directory.

<pre><code data-language="shell"># This stuff is a comment about the command below
echo "This is a command you can copy and paste into your Terminal"
</code></pre>

## cd

Moving around is the first thing you'll need to be able todo and `cd` or change
directory is your friend.

<pre><code data-language="shell"># given no arguments cd will take you to your home directory
cd

# ~ is also an alias for your home directroy
cd ~

# moves into your Downloads folder that is in the current directory
cd Download

# moves into the Downloads folder that is inside the current directory
# Having the ~/ in the front means this is an absolute path meaning it
# will move to the same directory no matter what the current directory is
cd ~/Downloads

# Having the path start with / also makes it an absolute path from the "root"
# or base of our machine.
# This will move into our Utilities folder no matter what the current directory is
cd /Applications/Utilities
</code></pre>

For more information on `cd` checkout the [wikipedia page on the cd command](http://en.wikipedia.org/wiki/Cd_\(command\)).

## ls

Now that you're in the directory you want to be what's in there? That where `ls`
comes in. The `ls` command lists directory contents.

<pre><code data-language="shell"># ls with no parameters list the directory you are currently in
ls

# Often you'll want to see the "hidden" files in a directoy.
# Adding the -a flag will show all files
ls -a

# Need to know who owns a file? Maybe who can read or write to it?
ls -al
</code></pre>

## pwd

Now that you're moving around let make sure you can check where you are. The `pwd`
command prints out your working/current directory.

<pre><code data-language="shell"># pwd will print out which directory you are currently in
pwd
</code></pre>

## mkdir

Lets make some new folders on your computer. With the `mkdir` command you can
make new directories.

<pre><code data-language="shell"># give mkdir the folder you'd like to create as the first parameter
mkdir my_new_folder
</code></pre>

## cat

I've found my file! Now what's in it? Meow meet `cat` aka the concatenate command.
Pretty simple just takes a file an puts it on the standard output.

<pre><code data-language="shell"># cat a file
cat /etc/hosts
</code></pre>

## tail and head

OMG logs are the worst and the best all at once. When you don't want the full
file use `tail` to get just a part from the end and `head` to get a part from
the beginning.

<pre><code data-language="shell"># tail with the -f flag will wait for additional
# data to be added on to the file. Try out the command below to watch your wifi
# connectivity. Try turning on and off your wifi when its running
tail -f /var/log/system.log

# head is the opposite. To just get the first line of a file try:
head -n 1 /var/log/system.log
</code></pre>

## pipe

Sometimes one command isn't enough. The `|` character aka "pipe" allows us to
take the output of one command and feed it into the next. We'll use this in the
next section with grep.

## grep

Ah grep. I use this command so much sometimes I use it as a verb in sentences:
"Oh just grep out of the value." as in "Oh just search and return the value"

<pre><code data-language="shell"># grep can be used to search for text within
# a file:
grep apple /var/log/system.log

# We can also use grep to search whole directories of files
# Adding the -r recursivly searches the directores for files including the
# given text. Below we search our Documents directory for passwords :)
grep -r password ~/Documents

# grep can also be used with | aka pipe. This allows us to search the output of
# other commands. We can tail -f and grep the results:
tail -f /var/log/system.log | grep apple
</code></pre>

## cp

Copying files is useful. Use `cp` to copy files or whole directories.

<pre><code data-language="shell"># make a duplicate of a important file
cp my_journal.txt copy_my_journal.txt

# Notice the -r or recusive flag. This will duplicate the Documents folder and everything inside it
cp -r ~/Documents ~/Documents_copy
</code></pre>

## Other helpful tips:

* Using the up and down arrows you can cycle through the histroy of your commands.
* Use `open .` to open your current directory in the Finder.
* Hit Tab as much as you can. It auto completes for you.





