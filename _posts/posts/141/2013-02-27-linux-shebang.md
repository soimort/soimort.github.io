---
layout: post
uri: /posts/141
permalink: /posts/141/index.html
title: Linux黑历史挖坟（1）：shebang的多参数问题
category:
tag:
description:
disqus: true
lang: zh
---

一直想写这么一个系列来着：Linux的__黑历史__挖坟。从邮件列表里把内核开发者那些不为外人所知的事儿：技术论战、独断专行、暴君式的震怒、各种恶搞和对喷、以及各种文明用语（哔～），当然还有Linux开发过程中一些具有争议的技术决定（这篇文章讲的主要是这方面）全部挖出来做个整理，应该是一件蛮有意思的事情。



## 引子：`/usr/bin/env`的用途

举个例子，调用Python解释器执行某脚本的shell命令是这个样子的：

    $ python foo.py

如果要想直接把这个脚本当作可执行文件来使用：

    $ chmod +x foo.py
    $ ./foo.py

就必须在脚本的第一行加上shebang：

    #!/usr/bin/python
    print "hello, world"

让系统知道调用何种解释器来执行该脚本。

上面的shebang存在的问题是，在不同的系统上，Python解释器的绝对路径可能并不相同。它可能是`/usr/bin/python`，也可能是`/usr/local/bin/python`，甚至可能是`~/.local/bin/python`。我们需要一种方式更通用的方式来调用当前环境路径下的`python`命令，而不仅仅局限于`/usr/bin/python`这个特定的路径。糟糕的是，在绝大多数Unix系统上，你无法直接在shebang中使用环境中的命令，例如：

    #!python
    print "hello, world"

这种写法并不合法。shebang后面只允许跟绝对路径。

为了让脚本中的shebang尽可能地通用，执行时不依赖于具体系统上Python的安装路径，我们需要借助`env`这个工具：

    #!/usr/bin/env python
    print "hello, world"

在绝大部分现代UNIX系统的发行版上，文件`/usr/bin/env`是普遍存在的。系统内核在解析这个可执行脚本的shebang后，会首先直接去调用文件系统中的`/usr/bin/env`，然后由`env`这个外部工具来间接调用当前环境路径下的`python`，从而避开了不同系统中`python`路径不同带来的麻烦。

`/usr/bin/env`是一个外部命令行工具，它__不属于__操作系统内核的一部分。在GNU/Linux上，它属于GNU coreutils包。它的作用是把传递给它的第一个参数当作当前环境下的命令来执行，把其后的参数当作该命令的参数传递给该命令，也就是说，在shell下执行：

    $ env python foo.py

等效于：

    $ python foo.py

而：

    $ env awk -f foo.awk

相当于：

    $ awk -f foo.awk



## 关于shebang：它是一个hack；不是POSIX标准

其实写这文章的最初原因是，不止一个Mac用户跟我反映[这个AWK程序](https://github.com/soimort/google-translate-cli)无法在OS X上直接使用，因为我的shebang是这么写的：

    #!/usr/bin/awk -f

OS X的`awk`不是GNU awk。而这段脚本必须要有GNU awk才能运行（因为只有GNU的AWK实现才具备访问网络端口的能力），需要额外安装。显然，从MacPorts安装的GNU awk路径不会、也不应该是`/usr/bin/awk`。

前面提到过，为了不同路径的通用性，shebang的正确写法应该是调用`env`，让它去间接执行解释器，而不是直接在shebang中调用解释器的绝对路径。因此，为了这段程序能在OS X上运行，正确的shebang写法是：

    #!/usr/bin/env gawk -f

执行

    $ ./foo.awk

时，系统会首先调用`/usr/bin/env`，由`env`来调用环境路径中的`gawk`，`gawk`后面跟随参数`-f`，加上该脚本本身的文件名称作为下一个参数。这与在shell下执行

    $ gawk -f foo.awk

实际上等效。看起来完美地解决了问题。

问题是，如果你像那样写AWK脚本的shebang，在Linux下就会遇到麻烦：

    $ ./foo.awk
    env: gawk -f: command not found

从错误提示来看，明显是`gawk -f`被当成了一个参数（命令的名称）来执行，而不是像正常情况下那样把`gawk`作为第一个参数（命令名称）、`-f`作为第二个参数（命令的第一个参数）。

这是GNU coreutils的`env`的问题吗？不妨在shell里试一下：

    $ /usr/bin/env gawk -f foo.awk

可以正确执行该脚本。所以这并非`env`的问题。唯一的解释是，Linux系统在根据shebang调用`env`时，传递给`env`的参数就已经有问题了。

参见GNU项目邮件列表里有关这个bug report的说明: [env won't accept arguments in shebang](http://lists.gnu.org/archive/html/bug-sh-utils/2002-04/msg00020.html)

    Thank you for your report.  However, you are confusing the operating
    systems actions with those of env.  What you are seeing is not a bug
    in env but a limitation of the operating system.  The env command can
    take many arguments.  But the #!interpreter syntax may only take one.
    Everything after the interpreter is passed as a single argument.

_感谢你的报告。然而，你混淆了操作系统本身的行为和env的行为。你所看到的并非是env的bug，而是操作系统本身的限制。env命令可以支持任意多参数，但是 #!解释器 的句法可能仅仅支持一个参数，解释器后面跟随的字符串被全部当作一个完整的参数传递了。_

    ...
    The quick summary is that #! in the operating system kernel only
    allows exactly zero arguments or exactly one argument but not more.

_简要地概括，是操作系统内核对 #! 的实现仅仅允许恰好零个或一个参数的存在，而无法支持更多参数。_

    The #! syntax is generally called the Berkeley #! hack.  It was a
    wonderful improvement over not having it at all.  But is still
    considered a hack because it has many limitations.  One is that only
    one argument is allowed.  Some operating systems have a limit of not
    more than 32 characters for the line allowed.  Another is that it must
    be a binary program and not another shell interpreter. These have
    nothing to do with the 'env' command itself.  You may substitute any
    command there such as my favorite which is 'echo' and you will see the
    same limitation imposed by the underlying operating system.

_#! 这一符号通常被称作Berkeley #! hack。它是一个了不起的改进，比起在没有它的情况下而言。尽管如此，它仍然仅仅被视作一个hack，因为它有许多限制。其中之一是它仅仅允许一个参数。一些操作系统对该行的长度有着不得超过32个字符的限制。另一个限制是它必须是一个二进制程序，而且不能是另一个shell解释器。这些全部都和'env'命令本身毫无关系。你可以把任何一个命令放在这后面，比如说'echo'，你会看到同样它们受困于操作系统内核的限制。_

    It is the same as if you had said the following and passed the two
    things as one thing to env.  Env is not a shell and does not split
    arguments on white space or quoting.  You would need to use a shell
    for that.

    env 'perl -w'
    env: perl -w: No such file or directory

_如果你试图执行`env 'perl -w'`这样的命令，把两样东西放在一个参数里执行的话，它当然会出错。env并不是一个shell，它不会试图去解析一个参数中的空格然后把它分开成两个参数处理。只有shell才会这样做。_

现在你明白了，为什么

    #!/usr/bin/env gawk -f

这个shebang无法在Linux上运行。因为事实上，Linux内核的实现（确切的说，是[这个文件的实现](https://github.com/torvalds/linux/blob/master/fs/binfmt_script.c)——如果你关心源码的话）把`/usr/bin/env`后面的`gawk -f`全部当作了一个参数来传递。实际上最终调用的不是

    $ env gawk -f foo.awk

而是

    $ env 'gawk -f' foo.awk

显然，你的系统中不可能存在`gawk -f`这个名字的命令！出错是理所当然的。

    $ 'gawk -f'
    zsh: command not found: gawk -f

如这位GNU开发者所说，以`#!`打头的shebang句法只是一个所谓的Berkeley hack（估摸着应该就是Berkeley那帮人搞出来的了）。它不属于POSIX标准的一部分。因为它是如此有用，所以很多操作系统都实现了它；同时又因为它不是POSIX标准，所以各个操作系统对它实现的方式大异其趣。这就造成了许多*nix上脚本程序[shebang的移植性问题](http://en.wikipedia.org/wiki/Shebang_\(Unix\)#Portability)。

这儿有个[简略的对Solaris、OS X、FreeBSD和Linux上 #! 参数传递方式的概括](http://mail-index.netbsd.org/netbsd-users/2008/11/09/msg002388.html)。

这里是一个对不同操作系统上shebang实现方式的详尽介绍（由此可见一个没有统一标准、但是大家都想要去实现的东西带来了多大的混乱）：
[The #! magic, details about the shebang/hash-bang mechanism on various Unix flavours](http://www.in-ulm.de/~mascheck/various/shebang)。

文中一个表格总结了不同操作系统的行为（虽然FreeBSD那块貌似写错了）。可以看出，支持shebang多参数分隔的操作系统主要有：

* FreeBSD
* Mac OS X (10.4+)
* Minix
* Plan 9

不支持shebang多参数分隔的主流操作系统包括：

* Linux



## Linux内核：是否应该支持shebang多参数分隔？

这部分有点长，留给和我一样喜欢挖坟的考据癖人士。

对于今天的大部分人来说，shebang的多参数分隔也许不太重要。许多现代脚本语言的解释器除了文件名之外，（绝大多数情况下）并不需要传递额外的参数：

    $ python foo.py
    
    $ ruby foo.py
    
    $ scala foo.scala

然而，如果你经常用AWK，或者是一个来自上古Unix时代、喜欢捣鼓一些自己的稀奇古怪的正则处理解释器的文本hacker，你或许会发现shebang的多参数分隔是一项非常有用的功能。

基本上，为什么Linux不能像FreeBSD和OS X一样实现对shebang多参数分隔支持，可以概括成一句话：一切均是出于__兼容性__考虑。

Unix设计上的历史遗留问题并不少见，[2038年问题](http://www.soimort.org/posts/129)就是一个典型例子。一个糟糕的有缺陷的关键设计，会阻碍东西向好的方面发展。

_Linux不是开源的嘛，我自己fork一个，修改下源码重新编译一遍，让它支持这个功能，不就得了？_

我要说，你还是too young too naive了。

9年前，曾经有人向内核提交过一个patch，让Linux支持shebang的多参数分隔（当时已经是2.6版本号了）：

__[PATCH] Linux 2.6: shebang handling in [fs/binfmt_script.c](https://github.com/torvalds/linux/blob/master/fs/binfmt_script.c)__

* <https://lkml.org/lkml/2004/2/16/74>
* <http://lkml.indiana.edu/hypermail/linux/kernel/0402.2/0072.html>

（以前可没有GitHub pull request这种方便的东西，大部分开源项目的协作方式基本上也就是 邮件列表发patch+技术讨论+对喷 这样的流程）

我把邮件列表上的讨论全部转贴在下面。一方面，要学习内核开发者的严谨（过于保守？）态度；另一方面，可以更好地了解软件开发中标准不统一，和历史兼容性带来的各种社会问题（我发现我写技术文经常不自觉地写到这个主题上去……）

太长了翻译不能，自己看吧。(´д`;)

（Hansjoerg Lipp是这个patch的提交者，Paul Jackson是这部分代码的维护者）

***
### From: Hansjoerg Lipp 

Hi!

In a newsgroup about unix shells we had a discussion, why it is not possible to pass more than one argument to an interpreter using the shebang line of a script. We found, that this behaviour is rather
OS dependent. See Sven Mascheck's page for details:

<http://www.in-ulm.de/~mascheck/various/shebang/>

As I'm really missing this feature in Linux and changing this would not break anything (unless someone uses rather unportable "#!cmd x y" to pass _one_ argument "x y" containing spaces), I'd like to know if it's possible to apply the patch below to the kernel.

It also allows to pass whitespace by using '\' as escape character:

    "\t" => TAB
    "\n" => LF
    "\ " => SPC
    "\\" => backslash

All other backslashes are discarded.

This allows something like

    #!/usr/bin/awk -F \t -f

This part could break old scripts if the interpreter's path/filename or the arguments contain backslashes. Although I don't consider this a real problem, this feature can be deactivated by removing the

    if (c=='\\') { ... }

part from the patch.

Another change: -ENOEXEC is returned, if the shebang line is too long. So, excessive characters are not dropped silently any more.

The patch is tested for 2.6.1, but also applies cleanly to 2.6.2. I can also send a tested patch for 2.4.24.

[ CC me on replies, please, as I'm not subscribed. ]

Kind regards  
Hansjoerg Lipp

```diff
--- linux-2.6.1/fs/binfmt_script.c.orig	2004-02-06 22:21:30.000000000 +0100
+++ linux-2.6.1/fs/binfmt_script.c	2004-02-06 22:21:30.000000000 +0100
@@ -18,10 +18,16 @@

static int load_script(struct linux_binprm *bprm,struct pt_regs *regs)
{
-	char *cp, *i_name, *i_arg;
+	char *cp;
struct file *file;
char interp[BINPRM_BUF_SIZE];
int retval;
+	char *argv[(BINPRM_BUF_SIZE-1)/2];
+	char **cur_arg;
+	unsigned argc;
+	int in_arg;
+	char *end, *dest;
+	char c;

if ((bprm->buf[0] != '#') || (bprm->buf[1] != '!') || (bprm->sh_bang)) 
return -ENOEXEC;
@@ -35,51 +41,47 @@
fput(bprm->file);
bprm->file = NULL;

-	bprm->buf[BINPRM_BUF_SIZE - 1] = '\0';
-	if ((cp = strchr(bprm->buf, '\n')) == NULL)
-	 cp = bprm->buf+BINPRM_BUF_SIZE-1;
-	*cp = '\0';
-	while (cp > bprm->buf) {
-	 cp--;
-	 if ((*cp == ' ') || (*cp == '\t'))
-	 *cp = '\0';
-	 else
-	 break;
+	in_arg=0;
+	cur_arg=argv;
+	argc=0;
+	dest=bprm->buf+2;
+	end=bprm->buf+BINPRM_BUF_SIZE;
+	for (cp=bprm->buf+2;cp<end;++cp) {
+	 c=*cp;
+	 if (c==' '|| c=='\t' || c=='\n' || !c) {
+	 if (in_arg) {
+	 in_arg=0;
+	 *dest++=0;
+	 }
+	 if (c=='\n' || !c) break;
+	 } else {
+	 if (c=='\\') {
+	 if (++cp>=end) return -ENOEXEC;
+	 c=*cp;
+	 if (c=='\n' || !c) return -ENOEXEC;
+	 if (c=='t')
+	 c='\t';
+	 else if (c=='n')
+	 c='\n';
+	 }
+	 if (!in_arg) {
+	 in_arg=1;
+	 argc++;
+	 *cur_arg++=dest;
+	 }
+	 *dest++=c;
+	 }
}
-	for (cp = bprm->buf+2; (*cp == ' ') || (*cp == '\t'); cp++);
-	if (*cp == '\0') 
-	 return -ENOEXEC; /* No interpreter name found */
-	i_name = cp;
-	i_arg = 0;
-	for ( ; *cp && (*cp != ' ') && (*cp != '\t'); cp++)
-	 /* nothing */ ;
-	while ((*cp == ' ') || (*cp == '\t'))
-	 *cp++ = '\0';
-	if (*cp)
-	 i_arg = cp;
-	strcpy (interp, i_name);
-	/*
-	 * OK, we've parsed out the interpreter name and
-	 * (optional) argument.
-	 * Splice in (1) the interpreter's name for argv[0]
-	 * (2) (optional) argument to interpreter
-	 * (3) filename of shell script (replace argv[0])
-	 *
-	 * This is done in reverse order, because of how the
-	 * user environment and arguments are stored.
-	 */
+	if (cp>=end||!argc) return -ENOEXEC;
+
+	strcpy (interp, argv[0]);
remove_arg_zero(bprm);
retval = copy_strings_kernel(1, &bprm->interp, bprm);
-	if (retval < 0) return retval; 
-	bprm->argc++;
-	if (i_arg) {
-	 retval = copy_strings_kernel(1, &i_arg, bprm);
-	 if (retval < 0) return retval; 
-	 bprm->argc++;
-	}
-	retval = copy_strings_kernel(1, &i_name, bprm);
-	if (retval) return retval; 
+	if (retval < 0) return retval;
bprm->argc++;
+	retval = copy_strings_kernel(argc, argv, bprm);
+	if (retval < 0) return retval;
+	bprm->argc += argc;
bprm->interp = interp;

/*
```

***
### From: Paul Jackson

In addition to the incompatible changes you note:

1) "#! cmd x y" to pass single arg "x y" with embedded space broken

2) Use of '\' char changed

3) Handling of long line changed
doesn't this also

4) risk breaking shells that look to argv[2] for the name of the shell script file for error messages? This argument has moved out to argv[argc-1], for some value of argc.

I'll wager you have to make a better case for this than simply:

As I'm really missing this feature in Linux and changing this would not break any (unless ...

before the above incompatibilities in a critical piece of code are overcome with the compelling need to change these details.

Perhaps you can handle any such special argument specification by wrapping the user level command, as in:

Instead of:

    #!/usr/bin/awk -F \t -f
    ... my awk code ...

rather do:

    #!myawk
    ... my awk code ...

where myawk is a compiled program that essentially does

    /usr/bin/awk -F '\t' -f argv[2]

***
### From: Hansjoerg Lipp

    On Sun, Feb 22, 2004 at 02:09:11AM -0800, Paul Jackson wrote:
    > In addition to the incompatible changes you note:
    > 1) "#! cmd x y" to pass single arg "x y" with embedded space broken
    > 2) Use of '\' char changed

Well, as noted, this part can be removed easily. As I consider this part
least important, I maybe should have deleted it before sending the patch
(some "#ifdef CONFIG_xxxx" could be used instead).

But as I sent the patch also because I wanted to know what other people
think about the issue, I did not change it (passing \t was the topic of
the newsgroup discussion I mentioned).

    > 3) Handling of long line changed
    > doesn't this also
    > 4) risk breaking shells that look to argv[2] for the name of the
    > shell script file for error messages? This argument
    > has moved out to argv[argc-1], for some value of argc.

Well, if the shell can't handle some parameters, you shouldn't add them
to the shebang line. If you have some example.script

    #!cmd -x

executed as "example.script -a -b", exec will still pass
{"cmd", "-x", "example.script", "-a", "-b"} as argv to cmd.

The patch just allows

    #!cmd -x -y

to become {"cmd", "-x", "-y", "example.script", "-a", "-b"}.

If I understand you right, your argument could be used to say: passing
arguments is not good at all, because some interpreter expects the name
of the script in argv[1] (as it's usual with "normal" "#!/bin/sh"
scripts). In my opinion, you just can't use a shebang line
"#!interpreter argument" in this case. And it's the same with my
proposal: you don't have to pass two arguments -- and you shouldn't if
the interpreter can't handle it.

BTW, which shell expects the name of the script in argv[2]?

    > I'll wager you have to make a better case for this than simply:
    > 
    > As I'm really missing this feature in Linux and changing this
    > would not break any (unless ...
    > 
    > before the above incompatibilities in a critical piece of code are
    > overcome with the compelling need to change these details.

Yes, you may be right. But please note, that the "incompatibilities"
are rather theoretical, in my opinion (please correct me if I'm wrong):

- I don't think there are many scripts with "#!cmd -a -b" that must be
parsed like {"cmd", "-a -b"}. And scripts like this would not be
portable among the Unices, anyway.
- I think it's much better to get an error on a too long shebang line.
It's rather dangerous to drop excessive characters silently as this
can change the meaning of the command totally.

It's just a pain to have to use wrappers; they make a system
unnecessarily complex and error-prone and the arguments needed by the
interpreter cannot be found, where it's most logical to search.

I think, handling the shebang line "my" way (as it's already done by
FreeBSD) makes writing complex scripts easier and cleaner and has no
real disadvantages.

Thanks for the response,

Hansjoerg Lipp

***
### From: Paul Jackson

    > BTW, which shell expects the name of the script in argv[2]?

Which ones don't? The burden is on you, not me. The Bourne like shells
that I happen to try just now _do_ display syntax error messages in
shell scripts with the name of the shell script file in the error
message. Look and see how they are getting that script file name.

What's theoretical on one persons machine is very real and painful
on a million persons machines. Incompatible changes in documented
interfaces have a high threshold to overcome.

***
### From: Jamie Lokier

    Paul Jackson wrote:
    > > BTW, which shell expects the name of the script in argv[2]?
    > 
    > Which ones don't?

I believe the question was "which shell expects the name in argv[2]
regardless of an options given before the name".

That rules out all the ordinary shell programs.

    > The burden is on you, not me. The Bourne like shells
    > that I happen to try just now _do_ display syntax error messages in
    > shell scripts with the name of the shell script file in the error
    > message. Look and see how they are getting that script file name.

The standard shell programs all get the name from the first non-option
argument.

    > What's theoretical on one persons machine is very real and painful
    > on a million persons machines. Incompatible changes in documented
    > interfaces have a high threshold to overcome.

I'll be astonished if the change to split the arguments breaks any
script which actually exists, except for the rare and convoluted
possibility: where the interpreter is a C program specially written to
workaround the fact that Linux doesn't split the arguments.

The backslash functionality (\t) may be more of a problem.

-- Jamie

***
### From: Paul Jackson

    > I believe the question was "which shell expects the name in argv[2]

The question is more like: examine each shell's argument parsing code to
determine which ones will or will not be affected by this. For a change
like this, someone needs to actually look at the code for each major
shell, and verify their reading of the code with a little experimentation.

***
### From: Paul Jackson

    > #!/usr/bin/awk -F \t -f

If your primary need is to set the awk field separator, how about
setting FS (or IFS, depending on which awk) in a BEGIN section
in the script?

***
### From: Paul Jackson

    > It's just a pain to have to use wrappers

true

    > "my" way (as it's already done by
    > FreeBSD) makes writing complex scripts easier

likely true as well

***
### From: Paul Jackson

    > BTW, which shell expects the name of the script in argv[2]?

I don't know. Someone needs to actually examine the shell code,
and see what it does, for various shells. My jaw boning neither
proves nor disproves anything.

***
### From: Jamie Lokier

    Paul Jackson wrote:
    > > I believe the question was "which shell expects the name in argv[2]
    > 
    > The question is more like: examine each shell's argument parsing code to
    > determine which ones will or will not be affected by this. For a change
    > like this, someone needs to actually look at the code for each major
    > shell, and verify their reading of the code with a little experimentation.

Eh? We do know what the major shells do: They either look at the
first non-option argument for the script name, or they do not accept
options at all.

Anyway that's irrelevant: the splitting change only affects shell
_scripts_ which already have multiple options on the #! line, and
which depend on a space not splitting the argument. If a script
doesn't have that, the shell's behaviour isn't affected by this
change.

Such scripts are non-portable because that behaviour isn't universal
(although I have a feeling the current Linux behaviour was done to
mimick some existing system - as it was never hard to implement
argument splitting of the original author had wanted to.)

In other words, what's relevant is which shell _scripts_ would be
affected, not which shells.

To find those scripts, do:

    find /bin /sbin /usr/bin /usr/sbin /usr/X11R6/bin /usr/local/bin \
    /etc /usr/lib -type f \
    | xargs perl -ne 'print "$ARGV\n" if /^#! ?.+ .+ /; close ARGV'

(Or choose your own directories).

I didn't find any on my system.

-- Jamie

***
### From: Andries Brouwer

    On Mon, Feb 23, 2004 at 02:22:15PM +0000, Jamie Lokier wrote:
    > Paul Jackson wrote:
    ...
    > Such scripts are non-portable because that behaviour isn't universal

There are several websites with information.
I once collected #! info.
See <http://homepages.cwi.nl/~aeb/std/hashexclam-1.html>

.. argi, consists of the 0 or 1 or perhaps more arguments to
the interpreter found in the #! line. Thus, this group is empty
if there is no nonblank text following the interpreter name in
the #! line. If there is such nonblank text then for SysVR4,
SunOS, Solaris, IRIX, HPUX, AIX, Unixware, Linux, OpenBSD, Tru64
this group consists of precisely one argument.
FreeBSD, BSD/OS, BSDI split the text following the interpreter name
into zero or more arguments.

Andries

***
### From: Paul Jackson

    > Anyway that's irrelevant: the splitting change only affects shell _scripts_

Well, I wouldn't say 'irrelevant'. Some might claim that this question
(what the major shell's do) is already known, but surely it does matter.

The shells _do_ need to find the path to the script file in the argv[]
passed to them, and the proposed change does alter the parsing of that
argv[].

The splitting does not affect only the scripts. It also affects the
argv[] array presented to the shells, which may or may not deal with
such as we would like.

***
### From: Paul Jackson

If there is such nonblank text then for SysVR4,
SunOS, Solaris, IRIX, HPUX, AIX, Unixware, Linux, OpenBSD, Tru64
this group consists of precisely one argument.
FreeBSD, BSD/OS, BSDI split the text

***
### From: Jamie Lokier

    Paul Jackson wrote:
    > > Anyway that's irrelevant: the splitting change only affects shell _scripts_
    > 
    > The splitting does not affect only the scripts. It also affects the
    > argv[] array presented to the shells, which may or may not deal with
    > such as we would like.

You misread what I wrote. This is a rephrasing of what I wrote:

The splitting does not affect any shells when called by scripts with
<= 1 argument - because the splitting change doesn't affect anything
in those cases.

Therefore the shell behaviour is not relevant, except for such scripts.
On my system there are no such scripts.

-- Jamie

***
### From: Hansjoerg Lipp

    On Sun, Feb 22, 2004 at 12:53:12PM -0800, Paul Jackson wrote:
    > > BTW, which shell expects the name of the script in argv[2]?
    > 
    > Which ones don't? The burden is on you, not me. The Bourne like shells
    > that I happen to try just now _do_ display syntax error messages in
    > shell scripts with the name of the shell script file in the error
    > message. Look and see how they are getting that script file name.

Although I still don't think, this is relevant (because scripts for
interpreters having these problems don't have to pass multiple arguments
on the shebang line), I just tested some example scripts like this:

    ----
    #!/bin/zsh -v -x
    echo "argv0: $0"
    /foo/bar
    ----

(the last line to get an error message).

Everything works as expected using those shells:

    ksh: PD KSH v5.2.14
    GNU bash: 2.05b
    ash: 0.2
    zsh: 4.1.1
    tcsh: 6.12.00

I could have a look at the sources, but as this is the behaviour the man
pages and susv3 describe, this should be "evidence" enough(?).

Regards,

Hansjoerg Lipp

***
### From: Hansjoerg Lipp

    On Sun, Feb 22, 2004 at 09:42:55PM -0800, Paul Jackson wrote:
    > > #!/usr/bin/awk -F \t -f
    > 
    > If your primary need is to set the awk field separator, how about
    > setting FS (or IFS, depending on which awk) in a BEGIN section
    > in the script?

Well, this was just the example we used in the discussion I mentioned.
In this case you are right. But what about

    #!/usr/bin/awk --posix -f

to enable expressions like [0-9]{1,2}. There are really usefull
parameters for awk, shells, ... you can't use easily in scripts (IIRC,
perl has to parse the shebang line on its own because of this - although
this is really not the job of an interpreter.)

The "\" part: Yes, there are not many examples, where you really need
this, because it's not that likely to have filenames or parameters
containing spaces. That's why I said, this part could get some
"#ifdef CONFIG_SHEBANG_ESCAPE" or could even be deleted from the patch.

Here, I'd like to know what people consider more important:
compatibility for old scripts with shebang lines containing backslashes
or the possibility to have file names or paramaters containing white
space characters.

Regards,

Hansjoerg Lipp

***
### From: Hansjoerg Lipp

    On Sun, Feb 22, 2004 at 09:44:57PM -0800, Paul Jackson wrote:
    > > I believe the question was "which shell expects the name in argv[2]
    > 
    > The question is more like: examine each shell's argument parsing code to
    > determine which ones will or will not be affected by this. For a change
    > like this, someone needs to actually look at the code for each major
    > shell, and verify their reading of the code with a little experimentation.

I still don't understand your argument... If there is a shell having
those problems, nobody would use something like

    #!/shell -foo -bar

And the "old"

    #!/shell -foo

or

    #!/shell

still work as usual (if there are no whitespace characters in the
parameter).

Regards,

Hansjoerg Lipp

***
### From: Paul Jackson

    Andries Brouwer wrote:
    > If there is such nonblank text then for SysVR4,
    > SunOS, Solaris, IRIX, HPUX, AIX, Unixware, Linux, OpenBSD, Tru64
    > this group consists of precisely one argument.
    > FreeBSD, BSD/OS, BSDI split the text

Interesting - I notice that 9 Operating Systems, in addition to Linux,
don't split the optional shebang argument, and 3 do.

All else equal, I am not enthusiastic about a somewhat arbitrary change
that could be done either way, that is actually done more often in other
operating systems the current way, and that potentially affects both
script files and their interpreters (shells, awk, perl, python, guile,
tcl, bc, ...).

I will acknowledge however that if there was a shell or interpreter that
allowed at most one '-' prefixed option before the path to the script
file to be interpreted, that that shell or interpreter would be poorly
coded.

And, to be truthful, the usual way that I code awk scripts is not as
a shbang script with an interpreter of awk,

    #!/bin/awk
    BEGIN ...

but rather as a quoted awk script within a shell script:

    #!/bin/sh
    awk '
    BEGIN ...
    '

It is then trivial to supply one or several options to 'awk', and
(as the tclsh man page notes) to cope with possible diverse locations
along $PATH of the interpreter.

This is especially useful in the case of awk, since it is not a
convenient language for many things that are easily done in a shell.
That is, I don't write awk scripts, so much as I write shell scripts
that might make use of awk.

This is a portable habit, that avoids all the afore mentioned
limitations and inconsistencies in shbang handling.

***
### From: Paul Jackson

    Hansjoerg wrote:
    > But what about
    > #!/usr/bin/awk --posix -f

What I would actually code, in this case, and as I just noted a minute
ago in a parallel rely, would be:

    #!/bin/sh
    awk --posix -f '
    ...
    '

I basically never put awk in the shebang line. Rather I invoke it on
quoted scripts inside of a shell script. This habit has served me well
for some 25 years now, on a variety of systems.

***
### From: Paul Jackson

    Hansjoerg wrote:
    > I still don't understand your argument... If there is a shell having
    > those problems, nobody would use something like

I will acknowledge that while one _could_ code a shell so that your
proposed change would break it, it would be a stupid, silly and ugly
way to code a shell.

That is, one _could_ code a shell to say:

1) If argv[1] starts with a '-', consume and handle as an option
(or possibly as a space separated list of options).

2) Presume the next argument, if any, is a shell script file.

I would be surprised if any of the major shells are coded this way.

***
### From: Paul Jackson

    > Therefore the shell behaviour is not relevant, except for such scripts.

So we agree that the shell behaviour is relevant for such scripts.

I don't think I missed a thing, and I think we are in agreement, except
on the relative value of this change, versus the risk of breaking a
shell.

If a shell is coded to allow for at most one option before the script
file path, and if a script is presented to it with a shebang option
having an embedded space, then ... oops.

You're just discounting the risk of either such scripts or of such
stupidly coded shells more than I am discounting such, and you are
valuing the usefulness of the proposed change more than I value it.

I accept that there is no shell, nor script, on your system that would
break, and to be honest, I can't find any such shell, or script, on my
system either.

***
### From: Paul Jackson

    Hansjoerg wrote:
    > #!/bin/zsh -v -x
    > ...
    > this should be "evidence" enough(?)

This testing was done on a system with your patch applied, right?
Because on a stock kernel, the various shells are of course
confused by the "-v -x" argv[1].

I will grant that ksh, bash, ash, tcsh and zsh are likely ok
(willing to see > 1 option before the script file name.)

An alternative way to test the same thing, that works even on
a stock kernel:

    $ echo 'echo "$*"' > ./d
    $ ash -e -e ./d 1 2 3
    $ tcsh -v -v ./d 1 2 3
    $ zsh -e -e ./d 1 2 3
    $ ksh -e -e ./d 1 2 3
    $ bash -e -e ./d 1 2 3

The thing being tested: will a shell handle > 1 option before a script
file name. Each shell invocation of the "./d" script should echo the
script file arguments "1 2 3".

***
### From: Jamie Lokier

    Paul Jackson wrote:
    > 1) If argv[1] starts with a '-', consume and handle as an option
    > (or possibly as a space separated list of options).
    > 2) Presume the next argument, if any, is a shell script file.
    > 
    > I would be surprised if any of the major shells are coded this way.

It would have been a "smart" thing for Perl to do, extra friendly for
programmers, auto-configuring with a test at installation time of
course. I doubt Perl does that but it wouldn't surprise me - it seems
like quite a good idea - Perl scripts using the capability would even
be portable :)

-- Jamie

***
### From: Hansjoerg Lipp

    On Mon, Feb 23, 2004 at 01:46:10PM -0800, Paul Jackson wrote:
    > Andries Brouwer wrote:
    > > If there is such nonblank text then for SysVR4,
    > > SunOS, Solaris, IRIX, HPUX, AIX, Unixware, Linux, OpenBSD, Tru64
    > > this group consists of precisely one argument.
    > > FreeBSD, BSD/OS, BSDI split the text
    > 
    > Interesting - I notice that 9 Operating Systems, in addition to Linux,
    > don't split the optional shebang argument, and 3 do.

Yes. And this shows, that Linux would not be the first OS which splits
arguments. One more reason, why I'm sure this change won't cause lots of
problems.

    > All else equal, I am not enthusiastic about a somewhat arbitrary change
    > that could be done either way, that is actually done more often in other
    > operating systems the current way, and that potentially affects both
    > script files and their interpreters (shells, awk, perl, python, guile,
    > tcl, bc, ...).
    [...]

As written in my previous mail, it only affects scripts, that already
have multiple arguments in the shebang line. So, I don't see a lot of
problems here.

    > And, to be truthful, the usual way that I code awk scripts is not as
    > a shbang script with an interpreter of awk,
    > 
    > #!/bin/awk
    > BEGIN ...
    > 
    > but rather as a quoted awk script within a shell script:
    > 
    > #!/bin/sh
    > awk '
    > BEGIN ...
    > '
    > 
    [...]

This may be right for awk, although I still consider wrapper scripts to
be somewhat awkward. But your argument is not true for shells, perl,
python, ... And I still think, it's somewhat strange, that perl has to
parse the shebang line of the scripts, because the OS can't do it. And
as other interpreters don't act this way, there are totally unnecessary
restrictions writing certain scripts...

    > This is a portable habit, that avoids all the afore mentioned
    > limitations and inconsistencies in shbang handling.

If you write scripts for several OSes you are right. On the other hand,
I don't see any reason, why one should stick to the limits of some other
operating systems, when it's not necessary. Acting this way will never
change these limitations. If the three OSes mentioned above _and_ Linux
handle the shebang line in a more sensible way, this could be one step
to get rid of these inconsistencies.

Regards,

Hansjoerg Lipp

***
### From: Hansjoerg Lipp

    On Mon, Feb 23, 2004 at 02:24:51PM -0800, Paul Jackson wrote:
    > Hansjoerg wrote:
    > > #!/bin/zsh -v -x
    > > ...
    > > this should be "evidence" enough(?)
    > 
    > This testing was done on a system with your patch applied, right?

Yes. The results are the same if you use a stock kernel and call the
script manually.

    > Because on a stock kernel, the various shells are of course
    > confused by the "-v -x" argv[1].

Yes, of course.

    > I will grant that ksh, bash, ash, tcsh and zsh are likely ok
    > (willing to see > 1 option before the script file name.)
    > 
    > An alternative way to test the same thing, that works even on
    > a stock kernel:
    > 
    > $ echo 'echo "$*"' > ./d
    > $ ash -e -e ./d 1 2 3
    > $ tcsh -v -v ./d 1 2 3
    > $ zsh -e -e ./d 1 2 3
    > $ ksh -e -e ./d 1 2 3
    > $ bash -e -e ./d 1 2 3
    > 
    > The thing being tested: will a shell handle > 1 option before a script
    > file name. Each shell invocation of the "./d" script should echo the
    > script file arguments "1 2 3".

This works as expected.

Regards,

Hansjoerg Lipp

***
### From: Paul Jackson

    > I don't see any reason, why one should stick to the limits of some other
    > operating systems, when it's not necessary.

If I make it a habit to write portable code, then over the years, I
cause fewer problems for myself and others. More things "just work". 
I've got scripts that I use that are 10 or 20 years old, and have been
used on all manner of evironments that could not have been anticipated
when the script was first written.

Also my habits need not change - the more things I can do without
thinking, the more thinking I have left over to do something useful.

Somedays, boring beats fine tuning.

***
### From: Hansjoerg Lipp

    On Mon, Feb 23, 2004 at 02:00:27PM -0800, Paul Jackson wrote:
    > Hansjoerg wrote:
    > > I still don't understand your argument... If there is a shell having
    > > those problems, nobody would use something like
    > 
    > I will acknowledge that while one _could_ code a shell so that your
    > proposed change would break it, it would be a stupid, silly and ugly
    > way to code a shell.
    > 
    > That is, one _could_ code a shell to say:
    > 
    > 1) If argv[1] starts with a '-', consume and handle as an option
    > (or possibly as a space separated list of options).
    > 2) Presume the next argument, if any, is a shell script file.

There is no problem with such a shell if you use scripts beginning with

    #!/some/shell

or

    #!/some/shell -some_arg

if some_arg does not contain whitespace characters. In both cases,
argv will be the same as it is with the current code.

    /some/script param1 param2

will become

    /some/shell /some/script param1 param2

or

    /some/shell -some_arg /some/script param1 param2

as it has been before.

There is a problem with a shebang line like

    #!/some/shell -x -y

_but_ this was most probably an error, before. (Unless this shell
accepts _one_ parameter "-x -y" containing a space.)

So, I really can't see any problem with such a shell...

Regards,

Hansjoerg Lipp

***
### From: Paul Jackson

    > So, I really can't see any problem with such a shell...

I think we are agreeing on the technical details.

But not on the relative weight of the potential problems
versus the value of the change you propose.

***
### THE END.
