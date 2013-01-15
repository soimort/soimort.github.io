---
layout: post
uri: /posts/134
permalink: /posts/134/index.html
title: Horseshit：一个帮助克服拖延症的小工具
category:
tag:
description:
disqus: true
lang: zh
---

_The real productivity problem people have is procrastination. It’s something of a dirty little secret, but everyone procrastinates — severely. It’s not just you. But that doesn’t mean you shouldn’t try to stop it._

_What is procrastination? To the outside observer, it looks like you’re just doing something “fun” (like playing a game or reading the news) instead of doing your actual work._

—— [Aaron Swartz](http://www.aaronsw.com/), [HOWTO: Be more productive](http://www.aaronsw.com/weblog/productivity)

***

我们中的许多人多多少少都经历过这样的循环：面对着浏览器，习惯性地`Ctrl-T`打开一个新的标签页，敲下常去网址的首字母然后回车，只为了看看有没有啥新鲜事发生。也许什么都没有；没有任何自己感兴趣的新东西出现。好，关掉这个标签页。几分钟后，你再一次重复了上述的动作，这一次，你看到了一条惊人的业界新闻，社交网络上开始各种刷屏，于是你也跟风转发了一条，附上一条充不无机智风趣的评论。过了几分钟，你又一次打开这个页面，只为了看看有没有好友的回复。什么都没有。你失望地关掉标签页，决定不再理会它，去做一些正经事。半个小时后，终于有人回复你了。当然你在此期间也没闲着，因为你已经看完了一个别人分享的恶搞视频，右键了某论坛上的几十张福利图，津津有味地读完了人人网上男默女泪的2012年经典网络语录和豆瓣上如假包换黑木耳文艺女青年写的一篇《教你如何识别好男银》，回复了某技术论坛上一篇题为《C++是最好的语言！》的帖子，最后，你可能还看了一篇教你“[如何克服拖延症](#)”的博客，你觉得这文章实在太尼玛有用了；当然更有可能的是，你只是分享了它或者把它收藏了下来，实际上你压根就没有耐性把这篇文章读完。不知不觉，你已经在电脑前坐了两个多小时。却没有干成任何正经事。

这是一个无解的死循环，除非你认识到，每天我们在网络上所能接触到的信息，99.99%都和我们自身毫无关系，即使是那些“看起来”似乎有用的东西。在你利用它们创造出自己的价值之前，所有的信息都是无用的垃圾。仅此而已。

***

废话不多说，几天前，我在Google+上发现有[菊苣](https://plus.google.com/113127438179392830442/posts/iGXSXyJbrz1)通过修改`hosts`把域名直接定向到`127.0.0.1`的小技巧，来控制自己可以访问的网站。当然，手动修改太麻烦了，所以就有人写了这个叫做[get-shit-done](https://github.com/leftnode/get-shit-done)的脚本，用来管理自己的`hosts`文件。

原来的代码有Shell、PHP和Python三种语言的版本，其中那个Python的脚本写得很有问题，无法在Arch Linux上正常使用。于是就有了这个我自己的fork：[Horseshit](http://packages.python.org/horseshit/)。

通过Pip安装：

    $ pip install horseshit

或者直接使用Git版本，不过要自己处理`$PATH`：

    $ git clone git://github.com/soimort/horseshit.git

使用`/etc/horseshits`（Windows貌似可以放在用户文件夹下的`.config/horseshits`——我自己没测试过）来指定在工作时需要封杀的站点列表，举例：

    plus.google.com
    twitter.com
    reader.google.com
    reddit.com

切换到工作模式：（自动修改系统的`hosts`，把`horseshits`中指定的站点全部给封杀掉）

    $ sudo get-shit-done work

切换回娱乐模式：（返回正常状态的`hosts`）

    $ sudo get-shit-done play

如果需要的话，你可以把上面两条命令放到`crontab`里，给自己固定一天中的工作时间段和娱乐时间段。

稍微详细一点的说明请参考[这里](http://packages.python.org/horseshit/)。

***

我希望这个东西能有点用。当然，首先它要对我自己起作用才行。

先试用一段时间。如果还是没有自控能力的话，就只能动用物理断网这种终极手段了咩。![](http://static.tieba.baidu.com/tb/editor/images/baodong/b_0023.gif)
