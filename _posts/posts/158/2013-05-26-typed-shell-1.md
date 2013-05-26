---
layout: post
uri: /posts/158
permalink: /posts/158/index.html
title: Typed Shell：给Unix Shell加上类型系统（1）
category:
tag:
description:
published: true
disqus: false
lang: zh
---

## 写在前面

>>> _Those who don't understand Unix are condemned to reinvent it, poorly._  
>>> _那些不懂Unix的人，活该他们要把它以蹩脚的方式重复发明一次。_  
>>> _- Henry Spencer_

很不幸，这里要做的，从某种程度上就是“reinvent”Unix的一部分。所以，如果你觉得已经足够懂得Unix，而且Unix本身的设计对你来说已经“足够好”，这篇文章就不是你应该看的。Happy hacking。



## Unix: Unfriendly *nix

>>> _Unix is simple. It just takes a genius to understand its simplicity._  
>>> _Unix是简单的。但唯有天才方能理解它的简单性。_  
>>> _- Dennis Ritchie_

>>> _Unix is user-friendly. It just isn't promiscuous about which users it's friendly with._  
>>> _Unix是用户友好的。它只是在“对于哪些用户友好”这件事情上做得比较有节操。_  
>>> _- Steven King_

嗯，我们不用遮遮掩掩：Unix从设计上本来就不是用户友好（user-friendly）的。它是天才友好（genius-friendly）的。而且要我说的话，这里的“天才”还可以再加上一个限定条件：“比正常人更擅长记忆并且运用一些非人性化的规则，而且在写代码或者敲命令的时候永远头脑清醒，如机器一般永远不会出错“。

什么是一个好的用户体验设计？程序在机器上跑，一台理想的机器是永远不会犯错的；只要程序的设计建立在正确的计算模型上，它就会永远正确工作并终止，或在执行过程中保持其算法的productivity（Turing机意义上的）；而人类是容易犯错的，所以，在一个软件系统的设计上，人的交互因素才是最脆弱的一环。一个好的用户体验设计应该允许“愚蠢的人类”犯错，它可以在人操作失误时给出警告，而绝非造成灾难性的后果。如果因为用户不小心多敲了一个空格就清空整个根目录；如果因为程序员不小心写错了一个指针就导致程序的意外崩溃；那么至少从用户体验的角度来看，它们很糟糕，因为它们给了用户足够的绳索用来吊死自己（gives you enough rope to hang yourself）。而Unix和C，就是这样的典范。

<img src="http://i.imgur.com/OSRIYVA.jpg" width="50%"/>

[Worse is better](http://en.wikipedia.org/wiki/Worse_is_better)的哲学，导致Unix和C的设计从一开始就包含了许多大坑（pitfalls）。当然，这个世界上没有什么东西一开始就是完美的；但是，如果你因为多年的开发经验熟知了这个系统或者这门语言的每一处坑，并且以此作为自己是“高端用户”的证明而感到深深的优越感，这就是你的不对了。因为这并不会给麻瓜和初学者带来任何的好处。长年坚守一个先天缺陷的设计会限制技术的发展；而这就是为什么我们在尝试新的操作系统和学习新的程序语言时，不应该保留任何节操的原因。

每一个最初接触C的程序员都会因为诸如指针未初始化或下标访问越界之类的问题头疼不已。“Hey, it compiles!”他们说，但是它却不work；运行时仍然会不时跳出诡异的segfault。好一点的情况是，你在测试阶段发现了错误，及时修复了这个（也许花了一个多小时才调试出来的）野指针；糟糕的情况是，这个产品在没人知道它有bug的情况下被部署下去了，然后不知道在什么时候因为一个小小的指针而弄垮客户的系统。因为这样或那样的原因，C从一开始被设计出来，就让人难以[从形式上验证](http://en.wikipedia.org/wiki/Formal_verification)程序代码的“[正确性](http://en.wikipedia.org/wiki/Correctness_\(computer_science\))”；从机器的角度看，你甚至也很难确保用它写的程序不会变成一个疯狂吞噬系统资源的怪物（有趣的是，历史上比C发明得早得多的Lisp甚至早就填补了C的这两个大坑，通过__函数式编程__和__GC__——早些年曾被视同玩具的概念）。这些设计，往好的方面说，确实造就了C代码无与伦比的编译和执行效率，在机器硬件资源极端受限的年代，这的确很重要；往坏的方面说，它们也是C最大的命门所在：如果你不够小心，你的代码就会像是一把随时可能走火的枪。一个人或许可以花21天的时间“学会”一门C/C++这样的高级语言；但也许需要[十年](http://norvig.com/21-days.html)甚至更多的时间，他才能学会怎样用这些语言写出真正高质量的代码。

>>> _C makes it easy to shoot yourself in the foot; C++ makes it harder, but when you do, it blows away your whole leg._  
>>> _C语言让你很容易射中你自己的脚；C++把这件事情变得更难发生，但如果你真的这么做了，它会爆掉你的整条腿。_  
>>> _- Bjarne Stroustrup_

Unix也存在着相类似的问题。当然，我们大部分人都不是kernel hacker，用不着关心宏内核和微内核哪个设计更先进，哪个又更容易实现之类的[论战](http://en.wikipedia.org/wiki/Tanenbaum%E2%80%93Torvalds_debate)。对于Unix的批判，90%以上都集中在Unix的user space，因为这才是普通用户和开发者需要接触到的部分。

我们都知道在Unix shell下面，哪怕是多打了一个空格[都可能引发一场惨剧](http://coolshell.cn/articles/4875.html)。就算你自己在输命令的时候一再小心，你也永远无法预知你运行的某个sb安装脚本里面把`rm -rf /usr/lib/nvidia-current/xorg/xorg`“不小心”写成了`rm -rf /usr /lib/nvidia-current/xorg/xorg`；或者你习惯用`rm -rf ${MY_APP_BUILD}/`清空某个临时文件夹，然后忽然有一天你的脚本“忘了”给`MY_APP_BUILD`这个变量赋初值。使用这样的操作系统，你必须时刻保持头脑清醒，好让自己的思维跟机器一样精准，否则就容易酿成大祸。

C很难，Unix也很难。难就难在我们这些“愚蠢的人类”需要记忆太多不自然的规则，训练自己去迎合机器的工作方式，而不是完全以人类的思维方式去表达、让机器做想做的事情。出了问题，是谁之过？责怪自己太马虎大意么？还是责怪机器太忠实地执行了你给它的指令？



## 从丑陋的Shell说起

>>> _This is the Unix philosophy: Write programs that do one thing and do it well. Write programs to work together. Write programs to handle text streams, because that is a universal interface._  
>>> _Unix哲学是这样的：写程序，让它只做一件事情，并且把它做好；写程序让它们去协同工作；写程序去处理文本流，因为它是一种万能的接口。_  
>>> _- Doug McIlroy_

是的，这是每一个Unix用户都知道的金科玉律。它体现了贯彻于Unix系统设计中的三点重要原则：

1. 功能完整性；
2. 高内聚（high cohesion），低耦合（low coupling）；
3. 进程间通信采用无类型的文本管道机制（[pipeline](http://en.wikipedia.org/wiki/Pipeline_\(Unix\))）。

第一点和第二点从理念上来说无可挑剔。很不幸，第三点，虽然一直以来被认为是Unix“简单性（simplicity）”的完美体现，却在某些地方引入了不必要的复杂度；为了追求简单而简单的哲学是短视的，它注定要成为设计上的一个坑。

下面在进入正题之前，我想用一个最近遇到的问题来作为开始。这是一个日常的Shell任务：显示当前路径下所有以`.db`为后缀的数据库文件名。

这看起来再简单不过了。`ls -R`用来递归地打印出当前路径的内容，借助灵活的管道机制，将其结果传递给`grep`执行一个简单的正则匹配，就能找出所有以`.db`结尾的文件名：

    $ ls -R | grep '\.db$'

（我们很容易就能养成把正则放在单引号中的习惯，总是对`.`进行转义，所以，记住这些规则并不算困难。）

但是上面这条命令，果真能找到当前目录下__所有的__`.db`文件吗？你已经看出来了，它不能；`ls`命令默认情况下会忽略所有以`.`打头的文件名。为了把这些被隐藏的文件也包含进我们的输出结果，我们需要使用：

    $ ls -Ra | grep '\.db$'

这就是上面问题的正解。

现在，试着运行一下：

    $ ls -Ra | grep '\.db$'
    Movies.db
    Users.db
    wc.db

意外地，一个叫做`.svn/wc.db`的文件混进来了。这并不是我们想要的结果，因为我们关心的是真正属于项目本身的`.db`数据库，而不是用Subversion来做版本控制时用到的这样一个`wc.db`。既然如此，我们可以直接让`ls`忽略这个文件名：

    $ ls -RaI'wc.db' | grep '\.db$'

现在，问题又来了：

1. 假如项目中用到了和`wc.db`同名的文件，怎么办？上面这条命令会一概把它们忽略掉。事实上，我们需要忽略的只是`.svn/`下的`wc.db`，而不是其他地方的`wc.db`。

2. 把需要忽略的文件名放在`-I`参数中去指定并不是一个好主意。假如需要忽略的是整个文件夹的内容的话？

你大概已经知道，一个Git版本管理下的路径会出现一些以`.sample`为后缀的文件名：

    $ ls -Ra | grep '\.sample$'
    applypatch-msg.sample
    commit-msg.sample
    post-update.sample
    pre-applypatch.sample
    pre-commit.sample
    prepare-commit-msg.sample
    pre-rebase.sample
    update.sample

假设要处理的是项目中的`.sample`文件，我们当然不希望把`.git/`里面的这些文件也包含进来。

综上，我们需要的是这样一种机制，能够递归地访问当前路径下的所有文件，但又能忽略这样一些满足任意指定条件（比如，位于`.svn/`或`.git/`目录下）的文件。

单靠`ls`做不到，因为`-I`选项所做的只是针对文件名的简单匹配。我们需要借助于别的命令。

另一个问题或许更具有实际意义。假如我想递归地找出当前路径下的全部`.db`文件，并且删除它们呢？

显然，在这种情况下，我们需要`.db`文件的完整路径名，而不只是一个单纯的文件名。

一件非常奇怪的事情是，`ls`命令提供了递归访问并打印目录内容的能力，但是，却没有一种简单直观的方式能够直接使用`ls`来为文件输出完整的路径。举例来讲，如果我们希望看到这样的输出：

    ./db/Movies.db
    ./db/Users.db

不使用其他命令且不借助外部文本处理工具`sed`、`awk`，只允许使用`ls`的做法是这样的：（我不知道还有没有更简单的办法）

    $ ls -RaI'wc.db' | while read l; do case $l in *:) \
    d=${l%:};; "") d=;; *) echo "$d/$l";; esac; done | \
    grep '\.db$'

再回顾一下Unix的哲学：一件东西只做一件事情，并且把它做好。原则上说，这句话当然是合理之至的；但是，关于什么事情是应该做的，什么事情是不该做的，哪些功能重叠的部分应该被抽出到独立的组件中，Unix却没有提供一套合理的设计与分工准则。这导致了两个结果：为了完成一项日常的任务，一些小工具被通过管道、`grep`、`sed`、`awk`或`perl`组合起来，以一种怪异且可读性较差的形式；与此同时，为了简化解决某些问题的过程，一些好用的工具被发明出来了，它们大大地简化了某些操作，但是在功能上却多有重叠。功能重叠倒算不得什么大问题，对于用户来说最糟糕的是，它们的命令行参数很多时候都互不兼容，缺乏一致性（因为它们在设计上有着不同的历史渊源），以至于你每次学习一个新命令，就必须重新学习这些基本选项的用法。

如今，我们中的大部分人都已经厌倦了前一种纯Shell组合的做法，比起颇有创意却混乱不堪的one-liner，我们宁可去写一些逻辑清晰的、易写易读可重用的Python或Ruby脚本，来执行我们的日常系统任务。不过，Shell的作用仍然是无可取代的，因为我们目前还不能拿任何一种语言的交互界面来当作Shell使。这种时候，我们就不得不去学习一些虽然设计上很quirky、却惊人地管用的Unix命令。

比如，findutils。

一开始，你会发现`find`命令简直太好用了。它轻易就能解决以往需要`ls`和一堆正则匹配组合才能解决的问题，能够输出完整的文件路径（正如你已经看到的那样，如果只用`ls`来实现，会很麻烦）：

    $ find . -name '*.db'

只输出符合条件的文件而非文件夹？这也很简单，

    $ find . -type f -name '*.db'

忽略某个文件夹的内容，你一开始想到的解决方案可能是稍微借助一下`grep`。这样的写法仍然不失直观：

    $ find . -name '*.db' | grep -v '^\./\.svn/'
    $ find . -name '*.sample' | grep -v '^\./\.git/'

作为一个对效率要求苛刻的人来说，上面这种写法其实很不科学。在`find`的执行过程中遍历了当前路径下的每一个子目录，然后管道传递给`grep`，把所有来自`.git/`的文件过滤掉；事实上，我们应该在一开始就让`find`在处理时直接忽略掉这个我们毫不关心的文件夹，完全不去做遍历，因为这个文件夹也许会很庞大，处理起来非常耗时。所幸，`find`命令提供了这项功能。

OK，现在，我们提出的实际需求是：找出当前路径下__不在__`.git/`文件夹中，__且__后缀名为`.sample`的所有文件。

问：下面四条命令，那一条能够返回正确的结果？

    #1
    $ find . -not -path '.git' -and -type f -name '*.sample'

    #2
    $ find . -not -path './.git' -and -type f -name '*.sample'

    #3
    $ find . -not -path '.git' -or -type f -name '*.sample'

    #4
    $ find . -not -path './.git' -or -type f -name '*.sample'

答：虽然这四条命令均合法，不过，它们全部是错的。

`find`参数表达式里的`-not`并非如你预期的那样工作。你需要使用一个叫做`-prune`的参数，而不是`-not`：

    $ find . -path './.git' -prune -type f -name '*.sample'

试一下，还是啥都没有。大概是因为没加`-and`？

    $ find . -path './.git' -prune -and -type f -name '*.sample'

这与上面的写法其实是等价的。

把`-and`改成`-or`，奇迹出现了：

    $ find . -path './.git' -prune -or -type f -name '*.sample'

我们之前的问题叙述是：找出当前路径下__不在__`.git/`文件夹中，__且__后缀名为`.sample`的所有文件。用`-or`而不是`-and`，这是啥神逻辑？

嗯，还有一点。虽然用了`find .`来表示查找当前路径，但是在`-path`参数里面，你仍然需要在目录名前加上`./`来表明这个指定的路径属于当前路径。如果用了`-path '.git'`而不是`-path './.git'`，你会得到不一样的结果。不信的话可以试试。

    $ find . -path '.git' -prune -or -type f -name '*.sample'

等一下，先撇开这些反人类的逻辑不谈，我们的命令输出的结果仍然不是正确的。因为它多了一个不是`.sample`文件的输出：

    $ find . -path './.git' -prune -or -type f -name '*.sample'
    ./.git
    ./samples/1.sample
    ./samples/2.sample
    ./samples/hello.sample

然后，你要知道这个`./.git`几乎是无可避免的，除非你手动在命令的最后加上`-print`参数：（虽然`find`的帮助里会告诉你“`-print`是默认的表达式”）

    $ find . -path './.git' -prune -or -type f -name '*.sample' -print
    ./samples/1.sample
    ./samples/2.sample

这又是啥神逻辑？

好吧，到这里，虽然我很想告诉你问题已经完满地解决了，尽管从逻辑上反人类，`find . -path './.git' -prune -or -type f -name '*.sample' -print`这条命令确实是解决该问题的正确方式。但是我却不能。

原因就在于，该命令的确完美地__打印出了所有符合条件的文件路径__。这句话意味着什么？

当需要删除用`find`找到的所有后缀为`.sample`的文件（夹）时，假如你这么做：

    $ find . -path './.git' -prune -or -name '*.sample' -print | xargs rm -rf

而你的某个文件名称中包含了空格，空格的后面跟的又偏偏是一个点`.`，甚至两个点`..`，你就死定了！

    $ rm -rf ./samples/1 . .sample ./samples/2.sample

更恶劣的是，Unix不但允许空格，而且允许在文件名中使用换行符。嗯，看到这里，你或许想要顺便给某个文件名里面加个`rm -fr $HOME`什么的，检测下用户有没有养成良好的Shell使用习惯。

___TIPS:___ _在Unix的文件系统下，只有两种字符不允许用在文件名中：`/`和`NUL`（ASCII的0）。其他任何字符都可以作为文件名的一部分。_

所幸的是，GNU findutils提供了这样一种机制用以避免文件名中包含空格或换行符导致的安全隐患：使用`-print0`选项。

    $ find . -path './.git' -prune -or -type f -name '*.sample' -print0
    ./samples/1 . .sample./samples/2.sample%

打印出来，它就像是把所有的结果都连在了一起。在终端里你看不出什么，得把它重定向到文件里，用文本编辑器查看：

    $ find . -path './.git' -prune -or -type f -name '*.sample' -print0 > test

![](http://i.imgur.com/PmBla8D.png)

注意到每个文件名的后面都跟了一个`NUL`字符（在大部分编辑器中用`^@`表示）。因为`NUL`绝不可能是文件名的一部分，用`NUL`来分隔未字符转义的文件名列表是解决这个安全隐患的最佳hack方式（事实上，也是唯一的hack方式，因为另一个绝对不可能出现在文件名中的字符`/`，已经被用来表示路径了。）

简单的总结：

找出当前路径下的所有`.sample`文件并删除，应该用

    $ find . -path './.git' -prune -or -type f -name '*.sample' -print0 \
    | xargs -0 rm

但是，用`-print0`输出的结果使用`NUL`来分隔，在终端里很难阅读。所以在查看这些文件的时候，你还是得用`-print`：

    $ find . -path './.git' -prune -or -type f -name '*.sample' -print

现在来回顾下我们一开始打算处理的任务：用一条命令删除项目文件夹下所有符合某个条件的文件，排除`.git/`文件夹在外。从逻辑上，这很简单；如果你用任何一种严肃的编程语言来写一段处理这个任务的脚本，这也不难办到。

但是，为什么用Unix命令就这么难？或者说，为什么它们的设计就如此丑陋，以至于你必须学习所有这些不合常理的、反人类的规则，为了一条再简单不过的用法而去Google，去StackOverflow上找答案；甚至在熟悉Unix多年以后，还会在Shell里敲命令的时候手发抖，生怕多敲少敲一个字符而把珍贵的数据毁于一旦？

![](http://i.imgur.com/DOrYPPc.gif)

[《Unix痛恨者手册（The Unix-Haters Handbook）》](http://en.wikipedia.org/wiki/The_Unix-Haters_Handbook)中用了专门的一章来吐槽`find`程序。这段话解释了为何Unix的`find`命令如此不靠谱和反人类的原因：

>>> _The Apple Macintosh and Microsoft Windows have powerful file locators that are relatively easy to use and extremely reliable. These file finders were designed with a human user and modern networking in mind. The Unix file finder program, find, wasn’t designed to work with humans, but with cpio — a Unix backup utility program.... As a result, despite its importance to humans who’ve misplaced their files, find doesn’t work reliably or predictably._  
>>> _- The Unix-Haters Handbook_

不过，`find`命令的用户友好度倒不是我今天想要吐槽的重点——命令行这种东西嘛，充其量也不过是个外壳，就算语法不太科学不太人性化，用一用也许就适应了——如果诸位读者能看到这里，至少也算得上是熟练的Unix用户了，记住这种命令的用法自然是小菜一碟。但，这种设计方式其实也造成了一个直接的后果：学习Unix shell脚本编程，事实上比学习Python或Ruby编程甚至更困难。不是因为它提供的东西太多，而是因为它提供的东西实在太少了，而且这些少得可怜的东西在用户接口上又是如此奇葩，如此地不一致。__Shell从一开始就没打算设计成一个严肃的脚本语言，它只想急于解决Unix在设计之初所面临的基本需求：让用户交互式地在终端里执行一些命令，好让系统kernel和各种user space程序去做它们该做的任务。__

撇开语法谈本质，为何对Unix shell的不恰当使用会带来如此致命的安全隐患，为何`find`会需要有`-print0`这种丑陋的hack来为字符串之间加上`NUL`分隔以避开这类隐患，一切都可以归咎到Unix的哲学本身：__进程间使用无类型的数据流来进行通信__，这也就是Unix脑残粉们所津津乐道的[管道机制](http://en.wikipedia.org/wiki/Pipeline_\(Unix\))。

也许会有人质问，Unix的进程间通信怎么会是无类型？Unix的管道难道不是基于文本，也就是字符串的吗？

好，如果你提到了“字符串类型”，就证明你认为Unix的管道是“有类型”的。而事实上，它不是。你可以有一段Unicode编码的文本，可以有“看起来像是”一个整数或浮点数的数据，可以有一段无法在终端里打印的二进制数据；在Unix的管道里，它们仍然是被无差别对待的。试想：

    $ expr 1 + 2
    3

如果是在某种具有严格类型的编程语言的REPL下，那么这里返回的`3`显然应该是一个整型值。你的程序语言知道它是一个整型数据；任何隐式的类型cast都是危险的，把它直接赋给一个浮点型或字符型的变量会导致程序产生预料之外的行为。一个健全的解释器或编译器会给出警告，或者直接禁止你这么去做。

但是，如果你是在Unix shell中，这段数据事实上是这样的：

    $ expr 1 + 2 | hexdump
    0000000 0a33                                   
    0000002

这是啥玩意儿？`33`是ASCII字符3，`0a`是换行符，所以，这段被Unix管道传输的数据相当于`"3\n"`——它压根就不是整型值3。没人知道这段数据的真实含义是啥，是一个字符串，一个ASCII字符`3`外加一个换行符，一个浮点数，还是真的就只是单纯的整型3。所以，类型检查什么的是根本不可能做到的。

因此，当执行这段命令时：

    $ expr 1 + 2 | xargs expr 4 +
    7

前一个`expr`传给管道的是一段文本，后一个`expr`接收的也是一段文本。数据流依照某种格式约定被“cast”成了可以被机器运算的整型，当然在输出到终端或管道的时候还得再cast回去。

如前所示，我们在用带`-print0`参数的`find`命令管道到`xargs -0 rm`命令去执行删除操作的时候，被传递的数据实际上是一个由`NUL`分隔的字符串列表。这也是一种约定。如果程序之间没有一个良好的约定（到底是用空格、`\t`、`\n`还是`NUL`来分隔列表较为稳妥？），这段命令的安全性就无法得到保障。

所以，如果你说：文本可以用来表示一切数据，喷它说明你丫不懂得Unix的简单性就在那瞎BB；我要说：没错，文本是很简单，而且这个世界上的一切东西均能通过文本来表达，但是进程需要处理各式各样的数据，__数据应当是有类型的，为了追求简单性而拿文本来做万金油式的接口是一种糟糕的解决方式——在没有一套完备的协议（protocol）的情况下。__否则，我们的程序语言为什么要有那么多的数据类型，所有的东西都拿文本来表示不就够了，既方便用户输入又方便输出？

谈谈这种设计方式的缺陷：

1) 每一个进程在进行输入输出、管道通信的时候，都需要从无类型的数据（即文本）中解码和编码，得到所需相应类型的数据。当然，这件事情的效率本身倒不是它的主要问题。

2) 因为没有类型，不存在类型检查，Unix又不曾为进程间通信的管道机制提供一个一致的协议，所能做的就只有彼此间对“文本格式”的一些简单约定：“嗨，我需要你给我一个文件名的列表，我会去删除它们。你可以用空格或者`NUL`隔开每一个文件名；怎样都无所谓。不过，如果你用了空格，而你的文件名里又出现了不该出现的空格，那你就等着去死吧。”

弱类型和隐含转换永远是万恶之源。当你无意识地打入

    /usr /lib/nvidia-current/xorg/xorg

的时候，你或许期望：1) 我想删的东西只有一个文件夹，所以这个参数应当是String类型，就好像我在这里显式地使用了引号一样：`'/usr /lib/nvidia-current/xorg/xorg'`，而不是一个String List（`/usr`、`/lib/nvidia-current/xorg/xorg`）；2) 退一步说，如果我的参数被当作了一个String List，那么系统的`rm`命令应当只允许传递String类型的参数，因此类型检查不会通过。

然而Unix无法做到任何与类型相关的保障。一条“语法正确”的命令事实上有没有错，只有等到运行时才知道；更可怕的是，Unix命令的执行方式是stream的，也就是说，等到它提示你“rm: cannot remove ‘/lib/nvidia-current/xorg/xorg’: No such file or directory”，你意识到某个Shell脚本也许出了点差错的时候，`/usr`早已经被它删干净了。于是就出现了这样的[神作](https://github.com/MrMEEE/bumblebee-Old-and-abbandoned/commit/a047be85247755cdbe0acce6)。

![LOLCAT](http://i.imgur.com/PNPQ8wq.jpg)

如果Unix拥有一个类型系统，那么，诸如此类的安全隐患就完全可以避免。

3) Unix程序间用于通信的数据流，与面向最终用户的标准输入/输出流原则上不加区分。简单地说，你用某条命令在终端上看到的输出结果是什么，用管道喂给下一个程序的输入数据就是什么。这样做的理由是？当然是为了它所谓的简单性。

可是，对于一个命令行程序（command-line program）来说，标准输入/输出同时也是它的用户界面（User Interface），它需要做到友好，需要人性化；而程序与程序间的通信则是另一回事：它应当有利于机器解析出有用的数据，且精确无二义性，甚至需要一个完整的协议，而不是像Unix的管道机制这样，一切都是既没类型又没协议的“文本文本文本”。这导致的结果就是，这么多年来，Unix的许多组件仍然没有什么实质的改进，不管它们看起来有多蹩脚。想把某条命令的输入输出格式改得更用户友好些？对不起，这也许就破坏了许多现有脚本的兼容性。

回避这个问题的方法，嗯，你大概已经想到了，操作系统的Shell应该以一种类似程序语言REPL（Read–Eval–Print Loop）的形式存在，而不是像现在这样，数据本身和标准I/O胡子眉毛一把抓。例如，当输入`ls`的时候，就是对当前目录下文件列表的一次求值，返回的值（一个String List）通过REPL回显给用户，以一种显而易见的方式：

    $ ls
     => ["./samples/1.sample", "/samples/2.sample"]

`ls`这个函数调用本身并不应该涉及到标准I/O——它的功能仅仅是求值，访问文件系统获得一个当前目录的List，然后返回。这么一来，我们就把Unix的`ls`命令的两项本不该放在一起的功能解耦出来了：一是访问文件系统，获取文件列表的值，这是`ls`的本质工作；二是把取得的值传送到标准输出，这不是`ls`的本质工作，因为这个世界上还有许许多多的值需要我们输出到终端，让一个通用的组件来handle这件事情，才是更为合理的设计选择。所以你看，Unix“一件东西只做一件事情，并且把它做好”的哲学其实是糊弄小孩子（fanboy）的，`ls`做的可不止是一件事情（而且其实也没有做好）。

假如我们要写一段脚本而不是交互地执行Shell，显然单纯的求值是不会被输出到终端的，这个时候就需要用到专门负责处理I/O的函数了（假定它叫做`echo`，当然你也可以根据个人喜好把它命名为`print`、`write`、`puts`或者`p`什么的——没错，就是Ruby里面的`p`。 ）

    $ echo ls
    ["./samples/1.sample", "/samples/2.sample"]
     => 0

`echo`函数的返回值是`0`——这是一个Unix命令执行成功的标准返回值。对于一个我们不关心其返回值只需要其副作用（标准I/O操作）的函数，遵循惯例返回`0`就OK。（其实似乎应该把它定义为一个Unit类型才合适）



## 对Unix Shell的改良设想

首先，我必须声明，对Unix哲学的吐槽有着悠久的历史和广泛的群众基础，[我不是一个人在战斗](http://www.mindspring.com/~blackhart/)。操作系统是给我们拿来用的，我们是用户，用户就是上帝；把一个操作系统当成高端洋气的神物崇拜，硬要把设计上不友好的地方说成是它的功能特性，这是本末倒置。我们要持之不懈地坚持黑Unix路线一百年不动摇。

Unix系统和C语言的发展相辅相成，然而它们从设计上却是分立的：对于开发人员来说，需要学习的是C的系统API；对于普通用户来说，需要学习的是Shell，以及sed和AWK，还有其他数不胜数的稀奇古怪的Unix命令。Unix没有一个单一语言技术框架来把系统编程和用户界面有机地统一起来。当然，这或许可以归咎于C是一种过于低级、贴近机器而非贴近计算的语言，以至于系统的设计者不想把C的底层库暴露给用户——这就是Shell和其他许多命令行小程序存在的意义。如果要从一个日志文件中用正则提取你需要的信息，你会为此专门写一个几十行甚至上百行的C程序吗？你大概不会，你所要做的只是几句Shell，把一些命令组合在一起而已；当你发现Shell和那些命令的字符串处理能力不够用的时候，一些林林总总的文本处理工具：ed，sed，还有神奇的AWK，及时地出现了；但是，Unix黑客们仍然感觉到写一些处理日常任务的脚本程序太费力，所以，他们最终发明了Perl；但后来随着Perl变得越来越丑陋，一种设计上更加现代的脚本语言，Python，变得更加流行了。相比起其他操作系统，Unix有一个很大的贡献，就是它大大促进了新的程序语言、尤其是脚本语言的发明。It's not a joke.

对于操作系统的改良探索，无论是在工业界还是在学术界都一直未曾停止过。这些新的设计方案，无一例外，都是高度统一了“系统接口”和“程序语言”这两个概念的产物。如果Unix真的是为hacker设计的操作系统，那么它就不应该让开发者去用C做系统调用、写一些功能上完全分离的用户态程序，然后让用户去拿Shell脚本拼拼凑凑地执行这些程序；它应该直接让所有的用户都用同一种语言来搭积木，考虑到——学会Shell编程并能把那些稀奇古怪的Unix命令运用自如，其实比起学会C来并没简单多少，虽然在解决特定问题的难易程度上有所差异。

不，我们不能让C来做这个统一的语言：因为它提供的抽象级别远远不够，它本来也不适合去做DSL。Unix既然采用了非常底层的C来实现，那么选择一种和C截然不同的、设计粗糙只适用于特定任务的Shell来做它的前台，几乎是必然的选择结果。

系统实现和用户界面语言保持一致的实例，其实并不罕见：

1. 基于汇编/机器指令的裸机。这是机器唯一能够识别的语言，在没有OS/高级语言的时代，也是用户唯一需要掌握的语言。

2. 基于Lisp语言的[Lisp Machine](http://en.wikipedia.org/wiki/Lisp_machine)。

3. 基于[Oberon语言](http://en.wikipedia.org/wiki/Oberon_\(programming_language\))的[Oberon](http://en.wikipedia.org/wiki/Oberon_\(operating_system\))。

4. 基于[Clean语言](http://en.wikipedia.org/wiki/Clean_\(programming_language\))的[Famke](http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.10.5587)。

本文后半部分的工作从理念上和Clean/Famke较类似。当然，我们要做的不是一个full-fledged的OS kernel，而是给现有的Unix加上一个类型安全（type-safe）的仿Shell实现。

既然说到了类型，那干嘛不提Oberon呢？它不也是一种强类型的语言吗？理由很简单：一、Oberon语言不支持函数式编程，很快你将看到，为什么我们的这个仿Unix shell中会需要用到高阶函数；二、Oberon语言没有concurrency的原生支持，从设计上说，没有为concurrency提供原生支持的语言一般做起它来会显得比较臃肿（说白了，有那么多现成的支持concurrency的语言，我们干嘛不用）；三、Oberon操作系统只支持单用户单进程（WTF？！）。因此，它并不能胜任现代计算的需求，尽管在设计原则上比起Unix有不少先进之处，却注定要被历史所淘汰。

Famke从设计上作为一个“强类型函数式”的操作系统，以Clean作为它的系统语言（貌似Famke系统和Clean语言本来就是同一帮人搞出来的）。Clean是一个很有意思的语言，它与Haskell同属纯函数式，同样采取惰性求值策略，然而使用了一种与monad不同的机制（[unique type](http://en.wikipedia.org/wiki/Uniqueness_type)）来处理I/O和可变态。不过在这里，真正让我感兴趣的不是Clean这个语言本身，而是Famke系统的“Shell语言”——[Esther](http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.60.6441)，它所采用的正是Clean自身的类型系统；事实上，Esther程序同时也是合法的Clean程序。这是一个很好的启发，如你所见，一个带类型系统的Shell确实可以避免许多问题——如果这个“Shell语言”同时也是操作系统本身的实现语言的话，那简直可以称得上完美了。

有了类型系统，然后呢？

没错，我们想要的其实就是first-class function这件事情。Unix管道这种进程间的数据通信方式，完全可以从[函数组合（function composition）](http://en.wikipedia.org/wiki/Function_composition_\(computer_science\))的角度来理解（不信？看[维基百科](http://en.wikipedia.org/wiki/Pipeline_\(Unix\))）。现在既然我们要为数据加上类型检查，我们的Shell又要和Unix shell一样支持管道，那么，假如我们的Shell不支持函数式编程的特性，那就有点说不过去了。

下面举个例子来说明，我们设想中的这个带类型的函数式Shell应该是什么样子。

在[Scsh](http://en.wikipedia.org/wiki/Scsh)中要想删除当前文件夹下所有扩展名为`.db`的文件，大致的写法是：

```scheme
(for-each delete-file
  (filter
    (lambda (name)
      (equal? (file-name-extension name) ".db" ))
    (directory-files "." #t)))
```

它就是我们想要的那种函数式的语义（semantics），不过却不是我们想要的语法（syntax）。很明显，Scheme并不是一种适合你拿来做交互式Shell的语言。`((没有 哪个 正常人) (喜欢) (((在 Shell 下) (敲 命令 的 时候)) (输) (一堆 括号)))`。不过更关键的是，在绝大部分情形下，前缀式这种表达形式与人类正常的思维习惯完全颠倒：

    对每一个这样的文件，删除它，
    这样的文件通过过滤
    使用“扩展名是否为.db”这个限制条件
    对当前目录下所有文件的列表执行而得到。

不管怎么说，Unix管道的中缀形式更加贴近人类对复杂问题的思考方式——在这一点上，它想来还是极好的。

模仿管道风格，我们可以设计一套与上述Scsh脚本等价的函数式Shell语法，不需要任何括号或者嵌套之类的：

    ls "-aR" "." |& name => name.extension == ".db" |. rm "-f"

很容易看出，所有函数的参数均使用currying的方式传递。唯一需要更多解释的就是`|&`和`|.`，这是两个中缀的“管道”运算符（当然，符号是人为选择的，也许不是最适合）。`|&`起到的作用相当于filter，左侧为一个List，右侧为一个返回值为Bool类型的lambda，用以过滤该List；`|.`起到的作用相当于map，左侧是一个List，右侧是一个lambda，用来对该List中的每一个值执行相应的操作（在这里因为是`rm`，我们不用关心这个map的具体返回值，只需要它产生的副作用）。这俩货的类型是这样的：（注意到与`filter`和`map`原定义的微妙差别）

    (|&) :: [a] -> (a -> Bool) -> [a]
    (|.) :: [a] -> (a -> b) -> [b]

因此，这种写法对应的思维方式就是：

    对于当前目录下的所有文件，使用“扩展名为.db”这个限制条件加以过滤；
    对结果中的每一项，执行删除操作。

俗话说得好，见人说人话，见AST说AST话。代码要这么写，才是人该说的话。假如一种编程语言禁止你说人话，只能说明他的lexer做得还不够屌。

觉得匿名函数的写法略繁琐？我们可以把它简化成：

    ls "-aR" "." |& _.extension == ".db" |. rm "-f"

不喜欢这种Scala式的面向对象写法？那也没关系，我们还可以把它改成ML/Haskell中常见的形式：

    ls "-aR" "." |& endswithExt ".db" |. rm "-f"

在不会引起混淆的情况下（参数字符串中不带空格），我们可以为这个新的Shell改写一下parser，允许省略引号的简写形式：

    ls -aR . |& endswithExt .db |. rm -f

现在，它看起来更像是你可以在命令行里直接执行的那种命令了。如果只想看看这些文件不想删除，那么可以直接忽略后面的map，用：

    ls -aR . |& endswithExt .db

对比一下，传统的Unix shell写法是这样：

    $ ls -aR | grep '\.db$'

不过它看不到完整的路径名。你也许得换个命令：

    $ find . -name '*.db' -print

要删除这些文件？别忘了把`-print`改成`-print0`，同时记得给`xargs`加上`-0`参数。

    $ find . -name '*.db' -print0 | xargs -0 rm -f

如果你是一个熟练的Unix用户，你也许觉得这种写法还不算太糟糕，因为你已经牢记住了这些安全规则。你会争辩说，`ls -aR . |& endswithExt .db |. rm -f`这样的写法，至少有两点很奇怪：一、它的管道看起来很麻烦，不像Unix只有一个管道符，它居然有两种（后面还将出现更多），学习掌握起来太困难；二、要操作当前目录，必须在`ls -aR`后面显式地写上`"."`参数，太麻烦，直接用`ls -aR`不行吗？

好，关于第一个问题，这很容易解释：`|&`和`|.`从概念上说本来就不是一回事，严格区分它们是很有必要的，因为它们的作用相当于Unix的管道，但其实又不是管道，而是函数式编程中的filter和map函数。相应的`endswithExt .db`和`rm -f`看起来像是Unix命令，但其实也不是命令，而是返回值是一个函数的lambda。这么一说，就很好理解了。

第二个问题，`ls -aR .`而非`ls -aR`，在任何一种具有严格类型的语言中都是必须的；因为这是一个currying的写法。前者将返回一个求得的List值，而后者将返回一个函数。`ls`和`rm`的类型可以分别被定义为：

    ls :: String -> String -> [String]
    rm :: String -> String -> IO Int

你要问，这样做有什么好处？很简单，当执行

    rm -rf /usr/lib/nvidia-current/xorg/xorg

时，解释器对它的理解是

    (rm "-rf") "/usr/lib/nvidia-current/xorg/xorg"

类型检查通过，于是删除操作被正确执行。

当你试图把它写成

    rm -rf /usr /lib/nvidia-current/xorg/xorg

时，解释器对它的理解是

    ((rm "-rf") "/usr") "/lib/nvidia-current/xorg/xorg"

类型检查不能通过，因为`((rm "-rf") "/usr")`的返回值是一个`IO Int`，给`IO Int`类型的值传递一个参数没有任何意义。所以，这段代码压根就不会被执行。多打一个空格导致误删文件的风险，在有严格类型系统的语言中就能够被有效地避免。

显然，类型检查并不能规避某些运行时存在的错误。比如，类型检查器不会知道你把

    rm -rf "/usr/lib/nvidia-current/xorg/xorg"

不小心误打成了

    rm -rf "/usr /lib/nvidia-current/xorg/xorg"

当然，在这种情况下，`rm`会去试图删除系统上的`/usr /lib/nvidia-current/xorg/xorg`这样一个文件夹，而不是删除`/usr`和`/lib/nvidia-current/xorg/xorg`这两个。所以，总的来说，你还是安全的。

现在，假如我们真的要让`rm`删除`/usr`和`/lib/nvidia-current/xorg/xorg`这两个目录呢？在这种情况下，我们只需要把`rm`的类型定义为

    rm :: String -> [String] -> IO Int

而需要执行的命令可以写成：

    rm -rf ["/usr", "/lib/nvidia-current/xorg/xorg"]

或者像这样：（对于不喜欢引号和匹配的人来说）

    rm -rf $ /usr : /lib/nvidia-current/xorg/xorg : []

无论哪种写法，最终都将被扩展成为

    (rm "-rf") ("/usr" : "/lib/nvidia-current/xorg/xorg" : [])

诶？前面的写法不加引号不会有问题吗？比如一不小心写成这样：

    rm -rf $ /usr : /lib/nvidia current/xorg/xorg : []

显然这行代码是不可能类型检查通过的。你知道为什么。

尽管如此，在设计的时候，我们会仍然让`rm`函数接收一个String而不是List作为参数。在后面会讲到原因。

顺便提一点，在我们的Typed Shell中，照样可以有String interpolation：

    rm -rf ${MY_APP_BUILD}/bin

但是，如果不去给环境变量`MY_APP_BUILD`赋初值，或者赋的不是一个字符串类型的值，那么这行代码就没法通过类型检查。比起Unix shell自动把不存在的量默认为空串，然后给你执行个

    rm -rf /bin

的坑爹设定，你觉得哪种更科学？



## 前人车轮的启发

在做任何事情之前，都需要审视一下重复造车轮的必要性：

* 目前存在的问题是：“正统”的Unix shell（Bourne sh、bash、ksh、csh、zsh）和一些作为辅助工具的微型语言（sed、AWK、dc、bc……）仍然可以用，而且直到今天都很有用，但是：一、它们完全遵从了Unix的传统哲学，基于管道的通信机制缺乏类型安全的保障；二、作为程序语言本身的设计来说，它们也太烂了，以至于除了系统脚本之外，正常人都不会想要拿它们去做一般性的编程任务，甚至是稍复杂些的脚本任务。这是一个必须面对的事实。

* 常见的流行脚本语言（Perl、Python、Ruby）并不能取代Unix shell的作用，故不在我们讨论的范围内。

* [fish](http://fishshell.com/)在友好程度上胜出了传统的Unix shell。但是，（afaik）它并不支持first-class function，也没有提供类型系统；看起来更多像是对传统Shell在语法层面上的改进。

* [es（extensible shell）](http://en.wikipedia.org/wiki/Es_\(Unix_shell\))大概是最早的实现函数式Shell的尝试；它的目标是要和Plan 9 [rc](http://en.wikipedia.org/wiki/Rc_shell)保持兼容（我不认为这是一个好主意）。话说回来，Plan 9的管道也并未实现typed object。

* 单纯作为Unix上的交互式shell来说，[Tcl](http://tcl.tk/)的编程能力应该是比较强的了，它支持first-class function的函数式编程。

* 如果不限定在“交互式shell”这个用途上，那么我们还有基于Scheme的[Scsh](http://www.scsh.net/)。

是的，我承认如今你要想找到一种函数式语言来取代Shell进行POSIX系统编程，像前面提到的那样去filter一个文件名的列表、map每个文件名到`rm`执行删除操作，这也许不难做到。但是，目前所有靠谱的编程语言的交互式界面都不是为了做Shell而设计的——它们或多或少缺乏一些作为现代Shell所必须的功能特性：job control，方便的命令行定制，环境相关补全，命令历史，高亮，这些都是从用户界面的角度来说不得不考虑的地方。这些东西，很明显，那些专注做Shell二十年的传统Unix Shell（bash、zsh）做得更好。所以说：我们有许多比Shell靠谱的编程语言，却没有哪个语言能直接拿过来取代Shell。

关于程序间通信方式的类型问题，这篇[关于Esther的paper](http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.80.7485)里提到了一些已有的方案：

* es和Tcl这样的脚本语言虽然提供了函数式编程的可能性，但却不存在类型检查一说，所以并不type-safe。

* 基于Scheme的Scsh和基于Haskell的Hugs解释器，可以对程序中的数据进行类型检查——但却做不到对Unix进程间传递的数据进行检查。

* Erlang是为了concurrency而设计的语言。鉴于它的动态特性，进程间用于通信的数据仍然不能保证其type-safe。按照该paper里的说法：_"A simple spelling error in a token used during communication between two processes is often not detected by Erlang's dynamic type system, sometimes causing deadlock."_

* 两种主要的纯函数式静类型语言的concurrency实现——Concurrent Haskell和Concurrent Clean，仍然无法确保不同进程间数据交换的类型安全性。

* 这篇paper还提到了两个用Java实现的操作系统原型。通过动态字节码编译和Java语言的静类型检查，它的shell可以保证多个Java进程（注意不是线程thread）间通信的类型安全。问题在于它的语言层面：因为它是Java；呃，我当然不是说Java提供的东西不够多，不过它是那种典型的“你要一只香蕉，结果却得到了一片森林里一个猴子拿着香蕉”的语言。要作领域特定语言，Java的表达能力实在太过有限；在这方面Groovy或Scala才是更好的选择。

* 然后，关于这篇paper的工作本身，Esther，一个基于Clean的shell，从本质上讲，是一个基于静类型的类型检查、同时提供了动态生成目标码能力的系统脚本语言；这倒不算什么新鲜事，只不过，它生成目标码的平台不是JVM，而是可以在Famke系统上执行的本地机器码。更重要的是，Famke系统进程间通信的数据是typed object，而不是Unix那样无类型的字节流。这是操作系统设计本身对类型安全提供的支持。

既然讲到了程序间通信数据皆typed objects的设计思想，先不管学术界的Oberon和Famke操作系统有多大的发展愿景，在现实中，我们有一个不得不提到的例子：

* [Windows PowerShell](http://en.wikipedia.org/wiki/Windows_PowerShell)是唯一一个得以广泛应用的、管道间传递的是带类型数据而不是任意字节流的系统shell。没错，尽管Windows的其他方面很糟糕，Windows PowerShell的这一点设计就是要比Unix shell更加科学。

虽然根本问题出在Unix本身的设计哲学（无类型管道方式）上，但是我并不打算在这里探讨操作系统的重设计。这是一个太大的课题，没有做出实际原型的设想也只能是毫无价值的空中楼阁。要知道：

* 自己从头开始写一个玩具操作系统的kernel，也许并不是一件难事；

* 做出一个超越已有kernel的设计，这需要对现有系统的优缺点有充分客观的了解；

* 把这个更好的设计实现出来，得有实实在在的功底，这不是随便找本讲OS开发的书照葫芦画瓢就能写出来的东西。而我肯定是没有这个能力；

* 比起kernel，一个系统的userland才是真正浩大的工程。这不是以一人之力可以完成的事情；

* 东西做出来了，谁会愿意来用？这不是单纯以“技术好坏”就能评判的事情。

为了验证“带类型的系统shell编程”这件事情实现上的可行性，再谈几点重要的启发：

* 由于Unix中进程间的通信是无类型的，故现有的GNU应用程序不能够直接被Shell利用，也就是说，我们需要在已有的Unix系统调用基础上再建立一套我们自己的userland API。这项工作概念上与跑在现有Unix内核上的[Plan 9 from User Space](http://swtch.com/plan9port/)和[Glendix](http://www.glendix.org/)有点像；当然，所有的数据管道都将采用typed object来通信，所围绕的核心就是这个统一的Typed Shell。

* Windows PowerShell__把所有的系统调用都集中到了一个统一的程序语言环境下__（cmdlets本质上不过是.NET中的类）；而Unix的用户态程序则各自为阵，并借助Unix的Shell松散地耦合在一起。正因如此（统一的.NET平台而非零散的用户态程序），Windows PowerShell为数据通信实现类型安全的typed object较为容易；而Unix系统则一直以来缺乏“进程间类型安全”一说。

* 从本质上说，Scsh就是一套Scheme语言的POSIX API库，__我们所要实现的，也正是这样的一个POSIX API库，只不过语法更自由些，更像是一个接近现有Unix shell的DSL而不是S表达式的堆砌。__我承认Scheme提供了强大的函数式和meta-programming能力；遗憾的是，前缀式和太多的嵌套同时也成为了限制它成为Shell语言的不利因素。ML/Haskell风格的函数currying方式显然更加键盘友好（keyboard-friendly），更贴近人类语法而不是机器的语法树。当然，撇开syntax层面的东西，类型系统才是我们倾向于ML/Haskell的真正原因。总之，我们需要的是一个：一、__函数式的__；二、能够__为管道间数据提供静态类型检查__的（为什么非得是静类型？理由很简单：把所有可怕的type safety issue扼杀在编译时；同时利于编译优化）；三、__语法友好__的仿Shell语言。光从后面两点，Scsh虽然已经可以从我们的参考列表中排除出去，但是它至少有一点值得注意：用Scsh写的程序同时也是合法的Scheme程序；它是现有R5RS标准的一个扩展，而不是生造出一个蹩脚的新Lisp方言或者其他什么脚本语言。这件事很重要。

* 基于Clean语言和Famke系统的Esther。用Esther写的脚本同时也是合法的Clean程序，而它执行时采取的是类似Java那样的动态编译方式。嗯，作为不明真相的群众，我们对Clean这种语言的编译机制不甚了解；不过，你可以把它类比成熟悉的Java平台：BeanShell通过一个interpreter来解释执行；而Scala可以动态编译为JVM bytecode。故后者可以直接互调Java的现有类，而前者却不能。Esther虽然从功能上说相当于一个操作系统的Shell，不过它的执行方式却是类似于Scala那样的动态编译。这使得它可以直接访问Famke的系统调用（Clean语言的API）。

为什么说这很重要，比起不明真相地去fork各种工具的进程然后把它们用管道粘在一起，让一个作为Shell的语言拥有控制整个系统API的能力不是更好么？这就好比在Unix上拿C来做“脚本语言”，每次用[TinyCC](http://bellard.org/tcc/)去编译执行，然后你就拥有了访问更底层的系统API的能力。我知道你不会这么去做；没人喜欢为了打印区区一个目录，删除几个文件就去写C，我们都更喜欢专门用来做这件事情的Shell。但这就是精神所在。

你可以争辩说，C和Shell两种语言之所以需要同时在Unix这样一个系统上存在，是因为它们所要解决的问题不同，完全不在一个级别上：

* C面向机器底层，用来做真枪实弹的系统编程；
* Shell面向用户界面，用来做执行简单任务的系统脚本编程。

然而，问题的根源在于，

* 无论是C或是Shell，对于东西的抽象级别都太低，语言表达能力太过有限。
    * 以至于C不可能代替Shell，Shell不可能代替C。
* C在设计层面上：
    * 太底层。高度依赖指针的写法最初是为了给程序员最大限度操控硬件的能力，但它的确是不利于程序抽象和软件正确性验证的一个大坑。
    * 指针不是错，而且我认为一种设计全面的语言应当为程序员提供直接访问内存的可能性。问题是C这种语言，让你无论做什么事情都要经过指针。解决与实际硬件密切相关的问题，这很顺手，没有更好的替代方案；但是要解决那些与硬件平台关系并不太大的问题，这就很恶心。
    * C不是为了并发而设计的语言。
* Shell在设计层面上:
    * 我已经不想说什么了。

首先，我们必须客观地认识到，在C和Shell的设计之初，程序语言中的许多概念和实践还不成熟，在当时，它们的设计的确算得上“足够好”；我们绝不能站在前人的肩膀上指责前人的高度不如自己高，这是一种对历史的无知。但是在今天，在意识到种种前人的设计失误带来的历史遗留问题之后，仍然抱着前人的腿不放，那也是不对滴；我们应该站在前人的肩膀上继续创造新的高度。

比起C、Shell这样的传统命令式语言，函数式语言众所周知能做得更好的地方：

* 程序正确性可验证；
* 静类型检查可保证大部分错误在编译时即发现；
* 对问题更高级别的抽象能力；
* 更加适合DSL；
* 对于并发的语言级别的支持；
* ……

容易让人误解的地方，和一些简单的澄清：

* High-level programming = Low performance?
    * 静类型函数式语言的编译器仍然可以做到硬件级别的优化，产生效率可以与C媲美的机器码。
        * 有些通过全程序优化直接生成本地码（MLton）；
        * 有些通过编译到C的中间码以实现优化（ATS）。
* 函数范式不适合系统编程？
    * 很多语言都提供了C的FFI。
    * 即使是纯函数式语言，也有与命令式编程同样好用的Monad。

现在，我们设想中的这个基于现有函数式语言的Shell实现，需要满足以下要求：

1. 提供一套该语言的POSIX API；（可参考[scsh](http://www.scsh.net/docu/html/man-Z-H-1.html#node_toc_start)）
2. 能够在编译时为管道间数据提供类型检查，这需要在静类型的语言中实现；
3. 用户友好，语法上尽可能仿照现有的Unix shell，尤其是在管道的使用方式上。



## 基于Idris的实现

好吧，静类型的语言那么多，为什么不是X/Y/Z……而偏偏选中了[Idris](http://en.wikipedia.org/wiki/Idris_\(programming_language\))？

选择一种语言来做这个实验性的新Shell，当然不是没有理由的：

### Standard ML / OCaml

总的说来，ML对于系统编程很适合：严格求值；如果需要的话，有靠谱的concurrency实现（通过Concurrent ML）；而且还有两本极好的参考教程[Unix System Programming
with Standard ML](http://only.mawhrin.net/~alexey/sysprogsml.pdf)和[Unix System Programming in OCaml](http://ocamlunix.forge.ocamlcore.org/)。然而，从语法角度看，它的语言标准里没有包含便利的List comprehension。对于理想中的shell来说，List comprehension是个非常好的语法糖：给出一个包含文件名称、大小和修改日期的列表形式，然后把当前路径下符合要求的文件以这个列表的形式给构造出来；没有它总觉得少了些什么。此外可能更重要的一点是，ML的多态机制（包括运算符重载）并不灵活，这使得要实现仿照Shell那样的管道符略困难。

### Scala

从语言上来讲Scala还不错，可是[编译速度过慢](http://stackoverflow.com/questions/3606591/why-does-intellij-idea-compile-scala-so-slowly)已经决定了它不适合做Shell。看看sbt启动和执行起来有多龟速就知道了。同时，为了一个交互式的shell你得时刻开着JVM，这造成了不必要的内存开销。当然还有，JVM语言并不适合用来做POSIX相关的编程。

### Haskell

Haskell是一个起点。它的绝大部分特性适用于我们对系统编程的需求，但不是全部。

优势：

* 纯函数式。避免引入意外的副作用的保证。
* Type class提供了灵活的多态机制，这有助于实现类似Unix shell的管道机制。
* 语法上：拥有List comprehension，而这正是我们的shell想要的特性。
* 实现上：编译成本地码，没有Scala这类基于虚拟机的语言的运行时overhead。

劣势：

* 惰性求值；
* 惰性求值；
* 等一下，上一句话什么时候被求值了？

虽说所有的求值方式从效果上说是等价的（根据[Church–Rosser定理](https://en.wikipedia.org/wiki/Church%E2%80%93Rosser_theorem)），但我们很多时候也许更希望知道在系统脚本执行的某一时刻，哪些操作被确实执行了。这是没有选择Haskell的直接原因。后面将会提到，在需要延迟求值的地方（例如Stream），我们仍然可以通过严格求值语言中的`lazy`来实现。

### Idris

>>> _The next ML will be pure. The next Haskell will be strict._  
>>> _- Simon Peyton Jones_

Idris是一个较新的__纯函数式__、__静类型__语言，发展时间尚短。虽然没有人提到过，不过我认为有充分的理由可以把它视作Simon Peyton Jones（Haskell主要设计者）口中的“下一个Haskell”：

* __严格求值__；通过`lazy`支持惰性求值。这解决了Haskell存在的最大问题：完全惰性求值导致的性能不可预测。

* 比Haskell的一般类型系统更强的[依赖类型系统](https://en.wikipedia.org/wiki/Dependent_type)（类Agda），并有相应的pattern matching支持。

* 提供了和Coq类似的交互式定理证明系统。

* 和绝大多数依赖类型语言一样，Idris是一种__强函数式语言__（完整函数式语言），虽然它允许你定义局部函数（partial function）；自带totality checker。

* 语法上，与继承ML的Dependent ML和ATS不同，Idris是一种__语法和Haskell非常接近__的语言。它同样具备了Monad，方便的do notation和monad comprehension。

* 与面向形式证明的Coq和Agda不同，Idris的设计目的从一开始就是__通用编程__；它提供了方便的面向C语言的FFI。

* 实现上更加重视性能。（通过[EpiVM](https://github.com/edwinb/EpiVM) compile到C的中间码）

* 标准库：没有太多可说的，因为它发展起来还没多久，标准库函数奇缺。不过它已经包含了一个Concurrency的实现。

* 一些关于Idris的paper提到了可验证系统编程和DSL。没错，它从最初设计时就考虑到了这方面的应用。



## 关于实现本身

提出想法是廉价的，形而上的论断谁都会下；然而一个想法好不好，只有确实做出来了才知道，也只有在做的过程中才能发现实际问题。我们现在就来写一个最简单的prototype，以验证前面的idea。

* 这里仅仅只是一个对Unix系统调用的wrapper，相当于Idris的一个POSIX API。其作用类似scsh之于Scheme。

* 语法上尽可能做到不与现有的Unix shell差异太大，尤其是管道这部分。

* 函数的执行不去直接fork进程，避开了同Unix的管道机制打交道。更关键的是，数据的type safe这件事情就可以交给语言自身的类型检查去做。

在这里，只是简单地探讨了用Idris取代Shell进行Unix系统编程的可能性。要真正成为一个可用的Shell，仍然缺少两个重要的组件有待完成（当然它们才是最有难度的实现部分）：

* 一个Idris的[动态编译](http://en.wikipedia.org/wiki/Dynamic_compilation)compiler。这有待参考Java和Clean/Esther的实现。

* 一个具备完善Shell功能的语言REPL。



***

（下篇：[Typed Shell：给Unix Shell加上类型系统（2）](/posts/159)）
