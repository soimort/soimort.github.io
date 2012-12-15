---
layout: post
uri: /posts/127
permalink: /posts/127/index.html
title: PulseAudio的正确打开方式（两则）
category:
tag:
description:
disqus: true
lang: zh
---

记录在此，以供自己备忘之用。



## VLC播放器的音轨延迟问题

几个月前就在Freedesktop.org的bugzilla上报过这个问题（[Issue 50024](https://bugs.freedesktop.org/show_bug.cgi?id=50024)）。

这问题是从PulseAudio 2.0版的sound server从过去的由中断驱动改为基于timer-based audio scheduling实现开始引进的。

我过去的解决方法是`git bisect`找到导致问题的这部分commit，自己改回去。为此还专门[fork了一个](https://github.com/soimort/pulseaudio-vlc-friendly)。

不过最近在邮件列表上有人给出了解决方法，把`/etc/pulse/default.pa`里的：

    load-module module-udev-detect 

加上参数，手动禁用timer-based scheduling：

    load-module module-udev-detect tsched=0

重启后问题解决。（所以现在即使用官方的PulseAudio 2也可以了）



## 如何避免在播放器音量调节的时候被震聋狗耳

VLC默认使用PulseAudio作为音频输出模块时，程序本身的音量控制和显示与GNOME 3的音量控制（和PulseAudio完全集成）不同步。

输出设备Headphones，系统音量设为33%，属于人耳的舒适阈。打开VLC，应用程序本身的音量显示为100%。如果不做任何调节，播放时音量完全正常，系统最终输出音量为正常的系统设定的 __33%（-29.02dB）__：

![](http://i.imgur.com/nijW8.png)

一旦在VLC中使用了音量调节柄（比如从100%滚轮滚到94%），系统输出音量立马变成 __94%（-1.68dB）__，戴入耳式耳机的话估计能直接把耳膜震聋……

![](http://i.imgur.com/hmREe.png)

在VLC下面用滚轮滚进度条的时候经常会手残滚到音量调节柄上去。昨晚听歌的时候不知哪根筋搭错，如是手抽两次，表示再也吃不消了。决定解决之。

经试验，这问题在VLC和Totem上都存在，GNOME MPlayer上则没有。（不明觉厉）

最后在一个Gentoo user的wiki上找到了解决方法（感谢+[Feystorm](http://wiki.gentoo.org/wiki/User:Feystorm)）：

<http://wiki.gentoo.org/wiki/User:Feystorm#PulseAudio_per-application_volume_control>

在`/etc/pulse/daemon.conf`中设置：

    flat-volumes = no

让其对每个应用程序进行独立的音量控制。重启PulseAudio后问题解决。


