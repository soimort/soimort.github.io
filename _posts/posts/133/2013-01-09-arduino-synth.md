---
layout: post
uri: /posts/133
permalink: /posts/133/index.html
title: 坑爹的课程项目之Arduino合成器
category:
tag:
description:
disqus: false
lang: zh
---

最近的拖延症愈发严重了。比如电路考试前一天晚上开始通宵预习，比如在线课程总是赶在作业截止时间前一天晚上通宵看完视频，比如实验课前一天晚上通宵补程序，诸如此类的。（喂喂其实从三年前起这毛病就一直没改好么）

然后是这个圣诞节前就布置下来的Arduino项目，周一要做presentation了居然拖到周日晚上才开始做，<del>真是都不知道自己平时在干嘛。。。</del>

虽然早就想好了要做一个合成器+MIDI sequencer，实现以下种种功能：

* 用USB键盘作为输入（通过一个USB shield）。
* 借助MIDI shield合成音频并输出。
* Arduino与计算机进行串口通信，能够输出MIDI序列。
* 在计算机上实现MIDI序列的可视化。（Java + Processing或Node.js + Processing.js）
* 把“计算机”从笔记本替换成Raspberry Pi。

结果因为只剩下一个晚上的时间，根本连一项功能也没实现(´д`;)

因为这门课程项目的打分只有G（通过）和U（不通过）两个等级，要求很简单：

1. 有Input / Output。
2. 有A/D转换。
3. 有中断。
4. （可选）用Processing可视化串口输出。

再看看自己手头现有的材料，最终决定做的坑爹项目如下：

1. 用触点传感器做输入，扬声器做输出。I/O有了。
2. 把传感器的按压位置对应到[音频的频率](http://www.arduino.cc/en/Tutorial/Melody)，A/D也有了。
3. 中断什么的加个按钮，按一下开始播放“两只老虎”。（音符和频率的转换参考了[这里](http://en.wikipedia.org/wiki/Note)）
4. Processing可做可不做。于是果断不做。

完成的代码在这里：<https://github.com/soimort/Arduino-Synth>

做展示的时候老师问我做这个东西用了多长时间，我说一个周末。。。

一个同学说他也告诉老师花了一个周末的时间其实他只花了五六个小时（其中写代码用了半个小时）

我就不好意思说我花了多长时间了wwwwww

最后把[幻灯片](/slides/101)放上来，为了赶时间做得有点高桥流：（Chrome和Firefox可以<a href="#" id="fullScreenButton">全屏模式观看</a>）



<style>
#wrapper {
    width: 100%;
    height: 800px;
    
    background-color: #000;
    background-image: url('http://i.imgur.com/d7hIM.jpg');
    border-radius: 8px;
}

#presentation {
    transform: scale(0.5, 0.5);
    -webkit-transform: scale(0.5, 0.5);
    -moz-transform: scale(0.5, 0.5);
    -o-transform: scale(0.5, 0.5);
    
    transform-origin: top right;
    -webkit-transform-origin: top right;
    -moz-transform-origin: top right;
    -o-transform-origin: top right;
    
    float: right;
    
    border-radius: 8px;
	box-shadow: 0 0 8px 0 #102040;
}
</style>

<div id="wrapper">
    <iframe id="presentation" src="/slides/101" width="200%" height="800px" webkitAllowFullScreen mozallowfullscreen allowFullScreen ></iframe>
</div>

<script>
// no mousewheel scrolling - not working in Firefox
$("#presentation").on("mousewheel DOMMouseScroll", function(e) {
    e.preventDefault();
});

// WebKit
document.addEventListener("webkitfullscreenchange", function () {
    if (document.webkitFullscreenElement)
        $('#presentation').css('transform','scale(1, 1)');
    else
        $('#presentation').css('transform','scale(0.5, 0.5)');
}, false);

// Firefox
document.addEventListener("mozfullscreenchange", function () {
    if (document.mozFullScreen)
        $('#presentation').css('transform','scale(1, 1)');
    else
        $('#presentation').css('transform','scale(0.5, 0.5)');
}, false);

function toggleFullScreen() {
    var elem = document.getElementById("presentation");
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
};

$("#fullScreenButton").click(function() {
    toggleFullScreen();
});

</script>

&nbsp;
