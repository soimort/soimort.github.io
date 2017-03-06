---
title: |
    An Intuitive Exposition of \
    "Proof by Contradiction vs. Proof of Negation"
author: Mort Yao
date: 2017-03-06
category: logic
---

:= (Inspired by [*A "proof by contradiction" is not a proof that ends with a contradiction*](https://existentialtype.wordpress.com/2017/03/04/a-proof-by-contradiction-is-not-a-proof-that-derives-a-contradiction/) by Robert Harper.)

There seem to be some common misconceptions about "proof by contradiction". Recently I came across Robert's [blog post](https://existentialtype.wordpress.com/2017/03/04/a-proof-by-contradiction-is-not-a-proof-that-derives-a-contradiction/) on this issue, and couldn't help reviewing it in my own way. I prefer a more formal treatment, nevertheless, without sacrificing its intuitive comprehensibility.

What is a "proof by contradiction", exactly? When a classical mathematician (probably you) talks about proving by contradiction, they can mean either one of these two (syntactically) different things:

1. Prove $P$: Assume $\lnot P$, we derive a contradiction ($\bot$). Therefore, we have $P$.
2. Prove $\lnot P$: Assume $P$, we derive a contradiction ($\bot$). Therefore, we have $\lnot P$.

Both syntactic forms have some kind of *reductio ad absurdum* (reduction to / derivation of contradiction) argument. However, the first form provides an *indirect proof* for $P$; this is what we call a genuine "proof by contradiction". The second form provides a *direct proof* for $\lnot P$ which is just the negation of $P$; this is preferably called a "proof of negation", as it's not a proof of $P$ itself, but rather a proof of the negation of $P$.

But how are they any different? You may ask. In a classical setting, there is no semantic difference. Notice that in the first form ("proof by contradiction"), we could rewrite $P$ as $\lnot Q$, then we get

3. Prove $\lnot Q$: Assume $Q$, we derive a contradiction ($\bot$). Therefore, we have $\lnot Q$.

which is just the second form, i.e., a "proof of negation". Likewise, if we rewrite $P$ as $\lnot Q$ in the second form, we get

4. Prove $Q$: Assume $\lnot Q$, we derive a contradiction ($\bot$). Therefore, we have $Q$.

which is just the first form, i.e., a "proof by contradiction". That's the very reason people often misconceive them -- classically, a proof by contradiction and a proof of negation can be simply converted to the form of one another, without losing their semantic validity.

From a constructivist perspective, things are quite different. In the above rewritten forms, we introduced a new term $\lnot Q := P$. For the rewrite in the 3rd form to be valid, the new assumption $Q$ must be as strong as the original assumption $\lnot P$, which is just $\lnot \lnot Q$. Formally, there must be $\lnot \lnot Q \implies Q$. For the rewrite in the 4th form to be valid, the new statement $Q$ must be not any stronger than the original statement $\lnot P$, so formally there must also be $Q \implies \lnot \lnot Q$. In intuitionistic logic, although we can derive a "double negation introduction" (thus complete the rewrite in the 4th form), there is no way to derive a "double negation elimination" as required to get the 3rd form. So technically, while we can soundly rewrite from a "proof of negation" to a "proof by contradiction", the other direction is impossible. Indeed, we must make a clear distinction between a "proof by contradiction" and a "proof of negation" here: Semantically, they are not even dual and should not be fused with each other.

Why is this distinction important? Because in intuitionistic logic, the second form (proof of negation) is a valid proof; the first form (proof by contradiction) is not. Take a look at the negation introduction rule:
$$\lnot_\mathsf{I} : \frac{\Gamma, P \vdash \bot}{\Gamma \vdash \lnot P}$$
which justifies the validity of "proof of negation". However, there is no such rule saying that
$$\mathsf{PBC} : \frac{\Gamma, \lnot P \vdash \bot}{\Gamma \vdash P}$$
In classical logic, where a rule like $\mathsf{PBC}$ is allowed, one can easily derive the double negation elimination which we begged for before: Given $\Gamma \vdash \lnot \lnot P$, the only rule that ever introduces a negation is $\lnot_\mathsf{I}$, so we must also have $\Gamma, \lnot P \vdash \bot$. Then by $\mathsf{PBC}$, we get a derivation of $\Gamma \vdash P$, as desired.
$$\mathsf{DNE} : \frac{\Gamma \vdash \lnot \lnot P}{\Gamma \vdash P}$$
If we adopt $\mathsf{PBC}$, then we will also have adopted $\mathsf{DNE}$; if we have $\mathsf{DNE}$, then it would be perfectly valid to rewrite a "proof by contradiction" into the form of a "proof of negation", or the other way around, as is already shown before. Since constructivists do not want to accept rules like $\mathsf{PBC}$ or $\mathsf{DNE}$ at all, they claim that a "proof by contradiction" and a "proof of negation" are essentially different, in that the latter is a valid proof but the former is doubtful, while their distinction is purely syntactical for classical mathematicians as the semantic equivalence would be trivial with $\mathsf{PBC}$ or $\mathsf{DNE}$.

The rationale behind constructivists' choice of ruling out indirect proofs by rejecting derivation rules like $\mathsf{PBC}$ and $\mathsf{DNE}$ comes into view when talking about first-order theories, where existential quantifiers are used. Say, if we wish to prove that there exists some $x$ with a property $P$, we must specify an example $t$ which makes this property holds:
$$\exists_{\mathsf{I}_t} : \frac{\Gamma \vdash P[t/x]}{\Gamma \vdash \exists x : S.P}$$

:= ($t$ is a term of sort $S$)

This is something called a *constructive proof*, in the sense that in order to derive an existentialization, one must construct such a term explicitly, directly.

What if we allow $\mathsf{PBC}$ in our proofs then? We will be given enough power to utilize an alternate approach: Assume to the contrary that for all $x$ in $S$, $\lnot P$ holds. Then we derive a contradiction. Thus, by $\mathsf{PBC}$, there must exist some $x$ such that $P$ holds (since $\lnot (\exists x : S.P) \equiv \forall x : S.\lnot P$). Formally,
$$\frac{\Gamma, \forall x : S.\lnot P \vdash \bot}{\Gamma \vdash \exists x : S.P}$$
Note that a term $t$ is nowhere to be evident in this form of proof. The downside of this classical approach of *existence proof* is that it is non-constructive, so even if you can derive a proof that some mathematical object exists, you can't claim that you necessarily know what it is, since you have not concretely constructed such an object yet. Its existence is just "principally provable", but not necessarily constructible or witnessable.

I would say it's too much of a philosophical choice between classical logic and intuitionistic logic -- at least for old school mathematicians who don't practically mechanize their proofs at all. But one with some logic maturity should be able to draw a semantic distinction between a "proof by contradiction" that $\vdash P$ and a "proof of negation" that $\vdash \lnot P$, bewaring of how their treatments can diverge in non-classical logic settings. It is still questionable to me whether every theorem provable in classical logic can be proved constructively, whatsoever, a constructive proof almost always makes more sense: **If you claim that you have an apple, just show me the apple, instead of arguing to me sophistically that it can't be the case that you do not have an apple.**



# References

[1] Andrzej Filinski, "Course Notes for Semantics and Types, Lecture 1: Logic".

[2] Robert Harper, "A 'proof by contradiction' is not a proof that ends with a contradiction".
<https://existentialtype.wordpress.com/2017/03/04/a-proof-by-contradiction-is-not-a-proof-that-derives-a-contradiction/>

[3] Andrej Bauer, "Proof of negation and proof by contradiction".
<http://math.andrej.com/2010/03/29/proof-of-negation-and-proof-by-contradiction/>

[4] Timothy Gowers, "When is proof by contradiction necessary?".
<https://gowers.wordpress.com/2010/03/28/when-is-proof-by-contradiction-necessary/>

[5] Terence Tao, "The 'no self-defeating object' argument".
<https://terrytao.wordpress.com/2009/11/05/the-no-self-defeating-object-argument/>
