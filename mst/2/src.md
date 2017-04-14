---
title: The Probable Outcome
subtitle: He doesn't play for the money he wins.
author: Mort Yao
date: 2016-12-23
---

A refresher of basic probability theory, which is just common knowledge but plays a supporting role in information theory, statistical methods, and consequently, computer science.

* [Basic probability theory](https://wiki.soimort.org/math/probability/)
    * An **experiment** has various **outcomes**. The set of all probable outcomes constitute the **sample space** of that experiment.
    * Any *measurable* subset of the sample space $\Omega$ is known as an **event**.
    * A **probability measure** is a real-valued function defined on a set of events $\mathcal{F}$ in a probability space $(\Omega,\mathcal{F},\Pr)$ that satisfies measure properties such as countable additivity. (See **Kolmogorov's axioms**.)
    * The **union bound** (Boole's inequality) follows from the fact that a probability measure is σ-sub-additive.
    * *Events* can be *independent*. The following conditions hold equivalently for any independent events:
        * $\Pr[A_1 \cap A_2] = \Pr[A_1] \cdot \Pr[A_2]$
        * $\Pr[A_1|A_2] = \Pr[A_1]$
    * **Bayes' theorem** and the **law of total probability** describe the basic properties of conditional probability.
    * A **random variable** is a mapping that maps a *value* to an *event*. Hence, we have probability measure defined on random variables, such as $\Pr[X=x]$.
        * For *discrete* random variables, a **probability mass function (pmf)** determines a **discrete probability distribution**.
        * For *continuous* random variables, a **probability density function (pdf)** determines a **continuous probability distribution**.
    * *Random variables* can be *uncorrelated*. ($\operatorname{Cov}(X,Y)=0 \iff \operatorname{E}[XY] = \operatorname{E}[X] \cdot \operatorname{E}[Y]$.)
        * *Independent* random variables are uncorrelated.
        * However, uncorrelated random variables are not necessarily independent.
    * A *distribution* can be presented using **moments**:
        * **Expectation (mean)** $\operatorname{E}[X]$: first raw moment.
        * **Variance** $\operatorname{Var}(X)$: second central moment.
        * **Skewness** $\operatorname{Skew}(X)$: third standardized moment.
        * **Kurtosis** $\operatorname{Kurt}(X)$: fourth standardized moment.
        * For a bounded distribution of probability, the collection of all the moments (of all orders) uniquely determines the distribution.
        * Some distributions, notably Cauchy distributions, do not have their moments defined.
    * **Concentration inequalities** provide bounds on how a random variable deviates from some value (usually one of its *moments*).
        * **Markov's inequality** is the simplest and weakest probability bound.
        * **Chebyshev's inequality** provides an upper bound on the probability that a random variable deviates from its expectation.
        * **Chernoff bound** is stronger than Markov's inequality.
        * **Hoeffding's inequality** provides an upper bound on the probability that the sum of random variables deviates from its expectation. It's also useful for analyzing the number of required samples needed to obtain a confidence interval.
    * Some common *discrete probability distributions*:
        * **Bernoulli distribution**. Special case of Binomial distribution: $\text{B}(1,p)$.
        * **Binomial distribution** $\text{B}(n,p)$. Given number of draws $n$, the distribution of the number of successes.
        * **Geometric distribution** $\text{Geom}(p)$. Special case of negative binomial distribution: $\text{NB}(1,1-p)$.
        * **Negative binomial distribution** $\text{NB}(r,p)$. Given number of failures $r$, the distribution of the number of successes.



## Probability measure, distribution and generalized function

Intuitively, probability is a measure of uncertainty. Mathematically, probability is a real-valued function defined on a set of events in a probability space that satisfies measure properties such as countable additivity (or simply, *measure* on probability space).

Typically, a probability density function (pdf) or a probability mass function (pmf) determines a distribution in the probability space.

**Example 2.1.** Consider the wave function of a particle:
$$\Psi(x,t)$$
where $x$ is position and $t$ is time.

If the particle's position is measured, its location cannot be determined but is described by a probability distribution: The probability that the particle is found in $[x, x+\Delta x]$ is
$$\Delta\Pr = |\Psi(x,t)|^2 \Delta x$$

The square modulus of the wave function (which is real-valued, non-negative)
$$\left|\Psi(x, t)\right|^2 = {\Psi(x, t)}^{*}\Psi(x, t) = \rho(x, t)$$
is interpreted as the pdf.

Since the particle must be found somewhere, we have the normalization condition: (by the assumption of unit measure)
$$\int\limits_{-\infty}^\infty |\Psi(x,t)|^2 dx = 1$$

Distributions are also called generalized functions in analysis. It expands the notion of functions to functions whose derivatives may not exist in the classical sense. Thus, it is not uncommon that many probability distributions cannot be described using classical (differentiable) functions. The Dirac delta function $\delta$ (which is a generalized function) is often used to represent a discrete distribution, or a partially discrete, partially continuous distribution, using a pdf.



## Bayes' theorem and common fallacies

Bayes' theorem forms the basis for *Bayesian inference*, which is an important method of statistical inference that updates the probability for a *hypothesis* as more evidence or information becomes available.

Hypotheses can also be fallacies. In Bayesian inference, if one can make the assumption that every event occurs independently and the probability is identically distributed throughout lasting trials, it is clear to see that some common beliefs are mistaken.

**Gambler's fallacy (Monte Carlo fallacy).** If an outcome occurs more frequently than normal during some period, it will happen less frequently in the future; contrariwise, if an outcome happens less frequently than normal during some period, it will happen more frequently in the future. This is presumed to be a means of *balancing* nature.

Gambler's fallacy is considered a fallacy if the probability of outcomes is known to be independently, identically distributed. Assume that the future (the probability of event $A_2$) has no effect on the past (the probability of event $A_1$), we have $\Pr[A_1|A_2] = \Pr[A_1]$. From Bayes' theorem, it holds true that
$$\Pr[A_2|A_1] = \Pr[A_2]$$
That is, past events should not increase or decrease our confidence in a future event.

**Hot-hand fallacy.** A person who has experienced success with a seemingly random event has a greater chance of further success in additional attempts. That is, if an outcome occurs more frequently than normal during some period, it will also happen frequently in the future.

If psychological factors can be excluded, then hot-hand fallacy is a fallacy caused by people's confirmation bias. Like the gambler's fallacy, if we can't assume that the probability of outcomes is independently, identically distributed, we can't simply conclude that this belief is mistaken.

**Inverse gambler's fallacy.** If an unlikely outcome occurs, then the trials must have been repeated many times before.

Assume that the past (the probability of event $A_1$) has no effect on the future (the probability of event $A_2$), we have $\Pr[A_2|A_1] = \Pr[A_2]$. From Bayes' theorem, it holds true that
$$\Pr[A_1|A_2] = \Pr[A_1]$$
That is, our confidence in $A_1$ should remain unchanged after we observe $A_2$.



## LLN and Chebyshev's inequality

**Fallacies of hasty generalization and slothful induction (law of small numbers).** Informal fallacies reaching an inductive generalization based on insufficient evidence, or denying a reasonable conclusion of an inductive argument.

Statistically saying, sampling from a small group can lead to misbeliefs that fail to hold for the entire population, if hypothesis testing is not carefully conducted.

**Theorem 2.2. (Law of large numbers)** Let $X_1, \dots, X_n$ be an infinite sequence of i.i.d. Lebesgue integrable random variables with fixed expectation $\operatorname{E}[X_1] = \cdots = \operatorname{E}[X_n] = \mu$. Define the sample average
$$\overline{X}_n = \frac{1}{n}(X_1 + \dots + X_n)$$

1. **(Weak law of large numbers; Khintchine's law)** The sample average converges in probability towards the expectation:
$$\lim_{n\to\infty} \Pr[|\overline{X}_n - \mu| > \varepsilon] = 0$$
2. **(Strong law of large numbers)** The sample average converges *almost surely* to the expectation:
$$\Pr[\lim_{n\to\infty} \overline{X}_n = \mu] = 1$$

Chebyshev's inequality provides an upper bound on the probability that a random variable deviates from its expected value. Thus, it may be used as a proof for the weak law of large numbers.



## How is mathematical expectation only "mathematical"?

The expected value of a random variable $X$:
$$\operatorname{E}[X] = \sum_{x \in \mathcal{X}} x \Pr[X=x]$$
While it seemingly gives an estimate on how people would "expect" a random variable to take its value, it can sometimes lead to counterintuitive results, as shown by the following paradox.

**St. Petersburg Paradox.**^[<https://en.wikipedia.org/wiki/St._Petersburg_paradox>] A casino offers a game of chance for a gambler to flip a fair coin until it comes up tails. The initial stake starts at $2$ dollars and is doubled every time heads appears. The first time tails appears, the game ends and the gambler wins whatever is in the pot. Thus if the coin comes up tails the first time, the gambler wins $2^1=2$ dollars, and the game ends. If the coin comes up heads, the coin is flipped again. If the coin comes up tails the second time, the gambler wins $2^2=4$ dollars, and the game ends. If the coin comes up heads again, the coin is flipped again. If the coin comes up tails the third time, the gambler wins $2^3=8$ dollars, and the game ends. So on and so like. Eventually the gambler wins $2^k$ dollars, where $k$ is the number of coin flips until tails appears. (It is easy to see that $k$ satisfies the geometric distribution.) What would be a fair price to pay the casino for entering such a game? (Assume that there is no house edge)

| $k$th coin flip   | $\Pr[\text{Tails}]$ | Stake (`$`) | Expected payoff (`$`) |
| :---------------: | :-----------------: | :-------: | :-----------------: |
| 1   | $\frac{1}{2}$ | 2     | 1 |
| 2   | $\frac{1}{4}$ | 4     | 1 |
| 3   | $\frac{1}{8}$ | 8     | 1 |
| 4   | $\frac{1}{16}$ | 16   | 1 |
| 5   | $\frac{1}{32}$ | 32   | 1 |
| ... | ... | ... | ... |
| k   | $(1/2)^k$ | $2^k$ | 1 |

The price should be made equal to the expected value that a gambler wins the stake, which is
$$\operatorname{E}[\text{Payoff}]
= \sum_{k=1}^{+\infty} \left(\frac{1}{2}\right)^k \cdot 2^k
= \sum_{k=1}^{+\infty} 1
= +\infty$$

If a rational gambler pays for entering a game if and only if its average payoff is larger than its price, then he would pay any price to enter this game (since the expected payoff of this game is infinitely large). But in reality, few of us are willing to pay even tens of dollars to enter such a game. What went wrong? Furthermore, if *mathematical* expectation does not reflect correctly what people expect from a game, how to quantify the "*true*" expectation?

The St. Petersburg paradox was initially stated by Nicolas Bernoulli in 1713. There are several proposed approaches for solving the paradox, including the [expected utility](https://en.wikipedia.org/wiki/Expected_utility_hypothesis) theory with the hypothesis of diminishing marginal utility [[@sep-paradox-stpetersburg]](#ref-sep-paradox-stpetersburg), and the cumulative prospect theory. However, none of them is purely probability theoretical, as they require the use of hypothesized economic/behavioral models.



## Bias of sample variance and Bessel's correction

In probability theory, the variance of a random variable $X$ is defined as
$$\operatorname{Var}(X) = \operatorname{E}[(X-\mu)^2]
= \frac{1}{N} \sum_{i=1}^N (X_i-\bar{X})^2$$

In statistics, when calculating the sample variance in order to give an estimation of the population variance, and the population mean is unknown, Bessel's correction^[<https://en.wikipedia.org/wiki/Bessel's_correction>] (use of $N-1$ instead of $N$) is often preferred:
$$s^2 = \frac{1}{N-1} \sum_{i=1}^N (X_i-\bar{X})^2$$

A few remarks and caveats:

1. Bessel's correction is only necessary when the population mean is unknown and estimated as the sample mean.
2. Without Bessel's correction, the estimated variance would be *biased*; the biased sample variance $s_n^2$ tends to be much smaller than the population variance $\sigma^2$, whether the sample mean is smaller or larger than the population mean.
3. Bessel's correction does not yield an unbiased estimator of standard deviation, only variance and covariance.
4. The corrected estimator often has a larger mean squared error (MSE).



## References and further reading

**Books:**

M. Mitzenmacher and E. Upfal, *Probability and Computing: Randomized Algorithms and Probabilistic Analysis*.

M. Baron, *Probability and Statistics for Computer Scientists*, 2nd ed.

**Articles:**
