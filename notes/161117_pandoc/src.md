---
title: Boilerplating Pandoc for Academic Writing
author: Mort Yao
date: 2016-11-17
---

For starters, this is how you might want to turn your well-written Markdown file (with common metadata fields like `title`, `author` and `date`) into a properly typeset PDF document:

    $ pandoc src.md -o out.pdf

However, Markdown is not TeX. *Not even close.* Once you need to have some bleeding edge control over the typesetting outcome, or perhaps just a little refinement on its LaTeX templating, you'll soon notice that Pandoc has its quirks and gotchas. I've been utilizing Pandoc in all my serious academic writing (incl. homework reports) for years, ever since I gave up on learning more about the overwhelmingly sophisticated TeX ecosystem and turned to something that "just works". Pandoc fits my needs well. And when it doesn't, there's almost always a workaround that achieves the same thing neatly. And this is what this write-up is mostly about.



## Tweaking `default.latex`? Bad idea.

You could, of course, modify the default template ([`default.latex`](https://github.com/jgm/pandoc-templates/blob/master/default.latex)) provided by Pandoc, as long as you're no stranger to LaTeX. In this way, you can achieve anything you want -- in *pure* LaTeX.

    $ pandoc [--template my-default.latex] src.md -o out.pdf

There are, however, a few problems with this naïve approach:

1. If you are tweaking the template just for something you're currently working on, you will end up with some highly document-specific, hardly reusable template. Also this won't give you any good for using Pandoc -- you could just write plain LaTeX anyway.
2. If Pandoc improves its default template for a newer version, your home-brewed template won't benefit from this (unless you're willing to merge the diffs and resolve any conflicts by hand).

I'm conservative about changing the templates. If it's a general issue that needs to be fixed in the default template, sending a pull request to [pandoc-templates](https://github.com/jgm/pandoc-templates) might be a better idea. Of course, if there's a certain submission format you have to stick with (given LaTeX templates for conference papers), then you will fall back on your own.



## Separating the formatting stuff

I wouldn't claim that I know the best practice of using Pandoc, but there's such a common idiom that cannot be overstressed: *Separate presentation and content!*

In the YAML front matter of `src.md` (the main Markdown file you're writing), put only things that matter to your potential readers:

```yaml
---
title: Boilerplating Pandoc for Academic Writing
subtitle: or: How I Learned to Stop Typesetting and Concentrate on the Math
author: Mort Yao
date: 17 November 2016
abstract: |
  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
  sed do eiusmod tempor incididunt ut labore et dolore magna
  aliqua. Ut enim ad minim veniam, quis nostrud exercitation
  ullamco laboris nisi ut aliquip ex ea commodo consequat.
---
```

And in a separate YAML file (let's call it `default.yaml`), here goes the formatting stuff:

```yaml
---
geometry: margin=1.5in
indent: true
header-includes: |
  \usepackage{tcolorbox}
  \newcommand\qed{\hfill\rule{1em}{1em}}
---
```

Above is my personal default, and it's worth a few words to explain:

* `geometry` is where you control the geometric settings of your document. For example, you may narrow down the page margin to `margin=1.5in`, and this is equivalent to raw LaTeX:
```
\usepackage[margin=1.5in]{geometry}
```
* Set `indent` to any value other than `false` if paragraph indentation is desired. (And it is often desired in formal publications.)
* `header-includes` is where you define your own macros, configure existing ones, or claim `\usepackage` in case you want to use a package not enabled by Pandoc (e.g., [`tcolorbox`](https://www.ctan.org/pkg/tcolorbox)). Although you might as well define those in other places (e.g., in the content of a Markdown file), *don't do that*.
    * This decent Q.E.D. tombstone: `\newcommand\qed{\hfill\rule{1em}{1em}}` is my favorite of all time. It doesn't require the `amsthm` package.

With a separate `default.yaml`, now here we are:

    $ pandoc [default.yaml] src.md -o out.pdf



## Separating `header-includes`

You might have already noticed that the `subtitle` field won't display in the produced PDF file. As far as I'm concerned (in Pandoc 1.18), this is the expected behavior. See [here in README](http://pandoc.org/MANUAL.html#fn1):

> To make `subtitle` work with other LaTeX document classes, you can add the following to `header-includes`:
> ```tex
> \providecommand{\subtitle}[1]{%
>   \usepackage{titling}
>   \posttitle{%
>     \par\large#1\end{center}}
> }
> ```

Unfortunately, this won't work (until [Issue #2139](https://github.com/jgm/pandoc/issues/2139) is resolved) since Pandoc parses the `header-includes` metadata field as Markdown, and the bracketed `[1]` is misinterpreted as literals rather than a part of LaTeX control sequence. So the workaround is: Instead of embedding `header-includes` as a metadata field in YAML, we should separate it into another file for this dedicated purpose (it's simply raw LaTeX anyway), and include it using `--include-in-header/-H`:

    $ pandoc [-H header.tex] default.yaml src.md -o out.pdf

Note that you can't have two `header-includes` for one document. So the `header-includes` field specified in YAML metadata will be overridden by the content of `header.tex`.



## Citing sources

While the Markdown syntax for citing is rather easy (`[@id]`), it takes effort to make things right, especially if you have a certain preferred citation format (APA, MLA, Chicago, IEEE, etc.).

The suggestion is: Use [pandoc-citeproc](https://hackage.haskell.org/package/pandoc-citeproc). Once you have a list of references you're interested in, you need two things to typeset those nicely in your document:

* A CSL (Citation Style Language) file (`.csl`), to specify the citation format you want to use.
    * You can preview (and download) many common citation styles in the [Zotero Style Repository](https://www.zotero.org/styles).
* A BibTeX file (`.bib`), which is a list of all entries you might cite.
    * Citation entries in BibTeX format may be found easily on the Internet, through academic search engines and databases. Concatenate them one by one.

As part of the YAML metadata: (Assume you have `ieee.csl` and `references.bib`)

```yaml
csl: ieee.csl
bibliography: references.bib
```

Using `pandoc-citeproc` as a filter, generate the document with citations:

    $ pandoc [--filter pandoc-citeproc] -H header.tex default.yaml src.md -o out.pdf

The list of references is appended to the end of the document. It is often desirable to give the references an obvious title ("References"), start from a new page and avoid any further indentation, so the following comes in the end of the Markdown source:

```tex
\newpage
\setlength\parindent{0pt}

# References
```



## Putting it all together!

Basically, we need 5 files in total:

* For content:
    * `src.md` (Markdown + possibly LaTeX mixed format): Main text.
    * `references.bib` (BibTeX/BibLaTeX format): List of references.
* For presentation:
    * `default.yaml` (YAML format): Format-related metadata.
    * `header.tex` (LaTeX format): Content of `header-includes`; package imports and macro definitions.
    * `ieee.csl` (CSL XML format): Citation style.

And one command:

    $ pandoc --filter pandoc-citeproc -H [header.tex] [default.yaml] [src.md] -o out.pdf



## Open question: Lightweight replacement for `amsthm`?

Pandoc doesn't provide native support for [`amsthm`](https://www.ctan.org/pkg/amsthm) (and I wonder if there will ever be). You can still have the same thing in Pandoc Markdown:

```tex
\newtheorem{definition}{Definition}

\begin{definition}
Man is a rational animal.
\end{definition}
```

However, everything in between `\begin` and `\end` will be treated as raw LaTeX, and the expressiveness of Markdown is lost there. More importantly, this is purely a LaTeX-specific thing, so there's no way for Pandoc to convert this to HTML or any other format (unless you have a filter that does the trick). Consequently, I tend to write all definitions / theorems (lemmas, claims, corollaries, propositions...) in simple Markdown:

```
**Definition 1.** *Man is a rational animal.*
```

It does have some advantages over `amsthm`:

* Using `amsthm`, you cannot see the numbering of each theorem (definition, etc.) in the text editor (well, you can't without a dedicated plugin at least). This is inconvenient when you need to refer to a prior one later. By numbering them explicitly, you can clearly see these ordinals in the Markdown source.
* It is perfectly valid Markdown, so it converts to any format as you wish (HTML, for example).

This also has some drawbacks compared to using `amsthm`, though:

* It doesn't have theorem counters. You need to number things explicitly, manually. (Clearly you can't have implicit numbering and explicit numbering at the same time, so here's the trade-off.)
* It doesn't have automatic formatting. That is, you could possibly get the style for a certain entry (plain, definition, remark) wrong.
* Semantically, they are not recognized as theorems, just normal text paragraphs. This is problematic if you want to prevent definitions and theorems from being indented, since there's no way for LaTeX to tell them from a normal text.

(Probably) The best solution is to write a filter that (conventionally) converts any plain text like `Definition 1` (and `Lemma 2`, `Theorem 3`, etc.) in the beginning of a paragraph to proper Markdown (for HTML target) or corresponding `amsthm` block (for LaTeX target). Even better, it should be able to do cross-references accordingly (Remember `Lemma 10.42`? Let's put an anchored link on that!). This is yet to be done, but would be very helpful to someone who does a lot of theorems and proofs thus wants to avoid the kludge of mixing raw LaTeX with semantically evident Markdown.
