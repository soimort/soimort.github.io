---
title: The Adversarial Computation
subtitle: Build me an unbreakable cryptosystem.
author: Mort Yao
date: 2017-01-01
---

[Theory of computation](https://wiki.soimort.org/comp/) (computability and complexity) forms the basis for modern cryptography:

* What is an [algorithm](https://wiki.soimort.org/comp/algorithm/)?
    * An algorithm is a *computational method* for solving an *abstract problem*.
    * An algorithm takes as input a set $I$ of *problem instances*, and outputs a solution from the set $S$ of *problem solutions*.
    * An algorithm is represented in a well-defined [formal language](https://wiki.soimort.org/comp/language/).
    * An algorithm must be able to be represented within a finite amount of time and space (otherwise it cannot be actually used for solving any problem).
    * An algorithm can be simulated by any *model of computation*:
        * *Turing machine* is a model implemented through internal *states*.
        * *λ-calculus* is a model based on pure *functions*.
        * All Turing-complete models are equivalent in their computational abilities.
    * Computability: Not every abstract problem is solvable. Notably, there exists a decision problem for which some instances can neither be accepted nor rejected by any algorithm. (*Undecidable problem*)
    * Complexity:
        * The complexity class P is closed under polynomial-time reductions. Hence, proof by reduction can be a useful technique in provable security of cryptosystems.
        * If one can prove that P = NP, then one-way functions do not exist. This would invalidate the construction of cryptographically secure pseudorandom generators (PRG). (*Pseudorandom generator theorem*)
    * In many scenarios, we assume that an algorithm acts as a stateless computation and takes independent and identically distributed inputs. It differs from a computer program conceptually.
    * An algorithm can be either *deterministic* or *probabilistic*.
        * For probabilistic algorithms, the source of randomness may be from:
            * External (physical) input of high entropy.
            * Pseudorandomness: Since everything computational is deterministic, the existence of pseudorandomness relies on the (assumed) existence of one-way functions and PRGs.

Generally, pseudorandom generators used in probabilistic algorithms yield random bits according to the uniform distribution, so it is worth mentioning:

* Basic probability theory
    * [Discrete uniform distribution](https://wiki.soimort.org/math/probability/#discrete-uniform-distribution). $\mathcal{U}\{a,b\}$. The probability distribution where a finite number of values are equally likely to be observed (with probability $\frac{1}{b-a+1}$).

Cryptographic schemes are defined as tuples of deterministic or probabilistic algorithms:

* [Principles of modern cryptography](https://wiki.soimort.org/crypto/intro/)
    * Formal description of a *private-key encryption scheme* $\Pi=(\mathsf{Gen},\mathsf{Enc},\mathsf{Dec})$ with message space $\mathcal{M}$.
        * $\mathsf{Gen}$, $\mathsf{Enc}$, $\mathsf{Dec}$ are three algorithms.
        * Correctness: $\mathsf{Dec}_k(\mathsf{Enc}_k(m)) = m$.
        * For the correctness equality to hold, $\mathsf{Dec}$ should be deterministic.
        * Assume that we have access to a source of randomness, $\mathsf{Gen}$ should choose a key at random thus is probabilistic. If $\mathsf{Gen}$ is deterministic and always generate the same key, such an encryption scheme is of no practical use and easy to break.
        * $\mathsf{Enc}$ can be either deterministic (e.g., as in one-time pads) or probabilistic. Later we will see that for an encryption scheme to be CPA-secure, $\mathsf{Enc}$ should be probabilistic.
    * **Kerchhoffs' principle (Shannon's maxim)** claims that a cryptosystem should be secure even if the scheme $(\mathsf{Gen},\mathsf{Enc},\mathsf{Dec})$ is known to the adversary. That is, security should rely solely on the secrecy of the private key.
    * Provable security of cryptosystems requires:
        1. Formal definition of security;
        2. Minimal assumptions;
        3. Rigorous proofs of security.
    * Common attacks and notions of security:
        * **Ciphertext-only attack**.
            * A crytosystem is said to be *perfectly secret* if it is theoretically unbreakable under ciphertext-only attack.
            * A cryptosystem is said to be *computationally secure* if it is resistant to ciphertext-only attack (by any polynomial-time adversary).
        * **Known-plaintext attack (KPA)**. A cryptosystem is *KPA-secure* if it is resistant to KPA.
            * KPA-security implies ciphertext-only security.
        * **Chosen-plaintext attack (CPA)**. A cryptosystem is *CPA-secure* (or *IND-CPA*) if it is resistant to CPA.
            * IND-CPA implies KPA-security.
        * **Chosen-ciphertext attack (CCA)**. A cryptosystem is *CCA-secure* (or *IND-CCA1*) if it is resistant to CCA; furthermore, a cryptosystem is *IND-CCA2* if it is resistant to adaptive CCA (where the adversary may make further calls to the oracle, but may not submit the challenge ciphertext).
            * IND-CCA1 implies IND-CPA.
            * IND-CCA2 implies IND-CCA1. Thus, IND-CCA2 is the strongest of above mentioned definitions of security.
* [Perfect secrecy](https://wiki.soimort.org/crypto/perfect-secrecy/)
    * Two equivalent definitions: (proof of equivalence uses Bayes' theorem)
        * $\Pr[M=m\,|\,C=c] = \Pr[M=m]$. (Observing a ciphertext $c$ does not leak any information about the underlying message $m$)
        * $\Pr[\mathsf{Enc}_K(m)=c] = \Pr[\mathsf{Enc}_K(m')=c]$. (The adversary has no bias when distinguishing two messages if given only the ciphertext $c$)
    * **Perfect indistinguishability** defined on adversarial indistinguishability experiment $\mathsf{PrivK}_{\mathcal{A},\Pi}^\mathsf{eav}$:
        * $\Pr[\mathsf{PrivK}_{\mathcal{A},\Pi}^\mathsf{eav} = 1] = \frac{1}{2}$. (No adversary can win the indistinguishability game with a probability better than random guessing)
    * Perfect indistinguishability is equivalent to the definition of perfect secrecy.
    * The adversarial indistinguishability experiment is a very useful setting in defining provable security, e.g., the definition of computational indistinguishability: (for arbitrary input size $n$)
        * $\Pr[\mathsf{PrivK}_{\mathcal{A},\Pi}^\mathsf{eav}(n) = 1] \leq \frac{1}{2} + \mathsf{negl}(n)$
        where $\mathsf{negl}(n)$ is a negligible function.
    * Perfect secrecy implies that $|\mathcal{K}| \geq |\mathcal{M}|$, i.e., the key space must be larger than the message space. If $|\mathcal{K}| < |\mathcal{M}|$, then the scheme cannot be perfectly secure.
    * **Shannon's theorem**: If $|\mathcal{K}| = |\mathcal{M}| = |\mathcal{C}|$, an encryption scheme is perfectly secret iff:
        * $k \in \mathcal{K}$ is chosen uniformly.
        * For every $m \in \mathcal{M}$ and $c \in \mathcal{C}$, there exists a unique $k \in \mathcal{K}$ such that $\mathsf{Enc}_k(m) = c$.

A brief, formalized overview of some classical ciphers, and their security:

* [One-time pad (Vernam cipher)](https://wiki.soimort.org/crypto/one-time-pad/): XOR cipher when $|\mathcal{K}| = |\mathcal{M}|$.
    * One-time pad is perfectly secret. The proof simply follows from Bayes' theorem. (Also verified by Shannon's theorem. While one-time pad was initially introduced in the 19th century and patented by G. Vernam in 1919, it was not until many years later Claude Shannon gave a formal definition of information-theoretical security and proved that one-time pad is a perfectly secret scheme in his groundbreaking paper. [[@shannon1949communication]](#ref-shannon1949communication))
    * One-time pad is deterministic. Moreover, it is a reciprocal cipher ($\mathsf{Enc} = \mathsf{Dec}$).
    * One-time pad is *not* secure when the same key is applied in multiple encryptions, and it is *not* CPA-secure. In fact, an adversary can succeed in such indistinguishability experiments with probability 1.
* Insecure historical ciphers:
    * [Shift cipher](https://wiki.soimort.org/crypto/classical/shift/): Defined with key space $\mathcal{K}=\{0,\dots,n-1\}$. ($n=|\Sigma|$)
        * $|\mathcal{K}|=n$, $|\mathcal{M}|=n^\ell$.
        * Cryptanalysis using frequency analysis.
    * [Substitution cipher](https://wiki.soimort.org/crypto/classical/substitution/): Defined with key space $\mathcal{K} = \mathfrak{S}_\Sigma$ (symmetric group on $\Sigma$).
        * $|\mathcal{K}|=n!$, $|\mathcal{M}|=n^\ell$.
        * Cryptanalysis using frequency analysis.
    * [Vigenère cipher (poly-alphabetic shift cipher)](https://wiki.soimort.org/crypto/classical/vigenere/): Like (mono-alphabetic) shift cipher, but the key length is an (unknown) integer $t$.
        * $|\mathcal{K}|=n^t$, $|\mathcal{M}|=n^\ell$. (Typically $t \ll \ell$)
        * Cryptanalysis using Kasiski's method, index of coincidence method and frequency analysis.

Lessons learned from these classical ciphers: While perfect secrecy is easy to achieve (one-time pads), designing practical cryptographic schemes (with shorter keys, and computationally hard to break) can be difficult.



## Where do random bits come from?

The construction of private-key encryption schemes involves probabilistic algorithms. We simply assume that an unlimited supply of independent, unbiased random bits is available for these cryptographic algorithms. But in practice, this is a non-trivial issue, as the source of randomness must provide high-entropy data so as to accommodate cryptographically secure random bits.

In the perfectly secret scheme of one-time pads, the key generation algorithm $\mathsf{Gen}$ requires the access to a source of randomness in order to choose the uniformly random key $k \in \mathcal{K}$. Practically, high-entropy data may be collected via physical input or even fully written by hand with human labor.

Theoretically, without external intervention, we have:

**Conjecture 3.1.** *Pseudorandom generators exist.*

**Theorem 3.2. (Pseudorandom generator theorem)**
*Pseudorandom generators exist if and only if one-way functions exist.*

Pseudorandomness is also a basic construction in CPA-secure encryption algorithms ($\mathsf{Enc}$), e.g., in stream ciphers and block ciphers.

So what is an acceptable level of pseudorandomness, if we are not sure whether such generators theoretically exist? Intuitively, if one cannot distinguish between a "pseudorandom" string (generated by a PRG) and a truly random string (chosen according to the uniform distribution), we have confidence that the PRG is a good one. Various statistical tests have been designed for testing the randomness of PRGs.



## Pseudorandomness and IND-CPA

It holds true that:

**Corollary 3.3.** By redefining the key space, we can assume that any encryption scheme $\Pi=(\mathsf{Gen},\mathsf{Enc},\mathsf{Dec})$ satisfies

1. $\mathsf{Gen}$ chooses a uniform key.
2. $\mathsf{Enc}$ is deterministic.

If so, why do we still need probabilistic $\mathsf{Enc}$ in CPA-secure encryptions? Can't we just make $\mathsf{Enc}$ deterministic while still being CPA-secure?

The first thing to realize is that chosen-plaintext attacks are geared towards multiple encryptions (with the same secret key $k$), so when the adversary obtains a pair $(m_0, c_0)$ such that $\Pr[C=c_0\,|\,M=m_0] = 1$, *the key is already leaked*. (Recall that the adversary knows the *deterministic* algorithm $\mathsf{Enc}_k$, thus reversing $k$ from known $m_0$ and $c_0$ can be quite feasible; e.g., in a one-time pad, $k = m_0 \oplus c_0$.) The only way to get around this is make $\mathsf{Enc}_k$ *probabilistic* (constructed from a *pseudorandom function*), such that an adversary cannot reverse the key efficiently within polynomial time.

Note that perfect secrecy is not possible under CPA, since there is a small possibility that the adversary will reverse the key (by, for example, traversing an exponentially large lookup table of all random bits) and succeed in the further indistinguishability experiment with a slightly higher (but negligible) probability.



## Historical exploits of many-time pad

One-time pad is one of the most (provably) secure encryption schemes, and its secrecy does not rely on any computational hardness assumptions. However, it requires that $|\mathcal{K}| \geq |\mathcal{M}|$ (which in fact is a necessary condition for any perfectly secret scheme), thus its real-world use is limited.

The one-time key $k$ (uniformly chosen from the key space $\mathcal{K}$) may *not* be simply reused in multiple encryptions. Assume that $|\mathcal{K}| = |\mathcal{M}|$, for encryptions of $n$ messages, the message space is expanded to size $|\mathcal{M}|^n$, while the key space remains $\mathcal{K}$, thus we have $|\mathcal{K}| < |\mathcal{M}|^n$. Such a degraded scheme (many-time pad) is theoretically insecure and vulnerable to several practical cryptanalyses.

A historical exploit of the vulnerability of many-time pad occurred in the VENONA project, where the U.S. Army's Signal Intelligence Service (later the NSA) aimed at decrypting messages sent by the USSR intelligence agencies (KGB) over a span of 4 decades. As the KGB mistakenly reused some portions of their one-time key codebook, the SIS was able to break a good amount of the messages. ^[R. L. Benson, "The Venona story." <https://www.nsa.gov/about/cryptologic-heritage/historical-figures-publications/publications/coldwar/assets/files/venona_story.pdf>]



## References and further reading

**Books:**

J. Katz and Y. Lindell, *Introduction to Modern Cryptography*, 2nd ed.

**Papers:**
