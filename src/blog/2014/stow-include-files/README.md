---
layout: article
title: "GNU Stow Include Files"
publishDate: "2014-10-10"
legacyDate: "2014-10-10 17:32"
handlebars: false
redirectFrom:
  - "/2014/10/10/stow-include-files/"
tags:
  - unix
  - stow
  - gnu
  - tips
  - sysadmin
---

> **Archived post — originally published 2014-10-10.**
>
> **Technical note:** The expression below tests substrings rather than an exact directory allowlist. Review the current Stow matching rules and use a dry run before applying an ignore file.

It isn't uncommon to come across unix software that **does not** conform to the standard unix directory structure:

```sh
/bin
/include
/lib
/lib64
/local
/sbin
/share
/tmp
```

When you are using a system like [stow](http://www.gnu.org/software/stow/), this non-conformity can be a real pain in the neck since it tends to result in a royal mess in `/usr/local` or `~/` or wherever you are stowing.

## Turn that Stow Ignore File into an Include File

`stow` allows you to throw a `.stow-local-ignore` into (program | dotfiles | config | whatever) folders inside your stow folder.  These ignore files use perl regular expressions, one per line, that cause `stow` to ignore files and folders than at least one regex selects, with no way to more specifically negate a less specific regular expression (like you can in `.gitignore` files).

The following regular expressions ignores all folders/files that are not apart of the standard unix directory structure:

```perl
/^((?!(\/)bin|include|lib|lib64|local|sbin|share|tmp).)*$/
```

The double `//` is implied each line in the ignore file so just omit those in the actual `.stow-local-ignore` file:

```perl
# Only stow the following folders
^((?!(\/)bin|include|lib|lib64|local|sbin|share|tmp).)*$
```

This can be super handy for throwing into a messy binary distribution of a program to avoid stowing `README` and `INSTALL` files, or even worse, when a program `make install`'s a bunch of extra unneeded crap into your `stow/program-x.x.x` folder.  Its also a simple syntax to extend and modify to your needs.

This can also be used in a `~/.stow-global-ignore` file, but it might be too aggressive in some situations.  Take it case by case.

## Test your ignore/include file

You can test the ignore file using a dry run in verbose mode:

```sh
~ > cd stow
stow > stow -S -v -n program-x.x.x
# Stow will print a list of files that it will stow without the -n flag
```

## How does this work?

Negating regular expressions is somewhat non-trivial, but we can use a clever trick called "negative look-arounds".  It works by using a regular expression that selects everything that does not contain the substring we select in the `(?!string)` selector.  You can read more about this trick on this excellent stack overflow answer:

- [Stack Overflow: Regular expression to match string not containing a word?](http://stackoverflow.com/a/406408/1287889)

## Why use ignore/include files?

Stow includes a number of options for customizing the stow process, but they must be specified at the time of stowing, which makes stow more difficult and finicky to use because a stow process that specifies additional options can't be trivially reproduced at a later time unless careful documentation is kept.  Its better to specify how you want the program stowed each and every time so that the stow process is always idempotent:

```sh
~ > cd stow
stow > stow -S program-x.x.x
# program is now stowed
stow > stow -D program-x.x.x
# program is now unstowed
# The stow process should never be different than this
```

## Useful links:

- [perldoc.perl.org on Perl Regex](http://perldoc.perl.org/perlretut.html#Grouping-things-and-hierarchical-matching)
- [regjex.com - For testing new regexs](http://regjex.com)
- [Stack Overflow: Regular expression to match string not containing a word?](http://stackoverflow.com/questions/406230/regular-expression-to-match-string-not-containing-a-word)
- [GNU Stow Docs - Ignore-Lists](http://www.gnu.org/software/stow/manual/stow.html#Ignore-Lists) (Pro Tip:  Cross your eyes before reading)
- [ARC-Docs](http://arc-docs.readthedocs.org/en/latest/linux-clusters.html) - An afternoon project developed for PSU:OIT's Academic Research Computing
- Related: [A simple stow strategy for your ~/](/2014/08/25/managing-programs-in-unix-userland/)

### Thanks For the Help

- [Travis Hathaway](http://travishathaway.com)
- [Matt Johnson](http://satchamo.com)
- [Jim... I need your website]
