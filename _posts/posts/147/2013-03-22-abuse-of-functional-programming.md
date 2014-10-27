---
layout: post
uri: /posts/147
permalink: /posts/147/index.html
title: 如何在Python中滥用函数式编程（误）
category:
tag:
description:
disqus: false
lang: zh
---

YouTube最近又升级了前端页面的代码，于是以前用来匹配视频源地址的正则失效了。

幸好YouTube还有一个用于embed视频的公共API（get\_video\_info），通过它同样可以解析出视频的源地址。既然是API嘛，肯定比直接拿正则去搞HTML要靠谱。

不过，这个API的格式居然既不是JSON也不是XML——所以我需要自己写一个parser去解析它。

所谓parsing，本质上是从一段plain text构造出一个相应的数据结构的过程（在这里是Python中的dictionary）。在写了一堆意味不明的临时变量之后，我意识到我完全可以避开这些冗余的赋值，借助list comprehension和匿名函数来直接构造出整个dict。

最后，我发现我写出来的是这样的代码：

（<https://github.com/soimort/you-get/blob/master/src/you_get/downloader/youtube.py>）

```python

def parse_video_info(raw_info):
    """Parser for YouTube's get_video_info data.
    Returns a dict, where 'url_encoded_fmt_stream_map' maps to a sorted list.
    """
    
    # Percent-encoding reserved characters, used as separators.
    sepr = {
        '&': '%26',
        ',': '%2C',
        '=': '%3D',
    }
    
    # fmt_level = {'itag': level, ...}
    # itag of a higher quality maps to a lower level number.
    # The highest quality has level number 0.
    fmt_level = dict(
        zip(
            [str(codec['itag'])
                for codec in
                    youtube_codecs],
            range(len(youtube_codecs))))
    
    # {key1: value1, key2: value2, ...,
    #   'url_encoded_fmt_stream_map': [{'itag': '38', ...}, ...]
    # }
    return dict(
        [(lambda metadata:
            ['url_encoded_fmt_stream_map', (
                lambda stream_map:
                    sorted(
                        [dict(
                            [subitem.split(sepr['='])
                                for subitem in
                                    item.split(sepr['&'])])
                            for item in
                                stream_map.split(sepr[','])],
                        key =
                            lambda stream:
                                fmt_level[stream['itag']]))
                (metadata[1])]
            if metadata[0] == 'url_encoded_fmt_stream_map'
            else metadata)
        (item.split('='))
            for item in
                raw_info.split('&')])

```

![](http://static.tieba.baidu.com/tb/editor/images/tsj/t_0027.gif)
