---
layout: post
uri: /posts/143
permalink: /posts/143/index.html
title: 前端之美——GitHub前端工具链整理汇总
category:
tag:
description:
disqus: false
lang: zh
---

给GitHub-Linguist添加[Literate CoffeeScript支持](https://github.com/github/linguist/pull/408)的时候稍稍总结了一下这个问题，即GitHub是怎样在前端渲染它的Markdown和处理代码高亮的。

大体上似乎是这个流程，

```ocaml
输入: 代码文本
GitHub-Linguist 判断代码语言
case 代码语言 of
    程序语言 => Pygments 全部代码高亮处理
  | 文本标记语言 =>
        GitHub-Markup 渲染框架
            RedCarpet / RedCloth / ... 文本渲染
            Pygments 代码块高亮处理
        end
输出: HTML文本
```

GitHub在前端用到的一系列工具基本上都是开源的。现简单地整理如下。

***

## 1. HTML / CSS / JavaScript

### 1.1. HTML模板

GitHub的标记 & 模板风格指南：<https://github.com/styleguide/templates>

### 1.2. 样式 & CSS

GitHub使用的CSS替代品是

* [SCSS](http://sass-lang.com/)：<https://github.com/nex3/sass>

采用文档框架

* [KSS](http://warpspire.com/kss/)：<https://github.com/kneath/kss>

GitHub的样式 & CSS风格指南：<https://github.com/styleguide/css>

### 1.3. 行为 & JavaScript

GitHub使用的JavaScript替代品是

* [CoffeeScript](http://coffeescript.org/)：<https://github.com/jashkenas/coffee-script>

GitHub的行为 & JavaScript风格指南：<https://github.com/styleguide/javascript>

## 2. GitHub Flavored Markdown和渲染引擎

GitHub使用的Markdown是对原标准的一个扩展集：

* [GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown): <https://github.com/github/github-flavored-markdown>

支持GitHub Flavored Markdown的渲染引擎：

* __RedCarpet__：<https://github.com/vmg/redcarpet>

RedCarpet的核心库是用C实现的，叫做Sundown（RedCarpet是Sundown的Ruby wrapper）：

* __Sundown__：<https://github.com/vmg/sundown>

[Sundown项目已经中止开发](https://github.com/vmg/sundown/commit/37728fb2d7137ff7c37d0a474cb827a8d6d846d8)。GitHub正在计划与Reddit、StackOverflow、Meteor协作开发一个统一的Markdown标准，以及一个相应的轻量级、快速的、高安全性的渲染引擎。发布时间预期为去年年底（或者今年年底？）。关于该替代品的开发状况，目前尚无可靠消息得以确认。

## 3. 标记语言渲染框架

GitHub用来渲染各种文本标记语言的框架（支持多种主流的轻量级标记语言，如Markdown、Textile、RDoc、Org mode、reStructuredText、AsciiDoc等，依赖于具体的引擎来完成。例如对Markdown的渲染依赖于__RedCarpet__）：

* __GitHub-Markup__：<https://github.com/github/markup>

## 4. 代码高亮渲染

基于Python的代码高亮工具[Pygments](http://pygments.org/)的一个Ruby wrapper：

* __Pygments.rb__：<https://github.com/tmm1/pygments.rb>

取代了原来的__Albino__: <https://github.com/github/albino>

## 5. 语言识别

GitHub用它来识别代码库中的语言（属于何种程序语言 或 文本标记语言）：

* __GitHub-Linguist__：<https://github.com/github/linguist>

这个库也决定了GitHub的[Top Languages页面](https://github.com/languages)中哪些编程语言将会被展示出来。

对于程序语言，GitHub将调用__Pygments.rb__对代码进行高亮处理；

对于文本标记语言，GitHub将把文件交由__GitHub-Markup__进行渲染。

## 6. 在线编辑器

在线代码编辑功能使用的是[Ace（Ajax.org Cloud9 Editor）](http://ace.ajax.org/)。这是一个非GitHub项目：

* __Ace__：<https://github.com/ajaxorg/ace>

## 7. 基于Git的Wiki框架

用于托管GitHub的项目Wiki：

* __Gollum__：<https://github.com/github/gollum>

## 8. 数据可视化框架

用于渲染Contribution graphs / Network graphs等页面的可视化效果：

* [D3](http://d3js.org/)：<https://github.com/github/d3>
（fork自[mbostock/d3](https://github.com/mbostock/d3)）

## 9. GitHub Pages / 静态网站生成器

GitHub Pages托管服务使用的静态网站生成器：

* __Jekyll__: <https://github.com/mojombo/jekyll>

（Jekyll并非GitHub的官方项目，没有使用GitHub-Markup作为其渲染框架。在最近的版本中才开始支持使用RedCarpet作为其Markdown引擎。）

## 10. 绘文字 ![](https://a248.e.akamai.net/assets.github.com/images/icons/emoji/metal.png)

GitHub官方指定绘文字表情（详细列表参见<http://www.emoji-cheat-sheet.com/>）：

* __Gemoji__: <https://github.com/github/gemoji>

（这一套通用的绘文字同时也被Campfire和Trac等支持。）
