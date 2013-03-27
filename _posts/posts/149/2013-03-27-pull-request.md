---
layout: post
uri: /posts/149
permalink: /posts/149/index.html
title: Pull Request的正确打开方式（如何在GitHub上贡献开源项目）
category:
tag:
description:
disqus: true
lang: zh
---

GitHub的官方帮助如下：

* __Fork A Repo__: <https://help.github.com/articles/fork-a-repo>
* __Using Pull Requests__: <https://help.github.com/articles/using-pull-requests>
* __Merging a pull request__: <https://help.github.com/articles/merging-a-pull-request>
* __Closing a pull request__: <https://help.github.com/articles/closing-a-pull-request>
* __Tidying up Pull Requests__: <https://help.github.com/articles/tidying-up-pull-requests>

发现这个官方文档写得比较简单，并没有提到开源项目协作方式的一些必要的trick（比如建立topic branch），还有Pull Request的运作细节也没有提到。写个简单的总结补充一下。



## Step 1: Fork原项目

这个不解释了，单击一下鼠标就能做到的事情。参见GitHub帮助的[原文](https://help.github.com/articles/fork-a-repo)。

记得用`git remote add`添加上游远程库的地址，否则无法追踪上游库的更新。



## Step 2: 创建你的主题（topic）branch

这一步__非常重要__。GitHub的帮助里没有提到创建主题branch的必要性，你当然可以直接在原项目的默认branch（如master）上进行工作，但实际上：

__如果打算为原项目作贡献，强烈建议你为每个主题创建一个单独的branch。__

举例：如果需要修复原项目的一个和Unicode相关的issue：

    $ git branch fix-unicode-error
    $ git checkout fix-unicode-error

然后在自己的主题branch（这里是fix-unicode-error）下进行工作。



## Step 3: 在主题branch下完成需要的工作

记得push相应的主题branch到GitHub。



## *（针对贡献者）`rebase`还是`merge`？

从实用的角度来讲，

* 当你在主题branch下工作，想要导入来自上游库的（与你当前的工作不冲突的情况下）更新时，使用`git rebase`。

例如，（假设上游branch为upstream/master）

    $ git rebase upstream/master fix-unicode-error

或者直接（如果当前branch已经是fix-unicode-error）：

    $ git rebase upstream/master

这将把当前branch的开发“base（基础）”推进到一个新的起点，而不会引入多余的commits。

* 当你在某个branch下工作时，`git merge`可以用来合并来自其他branch的更新。

如果merge的branch来自远程库，一次merge操作会增加一个额外的commit（“Merge branch 'master' of something”）。如果在一个需要发送Pull Request的主题branch下面进行这种操作，（我个人觉得）这不是一种干净的手段。

当你在主线branch（例如master）下进行开发时，`git merge`可以用来吸收其他开发branch引入的新特性（包括主项目维护者用来直接merge Pull Requests），很恰当。



## Step 4: 发送第一个Pull Request

GitHub的界面：左边选择base branch，右边选择head branch。

* __base branch__：相当于target branch，你希望Pull Request被merge到上游项目的哪个branch里。
    * 为什么要叫__base__ branch：base可以理解为你在进行`git rebase`操作时的那个“base”，也就是你的主题branch所基于的开发base（基础）。

* __head branch__：相当于source branch，你希望自己开发库里的哪个branch被用来进行Pull Request（当然也就是你的主题branch）。
    * 为什么要叫__head__ branch：参见下面关于head的定义。

注意head与HEAD（大写）的区别：

* __head__：简单地理解，就是指向某个commit对象的一个reference。它可以是一个branch的名称（例如，默认的master），也可以是一个tag的名称。一个库可以同时有任意多个head。

* __HEAD__：__当前活动的__head。在任意时刻，存在且仅存在一个HEAD。它可以是指向当前branch的head（比如，指向master，假如master是当前branch的话）；也可以不指向任何特定的branch（这叫做detached HEAD）。

系统会从你选择的head branch（在这里，是主题branch）的这个head开始匹配所有不包含在base branch中的commits，然后自动视作你的主题branch相对于base所增加的新特性，放进同一个Pull Request中提交。



## Step 5: Pull Request发送之后……

一旦你从自己的主题branch（例如fix-unicode-error）推送了一条Pull Request，那么在这条Pull Request被关闭之前，再次向这个branch里push代码，所有的commits都会被自动追加到这个Pull Request后面（不需要再另开Pull Request）。

这个功能尤其有用，比如你最初提交的Pull Request里存在某些问题，项目维护者要求你打回去修改；或者要求你给你的新feature添加一条相应的unit test（这种情况简直太常见了）。只要追加commits到你的这个主题branch中即可。

（题外话：如果原项目有Travis CI，那么它也会在每次追加push之后对Pull Request重新执行一遍测试）



## *（针对项目维护者）`cherry-pick`、`format-patch`和`am`

这几条命令主要针对项目的维护者，稍微提一下。

`git pull`和`git merge`是GitHub上最常用的merge Pull Requests的方式，在命令行下merge之后，GitHub上面的Pull Request也会相应地自动关闭。

如果贡献者一次提交了多条commits，有些是维护者并不想要的，可以用这几条命令来选择性地手动commit。（这也适用于某些项目不是借助于GitHub的Pull Request，而是通过邮件列表和patch文件来进行协作开发的情形）

在这种情况下，GitHub上面的Pull Request并不能自动关闭，需要维护者手工操作。



## Step 6: Pull Request关闭之后

如果是已经被merge后关闭的Pull Request，你可以在页面的最下方找到一个“__Delete this branch__”的蓝色按钮。

这表明这个主题branch的历史使命已经完成（fix-unicode-error的commit已经被合并到主项目中），可以安全地从远程库中删除了。

在本地库中亦可删除这个branch：

    $ git branch -d fix-unicode-error

反之，如果你的主题branch并没有被merge就被维护者关掉的话，你还可以继续再拿它来开新的Pull Request<del>去骚扰主项目</del>（´▽｀ ）。



## 总结

在哪些情况下___可以___直接使用master branch来提交Pull Request：

* 你只想为主项目贡献某一处代码，贡献完自己的repo就可以扔的那种。
* 你打算为主项目长期贡献代码，而且希望追随原项目的主线开发，不保留自己的特性。
* 你打算为主项目长期贡献代码，默认master branch追随原项目主线，把自己的特性放到别的branch中。

在哪种情况下___应该___使用主题branch来提交Pull Request：

* 想用master branch完全来做自己的开发。在这种情形下：
    * 会从上游库合并更新，但是这些merge本身的commits显然不可能作为返还到上游库的Pull Request的一部分。
    * 存在自己的（未被merge或者不想被merge到上游库的）commits。

鉴于Git的分布式开发哲学，每一个库均可以看作是一个独立的项目，显然是后一种（为每一个新特性建立一个专门的主题branch来向主项目推送Pull Request）的贡献方式更可取。



解释完毕(｀・ω・´)