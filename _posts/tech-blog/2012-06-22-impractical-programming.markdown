---
layout: post
category: tech-blog
title: 【翻译】对非实用编程的赞美
description: 本文采用 Creative Commons Attribution-NonCommercial 3.0 United States 授权。
disqus: true
---
Original Article: [In Praise of Impractical Programming](http://www.niemanlab.org/2011/11/in-praise-of-impractical-programming/)
by [Jacob Harris](http://www.niemanlab.org/author/jharris/)  
(Chinese Translation by [Mort Yao](http://www.soimort.org/))

如今对于非专业的程序员来说，书写代码和创造出实用的东西变得愈加容易了，这是一件好事。但这并非意味着那些古怪、异想天开却优雅的非实用手段应该被我们所遗忘。
***

尽管如今已成为某种文化的柱石，我仍然会记得我第一次看见那本厚书时的情形——一本封面上画着一个巫师的书——有关一所魔法学校，在那里奇迹总能由知道正确咒语的人变戏法般地创造出来。没错，我要说的这本书就是[《计算机程序的构造和解释（Structure and Interpretation of Computer Programs）》](http://mitpress.mit.edu/sicp/)。有[另外一本书也提到了咒语](http://en.wikipedia.org/wiki/Harry_Potter)，但[“巫师书”](http://catb.org/jargon/html/W/Wizard-Book.html)是一本确确实实教授魔法的书。

![SICP](http://www.niemanlab.org/images/wizard-book-programming.jpg)

在过去的若干年里，我一直在一个新闻部门的编辑部里从事软件开发工作，在那里，对于我这类程序员的看法已经逐渐由[“新奇的奢侈品”](http://nymag.com/news/features/all-new/53344/)改观为[“不可或缺的必需品”](http://www.newsnerdjobs.com/)。认识到这一点之后，一些新闻学院现在已经开设了程序设计课程，教会学生诸如数据库和Web框架之类的实用技能。看着这一代网络黑客式的新闻记者让人不禁感到心里发毛——然而，我希望我们还能够从这些课程中挤出一些空间，留给一点小小的魔法。

学会编程是一项重要的技能；学会怎样_成为_一名程序员则需要另一种迥异的训练。因此，我要感谢一个真正的非实用的入门级导引——我的第一门编程课，[MIT的6.001](http://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-001-structure-and-interpretation-of-computer-programs-spring-2005/)，它将一种非常不实用的语言[Scheme](http://groups.csail.mit.edu/mac/projects/scheme/)用来作为教学语言。

Scheme是[Lisp](http://en.wikipedia.org/wiki/Lisp_(programming_language\))（LISt Processing，表处理）、这门老当益壮并被设计用于人工智能理论工作语言的一个学术风格方言。在初学者的眼中，Lisp看起来像是一些里外颠倒的句子、被嵌置在数量多到足以令人发疯的括号当中。但最终，你会把它视作天使的语言，因为它并非被狭隘地设计用于某一个专门领域的用途如矩阵处理或实现操作系统的。Lisp设计的初衷是用来表示符号（并且涵盖了[其他语言中缺少的一些重要特征](http://www.paulgraham.com/diff.html)），这意味着它能够用于表达一切事物。因为Scheme的核心符号集是出了名的匮乏，学生常常需要白手起家、从简单的结构一步步构筑起更加高级的结构，因而能够从中提高自身。

在整个学期的开始，学会怎样理解和使用过程（procedures）已经充分；而在结束时，我们已能够随意地处理无限的数据流、模拟计算机芯片的工作流程。极富挑战性的一课出现在学年的中期，我们完成了一项看似悖论式的练习任务：用Scheme实现一个Scheme自身的解释器。适可而止地，这个[自循环解释器](http://mitpress.mit.edu/sicp/full-text/book/book-Z-H-26.html#%_sec_4.1)的相关介绍并未占用过多课时，它只是作为MIT Scheme的一个傻瓜式启发入门存在，通过化装、闪罐的烟火和最后每个人得到的一个[印有“Scheme”标志的纽扣](http://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-945-adventures-in-advanced-symbolic-programming-spring-2009/6-945s09.jpg)来纪念我们的成就。到了学期末，我已经完全着迷于这门课了。

但是，在实际的编程工作中，我的技能并没有任何增长；关键问题在于，我所学的那些东西仅仅属于理论范畴。这也是为什么非实用的入门编程课在绝大多数大学里如此滞销的原因。如果学生只修习一门程序设计课程，教授希望他们在结束时能够做出一些实在的东西。即便是MIT自己，也在2009年[放弃了这种神秘主义符号式的Lambda演算传道](http://mitadmissions.org/blogs/entry/the_end_of_an_era_1)，取而代之的是一门简化的、基于Python和机器人学的编程导论课，旨在为那些将来可能并非专攻计算机科学的学生们而准备。这种做法所基于的理由是，编程本身的形式自从上个世纪80年代以来有所改变；开发者已经不再需要自己从零开始构建整个系统；[如今他们只需借助现有的各种库就能够轻松实现某种任务](http://www.wisdomandwonder.com/link/2110/why-mit-switched-from-scheme-to-python)。对于如今大部分的编程工作来说，这是真的——但我总不禁沮丧地回想起（莎士比亚的戏剧《暴风雨》里）[普洛斯彼罗是如何放弃他的魔法的](http://shakespeare.mit.edu/tempest/tempest.5.1.html)。

至今，我仍然感受到6.001（以及MIT其他那些优美但不甚实用的CS课程）让我成为了一个更好的程序员。它那非实用的方式迫使我去理解计算机科学的广阔世界，而非仅仅着眼于一个狭窄的应用领域，例如构建一个网站或者学会SQL。这可能是个不太具有说服力的论点，但至少[我有很多好的辩论伙伴](http://lispers.org/)；照常，[Paul Graham对于此观点的表达比我更好](http://www.paulgraham.com/avg.html)。我也许已经有好几年没写过Scheme程序了——实际上，我用的是和你一样的实用编程工具。但我并不只是把它们当成锤子那样来使用：我知道它们的形式是怎样演变来的，以及怎样改造它们以适应新的问题。我认为这正是“非实用编程”所教给我的东西。

![Seven Languages in Seven Weeks](http://www.niemanlab.org/images/seven-languages-seven-weeks.jpg)

我并不坚持主张新闻学院应该把珍贵而难得的计算机科学学分花费在异想天开的编程入门上。但如果你想要在作为程序员的方面获得进步，你需要去尝试走一些非实用的弯路。如果你不知道如何编程，选择一门实用的语言是有益的；如今像[Python](http://greenteapress.com/thinkpython/thinkpython.html)、[Ruby](http://pine.fm/LearnToProgram/)和[JavaScript](http://eloquentjavascript.net/)这些语言都有很好的教程。但在此之后，不妨尝试学习一门与你用来工作的语言完全不同的程序语言。[Clojure](http://clojure.org/)是一门相当酷的现代LISP方言。你甚至可以同时对好几种语言进行一次走马观花式的[壮游](http://pragprog.com/book/btlang/seven-languages-in-seven-weeks)。从另一方面来说，你最终应当学习C，并且通过阅读源码了解你最喜爱的语言是怎样实现的。阅读那些你喜欢的、你讨厌的库及工具的源代码。做一些系谱学的调研——了解你所喜爱的程序语言是从其他哪些语言演化而来的（例如，Ruby借鉴了Smalltalk、Eiffel、Lisp、Perl，以及[CLU](http://en.wikipedia.org/wiki/CLU_(programming_language\))的一项至关重要的特性）。学习怎样写一个解析器。学习算法。学习操作系统是怎样运作的。开始一些任意的项目；为一些任意的项目[创建自己的分支](http://github.com/)。总是保持在写代码的状态。忽略我的建议并提出你自己的观点。然后做出突破。

最关键的是要在你几乎一无所知的领域里大胆探索，不带任何功利的目的。成为一个非实用主义者。投下你的咒语吧。

