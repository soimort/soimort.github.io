---
layout: post
uri: /posts/160
permalink: /posts/160/index.html
title: 【译文】程序语言简史（伪）
category:
tag:
description:
disqus: false
lang: zh
---
<style>
article ul {
    font-size: 12.5px;
}
</style>

<script type="text/javascript" src="/js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="/js/jquery.console.js"></script>

<style type="text/css" media="screen">
    div.console { word-wrap: break-word; }
    div.console { font-size: 14px; color: #fff;}
    div.console div.jquery-console-inner
    { width:98%; height:100px; background:#333; padding:0.5em; overflow:auto }
    div.console div.jquery-console-prompt-box
    { color:#fff; font-family:monospace; }
    div.console div.jquery-console-focus span.jquery-console-cursor
    { background:#fefefe; color:#333; font-weight:bold }
    div.console div.jquery-console-message-error
    { color:#ef0505; font-family:sans-serif; font-weight:bold;
     padding:0.1em; }
    div.console div.jquery-console-message-value
    { color:#1ad027; font-family:monospace;
     padding:0.1em; }
    div.console div.jquery-console-message-type
    { color:#52666f; font-family:monospace;
     padding:0.1em; }
    div.console span.jquery-console-prompt-label { font-weight:bold; }
</style>

Original Article: [A Brief, Incomplete, and Mostly Wrong History of Programming Languages](http://james-iry.blogspot.co.at/2009/05/brief-incomplete-and-mostly-wrong.html) by [James Iry](http://twitter.com/jamesiry)  
(Chinese Translation by __Mort Yao__)

* 警告：原文中的内容不一定都是真实的。
* 警告：小字部分不属于原文，是翻译君为了便于读者读懂原文擅自所加的注解。当然，也不能保证一定都是真实的。
* 为了照顾那些幽默感退化的人们，维基百科有一个主题关于：[History of programming languages](http://en.wikipedia.org/wiki/History_of_programming_languages)。

![](http://i.imgur.com/8EZIsY6.gif)

***

**1801** - Joseph Marie Jacquard用打孔卡为一台织布机编写指令，在挂毯上织出了“hello, world”字样。当时的reddit网友对这项工作的反响并不热烈，因为它既缺少尾递归调用，又不支持并发，而且甚至都没有注意在拼写时恰当地区分大小写。

* Jacquard织布机是第一台可进行程序控制的织布机。用打孔卡进行编程的概念，直到电子计算机被发明出来之后仍然被广泛运用。
* 最早的[Hello World程序](https://en.wikipedia.org/wiki/Hello_world_program)（出自K&R C）打印的是全小写的字符串：`"hello, world"`。
* 在许多英文技术社区里，不正确地使用大小写发贴会被视作是小白的行为。（如把“Python”拼作“python”，把“FreeBSD”拼作“freebsd”，把“Qt”拼作“QT”）
* reddit / Hacker News的月经帖标题：“.\*: a new .\*-based .\* programming language”。底下常见的回帖形式：“它支持并发吗？”“没有尾调用优化果断差评。”“现在的编程语言已经足够多了，为什么我们还需要更多的语言？”……

***

**1842** - Ada Lovelace写了世界上第一个程序。她的努力只遇到了一点点小小的麻烦，那就是：实际上并没有任何计算机能够用来运行她的程序。后来的企业架构师们重新吸收了她的这个技能，用来学习如何更好地使用UML进行编程。

* Ada Lovelace为Charles Babbage的分析机写了一个计算伯努利数的算法实现，因此被后世公认为是世界上第一个程序员。实际上，分析机由于其设计思想过于先进，在当时根本没有被制造出来。（Babbage的分析机一般被认为是现代电子通用计算机的先驱）
* 讽刺现在的某些“软件架构师”顶多只会纸上谈兵地画画UML。

***

**1936** - Alan Turing发明了世间一切程序语言的最终形态，但很快他就被英国军情六处“请”去当007了，以至于他根本来不及为这些语言申请专利。

* 与通用图灵机（Universal Turing machine）等价的语言被称为图灵完备的（Turing completeness），它定义了“什么样的语言可以被称作是程序语言”。
* 二战期间Turing曾秘密地为英国军方工作，破解德军的Enigma密码机，并在战后被授予大英帝国勋章。但这项事实直到多年以后才向公众公开。

***

**1936** - Alonzo Church同时也发明了世间一切程序语言的最终形态，甚至做得更好。但他的λ演算被绝大部分人忽视了，因为它与C语言“不够像”。尽管存在着这样的批评，但事实上，C在当时还没有被发明出来。

* Church是Turing在Princeton的博士生导师，他在λ演算方面的工作先于Turing指出了不存在一个对可判定性问题的通用解法，这后来证明和Turing针对停机问题提出的图灵机模型是等价的。即著名的[Church-Turing论题](http://en.wikipedia.org/wiki/Church%E2%80%93Turing_thesis)。
* 说Church“甚至做得更好”，因为λ演算为后世所有的函数式语言提供了理论基础。
* 现在一种常见的关于函数式编程的批评就是：“它们与C语言不够像”。

***

**1940年代** - 一些直接采用布线和开关来进行程序控制的“计算机”出现了。工程师们当时这么做，据说是为了避开“用空格还是用制表符缩进”这样的论战。

* 据说当时负责设计ENIAC的工程师中间曾经发生过这样的争论：
    * 空格比制表符好。
    * 制表符比空格好。
    * 4个空格比8个空格好。
    * 什么？用2个空格的统统烧死。
* 关于这台具有里程碑意义的人类史上第一台电子计算机ENIAC上应该预装何种编辑器，工程师们还发生过这样的争吵：
    * Vim比Emacs好！
    * Emacs比Vim好！
    * 强烈推荐Sublime Text。
    * 你丫用编辑器的都是找虐，IDE才是王道。
    * 没错，要用就用世界上最好的公司微软开发出来的世界上最好的IDE：Visual Studio。
    * 我早就看透了无谓的编辑器论战什么的了，我要告诉楼上吵架的，你们全都是傻逼！
* 最后，工程师们一致决定使用布线和开关来为他们即将发明的计算机进行编程，机智地避开了所有这些无谓的争吵，最终齐心协力创造出了人类历史上第一台电子计算机：ENIAC。（鼓掌

<img src="http://i.imgur.com/D5ct44h.jpg" width="80%" />

* （图：两位ENIAC程序员在运用敏捷开发方法进行愉快的结对编程。“自从抛弃伴随我多年的Emacs和HHKB Pro、改用布线和开关进行编程之后，我的左手小指麻痹奇迹般地痊愈了。”其中一位接受采访时如是说。另一位则表示：“新的编程方式让曾经专注颈椎病20年的我得到了彻底的康复，不用再整天盯着显示屏，身心同时得到了极大的放松，值得大力推广！”）

***

**1957** - John Backus和IBM发明了FORTRAN语言。关于IBM或FORTRAN并没有什么特别好笑的地方。除了，写FORTRAN程序的时候不系蓝领带将被编译器视作是一个syntax error。

* 蓝领带、白衬衫、深色西装似乎是IBM公司20世纪经典的dress code。
* 早期FORTRAN（FORTRAN 77）对程序书写格式的要求那是相当严格。（例如，蛋疼的固定格式缩进）

***

**1958** - John McCarthy和Paul Graham发明了LISP。由于冷战期间的战略括号资源储备所造成的巨大成本，LISP从未流行过。尽管欠缺足够的流行度，LISP（现在叫做“Lisp”，有时叫“Arc”）仍然被视作一门有影响力的语言，在关键的算法思想诸如递归（recursion）和提升逼格（condescension）上尤为典范。

（原文的脚注：

1. 幸运的是对于计算机科学来说，花括号和尖括号的供应尚充足。

2. “关键的算法思想”这一说法来自于Verity Stob的[Catch as catch can](http://www.theregister.co.uk/2006/01/11/exception_handling/)。）

* 战略括号储备：据信是因为克格勃对于他们费尽千辛万苦搜集到的程序片段全都是括号感到极端愤怒，于是封锁了世界各地的括号矿产资源，导致白宫方面不得不加强战略浓缩括号的储备。（误
* LISP发明的那一年Paul Graham其实还没有出生。据说是因为某本叫做《Ha<del>ste and Waste</del>》的伪程装黑圣典实在太有名了，以至于许多编程小白们把写这本书的传奇人物同Lisp之间画上了等号。
* 提升逼格确实是一种与递归调用同样关键的算法思想。嗯，你懂的。

***

**1959** - 在输掉了和L. Ron Hubbard之间的一场打赌之后，Grace Hopper和其他几个抖S发明了所谓的“面向Boilerplate的全大写化语言（Capitalization Of Boilerplate Oriented Language，COBOL）”。多年以后，由于一些被误导的、性别歧视主义者对Adm. Hopper关于COBOL的工作的报复，在Ruby技术会议上不时会看到一些厌女主义乃至仇视女性的材料出现。

* L. Ron Hubbard是山达基教（Scientology）的创始人，二战期间曾与Grace Hopper同样供职于美国海军。（尚不清楚这两人之间有无其他联系）
* COBOL语言以代码极其冗长和通篇大写字母的书写风格而闻名。
* Adm. Hopper：Grace Murray Hopper女士的军衔是Rear Admiral Lower Half，即美国海军准将。
* Ruby技术会议与性别歧视：在09年的[GoGaRuCo](http://gogaruco.com/)会议上，有人做了一场题为[“CouchDB perform like a pr0n star”](http://www.thefword.org.uk/blog/2009/05/women_in_tech_t)的报告，幻灯片演示中使用了大量色情材料，引起了在场的少数女性观众的极大不适（“This was a national conference, not a gathering of teenager boys in a smelly upstairs bedroom!”）。会后，DHH（Ruby on Rails的作者）发推表示“it's "absolutely" appropriate to use porn in a business presentation”。关于其他更多技术会议上出现的性别歧视事件，参见[这里](http://geekfeminism.wikia.com/wiki/Timeline_of_incidents)。

***

**1964** - John Kemeny和Thomas Kurtz创造了BASIC，一个为非计算机科学家设计的非结构化的程序语言。

**1965** - Kemeny和Kurtz两人`goto`到了1964。

* 调侃BASIC语言对行号和`goto`的无节制滥用。

***

**1970** - Guy Steele和Gerald Sussman创造了Scheme。他们的工作导致了一系列以《Lambda之究极（Lambda the Ultimate）……》为标题开头的论文发表，并在《Lambda之究极厨房神器》这一篇中达到了最高潮。以这篇论文为基础，开始了一个长年累月的、收视率究极失败的晚间电视购物节目。Lambda们因为其概念相对难以理解而被大众所忽视，直到未来的某一天，Java语言终于让它们变得有名了起来。通过不包含它们这件事情。

* Lambda之究极神器系列：（Lambda之究极命令式编程、Lambda之究极宣告式编程、Lambda之究极GOTO语句、Lambda之究极Opcode）
    * Guy Lewis Steele, Jr. and Gerald Jay Sussman. ["Lambda: The Ultimate Imperative"]((http://repository.readscheme.org/ftp/papers/ai-lab-pubs/AIM-353.pdf)). MIT AI Lab. AI Lab Memo AIM-353. March 1976.
    * Guy Lewis Steele, Jr.. ["Lambda: The Ultimate Declarative"](http://repository.readscheme.org/ftp/papers/ai-lab-pubs/AIM-379.pdf). MIT AI Lab. AI Lab Memo AIM-379. November 1976.
    * Guy Lewis Steele, Jr.. ["Debunking the 'Expensive Procedure Call' Myth, or, Procedure Call Implementations Considered Harmful, or, Lambda: The Ultimate GOTO"](http://repository.readscheme.org/ftp/papers/ai-lab-pubs/AIM-443.pdf). MIT AI Lab. AI Lab Memo AIM-443. October 1977.
    * Guy Lewis Steele, Jr. and Gerald Jay Sussman. ["Design of LISP-based Processors, or SCHEME: A Dielectric LISP, or Finite Memories Considered Harmful, or LAMBDA: The Ultimate Opcode"](http://repository.readscheme.org/ftp/papers/ai-lab-pubs/AIM-514.pdf). MIT AI Lab. AI Lab Memo AIM-514. March 1979.
    * 后来大概有人觉得每次都投一篇正式的paper太麻烦了，于是干脆专门开了一个博客，名字就叫做[Lambda the Ultimate](http://lambda-the-ultimate.org/)。这样他们将来要发《Lambda之究极割草机》《Lambda之究极厕所皮拔子》这样的营销广告就更加方便了。
* 长年累月的收视率究极失败的晚间电视购物节目：也许是在暗讽MIT[专注用SICP作为教给CS学生的第一门编程课20余年](http://mitadmissions.org/blogs/entry/the_end_of_an_era_1)。
* 众Java程序员：听说[Java 8要开始支持lambda](http://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html)了，想来Java真是极先进的……等一下，我先看看lambda是个啥玩意？
    * 于是lambda这个“新鲜货”就一下子在主流业界变得流行起来了。

***

**1970** - Niklaus Wirth创造了Pascal，一个过程式的语言。很快就有人开始声讨Pascal，因为它使用了类似“`x := x + y`”这样的语法，而不是更为人熟知的类C语法“`x = x + y`”。尽管存在着这样的批评，而事实上当时C还没有被发明出来。

***

**1972** - Dennis Ritchie发明了一把射击时能同时向前和向后两个方向发射子弹的绝世好枪。但他对此发明造成的致死和终身残疾数量感到还不够满意，所以他又发明了C语言和Unix。

* 翻译君：……

***

**1972** - Alain Colmerauer设计了逻辑编程语言Prolog。他的目标是创造一个具有两岁小孩智商的程序语言。为了证明他成功达到了这个目标，他展示了一个Prolog程序，它对于每条查询都会机智地给出相同的回答：“No”。

<div id="test1"></div>

***

**1973** - Robin Milner创造了ML，一个建立在M&M类型理论基础上的语言。由ML衍生而来的SML加上了一套形式语义的规范。当被要求给这个形式语义本身书写一套形式语义时，Milner的脑子爆掉了。其他ML家族的著名语言还包括OCaml，F#，和，Visual Basic。

* SML的形式语义规范事实上被写成了这样一本书（SML'97）：[《The Definition Of Standard ML》](http://mitpress.mit.edu/books/definition-standard-ml)。
* ML明显是建立在H-M（Hindley–Milner）类型推断的基础上的，不太清楚原文所说的M&M类型理论是在吐槽神马……

![](http://i.imgur.com/7uxXKVy.jpg)

* Visual Basic近年来吸收了函数式编程里的不少东西（不知道是不是因为受到了F#影响的缘故）。最典型的是它具备和ML相似的[类型推断](https://en.wikipedia.org/wiki/Type_inference)。

***

**1980** - Alan Kay创造了Smalltalk并发明了“面向对象”这个词。当被问到它的含义时，他回答道：“Smalltalk程序本身就是对象。”当被问到对象是由什么组成时，他回答到：“对象。”当再一次被问到这个问题时，他说“看，它从里到外都是对象。直到你抽出一只乌龟。”

* Smalltalk的设计从很大程度上受到了[Logo](http://en.wikipedia.org/wiki/Logo_\(programming_language\))的影响。

***

**1983** - 为了纪念伟大的先辈程序员Ada Lovelace那能够写出永远也无法被执行的代码的彪悍技能，Jean Ichbiah和美国国防部创造了Ada语言。尽管缺乏证据显示有任何重要的Ada程序曾经被完成过，历史学家仍然确信Ada是个成功的公益项目，它让数以千计的国防承包商免于沦落为与黑帮为伍。

* Ada曾经是美国国防部指定的嵌入式计算机系统唯一开发语言，在其研发上耗资巨大。（国防承包商们于是不用靠贩卖军火给黑帮来维持生计了）
* 虽然[有充分的证据显示](http://en.wikipedia.org/wiki/Ariane_5#Notable_launches)Ada的整型范围溢出检查失败导致弄坏了欧空局的一枚Ariane 5运载火箭，不过美国国防部发言人对此表示：关我P事。

***

**1983** - Bjarne Stroustrup把他所听说过的一切都试图嫁接到C上，创造出了C++。最后得到的语言是如此地复杂，以至于程序必须被送到未来去让“天网”人工智能进行编译。编译时间难以容忍。天网开展这项服务的动机仍然不为人知，但来自未来的发言人说道：“没什么好担心的，宝贝。”带着一口奥地利腔的机械口音。有一些来自坊间的推测，所谓的天网只不过是个自命不凡的缓冲区溢出而已。

* 这篇文章写出来的时候，一个被称作C++0x的新标准还遥遥无期。许多编译器对它的支持似乎永远停留在“partial”阶段。
* 请自行脑补终结者里的T-800……
* 无论什么都改变不了C/C++是个经典的“缓冲区溢出语言”的事实。

***

**1986** - Brad Cox和Tom Love创造了Objective-C，宣称“该语言完美地结合了C的内存安全性与Smalltalk的神奇效率”。现在的历史学家怀疑这两人其实是诵读障碍症患者。

* <del>“C的内存安全性十分好”</del>。
* Smalltalk编译出来的程序以低效缓慢著称。

***

**1987** - Larry Wall在电脑前打了个盹，Larry Wall的脑门子压到了键盘上。醒来之后，Larry Wall深信 ，在Larry Wall的显示器上出现的神秘字符串并非是随机的，那是某种编程语言之程序样例的神谕。那必是上帝要他的先知，Larry Wall，去设计的。Perl语言就此诞生了。

***

**1990** - 一个由Simon Peyton-Jones、Paul Hudak、Philip Wadler、Ashton Kutcher和善待动物组织（PETA）组成的委员会创造了Haskell，一种纯函数式的、非严求值的语言。Haskell由于使用了Monad这种较费解的概念来控制副作用而遭到了一些批评意见。Wadler试图平息这些质疑，他解释说：“一个单子（Monad）说白了不过就是自函子范畴上的一个幺半群而已，这有什么难以理解的？”

* 素食主义鼓吹者：为了获取食物而不必要地杀死动物是邪恶的；“纯函数式编程”鼓吹者：为了编程而引入不必要的副作用是邪恶的。
* （科普帖）自函子说穿了就是把一个范畴映射到自身的函子，自函子范畴说穿了就是从小范畴映射到自身的函子所构成的以自函子为对象以自然变换为态射的范畴，幺半群说穿了就是只有单个对象的范畴，给定了一个幺半群则可构造出一个仅有单个对象的小范畴使其态射由幺半群的元素给出而合成由幺半群的运算给出，而单子说穿了就是自函子范畴上的这样一个幺半群。（这都不理解么亲连这种最基本的概念都不理解还学什么编程！）

![](http://i.imgur.com/KBze08L.gif)

* 又：“A monad is a monoid in the category of endofunctors（一个单子是自函子范畴上的一个幺半群）”这句话的原出处据信是Mac Lane的这本书：

![](http://i.imgur.com/SqBrqcP.jpg)

***

**1991** - 荷兰程序员Guido van Rossum为了一次神秘的手术而进行了一次阿根廷之旅。回来后他带着一个巨大的颅疤，发明了Python，而被数以军团计的追随者们加冕为“终生大独裁者”，并向全世界宣布“要办到一件事情，只可有唯一的一种方法！”。整个波兰陷入了恐慌。

* [BDFL（Benevolent Dictator for Life）](http://en.wikipedia.org/wiki/Benevolent_Dictator_for_Life)：开源社区一种流行的说法，“仁慈的”终生大独裁者。这个说法最早指的就是Guido van Rossum。
* 希特勒在提出建立“纯正的雅利安人国家”“统一的大德意志帝国”并实现了德奥合并之后，翌年便入侵了波兰，引发了第二次世界大战。“我一个人征服了整个欧洲！”<del>（感觉好棒好棒的）</del>

***

**1995** - 在家门口附近的一个意大利饭馆用餐时，Rasmus Lerdorf意识到他吃的那盘意面正好是一个用来理解WWW万维网的极好模型，而所有的Web应用都应该仿照它们的媒介那样去做。在他的餐巾的背后，他设计出了著名的“可编程超链接Pasta（Programmable Hyperlinked Pasta，PHP）”语言。PHP的文档至今仍然保留在那片餐巾上。

* PHP最显著的特点就是：代码是可以直接嵌在HTML文档中的。

***

**1995** - 松本“Mad Matz”行弘创造出了Ruby语言，用来辟谣一些意味不明的、有关澳洲将会变成一片由莫霍克族战士和Tina Turner统治的荒漠的末世预言。该语言后来被它的真正发明者David Heinemeier Hansson重新命名为Ruby on Rails。（_关于某个叫松本行弘的人发明了一种叫做Ruby的语言这件事情从未发生过，最好在这篇文章的下一个版本中删掉。_ - DHH表示）

* 最早关于Ruby的国际会议不是RubyConf，而是每年在澳大利亚举办的OSDConf。
* 这里应该是在吐槽Ruby的杀手级应用Ruby on Rails实在太有名了，以至于超越了原来的Ruby语言本身。
* Matz并没有为“Ruby”这个名字注册商标——本着开源的黑客精神。
* 而DHH（RoR的作者）却把“Ruby on Rails”这个（包含了“Ruby”字样的）名称注册成了商标，并且阻止别人未经授权使用“Rails”这个名字。
* （虽然抢注商标对开源来说未必是一件坏事情——Python基金会今年在欧洲还卷入了一场商标之争了不是）
* 假如你从来没听说过的话，莫霍克族战士据说是像这个样子的：

<img src="http://i.imgur.com/z2eAJuq.jpg" width="60%" />

* 而[Tina Turner](http://en.wikipedia.org/wiki/Tina_Turner)看起来是这个样子的：

<img src="http://i.imgur.com/KwZwVsk.jpg" width="80%" />

***

**1995** - Brendan Eich读完了历史上所有在程序语言设计中曾经出现过的错误，自己又发明了一些更多的错误，然后用它们创造出了LiveScript。之后，为了紧跟Java语言的时髦潮流，它被重新命名为JavaScript。再然后，为了追随一种皮肤病的时髦潮流，这语言又被命名为ECMAScript。

* WAT！<https://www.destroyallsoftware.com/talks/wat>
* JavaScript和Java语言没有任何实质上的联系；就像ECMAScript和Eczema（湿疹）没有任何实质上的联系一样。（Brendan Eich曾表示：“ECMAScript was always an unwanted trade name that sounds like a skin disease.”）
* 但很多人觉得其实JavaScript设计中包含的错误还不够多，本着为程序语言的设计贡献更多错误这样的目的，他们群策群力创造出了更多的、JavaScript中未曾成功涵盖的错误。这儿有一个[五花八门的列表](http://altjs.org/)，以供有志于为程序语言设计的谬误史添砖加瓦的人们参考。

***

**1996** - James Gosling发明了Java。Java是一个相对繁冗的、带垃圾收集的、基于类的、静态类型的、单分派的面向对象语言，拥有单实现继承和多接口继承。Sun不遗余力地宣传着Java的独一无二不同凡响之处。

***

**2001** - Anders Hejlsberg发明了C#。C#是一个相对繁冗的、带垃圾收集的、基于类的、静态类型的、单分派的面向对象语言，拥有单实现继承和多接口继承。微软不遗余力地宣传着C#的独一无二不同凡响之处。

***

**2003** - 一个叫Martin Odersky的醉汉看见了好时瑞森花生酱杯的广告，展示了某个人的花生酱倒入另一个人的巧克力的场景，他忽然有了个点子。他创造了Scala，一种结合了面向对象和函数式编程的语言。这同时激怒了两个阵营的忠实信徒，他们立刻宣布要发动圣战烧死异教徒。

<img src="http://i.imgur.com/npIHl7T.jpg" width="60%" />

***

_（原文请戳：<http://james-iry.blogspot.co.at/2009/05/brief-incomplete-and-mostly-wrong.html>）_

* 补充：原文的评论中有人尖锐地指出，开头提到的Jacquard可编程织布机不但支持并发（concurrency），而且是一个典型的多线程（multi-threaded）的例子。如你所见，它确实通过良好的同步机制避免了多个thread间产生竞争条件导致死锁，其实可以看作是现代操作系统最早的雏形。（目测此项科技树成果已突破天际）

<img src="http://i.imgur.com/TnjfxjT.jpg" width="60%" />





<script type="text/javascript">
    $(document).ready(function() {
        var console1 = $('<div class="console">');
        $('#test1').append(console1);
        
        var controller1 = console1.console({
            promptLabel: '?- ',
            commandValidate: function(line) {
                if (line == "") return false;
                else return true;
            },
            
            commandHandle: function(line) {
                return [
                    {
                        msg: "No",
                        className:"jquery-console-message-error"
                    }
                ]
            },
            
            autofocus: true,
            animateScroll: true,
            promptHistory: true,
            welcomeMessage: 'Ask me anything!'
        });
        
    });
</script>
