---
layout: post
uri: /posts/129
permalink: /posts/129/index.html
title: 关于Unix世界末日的调查报告
category:
tag:
description:
disqus: false
lang: zh
---

![tweet](http://i.imgur.com/3VFJc.png)

[未来的人类：“古代文明人所创造的这台Unix机器、它的历法只到2038年1月19日这一天就为止了，因此我确信那一天必将是地球灭亡之日。”](<https://twitter.com/asagi_newmoon/status/281783512355442688>)

***

这就是Unix系统的[2038年问题](http://zh.wikipedia.org/wiki/2038%E5%B9%B4%E9%97%AE%E9%A2%98)。

如果你是Linux用户还不知道2038年是世界末日这个梗，正好可以趁这个机会逃离Linux滚回去用Windows或者Mac了（Mac OS X___也许___是极少数无须用户担心2038年问题的*nix系统之一）。Linux这个操作系统对你来说太危险了。



## 2038年问题

![](http://unixepoch.com/tshirt.jpg)

2038年问题的成因与20世纪90年代曾经名噪一时的[千年虫问题](http://zh.wikipedia.org/wiki/2000%E5%B9%B4%E9%97%AE%E9%A2%98)很类似。千年虫问题是因为早期（早在20世纪50年代以前）程序员们使用两位十进制数字来表示年份（为了节约存储空间和书写程序的便利），并且在很长一段时间内，没有意识到这么做可能给后人带来的麻烦；当所有人都习惯这么做时，随着软件系统变得越来越复杂，小问题就逐渐演变成大问题了。

说起Unix上的2038年问题，时间要追溯到1969年。当[Ken Thompson](http://en.wikipedia.org/wiki/Ken_Thompson)和[Dennis Ritchie](http://en.wikipedia.org/wiki/Dennis_Ritchie)在贝尔实验室里捣鼓他们的新玩意时，他们肯定没有想到他们的小发明将来会在全世界发挥如此大的影响力。他们决定把他们所创造的这个支持多用户多任务的新操作系统命名为[UNIX](http://en.wikipedia.org/wiki/UNIX)，以一个32位二进制数所能表示的有符号整数范围（-2,147,483,648 ~ +2,147,483,647）所代表的秒数作为[Unix纪元（Unix epoch）时间](http://en.wikipedia.org/wiki/Unix_time)，把西元1970年1月1日0时0分0秒定为Unix纪元的元年。

在Unix历的约第100,000,000秒（或者，用人类的纪年法，大约在西元1972~1973年之间），一种叫做[C](http://en.wikipedia.org/wiki/C_\(programming_language\))的高级程序语言被发明出来了。于是，贝尔实验室的这帮人用C语言重写了他们的UNIX系统内核，很自然地，系统库中用于存储时间的`time_t`类型的`typedef`定义，就采用了C语言中对应的32位有符号整型（`signed int32`）来实现。

起初，一切都很好。UNIX走出了贝尔实验室中少数研究人员的小圈子，得到了工业界的青睐，好几家商业公司都发行了自己的Unix变体，其中包括最早的商业版[UNIX System V](http://en.wikipedia.org/wiki/UNIX_System_V)以及后来的[IBM AIX](http://en.wikipedia.org/wiki/IBM_AIX)、[HP-UX](http://en.wikipedia.org/wiki/HP-UX)、SGI的[IRIX](http://en.wikipedia.org/wiki/IRIX)和微软的[Xenix](http://en.wikipedia.org/wiki/Xenix)，它们被广泛用在各式大中小型主机和服务器上。到了80年代初，当时在麻省理工大学[人工智能实验室](https://plus.google.com/photos/100974147585154622588/albums/5537441647015301921/5537448790573594514)工作的一个[大胡子黑客](http://en.wikipedia.org/wiki/Richard_Stallman)不满于Unix这种专有软件的闭源开发模式，他决定重写一个完全自由的仿Unix操作系统，但又不是Unix，这就是后来的[GNU (GNU is Not Unix) Project](http://en.wikipedia.org/wiki/GNU_Project)；与此同时，在西海岸，UC Berkeley的[另一群黑客](http://en.wikipedia.org/wiki/Bill_Joy)获得了一部分来自最初贝尔实验室的Unix原始代码，他们在此基础上开发出属于自己的一套“伯克利软件发行包（Berkeley Software Distribution）”，这演变成了后来的[BSD家族](http://en.wikipedia.org/wiki/Berkeley_Software_Distribution)。很快，时间已经到了Unix纪元的第31年，在大洋彼岸的北欧国家芬兰，一个[年轻大学生](http://en.wikipedia.org/wiki/Linus_Torvalds)自己写了一个仿Unix内核，受到当时GNU发起的自由软件运动的影响，他决定把这个内核以GPL协议发放出来，让全世界的黑客们来共同使用、参与开发。恰好那时GNU操作系统还没有自己的成熟内核，这个后来被命名为“[Linux](http://en.wikipedia.org/wiki/Linux)”的仿Unix内核借着与GNU Project的结合获得了广泛的成功与关注。最终，就有了我们今天所使用的GNU/Linux。在很长一段时间里，不管是真正的Unix和由它直接衍生而来的BSD、Solaris，还是试图“仿造出”Unix的GNU/Linux，抑或是为了统一各种类Unix（*nix）系统而生的POSIX标准，所有的类Unix系统都把`time_t`类型理所当然地等价为C语言中的原生数据类型`signed int32`，无数的库和工具被基于它写出来，很多网络上的服务与应用也是基于这个事实的标准。

终于有一天，人们意识到，32 bits整数所能表示的数目大小毕竟是有限的，更何况这个数字是以秒作为单位。对于正在各行各业发挥着越来越重要作用的类Unix系统来说，当初的设定显然也太目光短浅了些。

32位有符号整型所能表示的最大数是+2,147,483,647。2147483647秒 = 24855天 = 68年。也就是说，自Unix纪元的元年（1970年）起，再过68年，所有现存的32位类Unix系统都将迎来历法上的终结——对+2,147,483,647加1将造成一个算术溢出：在大部分系统上，返回值会变成-2,147,483,648，在少数系统上，返回值可能是0。许多依赖于系统时间的程序将无法正常工作，计算机的时钟也将退回到1901年（或者1970年）。它们将无法正确处理那之后的时间。

这个准确的时刻是：协调世界时2038年1月19日3时14分7秒（未考虑闰秒）。你可以在维基百科上找到[更多的信息](http://en.wikipedia.org/wiki/Year_2038_problem)。

![](http://upload.wikimedia.org/wikipedia/commons/e/e9/Year_2038_problem.gif)



## 更多的“xx”年问题

除了[2038年问题（Y2K38）](http://en.wikipedia.org/wiki/Year_2038_problem)和较为人熟知的[千年虫问题（Y2K）](http://en.wikipedia.org/wiki/Year_2000_problem)之外，还有其他更多由于计算机内部年份表示所造成的问题，可以参考[这里](http://ja.wikipedia.org/wiki/%E5%B9%B4%E5%95%8F%E9%A1%8C#.E3.82.B3.E3.83.B3.E3.83.94.E3.83.A5.E3.83.BC.E3.82.BF.E3.81.AE.E6.99.82.E5.88.BB.E5.87.A6.E7.90.86.E3.81.AB.E9.96.A2.E3.82.8F.E3.82.8B.E5.95.8F.E9.A1.8C)。

一个与Unix的2038年问题相类似的是NTP协议的[2036年问题](http://en.wikipedia.org/wiki/Network_Time_Protocol#NTP_timestamps)。NTP协议的时间戳采用了和Unix相似的32位整数表示，不同于Unix的1970 ± 68年范围，NTP使用的是无符号整型，并且以1900作为时间的起点，这意味着它的终点将是1900 + 136 = 2036年2月6日。

和2038年问题直接相关的两个历史事件是[2001年9月9日问题](http://ja.wikipedia.org/wiki/2001%E5%B9%B49%E6%9C%889%E6%97%A5%E5%95%8F%E9%A1%8C)和[2004年日本银行ATM机故障](http://itpro.nikkeibp.co.jp/free/NC/NEWS/20040202/139212/)：

[2001年9月9日问题](http://ja.wikipedia.org/wiki/2001%E5%B9%B49%E6%9C%889%E6%97%A5%E5%95%8F%E9%A1%8C)又被称作S1G（Second 1 Giga，一吉秒）或者S1B（Second 1 Billion）问题。在那一天，Unix纪元时间迎来了第1,000,000,000秒，由于某些软件中使用了字符串来存储时间戳，当字符串变成`"1000000000"`时，字典排序的结果会产生`"999999999" ＞ "1000000000"`，这造成了相当一部分程序不能正常判断时间差，影响到正常工作。（我一直以为只有不上路子的2B程序员才会这么去做判断，没想到还真不少，[包括KDE在内](http://en.wikipedia.org/wiki/Unix_time#Notable_events_in_Unix_time)。。。）

2004年1月10日恰好是1970年到2038年时间轴上的中点——显然，如果你在程序中出于某种目的将Unix时间乘以了2，那么它将不能正常工作。这在日本某些银行使用了IBM软件的ATM机上[确实发生了](http://itpro.nikkeibp.co.jp/free/NC/NEWS/20040202/139212/)。（至于究竟为什么要把时间乘以2，我只能表示不明觉厉。）

你可能除了千年虫问题之外还听说过[民国百年虫](http://zh.wikipedia.org/wiki/%E6%B0%91%E5%9C%8B%E7%99%BE%E5%B9%B4%E8%9F%B2)和[昭和100年](http://ja.wikipedia.org/wiki/%E6%98%AD%E5%92%8C100%E5%B9%B4%E5%95%8F%E9%A1%8C)、[平成100年问题](http://ja.wikipedia.org/wiki/%E5%B9%B3%E6%88%90100%E5%B9%B4%E5%95%8F%E9%A1%8C)。（台湾和日本的程序员，为什么你们要在程序内部拿年号纪元来存储时间……）

可以肯定地说，全世界的程序员都是一群爱偷懒的货。



## 轻松一刻

在2001年S1B问题发生之前的4月19日，恰好迎来了Unix纪元的第987,654,321秒。虽然没什么实质意义（估计没有哪个程序会无聊到去计算时间戳中不同数字的个数），但这还是在[Slashdot](http://tech.slashdot.org/story/01/04/17/1915221/the-quickly-descending-unix-timestamp)上激起了不少讨论。

有人写了这么个段子：（高端黑。。。）

_我已经等不及在MSNBC频道上看到这样的新闻了：_

_Redmond WA._  
_今天，Bill Gates友情提醒大家，所有的\*nix系统将会遭遇即将到来的9月9日所导致的S1B问题。MSNBC推荐所有的*nix用户立即尽可能早地迁移到Windows XP。据报道，Steve Balmer表示他“惊讶于\*nix的设计竟是如此地目光短浅”。XP从最初起就被设计成完全免除于S1B问题，只要在9月份的某个时候安装了我们发布的SP8之后。所有你们这些Windows用户将会是保证安全的，你们根本无需去考虑使用那些流氓操作系统。_

2009年2月13日11:31:30，是Unix纪元的第1,234,567,890秒。这天刚好是星期五，又是一个13号，也就是西方文化中所谓的[黑色星期五](http://zh.wikipedia.org/wiki/%E9%BB%91%E8%89%B2%E6%98%9F%E6%9C%9F%E4%BA%94)。世界各地不少Unix社区都在举办活动庆祝此事，包括Google的hackers们。他们甚至还做了一个Doodle：

![](http://www.google.com/logos/unix1234567890.gif)

<http://www.google.com/logos/unix1234567890.gif>

（Doodle这东西真是今非昔比。三年前还是如此简陋，再看看现在的……）

我以为国内基本上不会有人对这种过于geek的事情感兴趣，不过终于还是在酷壳上面[发现了一篇](http://coolshell.cn/articles/19.html)。

话说国内的技术社区真是缺乏娱乐精神啊。（还是说真正的Unix用户不多呢？虽然只是为了新奇玩玩Linux桌面的人倒是不在少数）



## 从32位到64位

解决2038年问题的办法看似很简单：因为`time_t`类型本来就是依赖于C POSIX库的具体实现的，并没有哪个规范规定它必须是32位，直接把它改成64位不就行了吗？

问题是，直接这么改，会破坏很多现有程序（工具、服务……）的兼容性。几乎所有的32位系统都自然而然地采用了32位的`time_t`，这其中包括了现在绝大多数基于ARM处理器的电子产品（只要它们的底层系统是基于类Unix的——这包括iPad、iPhone、所有Android手机、PS Vita还有Raspberry Pi等等）。

当然你大可不必担心你的手机会遭遇2038年问题，因为你现在的手机大概不会一直用到2038年（也许再过几个月你就会淘汰掉旧的去换新的了！）。剩下来的，就是桌面和服务器所要面临的问题了。

所幸的是，摆脱了嵌入式设备的局限性，我们在桌面和服务器上已经有了众多的64位体系架构可供选择。而且，目前绝大多数的64位操作系统，也都自然而然地采用了64位`time_t`类型（相当于`long long int`或者`int64`）。

问题解决了。只要我们可以预期现有的计算机都能在2038年之前迁移到64位系统（准确地说，是采用了64位`time_t`的系统），Unix纪元就不会迎来末日。到了那一天，所有的计算机系统仍然能正常工作，人类文明完好如初。

传统的32位Unix纪元时间会在2038年发生算术溢出，然后迎接末日。64位纪元当然也是会有这一天的，那将是在：

__15:30:08 UTC on Sun, 4 December 292,277,026,596__

这个时间已经远远超过了预计太阳扩张成红巨星并吞噬地球的时间。所以，在此之前，已经没有什么好担心的了。我确信，要么人类文明要么根本都熬不到那一天，要么等到那一天，我们早就达到了拥有任意操纵时间和空间的能力的技术奇点，人类文明将获得永生（跑题了。。。）；要么就是，所有的电脑都已经迁移到了128位。（这当然是最简单的解决办法）



## 你的系统如何？

想知道自己的Unix系统是否会在2038年1月19日这一天迎来末日，只要看系统能否正确显示Unix纪元第2,147,483,648秒的日期即可。

在GNU/Linux上，执行：（GNU date）

    $ date -ud @2147483648

在BSD上，执行：（BSD date）

    $ date -u -r 2147483648

如果系统使用了64位时间，结果应该是正常的：（后文中假定时区一律设为`export TZ="UTC"`）

    Tue Jan 19 03:14:08 UTC 2038

那么恭喜，你的系统可以平安无恙地度过2038年末日。如果出现1901年或者其他神马奇怪结果的话，自己看着办吧。

另：Unix是否会发生2038年问题并不绝对取决于是32位系统还是64位系统。这由具体系统中对`time_t`类型的实现决定。NetBSD和OpenBSD的早期版本在amd64平台上仍然使用了32位`time_t`，因此[仍然会发生2038年问题](https://groups.google.com/forum/?fromgroups=#!msg/comp.unix.bsd.freebsd.misc/uDyi9y3l0SE/JWV-hdsJ6ZcJ)。如今也有一些32位系统开始使用64位的`time_t`类型（典型的例子：今年10月份发布的NetBSD 6.0，在32位和64位平台上一律改成了64位`time_t`）。64位Linux上已经在使用64位的`time_t`了，而32位Linux上则似乎仍然是32位。这是我所能知道的。



## 你的编程语言呢？

绝大多数从Unix/Linux平台上发展起来的编程语言都采取了和Unix纪元相同的时间点（1970年1月1日）[作为时间的起点](http://en.wikipedia.org/wiki/Epoch_\(computing\)#Computing)：C/C++，Perl，PHP，Python，Java，JavaScript，等等。

C语言的情况比较特殊，因为`time_t`的大小是直接与系统平台上C POSIX库的实现相关的，所以在没有2038年问题的64位系统上，`time_t`也是64位；在存在2038年问题的Unix系统上，`time_t`则是32位（这不废话么。。。）。（这也是为什么从原则上说你无法在AVR/Arduino上使用`time_t`类型的原因，因为嵌入式设备如果没有操作系统自然也就不存在这些C POSIX库的说法，更不会受到2038年问题的影响）

Perl和CPython的标准实现是高度依赖于C POSIX库的，这意味着它们也许在32位系统上同样存在2038年问题。（我没有32位系统，没试过所以不知道……）

Java是一个真正意义上的__跨平台__语言，它所提供的虚拟机环境不像Python或者其他语言那样大量依赖系统平台的native API库，这意味着它的时间表示在任何平台上都统一采用了64位（即使一开始不是这样设计的，至少也是从某个语言版本开始改成了64位实现），这将不受具体系统对`time_t`类型实现的约束（在非Unix平台的Windows上亦是如此）。



## 模拟Unix纪元的末日

前面已经有过一个GIF动画来模拟Unix系统时钟溢出的场景了。如果想在自己的Unix/Linux上亲眼看一看末日是怎样降临的话，这里是一个C语言的演示程序：

<script src="https://gist.github.com/4360400.js"></script>

在32位Linux上可以直接编译：

    $ gcc -o goodbye_world goodbye_world.c -lcurses
    $ ./goodbye_world

在64位Linux上，需要预先安装相应的GCC 32位库支持（gcc-multilib）和lib32-ncurses，然后指定用32位来编译：（直接拿64位库编译的话世界末日是不会降临的哦）

    $ gcc -m32 -o goodbye_world goodbye_world.c -lcurses

（本来是想用bash写个更轻量级的演示的，无奈Shell的及早求值实在是太坑爹了，折腾半天也没弄出来。。。囧rt）



## 文件系统的时间戳（Timestamp）

世界末日模拟完，娱乐一把，本来就该到此结束了。忽然又想到这个问题，稍微研究了一下，觉得值得写一写。

把操作系统的`time_t`从32位迁移到64位，看似完美地解决了系统时钟的2038年问题，但是事情远没有这么简单。以下这段话原封不动摘自Wikipedia：

_While this solves the problem for executing programs, it does not, however, solve the problem of storing date values within binary data files, many of which employ rigid storage formats._

前面所提到的2038年问题的解决方案仅仅是针对Unix本身的操作系统时间而言。你也许已经知道，在Unix的大多数典型的文件系统上，文件inode的元数据（包括文件的用户、组、权限和时间戳这些附加信息）被存储在一个特殊的叫做inode table的附加区域上，而这个元数据域的宽度对于每种特定的文件系统来说显然是固定不变的，也就是说，即使你把操作系统从32位升级到了64位，现有文件系统上时间戳的数据宽度限制也不会改变。换言之，除非你升级了文件系统或者把数据迁移到新的分区上，否则，这些文件的时间戳仍然会受到旧时代文件系统的32 bits限制。

下面的内容略技术硬核。欢迎熟悉Linux的文件系统这部分实现的童鞋围观指正……

[Wikipedia上面](http://ja.wikipedia.org/wiki/2038%E5%B9%B4%E5%95%8F%E9%A1%8C#.E7.B5.8C.E7.B7.AF)已经清清楚楚地写着ext2、ext3、ReiserFS都会受到2038年问题的影响。这几个都是比较老的文件系统，很容易推测它们的inode时间戳都采用了和早期32位Unix相同的32位`signed int`来存储。正好我的硬盘上也没有这些文件系统，于是就不用去考虑它们了。

我所要研究的对象是ext4，Linux上用来接替ext3的新一代文件系统，也是我硬盘分区所使用的主要文件系统。

再次引用[维基娘](http://en.wikipedia.org/wiki/Ext4#Features)的一段话：

_As computers become faster in general and as Linux becomes used more for mission-critical applications, the granularity of second-based timestamps becomes insufficient. To solve this, ext4 provides timestamps measured in nanoseconds. In addition, 2 bits of the expanded timestamp field are added to the most significant bits of the seconds field of the timestamps to defer the year 2038 problem for an additional 204 years._

根据我查到的信息，ext4在inode时间戳上的改进体现在两处：一、加入了用以表示纳秒的位，记录时间戳能够精确到以纳秒为单位，以应对现代计算机日益增长的速度和时间精确度需求（尤其是在NFS上面），而Unix本身的系统时间单位只精确到秒；二、加入了两个额外的用以表示秒的位，将2038年问题推迟了额外的204年。

204年这个结果看似相当合理。增加了2个二进制位，68 x 2^2 = 272年，再减去已经过去的68年，ext4到了2038年之后还能再继续撑204年，大约到2242年为止。然而，维基百科的“Date range”一栏，却写着一项与上面204年的说法相矛盾的数据：__14 December 1901 - 25 April 2514__，此外，[这篇博客](https://heiher.info/291.html#1.12.)上的说法也是“把2038问题的发生推迟了大约500年”。

到底孰真孰假，只有自己试了才知道。首先，设置环境时区一律为UTC，这是为了计算和比较的便利（本人在CET区，一年中的日期有时是UTC+1有时是UTC+2，坑爹的夏令时啊>_<）：

    $ export TZ="UTC"

创建一个任意内容的新文件：

    $ echo Bazinga! > Sheldon

用`touch`命令把文件的mtime时间戳改到2080年（这个日期在2038年世界末日之后……至于为什么是2080年你懂的。但愿Sheldon他老人家能活到那个时候）：

    $ touch -m -t 208010171017.50 Sheldon

把atime时间戳改到2106年2月7日的某个时候（后面会解释这样做的原因）：

    $ touch -a -t 210602070628.16 Sheldon

准备就绪。用`ls -i`查看文件的inode号：

    $ ls -i Sheldon
    4089151 Sheldon

用`ls -lu`、`ls -l`和`ls -lu`这几个命令可以分别查看文件的atime、mtime和ctime时间戳。在当前系统下，它们一切显示正常：

    $ ls -lu Sheldon
    -rw-r--r-- 1 soimort users 9 Feb  7  2106 Sheldon
    
    $ ls -l Sheldon
    -rw-r--r-- 1 soimort users 9 Oct 17  2080 Sheldon
    
    $ ls -lc Sheldon
    -rw-r--r-- 1 soimort users 9 Dec 23 00:50 Sheldon

也可以用系统的`stat`命令来查看详细的inode信息（包括了所有三个时间戳在内）：

    $ stat Sheldon
      File: ‘Sheldon’
      Size: 9         	Blocks: 8          IO Block: 4096   regular file
    Device: 809h/2057d	Inode: 4089151     Links: 1
    Access: (0644/-rw-r--r--)  Uid: ( 1000/ soimort)   Gid: (  100/   users)
    Access: 2106-02-07 06:28:16.000000000 +0000
    Modify: 2080-10-17 10:17:50.000000000 +0000
    Change: 2012-12-23 00:50:05.746118609 +0000
     Birth: -

如果有[Sleuth Kit](http://www.sleuthkit.org/sleuthkit/)工具包，可以试着用它的`istat`来查看一下inode信息：

    $ sudo istat /dev/sda9 `ls -i Sheldon | cut -d" " -f1`
    inode: 4089151
    Allocated
    Group: 499
    Generation Id: 1058790298
    uid / gid: 1000 / 100
    mode: rrw-r--r--
    Flags: 
    size: 9
    num of links: 1

    Inode Times:
    Accessed:       Thu Jan  1 00:00:00 1970
    File Modified:  Thu Oct 17 10:17:50 2080
    Inode Modified: Sun Dec 23 00:50:05 2012

    Direct Blocks:
    127754

这里，则是`debugfs`工具的输出结果：

    $ echo "stat /soimort/Sheldon" | sudo debugfs /dev/sda9
    debugfs 1.42.3 (14-May-2012)
    debugfs:  stat /soimort/Sheldon
    Inode: 4089151   Type: regular    Mode:  0644   Flags: 0x80000
    Generation: 1058790298    Version: 0x00000000:00000001
    User:  1000   Group:   100   Size: 9
    File ACL: 0    Directory ACL: 0
    Links: 1   Blockcount: 8
    Fragment:  Address: 0    Number: 0    Size: 0
     ctime: 0x50d6553d:b1e37744 -- Sun Dec 23 00:50:05 2012
     atime: 0x00000000:00000001 -- Thu Jan  1 00:00:00 1970
     mtime: 0xd0669d4e:00000000 -- Thu Oct 17 10:17:50 2080
    crtime: 0x50d6549a:0a32e390 -- Sun Dec 23 00:47:22 2012
    Size of extra inode fields: 28
    EXTENTS:
    (0):16287283
    debugfs:  %

于是发现，`istat`和`debugfs`在ext4文件系统上能够解释出2080年（在2038年后）的时间戳，但是仅仅到了2106年2月7日06:28.15（UTC）就为止了！从该时间以后（2106年2月7日06:28.16），这些诊断工具显示的时间戳将倒回1970年。

ext4为inode table中的每个时间戳分配了额外的2 bits，因此它所能表示的年份范围，怎么看都不会只到2106年为止（每增加1个bit就得把原来的范围乘以2么）。Linux系统本身的`stat`能够正确地解释这些2106年以后的时间戳，而`istat`和`debugfs`却不能，这个，只能说是这些诊断工具没能完全兼容ext4标准导致的错误了。比较一下`debugfs`在atime时间戳溢出前后的两次输出：（信息量略大）

    $ touch -a -t 210602070628.15 Sheldon
    $ echo "stat /soimort/Sheldon" | sudo debugfs /dev/sda9
     atime: 0xffffffff:00000000 -- Sun Feb  7 06:28:15 2106

    $ touch -a -t 210602070628.16 Sheldon
    $ echo "stat /soimort/Sheldon" | sudo debugfs /dev/sda9
     atime: 0x00000000:00000001 -- Thu Jan  1 00:00:00 1970

前32位是Unix时间的秒，后32位是ext4中新增加的用于表达纳秒的位——准确地说，是30位：只有前30位被真正地用来存储纳秒值，低端的2位则被用来扩展秒的存储位数。也就是说，2106年2月7日06:28.16这个时刻真正的秒数值是0x0100000000（实际占用33位，超过了ext3传统的标准32位），纳秒数值则为0。而`debugfs`（和`istat`）直接无视ext4扩充的2位，直接把这个秒数当作32位数0x00000000来识别处理，自然也就回到了Unix纪元的原点——1970年1月1日0时0分0秒。

0xffffffff本来似乎是一个有符号整型（转换成十进制的话是-1），应该被解释成1969年12月31日23时59分59秒才对——但是估计考虑到不会有人特地去创建时间戳在那个时候的文件，看起来也不大可能有1970年之前创建的文件被流传下来，`debugfs`就把它自动当作一个无符号整型来识别了。所以，即使是在存在2038年问题的32位系统上，`debugfs`仍然会显示出2106年2月7日这样的时间戳日期，因为`debugfs`这类工具把32位有符号整型当作无符号整型来用了——不过2106年2月8日之后当然肯定是不行滴。

接下来要做的事情，就是看一下这些元数据是怎样在inode table中实际存储的。首先通过`debugfs`的imap定位出文件的inode table所在的block（注意不是inode指针所指向的direct或indirect block位置，而是__inode table信息自身所在__的block位置：

    $ echo "imap /soimort/Sheldon" | sudo debugfs /dev/sda9
    debugfs 1.42.3 (14-May-2012)
    debugfs:  imap /soimort/Sheldon
    Inode 4089151 is part of block group 499
	    located at block 16254579, offset 0x0e00
    debugfs:  % 

可以看到相应的inode table在分区的第16254579个block，偏移量0x0e00（十进制数3584）。用`dd`可以把这部分数据直接dump成一个文件（大小不多不少正好256字节，这个是由[ext4中inode结构的实现](https://ext4.wiki.kernel.org/index.php/Ext4_Disk_Layout#Extended_Attributes)所决定的）：

    $ sudo dd if=/dev/sda9 ibs=4096 skip=16254579 count=1 \
    > | dd ibs=1 skip=3584 count=256 > Sheldon.inode
    1+0 records in
    8+0 records out
    4096 bytes (4.1 kB) copied, 6.3151e-05 s, 64.9 MB/s
    256+0 records in
    0+1 records out
    256 bytes (256 B) copied, 0.00395504 s, 64.7 kB/s

用GHex查看（注意用颜色框出来的部分）：

<img src="http://i.imgur.com/qMxd3.png" width="100%" />

再拿它与`debugfs`的结果作比较（只看3个时间戳的二进制位）：

    $ echo "stat /soimort/Sheldon" | sudo debugfs /dev/sda9
    debugfs 1.42.3 (14-May-2012)
    debugfs:  stat /soimort/Sheldon
    Inode: 4089151   Type: regular    Mode:  0644   Flags: 0x80000
    Generation: 1058790298    Version: 0x00000000:00000001
    User:  1000   Group:   100   Size: 9
    File ACL: 0    Directory ACL: 0
    Links: 1   Blockcount: 8
    Fragment:  Address: 0    Number: 0    Size: 0
     ctime: 0x50d6566a:5c0fc258 -- Sun Dec 23 00:55:06 2012
     atime: 0xffffffff:00000000 -- Sun Feb  7 06:28:15 2106
     mtime: 0xd0669d4e:00000000 -- Thu Oct 17 10:17:50 2080
    crtime: 0x50d6549a:0a32e390 -- Sun Dec 23 00:47:22 2012
    Size of extra inode fields: 28
    EXTENTS:
    (0):16287283
    debugfs:  %

可以发现：

* 前一个红色方框是atime的32 bits秒数域，后一个红色方框是ext4中新增加的附加域（包含30 bits纳秒数 + 2 bits秒数）；
* 前一个蓝色方框是ctime的32 bits秒数域，后一个蓝色方框是ext4中新增加的附加域（包含30 bits纳秒数 + 2 bits秒数）；
* 前一个绿色方框是mtime的32 bits秒数域，后一个绿色方框是ext4中新增加的附加域（包含30 bits纳秒数 + 2 bits秒数）；
* 橙色方框中是crtime的秒数域以及附加域。crtime是ext4中新增加的一个域，用来作为文件创建时间的时间戳（你也许已经知道，以前的Linux文件系统上并没有“文件创建时间”的说法，这包括ext2和ext3）。正如[Theodore Ts'o](https://plus.google.com/117091380454742934025/)（Linux的核心开发者之一，ext3和ext4的主要设计者）所指出的那样，在ext4设计之时，增加一个额外的crtime域很容易就能办到；然而，要让现有的库（包括Linux的`stat()`系统调用）去支持新增加的域并和旧版本保持兼容，却远非一件易事，这需要不同项目之间的协作（我觉得这主要说的是Linux和GNU……）。所以直到目前为止，crtime域对用户程序仍然是不可见的，不仅任何桌面环境的文件管理器中都看不到“文件创建时间”一项，`stat`命令也不会显示出crtime域。你只有自己去读文件系统的inode table，或者使用`debugfs`这类诊断工具才能看得到它。

回到最初的问题上去，ext4的时间戳究竟会在哪一年停摆，或者说，在2038年之后还能再撑多少年？果真是如前面计算的那样（和维基百科的说法一致）是68 x (2^2 - 1) = 204年，还是476年？

从前面的结果我们看到，在ext4文件系统上，如果一个inode table的atime时间戳值被设为：

    atime: 0x00000000:00000001

这个时间戳代表的真实时间值（0x0100000000 = 1 x 2^32 = 4294967296），显然应该以`stat`命令（这个命令依赖于`stat()`系统调用）的结果为准：

    Sun Feb  7 06:28:16 UTC 2106

我们知道，ext4上扩充后的时间戳位数是32 + 2 = 34，所能表示的最大整数值应该是0x03FFFFFFFF = 4 x 2^32 - 1 = 17179869183。它所代表的实际时间是：

    $ date -d @17179869183
    Wed May 30 01:53:03 UTC 2514

（按照这个计算，ext4时间戳所能表示的日期范围应该是从1 Jan 1970到30 May 2514——我没能搞明白维基百科上“Date range”一栏的14 December 1901 - 25 April 2514这个数据到底是怎么算出来的，因为34 bits秒数所能表示的年份跨度显然不可能超过544年）

不妨试着把时间戳改到这个点，再用`stat`看看：

    $ touch -a -t 251405300153.03 Sheldon
    $ stat Sheldon | grep "Access: [^(]"
    Access: 2514-05-30 01:53:03.000000000 +0000

你看到了，__看起来__ext4似乎确实能够存储直到2514年的日期。这可以理解为系统把0x03FFFFFFFF当作了无符号整型来处理，所以1970 + 68 x 8 = 2514——这是它所能表示的最大年份。确实，谁会需要用到一个1970 ± 68 x 4范围的时间戳呢？谁的Unix系统会穿越到19世纪以前去修改文件呢？

2514 - 2038 = 476，所以，ext4到底在2038年之后还能继续使用多少年，大约476年才是正确答案，而不是204年。

得到这个结论看似很合理，2514年5月30日，对于现代的我们来说已经足够遥远了。不过，它仍然算不上是一个“正确”的答案——你将会看到为什么。

虽说64位的Linux已经能够处理直到3千亿年以后的系统时间，但是，由于ext4的inode时间戳的34位限制，它最多也只可能保存到2514年的时间戳信息（btw，除非利用到文件系统上一个额外的叫做[xattr](http://en.wikipedia.org/wiki/Extended_file_attributes)的区域，这点暂不讨论，因为这和具体的文件有关，文件系统本身并不解释这部分额外的信息）。

现在，如果你手头正好用的是64位Linux和ext4分区，不妨试着把文件的atime时间戳改到西元9999年的12月31日（因为`touch -t`所能识别的格式字符串有长度限制，所以这里没有用10000年以后的时间）：

    $ touch -a -t 999912312359.59 Sheldon
    $ stat Sheldon | grep "Access: [^(]"
    Access: 9999-12-31 23:59:59.000000000 +0000

很奇怪不是吗。ext4上inode的34位时间戳绝对没有可能存储得了西元9999年这样的时间，本来你应该期望它退回过去的某个时间点，但是系统的`stat()`调用却给了你原来分配的准确时间戳，即使这个时间戳在ext4中已经大大地越界了。问题出在哪里？



## 虚拟文件系统（VFS）的时间戳

其实说穿了，也没什么好奇怪的。是因为Linux内核与真实的文件系统驱动之间的通信，基于[虚拟文件系统（Virtual File System, VFS）](http://en.wikipedia.org/wiki/Virtual_file_system)这样一个中间层。

当你作为用户态改写一个文件时，它的inode变动并不会立即被写入到ext4分区上去；同样，当你执行系统的`stat()`调用时，它也并不总是直接去读取真实的ext4分区上的inode信息。

`stat()`系统调用读取的其实是VFS inode，存在于VFS中的inode cache缓存区域（参考：<http://www.tldp.org/LDP/tlk/fs/filesystem.html>）。类似地，通过系统调用写入文件的inode时，实际上写的也是VFS inode。这一点在BSD中也许能看得更明显，因为Linux kernel中对应的结构实现是`struct inode`，而BSD中则被命名为`vnode`（v代表virtual file system layer，这有助于将其和真实文件系统的inode相区分）。（参考自：<http://en.wikipedia.org/wiki/Inode>）

嗯，当然inode是不会一直放在VFS的缓存里的。执行`umount`的时候，你告诉系统这个分区的任务已经结束了，然后系统就会自动把未写入实际文件系统上的inode信息给写回去，清理VFS缓存。（这也是为什么你需要在拔掉移动硬盘前先去unmount、以及为什么系统关机的时候会去自动unmount每个分区的原因。如果不这样做，这些VFS中的inode缓存信息就可能会丢失）

这与实际文件系统的时间戳有什么关系呢？总结起来，一句话：你所看到的时间戳可能并不是真实的存储在ext4文件系统上的时间戳，而是VFS inode cache中临时存储的时间戳。要想知道真实ext4文件系统上的inode时间戳，最简单的办法，就是卸载掉分区之后再重新挂载，这样就可以保证VFS中的inode cache被确实地写到了真实文件系统里。

这么一来，提醒了我们前面直接修改过时间戳之后用`stat`看到的也许不是真实ext4文件系统上存储的时间戳信息。不妨来做一个试验。首先挂载所要用的分区（我用了另外一个单独的ext4分区，毕竟要反复地挂载卸载什么的）：

    $ sudo mount -t ext4 /dev/sda8 /run/media/soimort/sda8

创建一个atime时间戳为2446年5月10日22:38.55（UTC）的文件（暂时先别管这个日期是怎么来的。如果之前关于ext4能在2038年之后继续使用476年的推测是正确的话，那么显然，2446年应该在inode时间戳的“合法”范围之内）：

    $ touch -a -t 244605102238.55 /run/media/soimort/sda8/mort/Sheldon

重新挂载分区，确保inode table已经写入实际文件系统。再查看atime时间戳：

    $ sudo umount /dev/sda8;\
    > sudo mount -t ext4 /dev/sda8 /run/media/soimort/sda8;\
    > stat /run/media/soimort/sda8/mort/Sheldon | grep "Access: [^(]"
    Access: 2446-05-10 22:38:55.000000000 +0000

时间戳显示正常。

再把atime时间戳改到下一秒钟的2446年5月10日22:38.56（UTC）：

    $ touch -a -t 244605102238.55 /run/media/soimort/sda8/mort/Sheldon

重新挂载分区，确保inode table已经写入实际文件系统。再查看atime时间戳：

    $ sudo umount /dev/sda8;\
    > sudo mount -t ext4 /dev/sda8 /run/media/soimort/sda8;\
    > stat /run/media/soimort/sda8/mort/Sheldon | grep "Access: [^(]"
    Access: 1901-12-13 20:45:52.000000000 +0000
    
时间跳回1901年了。也就是说，2446年5月10日22:38.55（UTC）这个点存储在ext4文件系统中的时间戳可以被`stat`正常解析，但是2446年5月10日22:38.56（UTC）却不能！这推翻了我们之前关于ext4可以正常用到2514年的那个推测。

事实上，我很快就发现，在时间戳被确实写入ext4文件系统之后，它甚至连2038年1月19日都撑不过去：

    $ touch -a -t 203801190314.08 /run/media/soimort/sda8/mort/Sheldon
    $ sudo umount /dev/sda8;\
    > sudo mount -t ext4 /dev/sda8 /run/media/soimort/sda8;\
    > stat /run/media/soimort/sda8/mort/Sheldon | grep "Access: [^(]"
    Access: 1901-12-13 20:45:52.000000000 +0000

也就是说，当ext4中的inode时间戳被真正修改之后，尽管它可以保存有34位的数据宽度，但是系统的`stat`却只认前面的32位，而且是把它当作有符号整型——即使是在64位Linux上。可以理解这是`stat()`系统调用为了同以前的ext2、ext3保持兼容，但这也使得ext4为了解决2038年问题而新增加2位所做的努力变得形同虚设。

举例来说，在2038年世界末日前一秒的时间戳，inode table的dump结果：

    atime: 0x7fffffff:00000000 -- Tue Jan 19 03:14:07 2038

0x7fffffff作为一个有符号整型，相当于十进制的+2147483647，这是32位时间戳所能表示的最大Unix时钟值。

下一秒的时间戳：

    atime: 0x80000000:00000000 -- Tue Jan 19 03:14:08 2038

0x80000000作为一个有符号整型，相当于十进制的-2147483648，因此，`stat()`调用得到的inode时间戳是：（在VFS缓存写入实际文件系统之后）

    Access: 1901-12-13 20:45:52.000000000 +0000

要想利用ext4中额外增加的2 bits来扩充时间戳的长度，一个必要条件是系统把0x7fffffff的下一秒钟（0x80000000）当作正整数来解析，只有这样才能保证时间戳的连续性。如果这样的话，`stat()`调用把0x80000000识别出来的时间应该是：

    Access: 2038-01-19 03:14:08.000000000 +0000

然而，这么做就破坏了原有代码（和文件系统）的兼容性！想一想，在原来的旧文件系统上，0x80000000这个时间戳毫无疑问，表示的只能是1901年；而现在，它将被解析成2038年。而且，原来的所有从1901年12月13日到1969年12月31日之间的时间戳都将造成错误——它们将被解释成2038年之后的时间。虽然我不认为保持这样的兼容性很重要（1970年之前甚至都没有Unix系统——为什么Ken Thompson当初会想到用有符号整型而不是直接拿无符号整型来表示时间？），不过显然，现有的代码不可能做出这么轻率的改动，也就是说，在未来可预见的一段时期内，`stat()`系统调用的结果还将和原来保持兼容——32位有符号整型，过了0x7fffffff就把一切时间戳都解释为负数，+2147483647的下一个数将是-2147483648。

所以，回到最初的问题上，ext4这新增加的2 bits到底能把2038年问题推迟多长时间？204年，还是476年？我认为，从现实的角度来说，这个答案是：0。

说是204年或者476年，从理论上都没有错，这取决于具体的系统（如果有这样的系统的话）怎样去实现，是把这个34位数当作有符号数还是无符号数。但是就现有的GNU/Linux系统而言，只要`stat()`与原来的版本保持兼容性一天，它就必须得保持32位有符号时间戳的处理方式一天。如今，几乎你所能见到的绝大多数执行文件操作的用户程序都直接或间接地调用了`stat()`（除了一些底层的文件系统处理和诊断工具之外）。因此，虽然Linux的VFS本身能够完美地向ext4的inode table写入34位的时间戳，记录直到500年后的时间，但是，至少对于所有基于现有`stat()`系统调用的用户程序而言，ext4这增加的2 bits并没有发挥什么实际的作用。



## 补充：关于stat()和VFS的一些理解

* 系统调用`stat()`并不直接从实际文件系统中读取inode信息。它需要经过操作系统提供的VFS这个中间层。VFS实际上可以看成是Linux提供给高阶的用户应用程序（比如，一个执行了`stat()`系统调用的C程序）到底层具体文件系统驱动的现成接口。

* 当`stat()`直接与VFS打交道时，它从VFS的inode cache中所获取到的inode时间戳位数直接与系统时间的位数相关，而无关实际文件系统上的时间戳限制（因为VFS是独立于具体文件系统实现的一个__抽象__接口）。

* 为了充分理解上面一点，在64位系统上，你可以试一下这个简单的`stat()`调用程序：

<script src="https://gist.github.com/4366391.js"></script>

如果使用默认的64位C库编译，`stat()`能够正确返回某个文件VFS inode中的64位时间戳；如果使用32位库编译，它只能够正确输出inode的32位时间戳（这个就是系统`time_t`位数而不是具体文件系统所导致的2038年问题了）。

* 从抽象的VFS延伸到实际的文件系统中时，问题就变得复杂许多。以64位Linux为例：

    * 你可以向任意一个文件的inode中写入长达64位的时间戳（可以一直延用至太阳系灭亡的时候），你也可以立即调用`stat()`查看这个时间戳，因为在64位系统上的VFS inode和`stat()`都能够正确地处理64位的时间；但是，这64位时间戳最终将无法被恰当地存储到ext4文件系统中。它的存活期只能是在VFS的inode cache中。

    * 你可以向任意一个文件的inode中写入长达34位的时间戳（可以延用到500年后），理所当然地，64位系统上VFS inode和`stat()`处理它自然不成问题；这34位时间戳也__能够__被正确地保存到ext4文件系统的inode table中。但是，在需要从实际文件系统中读取inode的时间戳时，为了保持最高的双向兼容性（一方面是为了旧的程序和新的ext4时间戳格式兼容；一方面也是为了新的程序和旧的ext3时间戳格式兼容），当前的`stat()`系统调用只能读取到时间戳的前32位，并且把它当作有符号整型来看待。

        * 从上一点来看，ext4的inode时间戳与ext3在实用范畴内（所有依赖于`stat()`的用户程序）并没有什么区别。当然，如果你使用dump或者e2fsprog之类的底层调试工具，你还是能看到文件系统记录下来的完整34位时间戳。这是ext4的时间戳比起ext3来的唯一好处。

    * 你可以向任意一个文件的inode中写入长达32位的时间戳。它可以从VFS inode cache中被完整地写入实际的ext4分区，也可以被`stat()`系统调用正确地读取，可以用`stat`命令显示出正确的日期，不会造成溢出。当然，这一切等到32位整数表示时间的终点——2038年1月19日，就会结束了。



## 其他文件系统的时间戳与2038年问题

过时的文件系统（ext2、ext3、ReiserFS）这里就不提了。它们采用了__32位时间戳__，这决定了它们最晚到2038年之前必将遭遇被淘汰的命运。

ext4（我目前正在用的文件系统，也许是目前Linux中用得最普遍的文件系统），虽然从理论上它的__32+2位时间戳__可以一直工作到2514年，但是由于如前所述`stat()`系统调用实现上的遗留问题——至少是在我现在的系统上，我不认为它可以在2038年后依然正常工作，因为没有哪个应用软件能够正确处理新的时间戳（虽然直到2514年的时间戳都能够被ext4完完整整地存储在那里，但你就是看不到它，一般的用户程序也看不到它——如果只通过正常的系统调用而不采取dump手段的话）。只要系统的C POSIX库一天不升级，它就会始终受制于32位时间戳长度的兼容性，即使是在64位Linux系统上。

### Apple HFS+

苹果目前所使用的文件系统没有2038年问题。因为它的时间戳终结在[2040年](http://en.wikipedia.org/wiki/HFS%2B)。

同样基于Unix时间纪元的Mac OS X会去使用一个2040年而非2038年到期的文件系统，我不知道这样设计的理由，我也不太感兴趣苹果打算如何去解决这个问题。你认为一台Macbook最多能用多少年？

### NTFS

与你们这些流氓操作系统做出来的东西有着本质上的不同，微软的文件系统是具有充分的预见性的。几乎濒临淘汰的FAT甚至到[2107年](http://en.wikipedia.org/wiki/Time_formatting_and_storage_bugs#Year_2107)才会发生时间戳溢出，比起现在Linux上的大部分文件系统都要晚70年。NTFS更是用到[60000年](http://en.wikipedia.org/wiki/NTFS)都不会过时。

以下内容摘自NTFS-3G driver的注释：（它的说法是到西元57000年）

    /**
      * ntfs2timespec - Convert an NTFS time to Unix time
      * @ntfs_time:  An NTFS time in 100ns units since 1601
      *
      * NTFS stores times as the number of 100ns intervals since January 1st 1601 at
      * 00:00 UTC.  This system will not suffer from Y2K problems until ~57000AD.
      *
      * Return:  A Unix time (number of seconds since 1970, and nanoseconds)
      */

### ZFS和UFS2

个人推测用在BSD和Solaris上的服务器文件系统，时间戳宽度应该不会太短。不过我没找到关于这两个文件系统实现细节的文档，如果你知道，请告诉我。

### Reiser4

[Reiser4](http://en.wikipedia.org/wiki/Reiser4)的出现无疑是划时代的，它第一次采用了__64位时间戳__，从而把Linux文件系统的末日彻底推迟到了地球毁灭之后。这曾经被认为是一个前景无限的文件系统，直到[它的作者](http://en.wikipedia.org/wiki/Hans_Reiser)把自己的名声连同这个文件系统的光明前途一起亲手毁灭之前。开发停滞是一个方面；此外，它的某些特性因为过于先进，在Linux的VFS层中尚没有对应的API去实现，鉴于作者本人还要继续蹲上n年大牢，估计将来也很难再有人去实现它们。

### Btrfs

[Btrfs](http://en.wikipedia.org/wiki/Btrfs)被设计成用来取代ext4的下一代Linux文件系统。它从ZFS和Reiser4这些较先进的文件系统中借鉴了许多东西。

Btrfs的[INODE_ITEM](https://btrfs.wiki.kernel.org/index.php/On-disk_Format#INODE_ITEM_.2801.29)包含atime、ctime、mtime和一个保留的otime时间戳。它们的[TIME结构](https://btrfs.wiki.kernel.org/index.php/On-disk_Format#Basic_Structures)由用于存储秒的__64位有符号整型__和用于存储纳秒的__32位无符号整型__组成。



## 总结

ext4被Linux开发者认为只是一个过渡性质的文件系统。如果现有libc（包括GNU libc和其他的POSIX库实现）中的`stat()`系统调用与其他应用程序的前向兼容性问题能够在2038年之前彻底消除，那么ext4还可以在2038年之后继续用500年（到2514年为止）。就当前的情况来看（我的系统上是glibc 2.15），ext4的时间戳对于大多数用户态应用程序而言仍然会在32位用完之后发生溢出，而不是当初设计时预想的34位。

不过我确信到了那时，所有的Unix系统应该都升级到了64位，基于64位时间戳的Btrfs（或者其他什么新的玩意，谁知道呢）也应该早就取代了旧的基于32位时间戳的文件系统（ext2、ext3）和过渡性质的32+2位时间戳文件系统（ext4）。只要C POSIX库的兼容性问题能在那之前解决，2038年1月19日这个日期就变得不再重要，未来人会说：你看，古人还在担心什么2038年世界末日，这真是杞人忧天啊，我们连手机都早换成128位的了。否则，如果兼容性问题迟迟得不到解决，人们就会当初面临千年虫问题那样慌乱。（事实上这问题应该比千年虫严重得多，因为在服务器领域绝对是Unix系统占统治地位）

做出来新的东西去解决一个问题也许并不困难。但是既要改变底层的实现又要不破坏现有接口与那些legacy code的兼容，这才是解决2038年问题所真正面临的挑战吧。



## 参考资料 / 相关链接

* 关于2038年问题
    * <http://en.wikipedia.org/wiki/Year_2038_problem>
    * <http://www.y2038.com/>

* 关于计算机纪元法和Unix时间
    * <http://en.wikipedia.org/wiki/Epoch_(computing)#Computing>
    * <http://en.wikipedia.org/wiki/Unix_time>

* 关于文件系统inode结构
    * <http://en.wikipedia.org/wiki/Inode>
    * <http://en.wikipedia.org/wiki/Inode_pointer_structure>
    * <http://140.120.7.20/LinuxKernel/LinuxKernel/node17.html>

* 关于GNU libc的`stat()`系统调用
    * <http://en.wikipedia.org/wiki/Stat_(Unix)>
    * <http://linux.die.net/man/2/stat>
    * <http://www.gnu.org/software/libc/manual/html_node/Reading-Attributes.html>
    * <http://www.cs.utah.edu/dept/old/texinfo/glibc-manual-0.02/library_13.html>

* 关于虚拟文件系统VFS
    * <http://en.wikipedia.org/wiki/Virtual_file_system>
    * <http://www.tldp.org/LDP/tlk/fs/filesystem.html>

* 关于ext4文件系统
    * <http://en.wikipedia.org/wiki/Ext4>
    * <http://linuxsoftware.co.nz/wiki/ext4>
    * ext4的存储结构：<https://ext4.wiki.kernel.org/index.php/Ext4_Disk_Layout>

* 理解ext4的时间戳（非常好的文章！）
    * <http://computer-forensics.sans.org/blog/2011/03/14/digital-forensics-understanding-ext4-part-2-timestamps>

* e2fsprogs工具的使用
    * <http://en.wikipedia.org/wiki/E2fsprogs>
    * <http://linux.die.net/man/8/dumpe2fs>
    * <http://linux.die.net/man/8/debugfs>

* 关于Btrfs文件系统
    * <http://en.wikipedia.org/wiki/Btrfs>
    * Btrfs的存储结构：<https://btrfs.wiki.kernel.org/index.php/On-disk_Format>


