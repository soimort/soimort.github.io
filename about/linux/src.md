---
title: My Arch Linux Repository
subtitle:
author: Mort Yao
date: 2018-04-19
---

I use Arch Linux exclusively as my working OS since 2012. There were glitches and nonsleepiness, but also kludges and full control -- if I don't like how something works, I fork it myself. No proprietary code runs on my machines.

I have a personal Arch Linux [repository](http://arch.mort.ninja/x86_64/) that hosts some pre-built unofficial Arch packages, mostly at my own convenience:

1. *Programming language*-related:
   * `z3-git`
   * `fstar-git`
   * `mathcomp-git`
   * ... and more.
2. *Desktop*:
   * `mi-caja` (my personal fork of Caja 1.16, MATE's file manager)
   * `scite-gtk2` (SciTE built with GTK+ 2)

**`pacman.conf` entry:**

```
[soimort]
Server = ftp://arch.mort.ninja/x86_64/
```

**Public key:** (`07DA 00CB 7820 3251`)

```
# pacman-key -r 78203251
# pacman-key --lsign-key 78203251
```
