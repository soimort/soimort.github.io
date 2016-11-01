% The Decisional Hardness
% Mort Yao
% 2016-11-01

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
2. One-way functions exist, which implies that pseudorandom generators and functions exist. Consequently, many cryptographic constructions (private-key encryption, MACs, etc.) are provably computationally secure.

Later we will cover the notion of security in cryptography, so there is a refresher of basic probability: (Probability is also considerably used in analyzing the behaviors of non-deterministic algorithms, hash functions, etc.)

* [Probability](https://wiki.soimort.org/math/probability/)
    - An intuitive introduction to basic probability theory based on Kolmogorov's axioms, including the union bound (Boole's inequality) and its generalized form Bonferroni inequalities, the conditional probability and Bayes' theorem. We will revisit the notion of probability space when coming to measure theory.

Plan for next week:

* **(Algorithms)** More involved NP-complete problems. Exact algorithms. Approximation algorithms. Probabilistic algorithms.
* **(Cryptography)** Information-theoretic/computational security (semantic security, IND, IND-CPA, IND-CCA). Private-key encryption. Message authentication codes. Hash functions. Theoretical constructions (one-way functions, pseudorandomness). Practical constructions (Feistel network, substitution-permutation network, DES, AES).
