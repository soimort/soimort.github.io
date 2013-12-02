---
layout: post
uri: /posts/165
permalink: /posts/165/index.html
title: Markdown+Pandoc→HTML幻灯片速成
category:
tag:
description:
disqus: true
lang: zh
---

学期末将近，熬夜做slides的时候又变多了。

所见即所得的PPT是一个比较低效的东西，因为没有做到内容与样式相分离，在做幻灯片的时候要把一半的精力放在外观而不是内容上；复杂庞大的文件格式，不符合Unix的纯文本哲学，只适合在特定的GUI下通过鼠标操作，无法通过文本编辑器修改，更难以用文本工具脚本处理；再加上微软他家的格式不开放，各路开源不开源的Office产品搞出来了各种程度不同的兼容性，非常分裂。

所以，有Web这样一个开放的、纯粹基于文本的业界标准就很重要。

这篇主要讲如何用Markdown这样的轻量级标记语言在编辑器中书写文本内容，用Pandoc迅速将其转换成[基于Web的演示文稿](https://en.wikipedia.org/wiki/Web-based_slideshow)。如是，可以在开会前十分钟根据事务提纲炮制出几十页的幻灯片，且不失美观。



## 准备工作：安装Pandoc

首先，你需要安装文本转换的神器Pandoc：<http://johnmacfarlane.net/pandoc/installing.html>

具体安装方法参见文档，在此不再赘述。

    $ cabal update
    $ cabal install pandoc



## 书写内容

内容是演示文稿的主体。PowerPoint或OpenOffice Impress里面的“大纲”就是用来把握这个主体的视图。这可以让写作者暂时忘记幻灯片的具体外观、排版这些表面化的东西，把集中力放到整个演讲的逻辑流程和提纲要领上。

书写HTML幻灯片可以像日常记笔记一样简捷快速。实际上，这些幻灯片本身就是用轻量级标记语言写成的纯文本，你可以用任何一种Pandoc支持的标记语言（Markdown、org-mode、reST、Textile……）来书写其内容。在此以Markdown为例：



```
% Nonsense Stuff
% John Doe
% March 22, 2005

# In the morning

## Getting up

- Turn off alarm
- Get out of bed

## Breakfast

- Eat eggs
- Drink coffee

# In the evening

## Dinner

- Eat spaghetti
- Drink wine

------------------

![picture of spaghetti](images/spaghetti.jpg)

## Going to sleep

- Get in bed
- Count sheep
```

分级标题、列表、插入图片……等标准的Markdown语法均被支持，和平常用Markdown记笔记写博客无异。

为了让Pandoc对不包含任何元信息的Markdown文本进行处理生成幻灯片，在文本开头需要包含三行以`%`打头的元信息：标题、作者和日期。

为了生成合适的用于演示的HTML文档，需要记住的另一点是：在默认情况下每个二级标题是一张独立的幻灯片。这样在写作的时候，只需注意把每个二级标题下的内容控制在适当的长度。

列表的显示效果可以人为设定，例如在幻灯片演示的时候逐条渐入，后文会提到。也可以使用`$`插入 TeX公式，Pandoc可以将其转换为被大部分现代浏览器支持的MathML，或借助MathJax在较旧浏览器中显示。

也可以直接在文本中嵌入HTML，用于显示Markdown等标记语言不支持的表格，或控制字体大小，以及进行其他更加复杂的排版。当然，如果用到的HTML标签过多，这不是Markdown这些轻量级标记语言的错，也许是做幻灯片的方式出了问题。因为演示本身要传达的是内容，复杂的排版没有任何意义。想一想[高桥流简报法](https://zh.wikipedia.org/wiki/%E9%AB%98%E6%A9%8B%E6%B5%81%E7%B0%A1%E5%A0%B1%E6%B3%95)。



## 定义样式

目前Pandoc包含了对五种HTML幻灯片框架的支持：

* [DZSlides](https://github.com/paulrouget/dzslides)
* [Slidy](http://www.w3.org/Talks/Tools/Slidy2/)
* [S5](http://meyerweb.com/eric/tools/s5/)
* [Slideous](http://goessner.net/articles/slideous/slideous.html)
* [reveal.js](http://lab.hakim.se/reveal-js)

当然，你实际上可以使用任何喜欢的幻灯片框架（比如[Google I/O HTML5 slide template](https://code.google.com/p/io-2012-slides/)），只要让Pandoc在渲染HTML时使用你指定的模板即可。



### 自定义HTML模板

首先，如果你知道如何写CSS去定义页面外观、如何写JavaScript让`<div>`元素动起来，或者已经有了一个不错的HTML幻灯片模板，你就可以直接让Pandoc把Markdown转换成纯HTML片段，用来嵌到自己的模板里：

    $ pandoc slides.md -o slides.html

生成一个完整的HTML页面（包含`<html>`、`<head>`、`<body>`标签和各种元信息）：

    $ pandoc slides.md -o slides.html -s



### [DZSlides](https://github.com/paulrouget/dzslides)

当然，我们完全没有必要写自己的HTML模板，因为Pandoc已经提供了对多种幻灯片模板的支持。**DZSlides**便是其中最简单的一种，支持键盘操作→/←翻页，PgUp/PgDn，Home/End。

Pandoc生成的DZSlides幻灯片中自包含了所需CSS和JavaScript，无需依赖任何外部文件。

采用默认模板渲染一个独立的DZSlides幻灯片：

    $ pandoc slides.md -o slides.html -t dzslides -s

若要对模板的样式进行调整，可以用`--template`指定自定义模板。默认的模板为`default.dzslides`，因此上述命令等效于：

    $ pandoc slides.md -o slides.html -t dzslides --template default.dzslides

可以从这里<https://github.com/jgm/pandoc-templates>找到原来的模板，自行修改后替换掉原先的模板。其余幻灯片框架与此相仿，以后不再赘述。



### [Slidy](http://www.w3.org/Talks/Tools/Slidy2/)

[HTML Slidy](http://www.w3.org/Talks/Tools/Slidy2/)是W3C开发的一个极简主义HTML幻灯片模板，没有任何多余的样式，支持鼠标单击翻页，键盘操作→/←，PgUp/PgDn，Home/End。

采用默认模板渲染一个独立的Slidy幻灯片：

    $ pandoc slides.md -o slides.html -t slidy -s

或指定自定义模板：

    $ pandoc slides.md -o slides.html -t slidy --template default.slidy

Pandoc生成的Slidy HTML依赖于http://www.w3.org/Talks/Tools/Slidy2/styles/slidy.css和http://www.w3.org/Talks/Tools/Slidy2/scripts/slidy.js这两个外部文件。若不想依赖<http://www.w3.org/>，可以将它们保存为本地文件。



### [S5](http://meyerweb.com/eric/tools/s5/)

[S5（Simple Standards-Based Slide Show System）](https://en.wikipedia.org/wiki/S5_\(file_format\))是一个公有领域的HTML幻灯片规范。它支持鼠标单击翻页，键盘操作→/←，PgUp/PgDn，Home/End。

为了使用S5作为幻灯片框架，需要从[这里](http://meyerweb.com/eric/tools/s5/)下载S5。解压之后把S5文件夹中的`ui/default`拷贝到幻灯片所在路径下，改名为`s5/default`即可。

渲染幻灯片：

    $ pandoc slides.md -o slides.html -t s5 -s

在S5的幻灯片界面上，鼠标移到右下角可以看到若干控制选项。



### [Slideous](http://goessner.net/articles/slideous/slideous.html)

**Slideous**是另一个有些年头的HTML幻灯片框架。支持鼠标单击翻页，键盘操作→/←，PgUp/PgDn，Home/End。

下载http://goessner.net/download/prj/slideous/slideous.js和http://goessner.net/download/prj/slideous/slideous.css这两个文件，放到本地目录`slideous/`下即可。

渲染幻灯片：

    $ pandoc slides.md -o slides.html -t slideous -s

Slideous的界面上提供了比较丰富的控制选项。



### [reveal.js](http://lab.hakim.se/reveal-js)

**reveal.js**这东西已经红得不能更红了，最近开始火起来的WYSIWYG在线幻灯片工具[slid.es](http://slid.es)也是基于它。

reveal.js的设计风格（字体、HTML5/CSS3效果）比起前面几个框架更加现代，所以如果没有特别的理由（旧浏览器兼容性）的话，reveal.js果然还是最应该推荐的一个。

虽说reveal.js本身就提供对Markdown语法的支持，不过Pandoc的好处很明显，那就是一条命令解决问题，不需要用户接触任何HTML。

首先需要从GitHub上获取<https://github.com/hakimel/reveal.js>，将`reveal.js`同名的文件夹放在幻灯片所在目录下即可：

    $ git clone https://github.com/hakimel/reveal.js

渲染幻灯片：

    $ pandoc slides.md -o slides.html -t revealjs -s

除了默认的外观主题以外，reveal.js还提供了多个主题可供选择，

    $ pandoc slides.md -o slides.html -t revealjs -s -V theme=beige

* `default`：（默认）深灰色背景，白色文字
* `beige`：米色背景，深色文字
* `sky`：天蓝色背景，白色细文字
* `night`：黑色背景，白色粗文字
* `serif`：浅色背景，灰色衬线文字
* `simple`：白色背景，黑色文字
* `solarized`：奶油色背景，深青色文字



### LaTeX Beamer

最后，虽然不是HTML，Pandoc也可以用来将Markdown文件渲染成[LaTeX beamer](https://en.wikipedia.org/wiki/Beamer_\(LaTeX\))样式的PDF幻灯片。如需要打印而不是演示时特别有用。

    $ pandoc slides.md -o slides.pdf -t beamer



## 更多设置

### 幻灯片级别（Slide level）

在前文的例子里看到，

```
# In the morning

## Getting up

- Turn off alarm
- Get out of bed
```

1级标题`In the morning`后面紧跟2级标题`Getting up`，而2级标题`Getting up`后面的内容是显示在幻灯片上的主体内容，因此这里的Slide level为2。这意味着每个2级标题生成一张幻灯片。高于2级的标题（1级标题）生成一张独立的仅包含标题的幻灯片，而低于2级的标题（3级标题）将存在于上一级标题的幻灯片中，不单独生成新的幻灯片。

可以使用`--slide-level`选项覆盖默认的Slide level。

在reveal.js模板下，由于幻灯片的滚动方向可以是二维的（键盘→←↑↓），所以1级标题渲染为水平方向的幻灯片，2级标题渲染为竖直方向的幻灯片。

“华丽丽的分割线”：

    ------------------

用来强制生成新的幻灯片。



### 渐进显示

生成幻灯片时加入`-i`选项，用于控制列表的显示效果（逐条渐入）。

    $ pandoc slides.md -o slides.html -t slidy -s -i

两段文字显示之间的人为停顿，用如下分割线：

    . . .



### TeX公式

可以直接插入TeX公式：

```tex
$e^x = \sum_{n=0}^\infty \frac{x^n}{n!} = \lim_{n\rightarrow\infty} (1+x/n)^n$
```

MathML的渲染效果为：

<math display="inline" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><msup><mi>e</mi><mi>x</mi></msup><mo>=</mo><msubsup><mo>∑</mo><mrow><mi>n</mi><mo>=</mo><mn>0</mn></mrow><mo>∞</mo></msubsup><mfrac><msup><mi>x</mi><mi>n</mi></msup><mrow><mi>n</mi><mo>!</mo></mrow></mfrac><mo>=</mo><msub><mi>lim</mi><mrow><mi>n</mi><mo>→</mo><mo>∞</mo></mrow></msub><mo stretchy="false">(</mo><mn>1</mn><mo>+</mo><mi>x</mi><mo>/</mo><mi>n</mi><msup><mo stretchy="false">)</mo><mi>n</mi></msup></mrow></math>

控制TeX公式渲染方式的选项有`--mathml`，`--webtex`，`--mathjax`和`--latexmathml`。（Chrome和Firefox均支持MathML）



### 代码高亮风格

控制代码高亮风格的选项有：

* `--highlight-style pygments`
* `--highlight-style kate`
* `--highlight-style monochrome`
* `--highlight-style espresso`
* `--highlight-style haddock`
* `--highlight-style tango`
* `--highlight-style zenburn`



### 自定义CSS

你当然可以通过修改相应模板文件夹下的CSS来实现自定义外观，不过也可以使用`--css`指定任何现成的CSS文件。



### 提示板

首先，提示板的功能仅适用于reveal.js。

其次，由于浏览器的本地安全策略，需使用该功能的幻灯片必须在HTTP服务器上运行。

在Markdown中插入标签`<div class="notes">`的小抄：

```xml
<div class="notes">
This is my note.

- It can contain markdown
- like this list

</div>
```

使用键盘`s`键打开提示板。当然，这个提示板是用来给演讲者自己看的，是不用mirror到外接投影仪的。

<img src="http://i.imgur.com/J0QtnOB.png" width="100%"/>
