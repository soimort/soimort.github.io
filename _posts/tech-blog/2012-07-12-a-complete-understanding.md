---
layout: post
category: tech-blog
title: 【译文】不可能的全盘理解
description: 
disqus: true
---
Original Article: [A Complete Understanding is No Longer Possible](http://prog21.dadgum.com/129.html)
by [James Hague](http://prog21.dadgum.com/)  
(Chinese Translation by [Mort Yao](http://www.soimort.org/))

***

不妨假想一下，你刚买了一台MacBook Air，你的目标是要成为你的机器的主宰者，试图理解它在各个层次上是怎样运作的。

Amit Singh的[《深入Mac OS X：系统方法（Mac OS X Internals: A System Approach）》](http://www.amazon.com/Mac-OS-Internals-Systems-Approach/dp/0321278542)是一个很好的出发点。比起编程，它更多的是关于操作系统的所有组件如何结合在一起的深度探讨：固件的作用，启动时事件的发生序列，设备驱动程序是做什么的，等等。在1680页的厚度上，它并非一本轻松的消夏读物。

要想真正地理解硬件，Intel慷慨地为我们提供了免费的[七卷套文档](http://www.intel.com/content/www/us/en/processors/architectures-software-developer-manuals.html/)。为了尽量保持简单，我仅仅推荐其中的[《Intel 64和IA-32体系软件开发者手册第1卷：基础架构（Intel 64 and IA-32 Architectures Software Developer's Manual Volume 1: Basic Architecture）》](http://www.intel.com/content/www/us/en/architecture-and-technology/64-ia-32-architectures-software-developer-vol-1-manual.html)（550页）和描述了指令集的两卷（分别是684页和704页）。

Objective-C是OS X所使用的编程语言。谢天谢地，我们有Apple提供的简洁的[《Objective-C程序设计语言（The Objective-C Programming Language）》](http://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/ObjectiveC/ObjC.pdf)（137页）。

当然，Objective-C是C语言的一个超集，所以你同样应当过一遍第二版的[《C程序设计语言（The C Programming Language）》](http://www.amazon.com/C-Programming-Language-2nd-Ed/dp/0131103709)（274页）。

现在，我们将要开始接触OS X的核心API了。[《Cocoa基础指南（Cocoa Fundamentals Guide）》](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/CocoaFundamentals/CocoaFundamentals.pdf)有239页，[《应用程序套件框架（Application Kit Framework Reference）》](https://developer.apple.com/library/mac/documentation/Cocoa/Reference/ApplicationKit/ObjC_classic/AppKitObjC.pdf)则是只5069页的巨兽。它的用处在于对每个API调用都提供了详尽的档案式的说明。适可而止地，关于Cocoa文档的部分我将就此打住，虽然关于绘图、Core Audio、Core Animation和其他一打东西还有更多有用的书籍。

哦，等等，OpenGL并没有包含在Cocoa里面，所以784页的[《OpenGL参考手册（OpenGL Reference Manual）》](http://www.amazon.com/OpenGL-Reference-Manual-Official-Document/dp/032117383X)在等着你。然后是另外800页的[《OpenGL着色语言（OpenGL Shading Language）》](http://www.amazon.com/OpenGL-Shading-Language-Randi-Rost/dp/0321637631)。

以上的全部一共是10921页——只差79页就到11万页了。我已经忽略了那些数以百计的系统组件的man帮助页和Xcode文档。而且，我还没有涉及到那些让你能够用OpenGL做出一些有趣玩意的图形学技巧，以及怎样写出好的C和Objective-C代码或者其他任何与面向对象设计相关的东西，还有……

