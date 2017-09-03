---
title: When GNOME Shell Freezes (But You Have Unsaved Stuff There)
subtitle:
author: Mort Yao
date: 2017-09-02
date-updated:
category:
---

In the past few months, I was running into the mysterious bug that GNOME Shell crashes with a segfault in `libgjs.so.0.0.0`, leaving me an unresponsive desktop:

```
  kernel: gnome-shell[963]: segfault at 7f06645fffe8 ip 00007f06d94898dd
  sp 00007fff562ee7e0 error 4 in libgjs.so.0.0.0[7f06d9
```

On crashing GNOME Shell does not restart itself correctly, nor `gnome-shell` processes are actually terminated, for some unknown reason. When this happens Mutter is completely frozen, <kbd>Alt</kbd>+<kbd>F2</kbd> is unavailable; what's even worse, <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>F3</kbd> can't get you a lifesaving TTY.

Clearly, the only way one can access the box then is via SSH. But what to do next? While it is possible to simply restart `gdm` like: (for systemd users)

```
$ systemctl restart gdm
```

This would, however, destroy the whole X session and all your open GUI processes will be lost! A desirable, more elegant approach is to restart `gnome-shell` alone, but this requires a few tricks in case you're working through `ssh` and `killall -9 gnome-shell` doesn't restart GNOME Shell properly.

1. Login to the (borked) remote machine, and enable X11 Forwarding in its SSH daemon by modifying `/etc/ssh/sshd_config`, if you've never done it before: \
(Note that this option is not the default on most distros; you'll have to restart `sshd` on the remote machine after then.)
```
        X11Forwarding yes
```
2. Login to the remote machine again, with X11 forwarding enabled this time:
```
        $ ssh yourUser@yourHost -X
```
3. On the borked remote machine, kill all the FUBARed `gnome-shell` processes, if any:
```
        $ pkill gnome-shell
```
4. Set the correct `DISPLAY` environment otherwise you won't be able to run a WM from a remote shell:
```
        $ export DISPLAY=:0
```
5. Bring back the GNOME Shell WM, detached (so it can keep running after closing the remote shell):
```
        $ setsid gnome-shell
```

**Related Gjs bug(s).** The bug was there since gjs 1.48 and has been reported multiple times: [#781799](https://bugzilla.gnome.org/show_bug.cgi?id=781799), [#783935](https://bugzilla.gnome.org/show_bug.cgi?id=783935), [#785657](https://bugzilla.gnome.org/show_bug.cgi?id=785657). Still, a recent gjs 1.49 build crashes my desktop: ( It seems rather hard to find out what would trigger the issue, but no more worries when it bumps in the night -- Just get back the WM and no running window is lost.
