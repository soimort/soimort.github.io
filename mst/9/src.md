---
title: The Semantic Truth
subtitle: Truth, arguments, and alternative logics.
author: Mort Yao
date: 2017-10-07
date-updated: 2017-10-17
---

> "This is clear, in the first place, if we define what the true and the false are. To say of what is that it is not, or of what is not that it is, is *false*, while to say of what is that it is, and of what is not that it is not, is *true*."

:< -- Aristotle, *Metaphysics*



---

**On truth-bearers.** A *truth-bearer* is something of what we can talk about the truth-value: a *statement*, a *sentence*, a *proposition*, etc. We will use the three aforementioned notions indistinguishably, but avoid the use of subjective notions such like *assertion*, *belief*, *intuition* and *judgment* as truth-bearers. (These words however, can occur with their originally intended meanings.)

In [Mst. #7](/mst/7/) we defined that (in a formal language) a sentence is just a well-formed formula with no free variable. Furthermore, in [Mst. #8](/mst/8/) we defined a statement, naïvely, as a sentence that says something is true. But what makes a sentence true, or oppositely, not true?

**Aristotle's definition of truth.** Aristotle's original truth definition in *Metaphysics* (360s B.C.) can be denoted using the modern device of Quine's quasi-quotation, as follows:

:=
 ⌜$\psi$⌝ is *true* if and only if $\psi$.
\
 ⌜$\psi$⌝ is *false* if and only if it is not the case that $\psi$.

Note that " ⌜$\psi$⌝" is a *mention* of some statement while "$\psi$" is the *use* of that statement in the metalanguage, so the above definition does make sense (instead of some "be whatever you be" nonsense as it might seem to an untrained eye).

An implication of this definition, is that "false" is the opposite of "true". The bivalence of truth and falsity is an essential property of classical logic. Thus, we have the following tautology:
$$\psi \lor \lnot\psi \qquad\text{(Law of Excluded Middle)}$$
that is, given any interpretation, whether $\psi$ is true or false, the above proposition is always true (or said to be *valid*). This fact may be justified via a truth table.

**Theories of truth.** From a metaphysical perspective, several theories of truth have been proposed and well argued:

* **Correspondence theory**: The truth is determined solely by how it relates to the world and whether it describes a fact about that world.
    * For a statement to be true, there must be an isomorphism to it from the state of the real world that makes it true. Hence, the correspondence view is mainly accepted by realists/Platonists but rejected by most idealists.
* **Coherence theory**: The truth is determined by how consistent it is with our existing, coherent set of statements or beliefs.
* **Pragmatic theory**: The truth is determined by how well it enables us to achieve our goals.
* **Deflationary theory** (alternatively under the labels of **redundancy theory**, **disquotational theory**, **prosentential theory** or **minimalist theory**): The assertion of truth of a statement is nothing but an assertion of the statement itself; it does not attribute a property called "truth" to such a statement.
    * The most widely accepted definitions of truth in modern treatment of formal logic (by Frege, [F. P. Ramsey](https://en.wikipedia.org/wiki/Frank_P._Ramsey), Quine, etc.), are deflationary in essence.

<blockquote style="background:gainsboro; border-radius:1em; padding:.25em 1em; font-size:.8em">
:=
***Reading list***

On the notion of truth and truth-bearers:

* Michael Glanzberg, "Truth," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/truth/>.
* Matthew McGrath, "Propositions," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/propositions/>.

Correspondence theory:

* Marian David, "The Correspondence Theory of Truth," Stanford Encyclopedia of Philosophy, <http://plato.stanford.edu/entries/truth-correspondence/>.

Coherence theory:

* James O. Young, "The Coherence Theory of Truth," Stanford Encyclopedia of Philosophy, <http://plato.stanford.edu/entries/truth-coherence/>.

Pragmatic theory:

* Christopher Hookway, "Pragmatism," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/pragmatism/#PraTheTru>.

Deflationary theory:

* Daniel Stoljar and Nic Damnjanovic, "The Deflationary Theory of Truth," Stanford Encyclopedia of Philosophy, <http://plato.stanford.edu/entries/truth-deflationary/>.

Ramsey's redundancy theory of truth (a deflationary theory):

* Frank P. Ramsey, "Facts and Propositions." [[PDF]](https://www.aristoteliansociety.org.uk/pdf/ramsey.pdf)

</blockquote>



Now we consider a (semi-)formal language where we are able to state truth self-referentially.

**Antinomies.**

1. *Liar's paradox.*

:=
This sentence is false.

2. *Quine's paradox.*

:=
"Yields falsehood when preceded by its quotation" \
yields falsehood when preceded by its quotation.

If we take the truth (or falsity) of a statement to be bivalent, then the truth-values of the above two sentences could not be consistently determined. Such antinomies motivated [Alfred Tarski](https://plato.stanford.edu/entries/tarski/)'s proposal of the semantic theory of truth, which eliminates such potentially paradoxical use in a formal language.

**Semantic theory of truth. (Tarski, 1933)**
Given an object language $\mathcal{L}_0$ and a metalanguage $\mathcal{L}_1$,

:=
⌜$\psi_0$⌝ is *true* if and only if $\psi_1$.
(Convention T)

where "$\psi_0$" is a sentence in $\mathcal{L}_0$, "$\psi_1$" is a sentence in $\mathcal{L}_1$. It is demanded that $\mathcal{L}_0$ must be contained in $\mathcal{L}_1$. Moreover, the word "true" (or "false") does not occur in $\psi_0$. Thus, no sentence in the object language $\mathcal{L}_0$ can assert the truth/falsity of itself; rather, its truth-value must be asserted by a higher-level metalanguage $\mathcal{L}_1$. Virtually, it would be intuitive to imagine a semantic hierarchy of formal languages that rules out the use of self-reference:
$$\mathcal{L}_0 \sqsubset \mathcal{L}_1 \sqsubset \mathcal{L}_2 \sqsubset \cdots$$
that is, the truth of a sentence in an object language $\mathcal{L}_i$ can only be asserted in $\mathcal{L}_{i+1}$ as the metalanguage. Since there is no final stage in this hierarchy, the "most-meta" truths may never be asserted.

**T-schema.** For a formal language containing a given set of logical connective symbols, we give an inductive definition of truth in the following form:

1. ⌜$\psi$⌝ is true if and only if $\psi$.
2. (*Negation*) ⌜$\lnot\psi$⌝ is true if and only if $\psi$ is not true.
3. (*Conditional*) ⌜$\psi \to \theta$⌝ is true if and only if $\psi$ is not true or $\theta$, or both.
4. (*Conjunction*) ⌜$\psi \land \theta$⌝ is true if and only if $\psi$ and $\theta$.
5. (*Disjunction*) ⌜$\psi \lor \theta$⌝ is true if and only if $\psi$ or $\theta$, or both.
6. (*Universality*) ⌜$\forall x \psi(x)$⌝ is true if and only if every object $x$ satisfies $\psi(x)$.
7. (*Existence*) ⌜$\exists x \psi(x)$⌝ is true if and only if there is an object $x$ that satisfies $\psi(x)$.

(Note that the subscripts distinguishing the object language / metalanguage are implicit.)

Tarski's semantic theory of truth is not only limited to the application in philosophical logic though: A similar definition is also used in model theory, where we [define the satisfaction](https://wiki.soimort.org/math/logic/fol/structures/) of a formula $\varphi$ with respect to a structure $\mathfrak{A}$ and an assignment $s$ inductively.

**Remark 9.1. (Semantic theory of truth and mathematical logic)**
The mathematical counterpart of Tarski's semantic theory of truth yields the **undefinability theorem (Tarski, 1936)**, which briefly states that arithmetical truth cannot be defined in arithmetic itself (it is worth noting that the proof is a non-trivial one which requires Gödel numbering on formulas in a formal language). The semantic undefinability also has a strong correspondence with the **incompleteness theorems (Gödel, 1931)**, which will be covered in future notes hopefully.

<blockquote style="background:gainsboro; border-radius:1em; padding:.25em 1em; font-size:.8em">
:=
***Reading list***

On Tarski's semantic theory of truth:

* Wilfrid Hodges, "Tarski's Truth Definitions," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/tarski-truth/>.
* Alfred Tarski, "The Semantic Conception of Truth: And the Foundations of Semantics." [[HTML]](http://www.ditext.com/tarski/tarski.html)
* Alfred Tarski, "Truth and Proof." [[PDF]](https://cs.nyu.edu/mishra/COURSES/13.LOGIC/Tarski.pdf)

</blockquote>



**Truth and objectivity.**
Is truth objective? Yes. Given the object language $\mathcal{L}_0$, consider a sentence $\varphi[s]$ which is true under the model $\mathfrak{A}$:
$$\models_\mathfrak{A} \varphi[s]$$
It is true because we can argue in our metalanguage $\mathcal{L}_1$, that it is satisfied decidedly; thus it must be a truth in the object language. For example, we can argue extensionally that
$$\models_\mathfrak{A} \text{Morning Star} = \text{Evening Star}$$
Opinionatedly, there could be no such thing as a "subjective truth", since the truth of a sentence must be justified in a higher-level metalanguage (due to the semantic theory of truth). Per the object-metalanguage distinction, truth is only objective by nature. Once we claim that "something holds" without appealing to a metalanguage for justification, then it is merely a *belief* rather than a *truth*. Beliefs can be, of course, illogical and ungrounded.

**Logical validity of arguments.**
A true sentence may not always be true in every possible structure. Consider:
$$\models_\mathfrak{B} \text{Morning Star} = \text{Evening Star}$$
In an alternative universe $\mathfrak{B}$ where Venus fails to be both the morning star and the evening star, such a statement would be trivially false. However, a logical argument must not depend on a specific structure or interpretation of its parameters; that is, when we argue logically that something is true, the argument itself must hold *valid*. Validity is a purely logical notion here. For example, consider adding the following axiom to our deductive system:
$$t = t' \to t \cong t'$$

One can easily verify that this axiom is valid (i.e., always true): If $t = t'$ is false, then $t = t' \to t \cong t'$ is vacuously true; if $t = t'$ is true, then we have $t \cong t'$ so $t = t' \to t \cong t'$ is also true.

Specifically, we have

:=
$\text{Morning Star} = \text{Evening Star} \to \text{Morning Star} \cong \text{Evening Star}$ \
(If the morning star *is* the evening star, then it *is isomorphic to* the evening star.)

By modus ponens, the following deduction applies:

:=
$\Gamma; \text{Morning Star} = \text{Evening Star} \quad\vdash\quad
\text{Morning Star} \cong \text{Evening Star}$ \
(Assume that the morning star *is* the evening star, then it *is isomorphic to* the evening star.)

This is a valid argument, since it follows solely from our set of axioms and rules of inference, but relies on no particular structures or interpretations. Such a valid argument justifies the logical fact that the truth of its premises guarantees the truth of its conclusion; this, however, does not imply anything about the truth of premises (that would depend on the actual interpretation).

**Soundness of arguments.**
To put it shortly, a *sound* argument is just a valid argument with true premises.

:=
$\frac{\text{Morning Star} = \text{Evening Star} \qquad \text{Morning Star} = \text{Evening Star} \to \text{Morning Star} \cong \text{Evening Star}}{\text{Morning Star} \cong \text{Evening Star}}$ \
(Given that the morning star *is* the evening star, it *is isomorphic to* the evening star.)

Given true premises, the valid argument proves its conclusion: $\text{Morning Star} \cong \text{Evening Star}$, and we know that it is guaranteed to be true. Such a truth is also called a *logical truth*, since it follows from a logical consequence of a sound argument in our deductive system.
Notice that the above is just an instance of the **soundness theorem**, loosely stated as: Every provable sentence is true.

**Two approaches to logical consequence.**

1. *Model-theoretic* (or "realist") approach. The validity of an argument is justified by the *absence of counterexample*. That is, if we can ever find a structure $\frak{A}$ and an assignment function $s : V \to |\mathfrak{A}|$ such that $\frak{A}$ satisfies every formula in hypotheses $\Gamma$ with $s$, but $\frak{A}$ fails to satisfy $\varphi$ with $s$, we will conclude that $\Gamma \not\models \varphi$. Otherwise, we will have $\Gamma \models \varphi$, where $\varphi$ is a logical truth.
2. *Proof-theoretic* (or "formalist") approach. The validity of an argument is justified by a *deduction*. That is, from our set of hypotheses and axioms $\Gamma \cup \Lambda$ we obtain $\varphi$ by applying various rules of inference as a finite sequence, then $\Gamma \vdash \varphi$, where $\varphi$ is a logical truth.

By the soundness and completeness theorems $\Gamma \models \varphi \Leftrightarrow \Gamma \vdash \varphi$, the two approaches agree with each other extensionally.

<blockquote style="background:gainsboro; border-radius:1em; padding:.25em 1em; font-size:.8em">
:=
***Reading list***

Philosophical logic-related issues:

* Jc Beall and Greg Restall, "Logical Consequence," Stanford Encyclopedia of Philosophy, <http://plato.stanford.edu/entries/logical-consequence/>.
* Dorothy Edgington, "Indicative Conditionals," Stanford Encyclopedia of Philosophy, <http://plato.stanford.edu/entries/conditionals/>.
* Michael Nelson, "Existence," Stanford Encyclopedia of Philosophy, <http://plato.stanford.edu/entries/existence/>.

</blockquote>



**Motivations of alternative logics.**
In classical first-order logic, a deductive system preserves the semantic property of truth, as justified by the dual theorems of soundness/completeness. We will see that it does not always sufficiently capture the need for logical reasoning, thus numerous alternative (non-classical) logics has emerged for this reason.

* **Modality.** Instead of saying that something is the case, a modal statement says about what *could be* or *must be* the case, e.g., "Venus must be the morning star", "Venus could be both the morning star and the evening star". **Modal logic** supplements classical logic with two modal operators representing the notions of *necessity* (□) and *possibility* (◇).
* **Temporality and tense.** Instead of saying that something is the case, a temporal statement says something to be the case as qualified in terms of time, e.g., "Venus is always the morning star", "The evening star will eventually be visible". **Temporal logic** (or **tense logic**) supplements classical logic with a set of temporal modal operators.
* **Vagueness.** While we could simply say that something is true or false, sometimes questions like "how true is that?" arise, e.g., "Venus is a distant planet". The vagueness of predicates in natural languages leads to the approach of **many-valued logic**, where we are able to speak of truth-values like "fully true", "fully false" or "neutral" (**three-valued logic**), or even any real truth-value in between the interval $[0,1]$ (infinite valued **fuzzy logic**).
* **Heterogeneity.** In the semantics of classical logic, the universe (domain) is assumed to be a homogeneous collection of objects. **Many-sorted logic** allows us to divide the universe into disjoint subsets (sorts) so as to treat objects of different sorts differently.
* **Quantification into predicates.** In first-order logic, one can only quantify over a variable in the universe. Using the notation of set theory:
$$v \in |\mathfrak{A}|$$
where $v$ is an *urelement* (i.e., not a set itself). \
In **second-order logic**, any predicate or function may be quantified over as a "second-order variable" (which essentially represents a set), in the power set of the universe:
$$P \subseteq |\mathfrak{A}|^n \in \mathcal{P}(|\mathfrak{A}|)$$
$$f \subseteq |\mathfrak{A}|^{n+1} \in \mathcal{P}(|\mathfrak{A}|)$$
In an **$n$-th-order logic**, one can quantify over an $n$-th-order variable $\chi$ in the $(n-1)$-th-order power set of the universe: (When $n=1$, the domain is just the original universe.)
$$\chi \in \mathcal{P}^{n-1}(|\mathfrak{A}|)$$
Therefore, we can say that higher-order logics are just "set theory in disguise" (Quine), since the set theory in a first-order language is capable of representing notions like "set", "set of sets", etc. \
It is worth mentioning here that since the power set operation is definable in second-order logic, second-order logic is expressive enough to simulate any finite-order logic. [@hintikka1955two]
* **Empty terms or domains.** In classical logic, a structure $\mathfrak{A}$ (with a non-empty domain $|\mathfrak{A}|$) assigns each term an interpretation. **Free logic** allows for uninterpreted terms (that do not denote any object); furthermore, **inclusive logic** allows structures to have an empty domain $|\mathfrak{A}| = \emptyset$.

It is not uncommon to revise one or more axioms in classical first-order logic. The resulting non-classical logics can be useful in a constructive setting.
In the following text, we will use syntactical forms like $\alpha \to \beta$ to denote both a tautological conditional sentence and a valid deduction rule ($\{\alpha\} \vdash \beta$), as justified by the dual theorems of deduction/resolution.

* **Justification.** In classical logic we accept the principle of bivalence (i.e., anything is either true or false), thus we have the following tautologies:
$$\psi \lor \lnot\psi \qquad\text{(Law of Excluded Middle)}$$
$$\lnot\lnot\psi \to \psi \qquad\text{(Double Negation Elimination)}$$
$$(\lnot \psi \to \bot) \to \psi \qquad\text{(Proof by Contradiction)}$$
which are denied by **intuitionistic logic**. From a model-theoretic view, there could be logical truths that are not flawed, but not necessarily well justified. In a word, intuitionistic logic attempts to capture the semantic property of *justification* instead of truth. Particularly, in classical logic, assume that we can prove $\forall x (\lnot\varphi) \to \bot$, then $\lnot\lnot \forall x (\lnot\varphi) \to \bot$, by PbC we get $\lnot \forall x (\lnot\varphi)$, which is just $\exists x \varphi$ -- but we have no evidence that such a "witness" $t$ (which truthifies $\varphi^x_t$) really exists yet. This intuitionistic thinking is extremely helpful in the so-called *constructive mathematics*, where the proof of the existence of a mathematical object requires a justification by providing an example.
* **Inconsistency.** In classical and intuitionistic logics we accept the principle of explosion (*ex falso quodlibet*), that is, a contradiction $\psi \land \lnot\psi$ (often abbreviated as $\bot$) would make a theory inconsistent, thus any sentence $\theta$ is trivially true:
$$(\psi \land \lnot\psi) \to \theta \qquad\text{(Ex Falso Quodlibet)}$$
Sometimes, however, we are interested in formalizing inconsistent theories in a non-trivial way, in which case trivial truths by explosion must be excluded from our system. **Paraconsistent logic** is any such logic that rejects EFQ (or its equivalents). Specifically, **minimal logic** is the paraconsistent revision of intuitionistic logic.

In proof theory, *substructural logics* are a family of non-classical logics where one (or more) [structural rule](https://en.wikipedia.org/wiki/Structural_rule) (e.g., weakening, contraction, commutativity, associativity) is absent.

* **Relevance of implication.** In classical logic we have the following tautologies (involving material/strict implication):
$$\psi \to (\theta \to \psi) \qquad\text{(1)}$$
$$\lnot\psi \to (\psi \to \theta) \qquad\text{(2)}$$
$$(\psi \to \theta) \lor (\theta \to \phi) \qquad\text{(3)}$$
$$\psi \to (\theta \to \theta) \qquad\text{(4)}$$
$$\psi \to (\theta \lor \lnot\theta) \qquad\text{(5)}$$
It is easy to see that they all turn out to be counterintuitive in some way. For example, by (1) we are allowed to argue things like "If Mars is a planet, then Venus is a star implies that Mars is a planet", but this is clearly absurd not only because Venus isn't astronomically a star, but also because the fact whether Venus is a star or not, has no direct relevance with Mars being a planet. But the whole sentence is valid in classical logic!
**Relevance logic** denies these tautologies, since its implication $\to$ requires that the antecedent must be somehow relevant to the consequent. Relevance logic is both a substructural logic (as it lacks of the structural rule of weakening) and a paraconsistent logic (as it clearly denies EFQ from which any irrelevant truth is trivially deducible).
* **Resource consciousness.** With an emphasis on resource boundedness, **linear logic** leaves out both structural rules of weakening and contraction, as a reflection of the limitation that resources cannot always be duplicated or thrown away arbitrarily.
* Other substructural logics include **affine logic**, which allows the structural rule of weakening but disallows contraction; **ordered logic** (non-commutative logic), which disallows the rule of exchange (commutativity) in addition to rejecting weakening and contraction.



<blockquote style="background:gainsboro; border-radius:1em; padding:.25em 1em; font-size:.8em">
:=
***Reading list***

On classical logic:

* Stewart Shapiro, "Classical Logic," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/logic-classical/>.

On modality and modal logic:

* Boris Kment, "Varieties of Modality," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/modality-varieties/>.
* James Garson, "Modal Logic," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/logic-modal/>.

On temporality, tense and temporal logic:

* Friedrich Hamm and Oliver Bott, "Tense and Aspect," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/tense-aspect/>.
* Valentin Goranko and Antony Galton, "Temporal Logic," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/logic-temporal/>.

On vagueness, many-valued logic and fuzzy logic:

* Roy Sorensen, "Vagueness," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/vagueness/>.
* Siegfried Gottwald, "Many-Valued Logic," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/logic-manyvalued/>.
* Petr Cintula, Christian G. Fermüller and Carles Noguera, "Fuzzy Logic," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/logic-fuzzy/>.

On quantification, second-order and higher-order logic, and their correspondence with set theory:

* Gabriel Uzquiano, "Quantifiers and Quantification," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/quantification/>.
* Herbert B. Enderton, "Second-order and Higher-order Logic," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/logic-higher-order/>.
* Jouko Väänänen, "Second-Order Logic and Set Theory." [[PDF]](http://www.math.helsinki.fi/logic/people/jouko.vaananen/Vaananen_Compass.pdf)

On free logic:

* John Nolt, "Free Logic," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/logic-free/>.

On intuitionistic logic and constructive mathematics:

* Joan Moschovakis, "Intuitionistic Logic," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/logic-intuitionistic/>.
* Douglas Bridges and Erik Palmgren, "Constructive Mathematics," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/mathematics-constructive/>.
* David Meredith, "Separating Minimal, Intuitionist, and Classical Logic." [[PDF]](https://projecteuclid.org/download/pdf_1/euclid.ndjfl/1093870451)
* Michael Dummett, "The Philosophical Basis of Intuitionistic Logic."

On paraconsistent logic:

* Graham Priest, Koji Tanaka and Zach Weber, "Paraconsistent Logic," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/logic-paraconsistent/>.

On substructural logics, relevance logic and linear logic:

* Greg Restall, "Substructural Logics," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/logic-substructural/>.
* Edwin Mares, "Relevance Logic," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/logic-relevance/>.
* Roberto Di Cosmo and Dale Miller, "Linear Logic," Stanford Encyclopedia of Philosophy, <https://plato.stanford.edu/entries/logic-linear/>.

</blockquote>



## Towards higher-order logic (HOL) and type theory

As discussed by the subsection of "The limitation of first-order logic" in [Mst. #7](/mst/7/), a practical issue about first-order theory is that it provides no way to express the so-called "well-ordering property" (or its equivalents like the second-order induction axiom) of sets: Every non-empty set of numbers has a least element.
$$\forall P (\exists x Px \to \exists x (Px \land \forall y (Py \to (x = y \lor x < y))))$$

Recall that in first-order logic, we have notably the following model-theoretic results:

(1) (Completeness) $\Gamma \models \varphi \implies \Gamma \vdash \varphi$.
(2) (Compactness) If every finite subset $\Gamma_0$ of $\Gamma$ is satisfiable, then $\Gamma$ is satisfiable.
(3) (Enumerability) For a countable language, the set of valid formulas is computably enumerable.
(4) (Löwenheim-Skolem theorem) For a countable language, if a set of sentences has any model, then it has a countable model.

however, they do not generally hold in the standard semantics of second-order (or any higher-order) logic. As a naïve counterexample [@sep-logic-higher-order] disproving the compactness, consider a second-order sentence that defines a strict ordering $R$:
$$\exists R (\forall x \forall y \forall z (Rxy \land Ryz \to Rxz) \land \forall x (\lnot Rxx \land \exists y Rxy))$$
let $\lambda_\infty$ be the above sentence, which is true if and only if the universe is an infinite set. Let $\lambda_i$ be the first-order sentence saying that "there are at least $i$ urelements in the universe". Then the infinite set
$$\Gamma = \{ \lnot \lambda_\infty, \lambda_1, \lambda_2, \lambda_3, \dots \}$$
has no model, since $\lnot \lambda_\infty \land \lambda_\omega$ would be a contradiction. However, every finite subset of $\Gamma$ is clearly satisfiable.

Another intuitive way of thinking this is that since second-order logic is capable of *categorically* axiomatizing Peano arithmetic (i.e., there is at most one model of arithmetic up to isomorphism), but we would be able to build a non-standard model of arithmetic via ultraproducts given that the compactness theorem holds (as shown in [Mst. #7](/mst/7/)), therefore the compactness theorem must be false then.

In second-order logic, we have two separate "stages" of ranges that one may quantify over: variables and predicates/functions, denoted as set membership:
$$v_0 \in v_1 \in \mathcal{P}(|\mathfrak{A}|)$$

Naturally, in an $n$-th-order logic we have
$$v_0 \in v_1 \in \cdots \in v_{n-1} \in \mathcal{P}^{n-1}(|\mathfrak{A}|)$$

Once the order of logic is raised to the limit ordinal $\omega$, we reach the level of *type theory*. [@sep-logic-higher-order] Sloppily, in type theory, a type $\text{T}_i$ is just a set $V_i$, a function $\text{f} : \text{T}_x \to \text{T}_y$ is just a relation set $f$ such that $\forall x \forall y_1 \forall y_2 ((\langle x, y_1 \rangle \in f \land \langle x, y_2 \rangle \in f) \to y_1 = y_2)$, where $x \in V_x$ and $y_1, y_2 \in V_y$. Hence to accommodate the function type $\text{f}$, one needs a power set operation correspondingly in set theory. The $\omega$-infinite hierarchy of sets of sets:
$$V_0 \in V_1 \in \cdots \in V_n \in \cdots$$
where $V_0$ is the empty set $\varnothing$ (a set that has no members),
corresponds to the $\omega$-infinite hierarchy of types of types:
$$\text{Type}_0 : \text{Type}_1 : \cdots : \text{Type}_n : \cdots$$
where $\text{Type}_0$ is the bottom type (a type that has no values).

Both set theory and type theory can serve as logical foundations of mathematics [@sep-type-theory], owing to their equivalent expressive power [@Werner97setsin]. Some differences are worth noting:

#. Set theory is built on top of classical first-order logic (although there are recent proposals of intuitionistic set theories), with its semantics denoting a concrete model (e.g., ZFC); type theory is essentially an extension of higher-order logic, which is syntactically strong enough on its own.
#. Set theory tends to use a Hilbert-like deductive system, with its specific non-logical axioms (e.g., ZF axioms, Axiom of Choice); type theory tends to use a natural or Gentzen-like deductive system, with its specific logical rules of inference.
#. Set theory needs the Axiom of Regularity to establish its well-foundedness, and numbers must be encoded as well-founded sets; in type theory one may define inductive types directly, this makes handling models like Peano arithmetic more easily and naturally.
#. So as for a set theory to be constructive, one must reject both LEM (or its equivalents) and AC; a type theory is constructive as long as its underlying logic is constructive (i.e., rejecting LEM).
#. Type theory allows many sorts and has a straightforward correspondence with statically typed functional programming, i.e., "propositions as types" and "proofs as programs". In set theory, functions must be uniquely encoded as power sets in a quite verbose way, which makes it unsuitable for computer-based proof mechanization.
#. Both naïve set theory and type theory were under the paradoxical crisis of inconsistency, as revealed by Russell's paradox and Girard's paradox respectively. The resolution of these paradoxes has led to multiple axiomatic set theories (e.g., ZF, NBG, NFU) and modern type theories (e.g., Martin-Löf Type Theory, Calculus of Inductive Constructions).
#. As an offshoot of set theory we can talk about large cardinals, whose existence is independent of (unprovable in) ZFC; there is no analog to these in proof-centric, constructive type theory yet.
#. Set theory was not well tailored for modeling today's category theory, since not all categories are truly sets; in type theory, it is natural to think of types as objects and function types as morphisms, and a mutual interpretation between the semantics of type theory and category theory would be intuitively possible. [@sep-type-theory]



## References and further reading

**Books:**

Aristotle, *Metaphysics*. (English translation by W. D. Ross, 1925) \
Available: <https://ebooks.adelaide.edu.au/a/aristotle/metaphysics/>

W. V. O. Quine, *Philosophy of Logic*, 2nd ed.

Michael Dummett, *Truth and Other Enigmas*.

Stewart Shapiro, *Foundations Without Foundationalism: A Case for Second-Order Logic*.

**Articles:**
