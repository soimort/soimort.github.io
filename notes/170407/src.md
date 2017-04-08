---
title: Recovering from a Corrupted Arch Linux Upgrade
subtitle: "Or: When Pacman's \"Post-Transaction Hooks\" Go Wrong"
author: Mort Yao
date: 2017-04-07
date-updated: 2017-04-08
category: engineering
---

**(Probably unimportant) Backstory:**
It's been a while since the last full-system upgrade of my Arch Linux laptop -- It sat well with me for a span of months' uptime. When I finally got the time to run a `pacman -Syu` (so well as to dare any potential issues due to Arch's infamous instability) earlier today, weird things did happen: Something other than `pacman` was eating up my CPU. I assumed it was Chromium in the first place, unless it wasn't this time. It turned out to be `gnome-settings-daemon` together with some other GUI processes running on GNOME, that were consistently hogging my CPU in turn. And that made a percent of 100% (!). As I killed the seemingly problematic process, something else would insist to emerge on the top of `top` with similarly excessive CPU usage. I decided that this was an unusual situation and without much further thought, forced a `reboot` while `pacman` was still running.
Then I ended up with a corrupted system: the kernel didn't load during the early boot process, complaining about missing `modules.devname` and that `/dev/sda11` (which is the root partition) could not be found:

```
  Warning: /lib/modules/4.10.8-1-ARCH/modules.devname not found - ignoring
  starting version 232
  Waiting 10 seconds for device /dev/sda11 ...
  ERROR: device '/dev/sda11' not found. Skipping fsck.
  mount: you must specify the filesystem type
  You are now being dropped into an emergency shell.
```

Without proper modules loaded even the keyboard was not working, so I couldn't do anything under the emergency shell. But I wasn't completely out of luck -- I have a dual-booting of Arch and Ubuntu, which is prepared just for recovery purposes like this. (otherwise I had to make room for another Live USB, which was a little bit inconvenient; I don't use those rescue-ware for years)

**Recover an (unbootable) Arch system from another distro:**
This is mostly relevant if you can't boot into the system (due to a corrupted kernel upgrade), otherwise it's possible to just login from TTY (locally or via SSH) and perform the fix (e.g., in the case that it's just X, display manager or WM that fails to load but the kernel boots well).

1. On the host system (e.g., Ubuntu), create a working chroot environment: (Assume that the root for Arch is mounted to `/dev/sda11`)
```
    # TARGETDEV="/dev/sda11"
    # TARGETDIR="/mnt/arch"

    # mount $TARGETDEV $TARGETDIR
    # mount -t proc /proc $TARGETDIR/proc
    # mount --rbind /sys $TARGETDIR/sys
    # mount --rbind /dev $TARGETDIR/dev

    # cp /etc/hosts $TARGETDIR/etc
    # cp /etc/resolv.conf $TARGETDIR/etc
    # chroot $TARGETDIR rm /etc/mtab 2> /dev/null
    # chroot $TARGETDIR ln -s /proc/mounts /etc/mtab

    # chroot $TARGETDIR
```
Alternatively, use the `arch-chroot` script from an [Arch bootstrap image](https://mirrors.kernel.org/archlinux/iso/latest/):
```
    # arch-chroot $TARGETDIR
```

2. Now that we have a chroot environment with access to the (currently broken) Arch system, continue with unfinished `pacman` upgrades and clean up any lock file if needed:
```
    [/mnt/arch]# pacman -Syu
```
Or, if there's any unwanted package upgrade that causes the system to fail, downgrade it.
\
The important thing to remember is that, while continuing, a previously failed transaction will not run its hooks anymore. Therefore it might be wiser to find out which exact packages `pacman` was trying to upgrade in the last transaction (from `/var/log/pacman.log`) and *reinstall* all of them, rather than a complementing `pacman -Syu`. But if it's known which package is causing the problem (and in this very common case, `linux`), simply run the following to regenerate initramfs for the new kernel:
```
    [/mnt/arch]# mkinitcpio -p linux
```
And we are done. A few commands and our Arch system is now back and booting.

**Why the mess?** Initramfs images need to be regenerated (from a corresponding mkinitcpio preset file) after each kernel update. Starting from Arch's package `linux 4.8.8-2`, the calling of `mkinitcpio` was specified in a PostTransaction alpm hook, in place of an explicit `post_install()` command to be invoked from the `.install` script [as before](https://git.archlinux.org/svntogit/packages.git/commit/trunk/linux.install?h=packages/linux&id=617173dcde960f00112ebdfee4c80ede71e67375): (The move towards alpm hooks is said to be a fix for [#51818](https://bugs.archlinux.org/task/51818), as two or more packages in one transaction may need the regeneration of initramfs images)

```ini
[Trigger]
Type = File
Operation = Install
Operation = Upgrade
Target = boot/vmlinuz-%PKGBASE%
Target = usr/lib/initcpio/*

[Action]
Description = Updating %PKGBASE% initcpios
When = PostTransaction
Exec = /usr/bin/mkinitcpio -p %PKGBASE%
```

The faulty part about PostTransaction alpm hooks is that they run in a *post-transaction* manner; in the context of Arch Linux, a "transaction" means a complete run of `pacman`, regardless of how many packages it installs or upgrades. Such PostTransaction hooks will not run until all preceding operations succeed. Quoted from the CAVEATS section in the [alpm-hooks(5) Manual Page](https://www.archlinux.org/pacman/alpm-hooks.5.html):

> "PostTransaction hooks will **not** run if the transaction fails to complete for any reason."

This (kind of) misbehavior could lead to unintended aftermath in a failed system upgrade, as it does in the case of the `linux` package. Confusingly, a `pacman` "transaction" can be an arbitrary set of unrelated package updates; it could possibly fail to complete at any point (e.g., `.install` script errors, process accidentally killed, or even power lost), and ideally, it should remain safe while encountering such failures before commit. However, since the generation of `initramfs` in the PostTransaction hook is actually an **indispensable** step for the newly upgraded `linux` package here (whether other packages complete their upgrades or not), it is not safe if a `pacman` "transaction" fails halfway; PostTransaction hook won't run and all you get is a halfway system that doesn't boot (so you'll need to fix that through a fallback or alternative kernel). To see this problem more clearly, think of the following two scenarios:

***A successful system upgrade:***

```
    pacman -Syu
        sanity check (for packages to upgrade)
            |
        start upgrading package L (requires hook M to run)
            |
        finish upgrading package L
        start upgrading package A
            |
        finish upgrading package A
        start upgrading package B
            |
        finish upgrading package B
        complete transaction
        run post-transaction hook M
            |
        done.
    [packages L, A, B are upgraded; hook M is run; working system]
```

***An (ungracefully) failing system upgrade:***

```
    pacman -Syu
        sanity check (for packages to upgrade)
            |
        start upgrading package L (requires hook M to run)
            |
        finish upgrading package L
        start upgrading package A
            |
        finish upgrading package A
        start upgrading package B
            |
            crash!
    [packages L, A are upgraded; hook M is not run; broken system]
```

**How to perform a system upgrade safely?**
Although it ultimately depends on how we define a "safe system upgrade" and how much we want it, some robustness may be achieved at least. It's clear to see that the upgrade of package `L` and the run of hook `M` should be dealt as one transaction, or treating `M` in a post-transaction way will put us on the risk that if some other package fails to upgrade (or maybe it's just computer crashes), we end up with having only `L` upgraded, but not `M` run (while it is desirable to have both or none).

***A (gracefully) failing system upgrade:***

```
        sanity check (for packages to upgrade)
            |
        start upgrading package L (requires hook M to run)
            |
        finish upgrading package L
        run hook M
            |
        complete transaction
        start upgrading package A
            |
        finish upgrading package A
        start upgrading package B
            |
            crash!
    [packages L, A are upgraded; hook M is run; working system]
```

This is exactly the way things worked before (using the old-fashioned `post_install()`): It's less fragile under possible failures, although in order to fix #51818 (another package `L2` also requires hook `M` to run), we'll need to manage the ordering of package upgrades properly:

```
        start upgrading package L (requires hook M to run)
            |
        finish upgrading package L
        start upgrading package L2 (requires hook M to run)
            |
        finish upgrading package L2
        run hook M
            |
        complete transaction
        start upgrading package A
            ...
```

That is, `L`, `L2` and `M` are one transaction. It is not allowed to have only `L` and `L2`, or only `L`, without a run of hook `M`. Other unrelated packages (`A`, `B`, ...) are prevented from causing such issues in the above scheme. There is still a possibility that the process crashes during the phase of `L`, `L2` or `M`, but the chance would be much smaller, because we are working with a transaction consisting of the strongly coupling upgrades of `L`, `L2` and `M`, not a whole `pacman` "transaction" consisting of easily hundreds of arbitrary system upgrades and post-transaction hooks. Even better, in case of such failures, we can ask to redo uncommitted transactions anyway so we don't rerun hooks manually:

```
        redo uncommitted transactions (upgrades & hooks)
            |
        start upgrading package B
            ...
```

I don't know if there's any software management tool implementing this fully recovering approach. Transactions need to be more refined (`pacman`'s "all is a transaction" is really a naïve semantics to have) and the ordering of upgrades is essential, in order to give best robustness in case of possible crashes during a system upgrade, so it might not be as implementable as most package managers are (although still far less sophisticated than a real-world database). Or -- with reasonable efforts -- if we cannot guarantee anything for a transaction -- maybe a Windows-inspired "user-friendly" warning message like "Don't turn off your computer" is good enough. (At least you'll know when you're breaking shit: a transaction is not completed yet, some necessary hooks are not run, and you're on your own then.)



## References

[1] ArchWiki, "Install from existing Linux".
<https://wiki.archlinux.org/index.php/Install_from_existing_Linux>

[2] ArchWiki, "Change root".
<https://wiki.archlinux.org/index.php/change_root>

[3] ArchWiki, "mkinitcpio".
<https://wiki.archlinux.org/index.php/mkinitcpio>

[4] alpm-hooks(5) Manual Page.
<https://www.archlinux.org/pacman/alpm-hooks.5.html>
