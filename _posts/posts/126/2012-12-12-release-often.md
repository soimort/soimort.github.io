---
layout: post
uri: /posts/126
permalink: /posts/126/index.html
title: 为什么我们应该频繁发布新版本（以及怎样发布）
category:
tag:
description:
disqus: false
lang: zh
---

<script>lock()</script>

敏捷开发中有句常讲的话，叫做[“Release early, release often（及早发布，频繁发布）”](http://en.wikipedia.org/wiki/Release_early,_release_often)。

什么叫发布呢？简单地讲，就是把东西打包出一个新的版本，让最终用户可以直接拿过来用（无论是通过包管理器升级、下载预构建包手动安装还是下载源码自己去`make install`）。

我个人理念中的频繁发布应该是，每增加几个小的功能或者修复一个issue，都分配一个新的[语义版本号](http://semver.org/)。当然，对于WebKit这种持续集成的庞大代码库来说，因为每个Nightly build都会有一个SVN全局版本号，这种情况暂时不在考虑范围之内。

基于语义版本的频繁发布有什么好处，我就不从哲学的角度分析了。来说一下最近遇到的一个问题：

__0)__ 系统环境：Arch Linux + Python 3.3.0

__1)__ 用pip安装docutils（用来渲染[reStructuredText (reST)](http://en.wikipedia.org/wiki/ReStructuredText)格式文本的Python库。reST是一种类似Markdown的文本标记语言，用在[PyPI](http://pypi.python.org/pypi)上）到系统位置：

    $ sudo pip-3.3 install docutils

__2)__ [GitHub Markup](https://github.com/github/markup)可以调用docutils来渲染reST文件。执行其测试：

    $ git clone git://github.com/github/markup.git github-markup
    $ cd github-markup/
    $ rake

结果测试在reST这一步失败。

__3)__ GitHub Markup通过一个python的wrapper来调用docutils，试图直接用Python 3.3执行这个python脚本，出错：

    $ python3.3 lib/github/commands/rest2html </dev/null
    ...
    ImportError: No module named standalone

__4)__ 但是，换成Python 2就完全没有问题：

    $ sudo pip-2.7 install docutils
    $ python2 lib/github/commands/rest2html </dev/null
    <div class="document">
    </div>

很明显，这是docutils不兼容Python 3.3导致的后果。

根据Python的traceback信息，问题出在`/usr/lib/python3.3/site-packages/docutils-0.9.1-py3.3.egg/docutils/readers/__init__.py`的109行：

    module = __import__(reader_name, globals(), locals())

Python解释器抱怨说它找不到standalone这个module。但是standalone.py这个文件又是确实存在的：

`/usr/lib/python3.3/site-packages/docutils-0.9.1-py3.3.egg/docutils/readers/standalone.py`

仔细研究一下[Python 3.3的变化](http://docs.python.org/3/whatsnew/3.3.html#using-importlib-as-the-implementation-of-import)就知道，原先的`__import__()`函数现在由`importlib.__import__()`实现，__破坏了原有代码的后向兼容性__，必须在调用时显式指定`level=1`参数：

    module = __import__(reader_name, globals(), locals(), level=1)

__5)__ 虽然官方的docutils 0.9.1包不兼容Python 3.3，不过这个问题看起来已经在Arch Linux的包上很好地解决了。参见Arch的patch：

<https://projects.archlinux.org/svntogit/community.git/tree/trunk/01-python33-relative-import.patch?h=packages/docutils>

对于Arch来说，这个patch是必需的，因为Arch的Python早就升级到了 3.3版本。不解决这个bug，现有的docutils就根本没法用。

__6)__ 所以，在Python 3.3上要使用docutils，解决的方法就是不要用easy_install/pip去安装上游的docutils 0.9.1，而是用pacman安装打过补丁的python-docutils 0.9.1包。（所以说用Arch偶尔也是有点额外好处的嘛）

__7)__ 装过Arch的包之后，问题照旧。

原因是：使用easy_install/pip安装的[Python Eggs](http://mrtopf.de/blog/en/a-small-introduction-to-python-eggs/)优先级要高于使用pacman安装的库。也就是说，如果有一个用pacman安装的python库：

`/usr/lib/python3.3/site-packages/docutils`

同时在系统上又用easy_install或者pip安装了同样是这个包的Python Egg：

`/usr/lib/python3.3/site-packages/docutils-0.9.1-py3.3.egg/docutils`

那么Python优先使用的是这个蛋，而不是pacman给你在标准位置安装的包。卸载掉pip安装的蛋即可。

    $ sudo pip-3.3 uninstall docutils

__8)__ 现在就要说到问题的关键了。

Python 3.3是今年九月发布的，但是官方的docutils 0.9.1对Python 3.3并不兼容。既然Arch都解决了这个问题，为什么上游的docutils至今还没解决呢？

实际上，这issue早在七月份、Python 3.3正式发布之前就已经有人报到docutils的bug tracker上，而且仅仅三天后就被一个patch修复了：

<http://sourceforge.net/tracker/?func=detail&aid=3541369&group_id=38414&atid=422030>

到目前为止，docutils最新的版本还是6月份发布的0.9.1。现在你大概知道问题出在哪了。这个bug实际上早就在svn库中被修复了，但是他们至今还没有在Cheeseshop（以及SourceForge上）发布出新的版本！如果你已经升级到了Python 3.3，你是没法直接把“最新发布”版的docutils 0.9.1拿来用的，你仍然需要一个来自下游（比如发行版，诸如Arch Linux）的补丁，或者干脆直接使用svn上的开发版。

这不是一种解决问题的优雅方式。



## 我们应该频繁地发布版本——为什么不呢？

* 现在已经不是通过CD甚至3.5英寸软盘这种物理介质才能发布一个新版软件的年代了。你所需要的只是构建，然后上传到服务器。这一切几乎是零成本。
    * 如果你用PyPI或者RubyGems来托管你的Python/Ruby项目的话，发布一个新版本甚至可以只是一条命令那么简单。

* 现在也不再是Unix hackers们热衷于用`diff`/`patch`来解决一切问题的年代了。用户很少愿意去碰源代码，尤其当这些代码属于他们不太关心的底层库时。没有哪个用户喜欢在写他们的程序时，发现依赖的底层库有一堆兼容性的bug；这些底层库虽然在svn或git中已经修复了bug，却没有及时地发布出新版本。结果用户只能给这些依赖自行打上patch重新构建，甚至直接使用开发版本。
    * 就算你通过给依赖库打上自己的补丁的方式解决了问题，依赖关系又该怎么写？
    * 你会想到把这些修补过的依赖库源码也放进自己的代码库里。问题是，你也许根本就没有必要去维护它们，等到依赖库的下一个版本发布时，这个bug就很可能已经被修复了。
    * 就编译型语言来说，你完全可以给依赖库打上补丁之后把构建出的链接库放到另外一个地方，假装它们是你的软件包的一部分，所以这问题对于传统的C/C++程序员来说并不严重；
    * 但是，在Python、Ruby这类语言的生态环境下面，你却很难这么去做。这种“不干净”的做法本身也破坏了这些语言社区鼓励代码重用的原则。



## 这也是为什么我们应该使用某种语言的“事实标准”包管理器的原因

稍微离题说一下，许多现代的编程语言都存在着自己事实标准（de facto）上的包管理机制。大部分时候，一条命令就可以完成从构建、测试到新版本的安装、发布等一系列任务，很少或者根本不需要你去手写繁琐的`Makefile`或者`configure.ac`，或者其他元构建系统的配置文件。

* Python做这件事情的东西以前是setuptools，现在叫做[Distribute](http://packages.python.org/distribute/)（setuptools的fork），针对特定版本的Python环境打出来的软件包叫做一个Python蛋（类似于Java下面的jar）， 然后提供给最终用户安装蛋的工具是EasyInstall或者Pip（用以取代EasyInstall）。
* Ruby的包管理机制比Python要更加统一，这个东西叫做gem，几乎没有哪个Ruby程序员会不去用它（不用setuptools/distribute的Python程序员倒是大有人在……）。
* Perl 6现在的包管理器叫panda。
* Haskell有cabal。
* Node.js有npm。
* Dart有pub。
* Go语言……这个自然就不必多说了吧。`go`命令实在是太强大了，连包管理都能顺便解决。

如果用了这些语言特定的包管理器来管理项目的话，你会发现发布新版本并不是一件麻烦事。不过这么做的好处可远不止是为频繁发布版本提供便利而已。

对于任何一个开源社区来说，高效的协作是必不可少的。这要求以下两点：

1. 鼓励代码重用，以库的形式。
    * 开发自己的库，让它做好一件事情。明确每部分功能的API接口，让它可以被别的库依赖；
    * 打包好自己的库，而且仅仅只打包自己的库，让它去依赖别的库；
    * 不要随意地把依赖库的源码包含到自己的代码当中，尤其当维护者并不理解它的大部分内容时；
2. 依赖关系明确，包括名称和版本号。

早在现代的包管理机制出现之前的年代，GNU / Savannah、CPAN、CTAN这样的社区就已经为做好第一点付出了巨大的努力，而如今众多现代编程语言的标准包管理器更加鼓励了代码重用。今天，如果你写了一个库，并且想把它开源出去让每个人都能从中获益，你__没有任何理由__不去使用这些包管理机制提供的标准手段！

第二点，是为了解决API兼容问题带来的依赖性地狱，所以，我想说的是：



## 我们应该让版本号有实质的意义，而不只是好玩

[语义版本规则（Semantic Versioning）](http://semver.org/)的提出，正是为了解决这样一个问题：

_In the world of software management there exists a dread place called "dependency hell." The bigger your system grows and the more packages you integrate into your software, the more likely you are to find yourself, one day, in this pit of despair._

_In systems with many dependencies, releasing new package versions can quickly become a nightmare. If the dependency specifications are too tight, you are in danger of version lock (the inability to upgrade a package without having to release new versions of every dependent package). If dependencies are specified too loosely, you will inevitably be bitten by version promiscuity (assuming compatibility with more future versions than is reasonable). Dependency hell is where you are when version lock and/or version promiscuity prevent you from easily and safely moving your project forward._

大概不是所有人都能习惯这套版本命名规则（Ruby程序员除外）。但是，你仍然应该让自己的版本号具有实质的含义，命名上具有一致性，至少能恰当地反映出API的变化。而不只是为了好玩或者追求形式。

这么做是为了给用户提供便利，让他们知道什么时候API的兼容性可能会被破坏，什么时候命令行选项（和相应的CLI wrapper）的兼容性又可能会被破坏。如是，当他们依赖于你的库时，他们看到版本号就能够想到及时去更新自己的依赖关系，升级代码。这也是版本号本来应该起到的作用。

我能理解很多人喜欢不受拘束，发明自己的东西，游离于体制和规则之外；甚至越是伟大的程序员就越是倾向于这么做。也许你更喜欢拿3.14159这样的数字来做版本号。这意味着你是一个了不起的Geek。但是，从长远看来，我不认为这样的版本号命名对整个社区的协作有什么好处——当然，我承认这很有趣。

对于最终产品或者纯内部项目来说，版本号可能没那么重要，毕竟，在开发团队的圈子之外，没有人会太care某个库的API接口是什么，前后兼容性如何，因为大部分人只会去关心interface。但是，如果你正在或者将要去维护一个开源的项目——请严肃地对待版本号这件事情。

我是说认真的。
