---
layout: post
uri: /projects/translate-shell/0.8.21
permalink: /projects/translate-shell/0.8.21/index.html
title: Translate Shell
category:
tag:
description: 本文及其相关代码发布到公有领域。
disqus: false
lang: zh
---

<small>&gt; 这里是 [Translate Shell](https://github.com/soimort/translate-shell) 的一个中文版简介，已经在我 GitHub 上看过的请无视……</small>

<hr/>

# Translate Shell

[Translate Shell](http://www.soimort.org/translate-shell)（原 _Google Translate CLI_）是一个 [Google Translate](https://translate.google.com/) 的命令行界面和交互式 shell：

```console
$ trans 挖掘机技术哪里强，中国山东找蓝翔
Excavator where strong, China Shandong find LanXiang

Translations of 挖掘机技术哪里强，中国山东找蓝翔
(简体中文 ➔ English)
挖掘机 技术(Excavator) 哪里(where/where to/where the/Where is) 强 ,(strong,/
strong/stronger) 中国(China/Chinese) 山东(Shandong/in Shandong/of Shandong) 
找(find/looking/to find/looking for/look) 蓝 翔(LanXiang/Lan Xiang/Blue Che
ung/Blue Xiang)
```

默认情况下，句中每个语法部分可能的翻译均显示在其后括号中。若只想看到整体的翻译而无需具体到各部分，可以使用 `-b` 选项指定简洁模式翻译：（这与以前 [Google Translate CLI Legacy](https://github.com/soimort/translate-shell/tree/legacy) 显示的结果是相同的）

```console
$ trans -b 挖掘机技术哪里强，中国山东找蓝翔
Excavator where strong, China Shandong find LanXiang
```

翻译可以交互式地进行：（**Read-Translate-Print Loop**）

```console
$ trans -b -I
> Was mich nicht umbringt, macht mich stärker.
What does not kill me makes me stronger.
> Юмор есть остроумие глубокого чувства.
Humor is a deep sense of wit.
> 學而不思則罔，思而不學則殆。
Learning without thought is labor lost, thought without learning is perilous.
> 幸福になるためには、人から愛されるのが一番の近道。
In order to be happy, the shortest way is from being loved by the people.
```

**Translate Shell** 是对 [Google Translate CLI Legacy](https://github.com/soimort/translate-shell/tree/legacy) 的彻底重写，而 Google Translate CLI 原本只是一个100多行的实用 AWK 小脚本。Translate Shell 在命令行使用上对 Google Translate CLI Legacy 后向兼容；然而，它比从前提供了更多功能，包括更详尽的翻译解释、真人语音和交互模式，等等。

## 试用

如果系统上已经安装了 `gawk`，可以直接通过以下命令行交互式地使用 Google Translate：

```console
$ gawk "$(curl -Ls git.io/translate)" -I
```

## 安装前

### 系统需求

任何 POSIX 兼容的类 Unix 系统均可，包括但不限于：

* GNU/Linux
* BSD 家族，含 OS X
* illumos 家族，含 SmartOS
* Cygwin（Windows 上）

### 依赖

* [GNU Awk](https://www.gnu.org/software/gawk/) (gawk) `>=4.0`
    * 注意旧版 [Google Translate CLI](https://github.com/soimort/translate-shell/tree/legacy) 对 gawk 的版本要求是 `>=3.1`；Translate Shell 则需要 `4.0` 以后版本的 gawk
* [GNU Bash](http://www.gnu.org/software/bash/) 或 [Zsh](http://www.zsh.org/)
    * Translate Shell 可以通过任何现代的 Unix shell 运行，但它需要 bash 或 zsh 解释器来执行它的包装脚本；若您的系统上没有 bash 或 zsh，亦可直接调用 awk 脚本
* [GNU FriBidi](http://fribidi.org/)
    * 用于正确显示右起书写的语言（闪-含语言，诸如阿拉伯语和希伯来语）
* [MPlayer](http://www.mplayerhq.hu/)、[mplayer2](http://www.mplayer2.org/)、[mpg123](http://mpg123.org/) 或 [eSpeak](http://espeak.sourceforge.net/)
    * 用于真人语音功能
* [rlwrap](http://utopia.knoware.nl/~hlub/uck/rlwrap/#rlwrap)
    * 交互模式下支持 GNU readline 风格的编辑与历史命令的按键绑定（例如光标键定位和 `Ctrl-A`、`Ctrl-E`），推荐安装
* [groff](http://www.gnu.org/software/groff/)（GNU troff，绝大多数 Linux 系统和 OS X 上均有）
    * 用于显示 man page
* [GNU Emacs](http://www.gnu.org/software/emacs/)
    * 用于 Translate Shell 的 Emacs 界面

## 安装

### 1. 下载安装（最新版本）

下载[此文件](http://git.io/trans)并将其放入执行路径中。

```console
$ wget git.io/trans
$ chmod +x ./trans
```

### 2. 从系统包管理器安装

#### OS X

由作者本人维护的 Homebrew formula：（总是最新版本）

```console
$ brew install http://www.soimort.org/translate-shell/translate-shell.rb
```

#### FreeBSD

您可以从 FreeBSD 的 Ports collection 获取本软件：

```console
$ cd /usr/ports/textproc/google-translate-cli
$ make install
```

#### Debian

您可以从 Debian Testing（Jessie）的源获取本软件：

```console
$ apt-get install translate-shell
```

### 3. 从 Git 安装（适用于熟练用户和开发者）

```console
$ git clone https://github.com/soimort/translate-shell
$ cd translate-shell/
$ make install
```

默认情况下，一个可执行的 bash 脚本 `trans` 将被安装到 `/usr/bin`。若您偏好使用 zsh, 亦可指定 zsh 为生成目标：

```console
$ make TARGET=zsh install
```

亦可指定具体的安装路径:

```console
$ make INSTDIR=~/bin install
```

## 示例

### 翻译单词

#### 从任意语言到您的语言

Google Translate 能够自动检测文本的语言，Translate Shell 能够将文本自动翻译到您系统所设定的默认语言（locale）。

```console
$ trans vorto
```

#### 从任意语言到指定语言

翻译某单词到法语：

```console
$ trans :fr word
```

翻译某单词到汉语和日语：（使用加号“`+`”作为分隔符）

```console
$ trans :zh+ja word
```

等号（“`=`”）可以用来代替“`:`”。同样地，旧的 Google Translate CLI 中用花括号指定语言的方式仍然可行：（但不建议使用，因为等号和花括号在某些 shell 中有特殊含义）

```console
$ trans {=zh+ja} word
```

亦可通过 `-target` 选项指定语言：

```console
$ trans -t zh+ja word
```

#### 翻译指定语言

Google Translate 可能无法正确地识别所需翻译文本的语言；在这种情形下，需要显式地指定文本的语言：

```console
$ trans :en 手紙
$ trans ja:en 手紙
$ trans zh:en 手紙
```

亦可通过 `-source` 选项指定语言：

```console
$ trans -s ja -t en 手紙
```

### 翻译多个单词或短语

分别翻译各个单词：

```console
$ trans en:zh freedom of speech
```

当多个单词作为一个命令行参数时，作为一个整体翻译：

```console
$ trans en:zh "freedom of speech"
```

### 翻译句子

翻译整句：

```console
$ trans :zh "Words will always retain their power."
$ trans :zh 'Words will always retain their power.'
```

为了避开某些在 shell 中具有特殊含义的标点符号（例如“`!`”），总是使用*单引号*：

```console
$ trans :zh 'Yes we can!'
```

在某些情况下，您可能仍需使用*双引号*：（例如，句子本身包含单引号“`'`”）

```console
$ trans :zh "I'm lovin' it! McDonald's"
```

### 简洁模式

默认情况下，Translate Shell 总是显示最详细的翻译及解释。若只需查看唯一的翻译，使用 `-brief` 选项：

```console
$ trans :fr -b "Saluton, Mondo"
```

在简洁模式下，一些语言（如汉语、日语）的注音符号不会被显示出来。若要显示注音，可在语言代码前加上前缀“`@`”：

```console
$ trans :@ja -b "Saluton, Mondo"
```

### 真人语音（Text-to-Speech）

使用 `-play` 选项聆听翻译：

```console
$ trans :ja -b -p "Saluton, Mondo"
```

### 右起书写（RTL）语言

使用 `-width` 选项指定终端填充宽度（决定右起显示的位置）：

```console
$ trans :he -b -w 40 "Saluton, Mondo"
```

### 输入和输出

在调用时若未在参数中给出需要翻译的文本，Translate Shell 会去读取**标准输入**，或从 `-input` 指定的文件中读取：

```console
$ echo "Saluton, Mondo" | trans :fr -b
$ trans :fr -b -i input.txt
```

翻译将输出到**标准输出**，或输出到 `-output` 指定的文件：

```console
$ echo "Saluton, Mondo" | trans :fr -b -o output.txt
```

### 翻译文件

除了使用 `-input` 选项以外，亦可使用文件的 URL 作为参数指定需要翻译的文件：（`file://` 后接文件的相对或绝对路径名）

```console
$ trans :fr file://input.txt
$ trans :fr file:///home/soimort/Documents/input.txt
```

在通过这种方式翻译文件时，总是采取简洁模式。

### 翻译网页

可使用 URL 作为参数，翻译某个网页：

```console
$ trans :fr http://www.w3.org/
```

系统的默认浏览器将被启动，用以显示 Google Translate 的相应页面。可以使用 `-browser` 选项指定浏览器：

```console
$ trans :fr -browser firefox http://www.w3.org/
```

（注意：基于文本终端的浏览器诸如 lynx 或 w3m 目前似乎无法正常浏览 Google Translate 的翻译页面）

### 交互模式

使用 `-interactive` 选项进入 Translate Shell 的交互模式：

```console
$ trans -I
```

<style>
kbd {
  background-color: #d5e4f6;
  padding: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  box-shadow: 5px 5px 5px #888;
  font-family: monospace;
  size: 12px;
}
</style>

## 文本编辑器

`trans` 是一个纯命令行程序，这意味着它可以轻易与任何文本编辑器集成。

以下仅仅是一些使用技巧——您可以根据自己的需求定制适合自己的 Emacs mode 或 Vim 配置。

### Emacs

#### 交互式 shell

Emacs 可以作为 Translate Shell 的前端。这使得翻译不再受限于终端下进行，更可得益于 Emacs 强大的文本编辑能力。使用 `-emacs` 选项启动 Emacs 界面：

```console
$ trans -E
```

#### 翻译文本

在 Emacs 中编辑文本时，使用如下命令在缓冲区中查看当前区域文本的翻译：（以翻译到日文为例）

<kbd>M-| trans :ja</kbd>

### Vim

#### 翻译文本

在 `~/.vimrc` 中添加一行：

```vim
set keywordprg=trans\ :ja
```

使用 <kbd>Shift-K</kbd> 查看当前光标下单词的翻译。

## 帮助

详细的[帮助页面](http://www.soimort.org/translate-shell/trans.1.html)。

在命令行下使用 `$ trans -H` 查看 man page。

## 环境变量的设置

您可以导出某些环境变量，用于 Translate Shell 的默认设置。

* `BROWSER`：指定 `-browser` 选项的默认值
* `PLAYER`：指定 `-player` 选项的默认值
* `HTTP_PROXY` 和 `http_proxy`: 指定 `-proxy` 选项的默认值
* `TRANS_PS`: 指定 `-prompt` 选项的默认值
* `TRANS_PS_COLOR`: 执行 `-prompt-color` 选项的默认值
* `HOME_LANG`: 指定 `-l` 选项的默认值
* `SOURCE_LANG`: 指定 `-s` 选项的默认值
* `TARGET_LANG`: 指定 `-t` 选项的默认值

例如：

```console
$ export TARGET_LANG=zh
$ trans text
$ trans word
```

<hr/>

## 附：语言代码参考

在命令行下使用 `$ trans -R` 或 `$ trans -r` 查看语言代码参考。

<style>
table {
    width:100%;
}
table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
}
th, td {
    padding: 5px;
    text-align: left;
}
table#ref tr:nth-child(even) {
    background-color: #eee;
}
table#ref tr:nth-child(odd) {
   background-color:#fff;
}
table#ref th {
    background-color: black;
    color: white;
}
</style>
<table id="ref">
  <tr>
    <td>南非荷兰语（布尔语）</td>
    <td>af</td>
    <td>希腊语</td>
    <td>el</td>
    <td>蒙古语</td>
    <td>mn</td>
  </tr>
  <tr>
    <td>阿尔巴尼亚语</td>
    <td>sq</td>
    <td>古吉拉特语</td>
    <td>gu</td>
    <td>尼泊尔语</td>
    <td>ne</td>
  </tr>
  <tr>
    <td> 阿拉伯语</td>
    <td>ar</td>
    <td>海地克里奥尔语</td>
    <td>ht</td>
    <td>挪威语</td>
    <td>no</td>
  </tr>
  <tr>
    <td>亚美尼亚语</td>
    <td>hy</td>
    <td>豪萨语</td>
    <td>ha</td>
    <td>波斯语</td>
    <td>fa</td>
  </tr>
  <tr>
    <td>阿塞拜疆语</td>
    <td>az</td>
    <td>希伯来语</td>
    <td>he</td>
    <td>波兰语</td>
    <td>pl</td>
  </tr>
  <tr>
    <td>巴斯克语</td>
    <td>eu</td>
    <td>印地语</td>
    <td>hi</td>
    <td>葡萄牙语</td>
    <td>pt</td>
  </tr>
  <tr>
    <td>白俄罗斯语</td>
    <td>be</td>
    <td>苗语</td>
    <td>hmn</td>
    <td>旁遮普语</td>
    <td>pa</td>
  </tr>
  <tr>
    <td>孟加拉语</td>
    <td>bn</td>
    <td>匈牙利语</td>
    <td>hu</td>
    <td>罗马尼亚语</td>
    <td>ro</td>
  </tr>
  <tr>
    <td>波斯尼亚语</td>
    <td>bs</td>
    <td>冰岛语</td>
    <td>is</td>
    <td>俄语</td>
    <td>ru</td>
  </tr>
  <tr>
    <td>保加利亚语</td>
    <td>bg</td>
    <td>伊博语</td>
    <td>ig</td>
    <td>塞尔维亚语</td>
    <td>sr</td>
  </tr>
  <tr>
    <td>加泰罗尼亚语</td>
    <td>ca</td>
    <td>印尼语</td>
    <td>id</td>
    <td>斯洛伐克语</td>
    <td>sk</td>
  </tr>
  <tr>
    <td>宿务语</td>
    <td>ceb</td>
    <td>爱尔兰语</td>
    <td>ga</td>
    <td>斯洛文尼亚语</td>
    <td>sl</td>
  </tr>
  <tr>
    <td>汉语/简体中文</td>
    <td>zh-CN</td>
    <td>意大利语</td>
    <td>it</td>
    <td>索马里语</td>
    <td>so</td>
  </tr>
  <tr>
    <td>汉语/正体中文</td>
    <td>zh-TW</td>
    <td>日语</td>
    <td>ja</td>
    <td>西班牙语</td>
    <td>es</td>
  </tr>
  <tr>
    <td>克罗地亚语</td>
    <td>hr</td>
    <td>爪哇语</td>
    <td>jv</td>
    <td>斯瓦希里语</td>
    <td>sw</td>
  </tr>
  <tr>
    <td>捷克语</td>
    <td>cs</td>
    <td>卡纳达语</td>
    <td>kn</td>
    <td>瑞典语</td>
    <td>sv</td>
  </tr>
  <tr>
    <td>丹麦语</td>
    <td>da</td>
    <td>高棉语</td>
    <td>km</td>
    <td>泰米尔语</td>
    <td>ta</td>
  </tr>
  <tr>
    <td>荷兰语</td>
    <td>nl</td>
    <td>韩语（朝鲜语）</td>
    <td>ko</td>
    <td>泰卢固语</td>
    <td>te</td>
  </tr>
  <tr>
    <td>英语</td>
    <td>en</td>
    <td>老挝语</td>
    <td>lo</td>
    <td>泰语</td>
    <td>th</td>
  </tr>
  <tr>
    <td>世界语</td>
    <td>eo</td>
    <td>拉丁语</td>
    <td>la</td>
    <td>土耳其语</td>
    <td>tr</td>
  </tr>
  <tr>
    <td>爱沙尼亚语</td>
    <td>et</td>
    <td>拉脱维亚语</td>
    <td>lv</td>
    <td>乌克兰语</td>
    <td>uk</td>
  </tr>
  <tr>
    <td>菲律宾语（他加禄语）</td>
    <td>tl</td>
    <td>立陶宛语</td>
    <td>lt</td>
    <td>乌尔都语</td>
    <td>ur</td>
  </tr>
  <tr>
    <td>芬兰语</td>
    <td>fi</td>
    <td>马其顿语</td>
    <td>mk</td>
    <td>越南语</td>
    <td>vi</td>
  </tr>
  <tr>
    <td>法语</td>
    <td>fr</td>
    <td>马来语</td>
    <td>ms</td>
    <td>威尔士语</td>
    <td>cy</td>
  </tr>
  <tr>
    <td>加利西亚语</td>
    <td>gl</td>
    <td>马耳他语</td>
    <td>mt</td>
    <td>意第绪语</td>
    <td>yi</td>
  </tr>
  <tr>
    <td>格鲁吉亚语</td>
    <td>ka</td>
    <td>毛利语</td>
    <td>mi</td>
    <td>约鲁巴语</td>
    <td>yo</td>
  </tr>
  <tr>
    <td>德语</td>
    <td>de</td>
    <td>马拉地语</td>
    <td>mr</td>
    <td>祖鲁语</td>
    <td>zu</td>
  </tr>
</table>

<hr/>

## 如何报告 Issue / 提交 Pull Request

请先确保已阅读 [guidelines for contributing](https://github.com/soimort/translate-shell/blob/stable/CONTRIBUTING.md)。
