---
layout: post
uri: /posts/123
permalink: /posts/123/index.html
title: Chromium保存网页的.html文件神秘消失问题
category:
tag:
description:
disqus: false
lang: zh
---

<script>lock()</script>

曾几何时，我的Chromium浏览器（包括Google Chrome在内）出现了某些网页不能正确保存的问题。

准确地说：网页下载完成之后，[chrome://downloads](chrome://downloads)中显示的状态会马上变成“Removed”，`_files`文件夹在，但是硬盘上相同的位置却找不到与之对应的`.html`文件。

这个issue的奇妙之处，就在于它难以可预测地重现出来。有时候一个网页第一次不能正确保存，多试上几次就好了。在观察之前，你永远也不知道这个html文件保存成功了与否。。。（看起来就和薛定谔的喵星人实验一样）

这issue似乎也没法traceback，因为毕竟不是segfault这类硬性bug。很长一段时间里我都不知道是不是只有我一个人遇到了这问题。

最近终于找到了这个issue，居然在2010年Chrome还是4.0版的时候就有人报过了：

<http://code.google.com/p/chromium/issues/detail?id=32771>

Chromium的开发人员表示，导致这个bug在长达几年的时间内都没有得到解决的原因是这一块的代码过于复杂和混乱，他们准备在未来几个月内重构这部分代码，希望能够在今年年底内得到解决。。。

然后是我目前的修补方案（当然不是Chromium的patch，我自己连编译一次都没成功过= =）：

在Linux下，实际上大部分情况下这个html是保存下来了的，不过是以临时文件`.org.chromium.*`的形式，只是Chromium不知为何没有正确地创建最终的`.html`文件。（Windows的情况暂时还不清楚）

进保存网页的目录下，Shell一行流：

<script src="https://gist.github.com/3961302.js?file=fix_unsaved_html.sh"></script>

或者写成bash函数（放进`~/.zshrc`或者`~/.bashrc`）：

<pre><code id="bash">function fix_unsaved_html {
    i=
    for i in .org.chromium.*; do
        echo -ne "$i : "
        f=`grep -o '"./[^"]*_files/' $i | uniq 2>/dev/null`
        if [ -n "$f" ]; then
            j=${f:3:-7}.html
            mv -f $i $j
            echo "moved to \"$j\""
        else
            rm -f $i
            echo "removed"
        fi
    done 2>/dev/null
}
</code></pre>

每次用Chromium保存完网页后，记得找回丢失的`.html`们：

<pre><code id="bash">$ cd ~/Downloads/
$ fix_unsaved_html
</code></pre>

最后，希望这个几乎与Chromium历史一样悠久的bug如开发者所说，在今年年内能够得到解决。(`・ω・´)



<script>hljs.initHighlightingOnLoad();</script>
