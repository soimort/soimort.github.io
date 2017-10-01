---
title: The Referential Use
subtitle: Descriptions, names, with sense and reference.
author: Mort Yao
date: 2017-09-26
date-updated: 2017-10-01
---

So I was trying to make some sense of the relevance between language and logic these days, and here comes my rendering of some fundamental issues in the philosophy of language. This should not be taken as a comprehensive summary on the topic, but hopefully it makes clearer how the translation from a natural language to a formal (e.g., first-order) logic can go unambiguously (or ambiguously). Moreover, each subtopic of notes is followed by a reading list introducing main concepts and debates, which are the "real fruits" here.

Inspired by Wittgenstein's theory of "Meaning as Use", it is fair to say that when we use a word, we just mean it. The meaningful use of a word and a mention of it must be distinguished. Quotation, as the canonical device of making the distinction, is central to debates on this topic. Davidson argued that even quoted words can be both a use and a mention. Quine's invention of quasi-quotations (as an alternative quotational device) is of technical importance, and this notion has found its use in inductive definitions of formal logic, denotational semantics, metaprogramming in Lisp and string interpolations in many practical programming languages.

As firstly noticed by Frege, the semantics of words embraces two differently supporting aspects: sense and reference. Referring expressions such as descriptions and proper names, may both be denoted using a descriptivist theory (proposed by Russell); the Russellian view of names, however, was criticized by Kripke in favor of a many-worlds causal view.

---

**On quotation.** In the following text, we will utilize English quotation marks intensively. Quoted text is used as a literal mention of things whatever they enclose. By contrast, unquoted text is used as whatever its meaning is. For example,

:=
*I* am who I am.

but

:=
*"I"* is a word. *"I"* is not who I am.

(This issue will be discussed further in "Use-mention distinction".)

**Statement.** A *statement* is defined as a *sentence* that says something is *true*. The notions of English words "sentence" and "true" are clear in this informal context, and they all have their naïve meanings. "Something" is just an object (or objects) that the statement talks about.

**Metalanguage and object language.**
To make a statement about something, we may use either a formal or a natural language. When that "something" is some language (or languages), we refer to it as the *object language*(s) that we are talking about and the language we are using to make the very statement as the *metalanguage*. For example,

:=
The German phrase "ein weißes Pferd ist weiß" means "a white horse is white" in English.

Here we are talking about the isomorphic meanings of two sentences in German and in English (as our object languages), and English is the metalanguage that we use to make the statement. It doesn't matter which metalanguage we use and whether the metalanguage is identical to one of the object languages, as long as it is capable of representing the semantics we want; The following statement (using Esperanto as the metalanguage) has the same meaning as above:

:=
La germana frazo "ein weißes Pferd ist weiß" signifas "a white horse is white" en la angla.

<blockquote style="background:gainsboro; border-radius:1em; padding:.25em 1em; font-size:.8em">
:=
***Reading list***

On the application of metalanguages and object languages in mathematical logic, see:

* G. J. Mattey, "Object Language and Metalanguage." [[PDF]](http://hume.ucdavis.edu/mattey/phi112/objectmeta_ho.pdf)
* "Metalanguage," Wikipedia, <https://en.wikipedia.org/wiki/Metalanguage>.
* "Object Language," Wikipedia, <https://en.wikipedia.org/wiki/Object_language>.
</blockquote>



**Ambiguity in interpretations.**
It might be tempting to just use a natural language as our metalanguage, but ambiguity could arise due to the sloppy nature of any human languages. Consider the following statement in Chinese:

:=
白馬非馬。 \
(A white horse is not a horse.)

The argument is that the intension of "white horse" consists of the properties of being white and being horse-like, while the intension of "horse" consists merely of the property of being horse-like, hence conceptually "white horse" and "horse" are not identical to each other. However, if we interpret "是 (be)" as "be a kind of" thus "非 (be not)" as "be not a kind of", as in the usual context, we could immediately tell that it is absurd to say:

:=
白馬非馬。 \
(A white horse is not a kind of horses.)

Natural languages can be vague, however we are almost always in need of a definite interpretation when studying the semantics (of whatever language we like). It is most advisable to employ a formal language so that we don't fall into dialectic traps like this. Consider the formal language of set theory, where we define a relation $P_H$ ("being horse-like") such that $P_H x$ if and only if $x \in P_H$, and a relation $P_W$ ("being white") such that $P_W x$ if and only if $x \in P_W$. Then we can write the first meaning of the informal statement sloppily, but unambiguously as:
$$\{ x \in P_H : x \in P_W \} \neq P_H$$
which is true if and only if there is at least one $x'$ such that $x' \in P_H \land x' \not\in P_W$, so that $x' \not\in \{ x \in P_H : x \in P_W \}$ but $x' \in P_H$.
There is a plausible argument by nature, since we are easily convinced that "There is a horse that is not white".

***Exercise 8.1.*** Rewrite $\{ x \in P_H : x \in P_W \} \neq P_H$ formally (i.e., without using set comprehension), in the first-order language of set theory containing only $\in$ as a predicate symbol.

The second meaning of the statement can be unambiguously written as:
$$\forall x ((x \in P_H \land x \in P_W) \to x \not\in P_H)$$
which is true if and only if $\forall x (\lnot (x \in P_H \land x \in P_W))$, i.e., "There is no such thing as a white horse"; or even $\forall x (x \not\in P_H)$, i.e., "Nothing is a horse". Both are ungrounded beliefs contradicting our empirical  evidence.

**Ambiguity in referring expressions.**
Difficulties in translating from a natural language to a formal language often arise in unintended ways. Consider again, the statement:

:=
A white horse is not a kind of horses.

Doe the mentioned "white horse" refer to any arbitrary object that simply holds the properties of being a white horse, or a very specific white horse that one happens to find to be not a kind of horses? This distinction is significant because in the latter case, we have to formulate the statement using an existential quantification instead of the universal quantification:
$$\exists x ((x \in P_H \land x \in P_W) \land x \not\in P_H)$$
that gives us a third meaning of the statement "白馬非馬".

***Exercise 8.2.*** (1) Can it be the case that the sentence $\exists x ((x \in P_H \land x \in P_W) \land x \not\in P_H)$ is true? (2) Why don't we formulate its meaning as $\exists x ((x \in P_H \land x \in P_W) \to x \not\in P_H)$?

**Descriptions and names.**
To eliminate any potential ambiguity when referring to something in a natural language, we firstly review three kinds of referring expressions:

#. **Demonstratives**. Examples: "this"; "this horse"; "that white horse".
#. **Descriptions**.
   * *Indefinite* descriptions. Examples: "a white horse".
   * *Definite* descriptions. Examples: "the white horse".
#. **Proper names** (*names* that uniquely identify their referents). Examples: "Princess Celestia"; "Rainbow Dash".

A referring expression (singular term) picks out a particular object (or some particular objects) that the sentence talks about. The demonstratives are clearly context sensitive, so for now we will consider only descriptions and proper names for the sake of unambiguity.

For indefinite descriptions, consider the following sentence:

:=
A white horse is white.

Based on our preceding discussion, there are two different ways of formulating it:

:=
(If there is a white horse, then it is white.)
$$\forall x ((x \in P_H \land x \in P_W) \to x \in P_W)$$

and

:=
(There is a white horse which is white.)
$$\exists x ((x \in P_H \land x \in P_W) \land x \in P_W)$$

N.B. The latter (and weaker) formulation is proposed by [Bertrand Russell](https://plato.stanford.edu/entries/russell/). [@sep-descriptions]

For definite descriptions,

:=
The white horse is white.

How do we understand its semantics? Russell proposed the following formulation:

:=
(There is exactly one white horse which is white.)
$$\exists! x ((x \in P_H \land x \in P_W) \land x \in P_W)$$

***Exercise 8.3.*** Rewrite the above sentence using the existential quantifier.

Russell's theory of descriptions can lead to justified denials of some obviously ridiculous statements. For example, the sentence

:=
The invisible pink unicorn is white.

is puzzling, since we have no idea what an "invisible pink unicorn" would be like. Most of us would agree that there is no such thing as an invisible pink unicorn. Can the above statement be true then? By Russell's formulation of definite descriptions, we say that this is equivalent to

:=
There is exactly one invisible pink unicorn which is white.

Then we can immediately assert that it is not true, given our belief that no invisible pink unicorn really exists.

As an alternative view of the theory of descriptions, [Gottlob Frege](https://plato.stanford.edu/entries/frege/) suggested that a sentence like above makes use of a definite description that fails to refer (as "invisible pink unicorn" does not refer to anything), thus it does not express a proposition and has no truth value. [@strawson1950referring]

For proper names, we could say things like

:=
Princess Celestia is white.

It has been disputed, however, whether a descriptivist theory can be applied on proper names. Russell argued that most names have some descriptive meanings, e.g., "Princess Celestia" can be descriptively understood as "The benevolent ruler of Equestria". Modern causalists such as [Saul Kripke](https://scholar.google.com/citations?user=MRCc_ugAAAAJ), criticized the descriptivist theory [@kripke1972naming], for that a name need not be a uniquely identifying description so as to refer to an object; rather, there must be a *causal chain* that makes the name a reference. For example, we know that the name "Princess Celestia" and the description "The benevolent ruler of Equestria" refer to the same referent because she defeated King Sombra and took over Equestria, or more realistically, the story-writer let her be so. However, in an alternate world where King Sombra still rules Equestria, the name "Princess Celestia" would not have the same referent as "The benevolent ruler of Equestria" (in fact the latter term would actually refer to nothing), but "Princess Celestia" will always be Princess Celestia; that is, a proper name is a [*rigid designator*](https://en.wikipedia.org/wiki/Rigid_designator) of objects, while a definite description may refer to very different things due to varying causality in different worlds. Kripke's causal theory of reference suggested that, a name refers uniquely to the same object in every possible world, regardless of any particular facts about it. By contrast, the descriptivist view of a name may fail to capture its referent consistently in all worlds.

**Sense and reference.** As per discussion on descriptions and names, it is essential to make a distinction between a *sense* and a *reference* (this distinction is attributed to Frege's 1892 work "Über Sinn und Bedeutung" (*On Sense and Reference*)). A reference denotes a particular object in the world that the term applies, while a sense denotes the way in which the term presents, regardless of what the actual referent is (or whether there is a referent). For example, the description "The invisible pink unicorn" clearly makes sense, but it has no reference in any possible physical world. As a second example, the proper name "Princess Celestia" and the description "The benevolent ruler of Equestria" have different senses (i.e., "Princess Celestia" means Princess Celestia, "The benevolent ruler of Equestria" means the benevolent ruler of Equestria, and these two meanings are never the same), however, they do refer to the same thing in this world.

It is worth noting that senses may not be injectively mapped to words or phrases, as a word can present different senses in different contexts. For example, the word "structure" has a meaning in mathematical logic, and it also has a meaning in abstract algebra. Despite that their senses are similar in essence, they apply to different domains of mathematics and should not be taken as identical. They can, nonetheless, have one common reference when we talk about a formal language $\mathcal{A}$ of algebra, studying the theory of a particular algebraic structure (e.g., abelian group $(A, \cdot)$) thus it is also a structure $\mathfrak{A}$ that we assign to our language $\mathcal{A}$.

<blockquote style="background:gainsboro; border-radius:1em; padding:.25em 1em; font-size:.8em">
:=
***Reading list***

On a first introduction to descriptions, proper names, Fregean-Russellian descriptivist theory and Kripke's causal theory, see Wikipedia:

* "Sense and Reference," Wikipedia, <https://en.wikipedia.org/wiki/Sense_and_reference>.
* "Definite Description," Wikipedia, <https://en.wikipedia.org/wiki/Definite_description>.
* "Proper Name," Wikipedia, <https://en.wikipedia.org/wiki/Proper_name_(philosophy)>.
* "Descriptivist Theory of Names," Wikipedia, <https://en.wikipedia.org/wiki/Descriptivist_theory_of_names>.
* "Causal Theory of Reference," Wikipedia, <https://en.wikipedia.org/wiki/Causal_theory_of_reference>.

Further reading on descriptions, names and the issue of reference:

* Peter Ludlow, "Descriptions," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/descriptions/>.
* Marga Reimer and Eliot Michaelson, "Reference," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/reference/>.
* P. F. Strawson, "On Referring." [[PDF]](http://semantics.uchicago.edu/kennedy/classes/f09/semprag1/strawson50.pdf)

On Frege's innovative distinction between sense and reference:

* Gottlob Frege, "On Sense and Reference." [[PDF]](http://www.scu.edu.tw/philos/98class/Peng/05.pdf) (English translation of "Über Sinn und Bedeutung")
* Michael Dummett, "Frege's Distinction Between Sense and Reference."

Russell's original essay on his theory of descriptions:

* Bertrand Russell, "On Denoting." [[PDF]](https://www.uvm.edu/~lderosse/courses/lang/Russell(1905).pdf)
  * "On Denoting," Wikipedia, <https://en.wikipedia.org/wiki/On_Denoting>.

Kripke's objections to descriptivist theories of proper names:

* Saul Kripke, "Naming and Necessity." [[PDF]](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.472.9081&rep=rep1&type=pdf)
</blockquote>



**Use-mention distinction.**
When trying to understand the semantics of a natural language, it is also critical to make the distinction between *using* a word (or phrase) and *mentioning* it. Consider again, the following sentence:

:=
The white horse is white.

This sentence is true because a white horse is indeed, white (in the conventional interpretation). Furthermore,

:=
"The white horse" is a definite description.

This sentence is also true because the phrase "the white horse" is well defined with a meaning that refers to the collection of horses that are white. However, it does not make much sense to say:

:=
The white horse is a definite description.

Since a white horse is just a white horse, not a word or phrase with meanings. And we would also agree that

:=
"The white horse" is white.

is confusing in some way, because the quotation marks suggest that "the white horse" may not have the intended meaning, i.e., it may appear as a literal mention of the English phrase "white horse" instead.

It is worth noting that though quotation marks are often an indication of mention while unquoted text is simply used, as in the above example, it is not always the case. [Donald Davidson](https://plato.stanford.edu/entries/davidson/) argued that "mixed quotation" exists so that quoted words can be simultaneously used and mentioned. [@Davidson1979]

**Quasi-quotation.**
While quotation marks can be used for denoting a mention, a practical issue is that when mentioning something (e.g., a definition), we sometimes need to *use* the reference of a part of the mention inside it. Recall that when defining a first-order language in [Mst. #7](/mst/7/), we made claims like

:=
If $\psi$ is a well-formed formula, $(\lnot\psi)$ is a well-formed formula.

Note that the mention is implicit here, without any extra meta-symbols. Can we just make the definition using quotation marks?

:=
If $\psi$ is a well-formed formula, "$(\lnot\psi)$" is a well-formed formula.

It is immediately clear that the above definition does not fit our intended purpose: Let the open term (in our metalanguage) $\psi$ be the formula (in the object language) "$(\alpha \to \beta)$", then what we are saying basically is

:=
If "$(\alpha \to \beta)$" is a well-formed formula, "$(\lnot\psi)$" is a well-formed formula.

This sentence does not really make an inductive definition as intended. The problem is that the symbol "$\psi$" in "'$(\lnot\psi)$'" is not interpolated as what its use is (i.e., "$(\alpha \to \beta)$"), but only appears as a literal Greek letter in the mention. To resolve this issue, [W. V. O. Quine](https://plato.stanford.edu/entries/quine/) introduced the meta-symbols called *quasi-quotation* [@Quine1940-QUIML], so that it is technically feasible to make inductive definitions like this:

:=
If $\psi$ is a well-formed formula, ⌜$(\lnot\psi)$⌝ is a well-formed formula.

Then let $\psi$ be "$(\alpha \to \beta)$", ⌜$(\lnot\psi)$⌝ becomes "$(\lnot (\alpha \to \beta))$". We have that

:=
If "$(\alpha \to \beta)$" is a well-formed formula, "$(\lnot (\alpha \to \beta))$" is a well-formed formula.

just as intended.

<blockquote style="background:gainsboro; border-radius:1em; padding:.25em 1em; font-size:.8em">
:=
***Reading list***

On the importance of use-mention distinction:

* "Use-mention Distinction," Wikipedia, <https://en.wikipedia.org/wiki/Use–mention_distinction>.
* W. V. O. Quine, *Mathematical Logic*, chap. 1.4. (Use versus Mention)
* A. W. Moore, "How significant is the use/mention distinction?"

On quotation:

* W. V. O. Quine, *Mathematical Logic*, chap. 1.5. (Statements about Statements)
* Herman Cappelen and Ernest Lepore, "Quotation," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/quotation/>.
* Donald Davidson, "Quotation."

On the practical device of quasi-quotation:

* "Quasi-quotation," Wikipedia, <https://en.wikipedia.org/wiki/Quasi-quotation>.
* W. V. O. Quine, *Mathematical Logic*, chap. 1.6. (Quasi-Quotation)
</blockquote>



## What's coming next

The use-mention distinction and the auxiliary device of quasi-quotation are philosophically essential not only for the definition of formulas/sentences in formal languages, but also for Alfred Tarski's semantic theory of *truth* and *models*. Deeper debates on the essence of truth often involve the correspondence theory, the deflationary theory and the coherence theory. It is also informing to know how the *liar's paradox* and *Quine's paradox* can arise from direct or indirect self-referential statements, and what Tarski's undefinability theorem implies. Michael Dummett's characterization of the principle of bivalence (in classical logic) as *realism*, together with the defence of *intuitionism* (an anti-realism), are also highly relevant for understanding the philosophical basis of modern logic.



## Solutions to exercises

***Exercise 8.1.*** $\{ x \in P_H : x \in P_W \} \neq P_H$ is just
$$\lnot ((x \in P_H \land x \in P_W) \leftrightarrow x \in P_H)$$
which is just
$$((\lnot (x \in P_H \to (\lnot x \in P_W))) \to x \in P_H) \to (\lnot (x \in P_H \to (\lnot (x \in P_H \to (\lnot x \in P_W)))))$$

***Exercise 8.2.*** (1) Notice that $\lnot ((x \in P_H \land x \in P_W) \land x \not\in P_H)$ is a tautology, by generalization we get that $\forall x (\lnot ((x \in P_H \land x \in P_W) \land x \not\in P_H))$. By double negation
$$\lnot (\lnot \forall x (\lnot ((x \in P_H \land x \in P_W) \land x \not\in P_H)))$$
which is just
$$\lnot \exists x ((x \in P_H \land x \in P_W) \land x \not\in P_H)$$
so $\exists x ((x \in P_H \land x \in P_W) \land x \not\in P_H)$ cannot be satisfied by any interpretation. (or: it is never true.)

\(2) $\exists x ((x \in P_H \land x \in P_W) \to x \not\in P_H)$ is equivalent to
$$\lnot \forall x (\lnot ((x \in P_H \land x \in P_W) \to x \not\in P_H))$$
Assume that there is an $x_c$ such that $x_c \not\in P_H$, then $(x_c \in P_H \land x_c \in P_W) \to x_c \not\in P_H$ would be true.

Notice that given $\Gamma; \forall x (\lnot ((x \in P_H \land x \in P_W) \to x \not\in P_H))$, by substituting $x$ with $x_c$ we get $\lnot ((x_c \in P_H \land x_c \in P_W) \to x_c \not\in P_H)$, but that would be inconsistent with our previous assumption. Thus by Reductio ad Absurdum, $\Gamma \vdash \lnot \forall x (\lnot ((x \in P_H \land x \in P_W) \to x \not\in P_H))$.

Now that we can be easily convinced that our assumption holds, that is, there exists something that is not a horse. So this formulation would be trivially true!

***Exercise 8.3.***
$$\exists x (((x \in P_H \land x \in P_W) \land \forall y ((y \in P_H \land y \in P_W) \to y = x)) \land x \in P_W)$$



## References and further reading

**Books:**

W. V. O. Quine, *Mathematical Logic*.

**Papers:**
