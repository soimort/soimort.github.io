---
layout: post
uri: /posts/146
permalink: /posts/146/index.html
title: 【Unix考据癖】Lisp节快乐！
category:
tag:
description:
disqus: true
lang: zh
---

## Happy Lisp and Pi day?

在3月14日（这一天可真是个[好日子](/posts/145)啊），如果你在Sys V或BSD的衍生操作系统（包括OS X）上执行命令：

    $ calendar

会看到如下提示：

    Mar 14 	LISP introduced, 1960

1960年3月14日（同时也是所谓的“[Pi节](http://en.wikipedia.org/wiki/Pi_Day)”），Lisp语言在历史上的这一天正式面世。

`calendar`是一个源自于远古Unix系统的日程提醒工具（注意它和`cal`的不同）；同时，它还自带了一套历史事件数据，更多人用这个命令也只是为了看看这些内置的事件而已（因为作个人日程提醒已经有了更好的服务）。

比如，通过命令

    $ calendar -f /usr/share/calendar/calendar.computer  -l 31

或者

    $ calendar -f /usr/share/calendar/calendar.computer  -A 31

可以查看`calendar.computer`（计算机发展史）的全部历史事件日期。

## GNU/Linux ≠ Unix

你可以在[Die.net](http://www.die.net/)上找到[`calendar`命令的man page](http://linux.die.net/man/1/calendar)。

最后说明了该命令的起源：

    A `calendar` command appeared in Version 7 AT&T UNIX.

诞生于Bell Labs的[Version 7 Unix（V7）](http://en.wikipedia.org/wiki/Version_7_Unix)堪称是最重要的早期Unix版本之一，被称作是“最后一个真正的Unix（The last true Unix）”，后世的众多商业/开源Unix都是以它作为基础进行开发的。看起来，这似乎是一个标准的Unix命令，不是吗？

不过，并不是V7上面有的东西在GNU/Linux上都有的。一个典型的特例就是，`calendar`这个命令：

__1)__ Linux只是一个纯粹的kernel，不涵盖user space的系统组件。所以，Linux上没有`calendar`是理所当然的，本来就不可能会有。

__2)__ GNU按理说是全权负责为kernel提供这些周边的userland的，不过显然，RMS大神直接忽略了（或者是忘记了？）`calendar`这个东西。（话说回来，毕竟他最初开发GNU Project的目的只是为了要做一个“完全自由”的操作系统，而不是一个“完全与V7 Unix兼容”的系统。）

这种内核和外围组件完全分离导致的后果就是，比起在真正的Unix上由开发者一手包办的kernel+userland的完备系统环境，Linux和GNU这两个项目的结合仍然只是一场过于匆促的联姻（这两个东西本来都算不上是一个完整的“操作系统”），欠缺最起码的作为一个“实用”操作系统的可能性（还记得拼拼凑凑折腾出一个自己的、几乎没有任何实用性可言的Linux From Scratch的蛋疼过程吗），而这些，都需要靠后来的各种发行版去修修补补（这也是造成GNU/Linux发行版各种碎片化和不兼容的诱因）；而BSD家族的成员，相比之下，就各自都很好地保持了早期V7 Unix功能的完整性。无论是在开源的*BSD还是闭源的OS X上，都有着功能几乎完全对等的`calendar`命令，在3月14日这一天都会告诉你“LISP introduced, 1960”，因为它们（从源码意义上）本来就有着相同的渊源。

GNU/Linux，比起BSD家族林林总总数不胜数的成员（FreeBSD，NetBSD，OpenBSD，DragonflyBSD，OS X userland……）来说，它可以算得上是“一种”统一的操作系统；然而，各个发行版之间的分歧状况却相反，比任何其它类Unix系统更加严重。我不想在这里更多地触及这个问题，只针对`calendar`这点小问题列举几个事实：

__1)__ 在Debian GNU/Linux和Ubuntu上，实际上存在`calendar`这个命令。但它并不属于GNU/Linux本身，而是从FreeBSD port过来的[bsdmainutils](http://packages.debian.org/squeeze/amd64/bsdmainutils)（“This package contains lots of small programs many people expect to find when they use a BSD-style Unix system.”）。

在Debian的`/usr/share/calendar/calendar.computer`里可以清楚地看到这一点：

```
/*
 * Computer
 *
 * $FreeBSD$
 */

#ifndef _calendar_computer_
#define _calendar_computer_

LANG=UTF-8

01/01	AT&T officially divests its local Bell companies, 1984
01/01	The Epoch (Time 0 for UNIX systems, Midnight GMT, 1970)
01/03	Apple Computer founded, 1977
01/08	American Telephone and Telegraph loses antitrust case, 1982
01/08	Herman Hollerith patents first data processing computer, 1889
01/08	Justice Dept. drops IBM suit, 1982
01/10	First CDC 1604 delivered to Navy, 1960
01/16	Set uid bit patent issued, to Dennis Ritchie, 1979
01/17	Justice Dept. begins IBM anti-trust suit, 1969 (drops it, January 8, 1982)
01/24	DG Nova introduced, 1969
01/25	First U.S. meeting of ALGOL definition committee, 1958
01/26	EDVAC demonstrated, 1952
01/31	Hewlett-Packard founded, 1939
02/11	Last day of JOSS service at RAND Corp., 1966
02/14	First micro-on-a-chip patented (TI), 1978
02/15	ENIAC demonstrated, 1946
03/01	First NPL (later PL/I) report published, 1964
03/04	First Cray-1 shipped to Los Alamos, 1976
03/09	"GOTO considered harmful" (E.J. Dijkstra) published in CACM, 1968
03/14	LISP introduced, 1960
03/28	DEC announces PDP-11, 1970
03/31	Eckert-Mauchly Computer Corp. founded, Phila, 1946
04/01	Yourdon, Inc. founded, 1974 (It figures.)
04/03	IBM 701 introduced, 1953
04/04	Tandy Corp. acquires Radio Shack, 1963 (9 stores)
04/07	IBM announces System/360, 1964
04/09	ENIAC Project begun, 1943
04/28	Zilog Z-80 introduced, 1976
05/06	EDSAC demonstrated, 1949
05/01	First BASIC program run at Dartmouth, 1964
05/16	First report on SNOBOL distributed (within BTL), 1963
05/19	UNIX is 10000 days old, 1997
05/21	DEC announces PDP-8, 1965
05/22	Ethernet first described, 1973
05/27	First joint meeting of U.S. and European ALGOL definition cte., 1958
05/28	First meeting of COBOL definition cte. (eventually CODASYL), 1959
05/30	Colossus Mark II, 1944
06/02	First issue of Computerworld, 1967
06/07	Alan Mathison Turing died, 1954
06/10	First Apple II shipped, 1977
06/15	UNIVAC I delivered to the Census Bureau, 1951
06/16	First publicized programming error at Census Bureau, 1951
06/23	IBM unbundles software, 1969
06/23	Alan Mathison Turing born, 1912
06/30	First advanced degree on computer related topic: to H. Karamanian,
	Temple Univ., Phila, 1948, for symbolic differentiation on the ENIAC
07/08	Bell Telephone Co. formed (predecessor of AT&T), 1877
07/08	CDC incorporated, 1957
07/FriLast	System Administrator Appreciation Day
08/14	First Unix-based mallet created, 1954
08/14	IBM PC announced, 1981
08/22	CDC 6600 introduced, 1963
08/23	DEC founded, 1957
09/15	ACM founded, 1947
09/20	Harlan Herrick runs first FORTRAN program, 1954
10/02	First robotics-based CAM, 1939
10/06	First GPSS manual published, 1961
10/08	First VisiCalc prototype, 1978
10/12	Univac gives contract for SIMULA compiler to Nygaard and Dahl, 1962
10/14	British Computer Society founded, 1957
10/15	First FORTRAN Programmer's Reference Manual published, 1956
10/20	Zurich ALGOL report published, 1958
10/25	DEC announces VAX-11/780
11/04	UNIVAC I program predicts Eisenhower victory based on 7% of votes, 1952
12/08	First Ph.D. awarded by Computer Science Dept, Univ. of Penna, 1965

/* added in the debian package, from the Jargon File */
Jan 01	Macintosh Epoch, Midnight 1904
Jan 18	Unix clock runs out, 2038
Feb 08	Black Thursday, The CDA is signed into law, 1996
Mar 31	Automated Retroactive Minimal Moderation (ARMM) released, 1993
Apr 01	Usenet site kremvax announced as an April Fool's joke, 1984
Jun 26	White Thursday, CDA demolished by U.S. Supreme Court, 1997
Jul 04	First @-party, at the Westercon (California SF convention), 1980
Sep 09	First bug found, a moth in Harvard Mark II, 1947
Oct 16	Sanford Wallace's Cyber Promotions Inc. shut down by lawsuit, 1997
Nov 17	VMS Epoch (base date of U.S. Naval Observatory's ephemerides), 1858
Oct 20	MIT hacked the Harvard-Yale football game, 1982

Jan 24	Introduction of the first Mac, 1984
Mar 24	Introduction od Mac OS X, 2001

#endif /* !_calendar_computer_ */
```

__2)__ Arch Linux，和其它“纯粹”的GNU/Linux发行版上，没有`calendar`。理由很简单，GNU并没有做`calendar`这个东西，而Arch没有像Debian一样把它从其他Unix系统那里port过来。

__3)__ 其他发行版的处理方式，我不知道。也许有的和Debian一样把它作为系统的一个核心组件，有的也许只是一个可选软件包，有的也许和Arch一样根本就没有把这套工具的Linux port放进官方库。

## Lisp的“3月14日悬案”

所有的BSD系统的`calendar`都拥有一段大致完全相同的代码（`usr.bin/calendar/calendars/calendar.computer`），记录着“03/14	LISP introduced, 1960”，把这一天作为Lisp语言面世的日期。对此产生了兴趣，我试图考证一下在这个时间点究竟发生了什么，但是，在Wikipedia上没有找到任何与1960年3月14日有关的Lisp历史事件。看起来，似乎没有人确切地知道这个日期是怎么来的。

以至于有人在comp.lang.lisp上也问到过这个问题：

<http://compgroups.net/comp.lang.lisp/14-march-1960-lisp-was-introduced/700829>

Lisp语言是John McCarthy在MIT期间（约1958年）提出的，根据Wikipedia的说法，他的一篇重要论文_[Recursive Functions of Symbolic Expressions and Their Computation by Machine, Part I](http://www-formal.stanford.edu/jmc/recursive.pdf)_于1960年4月发表在_Communications of the ACM_上。这是世界上第一篇有关Lisp的学术论文。（该论文的Part II从未被发表过）

但这篇论文并不是Lisp语言的首次公开露面。在一个月以前，[LISP I Programmer's Manual](http://history.siam.org/sup/Fox_1960_LISP.pdf)就已经发布。文章上的日期是3月1日。

_LISP I Programmer's Manual_的主要作者是Phyllis Fox，根据一次[采访](http://history.siam.org/oralhistories/fox.htm)中他的回忆，他似乎自己也不大记得清关于这个Manual时间日期的具体细节了：

_HAIGH: I’m looking now at a copy of the LISP manual, and this one is dated March 1st._

_FOX: That’s not the actual manual, though. It’s up here. You don’t have a copy of it._

_HAIGH: I’m looking at a document that says LISP One Programmers’ Manual on the front. And that one is dated March 1, 1960, which is actually a year earlier than the one shown on the resume. And this could be interesting because it has a number of penciled in corrections._

_FOX: Oh, “Mainly written by Fox, on the basis of information from McCarthy and the other authors.” That’s right. I guess, I remembered it differently, but this may be it. So anyhow, that was fun. I liked LISP._

关于3月14日这个神秘的日期，comp.lang.lisp上有人给出了一种比较靠谱的推测，

_Also, there is the Lisp 1 Programmer's Manual, which is dated March 1, 1960. Thirteen days before this mystical March 14th._
_Maybe they shipped the documentation fist, and then did thirteen days of final bugfixing._

还有一种猜测认为3月14日可能是指CACM接收John McCarthy那篇关于Lisp的paper的日期：

_The best idea I can come up with is that if this date has any meaning, it might be the date when the paper was submitted for publication in the CACM (thereby "introduced" to the word by the authors)._

忽然想到，既然3月14日这个说法是仅仅在Unix操作系统上的`calendar`才出现的，为什么不去看看源码里面有没有开发者留下的相关信息，解释一下`calendar.computer`里面这些历史事件日期的靠谱来源呢？

众所周知，OS X在userland部分借用了FreeBSD的代码，所以，只要去翻翻BSD的源码历史应该就能知道了。在FreeBSD的svn记录上，追溯到了最初的一条commit是：

```
Revision 1590 - (view) (download) (annotate) - [select for diffs] 
Added Fri May 27 12:33:43 1994 UTC (18 years, 9 months ago) by rgrimes 
Original Path: vendor/CSRG/dist/usr.bin/calendar/calendars/calendar.computer 
File length: 2905 byte(s)
BSD 4.4 Lite Usr.bin Sources
```

[这条commit](http://svnweb.freebsd.org/base/vendor/CSRG/dist/usr.bin/calendar/calendars/calendar.computer?revision=1590&view=markup&pathrev=1590)中已经出现了“03/14	LISP introduced, 1960”这个说法。不幸的是，它是整个从[4.4 BSD Lite](http://docs.freebsd.org/44doc/)的源码导入过来的，在这之前的版本控制历史，基本上已经很难再追溯了。

合理推测，4.4 BSD Lite里的这部分`calendar`数据应该是从最早的[V7 Unix](http://cm.bell-labs.com/7thEdMan/)里弄过来的（也许所有类Unix里面的`calendar`都是基于早期的V7 Unix版本实现的？）。与GNU/Linux不同，Unix的历史实在是过于久远（代码源头过于复杂），这个关于“3月14日是Lisp首次面世的纪念日”说法的由来，自然也就无从考证了。让我们姑且相信一次前人吧！

结论是，Lisp节与Pi节在同一天的这个巧合掩藏在历史背后的特殊意义，大概也要就此变成现代Unix史上的一宗悬案了。

P.S. 在Bell Labs的Plan 9上，`calendar`组件已不再提供这些系统默认的历史事件数据。（<http://man.cat-v.org/plan_9/1/calendar>）

***

## 参考链接

* The `calendar` command
    * <http://linux.die.net/man/1/calendar>
    * <http://aplawrence.com/Words/2003_12_21.html>
    * <http://man.cat-v.org/plan_9/1/calendar>
* comp.lang.lisp: 14 March 1960 - Lisp was introduced?
    * <http://compgroups.net/comp.lang.lisp/14-march-1960-lisp-was-introduced/700829>
* Lisp
    * <http://en.wikipedia.org/wiki/Lisp_(programming_language)>
    * <http://www-formal.stanford.edu/jmc/recursive.html>
    * <http://history.siam.org/oralhistories/fox.htm>
    * <http://www.mcjones.org/dustydecks/archives/2012/07/06/239/>
    * <http://www.softwarepreservation.org/projects/LISP/book>
* Version 7 Unix
    * <http://en.wikipedia.org/wiki/Version_7_Unix>
    * <http://cm.bell-labs.com/7thEdMan/>

