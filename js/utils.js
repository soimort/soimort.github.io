/* Ivoire theme (JavaScript part)
 * (designed for exclusive use on www.soimort.org)
 *
 * Version: 2015-07-20 (v0.1.1)
 * Author: Mort Yao <soi@mort.ninja>
 * Copyright: (C) 2015 Mort Yao
 */

/* Browser-Update.org script
 * tl;dr IE <=8 versions are not welcome */
var $buoop = {vs: {i: 8, f: 5, o: 12, s: 5.1, n: 12, c: 23}};
function $buo_f() {
  var e = document.createElement("script");
  e.src = "//browser-update.org/update.min.js";
  document.body.appendChild(e);
};
try { document.addEventListener("DOMContentLoaded", $buo_f, false) }
catch (e) { window.attachEvent("onload", $buo_f) }

/* Global variables */
var exMode = false;
var currentZoom = 100;
var origConsoleBottom, origDropdownTop;

/* Scroll to anchor when the document has finished loading */
document.onreadystatechange = function () {
  if (document.readyState == 'complete') {
    var uriPath = decodeURIComponent(location.href).split('/');
    var anchor = uriPath[uriPath.length - 1];
    if ($(anchor).length) {
      scrollTo($(anchor));
    }
  }
};

/* Initialize web fonts & UI effects */
$(function() {
  // initialize some global variables
  origConsoleBottom = $('#CONSOLE').css('bottom');
  origDropdownTop = $('#DROPDOWN').css('top');

  // load web fonts (by need)
  if (!isFontAvailable('PT Serif')) {
    WebFont.load({
      google: {
        families: ['PT Serif::latin']
      }
    });
  }

  // jQuery smooth scrolling
  // see <https://css-tricks.com/snippets/jquery/smooth-scrolling/>
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
        && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        scrollTo(target);
        location.href = this.hash;
        return false;
      }
    }
  });

  // set anchors on headings
  $('article h1,h2,h3,h4,h5,h6').hover(function() {
    $(this).append($('<span style="color:tan"> &sect;</span>'));
  }, function() {
    $(this).find('span:last').remove();
  });
  $('article h1,h2,h3,h4,h5,h6').click(function() {
    var anchor = '#' + $(this).parent().attr('id');
    if ($(anchor).length) {
      scrollTo($(anchor));
      location.href = anchor;
    }
  });

  // execute / close on click
  $('#CONSOLE').click(function() {
    execCommand($('#CONSOLE-CODE').text());
    cmdConsoleClose();
  });
  $('#DROPDOWN,#HUD').click(function() {
    cmdHelpClose();
  });
});

/* Initialize Toolbar */
$(function() {
  var hiddenTools = $('#BUTTON-SOURCE,#BUTTON-BIB,' +
                      '#BUTTON-BLAME,#BUTTON-EMAIL,' +
                      '#BUTTON-TWEET,#BUTTON-PRINT,#BUTTON-HELP');
  // hide some buttons on desktop screen
  if ($('#TOOLBAR').css('left') != '0px') {
    hiddenTools.css('visibility', 'hidden');
    hiddenTools.css('opacity', '0');
    $('#TOOLBAR-NAVIGATOR').css('visibility', 'hidden');
    $('#TOOLBAR-NAVIGATOR').css('opacity', '0');
  }

  $('#TOOLBAR').mouseenter(function() {
    hiddenTools.css('visibility', 'visible');
    hiddenTools.css('opacity', '1');
    if ($(window).width() >= 1280 && $(window).height() >= 480) {
      // show navigator only on a big screen
      // (not actually used)
      //$('#TOOLBAR-NAVIGATOR').css('visibility', 'visible');
      //$('#TOOLBAR-NAVIGATOR').css('opacity', '1');
    };
  });

  $('#TOOLBAR').mouseleave(function() {
    // hide some buttons on desktop screen
    if ($('#TOOLBAR').css('left') != '0px') {
      // no more animation - there's already CSS transition
      hiddenTools.css('visibility', 'hidden');
      hiddenTools.css('opacity', '0');
      $('#TOOLBAR-NAVIGATOR').css('visibility', 'hidden');
      $('#TOOLBAR-NAVIGATOR').css('opacity', '0');
    }
  });

  $('#BUTTON-HOME').click(function() { cmdHome(); });
  $('#BUTTON-ABOUT').click(function() { cmdAbout(); });
  $('#BUTTON-FEED').click(function() { cmdFeed(); });
  $('#BUTTON-GITHUB').click(function() { cmdGitHub(); });
  $('#BUTTON-SOURCE').click(function() { cmdSource(); });
  $('#BUTTON-BIB').click(function() { cmdBib(); });
  $('#BUTTON-BLAME').click(function() { cmdBlame(); });
  $('#BUTTON-EMAIL').click(function() { cmdEmail(); });
  $('#BUTTON-TWEET').click(function() { cmdTweet(); });
  $('#BUTTON-PRINT').click(function() { cmdPrint(); });
  $('#BUTTON-HELP').click(function() { cmdHelp(); });

  $('#BUTTON-CENTER i').css('cursor', 'default');
  $('#BUTTON-UP').click(function() { cmdUp(); });
  $('#BUTTON-DOWN').click(function() { cmdDown(); });
  $('#BUTTON-LEFT').click(function() { cmdLeft(); });
  $('#BUTTON-RIGHT').click(function() { cmdRight(); });
});

/* Initialize hotkeys */
$(function() {
  $("html").keydown(function(event) {
    if (exMode) {
      if (event.which == 8) { // backspace
        var text = $('#CONSOLE-CODE').text();
        $('#CONSOLE-CODE').text(text.substr(0, text.length - 1));
        if (text.length == 1) cmdConsoleClose();

      } else if (event.which == 27) { // escape
        cmdConsoleClose();

      }
    } else {
      if (event.which == 27) { // escape
        cmdHelpClose();
      }
    }
  });

  $("html").keypress(function(event) {
    if (exMode) {
      if (event.which == 13) { // enter
        execCommand($('#CONSOLE-CODE').text());
        cmdConsoleClose();

      } else if (event.which >= 32) { // printable character
        $('#CONSOLE-CODE').append(String.fromCharCode(event.which));
      }
      return;
    }

    switch (event.which) {
    case 'j'.charCodeAt():
      cmdDown(); break;

    case 'k'.charCodeAt():
      cmdUp(); break;

    case 'h'.charCodeAt():
      cmdLeft(); break;

    case 'l'.charCodeAt():
      cmdRight(); break;

    case 'g'.charCodeAt():
      scrollToTop(); break;

    case 'G'.charCodeAt():
      scrollToBottom(); break;

    case 't'.charCodeAt():
      if ($('#TOC').length) {
        scrollTo($('#TOC'));
      }
      break;

    case 'r'.charCodeAt():
      if ($('#citations').length) {
        scrollTo($('#citations'));
      }
      break;

    case 'S'.charCodeAt():
      cmdGoogle(); break;

    case 'D'.charCodeAt():
      cmdDuckDuckGo(); break;

    case 'W'.charCodeAt():
      cmdWikipedia(); break;

    case 'T'.charCodeAt():
      cmdTranslate(); break;

    case 'H'.charCodeAt():
      cmdHome(); break;

    case 'A'.charCodeAt():
      cmdAbout(); break;

    case 'F'.charCodeAt():
      cmdFeed(); break;

    case '+'.charCodeAt():
      cmdZoomIn(); break;

    case '-'.charCodeAt():
      cmdZoomOut(); break;

    case '?'.charCodeAt():
      cmdHelp(); break;

    case ':'.charCodeAt():
      cmdConsole(); break;

    }
  });
});

function execCommand(cmdText) {
  var cmd = cmdText.split(' ');
  var cmdName = cmd[0].substr(1);
  switch (cmdName) {
  case 'home': case 'H':
    cmdHome(); break;

  case 'about': case 'A':
    cmdAbout(); break;

  case 'feed': case 'F':
    cmdFeed(); break;

  case 'github':
    cmdGitHub(); break;

  case 'source':
    cmdSource(); break;

  case 'bib':
    cmdBib(); break;

  case 'blame':
    cmdBlame(); break;

  case 'email':
    cmdEmail(); break;

  case 'tweet':
    cmdTweet(); break;

  case 'print':
    cmdPrint(); break;

  case 'help': case 'h': case '?':
    cmdHelp(); break;

  case 'zoom-in': case '+':
    cmdZoomIn(); break;

  case 'zoom-out': case '-':
    cmdZoomOut(); break;

  case 'toc': case 't':
    if ($('#TOC').length) {
      scrollTo($('#TOC'));
    }
    break;

  case 'toc!': case 't!':
    if ($('#TOC').length) {
      scrollTo($('#TOC'));
      location.href = '#TOC';
    }
    break;

  case 'ref': case 'r':
    if ($('#citations').length) {
      scrollTo($('#citations'));
    }
    break;

  case 'ref!': case 'r!':
    if ($('#citations').length) {
      scrollTo($('#citations'));
      location.href = '#citations';
    }
    break;

  case 'google': case 'goog': case 'S':
    cmdGoogle(); break;

  case 'duckduckgo': case 'duck': case 'D':
    cmdDuckDuckGo(); break;

  case 'wikipedia': case 'wiki': case 'W':
    cmdWikipedia(); break;

  case 'translate': case 'trans': case 'T':
    cmdTranslate(); break;

  default:
    if (cmdName.split('#')[0] == 'goto') {
      // command: goto
      var anchorName = cmdName.split('#')[1];
      if (anchorName && $('#' + anchorName).length) {
        scrollTo($('#' + anchorName));
      }
    } else if (cmdName.split('#')[0] == 'goto!') {
      // command: goto!
      var anchorName = cmdName.split('#')[1];
      if (anchorName && $('#' + anchorName).length) {
        scrollTo($('#' + anchorName));
        location.href = '#' + anchorName;
      }
    }
  }
}

function cmdHome() {
  location.href = '/';
}

function cmdAbout() {
  location.href = '/about';
}

function cmdFeed() {
  location.href = '/atom.xml';
}

function cmdGitHub() {
  if (_meta['github-user']) {
    location.href = 'https://github.com/' + _meta['github-user'];
  }
}

function cmdSource() {
  if (_meta['github-user'] && _meta['github-repo'] &&
      _meta['id'] && _meta['source']) {
    window.open('https://github.com/' + _meta['github-user'] +
                '/' + _meta['github-repo'] +
                '/blob/master/' + _meta['id'] +
                '/' + _meta['source']);
  }
}

function cmdBib() {
  if (_meta['github-user'] && _meta['github-repo'] &&
      _meta['id'] && _meta['source-bibliography']) {
    window.open('https://github.com/' + _meta['github-user'] +
                '/' + _meta['github-repo'] +
                '/blob/master/' + _meta['id'] +
                '/' + _meta['source-bibliography']);
  }
}

function cmdBlame() {
  if (_meta['github-user'] && _meta['github-repo'] &&
      _meta['id'] && _meta['source']) {
    window.open('https://github.com/' + _meta['github-user'] +
                '/' + _meta['github-repo'] +
                '/blame/master/' + _meta['id'] +
                '/' + _meta['source']);
  }
}

function cmdEmail() {
  if (_meta['contact'] && _meta['title']) {
    window.open(_meta['contact'] + '?subject=' +
                encodeURIComponent('Comment on: ' + _meta['title']));
  }
}

function cmdTweet() {
  if (_meta['site'] && _meta['id']) {
    window.open('https://twitter.com/intent/tweet?' +
                'original_referer=' + encodeURIComponent(location.href) +
                '&text=' + encodeURIComponent(_meta['title']) +
                '&url=' + encodeURIComponent(_meta['site'] + _meta['id']) +
                '&via=' + _meta['github-user']);
  }
}

function cmdPrint() {
  window.print();
}

function cmdHelpOpen() {
  $('#DROPDOWN').animate({ top: 0 }, 400);
  $('#HUD').css('visibility', 'visible');
  $('#HUD').animate({ opacity: 1 }, 400);
}

function cmdHelpClose() {
  $('#DROPDOWN').animate({ top: origDropdownTop }, 400);
  $('#HUD').animate({ opacity: 0 }, 400, 'swing', function() {
    $('#HUD').css('visibility', 'hidden');
  });
}

function cmdHelp() {
  if ($('#DROPDOWN').css('top') == '0px') {
    cmdHelpClose();
  } else {
    cmdHelpOpen();
  }
}

function cmdConsoleOpen() {
  exMode = true;
  $('#CONSOLE-CODE').text(':');
  $('#CONSOLE').animate({ bottom: 0 }, 400);
}

function cmdConsoleClose() {
  exMode = false;
  $('#CONSOLE').animate({ bottom: origConsoleBottom }, 400);
}

function cmdConsole() {
  cmdConsoleOpen();
}

/* Fullscreen request - not actually used (buggy WebKit implementation) */
function cmdFullscreen() {
  var elem = document.body;
  var requestMethod = elem.requestFullScreen ||
      elem.webkitRequestFullScreen ||
      elem.mozRequestFullScreen ||
      elem.msRequestFullscreen;

  if (requestMethod) { // native full screen
    requestMethod.call(elem);
  } else if (typeof window.ActiveXObject !== "undefined") { // older IE
    var wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

function cmdUp() {
  $('html,body').animate({
    scrollTop: '-=256'
  }, 400);
}

function cmdDown() {
  $('html,body').animate({
    scrollTop: '+=256'
  }, 400);
}

function cmdLeft() {
  $('html,body').animate({
    scrollLeft: '-=256'
  }, 400);
}

function cmdRight() {
  $('html,body').animate({
    scrollLeft: '+=256'
  }, 400);
}

/* Zoom in / out
 * see <https://css-tricks.com/almanac/properties/z/zoom/>
 * don't use MozTransform to scale in Firefox - it's seriously fucked up */
function cmdZoomIn() {
  if ($('body').css('zoom')) { // non-standard, WebKit & IE only
    currentZoom += 5;
    $('body').css('zoom', ' ' + currentZoom + '%');
  } else {
    var size = parseInt($('body').css('font-size')) + 1;
    $('body').css('font-size', size + 'px');
  }
}

function cmdZoomOut() {
  if ($('body').css('zoom')) { // non-standard, WebKit & IE only
    currentZoom -= 5;
    $('body').css('zoom', ' ' + currentZoom + '%');
  } else {
    var size = parseInt($('body').css('font-size')) - 1;
    $('body').css('font-size', size + 'px');
  }
}

function scrollTo(target) {
  $('html,body').animate({
    scrollTop: target.offset().top
  }, 400);
}

function scrollToTop() {
  $('html,body').animate({
    scrollTop: 0
  }, 400);
}

/* scrollHeight is equal to clientHeight in Firefox. not working */
function scrollToBottom() {
  $('html,body').animate({
    scrollTop: $('body').prop('scrollHeight')
  }, 400);
}

function getSelectedText() {
  var text = '';
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != 'Control') {
    text = document.selection.createRange().text;
  }
  return text;
}

function cmdGoogle() {
  var selectedText = getSelectedText();
  if (selectedText) {
    window.open('https://www.google.com/search?q=' +
                encodeURIComponent(selectedText));
  }
}

function cmdDuckDuckGo() {
  var selectedText = getSelectedText();
  if (selectedText) {
    window.open('https://duckduckgo.com/?q=' +
                encodeURIComponent(selectedText));
  }
}

function cmdWikipedia() {
  var selectedText = getSelectedText();
  if (selectedText) {
    window.open('https://en.wikipedia.org/w/index.php?search=' +
                encodeURIComponent(selectedText));
  }
}

function cmdTranslate() {
  var selectedText = getSelectedText();
  if (selectedText) {
    window.open('https://translate.google.com/?hl=auto#auto/auto/' +
                encodeURIComponent(selectedText));
  }
}
