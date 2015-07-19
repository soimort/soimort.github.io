</section><section id="FIN">

***

<footer>
[Comment on GitHub](https://github.com/%{github-user}/%{github-repo}/blame/master/%{id}/%{source}) or [via email](javascript:cmdEmail();).

Unless otherwise stated, the content of this article is dedicated to the public domain. No rights reserved.
</footer>

⁂

<!-- initialize page-wide metadata (for use in JavaScript) -->
:meta

<!-- initialize page-wide style -->
```:css
body { background-image: url('/images/laugh-now.png'); }
@media (max-width: 1023px), (max-height: 575px), (orientation: portrait), print {
  body { background-image: none; }
}
```

<!-- initialize page-wide UI -->
<div id="DROPDOWN"></div>
<div id="HUD">

| Command | Description | Command | Description | Command | Description |
| :-----: | :---------: | :-----: | :---------: | :-----: | :---------: |
| [g](:kbd) | Back to top  | [t](:kbd) [:toc](:samp) | Go to TOC | [A](:kbd) [:about](:samp) | About me
| [h](:kbd) | Scroll left  | [r](:kbd) [:ref](:samp) | Go to references | [F](:kbd) [:feed](:samp) | My feed
| [j](:kbd) | Scroll down  | [:goto#foo](:samp) | Go to section | [:github](:samp) | My GitHub
| [k](:kbd) | Scroll up    | [:goto!#foo](:samp) | Anchor to section | [:source](:samp) | View source
| [l](:kbd) | Scroll right | [S](:kbd) [:goog](:samp) | Search selected text (on Google) | [:bib](:samp) | View bibliography
| [+](:kbd) | Zoom in      | [D](:kbd) [:duck](:samp) | (on DuckDuckGo) | [:blame](:samp) | Blame me
| [-](:kbd) | Zoom out     | [W](:kbd) [:wiki](:samp) | (on Wikipedia) | [:email](:samp) | Email me |
| [:](:kbd) | Console      | [T](:kbd) [:trans](:samp) | Translate selected text | [:tweet](:samp) | Tweet this |
| [?](:kbd) [:help](:samp) | Show help | [H](:kbd) [:home](:samp) | Home | [:print](:samp) | Print this |

Press [Esc](:kbd) to close this message.

</div>

```:html
<div id="CONSOLE">
  <code id="CONSOLE-CODE">:</code>
</div>
<div id="TOOLBAR">
  <i id="BUTTON-HOME" title="Home &lt;H&gt;" class="fa fa-home"></i><br />
  <i id="BUTTON-ABOUT" title="About me &lt;A&gt;" class="fa fa-user"></i><br />
  <i id="BUTTON-FEED" title="Subscribe to my feed &lt;F&gt;" class="fa fa-rss-square"></i><br />
  <i id="BUTTON-GITHUB" title="Follow me on GitHub" class="fa fa-github-square"></i><br />
  <i id="BUTTON-SOURCE" title="View Source" class="fa fa-file-code-o"></i><br />
  <i id="BUTTON-BIB" title="View Bibliography" class="fa fa-book"></i><br />
  <i id="BUTTON-BLAME" title="Blame me" class="fa fa-comments"></i><br />
  <i id="BUTTON-EMAIL" title="Email me" class="fa fa-envelope-o"></i><br />
  <i id="BUTTON-TWEET" title="Tweet this" class="fa fa-retweet"></i><br />
  <i id="BUTTON-PRINT" title="Print this" class="fa fa-print"></i><br />
  <i id="BUTTON-HELP" title="Help &lt;?&gt;" class="fa fa-question-circle"></i><br />
  <div id="TOOLBAR-NAVIGATOR">
    <div id="BUTTON-CENTER">
      <i title="" class="fa fa-desktop"></i>
    </div>
    <div id="BUTTON-UP">
      <i title="Up &lt;k&gt;" class="fa fa-chevron-up"></i>
    </div>
    <div id="BUTTON-DOWN">
      <i title="Down &lt;j&gt;" class="fa fa-chevron-down"></i>
    </div>
    <div id="BUTTON-LEFT">
      <i title="Left &lt;h&gt;" class="fa fa-chevron-left"></i>
    </div>
    <div id="BUTTON-RIGHT">
      <i title="Right &lt;l&gt;" class="fa fa-chevron-right"></i>
    </div>
  </div>
</div>
```

## %{citations}

<!-- start references & footnotes -->
<!-- DO NOT REMOVE THIS COMMENT, otherwise section will not be wrapped! -->
