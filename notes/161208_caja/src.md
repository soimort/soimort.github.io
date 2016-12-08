---
title: Remember My Last Tabs, File Manager
author: Mort Yao
date: 2016-12-08
---

It's 2016, and I can't believe that there is still no "Continue where you left off" option in most dominant GUI file managers (as far as I know)!

Yes, it bugs me when I can't restore my last open tabs and I want my old session so badly. Remembering last tabs, if I get the history right, was a feature first introduced by Google Chrome, and soon it started to play an indispensable part in my daily workflow. I'm a multitasker, but the computing resource of my laptop is very limited -- Say, if I have a session in which I am working on a homework report, having loads of folders, web pages and editor buffers open and those can fill up gigabytes of RAM easily, then I realize that I will need to compile something really hard-core, or maybe just take a short rest and do some random surfing on the web, certainly I would rather close all those engrossing processes for the time being, hoping that they could continue with all the open tabs I left off.

It's mainly four types of applications that account for so-called "work sessions" for me:

* Terminal emulator
* File manager
* Web browser
* Text editor

Terminals don't take up a lot of memory, so I wouldn't mind leaving them open. Typical browsers, including Chromium and Firefox, do support session resuming (and there are even [extensions](https://chrome.google.com/webstore/detail/session-buddy/edacconmaakjimmfgnblocblbcdcpbko) which allow you to save current tabs and recover them at any later time). Any decent text editor (or IDE) may also be configured to remember open tabs / sessions. After all, average file managers fail to meet my basic needs of productivity.

## File managers: the unremembered UX

I'm on GNOME 3, but currently using the [Caja](https://github.com/mate-desktop/caja) file manager -- ever since Nautilus 3.6 decided to remove two or three features I found important to me ([compact mode](https://bugzilla.gnome.org/show_bug.cgi?id=676842), [backspace navigation](https://bugzilla.gnome.org/show_bug.cgi?id=692852)) and introduced an awkward, smug "search-whatever-shit-as-you-type" feature.

File managers I've tried so far:

* Nautilus (GNOME). As said, already rendered unusable for me.
* Pantheon. Like Nautilus, it doesn't feature a compact mode either.
* Nemo (Cinnamon). Nope, segfaults too often.
* Caja (MATE). It's OK, just what I'm using right now.
    * Open issue for saving sessions: <https://github.com/mate-desktop/caja/issues/523>
* Dolphin (KDE). OK, unless it's from the foreign land of KDE.
    * Open issue for saving sessions: <https://bugs.kde.org/show_bug.cgi?id=246028>
* Konqueror (KDE). It's both a web browser and a file manager, and it's the only one I know that can save / restore open tabs. Unfortunately it has only limited file management functionality. (sufficient as a *file viewer*, though?)

Among all above, I settled down with Caja, simply because there was no reasonably good alternative. Still, I'm wishing for something that can save session states for me. After doing a little research, I realized that:

1. There is no commonly adopted protocol addressing this issue. [Not even on GNOME](https://wiki.gnome.org/Projects/SessionManagement/SavingState).
2. There is [EggSMClient](https://wiki.gnome.org/Projects/SessionManagement/EggSMClient), but state saving is implemented on the X (desktop) session level thus only available on the [XSMP](https://www.x.org/releases/X11R7.7/doc/libSM/xsmp.html) backend. It works when you logout your desktop session and login, but not when you close the window and restart the application again.
3. It is ultimately the application itself which must maintain its session states and restore them when required.

## A quick working patch for Caja

Let's take the issue into more technical details. On Caja (or other similarly GTK+/GLib-based file managers), one need to implement:

* On the `destroy` callback of the main `GtkObject`, all last remaining session data (e.g., internal states about open tabs, windows) must be saved to disk. (after the main loop ends there's no more chance to get this information back)
* On GUI initialization, read last session data (if exist) from disk, and reopen saved tabs as well as windows.
* On the event of changing state (e.g., creating or closing tab/window, repositioning tabs), session data are updated respectively and, optionally, saved to disk.

With `caja_application_get_session_data()`, making a quick workaround that enables Caja to save and restore a session is somewhat trivial labor; however, it seems Caja doesn't record the correct (spatial) ordering of tabs in its session data -- so I wouldn't consider this as a satisfying solution to the issue, and I have no intent to send such an incomplete patch to Caja. Nevertheless, it's better than nothing, and, if ordering of tabs really matters, it would be feasible to write a wrapper script that manipulates the XML file in `$HOME/.config/caja/last-session`.

And here goes the patch: (Applied to Caja 1.16.1; definitely UNWARRANTED)

<script src="https://gist.github.com/soimort/73c75266d1610ff0af68b40e7b07d939.js"></script>
