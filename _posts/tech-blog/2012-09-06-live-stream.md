---
layout: post
category: tech-blog
title: YouTube Live Stream直播视频的下载
description: 
disqus: true
---

上周在[YouTube Live](http://www.youtube.com/live)上看了[AKB48劇場 前田敦子卒業公演](https://plus.google.com/+AKB48/posts/giJESU7pbcT)的直播，顺便研究了一下这个问题。

开学这一阵子琐事比较多……不过今天终于还是决定把这篇东西发出来了。

## 什么是[YouTube Live Stream](http://www.youtube.com/live)

简单地讲，就是YouTube提供的[视频节目播送](http://en.wikipedia.org/wiki/Webcast)（broadcasting）服务。与YouTube通常提供的那些视频分享不同，Live Stream是限时播放的，所以你可以把它类比成电视节目之类的东西。

YouTube提供的[Live Stream服务](http://www.youtube.com/live)在全球范围内被广泛用于视频节目的网络播送，但在德国除外，原因是在一个叫做[GEMA](http://en.wikipedia.org/wiki/Gesellschaft_f%C3%BCr_musikalische_Auff%C3%BChrungs-_und_mechanische_Vervielf%C3%A4ltigungsrechte)的邪恶组织操纵下，德国据说制定了一项规定“任何（潜在可能）超过300人观看的播送类节目都必须事先取得许可否则将处以50万欧元的巨额罚款”的脑残法律，导致没打赢官司的Google直接封杀了从德国境内对YouTube Live Stream的访问。（幸好我没在德国上学，不然也要翻墙才能看直播了……）

任何人都可以在YouTube Live Stream上[创建自己的live event](http://support.google.com/youtube/bin/static.py?hl=en&topic=2474327&guide=2474025&page=guide.cs&answer=2523404)，向全世界播放自己定制的视频节目。（只要你高兴，你也可以用它来发表“Remember, remember, the fifth of November”这样的演说，虽然很多人只是拿它来直播游戏比赛而已……）

## Live Stream的工作机理

### 流媒体协议和HTTP

在很久以前，网络上的[流媒体](http://en.wikipedia.org/wiki/Streaming_media)一般是通过专门的应用层协议来实现的。这样的协议主要包括：标准[TCP/IP](http://en.wikipedia.org/wiki/Internet_protocol_suite)应用层上的实时串流协议[RTSP（Real Time Streaming Protocol）](http://en.wikipedia.org/wiki/Real_Time_Streaming_Protocol)和与之协同工作的实时传输协议[RTP（Real-time Transport Protocol）](http://en.wikipedia.org/wiki/Real-time_Transport_Protocol)、实时传输控制协议[RTCP（Real-time Transport Control Protocol）](http://en.wikipedia.org/wiki/Real-time_Transport_Control_Protocol)，微软提出的[MMS（Microsoft Media Server）](http://en.wikipedia.org/wiki/Microsoft_Media_Server)协议，以及Macromedia提出的[RTMP（Real Time Messaging Protocol）](http://en.wikipedia.org/wiki/Real_Time_Messaging_Protocol)协议，等等。

如今，由于Web在Internet技术中占据了绝对地位，由用户直接通过这些协议来访问流媒体的情况几乎已经没有了。现在的流媒体应用，无一例外是以浏览器所支持的HTTP协议为基础的。

### 1. 实时串流协议[RTSP（Real Time Streaming Protocol）](http://en.wikipedia.org/wiki/Real_Time_Streaming_Protocol)

作为标准TCP/IP协议栈应用层上的流媒体协议，RTSP是运行在RTP和RTCP这两个传输协议上的。

RTP和RTCP又是基于传输层上的用户数据包协议[UDP（User Datagram Protocol）](http://en.wikipedia.org/wiki/User_Datagram_Protocol)而实现。媒体流被切分成小的数据包进行传输，这意味着它的实现简单而且高效，但是却没有相应的数据完整性确保和纠错机制，需要靠应用程序自身来验证接收数据的完整性。

RTSP是一种比较古老的流媒体协议，今天的应用并不特别广泛。

### 2. 实时通信协议[RTMP（Real Time Messaging Protocol）](http://en.wikipedia.org/wiki/Real_Time_Messaging_Protocol)

RTMP是不同于RTSP的另一种应用层流媒体协议，它最初由Macromedia制定并持有专利，用来实现客户端Flash播放器和远程服务器之间的媒体流传输。

在Macromedia被Adobe收购之后，该协议的一部分规范已经公开了出来。

不同于基于用户数据包协议UDP进行传输的RTP和RTCP，RTMP在传输层上基于“可信的”传输控制协议[TCP（Transmission Control Protocol）](http://en.wikipedia.org/wiki/Transmission_Control_Protocol)。这意味着对于每一个字节的数据，协议都将确保其被完整正确地送达，但这同时也增加了超时、重试和重新传输的时间开销，为了保证流媒体播放速率的流畅，常常需要进行一定的缓冲。这造成了RTMP在实现上也较RTSP为复杂。

前面已经说过，现在Web上的流媒体应用均是通过HTTP来进行访问的。因此就有了RTMP的一个基于HTTP隧道的衍生版本协议：[RTMPT](http://en.wikipedia.org/wiki/Real_Time_Messaging_Protocol#HTTP_tunneling)。在该协议中，数据被封装后藉由HTTP传输，并映射到服务器的80端口（标准HTTP端口）。在通讯时，隧道将会通过HTTP发送包含[AMF](http://en.wikipedia.org/wiki/Action_Message_Format)格式数据的POST请求，以此实现对流媒体的传输控制。

最重要的实现RTMP协议的客户端软件，自然是地球人都知道的[Adobe Flash Player](http://en.wikipedia.org/wiki/Adobe_Flash_Player)。正是得益于这种机制（RTMP协议和AMF数据格式），我们才能够在基于HTTP的Web浏览器上通过Flash Player观看各种网站上的FLV视频、直播，而无需关心背后具体的流媒体协议是什么。

为什么在这里着重介绍RTMP协议呢？原因很简单：RTMP正是YouTube Live Stream所使用的流媒体协议。我们在设置Live Stream的编码器的时候，实际上就是在把编码器所输出的流媒体源连接到Google的服务器，于是这样就实现了从任意媒体流到YouTube的播送。YouTube官方推荐的编码器主要有两种：Wirecast和Flash Media Live Encoder（FMLE），这两种编码器都支持RTMP协议的输出。

简而言之，由于Flash在Web平台上的大行其道，目前RTMP的应用范围较广。它也正是YouTube Live Stream目前所支持的主要流媒体协议。

### 3. [自适应比特率流（Adaptive Bitrate Streaming）](http://en.wikipedia.org/wiki/Adaptive_bitrate_streaming)与[HTTP Live Streaming](http://en.wikipedia.org/wiki/HTTP_Live_Streaming)

下面就要说到本文的重点，即不同于RTSP和RTMP的第三种形式的流媒体技术： [自适应比特率流（Adaptive Bitrate Streaming）](http://en.wikipedia.org/wiki/Adaptive_bitrate_streaming)。

自适应比特率流是纯基于HTTP的技术。它的优越之处不仅在于使用了通用的HTTP协议，更在于它可以根据用户的带宽和CPU处理能力实时地调整传输媒体流的编码和画质（比特率），这要求编码器具有将源媒体流内容同时编码成不同比特率的能力。从细节实现上来说，通过HTTP传输的媒体流提供了各种从低画质到高画质不同比特率的版本，每一个版本的媒体流都被切割成许多小片段（一个典型的片段长度一般在2秒到10秒之间）。媒体流的客户端将自动检测网络速度并下载与之相匹配的比特率流片段，一旦检测到下载速度高于当前媒体流片段的比特率，客户端会转而下载更高画质（比特率）的媒体流；反之，则下载较低画质（比特率）的媒体流。顾名思义，这就是所谓的“自适应比特率”了。

下面的两张图很好地解释了自适应比特率流的工作原理：（摘自维基百科）

<img src="http://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Adaptive_streaming_overview_daseddon_2011_07_28.png/660px-Adaptive_streaming_overview_daseddon_2011_07_28.png" width="100%"/>

<img src="http://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Adaptive_streaming_overview_bit_rates_2011_07_28.png/660px-Adaptive_streaming_overview_bit_rates_2011_07_28.png" width="100%"/>

不难看出，自适应比特率流的好处是双向的：对于用户来说，总是能够在当前网络带宽和客户端环境的限制下观看到最高画质的视频；对于服务的提供者来说，通过[CDN（Content delivery network，内容分发网络）](http://en.wikipedia.org/wiki/Content_delivery_network)将来自源服务器的媒体流分发到边界服务器上进行缓存，用户的客户端直接通过HTTP协议访问这些边界服务器，大大地节约了服务器的软件许可证成本（因为这些边界服务器只需运行简单的HTTP服务器，用于视频编码的昂贵软件诸如Adobe Flash Media Streaming Server是部署在中心服务器上的）。

把媒体流切分成小的数据包这一工作机理跟前面提到过的RTSP/RTP很相似，但和基于UDP进行传输的RTSP/RTP所不同的是，自适应比特率流使用HTTP，因此可以穿过任何允许HTTP数据通过的防火墙或代理。

自适应比特率流这项技术由Move Networks公司持有专利，具体的实现有Adobe的Dynamic Streaming，Apple的[HTTP Live Streaming](http://en.wikipedia.org/wiki/HTTP_Live_Streaming)和Microsoft的Smooth Streaming等。在此简单地介绍一下Apple的HTTP Live Streaming（简称HLS），我们将在后面看到它在YouTube Live Stream中的应用。

Apple提出的[HTTP Live Streaming](http://en.wikipedia.org/wiki/HTTP_Live_Streaming)，本身是QuickTime X和iOS的软件系统组成部分。它的实现基于自适应比特率流的工作原理，不再赘述。在每次媒体流会话开始的时候，一个[M3U播放列表](http://en.wikipedia.org/wiki/M3U)将被下载，它包含了不同比特率媒体流的元信息。这个M3U文件是至关重要的（我们将会在后面进行具体下载的时候遇到）。

## 抓取一个YouTube Live Stream！

说了这么多空泛的理论，现在，来实际尝试着下载一个YouTube的Live Stream视频吧。

### 下载基于RTMP协议的媒体流

前面提到过，YouTube Live Stream上的直播，大部分是基于RTMP协议实现的。原因之一在于，Adobe的Flash技术对Live媒体流的支持已经非常成熟（[Flash Media Live Encoder](http://www.adobe.com/products/flash-media-encoder.html)）。

另一方面，用脚本来实现YouTube上任意视频的下载非常简单，只需从视频信息页的元数据中解析出`url_encoded_fmt_stream_map`的值，就得到了可直接用于下载的真实地址。（估计是YouTube也意识到了通过各种技术手段限制下载是徒劳无功的，只要浏览器能看到视频，就永远也无法阻止人们用Python伪装成浏览器的客户端来下载视频……）

你可以用[You-Get](http://pypi.python.org/pypi/you-get)（使用Python 3）或者[youtube-dl](http://rg3.github.com/youtube-dl/)（使用Python 2）这些专门的下载工具来检测某个YouTube视频能否下载。嗯，这里当然还是用我自己的You-Get：

<img src="http://i.imgur.com/mvD0T.jpg" width="80%"/>

这是一个YouTube Live Stream的直播页面。你可以看到，它和一般的YouTube视频几乎没什么差别，同样可以直接解析出真实的URL用于下载。不妨拿它和一个普通YouTube视频比较一下：

<img src="http://i.imgur.com/tNm9l.jpg" width="80%"/>

有两点特别值得注意：1、Live Stream的媒体容器类型总是[FLV（video/x-flv）](http://en.wikipedia.org/wiki/Flash_Video)，这是由YouTube Live本身使用基于RTMP协议的Flash编码器决定的。而普通YouTube视频的容器可以是WebM、MP4、FLV或3GP这几种类型中的任意一种；2、Live Stream的大小几乎总是2048MB，这貌似是由Flash编码器总把一个特定时间段的视频编码成固定大小决定的（？）。

如果所有的YouTube Live Stream都像文档中所说的那样确实[采用了基于RTMP协议的Flash流媒体](http://support.google.com/youtube/bin/static.py?hl=en&topic=2474327&guide=2474025&page=guide.cs&answer=1723080)进行编码，这意味着它们都可以直接解析出一个单一的URL来下载，那么这篇文章就没有存在的必要了。现在来看看我所遇到的另外一种情况。

### 下载基于HTTP Live Streaming的媒体流

（注意：在直播结束后这个视频的状态已经变成了private，现在不能再用它来做测试。包括下文提到的所有URL均已失效。）

* 视频页面：<http://www.youtube.com/watch?v=UCW6kKNJ8cw> 

* `get_video_info`信息：<http://www.youtube.com/get_video_info?&video_id=UCW6kKNJ8cw>

直播开始后，试了一下You-Get，发现不能像之前测试过的其它Live Stream一样直接下载。原因是在`get_video_info`中解析到的`url_encoded_fmt_stream_map`这一项是空的：

    "url_encoded_fmt_stream_map": ""

真正的视频地址在哪儿呢？注意到元数据中还有另外一项叫做`hlsvp`：

    "hlsvp": "http://www.youtube.com/api/manifest/hls_variant/upn/
    DBd_eJivWi0/sparams/id,ip,ipbits,maudio,playlist_type,pmbypass
    ,expire/playlist_type/LIVE/maudio/1/ip/85.30.32.34/ipbits/8/si
    gnature/CAC5E3A176930C924A125F7695730D89F519359C.CE80CCDF06F59
    D6F2FFADEF88E6649C81E4BEDF4/sver/3/source/yt_live_broadcast/ex
    pire/1346084679/key/yt1/pmbypass/yes/id/5025ba90a349f1cc/file/
    index.m3u8"

前面说过，Apple的HTTP Live Streaming采取了自适应比特率流的工作方式，不同比特率媒体流的元信息会通过一个扩展M3U播放列表来进行传输。所以，不出意外，这是一个典型的HTTP Live Streaming实例。当然，这些流媒体协议之类的东西，我当时是不知道的。我所能知道的，就是这只是一个M3U播放列表而已……

这个`index.m3u8`其实是一个包含了更多播放列表的播放列表（注意`.m3u8`是一个标准的扩展名，最后的“8”代表该M3U文件使用UTF-8编码）：

<script src="https://gist.github.com/3621651.js?file=gistfile1.sh"></script>

从注释就很容易看懂了，这里的每一个M3U播放列表对应每一种带宽限制对应的视频编码方式（这里一律都是视频编码[H.264/MPEG-4 AVC](http://en.wikipedia.org/wiki/H.264/MPEG-4_AVC) + 音频编码[MPEG4-AAC](http://en.wikipedia.org/wiki/Advanced_Audio_Coding)）和分辨率（从72p到720p均有），用于客户端自动匹配当前带宽范围内最适宜的比特率媒体流。

我们选择720p的媒体流，下载与之对应的M3U播放列表：

http://www.youtube.com/api/manifest/hls_playlist/id/5025ba90a349f1cc/  
itag/95/source/yt_live_broadcast/ratebypass/yes/cmbypass/yes/playlist  
_type/LIVE/maudio/1/pmbypass/yes/upn/Rwg0UFeZvSM/sver/3/ip/85.30.32.3  
4/ipbits/8/expire/1346084679/sparams/ip,ipbits,expire,id,itag,source,  
ratebypass,cmbypass,playlist_type,maudio,pmbypass/signature/13694295F  
515B7A54C50A4E4CC74287D325506A7.7E5106F9BBC81C855CFB7DBB8E9EF1E2D35E5  
FCD/key/ck1/file/index.m3u8

Linux下的播放器软件中，GNOME的Totem Movie Player是支持M3U播放列表的。用Totem直接打开这个`.m3u8`文件，就可以和在浏览器中一样观看YouTube Live Stream的直播了。（不过因为是硬性选择了720p媒体流的M3U，我这鬼地方的网速不给力所以延迟比较明显……如果使用比特率自适应的`index.m3u8`来播放，应该会比较流畅）

<img src="http://i.imgur.com/kAcvM.jpg" width="100%"/>

这个M3U文件的内容包含以下5个长度为数秒的视频小片段的URL，用于客户端（浏览器或者Totem播放器）播放时缓冲：

<script src="https://gist.github.com/3621846.js?file=gistfile1.sh"></script>

隔几秒种再抓取一下这个文件，发现列表内容更新了：

<script src="https://gist.github.com/3622157.js?file=gistfile1.sh"></script>

显而易见，这些流媒体片段是一个连续的序列，视频片段URL的模式完全一致，只有`sq/`后面的片段序号和最后的`dur`参数存在差别（这个用于指定片段长度的参数并不是必须的）。

事情到了这一步开始变得异常简单，我们可以直接通过遍历URL来下载这些片段了：

    download_urls(['http://redirector.c.youtube.com/videoplayback\
    /id/5025ba90a349f1cc/itag/95/source/yt_live_broadcast/sq/' + \
    str(id) + '/file/seg.ts?ratebypass=yes&cmbypass=yes&playlist_\
    type=LIVE&maudio=1&pmbypass=yes&upn=Rwg0UFeZvSM&sver=3&ip=85.\
    30.32.34&ipbits=8&expire=1346084679&sparams=ip,ipbits,expire,\
    id,itag,source,ratebypass,cmbypass,playlist_type,maudio,pmbyp\
    ass&signature=13694295F515B7A54C50A4E4CC74287D325506A7.7E5106\
    F9BBC81C855CFB7DBB8E9EF1E2D35E5FCD&key=ck1&live=1' \
    for id in range(0, 3000)])

当然，这么做其实是有问题的。因为我们绕过了直播过程中流媒体的M3U渐进缓冲序列，直接试图一次批量下载全部可能的URL，这造成了可能我们在访问序列中的某个视频时，实际上这个资源当前还不存在（因为是直播嘛，你当然不可能在还没有播放到某个时间点的时候就穿越去下载未来的片段。。。）

这可能会导致一个“404 Not Found”或者“Name or service not known”之类的错误。解决方案是不要直接裸下URL，而是通过重复抓取M3U播放列表、获取当前可用的视频片段来对其循序渐进地下载（模仿浏览器或播放器的工作方式）。M3U文件中的`EXT-X-MEDIA-SEQUENCE`也就是播放列表中第一个片段（当前缓冲片段）的序号，该片段URL前注释里的`EXTINF`或URL中的`dur`参数指示了其长度，以这个长度进行延时后，重新抓取一次M3U列表就可以确保得到下一个视频片段。以此类推，可以抓取到所有的视频片段。这在Python中实现起来很容易，不再赘述。

<img src="http://i.imgur.com/SzkHG.jpg" width="80%"/>

可以知道，这些视频片段的媒体容器是[MPEG-2 Transport Stream（video/mp2t）](http://en.wikipedia.org/wiki/MPEG_transport_stream)，所以文件的扩展名保存为`.ts`。

<img src="http://i.imgur.com/DOdYb.jpg" width="80%"/>

研究出这个Live Stream到底是怎么一回事以后，边看直播边调试脚本，赶在直播结束视频地址失效之前，我这的渣网速竟然能把主要部分都抓下来了（2000个片段，3.6GB，全长约3小时左右）。下一步要做的是……

### 合并视频片段

当然，一提到合并视频，就不能不提到处理多媒体文件的神器：[FFmpeg](http://ffmpeg.org/)。

但是，我们其实有一个更简单的方法：直接把这些片段文件连接起来！（以下代码适用于Unix环境）

{% highlight python linenos %}
import os
for id in range(800, 2800):
    if os.path.isfile('%s.ts' % id):
        print('Merging %s.ts ...' % id)
        os.system('cat %s.ts >> full.ts' % id)
{% endhighlight %}

用于网络流媒体传输的[MPEG-2 TS](http://en.wikipedia.org/wiki/MPEG_transport_stream)是极少数能够通过直接连接文件来实现合并的多媒体容器之一（其它类似的格式还有DV，MPEG-1，和用于介质存储的[MPEG-2 PS](http://en.wikipedia.org/wiki/MPEG_program_stream)）。所以，不用劳烦FFmpeg了，直接把这2000个片段按先后顺序连接起来即可。

合并后的这个大的MPEG TS文件在Totem中的支持并不怎么好，时间轴好像有问题。在VLC中可以正常播放。当然，最好是stream成更适合保存的格式诸如MPEG PS或者MP4、FLV，至于用VLC，FFmpeg，还是随便其它哪个支持MPEG TS格式的转换工具就任意了。

btw. 视频转码果然很烧GPU……(´д`;)

<img src="http://i.imgur.com/3XfPT.jpg" width="50%"/>

当然也不一定非要把所有片段全部连接成一个文件，可以按照需求任意合并。不多说了，总之请多多支持正版……

<img src="http://i.imgur.com/c3YWN.jpg" width="80%"/>

## 总结和未来工作

1. 基于RTMP协议的YouTube直播视频可以用任何YouTube下载工具直接下载，问题解决。

2. 基于HTTP Live Streaming的YouTube直播视频的下载，初步打算放到下个版本的[You-Get](http://www.soimort.org/you-get)中实现。目前最大的问题是测试起来可能会有困难，毕竟我在YouTube上面只见过这么一个应用HTTP Live Streaming的特例（难道说是因为这种协议比较高端洋气?），绝大多数直播还是基于RTMP协议的。（YouTube的官方文档上也只提到了RTMP Flash Stream。个人推测这次直播也许有Google的特殊支持……）

