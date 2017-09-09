---
title: The Logical Implication
subtitle: Languages and models of a first-order logic.
author: Mort Yao
date: 2017-09-06
date-updated: 2017-09-09
---

**Prologue.** This is the summary of a set of notes I took in KU's [Introduction to Mathematical Logic](http://kurser.ku.dk/course/nmaa13036u/2016-2017) course, that I should have finished months ago but somehow procrastinated until recently. I basically followed Enderton's *A Mathematical Introduction to Logic* book (with all its conventions of mathematical notations). A few issues to address in advance:

* These notes are mainly about first-order logic. *Propositional logic* is assumed to be a prerequisite. The important thing to know is that its semantics (as a Boolean algebra) can be fully described by a truth table, which is obviously finite and mechanizable.
* *Naïve set theory* is also a prerequisite, that is, one must accept the notion of *sets* unconditionally: A set is just a collection of objects, and it must exist as we describe it. We are convinced that no paradoxical use of sets will ever emerge, and that no "naïve set" could be a proper class. The formal notion of sets is built upon first-order logic, but without some informal reference to sets we can't even say what a first-order logic is.
    * A set $S$ is said to be "countable" iff there exists a bijection $f : \mathbb{N} \to S$; otherwise it is "uncountable".
* One must be willing to accept the validity of mathematical induction on natural numbers (or the well-ordering principle for natural numbers). Again, to formalize the induction principle we need the set theory, but we don't have it in the first place (until we introduce a first-order logic).
* On the *model-theoretic* part: Notes on [definability and homomorphisms](https://wiki.soimort.org/math/logic/fol/definability/) are omitted from this summary, not to mention ultraproducts and the Löwenheim-Skolem theorem. Model theory is a big topic in its own right and deserves an individual treatment, better with some algebraic and topological contexts. (Note that the homomorphism theorem is used in proving the completeness theorem; also the notion of definability is mentioned in the supplementary sections.)
* On the *proof-theoretic* part: Notes on [some metatheorems](https://wiki.soimort.org/math/logic/fol/metatheorems/) are also omitted, as they are a purely technical aspect of a Hilbert-style deductive system. (One may find it convenient to prove an actual theorem with more metatheorems, but they are really not adding any extra power to our system.)
* The relation between logic and *computability* (i.e., *Gödel's incompleteness theorems*) is not discussed.
    * But the meanings of "decidable" and "undecidable" are clear from the previous notes [Mst. #6](/mst/6/) (from a computer scientist's perspective).
* *Axiomatic set theory*, which is another big part of the course, is not included in these notes. (Maybe I'm still too unintelligent to grasp the topic.) But it is good to know:
    * First-order logic has its limitation in definability (i.e., it's not capable of ruling out non-standard models of arithmetic), until we assign to it a set-theoretic context. So set theory is often considered a foundation of all mathematics (for its expressive power).
    * Axiom of Choice (AC) causes some counter-intuitive consequences, but it was shown to be consistent with ZF axioms (Gödel 1938). And there are models of ZF$\cup\lnot$AC so well as ZF$\cup$AC.
    * Constructivists tend to avoid AC in mathematics. However, [Henkin's proof of the completeness theorem](https://wiki.soimort.org/math/logic/fol/completeness/) in first-order logic assumes AC (Step II in finding a maximal consistent set). (thus it is a non-constructive proof!^[Is there a constructive approach as a replacement of Henkin's construction? <https://math.stackexchange.com/questions/1462408/is-there-a-constructive-approach-as-a-replacement-of-henkins-construction>])
* *Intuitionistic logic* is not in the scope of these course notes. (And most logic books, including the Enderton one, are not written by constructive mathematicians.) Basically, in a Hilbert-style system, a classical logic would admit all tautologies in propositional logic as Axiom Group 1. Intuitionistic logic, in contrast, rejects those tautologies that are non-constructive in a first-logic setting.



---

* [**First-order language**](https://wiki.soimort.org/math/logic/fol/languages/): A [formal language](https://wiki.soimort.org/comp/language/) consisting of the following symbols:
    1. Logical symbols
        * Parentheses: $($, $)$.
        * Connective symbols: $\to$, $\lnot$.
        * Variables: $v_1$, $v_2$, ...
        * Equality symbol (optional 2-place predicate symbols): $=$.
    2. Parameters (non-logical symbols; open to interpretation)
        * Universal quantifier symbol: $\forall$.
        * Predicate symbols (relation symbols): $P_1$, $P_2$, ...
        * Constant symbols (0-place function symbols): $c_1$, $c_2$, ...
        * Function symbols: $f_1$, $f_2$, ...
    * When specifying a concrete first-order language $\mathcal{L}$, we must say (i) whether the quality symbol is present; (ii) what the parameters are.

**Remark 7.1. (Language of propositional logic)** The language of propositional logic may be seen as a stripped form of first-order languages, in which parentheses, connective symbols and sentential symbols (the only parameters; may be treated as 0-place predicate symbols) are present. Intuitively, that language might seem too weak to encode our formal reasoning in all kinds of mathematics and many practical areas, so to speak.

* **Terms** and **formulas**
    * An *expression* is a finite sequence of symbols (i.e., a finite string). Among all expressions, we are interested in two kinds of them which we refer to as terms and formulas.
    * A *term* is either:
        * a single variable or constant symbol; or
        * $f t_1 \cdots t_n$, where $f$ is a $n$-place function symbol, and every $t_i$ $(1 \leq i \leq n)$ is also a term.
    * A *formula* (or *wff*, well-formed formula) is either:
        * $P t_1 \cdots t_n$, where $P$ is a $n$-place predicate symbol (or the equality symbol $=$), and every $t_i$ $(1 \leq i \leq n)$ is a term; or
        * one of the following forms:
            * $(\lnot \psi)$, where $\psi$ is also a formula;
            * $(\psi \to \theta)$, where $\psi$ and $\theta$ are also formulas;
            * $\forall v_i \psi$, where $v_i$ is a variable and $\psi$ is also a formula.
    * A variable may occur *free* in a formula. A formula without any free variable is called a *sentence*.

**Remark 7.2. (Metatheory and philosophical concerns)** A first-order expression, as a finite sequence (also called a *tuple*), may be defined in terms of ordered pairs in axiomatic set theory. But we will not appeal to set theory in our first definitions of expressions in logic. (So far we have no notion about what a "set" formally is!)

A further concern is whether our definitions of terms and formulas are well established, that is, since we are defining the notions of terms and formulas *inductively*, would it be possible that there is a certain term or formula that is covered by our recursive definition, but can never be actually built using these operations? To show that first-order terms/formulas are well-defined, a beginner might try to prove these induction principles by mathematical induction on the complexities of terms/formulas, but that would rely on the fact that the set of natural numbers $\omega$ is well-ordered so that we can apply induction on numbers; to justify things like this, it is essential to use set theory or second-order logic, which we don't even have until we define a first-order logic. Thus, unavoidable circularity emerges if we try to look really fundamentally.

For now, we must appeal to a metatheory that we can easily convince ourselves by intuition, so that we will accept these induction principles and the notion of "naïve sets" (or *collections*, if we don't want to abuse the formal term of sets too much). Notwithstanding, I *believe* that a prudent person can bootstrap theories like this without drawing in any inconsistency.

**Remark 7.3. (Context freedom, unique readability and parentheses)** Since the formations of first-order terms and formulas make use of context-free rules, one familiar with [formal languages and automata theory](/mst/6/) might ask, "Are the set of terms/formulas [context-free languages](https://wiki.soimort.org/comp/language/context-free/)?" Generally they are not, since our set $V$ of variables (samely for predicate and function symbols) could be infinitely (or even uncountably) large, but a context-free grammar requires that every set must be finite. However, in our first-order language $\mathcal{L}$, if these symbols can be effectively decidable, then there is an algorithm that accepts terms or formulas (or parses them). Furthermore, such parses are guaranteed to be unique, as shown by the Unique Readability Theorems in Enderton p. 105ff.
Indeed, the inclusion of parentheses in our first-order language enables us to write any formula unambiguously. If we leave out all the parentheses, does a formula like $\forall x P x \to \lnot Q x$ mean $(\forall x P x \to (\lnot Q x))$ or $\forall x (P x \to (\lnot Q x))$? An alternative syntax would be to use logical connectives in a prefix manner, e.g., $\to \forall x P x \lnot Q x$ and $\forall x \to P x \lnot Q x$, but that is hardly as comprehensible as our chosen syntax.

**Remark 7.4. (Abbreviations on notation)** Why don't we have the existential quantifier $\exists$ and some other connectives such like $\land$, $\lor$ and $\leftrightarrow$, in our language? Because any first-order formula that makes use of these symbols can be seen as syntactical abbreviations and should be rewritten using $\forall$, $\to$ and $\lnot$, as will be shown. A deeper reason is that $\{ \to, \lnot \}$ is a functionally complete set of Boolean algebraic operators that is sufficient to express all possible truth tables in propositional logic. On the other hand, a formula like $\exists x \varphi$ is just $(\lnot \forall x (\lnot \varphi))$, following from our understanding of what an existential quantification is.

**Remark 7.5. (Sentences and truth values)** In propositional logic, we don't *generally* know whether a formula evaluates to true until every sentential symbol is assigned a truth value. (Sometimes we can tell the truth value with a little less information than what is required, if we apply a so-called short-circuit evaluation strategy, e.g., if $A_1$ is false then we immediately know $(A_1 \to A_2)$ is true, or if $A_2$ is true then $(A_1 \to A_2)$ is also true. But it is not the general case, and one should expect to evaluate both $A_1$ and $A_2$ before getting the answer.) Similarly, in a first-order logic, every free variable needs to have a definite assignment so as to give rise to the truth value of a formula. This is done by specifying a function $s$ (where $\operatorname{dom} s = V$ is the set of all variables) as the assignment of variables, and when applying $s$ to a formula $\varphi$ we get $\varphi[s]$, which is a sentence that has a definite meaning (i.e., no variable occurs free). Note that the assignment of variables alone is not sufficient to determine the truth of a sentence -- For example, $(P x y \to P x f y)\ [s(x \,|\, 0)(y \,|\, 0)]$ is a sentence since no variable occurs free in it, but we can't decide whether it is true because we don't know what the predicate $P$ and the function $f$ are. If we say, $P$ is the arithmetic "less-than" relation and $f$ is the successor function $f : x \mapsto x + 1$, then we can tell that this is a true sentence (in fact $P x y$ is false as $0 < 0$ is false, but $P x f y$ is true as $0 < 1$ is true, so the overall sentence as a conditional is true). We could write $P$ and $f$ as $<$ and $S$, but the conventional interpretation of these symbols should not be taken for granted as if every symbol comes with an inherited meaning -- They don't, until we give them meanings.

* [**Structures**](https://wiki.soimort.org/math/logic/fol/structures/): A *structure* (or an *interpretation*) $\mathfrak{A}$ assigns a domain $|\mathfrak{A}|$ to the language $\mathcal{L}$, and:
    * Every predicate symbol is assigned a relation $P^\mathfrak{A} \subseteq |\mathfrak{A}|^n$.
    * Every function symbol is assigned a function $f^\mathfrak{A} : |\mathfrak{A}|^n \to |\mathfrak{A}|$.
    * Every constant symbol is assigned a member $c^\mathfrak{A}$ of the domain $\mathfrak{A}$.
    * The universal quantifier symbol $\forall$ is assigned the domain $|\mathfrak{A}|$. (So it makes sense to say: "for all $x$ in $|\mathfrak{A}|$...")
* **Satisfaction** and **truth**
    * Given a structure $\mathfrak{A}$ and an assignment of variables $s : V \to |\mathfrak{A}|$, we define an extension function $\bar{s} : T \to |\mathfrak{A}|$ (where $T$ is the set of all terms) that maps any term into the domain $|\mathfrak{A}|$.
    * With the term valuation $\bar{s}$, we define recursively that a structure $\mathfrak{A}$ *satisfies* a formula $\varphi$ with an assignment $s$ of variables, written as
    $$\models_\mathfrak{A} \varphi[s]$$
    If this is not the case, then $\not\models_\mathfrak{A} \varphi[s]$ and we say that $\mathfrak{A}$ does not satisfy $\varphi$ with $s$.
    * For a sentence $\sigma$ (which is just a formula with no free variables), the assignment of variables $s : V \to |\mathfrak{A}|$ does not make a difference whether $\varphi$ is satisfied by $\mathfrak{A}$. So if $\models_\mathfrak{A} \sigma$, we say that $\sigma$ is *true* in $\mathfrak{A}$ or that $\mathfrak{A}$ is a *model* of $\sigma$.
    * **Satisfiability** of formulas: A set $\Gamma$ of formulas is said to be *satisfiable* iff there is a structure $\mathfrak{A}$ and an assignment $s$ of variables such that $\models_\mathfrak{A} \Gamma[s]$.
* **Logical implication** and **validity**
    * In a language $\mathcal{L}$, we say that a set $\Gamma$ of formulas *logically implies* a formula $\varphi$, iff for every structure $\mathfrak{A}$ of $\mathcal{L}$ and every assignment $s : V \to |\mathfrak{A}|$ such that $\models_\mathfrak{A} \gamma [s]$ (for all $\gamma \in \Gamma$), it also holds that $\models_\mathfrak{A} \varphi [s]$ (note that $\varphi$ is not required to be a sentence):
    $$\Gamma \models \varphi$$
    This is the analogue of tautological implication in propositional logic: $A \Rightarrow B$, iff every truth assignment that satisfies $A$ also satisfies $B$.
    * If the empty set logically implies a formula, i.e., $\emptyset \models \varphi$, we write this fact simply as $\models \varphi$ and say that $\varphi$ is *valid*. A formula is valid iff given any assignment of variables, it is true in every structure; this is the analogue of tautologies in propositional logic: something that is considered "always true".

**Remark 7.6. (Dichotomy of semantic truthness and the liar's paradox)**
It should be made clear from the definition that given a structure and an assignment, either $\models_\mathfrak{A} \varphi[s]$ (exclusive) or $\not\models_\mathfrak{A} \varphi[s]$, but not both! It follows from our intuition that a statement is either semantically true or false; and there is no third possibility.

A problem arises with self-referential terms, woefully: Assume that we have a first-order language $\mathcal{L}$ with a 1-place predicate symbol $P$, and the structure $\mathfrak{A}$ assigns it the domain $|\mathfrak{A}| = \text{Formula}(\mathcal{L})$, $P$ is interpreted as $P^\mathfrak{A} = \{ \langle \sigma \rangle \,:\, \models \sigma \}$, that is, $\sigma \in P^\mathfrak{A}$ iff $\models \sigma$. Let the sentence $\tau$ be $(\lnot P x)$ and the assignment $s : V \to |\mathfrak{A}|$ maps the variable $x$ to the sentence $\tau$, then is $\tau[s]$ true or false in $\mathfrak{A}$? If we take $\tau[s]$ as true, that is, $(\lnot P \tau)$ is true, then $P \tau$ must be false, so $\tau \not\in P^\mathfrak{A}$ thus $\not\models \tau$. If we take $\tau[s]$ as false, that is, $(\lnot P \tau)$ is false, then $P \tau$ must be true, so $\tau \in P^\mathfrak{A}$ thus $\models \tau$. This is known as the classical *liar's paradox*. One possible way to resolve this (given by Alfred Tarski) is by disabling impredicativity in our structures; more precisely, one can define a semantic hierarchy of structures that allows us to predicate truth only of a formula at a lower level, but never at the same or a higher level. This matter is far beyond the scope of this summary, but the important lesson to learn here is that it is generally a bad idea to allow something both true *and* false in our semantics; it would put our enduring effort to cumulate all "mathematical truths" into void.

**Remark 7.7. (Decidability of truth/validity)** In propositional logic, it is easy to see that given a truth assignment of sentential symbols, every formula can be decided for its truth or falsehood. Moreover, even without any truth assignment, one can enumerate a truth table to find out whether a given formula is a tautology. Truth and validity are decidable in propositional logic. However, this is often not the case in first-order logic: In order to decide whether a sentence is true, one needs to find the truth values of all prime formulas (i.e., formulas like $P t_1 \cdots t_n$ and $\forall v_i \psi$) first, but the domain $|\mathfrak{A}|$ may be an (uncountably) infinite set, thus makes it impossible to mechanically check the universal quantification for all members; moreover, the functions used in building terms may not be Turing-computable at all. To decide the validity of a sentence, we have to check its truth in all structures of the language (whose set may also be uncountably large), and that is an even more impossible task.
^[We are using the notion of decidability/undecidability here even before we get to Gödel's incompleteness theorem, but hopefully it's no stranger to us as computability theory has [all the model-specific issues](/mst/6/) (though non-logical) covered.]

If semantic truth/validity is generally undecidable, how do we say that some formula is true in a predefined structure? Well, we can't, in most general cases, since an infinite argument of truth is a useless argument (you can't present it to someone / some Turing machine, as no physical device is capable of handling such an infinite object). Fortunately, there is a feasible way to say something is true, without appealing to any specific structures (that may give rise to unwanted undecidability), and that is called a formal deduction (also called a proof, expectedly).

* [**Formal deduction**](https://wiki.soimort.org/math/logic/fol/deductions/): Given a set $\Lambda$ of formulas (*axioms*), a set of *rules of inference*, we say that a set $\Gamma$ of formulas (*hypotheses*) *proves* another formula $\varphi$, or $\varphi$ is a *theorem* of $\Gamma$, iff there is a finite sequence (called a *deduction* of $\varphi$ from $\Gamma$) $\langle \alpha_0, \dots, \alpha_n \rangle$ such that
    #. $\alpha_n$ is just $\varphi$.
    #. For each $0 \leq k \leq n$, either
       * $\alpha_k \in \Gamma \cup \Lambda$; or
       * $\alpha_k$ is obtained by a rule of inference from a subset of previous formulas $A \subseteq \bigcup_{0 \leq i < k} \alpha_i$.
    $$\Gamma \vdash \varphi$$
    * **Formal systems** and **proof calculi**: Different deductive systems made different choices on the set of axioms and rules of inferences. A *natural deduction* system may consist of no axiom but many rules of inference; on the contrary, a Hilbert-style system (named obviously after David Hilbert) uses many axioms but only two rules of inference. A *proof calculus* is the approach to formal deduction in a specified system, and as it is called a "calculus", any derivation in it must contain only a finite number of steps so as to be calculable (by a person or by a machine).
    * We will use a Hilbert-style deductive system here:
        * **Rules of inference**
            #. *Modus ponens*
            $$\frac{\Gamma \vdash \psi \quad \Gamma \vdash (\psi \to \varphi)}{\Gamma \vdash \varphi}$$
            #. *Generalization*
            $$\frac{\vdash \theta}{\vdash \forall x_1 \cdots \forall x_n \theta}$$
            (where $\theta \in \Lambda$.)
        * **Logical axioms**: In a deductive system, axioms are better called *logical axioms*, to stress the fact that they are logically valid formulas in every structure, i.e., that their validity is not open to interpretation.
            #. (Tautology) $\alpha$, where $\models_t \alpha$. (take sentential symbols to be prime formulas in first-order logic)
            #. (Substitution) $\forall x \alpha \to \alpha^x_t$, where $t$ is substitutable for $x$ in $\alpha$.
            #. $\forall x (\alpha \to \beta) \to (\forall x \alpha \to \forall x \beta)$.
            #. $\alpha \to \forall x \alpha$, where $x$ does not occur free in $\alpha$.
            #. $x = x$.
            #. $x = y \to (\alpha \to \alpha')$, where $\alpha$ is atomic and $\alpha'$ is obtained from $\alpha$ by replacing $x$ in zero or more places by $y$.

**Remark 7.8. (Validity of logical axioms)**
It should be intuitively clear that all logical axioms are convincing, and that their validity can be argued without appealing to any specific model. In particular, for an axiom $\theta \in \Lambda$, there is $\vdash \theta$; we must be able to argue (in our meta-language) that $\models \theta$, so that we can be convinced that our deductive system is a *sound* one. Remember that for any formula $\varphi$, either $\models \varphi$ or $\not\models \varphi$ (which is just $\models (\lnot \varphi)$). If a proof of $\theta$ (not as a formal deduction, but as an argument in our meta-language) does not even imply $\models \theta$, that would be very frustrating.

**Remark 7.9. (Tautological implication, logical implication and deduction)**
If $\Gamma \models_t \varphi$ (i.e., $\varphi$ is tautologically implied by $\Gamma$ in propositional logic), we can argue that $\Gamma \models \varphi$ when replacing sentential symbols by prime formulas in first-order logic. In the special case that $\Gamma = \emptyset$, we are proving the validity of Axiom Group 1: $\models_t \alpha \implies \models \alpha$ (every tautology is valid). The converse does not hold though, since we have $\models (\alpha \to \forall x \alpha)$ (by Axiom Group 4), but $\not\models_t (\alpha \to \forall x \alpha)$ as $\alpha$ and $\forall x \alpha$ are two different sentential symbols (surely $(A_1 \to A_2)$ is not a tautology in propositional logic!).

It is worth noticing that even though $\Gamma \models \varphi \not\implies \Gamma \models_t \varphi$, we do have $\Gamma \models \varphi \iff \Gamma \cup \Lambda \models_t \varphi$. Intuitively, the set $\Lambda$ of logical axioms gives us a chance to establish truths about quantifiers and equalities (other than treating these prime formulas as sentential symbols that are too unrefined for our first-order logic). I haven't done a proof of this, but I believe it should be *non-trivial* on both directions. Combining with Theorem 24B in Enderton p. 115, we get the nice result concluding that
$$\Gamma \vdash \varphi \iff \Gamma \cup \Lambda \models_t \varphi \iff \Gamma \models \varphi$$
which entails both the soundness and the completeness theorems. It is basically saying that these three things are equivalent:

1. $\Gamma$ proves $\varphi$. (There is a formal deduction that derives $\varphi$ from $\Gamma$ and axioms $\Lambda$ in our deductive system; it is finite and purely syntactical, in the sense that it does not depend on any structure or assignment of variables.)
2. $\Gamma$ logically implies $\varphi$. (For every structure and every assignment of variables, $\varphi$ holds true given $\Gamma$. Of course, this is a semantical notion in the sense that it does involve structures and assignments of variables, which are infinite in numbers so it would be impossible for one to check this mechanically.)
3. $\Gamma \cup \Lambda$ tautologically implies $\varphi$. (We can reduce a first-order logic to propositional logic by adding logical axioms to the set of hypotheses, preserving all truths. For each prime formula, this is still a semantical notion for its truth value depends on structures / assignments of variables.)

* [**Soundness**](https://wiki.soimort.org/math/logic/fol/soundness/)
  a. $\Gamma \vdash \varphi \implies \Gamma \models \varphi$.
  * Proof idea:
      #. For $\varphi \in \Lambda$, show that every logical axiom is valid (Lemma 25A in Enderton p. 132ff.), that is, $\models \varphi$. Then trivially $\Gamma \models \varphi$;
      #. For $\varphi \in \Gamma$, we have trivially $\Gamma \models \varphi$;
      #. $\varphi$ is obtained by generalization on variable $x$ from a valid formula $\theta$. Since $\models \theta$ (if $\theta$ is an axiom, then this is already shown in Step 1; if $\theta$ is another generalization, then this can be shown by IH), for every structure $\mathfrak{A}$ and $a \in |\mathfrak{A}|$, $\models_\mathfrak{A} \theta[s(x|a)]$, then by definition we have $\models_\mathfrak{A} \forall x \theta[s]$. Therefore $\models \forall x \theta$;
      #. $\varphi$ is obtained by modus ponens from $\psi$ and $(\psi \to \varphi)$. By IH we have $\Gamma \models \psi$ and $\Gamma \models (\psi \to \varphi)$. Show that $\Gamma \models \varphi$ using Exercise 1 in Enderton p. 99. (NB. the wording in the last line of Enderton p. 131, i.e., "follows at once", seems too sloppy to me: we have not proved modus ponens semantically yet.)
   * **Consistency** of formulas: A set $\Gamma$ of formulas is said to be *consistent* iff for no formula $\varphi$ it is the case that both $\Gamma \vdash \varphi$ and $\Gamma \vdash (\lnot\varphi)$.
       * By the soundness theorem, an inconsistent set $\Gamma$ of formulas gives rise to both $\Gamma \models \varphi$ and $\Gamma \models (\lnot\varphi)$. As discussed before, it would throw our trust on mathematical truths into fire -- we will have proved that some statement is both true and false!
   b. If $\Gamma$ is satisfiable, then $\Gamma$ is consistent. \
   (a. and b. are equivalent representations of the soundness theorem.)

* [**Completeness**](https://wiki.soimort.org/math/logic/fol/completeness/)
  a. $\Gamma \models \varphi \implies \Gamma \vdash \varphi$.
  b. If $\Gamma$ is consistent, then $\Gamma$ is satisfiable. \
  (a. and b. are equivalent representations of the completeness theorem.)
  * Proof idea: We will prove first a weaker form of b., i.e., the completeness for a countable language $\mathcal{L}$. Let $\Gamma$ be a consistent set of formulas. We show that it is satisfiable.
    #. Extend the language $\mathcal{L}$ with a countable set $\bar{C}$ of new constant symbols and get a new language $\mathcal{L}_\bar{C}$;
    #. Given the set $\Gamma$ of $\mathcal{L}$-formulas, show that there is a set $\bar\Gamma$ of $\mathcal{L}_\bar{C}$-formulas that is consistent, complete, deductively closed and Henkinized, i.e., for every formula $\exists x \varphi \in \Gamma$ there is a "witness" constant $\bar{c} \in \bar{C}$ such that $\varphi^x_\bar{c} \in \bar{\Gamma}$;
    #. Build a structure $\mathfrak{A}_0$ from $\bar\Gamma$ where $|\mathfrak{A}_0|$ is the set of terms of $\mathcal{L}_\bar{C}$. The assignment $s$ maps every variable to itself;
    #. Define an equivalence relation $E$ on $|\mathfrak{A}_0|$: $t E t' \iff t = t' \in \bar\Gamma$. Show by induction that for any $\mathcal{L}_\bar{C}$-formula $\varphi$, $\models_{\mathfrak{A}_0} \varphi^* [s] \iff \varphi \in \bar\Gamma$ (where $\varphi^*$ is $\varphi$ with $=$ replaced by $E$ everywhere);
    #. Show by the homomorphism theorem that $\models_\mathfrak{A} \varphi[s] \iff \varphi \in \bar\Gamma$ (where $\mathfrak{A} = \mathfrak{A}_0 / E$);
    #. Restrict the structure $\mathfrak{A}$ (a model of $\mathcal{L}_\bar{C}$) to $\mathcal{L}$ by dropping all new constants $\bar{C}$. Then $\Gamma$ is satisfiable with $\mathfrak{A}$ and $s$ in $\mathcal{L}$.

* [**Compactness**](https://wiki.soimort.org/math/logic/fol/compactness/)
  a. $\Gamma \models \varphi \implies$ There is a finite $\Gamma_0 \subseteq \Gamma$ such that $\Gamma_0 \models \varphi$.
  b. If every finite subset $\Gamma_0$ of $\Gamma$ is satisfiable, then $\Gamma$ is satisfiable. \
  (a. and b. are equivalent representations of the compactness theorem.)
  * Proof idea: A simple corollary of soundness and completeness theorems.

**Remark 7.10. (Soundness and completeness)**
The soundness and the completeness theorems together evidence the equivalence of consistency and satisfiability of a set of formulas, or that of validity and provability of a formula. The completeness theorem is by no means an obvious result; the first proof was given by Kurt Gödel in 1930^[Gödel's original proof of the completeness theorem: <https://en.wikipedia.org/wiki/Original_proof_of_G%C3%B6del%27s_completeness_theorem>], but the proof that we use today is given by Leon Henkin in 1949 [@henkin1949completeness], which easily generalizes to uncountable languages.

**Remark 7.11. (Completeness and incompleteness)**
Note that the completeness theorem should not be confused with Gödel's *incompleteness theorems*. Specifically, the completeness theorem claims that (unconditionally) every formula that is logically implied by $\Gamma$ is also deducible from $\Gamma$ (i.e., $\Gamma \models \varphi \implies \Gamma \vdash \varphi$), while the first incompleteness theorem claims that (under some conditions) some consistent deductive systems are incomplete (i.e., there is some formula $\varphi$ such that neither $\Gamma \vdash \varphi$ nor $\Gamma \vdash (\lnot\varphi)$). As is clearly seen, the incompleteness theorem is purely syntactical and matters for provability (or decidability, one might say). The aforementioned liar's paradox, where our semantics raises a contradiction that neither $\Gamma \models \varphi$ nor $\Gamma \models (\lnot\varphi)$ reasonably holds, may be seen as a semantical analogue of the first incompleteness theorem.



## Equality is logical

The equality symbol $=$ is a logical symbol, in the sense that the equivalence relation it represents is *not* open to interpretation and always means what it's intended to mean (i.e., "the LHS is *equal* to the RHS"). But if so, how do we say
$$1+1=2$$
is a true sentence then? Can't we just interpret the equality symbol as something else in a structure $\mathfrak{A}$ such that $\models_\mathfrak{A} (\lnot 1+1=2)$?

One reason is that in many first-order systems, functions (operations) are defined as axioms using equalities; we need a general way to say "something is defined as..." or just "something is..." There would be no better way of saying this rather than representing it as an equality, so we won't have the hassle of interpreting a made-up relation in every model. Consider the language of elementary number theory, in the intended model $\mathfrak{N} = (\mathbb{N}; \mathbf{0}, \mathbf{S}, +, \cdot)$ of Peano arithmetic, the addition function is defined as a set of domain-specific axioms:
\begin{align*}
a + \mathbf{0} &= a &\qquad(1) \\
a + \mathbf{S} b &= \mathbf{S} (a + b) &\qquad(2)
\end{align*}
By Axiom Group 6 we have $\mathbf{S0} + \mathbf{0} = \mathbf{S0} \to (\mathbf{S0} + \mathbf{S0} = \mathbf{S}(\mathbf{S0} + \mathbf{0}) \to \mathbf{S0} + \mathbf{S0} = \mathbf{S}\mathbf{S0})$. By (1) $\mathbf{S0} + \mathbf{0} = \mathbf{S0}$. By (2) $\mathbf{S0} + \mathbf{S0} = \mathbf{S}(\mathbf{S0} + \mathbf{0})$. Applying modus ponens twice, we get $\mathbf{S0} + \mathbf{S0} = \mathbf{S}\mathbf{S0}$, which is the result we want (sloppily written as $1+1=2$).

The equality is a little special, since it is the most common relation with *reflexivity*, as justified by Axiom Group 5, i.e., $x = x$ for any variable $x$. We could exclude these from our logical axioms, but in many cases we would still need a reflexive relation symbol to denote equivalence (justified by some domain-specific axioms) otherwise. Technically, it would be convenient to just treat it as a logical symbol (together with the useful Axiom Groups 5 and 6). Note that though our logical axioms did not say anything about other properties like *symmetry*, *antisymmetry* and *transitivity*, they follow easily from Axiom Groups 5 and 6, in our deductive system:

**Lemma 7.12. (Symmetry)** If $x = y$, then $y = x$.

*Proof.* Given $x = y$. By Axiom Group 5 we have $x = x$. By Axiom Group 6 we have $x = y \to (x = x \to y = x)$. Applying modus ponens twice, we get $y = x$.
\Qed

**Lemma 7.13. (Transitivity)** If $x = y$ and $y = z$, then $x = z$.

*Proof.* Given $x = y$, by symmetry it holds $y = x$. Also $y = z$. By Axiom Group 6 we have $y = x \to (y = z \to x = z)$. Applying modus ponens twice, we get $x = z$.
\Qed

**Lemma 7.14. (Antisymmetry)** If $x = y$ and $y = x$, then $x = y$.

*Proof.* Trivial.

Note that if any partial order is [definable](https://wiki.soimort.org/math/logic/fol/definability/) on a structure, the equality symbol may not be indispensable in our language, e.g., consider the language of set theory, where the equivalence of two sets $x = y$ may be defined as
$$(\forall v (v \in x \to v \in y) \land \forall v (v \in y \to v \in x))$$



## The limitation of first-order logic

Consider again the language of elementary number theory, in the intended model $\mathfrak{N} = (\mathbb{N}; \mathbf{0}, \mathbf{S}, +, \cdot)$ of Peano arithmetic, we have the set of all true sentences $\text{Th}\mathfrak{N}$.^[It might be interesting to know that $\text{Th}(\mathbb{N}; \mathbf{0}, \mathbf{S}, +, \cdot)$ is an undecidable theory, as shown by the aforementioned incompleteness theorem.] Now we add a new constant symbol $c'$ to our language, and extend our theory with a countable set of sentences $\text{Th}\mathfrak{N} \cup \{ \underbrace{\mathbf{S} \cdots \mathbf{S}}_{n\ \text{times}} \mathbf{0} < c' \,:\, n \in \mathbb{N} \}$ (Here we define $x < y$ as $\lnot\forall z ((\lnot z = \mathbf{0}) \to (\lnot x + z = y))$). Is there still a model for this extended theory?

For any given $n \in \mathbb{N}$, the sentence $\underbrace{\mathbf{S} \cdots \mathbf{S}}_{n\ \text{times}} \mathbf{0} < c'$ is clearly satisfiable (by simply taking $c' = \mathbf{S} n$). Then it is easily shown that every finite subset $\Gamma_0 \subseteq \text{Th}\mathfrak{N} \cup \{ \underbrace{\mathbf{S} \cdots \mathbf{S}}_{n\ \text{times}} \mathbf{0} < c' \,:\, n \in \mathbb{N} \}$ is satisfiable. By the compactness theorem (b.), $\text{Th}\mathfrak{N} \cup \{ \underbrace{\mathbf{S} \cdots \mathbf{S}}_{n\ \text{times}} \mathbf{0} < c' \,:\, n \in \mathbb{N} \}$ is also satisfiable. This means that we can construct a *non-standard model of arithmetic* $\mathfrak{N}'$ with an additional bizarre element (specifically $c'_0$) that turns out to be greater than any other number (thus the model of this theory is not isomorphic to our standard model $\mathfrak{N}$).

Recall that in a Peano arithmetic modeled by $\mathfrak{N}'$, numbers are closed under the successor function $\mathbf{S}$. More precisely, if $k \in |\mathfrak{N}'|$ , then $\mathbf{S}k \in |\mathfrak{N}'|$ and $\mathbf{S}k \neq \mathbf{0}$. This implies that not only $c'_0 \in |\mathfrak{N}'|$, but also $\mathbf{S} c'_0, \mathbf{S}\mathbf{S} c'_0, \mathbf{S}\mathbf{S}\mathbf{S} c'_0, \dots$ are all non-standard numbers in $|\mathfrak{N}'|$. As none of these numbers is equal to $\mathbf{0}$ (by one of Peano axioms), they form an infinite "chain" separately besides our familiar standard ones. One can write down all the (standard and non-standard) numbers sloppily as the following sequence:
$$\langle 0, 1, 2, \dots, \quad c'_0, c'_1, c'_2, \dots \rangle$$
where $0$ is just $\mathbf{0}$, $1$ is $\mathbf{S0}$, $2$ is $\mathbf{SS0}$, $c'_1$ is $\mathbf{S} c'_0$, $c'_2$ is $\mathbf{SS} c'_0$, etc.

Clearly, every number but $0$ and $c'_0$ in the sequence has a unique predecessor. There is certainly no such a predecessor $j$ of $0$, because otherwise we would have $\mathbf{S}j = \mathbf{0}$, contradicting our axioms. But can we have a predecessor of $c'_0$? There is no axiom preventing us from constructing that thing! So here we go, enlarge our collection of numbers to:
$$\langle 0, 1, 2, \dots, \quad \dots, c'_{-2}, c'_{-1}, c'_0, c'_1, c'_2, \dots \rangle$$
where for each $c'_{i}$, $c'_{i+1} = \mathbf{S} c'_{i}$. Again, we know that every such non-standard numbers $c'_i$ is greater than any standard number $n$ (otherwise we can find a standard number $n-i$ such that $(\lnot n-i < c'_0)$, contradicting our initial construction of $c'_0$ by compactness. So the non-standard part is still a separate chain, thus as written above.

We can go even further. Let $|\mathfrak{N}'|$ be this set of standard and non-standard numbers, and $\mathfrak{N}' = (|\mathfrak{N}'|; \mathbf{0}, \mathbf{S}, +, \cdot)$ is still the intended model of Peano arithmetic on $|\mathfrak{N}'|$. Consider adding yet another constant symbol $c''$. Is $\text{Th}\mathfrak{N}' \cup \{ \underbrace{\mathbf{S} \cdots \mathbf{S}}_{n'\ \text{times}} \mathbf{0} < c'' \,:\, n' \in |\mathfrak{N}'| \}$ satisfiable? By the same reasoning as before, we get a model $\mathfrak{N}''$, with its domain of numbers
$$\langle 0, 1, 2, \dots, \quad \dots, c'_{-2}, c'_{-1}, c'_0, c'_1, c'_2, \dots, \quad \dots, c''_{-2}, c''_{-1}, c''_0, c''_1, c''_2, \dots \rangle$$

Counter-intuitively, this is not the kind of "arithmetic" we are used to. What we are trying to do is to formulate the arithmetic for *standard* natural numbers that we use everyday (i.e., $0, 1, 2, \dots$) in first-order logic, but these non-standard numbers come out of nowhere and there is an infinite "stage" of them, such that each number in a latter stage is greater than every number in a former stage (How is that even possible?). And what is worse, in a subset of the non-standard model $\mathfrak{N}'$:
$$\{ \dots, c'_{-2}, c'_{-1}, c'_0, c'_1, c'_2, \dots \}$$
There is no minimal element with respect to the intended ordering relation $<$, thus it is not *well-ordered* by $<$, so our good old mathematical induction will no longer work with non-standard numbers.

Well, the lucky part is that we can at least have the induction axiom as a first-order sentence:
$$\varphi(\mathbf{0}, y_1, \dots, y_k) \land \forall x (\varphi (x, y_1, \dots, y_k) \to \varphi (\mathbf{S}(x), y_1, \dots, y_k))
\to \forall x \varphi(x, y_1, \dots, y_k))$$
Since the standard model $\mathfrak{N}$ and the non-standard model $\mathfrak{N}'$ are *elementarily equivalent* (i.e., they satisfy the same sentences in a language excluding non-standard numbers), we still enjoy the nice induction principle for all of standard natural numbers. But for the non-standard part, we're out of luck.

Ideally, we would like to have a bunch of axioms that perfectly defines *the model* of arithmetic, where no non-standard part is allowed to exist, i.e., the set of numbers is well-ordered by a definable ordering relation $<$ so that we can apply the induction principle on all of them.^[If we accept the Axiom of Choice, then every set can have a well-ordering; so this is actually a reasonable request.] Unfortunately, this is infeasible in first-order logic (without formulating the notion of sets). We will demonstrate two potential resolutions.

The intuition here is that in order to rule out any non-standard chains of numbers, we must find a 1-place predicate $P \subseteq |\mathfrak{N}|$ such that for every standard number $n$ we have $P n$, distinguishing it from $(\lnot P n')$ where $n'$ is non-standard. Certainly $\mathbf{0}$ is a standard number; consequently every standard number $x$ is followed by $\mathbf{S}x$, which is also a standard one.
$$P \mathbf{0} \land \forall x (P x \to P \mathbf{S} x)$$
Once we have this $P$ in mind, we say that every number $n \in P$, so it is also standard. There would be no other numbers in our model, thus define our set of all numbers:
$$\forall n P n$$
Notice that $P$ is not in our language; it is something we have yet to construct for our standard model. How to deal with this issue?

1. The first approach is by allowing quantification over relations. So we can say "for all such relations $P$, it holds that $\forall n P n$". Formally:
$$\forall P (P \mathbf{0} \land \forall x (P x \to P \mathbf{S} x)) \to \forall n P n$$
Of course, in our previous definition of first-order languages, for $\forall v_i \psi$ to be a well-formed formula, $v_i$ is a variable such that $v_i \in |\mathfrak{N}|$ given a model $\mathfrak{N}$; here we have $P \subseteq |\mathfrak{N}|$ hence $P \in \mathcal{P}(|\mathfrak{N}|)$. So in a first-order logic we would not be able to do this (we can only quantify a variable in the domain $|\mathfrak{N}|$). This approach leads to a **second-order logic** (where we can not only quantify over a plain variable in $|\mathfrak{N}|$, but also quantify over a relation variable in the power set of the domain, i.e., $\mathcal{P}(|\mathfrak{N}|)$; that gives our logic more expressive power!).
2. As we see, a relation is essentially a subset of $|\mathfrak{N}|$ (thus its range is also a set); it is tempting to formulate Peano arithmetic using the notion of sets. Indeed, we can rewrite the formula in Approach 1 into the language of set theory as:
$$\forall y (\emptyset \in y \land \forall x (x \in y \to S(x) \in y)) \to \forall n\ n \in y$$
where we encode the standard number $\mathbf{0}$ as $\emptyset$, $\mathbf{S}x$ as $S(x) = x \cup \{x\}$. Clearly there is no non-standard number in this set-theoretic model. This is exactly how we define natural numbers $\mathbb{N}$ (as a minimal *inductive set* $\omega$) in **set theory**, and its existence is justified by the so-called *axiom of infinity*. Note that once we introduce the set theory (using a first-order language), we have the equivalently expressive (sometimes paradoxical) power of any arbitrary higher-order logic. Fundamentally.^[Many logicians (Kurt Gödel, Thoralf Skolem, Willard Van Quine) seem to adhere to first-order logic. And that's why.]



## References and further reading

**Books:**

Herbert B. Enderton, *A Mathematical Introduction to Logic*, 2nd ed.

Kenneth Kunen, *The Foundations of Mathematics*.

**Articles:**

Terence Tao, "The completeness and compactness theorems of first-order logic,"
<https://terrytao.wordpress.com/2009/04/10/the-completeness-and-compactness-theorems-of-first-order-logic/>.

Asger Törnquist, "The completeness theorem: a guided tour,"
<http://www.math.ku.dk/~asgert/teachingnotes/iml-completenessguide.pdf>.

Eliezer Yudkowsky, "Godel's completeness and incompleteness theorems,"
<http://lesswrong.com/lw/g1y/godels_completeness_and_incompleteness_theorems/>.

Eliezer Yudkowsky, "Standard and nonstandard numbers,"
<http://lesswrong.com/lw/g0i/standard_and_nonstandard_numbers/>.

David A. Ross, "Fun with nonstandard models,"
<http://www.math.hawaii.edu/~ross/fun_with_nsmodels.pdf>.

**Papers:**
