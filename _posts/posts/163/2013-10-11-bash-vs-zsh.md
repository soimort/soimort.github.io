---
layout: post
uri: /posts/163
permalink: /posts/163/index.html
title: Zsh vs. Bash：不完全对比解析（1）
category:
tag:
description:
disqus: true
lang: zh
---

## Zsh和Bash，究竟有何不同

已经有不少人写过类似“为什么Zsh比Bash好”“[为什么Zsh比* shell好](http://www.slideshare.net/jaguardesignstudio/why-zsh-is-cooler-than-your-shell-16194692)”的文章了，讲解如何配置Zsh或折腾[各种oh-my-zsh主题](https://github.com/robbyrussell/oh-my-zsh/wiki/themes)的教程也是一搜一大箩，但是却极少看到Zsh和Bash这两个Shell__作为脚本语言__时的具体差异比较。那么，这里就是一篇，从语言特性的角度上简单整理了两者一些细微的不兼容之处，供编写可移植Shell脚本时参考。（仅仅是从我自己过去的经验教训中总结出来的，所以应该也是不完全的。）



### 开始之前：理解Zsh的仿真模式（emulation mode）

一种流行的说法是，Zsh是与Bash兼容的。这种说法既对，也不对，因为Zsh本身作为一种脚本语言，是__与Bash不兼容__的。符合Bash规范的脚本无法保证被Zsh解释器正确执行。但是，Zsh实现中包含了一个屌炸天的__仿真模式（emulation mode）__，支持对两种主流的Bourne衍生版shell（bash、ksh）和C shell的仿真（csh的支持并不完整）。在Bash的仿真模式下，可以使用与Bash相同的语法和命令集合，从而达到近乎完全兼容的目的。为了激活对Bash的仿真，需要显式执行：

    $ emulate bash

等效于：

    $ emulate sh

Zsh是不会根据文件开头的shebang（如`#!/bin/sh`和`#!/bin/bash`）自动采取兼容模式来解释脚本的，因此，要让Zsh解释执行一个其他Shell的脚本，你仍然必须手动`emulate sh`或者`emulate ksh`，告诉Zsh对何种Shell进行仿真。

那么，Zsh究竟在何时能够___自动___仿真某种Shell呢？

对于如今的绝大部分GNU/Linux（Debian系除外）和Mac OS X用户来说，系统默认的`/bin/sh`指向的是`bash`：

    $ file /bin/sh
    /bin/sh: symbolic link to `bash'

不妨试试用`zsh`来取代`bash`作为系统的`/bin/sh`：

    # ln -sf /bin/zsh /bin/sh

所有的Bash脚本仍然能够正确执行，因为Zsh在作为`/bin/sh`存在时，能够自动采取其相应的兼容模式（`emulate sh`）来执行命令。也许正是因为这个理由，[Grml](http://grml.org/)直接选择了Zsh作为它的`/bin/sh`，对现有的Bash脚本能做到近乎完美的兼容。



### 无关主题：关于`/bin/sh`和shebang的可移植性

说到`/bin/sh`，就不得不提一下，在Zsh的语境下，`sh`指的是大多数GNU/Linux发行版上`/bin/sh`默认指向的`bash`，或者至少是一个Bash的子集（若并非全部GNU Bash的最新特性都被实现的话），而非指POSIX shell。因此，Zsh中的`emulate sh`可以被用来对Bash脚本进行仿真。

众所周知，Debian的默认`/bin/sh`是
[dash](http://gondor.apana.org.au/~herbert/dash/)（Debian Almquist shell），这是一个纯粹POSIX shell兼容的实现，基本上你要的bash和ksh里的那些高级特性它都没有。_“如果你在一个`#!/bin/sh`脚本中用到了非POSIX shell的东西，说明你的脚本写得是错的，不关我们发行版的事情。”_Debian开发者们在把默认的`/bin/sh`换成`dash`，导致一些脚本出错时这样宣称道。<del>当然，我们应该继续假装与POSIX shell标准保持兼容是一件重要的事情，即使现在大家都已经用上了更高级的shell。</del>

因为有非GNU的Unix，和Debian GNU/Linux这类发行版的存在，你不能够假设系统的`/bin/sh`总是GNU Bash，也不应该把`#!/bin/sh`用作一个Bash脚本的shebang（——除非你愿意放弃你手头Shell的高级特性，写只与POSIX shell兼容的脚本）。如果想要这个脚本能够被方便地移植的话，应指定其依赖的具体Shell解释器：

```sh
#!/usr/bin/env bash
```

这样系统才能够总是使用正确的Shell来运行脚本。

（当然，显式地调用`bash`命令来执行脚本，shebang怎样写就无所谓了）

---



## `echo`命令 / 字符串转义

<del>Zsh比之于Bash，可能最容易被注意到的一点不同是，</del>Zsh中的`echo`和`printf`是内置的命令。

    $ which echo
    echo: shell built-in command
    
    $ which printf
    printf: shell built-in command

Bash中的`echo`和`printf`同样是内置命令：

    $ type echo
    echo is a shell builtin
    
    $ type printf
    echo is a shell builtin

感谢读者提醒，__在Bash中不能通过`which`来确定一个命令是否为外部命令__，因为__`which`本身并不是Bash中的内置命令__。`which`在Zsh中是一个内置命令。

Zsh内置的`echo`命令，与我们以前在GNU Bash中常见的`echo`命令，使用方式是___不兼容___的。

首先，请看Bash：

    $ echo \\
    \
    
    $ echo \\\\
    \\

我们知道，因为这里传递给`echo`的只是一个字符串（允许使用反斜杠`\`转义），所以不加引号与加上双引号是等价的。Bash输出了我们预想中的结果：每两个连续的`\`转义成一个`\`字符输出，最终2个变1个，4个变2个。没有任何惊奇之处。

你能猜到Zsh的输出结果么？

↓  
↓  
↓  
↓  
↓  
↓  
↓  
↓  
↓  
↓  

    $ echo \\
    \
    
    $ echo \\\\
    \

(゜Д゜*)

解释稍后。

我们还知道，要想避免一个字符串被反斜杠转义，可以把它放进单引号。正如我们在Bash中所清楚看到的这样，所有的反斜杠都照原样输出：

    $ echo '\\'
    \\
    
    $ echo '\\\\'
    \\\\

再一次，你能猜到Zsh的输出结果么？

↓  
↓  
↓  
↓  
↓  
↓  
↓  
↓  
↓  
↓  

    $ echo '\\'
    \
    
    $ echo '\\\\'
    \\

((((((゜Д゜*))))))))))))

这个解释是这样的：在前一种不加引号（或者加了双引号）的情形下，传递给`echo`内部命令的字符串将首先被转义，`echo \\`中的`\\`被转义成`\`，`echo \\\\`中的`\\\\`被转义成`\\`。然后，在`echo`这个内部命令输出到终端的时候，它还要把这个东西__再转义一遍__，一个单独的`\`没法转义，所以仍然是作为`\`输出；连续的`\\`被转义成`\`，所以输出就是`\`。因此，`echo \\`和`echo \\\\`的输出相同，都是`\`。

为了让Zsh中`echo`的输出不被转义，需要显式地指明`-E`选项：

    $ echo -E \\
    \
    
    $ echo -E \\\\
    \\

于是，我们也就知道在后一种加单引号的情形下，如何得到与原字符串完全相同的输出了：

    $ echo -E '\\'
    \\
    
    $ echo -E '\\\\'
    \\\\

而GNU的`echo`默认就是不对输出进行转义的，若要得到转义的效果，需显式地指定`-e`选项。Bash和Zsh中`echo`命令用法的不兼容，在这里体现出来了。

（<del>顺便说一句，GNU提供的echo功能显然更加碉堡，想知道为什么，[看这里](http://www.gnu.org/fun/jokes/echo-msg.zh-cn.html) 。</del>）



## 变量的自动分字（word splitting）

在Bash中，你可以通过调用外部命令`echo`输出一个字符串：

```sh
echo $text
```

我们知道，Bash会对传递给命令的字符串进行分字（根据空格或换行符），然后作为多个参数传给`echo`。当然，作为分隔符的换行，在最终输出时就被抹掉了。于是，更好的习惯是把变量名放在双引号中，把它作为一个字符串传递，这样就可以保留文本中的换行符，将其原样输出。

```sh
echo "$text"
```

在Zsh中，你不需要通过双引号来告诉解释器“`$text`是一个字符串”。解释器不会把它转换成一个由空格或者`\n`分隔的参数列表或者别的什么。所以，没有Bash中的trick，直接`echo $text`就可以保留换行符。但是，如前一节所说，我们需要一个多余的工作来保证输出的是未转义的原始文本，那就是`-E`选项：

```sh
echo -E $text
```

从这里我们看到，Zsh中的变量在传递给命令时是不会被自动切分成words然后以多个参数的形式存在的。它仍然保持为__一个量__。这是它与传统的Bourne衍生shell（ksh、bash）的一个重要不兼容之处。这是Zsh的特性，[而不是一个bug](http://zsh.sourceforge.net/FAQ/zshfaq03.html#31)。



## 通配符展开（globbing）

[通配符展开（globbing）](https://en.wikipedia.org/wiki/Glob_\(programming\))也许是Unix shell中最为实用化的功能之一。比起正则表达式，它的功能相当有限，不过它的确能满足大部分时候的需求：依据固定的前缀或后缀匹配文件。需要更复杂模式的时候其实是很少见的，至少在文件的命名和查找上。

Bash和Zsh对通配符展开的处理方式有何不同呢？举个例子，假如我们想要列举出当前目录下所有的`.markdown`文件，但实际上又不存在这样的文件。在Zsh中：（注意到这里使用了内置的`echo`，因为我们暂时还不想用到外部的系统命令）

    $ echo *.markdown
    zsh: no matches found: *.markdown

Bash中：

    $ echo *.markdown
    *.markdown

Zsh因为通配符展开失败而报错；而Bash在通配符展开失败时，会放弃把它作为通配符展开、直接把它当做字面量返回。看起来，Zsh的处理方式更优雅，因为这样你就可以知道这个通配符确实无法展开；而在Bash中，你很难知道究竟是不存在这样的文件，还是存在一个文件名为`'*.markdown'`的文件。

接下来就是不那么和谐的方面了。

在Zsh中，用`ls`查看当然还是报错：

    $ ls *.markdown
    zsh: no matches found: *.markdown

Bash，这时候调用`ls`也会报错。因为当前目录下没有`.markdown`后缀的文件，通配符展开失败后变成字面的`'*.markdown'`，这个文件自然也不可能存在，所以外部命令`ls`报错：

    $ ls *.markdown
    ls: cannot access *.markdown: No such file or directory

同样是错误，差别在哪里？对于Zsh，这是一个语言级别的错误；对于Bash，这是一个外部命令执行的错误。这件差别很重要，因为它意味着后者可以被轻易地catch，而前者不能。

想象一个常见的命令式编程语言，Java或者Python。你可以用try...catch或类似的语言结构来捕获运行时的异常，比较优雅地处理无法预料的错误。Shell当然没有通用的异常机制，但是，你可以通过检测某一段命令的返回值来模拟捕获运行时的错误。例如，在Bash里可以这样：

    $ if ls *.markdown &>/dev/null; then :; else echo $?; fi
    2

于是，在通配符展开失败的情形下，我们也能轻易地把外部命令的错误输出重定向到`/dev/null`，然后根据返回的错误码执行后续的操作。

不过在Zsh中，这个来自Zsh解释器自身的错误输出却无法被重定向：

    $ if ls *.markdown &>/dev/null; then :; else echo $?; fi
    zsh: no matches found: *.markdown
    1

大部分时候，我们并不想看到这些丑陋多余的错误输出，我们期望程序能完全捕获这些错误，然后完成它该完成的工作。但这也许是一种正常的行为。理由是，在程序语言里，syntax error一般是无法简单地由用户在运行阶段自行catch的，这个报错工作将直接由解释器来完成。除非，当然，除非我们用了邪恶的`eval`。

    $ if eval "ls *.markdown" &>/dev/null; then :; else echo $?; fi
    1

_Eval is evil_. 但在Zsh中捕获这样的错误，似乎没有更好的办法了。必须这么做的原因就是：__Zsh中，通配符展开失败是一个语法错误。而在Bash中则不是。__

基于上述理由，依赖于Bash中通配符匹配失败而直接把`"*"`当作字面量传递给命令的写法，在Zsh中是无法正常运行的。例如，在Bash中你可以：（虽然在大部分情况下___能用___，但显然不加引号是不科学的）

    $ find /usr/share/git -name *.el

因为Zsh不会在glob扩展失败后自动把`"*"`当成字面量，而是直接报错终止运行，所以在Zsh中你__必须__给`"*.el"`加上引号，来避免这种扩展：

    $ find /usr/share/git -name "*.el"



## 字符串比较

在Bash中判断两个字符串是否相等：

```sh
[ "$foo" = "$bar" ]
```

或与之等效的（现代编程语言中更常见的`==`比较运算符）：

```sh
[ "$foo" == "$bar" ]
```

注意等号左右必须加空格，变量名一定要放在双引号中。（写过Shell的都知道这些规则的重要性）

在条件判断的语法上，Zsh基本和Bash相同，没有什么改进。除了它的解释器想得太多，以至于不小心把`==`当做了一个别的东西：

    $ [ foo == bar ]; echo $?
    zsh: = not found

要想使用我们最喜欢的`==`，只有把它用引号给保护起来，不让解释器做多余的解析：

    $ [ foo "==" bar ]; echo $?
    1

所以，为了少打几个字符，还是老老实实用更省事的`=`吧。



## 数组

同样用一个简单的例子来说明。Bash：

```sh
array=(alpha bravo charlie delta)
echo $array
echo ${array[*]}
echo ${#array[*]}
for ((i=0; i < ${#array[*]}; i++)); do
    echo ${array[$i]}
done
```

输出：

    alpha
    alpha bravo charlie delta
    4
    alpha
    bravo
    charlie
    delta

很容易看到，__Bash的数组下标是从0开始的__。`$array`取得的实际上是数组的第一个元素的值，也就是`${array[0]}`（这些行为和C有点像）。要想取得整个数组的值，必须使用`${array[*]}`或`${array[@]}`，因此，获取数组的长度可以使用`${#array[*]}`。在Bash中，必须记得在访问数组元素时给整个数组名连同下标加上花括号，比如，`${array[*]}`不能写成`$array[*]`，否则解释器会首先把`$array`当作一个变量来处理。

再来看这段Zsh：

```sh
array=(alpha bravo charlie delta)
echo $array
echo $array[*]
echo $#array
for ((i=1; i <= $#array[*]; i++)); do
    echo $array[$i]
done
```

输出：

    alpha bravo charlie delta
    alpha bravo charlie delta
    4
    alpha
    bravo
    charlie
    delta

在Zsh中，`$array`和`$array[*]`一样，可以用来取得整个数组的值。因此获取数组的长度可直接用`$#array`。

__Zsh的默认数组下标是从1而不是0开始的__，这点更像C shell。（虽然一直无法理解一个名字叫C的shell为何会采用1作为数组下标开始这种奇葩设定）

最后，Zsh不需要借助花括号来访问数组元素，因此Bash中必需的花括号都被略去了。



## 关联数组

Bash 4.0+和Zsh中都提供了对类似AWK关联数组的支持。

```sh
declare -A array
array[mort]=foo
```

和普通的数组一样，在Bash中，必须显式地借助花括号来访问一个数组元素：

```sh
echo ${array[mort]}
```

而Zsh中则没有必要：

```sh
echo $array[mort]
```

说到这里，我们注意到Zsh有一个不同寻常的特性：[支持使用方括号进行更复杂的globbing](http://zsh.sourceforge.net/Guide/zshguide05.html#l135)，`array[mort]`这样的写法事实上会造成二义性：究竟是取`array`这个关联数组以`mort`为key的元素值呢，还是以通配符展开的方式匹配当前目录下以`"array"`开头，以`"m"`、`"o"`、`"r"`或`"t"`任一字符结尾的文件名呢？

在`array[mort]=`作为命令开始的情况下，不存在歧义，这是一个对关联数组的赋值操作。在前面带有`$`的情况下，Zsh会自动把`$array[mort]`识别成取关联数组的值，这也没有太大问题。问题出在它存在于命令中间，却又不带`$`的情况，比如：

```sh
read -r -d '' array[mort] << 'EOF'
hello world
EOF
```

我们的本意是把这个heredoc赋值给`array[mort]`数组元素。在Bash中，这是完全合法的。然而，在Zsh中，解释器会首先试图对`"array[mort]"`这个模式进行glob展开，如果当前目录下没有符合该模式的文件，当然就会报出一个语法错误：

    zsh: no matches found: array[mort]

这是一件很傻的事情，为了让这段脚本能够被Zsh解释器正确执行，我们需要把`array[mort]`放在引号中以防止被展开：

```sh
read -r -d '' 'array[mort]' << 'EOF'
hello world
EOF
```

这是Zsh在扩展了一些强大功能的同时带来的不便之处（或者说破坏了现有脚本兼容性的安全隐患，又或者是让解释器混乱的pitfalls）。

顺便说一句，用Rake构建过项目的Rails程序员都知道，有些时候需要在命令行下通过方括号给`rake`传递参数值，如：

    $ rake seeder:seed[100]

Zsh这个对方括号展开的特性确实很不方便。如果不想每次都用单引号把参数括起来，可以完全禁止Zsh对某条命令后面的参数进行glob扩展：（`~/.zshrc`）

```sh
alias rake="noglob rake"
```

嗯，对于`rake`命令来说，glob扩展基本是没有用的。你可以关掉它。



## 分号与空语句

虽然有点无聊，但还是想提一下：__Bash不允许语句块中使用空语句__，最小化的语句是一个noop命令（`:`）；而__Zsh允许空语句__。

刚开始写Bash的时候，总是记不得什么时候该加分号什么时候不该加。比如

```sh
if [ 1 ]
then
  :
fi
```

如果放在一行里写，应该是

```sh
if [ 1 ]; then :; fi
```

`then`后面是不能接分号的，如果写成

```sh
if [ 1 ]; then; :; fi
```

就会报错：

    bash: syntax error near unexpected token `;'

解释是：`then`表示一个代码段的开始，`fi`表示结束，这中间的内容必须是若干行命令，或者以分号`;`结尾的放在同一行内的多条命令。我们知道在传统的shell中，分号本身并不是一条命令，空字符串也不是一条命令，因此，`then`后面紧接着的分号就会带来一条语法错误。_（有些时候对某个“语言特性”的所谓解释只是为了掩饰设计者在一开始犯的错误，所以就此打住）_

在Zsh中，上述两种写法都合法。因为它允许只包含一个分号的空命令。

    $ ;

当然，因为分号只是一个语句分隔符，所以没有也是可以的。这种写法在Zsh中合法：（`then`的语句块为空）

```sh
if [ 1 ]; then fi
```



---

## 第二弹

其实只是先挖个坑而已。我也不知道有没有时间写，暂且记上。

### Zsh vs. Bash：不完全对比解析（2）

* 别名，函数定义和作用域
* 协进程（coprocess）
* 重定向
* 信号和陷阱（trap）


