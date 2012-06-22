---
layout: post
title: Mayuki
date: 2012-06-22
description: A minimalist Markdown/YAML-based static wiki generator.
disqus: true
---
[Project Homepage](http://www.soimort.org/mayuki/)
| View on {
[GitHub](https://github.com/soimort/mayuki)
| [RubyGems](https://rubygems.org/gems/mayuki)
}

[git://github.com/soimort/mayuki.git](git://github.com/soimort/mayuki.git)
| Download {
[TAR Ball (.tar.gz)](https://github.com/soimort/mayuki/tarball/master)
| [ZIP File (.zip)](https://github.com/soimort/mayuki/zipball/master)
}
***

# Mayuki

__Mayuki__ is a minimalist __Markdown/YAML__-based static __wiki__ generator.

It takes over a folder and converts wiki pages (written in [Markdown](http://en.wikipedia.org/wiki/Markdown) syntax) into HTML format suitable for publishing on a website or embedding into other web templates.

Mayuki is originally designed as a naive script to generate static HTML pages from a directory of Markdown texts on filesystem, being able to "include" code snippets for syntax highlighting by file name rather than putting the whole code in the Markdown file, and finally send to another folder to be used directly by [Jekyll](http://jekyllrb.com/), the static blogging system. It can also be used standalone, by generating static HTMLs for hosting on any web server without extra configuration.

Mayuki can be used as an HTML generator for:

* Personal wikis, technical blogs and notes
* Documentation and technical manuals

that can be hosted on any website.

Features:

* [RDiscount](https://github.com/rtomayko/rdiscount) Markdown parsing engine.

* [Liquid](http://liquidmarkup.org/) templating engine.

* [Pygments](http://pygments.org/)-powered syntax highlighting.

* Built-in HTTP server for previewing generated HTML pages.

* Wiki pages are based on the directory tree structure and located in the local filesystem rather than databases. Being convenient to manage for lightweight static sites, the whole wiki history can be easily version-controlled by a [VCS](http://en.wikipedia.org/wiki/Revision_control) like [Git](http://git-scm.com)).  
    There are several wiki alternatives sharing a similar philosophy, such as:
    * [ikiwiki](http://ikiwiki.info/) (in Perl)
    * [Markdoc](http://markdoc.org/) (in Python)
    
    Mayuki is written in Ruby and intended to be a minimalist wiki system (with little or no configuration).



## System Requirements

### Dependencies

* [Ruby](http://www.ruby-lang.org/en/) >= 1.9
* [Pygments](http://pygments.org/) >= 1.5 (a syntax highlighting engine written in Python)

Install Pygments:
    
    $ sudo easy_install Pygments

or (on Arch Linux):
    
    $ sudo pacman -S python-pygments

__Note:__ `pygmentize` executable must exist in `$PATH` (or `%PATH%` in Windows).



## Installation

* __Method 1:__ Install the latest release from Gem ([https://rubygems.org/gems/mayuki](https://rubygems.org/gems/mayuki))
        
        $ gem install mayuki

* __Method 2:__ Install from Git repo ([https://github.com/soimort/mayuki](https://github.com/soimort/mayuki))

    Git and rake are required if you choose to install Mayuki this way.
        
        $ git clone git://github.com/soimort/mayuki.git
        $ cd mayuki
        $ rake install



## Getting Started

### Hello, Mayuki!

First of all, let's create the "main" directory for our new wiki:
    
    $ mkdir hello_mayuki
    $ cd hello_mayuki/

Write some basic configuration in a file named `_config.yml`: we want all Liquid and Markdown syntax to be parsed, and wish the wiki system could generate full HTML files for us:
    
    $ cat > _config.yml
    _render: [liquid, markdown]
    _export: [html_full]

Now it's time to write some `index.html`... but wait, remember Mayuki generates this for us; what we need to write is a `index.md`. Let's just put a line of text "Chapter 1" with a link to page `ch01` on it! (Cannot remember the Markdown syntax for that? Check it [here](http://en.wikipedia.org/wiki/Markdown).)
    
    $ cat > index.md
    [Chapter 1](ch01)

So what's in the page "`ch01`"? Create a `ch01` folder under the main directory with another `index.md`, like this: (yep, there should be a link "HOME" back to "`..`", the main index)
    
    $ mkdir ch01
    $ cat > ch01/index.md
    Hello, Mayuki!
    
    [HOME](..)

OK, now run Mayuki in the main directory and start a web server to see what it looks like.
    
    $ mayuki --server

Hopefully no error is prompted; open your browser and visit:
    
[http://localhost:4000/](http://localhost:4000/)

Congratulations! You are running your very minimalist personal wiki now. Want to change something or create a new page? Do it in your favorite text editor. Want to share your knowledge with the world? Upload the wiki folder via FTP or rsync, or just push it onto a Git server hosting web pages! ([GitHub](http://pages.github.com/) or [Bitbucket](http://pages.bitbucket.org/))

You may want to learn some more Markdown syntax [here](http://daringfireball.net/projects/markdown/basics).

### Command Line Usage

Render the current directory:
    
    $ mayuki

Render the current directory and start a web server on port 8080 (if no parameter is followed, port 4000 will be used):
    
    $ mayuki --server 8080

The current directory is considered as the "main" directory of the wiki.

Show the version number of Mayuki:
    
    $ mayuki --version

### API Usage

Render the current directory and return the output path:
    
    require 'mayuki'
    output_dir = Mayuki::mayuki

Or render a specified directory:
    
    Mayuki::mayuki("mysite/")

The processed directory is considered as the "main" directory of the wiki.

### Directory Processing

Each directory in the "main" wiki directory will be processed recursively.

For the directory to be processed:

* All files and directories whose name starts with the "_" character are ignored (will be neither rendered nor exported).
* All files whose name ends with "`.md`", "`.markdown`", "`.htm`" or "`.html`" are rendered and exported to the output path.
* Everything else is left untouched and exported to the output path.

### _config.yml

Each directory may contain one or more `_conf*.yaml`, `_conf*.yml` configuration file.

If no configuration file matched those name patterns is found, the global configuration (the one used in the "main" directory) will be applied; If no global configuration is found in the main directory, the default configuration below will be used.

Default configuration:

* _output: ./\_output
    * The output path. Must be writable for current user!

* _render: [liquid]
    * The render level. Use _[liquid, markdown]_ to generate valid HTML.
    * Use _[liquid]_ (default) to parse Liquid only (will preserve Markdown syntax).

* _export: []
    * The export level. Use _[html]_ to export files of HTML snippets.
    * Use _[html_article]_ to export files of HTML \<article\> elements.
    * Use _[html_full]_ to export full HTML5 documents.
    * Using _[]_ (default) will preserve YAML front matters (if any). You may use this setting if you want to put the wiki into a site layout template with [Jekyll](http://jekyllrb.com/).

* _pygments: false
    * Enable Pygments to generate stylesheets for syntax highlighting.
    * Set to _true_ if syntax highlighting is used in this directory.

### Syntax Highlighting

Suppose you have a `test.rb` source file in the same directory with the Markdown file. Then include a line in the Markdown text:
    
\{\{ "test.rb" | src: "ruby" \}\}

This way you "import" the syntax-highlighted source code into this wiki page, using Ruby lexer.

The string parameter specifies the name of lexer. It's the same as the short name used in Pygments (Check [here](http://pygments.org/docs/lexers) for the complete list).

Without specifying a language lexer, you may just use:
    
\{\{ "test.rb" | code \}\}

And let Pygments decide itself which lexer to use by filename patterns.



## Licensing

Mayuki is released under the [MIT license](http://www.opensource.org/licenses/mit-license.php). See the `LICENSE` file for details.



_Last Revision: 2012-06-22, by [Mort Yao](http://www.soimort.org/)_
