---
title: The Decisional Hardness
subtitle: How "hard" is NP-hard?
author: Mort Yao
date: 2016-11-01
date-updated: 2016-11-20
---

[+]
**(20 Nov 2016) Correction:** P ≠ NP is not sufficient to imply that one-way functions exist. See [P versus NP problem and one-way functions](#p-versus-np-problem-and-one-way-functions).

---

**Intro.** Starting from November, I'll summarize my study notes on [wiki](https://wiki.soimort.org) into weekly blog posts. I always wanted to keep my study progress on track; I feel that it's hard even to convince myself without visible footprints.

So here we have the first episode. (Hopefully it won't be the last one)

---

Asymptotic notation is an important tool in analyzing the time/space efficiency of algorithms.

* [Limit](https://wiki.soimort.org/math/calculus/limit/)
    - Formal definition of limit (the (ε, δ)-definition) in calculus. Note that limits involving infinity are closely related to asymptotic analysis. In addition to basic limit rules, L'Hôpital's rule is also relevant.
* [Asymptotic notation](https://wiki.soimort.org/algo/asymptotic-notation/)
    - Introduction to the Bachmann–Landau notation family (among them are the most widely-used Big O notation and Big Theta notation).
    - Master theorem is used to find the asymptotic bound for recurrence. This is particularly helpful when analyzing recursive algorithms (e.g., binary search, merge sort, tree traversal).
    - Based on common orders of asymptotic running time using Big O notation, we can categorize algorithms into various classes of time complexities (among them are P, DLOGTIME, SUBEXP and EXPTIME). Note that we have not formally defined the word "algorithm" and "complexity class" yet.

For decision problems, we now formally define the time complexity classes P and NP, and propose the hardness of NP-complete problems, which plays an indispensable role in the study of algorithm design and modern cryptography.

* [Formal language](https://wiki.soimort.org/comp/language/)
    - Formal definition of language. We will revisit this when studying formal grammars like the context-free grammar and parsing techniques for compilers. For now, it suffices to know that binary string is a common encoding for all kinds of problems (especially, decision problems).
* [Decidability](https://wiki.soimort.org/comp/decidability/)
    - Among all abstract problems, we are mostly interested in decision problems.
    - The decidability of a language depends on whether there exists an algorithm that decides it.
* [Reducibility](https://wiki.soimort.org/comp/reducibility/)
    - Polynomial-time reduction is a commonly used technique that maps one language to another.
    - What is a hard language for a complexity class; what is a complete language for a complexity class.
* [Time complexity](https://wiki.soimort.org/comp/complexity/time/)
    - Encodings of concrete problems matter. Normally we would choose a "standard encoding" for our language of interest.
    - Polynomial-time algorithms are considered to be efficient and languages which have polynomial-time algorithms that decide them are considered tractable.
    - P is the time complexity class of all problems that are polynomial-time solvable.
    - NP is the time complexity class of all problems that are polynomial-time verifiable.
* [NP-completeness](https://wiki.soimort.org/comp/complexity/time/npc/)
    - The set of languages that are complete for the complexity class NP, that is, the "hardest problems" in NP.
    - NP-complete problems are central in answering the open question whether P = NP.
    - We (informally) show that every NP problem is polynomial-time reducible to CIRCUIT-SAT, and that CIRCUIT-SAT is NP-complete.
    - There are other problems (SAT, 3-CNF-SAT, CLIQUE, VERTEX-COVER, HAM-CYCLE, TSP, SUBSET-SUM) polynomial-time reducible from one to another, thus they are also shown to be NP-complete.

**Computational hardness assumption P ≠ NP.** Although it is still an open proposition, many believe that P ≠ NP. Notably, if P ≠ NP holds true,

1. If a decision problem is polynomial-time unsolvable in general case, we should strive to find approximations or randomized algorithms; exact algorithms cannot be run in worst-case polynomial time thus may not be efficient. This applies to optimization problems too.
2. <del>One-way functions exist, which implies that pseudorandom generators and functions exist. Consequently, many cryptographic constructions (private-key encryption, MACs, etc.) are provably computationally secure.</del>

[+]
(I stand corrected: There is no such a known proof showing that P ≠ NP implies the existence of one-way functions. However, reversely, the existence of one-way functions implies that P ≠ NP. There is an informal argument given by Peter Shor on StackExchange^[<http://cstheory.stackexchange.com/a/8843/21291>], rephrased in the section [P versus NP problem and one-way functions](#p-versus-np-problem-and-one-way-functions).)

Later we will cover the notion of security in cryptography, so there is a refresher of basic probability: (Probability is also considerably used in analyzing the behaviors of non-deterministic algorithms, hash functions, etc.)

* [Probability](https://wiki.soimort.org/math/probability/)
    - An intuitive introduction to basic probability theory based on Kolmogorov's axioms, including the union bound (Boole's inequality) and its generalized form Bonferroni inequalities, the conditional probability and Bayes' theorem. We will revisit the notion of probability space when coming to measure theory.

Plan for next week:

* **(Algorithms)** More involved NP-complete problems. Exact algorithms. Approximation algorithms. Probabilistic algorithms.
* **(Cryptography)** Information-theoretic/computational security (semantic security, IND, IND-CPA, IND-CCA). Private-key encryption. Message authentication codes. Hash functions. Theoretical constructions (one-way functions, pseudorandomness). Practical constructions (Feistel network, substitution-permutation network, DES, AES).



## P versus NP problem and one-way functions

Consider the following map:
$$f : (x, r) \to s$$
where $x$ is an arbitrary bit string, $r$ is a string of random bits, and $s$ is an instance of a $k$-SAT problem having $x$ as a planted solution, while the randomness of $r$ determines uniquely which $k$-SAT problem to choose.

If we can invert the above function $f$ (in polynomial time), we must already have solved the corresponding $k$-SAT problem $s$ with a planted solution $x$. $k$-SAT problems are known to be NP-complete, and inverting such a function would be as hard as solving a $k$-SAT problem with a planted solution, that is, inverting $f$ *at one point* can be hard. Clearly, should we have a one-way function, then inverting it is guaranteed to be no easier than inverting $f$.

So what does it mean if P ≠ NP? We know that $k$-SAT problem is hard to solve in its *worst case*, so function $f$ can be made as hard to invert as solving a $k$-SAT problem in its *worst case*. However, we don't know whether it's possible to have a class $\mathcal{S}$ of $k$-SAT problems with planted solutions that are as hard as general-case $k$-SAT problems. If such a class $\mathcal{S}$ exists, then given any $s \in \mathcal{S}$, no probabilistic polynomial-time algorithm is able to get $x$ with a non-negligible probability, so we can conclude that $f$ is indeed a one-way function. [[@selman1992survey]](#ref-selman1992survey)

**Problem 1.1.** Does there exist a class $\mathcal{S}$ of $k$-SAT problems with planted solutions, such that every $L \in \mathcal{S}$ is NP-hard?

**Conjecture 1.2.** *If $\mathrm{P} \neq \mathrm{NP}$, then one-way functions exist.*

On the other hand, assume that $f$ is a one-way function, so that one-way functions do exist, then this implies that $k$-SAT problem is hard to solve (in its worse case) by a polynomial-time algorithm, thus we have P ≠ NP. By modus tollens, if P = NP, then no one-way function exists. [[@abadi1990generating]](#ref-abadi1990generating)

**Theorem 1.3.** *If one-way functions exist, then $\mathrm{P} \neq \mathrm{NP}$.*

*Proof.* *(Sketch)* Let $f : \{0,1\}^*\to\{0,1\}^*$ be a one-way function. There is a polynomial-time algorithm $M_f$ that computes $y=f(x)$ for all $x$, thus, there exists a polynomial-time computable circuit that outputs $y=f(x)$ for all $x$.

Since $f$ is a one-way function, that is, for every probabilistic polynomial-time algorithm $\mathcal{A}$, there is a negligible function $\mathsf{negl}$ such that $\Pr[\mathsf{Invert}_{\mathcal{A},f}(n) = 1] \leq \mathsf{negl}(n)$, so we know that no $\mathcal{A}$ can fully compute $f^{-1}(x)$ for any given $x$. $\mathcal{A}$ fully computes $f^{-1}$ if and only if it solves the corresponding `CIRCUIT-SAT` problems of the circuit in all cases. Thus, there must exist some `CIRCUIT-SAT` problems that cannot be decided by a polynomial-time algorithm, therefore, $\mathrm{P} \neq \mathrm{NP}$.
[QED]

*Remark 1.4.* If one can come up with a construction of the one-way function or a proof that such functions exist, then it holds true that $\mathrm{P} \neq \mathrm{NP}$.



## References and Further Reading

**Books:**

T. H. Cormen, C. E. Leiserson, R. L. Rivest, and C. Stein, *Introduction to Algorithms*, 3rd ed.

M. Sipser, *Introduction to the Theory of Computation*, 3rd ed.

J. Katz and Y. Lindell, *Introduction to Modern Cryptography*, 2nd ed.

**Papers:**
