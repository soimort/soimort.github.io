---
title: Bloom Filters in Adversarial Environments
subtitle: Reading report
author: Mort Yao
date: 2016-11-15
category: cryptography
---

[+]
This is an expository reading summary of a selected [CRYPTO 2015 paper](https://eprint.iacr.org/2015/543.pdf) I did as an assignment in KU's [Introduction to Modern Cryptography](http://kurser.ku.dk/course/nscphd1080/2016-2017) course. Adversarial-resilient Bloom filters are the counterparts of cryptographically secure hash functions in an adversarial setting, where adaptive adversaries that have access to a deterministic or non-deterministic query oracle may challenge the data structure in a way that intentionally increases the false positive rate of querying. As a preliminary result, this paper shows that the resistance of Bloom filters against computationally bounded adversaries requires that [one-way functions exist](/mst/1/#p-versus-np-problem-and-one-way-functions); furthermore, such constructions are possible using pseudorandom permutations. I do find the proof a bit involved, but the notions of security introduced for Bloom filters are new and appealing (which I haven't read previously anywhere else). \
There is also a [PDF version](https://www.dropbox.com/s/qgo4uat7zghu8vz/notes.pdf?dl=1) of this report.

Original paper:

* **M. Naor and E. Yogev, "Bloom filters in adversarial environments," in Annual Cryptology Conference, 2015.** [[arXiv:1412.8356]](https://arxiv.org/abs/1412.8356)

---

:= **Abstract**

Bloom filter is a hash-based probabilistic data structure which is space-efficient for set membership querying, with a small probability of false positives. Naor and Yogev's 2015 paper introduces the adversarial model and formally proposes a strong notion of security for Bloom filters, i.e., *adversarial resilience*, based on an adversarial game under a cryptographic setting. This paper also discusses the correspondence between adversarial-resilient Bloom filters and the open assumption that one-way functions exist, thus enables theoretical constructions using pseudorandom permutations. We believe that such an understanding will help design practical Bloom filters that are safe from known attacks in software systems.



# 1. Introduction

Probabilistic data structures are data structures that employ randomness in their designs to enable more efficient approaches of storing and querying data, compared to deterministic ones. Traditionally, the algorithmic probabilistic analysis of such data structures assumes the model where all inputs and queries are *independent* of the internal randomness of data structures. In this work, we consider an adversarial environment, where a computationally bounded adversary^[We will only consider polynomial-time adversaries here.] may adaptively chooses inputs and queries with the intention of degrading the efficiency of the underlying data structure of some computer system. By introducing the adversarial model, we analyze the behavior of such data representations under the cryptographic notion of computational security against adversaries; furthermore, it enables us to construct more efficient, provably secure schemes of probabilistic data structures.

As a concrete example, a Bloom filter is a probabilistic data structure that holds a set $S$ of elements approximately, using significantly fewer bits of storage and allowing for faster access than a complete representation. As a trade-off between efficiency and preciseness, for any query of $x \in S$, a Bloom filter always outputs a *yes*-answer, and for any query of $x \not\in S$, it should output a *yes*-answer only with small probability. In other words, a *no*-answer given by a Bloom filter indicates unambiguously that $x \not\in S$, while a *yes*-answer indicates that $x \in S$ probably holds^[For this reason, a *yes*-answer is also referred to as a *maybe*-answer in some texts.], that is, it allows false positives. Ideally, the error probability that a Bloom filter returns a false positive should be as small as possible.

Approaching the commonly-seen set membership problem, Bloom filters have been implemented widely in real-world applications, specifically as internal data representations for optimizing large-scale software systems. For example, Akamai's CDN^[A CDN (Content Delivery Network) is a globally distributed network of proxy servers deployed in multiple data centers, in order to serve cached content to end-users with high availability and high performance.] servers maintain Bloom filters in their memories to decide whether to lookup the disk cache for a requested resource, and a false positive of the Bloom filter causes a cache miss, which means that the server has to make an unnecessary disk lookup at an expense of time and system workload; if an attacker exploits the behaviors of the Bloom filter, it is possible for them to cast queries that degrade the disk cache hit rate of the CDN servers, and consequently, perform a Denial-of-Service (DoS) attack.[@maggs2015algorithmic] On another scenario, where Bitcoin clients apply Bloom filters in the Simplified Payment Verification (SPV) mode to increase the overall performance of wallet synchronization, an adversary may perform a DoS attack on an SPV node by learning from the responses of Bloom filters they have access to.[@benjaminattacks]

As discussed above, the adversarial model addresses some security issues, thus the necessity of defining security in adversarial environments and constructing provably secure Bloom filters arises. Essentially, it is desirable for a well-constructed Bloom filter to maintain its small error probability in an adversarial environment; we say that such a Bloom filter is *adversarial resilient* (or just *resilient*). In an adversarial game, where an adversary has oracle access to the Bloom filter and is allowed to make a number of $t$ queries before it outputs a certain $x^*$ (that has not been queried before) which is believed to be a false positive, and if it is, the adversary wins the game. We say that a Bloom filter is $(n,t,\varepsilon)$-*adversarial resilient* if when initialized over sets of size $n$ then after $t$ queries the probability of $x^*$ being a false positive is at most $\varepsilon$. A Bloom filter that is resilient for any polynomially many queries is said to be *strongly resilient*.

Clearly, a trivial construction of a strongly resilient Bloom filter would be a deterministic lookup table that stores $S$ precisely, so that there is no false positive which an adversary can find. However, such a construction does not take advantage of the space and time efficiency as a normal Bloom filter would do, since it stores every element in the memory. In the following, we consider only non-trivial Bloom filters, and we show that for a non-trivial Bloom filter to be adversarial-resilient, one-way functions must exist; that is, if one-way functions do not exist, then any non-trivial Bloom filter can be attacked with a non-negligible probability by an efficient adversary. Furthermore, under the assumption that one-way functions exist, a pseudorandom permutation (PRP) can be used to construct a strongly resilient Bloom filter which has a reasonable memory consumption.

The construction of a Bloom filter consists of two algorithms: an initialization algorithm that gets a set $S$ and outputs a memory-efficient representation of $S$; a query algorithm that gets a representation of $S$ and an $x$ to be checked and outputs $1$ if $x \in S$, otherwise $0$. Typically, the initialization algorithm is randomized but the query algorithm is deterministic, that is, a query operation does not amend the existing representation. We say that such a Bloom filter has a *steady representation*.^[In this work, we will consider only steady representations.]



# 2. Definitions

In the following model, we consider a universal set $U$ and a subset $S \subset U$ to be stored in a Bloom filter. We denote that $u=|U|$ and $n=|S|$.

**Definition 1. (Steady-representation Bloom filter)**
*Let $\mathbf{B}=(\mathbf{B}_1,\mathbf{B}_2)$ be a pair of polynomial-time algorithms, where $\mathbf{B}_1$ is a randomized algorithm that gets as input a set $S$ and outputs a representation $M$, and $\mathbf{B}_2$ is a deterministic algorithm that gets as input a representation $M$ and a query element $x \in U$. We say that $\mathbf{B}$ is an $(n,\varepsilon)$-Bloom filter (with a steady representation) if for any set $S \subset U$ of size $n$ it holds that:*

1. $\forall x \in S, \Pr[\mathbf{B}_2(\mathbf{B}_1(S), x) = 1] = 1$ **(Completeness)**

2. $\forall x \not\in S, \Pr[\mathbf{B}_2(\mathbf{B}_1(S), x) = 1] \leq \varepsilon$ **(Soundness)**

*where the probability is taken over the randomness used by the algorithm $\mathbf{B}_1$.*

Intuitively, the first property (completeness) says that for all elements in the set $S$, the Bloom filter is guaranteed to output a *yes*-answer correctly; the second property (soundness) gives the upper bound that the Bloom filter outputs a false positive, that is, the query algorithm returns $1$ when an element does not actually belong to the set $S$. Formally,

**False positive and error rate.**
Given a representation $M$ of $S$, if $x \not\in S$ and $\mathbf{B}_2(M,x)=1$, we say that $x$ is a *false positive*. And we say that the probability bound $\varepsilon$ of outputting false positives is the *error rate* of $\mathbf{B}$.

In an adversarial environment, consider the following experiment for any Bloom filter $\mathbf{B}=(\mathbf{B}_1,\mathbf{B}_2)$, adversary $\mathcal{A}$, value $t$ as the bound of the amount of queries which $\mathcal{A}$ can make, and value $\lambda$ as the security parameter.

**The Bloom filter resilience challenge experiment $\mathsf{Challenge}_{\mathcal{A},\mathbf{B},t}(\lambda)$:**

1. $M \leftarrow \mathbf{B}_1(1^\lambda,S)$.^[The security parameter $\lambda$ is implied in the initialization algorithm $\mathbf{B}_1$, thus we denote it as $\mathbf{B}_1(1^\lambda,S)$.]
2. $x^* \leftarrow \mathcal{A}^{\mathbf{B}_2(M,\cdot)}(1^\lambda,S)$, where $\mathcal{A}$ performs at most $t$ queries $x_1,\dots,x_t$ to the oracle $\mathbf{B}_2(M,\cdot)$. Note that $\mathcal{A}$ has only oracle access to the Bloom filter and cannot see the representation $M$.^[To strengthen our definition, we assume that the adversary also gets the set $S$, and it is important that the adversary can hardly find any false positive even if given $S$.]
3. The output of the experiment is defined to be $1$, if $x^* \not\in S \cup \{x_1,\dots,x_t\}$ and $\mathbf{B}_2(M,x^*)=1$, and $0$ otherwise. If the output of the experiment is $1$, we say that $\mathcal{A}$ succeeds.

**Definition 2. (Adversarial-resilient Bloom filter)**
*Let $\mathbf{B}=(\mathbf{B}_1,\mathbf{B}_2)$ be an $(n,\varepsilon)$-Bloom filter (with a steady representation). We say that $\mathbf{B}$ is an $(n,t,\varepsilon)$-adversarial resilient Bloom filter if for any set $S$ of size $n$, for all sufficiently large $\lambda \in \mathbb{N}$ and for all probabilistic polynomial-time adversaries $\mathcal{A}$, it holds that*
$$\Pr[\mathsf{Challenge}_{\mathcal{A},\mathbf{B},t}(\lambda) = 1] \leq \varepsilon$$

*where the probability is taken over the randomness used by the algorithm $\mathbf{B}_1$ and $\mathcal{A}$.*

To define the non-triviality of a Bloom filter formally, notice that it is always desirable to minimize the memory use of the Bloom filter. Let $\mathbf{B}$ be an $(n,\varepsilon)$-Bloom filter that uses $m$ bits of memory. It is shown[@carter1978exact] that the lower bound of $m$ is $m \geq n \log \frac{1}{\varepsilon}$. Thus, we define

**Definition 3. (Minimal error)**
*Let $\mathbf{B}$ be an $(n,\varepsilon)$-Bloom filter. We say that $\varepsilon_0 = 2^{-\frac{m}{n}}$ is the minimal error of $\mathbf{B}$.*

As mentioned previously, a trivial construction of Bloom filters is a lookup table that stores $S$ precisely, in which case, the memory use $m=\log \binom{u}{n} \approx n \log(\frac{u}{n})$, thus by using the bound $m \geq n \log \frac{1}{\varepsilon}$, a construction is trivial if $\varepsilon > \frac{n}{u}$. On the other hand, if $u$ is super-polynomial in $n$, then $\varepsilon$ is negligible in $n$ and every polynomial-time adversary has only negligible probability to find any false positive, therefore for such $S \subset U$, the Bloom filter must be trivial. Notice that $\varepsilon_o \leq \varepsilon$, we then define

**Definition 4. (Non-trivial Bloom filter)**
*Let $\mathbf{B}$ be an $(n,\varepsilon)$-Bloom filter and let $\varepsilon_0$ be the minimal error of $\mathbf{B}$. We say that $\mathbf{B}$ is non-trivial if there exists a constant $c \geq 1$ such that $\varepsilon_0 > \max\{\frac{n}{u},\frac{1}{n^c}\}$.*



# 3. Resilient Bloom Filters and One-Way Functions

We now show that the existence of adversarial resilient Bloom filters depends on the existence of one-way functions, that is, if any non-trivial, strongly resilient Bloom filter exists, then one-way functions also exist.

**Theorem 5.**
*Let $\mathbf{B}=(\mathbf{B}_1,\mathbf{B}_2)$ be any non-trivial Bloom filter (with a steady representation) of $n$ elements that uses $m$ bits of memory, and let $\varepsilon_0$ be the minimal error of $\mathbf{B}$. If $\mathbf{B}$ is $(n,t,\varepsilon)$-adversarial resilient for $t=\mathcal{O}(\frac{m}{\varepsilon_0^2})$, then one-way functions exist.*

**Proof.**
First we assume that one-way functions do not exist, then we show that we can construct a polynomial-time adversary $\mathcal{A}$ such that
$$\Pr[\mathsf{Challenge}_{\mathcal{A},\mathbf{B},t}(\lambda) = 1] > \varepsilon$$
given a fixed value $\varepsilon$. That is, $\mathbf{B}$ cannot be $(n,t,\varepsilon)$-adversarial resilient.

Define the following function $f$:
$$f(S,r,x_1,\dots,x_t) = (x_1,\dots,x_t,\mathbf{B}_2(M,x_1),\dots,\mathbf{B}_2(M,x_t))$$
where $S$ is a set of size $n$, $r$ is the number of bits used by the randomness of $\mathbf{B}_1$, $M$ is a representation of $S$ generated by $\mathbf{B}_1$, and $t=\frac{200m}{\varepsilon_0}$. Clearly, $f$ is polynomial-time computable.

Since $f$ is not a one-way function (under the assumption that one-way functions do not exist), there is also an algorithm that can invert $f$ efficiently. Thus we have,

**Claim 6.**
*Assume that one-way functions do not exist, there exists a polynomial-time algorithm $\mathcal{A}$ that inverts $f$ with a failure probability of at most $\frac{1}{100}$:*
$$\Pr[f(\mathcal{A}(f(S,r,x_1,\dots,x_t))) \neq f(S,r,x_1,\dots,x_t)] < \frac{1}{100}$$

**Proof.**
Because $f$ is not a one-way function, there exists[@katz2014introduction] an algorithm $\mathcal{A}'$ such that $\Pr[\mathsf{Invert}_{\mathcal{A}',f}(n) = 1] \geq \frac{1}{p(n)}$, where $p(n)$ is polynomial in $n$. Construct an algorithm $\mathcal{A}$ that
runs $\mathcal{A}'$ individually for $\lceil\frac{\log 100}{\log(p(n)) - \log(p(n)-1)}\rceil$ times, so we have the total failure probability
$\Pr[f(\mathcal{A}(f(S,r,x_1,\dots,x_t))) \neq f(S,r,x_1,\dots,x_t)]
< \left(1-\frac{1}{p(n)}\right)^{\lceil\frac{\log 100}{\log(p(n)) - \log(p(n)-1)}\rceil}
\leq \frac{1}{100}$
[QED]

Using $\mathcal{A}$, construct the following probabilistic polynomial-time algorithm $\mathsf{Attack}$:

<blockquote style="background:gainsboro; border-radius:1em; padding:.25em .5em;">

**The Algorithm $\mathsf{Attack}$**

$\mathsf{Attack}$ is given oracle access to the query algorithm $\mathbf{B}_2(M,\cdot)$, and gets $1^\lambda$ as input.

1. For $i \in \{1,\dots,t\}$, sample $x_i \in U$ uniformly, and query $y_i = \mathbf{B}_2(M,x_i)$.
2. Run $\mathcal{A}$ (the inverter of $f$) and get $(S',r',x_1,\dots,x_t) \leftarrow \mathcal{A}(x_1,\dots,x_t,y_1,\dots,y_t)$.
3. Compute $M' \overset{r'}{\leftarrow} \mathbf{B}_1(1^\lambda,S')$, using $r'$ as the randomness bits in the initialization.
4. For $k=1,\dots,\frac{100}{\varepsilon_0}$, do:
    (a) Sample $x^* \in U$ uniformly.
    (b) If $\mathbf{B}_2(M',x^*)=1$ and $x^* \not\in \{x_1,\dots,x_t\}$, output $x^*$ and HALT.
5. Sample $x^* \in U$ uniformly, and output $x^*$.

</blockquote>

**Claim 7.**
*Assume that $\mathcal{A}$ inverts $f$ successfully. For any representation $M$, the probability such that there exists a representation $M'$ that for $i \in \{1,\dots,t\}$, $\mathbf{B}_2(M,x_i)=\mathbf{B}_2(M',x_i)$, and that the error rate $\Pr[\mathbf{B}_2(M,x) \neq \mathbf{B}_2(M',x)] > \frac{\varepsilon_0}{100}$ is at most $\frac{1}{100}$.*

**Proof.**
From the error rate of any $x$ and the independence of the choice of $x_i$, we get
$$\Pr[\forall i \in \{1,\dots,t\} : \mathbf{B}_2(M,x_i) = \mathbf{B}_2(M',x_i)] \leq \left(1 - \frac{\varepsilon_0}{100}\right)^t$$

Since the Bloom filter uses $m$ bits of memory, there are $2^m$ possible representations as candidates for $M'$. Thus, by union bound,
$$\Pr[\exists M' \ \forall i \in \{1,\dots,t\} : \mathbf{B}_2(M,x_i) = \mathbf{B}_2(M',x_i)] \leq 2^m \left(1 - \frac{\varepsilon_0}{100}\right)^t \leq \frac{1}{100}$$

Since $\mathcal{A}$ is assumed to invert $f$ successfully, it must output a representation $M'$ such that for $i \in \{1,\dots,t\}$, $\mathbf{B}_2(M,x_i)=\mathbf{B}_2(M',x_i)$. Therefore, the above bound holds.
[QED]

Define $\mu(M)=\Pr_{x \in U}[\mathbf{B}_2(M,x)=1]$ as the positive rate over $U$, we now show that for almost all possible representations $M$ generated from set $S$ and randomness $r$, it holds true that $\mu(M) > \frac{\varepsilon_0}{8}$, with only a negligible probability of error:

**Claim 8.**
$\Pr_S[\exists r : \mu(M_r^S) \leq \frac{\varepsilon}{8}] \leq 2^{-n}$.

**Proof.**
Let $\mathsf{BAD}$ be the set of all sets $S$ such that there exists an $r$ such that $\mu(M_r^S) \leq \frac{\varepsilon_0}{8}$. Given $S \in \mathsf{BAD}$, let $\hat{S}$ be the set of all elements $x$ such that $\mathbf{B}_2(M_r^S,x)=1$, then $|\hat{S}| \leq \frac{\varepsilon_0}{8} \cdot u$. Notice that we can encode the set $S$ using the representation $M_r^S$ while specifying $S$ from all subsets of $\hat{S}$ of size $n$, and the encoding bits must be no less than $\log|\mathsf{BAD}|$ (which is the number of bits required to encode $|\mathsf{BAD}|$):
$$\log|\mathsf{BAD}| \leq m + \log\binom{\frac{\varepsilon_0 u}{8}}{n}
\leq m + n \log\left(\frac{\varepsilon_0 u}{8}\right) - n \log n + 2n
\leq -n + \log\binom{u}{n}
$$
thus $|\mathsf{BAD}| \leq 2^{-n}\binom{u}{n}$. Since the number of sets $S$ is $\binom{u}{n}$, $\Pr_S[\exists r : \mu(M_r^S) \leq \frac{\varepsilon}{8}] \leq 2^{-n}$.
[QED]

**Claim 9.**
*Assume that $\Pr[\mathbf{B}_2(M,x) \neq \mathbf{B}_2(M',x)] \leq \frac{\varepsilon_0}{100}$ and that $\mu(M) > \frac{\varepsilon_0}{8}$. The probability that $\mathsf{Attack}$ does not halt on Step 4 is at most $\frac{1}{100}$.*

**Proof.**
It follows directly from the assumptions that $\mu(M') > \frac{\varepsilon_0}{8} - \frac{\varepsilon_0}{100} > \frac{\varepsilon_0}{10}$. For convenience, let $\mathcal{X} = \{x_1,\dots,x_t\}$ and $\hat{S'} = \{x : \mathbf{B}_2(M',x)=1\}$. We have that

$$E[|\hat{S'} \cap \mathcal{X}|] = t \cdot \mu(M') > \frac{200m}{\varepsilon_0} \cdot \frac{\varepsilon_0}{10} = 20m$$

By Chernoff bound with a probability of at least $(1-e^{-\Omega(m)})$ we have that $|\hat{S'} \cap \mathcal{X}| < 40m$,
$$|\hat{S'} \backslash \mathcal{X}|=|\hat{S'}|-|\hat{S'} \cap \mathcal{X}| > |\hat{S'}| - 40m \geq \frac{\varepsilon_0 u}{10} - 40m$$

*Case 1.*
$u=n^d$ ($d$ is a constant). We show that $|\hat{S'} \backslash \mathcal{X}| \geq 1$, so that an exhaustive search over the universal set $U$ is efficient and guaranteed to find an element $x^*$ in $\hat{S'} \backslash \mathcal{X}$. Let $c$ be a constant such that $\varepsilon_0 > \frac{1}{n^c}$, $\varepsilon_0 < \frac{1}{n^{c-1}}$. We have $\frac{u}{n} = n^{d-1} \geq \frac{1}{\varepsilon_0} > n^{c-1}$, then $d-c>1$. Moreover, $m \leq n \log\frac{u}{n} \leq nd \log n$, thus,
$$|\hat{S'} \backslash \mathcal{X}| \geq \frac{\varepsilon_0 u}{10} - 40m
\geq \frac{n^{d-c}}{10} - 40nd \log n > 1$$

*Case 2.*
$u$ is super-polynomial in $n$. We show that the fraction of $|\hat{S'} \backslash \mathcal{X}|$ is large enough so that sampling can find an $x^*$, with only a small failure probability. Since $\frac{\varepsilon_0}{20}$ is polynomial in $\frac{1}{n}$ but $\frac{40m}{u} \leq \frac{40n \log u}{u}$ is negligible, we get that $\frac{\varepsilon_0}{20} > \frac{40m}{u}$. It follow from $\frac{|\hat{S'} \backslash \mathcal{X}|}{u} > \frac{\varepsilon_0}{10} - \frac{40m}{u}$ that $\frac{|\hat{S'} \backslash \mathcal{X}|}{u} > \frac{\varepsilon_0}{20}$. Thus, the probability of sampling $x \not\in \hat{S'} \backslash \mathcal{X}$ in all $k$ attempts is bounded by
$$\left(1-\frac{\varepsilon_0}{20}\right)^k
= \left(1-\frac{\varepsilon_0}{20}\right)^\frac{100}{\varepsilon_0}
< \frac{1}{100}
$$

In both cases, the probability that $\mathsf{Attack}$ fails to find $x^*$ and halt on Step 4 is less than $\frac{1}{100}$.
[QED]

**Claim 10.**
$\Pr[\mathbf{B}(M',x^*)=1; \mathbf{B}_2(M,x^*)=0] \leq \frac{1}{100}$

**Proof.**
This follows from the assumption that $\Pr[\mathbf{B}_2(M,x) \neq \mathbf{B}_2(M',x)] \leq \frac{\varepsilon}{100}$.
[QED]

Consider **Claim 6, 7, 8 & 10** which cover all cases that $\mathsf{Attack}$ fails, each happens only if the respective assumptions hold, so they provide an upper bound of failure probability. Taking a union bound, we have the total failure probability is at most $\frac{4}{100}$. Thus, we have constructed a polynomial-time adversary $\mathsf{Attack}$ such that
$$\Pr[\mathsf{Challenge}_{\mathsf{Attack},\mathbf{B},t}(\lambda) = 1] > \varepsilon \geq 1-\frac{4}{100}$$
therefore $\mathbf{B}$ cannot be $(n,t,\varepsilon)$-adversarial resilient, which is a contradiction implying that such adversarial resilient Bloom filters do not exist, under the assumption that one-way functions do not exist. By modus tollens, we have that if non-trivial $(n,t,\varepsilon)$-adversarial resilient Bloom filters exist, then one-way functions exist.
[QED]



# 4. Further Reading

In **Theorem 5** we showed that the existence of adversarial resilient Bloom filters implies that one-way functions exist. Furthermore, assume that adversarial resilient Bloom filters exist (thus one-way functions exist), it can be shown that pseudorandom permutations may be used to construct non-trivial, strongly adversarial resilient Bloom filters. We have

**Proposition 11. (Construction using pseudorandom permutations)**^[A proof of this can be found in [@naor2015bloom].]
*Let $\mathbf{B}$ be an $(n,\varepsilon)$-Bloom filter using $m$ bits of memory. If pseudorandom permutations exist, then for any security parameter $\lambda$, there exists an $(n,\varepsilon+\mathsf{negl}(\lambda))$-strongly resilient Bloom filter that uses $m'=m+\lambda$ bits of memory.*

**Unsteady representation and computationally unbounded adversary.**
The above discussion about Bloom filters assumes that steady representation is used, that is, the query algorithm $\mathbf{B}_2$ is deterministic. Some implementations allow $\mathbf{B}_2$ to change the internal representation thus querying can also be probabilistic. Further results regarding *unsteady representations* may be found in [@naor2015bloom], with the ACD^[Learning model of adaptively changing distributions (ACD).] framework proposed in [@naor2006learning]. Moreover, some results are shown to hold even for *computationally unbounded adversaries*.

**Bloom filters and secrecy.**
Bloom filters, like hash functions, are not designed as encryption schemes. Thus, even adversarial resilient Bloom filters may leak considerable information in an unintended way. As a concrete example, in Bitcoin lightweight SPV clients which rely on Bloom filters to store users' Bitcoin addresses, an adversary can efficiently distinguish information about these addresses. See [@gervais2014privacy] for a discussion on this interesting scenario.



# References
