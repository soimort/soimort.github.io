---
title: A Pandoc Filter for Typesetting Operational Semantics
author: Mort Yao
date: 2017-03-23
date-updated: 2017-03-24
category: tooling
---

Recently I decided to make my life a little easier by simplifying the laborious, tedious math typing that I had to do from time to time. For me this is most relevant for typesetting the formal semantics of programming languages, where proof trees are interwoven with a variety of programming constructs. Here's my initial intention: To typeset something like (in big-step semantics)
$$
\frac{
  \stackrel{\mathcal{E}_0}
  {\langle b, \sigma \rangle \downarrow \textbf{true}} \qquad
  \stackrel{\mathcal{E}_1}
  {\langle c_0, \sigma \rangle \downarrow \sigma''} \qquad
  \stackrel{\mathcal{E}_2}
  {\langle \textbf{while } b \textbf{ do } c_0, \sigma'' \rangle \downarrow \sigma'}}{
  \langle \textbf{while } b \textbf{ do } c_0, \sigma \rangle \downarrow \sigma'}
$$
Instead of the bloated TeX syntax:
```latex
  \frac{
    \stackrel{\mathcal{E}_0}
    {\langle b, \sigma \rangle \downarrow \textbf{true}} \qquad
    \stackrel{\mathcal{E}_1}
    {\langle c_0, \sigma \rangle \downarrow \sigma''} \qquad
    \stackrel{\mathcal{E}_2}
    {\langle \textbf{while } b \textbf{ do } c_0, \sigma'' \rangle \downarrow \sigma'}}{
    \langle \textbf{while } b \textbf{ do } c_0, \sigma \rangle \downarrow \sigma'}
```
I could just write it more neatly, intuitively, without all those hexes in magic backslashes and braces:
```
  <b, sig> ! true                 -- E_0
  <c_0, sig> ! sig''              -- E_1
  <while b do c_0, sig''> ! sig'  -- E_2
  ----
  <while b do c_0, sig> ! sig'
```
But, of course, preserving the nice-looking outcome (from either TeX or MathJax).

Besides natural derivations, we also got a lot of evidently agreeable conventions for typesetting general mathematics: parentheses (brackets, braces) are almost always paired; "`\left`" and "`\right`" are very often desired since $\left[\frac{1}{2}\right]$ is a bit less awkward than $[\frac{1}{2}]$; when referring to a function name, "`\operatorname`" looks aesthetically better; etc. Furthermore, if we write down some math notations in plain text, clearly, "`=>`" has to be a "$\Rightarrow$" and "`|->`" has to be a "$\mapsto$"; "`|-`" means "$\vdash$" and "`|=`" means "$\vDash$"; a standalone letter "`N`" is just $\mathbb{N}$; etc. Taking all these matters into consideration, there could be some handy alternative syntax (I call it "lazybones' syntax") for typesetting formulas, at least for a specific field someone specializes in, where these conventions are consistent:

|                  | Typesetting outcome | Syntax           |
| ---------------- | ------------------- | ---------------- |
| Provability | $\Gamma \vdash \varphi$ | **TeX:**<br> `$\Gamma \vdash \varphi$` <br> **Lazybones':**<br> `$Gam |- phi$`
| Validity | $\Gamma \vDash \varphi$ | **TeX:**<br> `$\Gamma \vDash \varphi$` <br> **Lazybones':**<br> `$Gam |= phi$`
| Big-step semantics | $\langle b_0 \land b_1, \sigma \rangle \downarrow t$ | **TeX:**<br> `$\langle b_0 \land b_1, \sigma`<br>` \rangle \downarrow t$` <br> **Lazybones':**<br> `$<b_0 && b_1, sig> ! t$`
| Small-step semantics | $\sigma \vdash b_0 \land b_1 \to^* t$ | **TeX:**<br> `$\sigma \vdash b_0 \land b_1`<br>` \to^* t$` <br> **Lazybones':**<br> `$sig |- b_0 && b_1 ->* t$`
| Hoare logic | $\vdash \{A\} \textbf{if } b \textbf{ then } c_0 \textbf{ else } c_1 \{B\}$ | **TeX:**<br> `$\vdash \{A\} \textbf{if } b`<br>` \textbf{ then } c_0`<br>` \textbf{ else } c_1 \{B\}$` <br> **Lazybones':**<br> `$|- <[A]> if b then c_0`<br>` else c_1 <[B]>$`
| Denotational semantics | $\mathcal{C}[\![X:=a]\!] = \lambda \sigma . \eta (\sigma[X \mapsto \mathcal{A}[\![a]\!] \sigma])$ | **TeX:**<br> `$\mathcal{C}[\![X:=a]\!] =`<br>` \lambda \sigma . \eta`<br>` (\sigma[X \mapsto`<br>` \mathcal{A}[\![a]\!] \sigma])$` <br> **Lazybones':**<br> `$C[[X:=a]] = lam sig . eta`<br>` (sig[X |-> A[[a]] sig])$`

For simplicity, we require that such conventions are *regular*, i.e., "lazybones' syntax" may be translated into plain TeX using merely substitutions of regular expressions.

Let's consider angle brackets, for which we desire to type in simply "`<`" and "`>`" instead of "`\langle`" and "`\rangle`". To avoid any ambiguity (with normal less-than or greater-than sign), it is required that such brackets have no internal spacing, that is, we write "`<x, y>`" rather than "`< x, y >`", but "`a < b`" instead of "`a<b`". Once we fix the transformation rules, implementation would be quite straightforward in Haskell, if we want a pandoc filter to handle these substitutions for everything written in TeX math mode:

```hs
subLAngle s =
  subRegex (mkRegex "<([^[:blank:]])") s $ "\\langle \\1"
subRAngle s =
  subRegex (mkRegex "([^[:blank:]])>") s $ "\\1\\rangle "
```

So, why bother implementing a pandoc filter rather than just defining some TeX macros? Two main reasons:

1. TeX code is nontrivial to write. And you can't get rid of the ugly backslashes anyway. It would be very hard, if not impossible, to achieve the same thing that you'd do with a pandoc filter. (I would say that TeX is rather fine for *typesetting*, but *only* for typesetting; actual programming in TeX seems very awkward for me.)
2. TeX macros are just... some code in TeX, which means that you can't (easily) get it to work for other output formats, especially HTML with MathJax. So if you do a lot of heavy lifting with TeX macros, they won't play well for display on the Web.

Surely you can write pandoc filters in *any* language as you like (officially Haskell and Python). Nothing like plain TeX: they're easier to implement, unrestricted in the way that they interact with input documents, with a great deal of cool supporting libraries even to blow up the earth. Although here in this case, we are only using some regular expressions to ease our typesetting for operational semantics.

A proof-of-concept of this idea is [semtype.hs](https://github.com/soimort/pandoc-filters/blob/aad6033dfbd7d460d22aa627e04ca388f72af020/semtype.hs). While undocumented, all tricks it does should be clear from the regular expressions.
