---
title: Go Away, tracker-store
subtitle:
author: Mort Yao
date: 2017-11-03
date-updated: 2017-11-04
category: tooling
---

Long story short, after an Arch update the annoying process called `tracker-store` started to hog my CPU and disk space (again). For some really peculiar reason, GNOME developers decided that everyone should want to use their <del>awesome</del> [Tracker](https://wiki.gnome.org/Projects/Tracker) smarty-ware to index everything in pants, and you should not need to turn it off so easily...

Well, I had had enough of this due to concerns of performance and privacy, and surely uninstalled the `tracker` package a long time ago, but now it seems GNOME's canonical file manager `nautilus` starts to depend on `tracker` (one of its old dependencies, `libtracker-sparql`, has now been fused with the `tracker` package since version 2.0 in Arch's downstream repository). That explains why it's back, uninvitedly.

A few quirks noted (in Tracker 2.0.x):

1. The GUI configuration program `tracker-preferences` has been summarily removed ([d4a8d6e](https://github.com/GNOME/tracker/commit/d4a8d6e45e991758440276b4ca3ad6e821dfdab2)), while `tracker` provides _no_ command-line alternative for intuitive gsettings configuration yet. (Then why would they remove this very helpful GUI?)
2. The old trick that appends `Hidden=true` to an overriding autostart file such as `~/.config/autostart/tracker-store.desktop` (in [1] [2]) no longer works in 2.0, because....
3. `tracker` ships with a systemd user service now (`/usr/lib/systemd/user/tracker-store.service`), since they obviously think a desktop-level autostart is not enough. While Arch Linux ships wisely with a `/usr/lib/systemd/system-preset/99-default.preset` containing "`disable *`" which disables all new units by default [3], there is no equivalent `user-preset` file doing the same, which means that `tracker-store.service`, as a user service, is enabled by default and still gets to run on every boot.

Now that uninstalling `tracker` is not an option, one has to take both measures to block `tracker-store` from running:

1. Copy the autostart file and override it with a user-specific one:
`$ cp /etc/xdg/autostart/tracker-store.desktop ~/.config/autostart/tracker-store.desktop` \
and append to it: \
`Hidden=true` \
(The same step also applies for `tracker`'s friends, such as `tracker-miner-fs`, etc.)
2. Mask (which is the strongest yet nondestructive way to "disable" a static systemd service completely [4]) all `tracker`-related services:
```
        $ systemctl --user mask tracker-store
```

Look ma, no more hogs. Back to work!



## References

[1] Ask Ubuntu, "tracker-store and tracker-miner-fs eating up my CPU on every startup".
<https://askubuntu.com/questions/346211/tracker-store-and-tracker-miner-fs-eating-up-my-cpu-on-every-startup>

[2] "Disabling GNOME Tracker and Other Info".
<https://gist.github.com/vancluever/d34b41eb77e6d077887c>

[3] ArchWiki, "systemd".
<https://wiki.archlinux.org/index.php/Systemd>

[4] FreeDesktop.org, "systemctl(1)".
<https://www.freedesktop.org/software/systemd/man/systemctl.html>
