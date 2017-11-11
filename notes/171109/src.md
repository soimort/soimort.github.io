---
title: Underrated Gems (1)
subtitle: "Tarski's undefinability theorem"
author: Mort Yao
date: 2017-11-09
date-updated: 2017-11-11
category: logic
---

<small>

>
In a listless afternoon I questioned myself: What are some of the most neglected theorems that deserve more attention? Many famous old theorems in mathematics as I recalled, are about some kinds of *impossibilities*: $\sqrt{2}$ is irrational, $\pi$ is transcendental, polynomial equations of degree 5 or higher are generally insolvable, squaring the circle is impossible, Fermat's last theorem, etc; by arguing about impossibility they've landscaped lots of math subfields in a revolutionary way. Compared to mathematics, formal logic is a relatively young field, not really fruitful before Frege, and the study on the theory of computation is even less cultivated, with quite a bunch of landmarking results yet underrated or poorly informed. Among those neglected theorems in logic and computation, I decided to do a write-up on each one I ever heard of, to help myself understand them better. Undoubtedly, they ought to be brought to the limelight and made better understood by working mathematicians and programmers nowadays.
</small>

---

It should be put in the first paragraph of the preface to *[The Book](https://en.wikipedia.org/wiki/Paul_Erdős#Personality) on logic*, if there could be one, that *truth in any language cannot be defined in the same language*. We have the classical *liar's sentence* which says that "This sentence is false". If this kind of inconsistency does not seem too disastrous to bug you yet, as you may guarantee not to involve yourself into any circular reasoning, then think about the following *truth-teller's sentence*:

:=
If this sentence is true, then God exists.

Symbolically,

$$\sigma = (\text{True}(\sigma) \to \exists x\,\text{Godlike}(x))
$$

If you take this sentence to be false, then since it is a material conditional the only way it can ever be false is that the antecedent ($\text{True}(\sigma)$) is true but the consequent ($\exists x\,\text{Godlike}(x)$) is false. However, from that $\text{True}(\sigma)$ is true we would immediately get that $\sigma$ is true, which contradicts our assumption that $\sigma$ is false. On the other hand, if you take this sentence to be true, then everything should work perfectly: $\text{True}(\sigma)$ is true, $\exists x\,\text{Godlike}(x)$ is also true, therefore the whole sentence $\sigma$ is true, which just verifies the fact that $\text{True}(\sigma)$ is true. Therefore, to maintain logical consistency in our reasoning, the only choice for a rational person is to accept the truth of $\exists x\,\text{Godlike}(x)$, i.e., "God exists."

This is not really about the ontological argument of God's existence; it's about how the inherent inconsistency of an unrestricted language can lead to any random truth trivially (*ex contradictione quodlibet*). If you believe that the above argument is all reasonable and God indeed exists, try yourself on the following sentence:

:=
If this sentence is true, then Satan rules the world.

Let's say, get it over since natural language is so tricky and facile but no one is really hurt by its expressive power.
^[One may find it intuitive to notice that, whether $\text{True}(\sigma)$ is true or not, it has nothing to do with the existence of God or whatever other claims of real interest. Indeed, instead of restricting our language as we do here, we could as well devise a restrictive set of inference rules for an alternative logic (e.g., [relevance logic](https://plato.stanford.edu/entries/logic-relevance/)) so that explosions can be expelled.]
The sure thing is, no serious mathematician wants to derive ridiculous random facts (e.g., if some self-referential proposition is true, then "$2 + 2 = 3$"), so in a *formal language* we are obliged to have a metatheorem like:

**Undefinability theorem (Tarski 1936).** Let $\mathcal{L}$ be a formal language, and let $\mathfrak{A}$ be an $\mathcal{L}$-structure, with its theory $\operatorname{Th}\mathfrak{A}$ capable of representing all computable functions. A Gödel numbering $\mathfrak{g}(\phi)$ is defined for every $\mathcal{L}$-formula $\phi$. There is no formula $\text{True}(n)$ such that for every $\mathcal{L}$-formula $\varphi$, $\text{True}(\mathfrak{g}(\varphi)) \leftrightarrow \varphi$.

Before proceeding with the proof of Tarski's undefinability theorem, we get our terminology straight first and prove a very important lemma, namely the *diagonal lemma*. The definitions of language, structure and theory are already made in [Mst. #7](/mst/7/). The capability of representing all computable functions can be informally understood as, for every Turing-computable function $f : x \mapsto y$, there is an $\mathcal{L}$-formula $\gamma_f$ such that $\gamma_f(x, y) \in \operatorname{Th}\mathfrak{A} \leftrightarrow y = f(x)$.

A Gödel numbering in a formal language $\mathcal{L}$ is an injective function $\mathfrak{g} : \Phi \to \mathbb{N}$ that maps every $\mathcal{L}$-formula to a unique natural number $n \in \mathbb{N}$. It may be defined in any way that satisfies the desired injective property. For example, in a first-order language $\mathcal{L}_\text{Set}$ consisting of only variables $x_i$ ($i = 0, 1, 2, \dots$), two connective symbols $\{ \to, \neg \}$, the equality symbol $=$, the quantifier symbol $\forall$ and a predicate symbol $\in$, one possible Gödel numbering function may be defined inductively as

\begin{align*}
\mathfrak{g}(x_i) &= 2^0 \cdot 3^i \\
\mathfrak{g}(= t_1 t_2) &= 2^1 \cdot 3^{\mathfrak{g}(t_1)} \cdot 5^{\mathfrak{g}(t_2)} \\
\mathfrak{g}(\in t_1 t_2) &= 2^2 \cdot 3^{\mathfrak{g}(t_1)} \cdot 5^{\mathfrak{g}(t_2)} \\
\mathfrak{g}((\neg \psi)) &= 2^3 \cdot 3^{\mathfrak{g}(\psi)} \\
\mathfrak{g}((\psi \to \theta)) &= 2^4 \cdot 3^{\mathfrak{g}(\psi)} \cdot 5^{\mathfrak{g}(\theta)} \\
\mathfrak{g}(\forall x_i \psi) &= 2^5 \cdot 3^i \cdot 5^{\mathfrak{g}(\psi)} \\
\end{align*}

:<
(*)

**Claim 1.** (*) defines a Gödel numbering $\mathfrak{g}$ on the language $\mathcal{L}_\text{Set}$. That is, for any $\mathcal{L}_\text{Set}$-formulas $\varphi_1$ and $\varphi_2$, if $\mathfrak{g}(\varphi_1) = \mathfrak{g}(\varphi_2)$, then $\varphi_1 \cong \varphi_2$.

**Proof idea.** By structural induction on the formula and the [fundamental theorem of arithmetic](https://en.wikipedia.org/wiki/Fundamental_theorem_of_arithmetic) (every integer greater than 1 has a unique prime-factorization).

**Example 2.** The Gödel number of formula $\forall x_0 (\neg \in x_0 x_0)$ using (*) is

\begin{align*}
\mathfrak{g}(\forall x_0 (\neg \in x_0 x_0))
&= 2^5 \cdot 3^0 \cdot 5^{\mathfrak{g}(\neg \in x_0 x_0)}
= 2^5 \cdot 3^0 \cdot 5^{2^3 \cdot 3^{\mathfrak{g}(\in x_0 x_0)}}
= 2^5 \cdot 3^0 \cdot 5^{2^3 \cdot 3^{2^2 \cdot 3^{2^0 \cdot 3^0} \cdot 5^{2^0 \cdot 3^0}}} \\
&= 2^5 \cdot 3^0 \cdot 5^{2^3 \cdot 3^{60}} \\
&= 32 \cdot 5^{339129266201729628114355465608}
\end{align*}

Note that the choice of our numbering function is purely technical; it doesn't make any difference if we choose another set of prime numbers $\{5, 7, 11\}$ instead of $\{2, 3, 5\}$ as basis, as long as the decomposition of a Gödel number is unique. (Of course, such numbers would be even bigger.)

So, what is the whole point of this numbering thing, you might ask? As is shown in Example 2, a simple formula can yield a Gödel number which is insanely large (no kidding, even *much* greater than the total number of atoms in the universe!). We don't actually use these numbers; we construct them just to convince ourselves that we *can* encode virtually any theory into the theory of arithmetic, or literally, strings into natural numbers. The overwhelming cost (complexity) is not of our concern for now. Hence, from now on, we can virtually reduce any problem in a formal language (set theory, type theory, analysis, geometry, ...) to an arithmetical problem, i.e., a problem simply about manipulating and deciding on natural numbers.

**Diagonal lemma (Carnap 1934).** Let $\mathcal{L}_\text{A}$ be a first-order language of arithmetic, and let $\mathfrak{A}$ be an $\mathcal{L}_\text{A}$-structure, with its theory $\operatorname{Th}\mathfrak{A}$ capable of representing all computable functions. Let $\phi$ be an $\mathcal{L}_\text{A}$-formula with one free variable. There is a sentence $\psi$ such that $\psi \leftrightarrow \phi(\mathfrak{g}(\psi))$ in $\operatorname{Th}\mathfrak{A}$.

**Proof.** Let $f$ be a total function defined on $|\mathfrak{A}| = \mathbb{N}$:
$$f(\mathfrak{g}(\theta)) = \mathfrak{g}(\theta(\mathfrak{g}(\theta)))$$
for each $\mathcal{L}_\text{A}$-formula $\theta$ with one free variable; otherwise, define $f(n) = 0$.

Since $f$ is a computable function, there is a formula $\gamma_f$ representing $f$ in $\operatorname{Th}\mathfrak{A}$. That is, for each formula $\theta$, we have in $\operatorname{Th}\mathfrak{A}$
$$\forall y\,(\gamma_f(\mathfrak{g}(\theta), y) \leftrightarrow y = f(\mathfrak{g}(\theta)))$$
which is just
$$\forall y\,(\gamma_f(\mathfrak{g}(\theta), y) \leftrightarrow y = \mathfrak{g}(\theta(\mathfrak{g}(\theta))))$$
Define the formula $\beta$ (with one free variable) as
$$\beta(z) = \forall y\,(\gamma_f(z,y) \to \phi(y))$$
Then we have in $\operatorname{Th}\mathfrak{A}$
$$\beta(\mathfrak{g}(\theta)) \leftrightarrow \forall y\,(y = \mathfrak{g}(\theta(\mathfrak{g}(\theta))) \to \phi(y))$$
which is just
$$\beta(\mathfrak{g}(\theta)) \leftrightarrow \phi(\mathfrak{g}(\theta(\mathfrak{g}(\theta))))$$
Since $\theta$ can be any $\mathcal{L}_\text{A}$-formula, let $\theta = \beta$. Then we have in $\operatorname{Th}\mathfrak{A}$
$$\beta(\mathfrak{g}(\beta)) \leftrightarrow \phi(\mathfrak{g}(\beta(\mathfrak{g}(\beta))))$$
Let $\psi = \beta(\mathfrak{g}(\beta))$. Thus we have in $\operatorname{Th}\mathfrak{A}$
$$\psi \leftrightarrow \phi(\mathfrak{g}(\psi))$$
Therefore we obtain $\psi$ which is the required sentence ("fixed point").
\Qed

Now we are all set to prove the undefinability theorem:

**Proof.** By reductio ad absurdum: Suppose that there is an $\mathcal{L}$-formula $\text{True}(n)$ such that for every $\mathcal{L}$-formula $\varphi$, $\text{True}(\mathfrak{g}(\varphi)) \leftrightarrow \varphi$. In particular, if $\sigma$ is a sentence, then $\text{True}(\mathfrak{g}(\sigma))$ holds in $\mathfrak{A}$ iff $\sigma$ is true in $\mathfrak{A}$. Thus for all $\sigma$, $\text{True}(\mathfrak{g}(\sigma)) \leftrightarrow \sigma$ holds in $\operatorname{Th}\mathfrak{A}$. However, by the diagonal lemma, there is also a sentence $\psi$ such that $\psi \leftrightarrow \neg \text{True}(\mathfrak{g}(\mathfrak{\psi}))$ in $\operatorname{Th}\mathfrak{A}$. That is a contradiction. Therefore, such a formula $\text{True}(n)$ does not exist.
\Qed

Tarski's undefinability theorem, along with the auxiliary diagonal lemma, showed some really fundamental limitative results in formal logic, and even more. The diagonal lemma obtained its name from the ingenious [Cantor's diagonal argument](https://ncatlab.org/nlab/show/Cantor%27s+theorem), which reveals the well-known fact that the set $\mathbb{R}$ of all real numbers is uncountable. The similar trick of diagonalization has been exploited in multiple contextually different but essentially interwoven arguments, e.g., Gödel's incompleteness theorems, and that the halting problem is undecidable. The category-theoretic generalization of this lemma is known as [Lawvere's fixed-point theorem](https://ncatlab.org/nlab/show/Lawvere%27s+fixed+point+theorem), applicable in any cartesian closed category.

Let's consider an informal but intuitive connection between the undefinability theorem and the (renowned) incompleteness theorem. Given the fact that the universal truth-telling formula $\text{True}(n)$ is undefinable in a formal language, one may wonder, "If some statement is true, then by the completeness theorem of first-order logic it can always be proven true. But if truth is not even definable at all, how do I know if any statement could as well be *proven false*?"

Here's the thing. We don't. If we do, we would be able to tell truth from falsehood completely and *provably*. That is to say, for every formula $\varphi$ in our language, there would be either a proof ($\vdash \varphi$) or a disproof ($\vdash \varphi \to \bot$ or $\vdash \neg \varphi$) of it; the class of all such proofs would just make a perfect $\text{True}(n)$, while $\text{True}(\mathfrak{g}(\varphi))$ holds if and only if $\varphi$ has a proof! That would contradict the undefinability theorem. So necessarily, we must take for granted that there could be some falsehood in a logical system (which is powerful enough to represent all computable functions via Gödel numbering, e.g., a number theory of elementary arithmetic) of which existence we can never disprove (because otherwise we could have defined that $\text{True}(n)$). Plug this metastatement into Löb's theorem: (Let the modal operator $\square$ denote the modality of provability, and let the constant $\bot$ denote the falsehood.)
\begin{align*}
& \square (\square \bot \to \bot) \to \square \bot \\
\iff & \square (\neg \square \bot) \to \square \bot &\qquad\text{(Definition of negation)} \\
\iff & \square (\neg \square \bot) \to \bot &\qquad\text{(Axiom T and transitivity)}\\
\iff & \neg \square (\neg \square \bot) &\qquad\text{(Definition of negation)}\\
\end{align*}
which informally says "It is not provable that falsehood is not provable." which is just another way of claiming that $\mathfrak{N} \not\vdash \operatorname{Cons}\mathfrak{N}$, the consistency of the logical system cannot be proved from within the system itself, a.k.a. Gödel's second incompleteness theorem.

Digressing a little from our main topic, formal logic, let's consider the application of the undefinability theorem to programming language theory as a dessert. It is well understood that, by the [Curry-Howard correspondence](https://en.wikipedia.org/wiki/Curry–Howard_correspondence), a logical formula corresponds to a type, and a type checker of a programming language guarantees that every well-typed program consists of only types that correspond to valid formulas. If you write some sophisticated type and its type checking succeeds, the underlying formula must be valid as you have just proved that (so-called "programs are proofs"). Now, I challenge you, given a hypothetical, reasonably expressive programming language with full dependent types, can you write a type-checked [self-interpreter](https://en.wikipedia.org/wiki/Meta-circular_evaluator) in it? Once you succeed, you would have proved that you can actually tell valid formulas (types) from false ones in all cases (by writing a self-interpreter that accepts only well-typed programs), thus effectively define the truth in the language itself. By the undefinability theorem, that would be impossible (otherwise your underlying logical system can't be consistent!). A slightly different but related result is that *a total programming language can't have a self-interpreter*; since a total language is not necessarily equipped with a type system or alike proof-theoretic constructions, the undefinability theorem may not directly apply, but a computability-theoretic argument of this is analogously diagonal (see [[5]](https://cstheory.stackexchange.com/a/24994/21291)).
^[I am aware of the "self-interpreter" for System $\text{F}_\omega$ proposed in a POPL'16 paper by Brown & Palsberg [[6]](http://compilers.cs.ucla.edu/popl16/popl16-full.pdf). According to a footnote in [[7]](https://jasongross.github.io/lob-paper/nightly/lob.pdf) and also from my unrefined understanding, the interpreter does not come with a separate syntax for types thus fails to capture the underlying logical consistency; therefore neither Löb's theorem nor the undefinability theorem may apply in that case.]



## References

[1] Wikipedia, "Diagonal lemma".
<https://en.wikipedia.org/wiki/Diagonal_lemma>

[2] Wikipedia, "Tarski's undefinability theorem".
<https://en.wikipedia.org/wiki/Tarski%27s_undefinability_theorem#General_form_of_the_theorem>

[3] nLab, "Lawvere's fixed point theorem".
<https://ncatlab.org/nlab/show/Lawvere%27s+fixed+point+theorem>

[4] nLab, "Löb's theorem".
<https://ncatlab.org/nlab/show/Löb%27s+theorem>

[5] Andrej Bauer, "Answer to: A total language that only a Turing complete language can interpret".
<https://cstheory.stackexchange.com/a/24994/21291>

[6] Matt Brown and Jens Palsberg, "Breaking Through the Normalization Barrier: A Self-Interpreter for F-omega".
<http://compilers.cs.ucla.edu/popl16/popl16-full.pdf>

[7] Jason Gross, Jack Gallagher and Benya Fallenstein, "Löb's Theorem -- A functional pearl of dependently typed quining".
<https://jasongross.github.io/lob-paper/nightly/lob.pdf>

[8] Herbert B. Enderton, *A Mathematical Introduction to Logic*, 2nd ed.
