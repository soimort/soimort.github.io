# soimort.org

[![www.soimort.org/README.html](http://www.soimort.org/favicon.ico)](http://www.soimort.org/README.html)

Through the looking-glass, welcome to the inside world of [www.soimort.org](http://www.soimort.org). Here you may explore the fascinating (tedious) technical details of my blog site.

## Pancake

This site is basically powered by [pandoc](http://pandoc.org/), a universal document converter. It turns human-editable markdown documents into stylish HTML pages that can be rendered in a web browser.

I hate [complexity beyond necessity](https://en.wikipedia.org/wiki/Occam%27s_razor); that's why I prefer a document converter to any [fancy static site generators](https://staticsitegenerators.net/). Since I write in markdown and publish in HTML, I need no rocket technique to go beyond the straightforward markdown -> HTML conversion, or need I?

To build my static site (usually involves a bunch of calls to the `pandoc` command), I used to write a lot of [Makefile](https://raw.githubusercontent.com/soimort/soimort/1a31222d029b6c2e70b51aa5dc7bdbe1b2d6916b/Makefile)s. But Makefile is hardly programmable, and embedding shell scripts are just too horrible to maintain, debug or even read for a self-esteemed programmer. As a result, I started to write a small wrapper script, **pancake**, to help myself building sites with pandoc painlessly. It simply replaces my naive "pandoc + make" approach. And it's yet another minimal static site generator (whatever you name it).

`pancake` has a few dependencies:

- Ruby 2.0 or above (It's written in Ruby. I like Haskell, but it was a little cumbersome for simple system scripting)
- The [listen](https://rubygems.org/gems/listen/) gem: `gem install listen`
- And [pandoc](http://pandoc.org/), of course.

`pancake` can be put into the system `PATH`, or it may also be modified on need and copied into a specific directory. A subdirectory or file under the current path is called a "***real target***" and can be built by `pancake`: (in this repository, for example)

    $ pancake posts/salve-munde

`pancake` will look into the current path "`.`", "`posts/`" and "`posts/salve-munde/`" and find all relevant "configuration paths" (all files whose name starts with an underscore "`_`", and all files under directories whose name starts with an underscore). Among all these "configuration paths", `pancake` is interested in two types of files: metadata files (`.yaml` or `.yml`, e.g., `_config.yaml` and `posts/_config/meta.yaml`) and source files (`.markdown` or `.md`, e.g., `posts/_config/1_footer.md` and `posts/_config/2_references.md`).

All metadata files are passed straight to `pandoc`. Moreover, there are some metadata fields used by `pancake` specifically: (**`target`**, **`source`**, **`source-metadata`**, **`source-bibliography`**)

```yaml
target: index.html
source: source.md
source-metadata: source.yaml
source-bibliography: source.bib
```

With these fields above, `pancake` will look for `source.md`, `source.yaml` under the target path `posts/salve-munde` and pass them to `pandoc`, pass `posts/salve-munde/source.bib` as a `--bibliography` option to `pandoc`, and pass `posts/salve-munde/index.html` as a `--output` option to `pandoc.`

*Note*: A ***real target*** may also be a file other than directory; in that case, the **`source`** field is not used since the target filename speaks for itself.

Furthermore, the target path as a string `posts/salve-munde` is passed to `pandoc` as an extra metadata field `id`. So the resulting `pandoc` command will be like:

```shell
$ pandoc --bibliography posts/salve-munde/source.bib \
    --output posts/salve-munde/index.html            \
    -M id=posts/salve-munde                          \
    posts/salve-munde/source.md                      \
    posts/_config/1_footer.md                        \
    posts/_config/2_references.md                    \
    _config.yaml                                     \
    posts/_config/meta.yaml                          \
    posts/salve-munde/source.yaml
```

Some more metadata fields recognized by `pancake`:

```yaml
input-format: markdown       # passed to pandoc as option -f
output-format: html5         # passed to pandoc as option -t
template: templates/default.html5 # passed to pandoc as option --template
mathjax: https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML
# passed to pandoc as option --mathjax
filters: pandoc-citeproc     # passed to pandoc as --filter. can be an array
raw-options: --section-divs  # passed to pandoc directly. can be an array
```

To pass other options to `pandoc`, the alternative way of specifying the **`raw-options`** field in a metadata file is to use ***extra option*** targets in command line. Anything starts with a hyphen "`-`" is regarded as an extra option to be passed to `pandoc`. For example:

    $ pancake --toc --section-divs posts/salve-munde

*Note*: If an option has a value, the option and the value must appear as a single parameter. For example, `pancake --output README.html README.md` will not work properly, since it treats `README.html` as a ***real target*** other than the value of extra option `--output`. The correct way is to use:

    $ pancake --output=README.html README.md

Besides ***real targets*** and ***extra options***, there are also a few predefined ***phony targets***: (like what you may have in a Makefile)

    $ pancake all

The phony target **`all`** looks for all source files recursively under the current directory, but not under a directory whose name starts with an underscore (which is considered to be a "configuration path"). `pancake` then calls `pandoc` on these source files in alphabetical order, with their relevant metadata respectively.

    $ pancake server

The phony target **`server`** starts a local server to serve the current directory. You may also specify a port to use:

    $ pancake server:port=4000

It is also possible to specify a directory to watch for changes; `pancake` will automatically regenerate all targets every time a file is modified in that directory:

    $ pancake posts/salve-munde server:port=4000,watch=posts/salve-munde

*Note*: Changes of `.html` and `.htm` files will NOT trigger the regenerating, otherwise `pandoc` will be called infinitely (since every time it changes the `.html` file it generates).

Here's a simple but really practical trick: `pancake` can serve as a markdown previewer (like [grip](https://github.com/joeyespo/grip), [instant-markdown-d](https://github.com/suan/instant-markdown-d/blob/master/instant-markdown-d) or `jekyll serve`).

    $ pancake -s --output=README.html README.md server:watch

Preview your `README.md` at <http://localhost:8000/README.html>.

Even better, you may easily specify a customized template to use via `--template`, or include your own stylesheets as a `css` field in `--metadata`:

    $ pancake --metadata=css:/css/minimal.css -s --output=README.html README.md server:watch

*Note*: The [listen](https://github.com/guard/listen) gem uses the polling mechanism to watch for filesystem changes on OS X, which might be slow on very big directories. In such cases, avoid using **`server:watch`** and limit watching in a small but relevant directory, like **`server:watch=posts/salve-munde`**.

### Why my homemade pancake? (and why not [Jekyll](http://jekyllrb.com/) / [Hakyll](http://jaspervdj.be/hakyll/) / [yst](https://github.com/jgm/yst)?)

[Jekyll](http://jekyllrb.com/) was a great static site generator. It does one thing well: generating static sites. It hides details about its underlying template engine ([liquid](https://github.com/Shopify/liquid)) and markdown engine ([kramdown](https://github.com/gettalong/kramdown)) and encapsulates them into a highly configurable site generator. The first version of [www.soimort.org](http://www.soimort.org/) (and my first blog site ever hosted on GitHub) was powered by Jekyll since November 2011, until it's replaced by **pancake** in July 2015.

The reason I decided to migrate from Jekyll to my own, minimal static site solution isn't because Jekyll is not good, nor Jekyll lacks of the functionality I need. It's because Jekyll is too much beyond what I really need.

Jekyll consists of over *10,000* lines of Ruby code (not including other gems such as the template engine and the markdown engine). **Pancake** has only about *200* lines (not including pandoc); the whole source code is a self-contained Ruby script, which can be readable in 15 minutes. The most important thing is, it has every functionality I need and it's fully under control due to its tiny size; anything more than that looks like an overkill to me.

Both [Hakyll](http://jaspervdj.be/hakyll/) and [yst](https://github.com/jgm/yst) are static site generators based on pandoc. In addition to rich features of markdown conversion provided by pandoc, yst offers good support for string templates, and Hakyll has its non-trivial (if not too complicated) DSL (in Haskell) for building static sites. **Pancake** has none of these. I almost believe that simple string interpolations are sufficient for so-called "templating" in most cases I need, and I'd rather follow one convention than have to write a DSL-like recipe for building a site from time to time.

Furthermore, there is one thing **pancake** can do but most other static site generators cannot easily accomplish: *building a single target*. This is because **pancake** will build only demanded targets by nature. In this way, the whole site is prevented from rebuilding every time (unless you ask for the target **`all`**). Such a "*build-on-demand*" mechanism has a few advantages:

- It is generally faster. If you're just starting to write a new post, it could be meaningless (and wasteful) to rebuild (or look at the `mtime` of) all posts on running the site generator.
- Old HTML pages can be kept. This is especially helpful when a user-defined pandoc filter is involved. As updates of the filter could cause pandoc to build HTML differently, you don't have to break already generated HTML pages if they are intended to stay as they are.
- A markdown file is a valid target, so you could use **pancake** as a markdown live previewer which gives you the power to have customized template and stylesheets, while not bothering with site configurations at all (e.g., preview your `README.md` using a single command `pancake -s --output=README.html README.md server:watch`).

Last but not the least, geeks keep writing homemade static site generators all the time, even if they were the only user of their blogging tool and they don't even actually blog. So just why not? It's always fun to build something.

Get a copy of **pancake** [here](https://github.com/soimort/soimort.github.io/blob/master/pancake) (the source code is released into the public domain).

## [Monkeydown](http://www.soimort.org/filters/README.html)

**Monkeydown** (or "Monkey Flavored Markdown") is an extension to the standard / pandoc markdown format, implemented as a pandoc filter. It is used in all blog posts on this site.

For more details, see: <http://www.soimort.org/filters/README.html>
