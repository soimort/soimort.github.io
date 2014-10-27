---
layout: post
uri: /posts/151
permalink: /posts/151/index.html
title: Furious the Monkey Patch（狂暴的猴子修补）
category:
tag:
description:
disqus: false
lang: zh
---
<script>lock()</script>

## FURIOUS THE MONKEY PATCH

最近在看pip和setuptools的源码，对动态修改运行时代码的手段（也就是所谓的[Monkey Patch](http://en.wikipedia.org/wiki/Monkey_patch)）有了一些心得体会，简单地记录一下。

__FURIOUS THE MONKEY BOY（狂暴的猴男孩）__是帝国时代II里面的一个作弊兵种，单个使用，可以迅速摧毁敌军的单位。虽然这和Monkey Patch基本上没啥关系，不过我倒是觉得借助于Monkey Patch写代码<del>很接近我以前单机打帝国挑专家电脑的方式</del>：（在运行时）打着打着发现正规的手段罩不住了，以前造的兵都不够用了，于是赶紧召唤出一堆作弊单位来弥补局面……

***

## 一个简单的示例：问题描述

写一个从IETF的官网获取[RFC文档](http://tools.ietf.org/rfc/)大小（以字节为单位）的Python函数`get_rfc_content_length()`。输入为某RFC的编号（整数），返回值为该RFC的HTML文档大小（整数）。

例如，RFC2549（文档地址<http://tools.ietf.org/html/rfc2549>）的大小为17833字节，那么：

```
>>> get_rfc_content_length(2549)
17833
```

要求借助Python 3的urllib中的`request.urlopen`实现。在没有预置的handler来完成请求时（我们知道，此时`urlopen()`将返回`None`，尽管这在默认情况下永远也不会发生），应当抛出一个用户自定义的`NoHandlerError`；更进一步，在当前网络状况存在问题时（未连接，或DNS解析出错），应当抛出一个`URLError`；而当我们查找的RFC编号不存在时（例如<http://tools.ietf.org/html/rfc8888>，此时服务器将返回一个404错误），`get_rfc_content_length()`应当返回值`None`。

为了便于参考，实现部分的代码如下：

```python
from urllib import request, error

def get_rfc_content_length(num):
    url = "http://tools.ietf.org/html/rfc%s" % str(num)
    
    try:
        response = request.urlopen(url)
        if response is None:
            raise NoHandlerError()
        else:
            header = response.headers['Content-Length']
            content_length = int(header)
    except error.HTTPError:
        return None
    except:
        raise
    else:
        return content_length

class NoHandlerError(Exception):
    def __str__(self):
        return repr('No installed handler handles the request')
```

以下，将通过为这段代码编写单元测试用例来详解Monkey Patch的具体用法。



## 1) Monkey Patch的naïve用法

在我们的`get_rfc_content_length()`函数实现正确的前提下，以下最简单的测试用例可以通过：

```python
def test_0(self):
    assert get_rfc_content_length(2549) == 17833
```

现在，我们需要测试需求规格中存在的另一种情形：在没有预置的handler来完成请求时，应当抛出一个用户自定义的`NoHandlerError`。

如前所述，我们知道，在没有预置的handler来完成请求时，`urlopen()`将返回`None`。因此，最省事的测试方法就是：我们能否在单元测试中临时修改一下`request.urlopen`的实现，让它直接返回`None`？如果可以，那么我们就可以直接测试`get_rfc_content_length()`是否如我们希望的那样抛出`NoHandlerError`。这看起来要比替换掉urllib库预先设定的全局默认handler（`UnknownHandler`）要干净得多：

```python
def test_0(self):
    """
    Test if no installed handler handles the request
    A NoHandlerError should be raised.
    """
    
    request.urlopen = lambda *args, **kwargs: None
    
    self.assertRaises(NoHandlerError, get_rfc_content_length, 2549)
```

如上，我们动态地修改了`request.urlopen()`这个标准库函数的运行时实现——这就是所谓的[Monkey Patch](http://en.wikipedia.org/wiki/Monkey_patch)，在某些特定的场合，也称作代码的“热修补”。其后我们自己的`get_rfc_content_length()`在调用`urlopen()`时，都会去使用这个新的`urlopen()`实现，也就是对任何参数都直接返回`None`。

`NoHandlerError`抛出，用例通过。看上去，Monkey Patch简洁高效地帮助我们完成了单元测试的任务：

* 我们需要测试的一个函数依赖另一个现成的模块实现。
* 这个模块中某些方法的行为方式不是我们想要的。我们也许故意想要它抛出某个异常（在测试时模拟可能发生的现实情形），也许不想要它在测试时去访问网络（直接返回一个我们预定的response即可）。
* 因此，我们可以通过Monkey Patch的方式去动态地（在运行时）修改这个模块中的方法。

__（如果你稍微懂一点Python或其他动态语言的工作方式，你应该已经看出来上面这段代码是有严重缺陷的。不过让我们先继续下去）__

照葫芦画瓢，我们还可以修改`request.urlopen()`让它无论何时都抛出一个`URLError`：

```python
def test_0(self):
    """
    Test if a network problem exists
    A URLError should be raised.
    """
    
    def fake_urlopen(*args, **kwargs):
        raise error.URLError('simulating network problem')
    
    request.urlopen = fake_urlopen
    
    self.assertRaises(error.URLError, get_rfc_content_length, 2549)
```

根据我们的要求，`get_rfc_content_length()`应当能够在网络连接（包括DNS解析）出现问题时（也就是`request.urlopen`抛出`URLError`时），同样抛出`URLError`。这符合规格；运行测试，用例通过。



## 2) Monkey Patch和动态语言的执行方式

```python
def test_0(self):
    assert get_rfc_content_length(2549) == 17833
```

现在，假设我们事先并不知道RFC2549文档的大小是17833字节，我们也并不关心这个具体的数值是多少（这个HTML文档的大小也可能会发生变化，我们并不知道）；我们只想测试`get_rfc_content_length()`能否根据HTTP response headers的内容正确地返回`Content-Length`，因此，我们可以把`urlopen()`返回的`Content-Length`强制地手动篡改为一个我们设定的固定数值（比如1024），然后去测试这个人为给定的返回值。借助于Monkey Patch手段，我们的___第一直觉___是可以这么做：让我们自己Monkey Patch的`urlopen()`首先去调用标准库的`urlopen()`实现，修改其response headers中的`Content-Length`后再返回这个经“篡改”后的response。

```python
def test_1_wrong(self):
    
    def fake_urlopen(*args, **kwargs):
        response = request.urlopen(*args, **kwargs)
        response.headers.replace_header('Content-Length', '1024')
        return response
    
    request.urlopen = fake_urlopen
    
    assert get_rfc_content_length(2549) == 1024
```

按照我们从静态函数式语言（诸如ML）中培养出来的直觉，函数`fake_urlopen()`定义中出现的`request.urlopen`应该首先是同标准库的实现绑定，相当于闭包中的“环境”部分；在`fake_urlopen()`的定义结束之后，才发生了对`request.urlopen`的修改。

不过，在Python这样的动态语言中显然并不是这样。对`request.urlopen`的热修补同时也修改了上下文中对该方法的引用，所以这实际上形成了一个导致解释器出错的无限递归结构：

    RuntimeError: maximum recursion depth exceeded

在Python中，为了正确地调用标准库的`request.urlopen`，需要一个简单的workaround，即将其值预先赋予另一个变量，这样在后文就可以保证能够正确地调用对原函数的引用，而不受任何后期Monkey Patch动态运行时修改的影响：

```python
def test_1(self):
    real_urlopen = request.urlopen
    
    def fake_urlopen(*args, **kwargs):
        response = real_urlopen(*args, **kwargs)
        response.headers.replace_header('Content-Length', '1024')
        return response
    
    request.urlopen = fake_urlopen
    
    assert get_rfc_content_length(2549) == 1024
```



## 3) Monkey Unpatch

在保留以上`test_1`用例的前提下，如果我们想要测试`get_rfc_content_length()`在正常情况下（`urlopen()`返回的response headers未经篡改）能否正常工作，回到最初这条测试用例：

```python
def test_0(self):
    assert get_rfc_content_length(2549) == 17833
```

两条测试用例均可通过：

```
..
----------------------------------------------------------------------
Ran 2 tests in 0.592s

OK
```

然而，如果把最初的测试用例换一个函数名称：

```python
def test_2(self):
    assert get_rfc_content_length(2549) == 17833
```

就会发现该测试_神奇般_地失败了：

```
.F
======================================================================
FAIL: test_2 (tests.test.YouGetTests)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/home/soimort/Projects/you-get/tests/test.py", line 91, in test_2
    assert get_rfc_content_length(2549) == 17833
AssertionError

----------------------------------------------------------------------
Ran 2 tests in 0.654s

FAILED (failures=1)
make: *** [test] Error 1
```

事实上，这就是Python的Monkey Patch最大的陷阱所在：如果你忘记了恢复被修补的模块方法的原有行为，那么直到程序执行的生命周期结束，它将一直保留这个被修补的方法。原因在于__Python解释器为了保证执行的高效，所有在程序中出现的模块默认只载入一次__，也就是说，即使你在别处再次声明了：

```python
from urllib import request, error
```

Python也不会去尝试重新从标准库载入原来的（Monkey Patch之前的）代码。

因为Python的unittest执行是按照用例函数名称的ASCII先后顺序的（而不是通常如我们所想的那样按照定义顺序），这导致了如果你使用`test_0`作为测试用例名称，那么它的执行在`test_1`的Monkey Patch之前，会调用标准的`urlopen()`；如果你使用`test_2`作为测试用例名称，那么它的执行将在`test_1`的Monkey Patch之后，调用的将是Monkey Patched的`urlopen()`。

所以说，__如果让Monkey Patch的修补行为一直持续到程序执行结束并非我们本意的话，唯一良好的风格就是在使用完Monkey Patch之后立即恢复它原本的行为（即所谓的Monkey Unpatch）__：

<div class="highlight"><pre><code class="python"><span class="k">def</span> <span class="nf">test_1</span><span class="p">(</span><span class="bp">self</span><span class="p">):</span>
    <span class="n">real_urlopen</span> <span class="o">=</span> <span class="n">request</span><span class="o">.</span><span class="n">urlopen</span>

    <span class="k">def</span> <span class="nf">fake_urlopen</span><span class="p">(</span><span class="o">*</span><span class="n">args</span><span class="p">,</span> <span class="o">**</span><span class="n">kwargs</span><span class="p">):</span>
        <span class="n">response</span> <span class="o">=</span> <span class="n">real_urlopen</span><span class="p">(</span><span class="o">*</span><span class="n">args</span><span class="p">,</span> <span class="o">**</span><span class="n">kwargs</span><span class="p">)</span>
        <span class="n">response</span><span class="o">.</span><span class="n">headers</span><span class="o">.</span><span class="n">replace_header</span><span class="p">(</span><span class="s">&#39;Content-Length&#39;</span><span class="p">,</span> <span class="s">&#39;1024&#39;</span><span class="p">)</span>
        <span class="k">return</span> <span class="n">response</span>

    <span class="n">request</span><span class="o">.</span><span class="n">urlopen</span> <span class="o">=</span> <span class="n">fake_urlopen</span>

    <span class="k">assert</span> <span class="n">get_rfc_content_length</span><span class="p">(</span><span class="mi">2549</span><span class="p">)</span> <span class="o">==</span> <span class="mi">1024</span>

    <span style="border: 1px solid #FF0000"><span class="n">request</span><span class="o">.</span><span class="n">urlopen</span> <span class="o">=</span> <span class="n">real_urlopen</span>
</code></pre></span>
</div>



## 总结

* Monkey Patch运行时代码修补的作用域__不是__当前代码段或当前模块，而是从修补发生以后直到程序生命期结束的__全局范围__。虽然使用同样的`=`操作符，但这与Python中对象的传递有着本质上的不同。

* 你可以在修补之后选择不恢复原代码（不做Monkey Unpatch）。问题是，怎样知道这样做是否你的本意？对于其他模块开发者来说，这破坏了原函数方法的预期行为。

* 所以，良好的风格是__牢记__在每次Monkey Patch之后，恢复原代码的初始行为（总是做Monkey Unpatch）。就像在C中使用指针前__牢记__要先初始化，在C++中使用完对象之后__牢记__要回收内存，这些需要程序员“牢记”的部分，实际上都是程序设计中容易导致开发低效和易出错的pitfalls。

* 从整体上来看，Python的核心开发者是一贯抵制Monkey Patch这种手段的。（“Dirty workaround”）

* 个人看法，Monkey Patch和全局变量、`goto`语句一样，总有一天会被证明是“有用而无益”的程序设计实践。（尽管它们有时确实能够在小处提供一些方便，正如本文中所描述的这个简单的例子那样）
