---
layout: article
title: "Using KeePass as pageant"
publishDate: "2013-01-22"
legacyDate: "2013-01-22 00:44"
handlebars: false
tags: [Tutorial, Keepass, pageant, SSH, Windows, Git, CLI, Documentation]
redirectFrom: ["/2013/01/22/using-keepass-as-pageant/"]
---

> **Archived post — originally dated January 22, 2013.**
>
> **Historical context:** These notes describe a 2013 Windows workflow combining KeePass 2 and KeeAgent with PuTTY's Pageant/Plink, Cygwin, and SparkleShare. This is not a current installation or security guide. Plugin compatibility, menus, installation paths, and SSH-agent integration may have changed; consult current official documentation before configuring a password manager or importing private keys. The original download links below use HTTP; use the official HTTPS sites when obtaining software.
>
> **Corrections to the historical instructions:** The value `pink` below appears to be a typo for `plink`. `GIT_SSH` selects the SSH command used by Git; it does not configure OpenSSH itself to use Plink. Shell syntax and agent compatibility depend on the environment, so the old Cygwin bridge and SparkleShare steps should not be assumed necessary today.

To start using Keepass as a replacement for `pageant` you must do the following.

1.	Download [KeePass](http://keepass.info/download.html)
2.	Download [KeeAgent](http://keepass.info/plugins.html#keeagent)
3.  Set up Keepass by creating a KeePass database, a password, and key file, if you don't already have one.
4.	Install Keeagent to the `Program Files\KeePass Password Safe 2\Plugins` Directory and restart Keepass.
5.  Add an existing private.ppk as an attachment and its encryption password in the password field to a new Keepass Entry.  I also like to include the public key as a string field attachment.
6.  Test it out by going to `Tools -> KeeAgent -> List PuTTY Keys`

Thats it!  Now Keepass is ready to act as `pageant`!  Now comes the real work.  You still have to:

-	Set up some environment variables so that Open-SSH uses `plink` instead of `ssh` so that `pageant` is used rather than `ssh-agent`.
	-	This requires some understanding of the `$PATH`
	-	This also requires adding `plink` to your windows `$PATH`
	-	You must also add `$GIT_SSH` and set it to 'pink'
-	Install `charade` as a bridge from Cygwin to `pageant`.
-	Tweak Sparkleshare to use the system's `$GIT_SSH` variable instead of its built in version of `ssh`.

I'll be going over these different steps, as well as why you might want to take the time to do this kind of thing in subsequent posts.  And always, if you know a better way of doing things, or I am making silly or dangerous mistakes, please [email me](/about).
