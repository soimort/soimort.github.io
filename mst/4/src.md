---
title: The Measurable Entropy
subtitle: Maximum entropy, uniformity and normality.
author: Mort Yao
date: 2017-01-11
---

A brief introduction to basic information theory (entropy/information as a measure for theoretical unpredictability of data) and descriptive statistics (quantitative properties about real-world data including central tendency, dispersion and shape). The maximization of entropy under different constraints yields some common probability distributions: uniform distribution (given no prior knowledge); normal distribution (given that mean and variance are known).

* What is the measure for **information**?
    * Intuitively, if a sample appears to be more naturally "random", then it may contain more "information" of interest since it takes a greater size of data (more bits) to describe. But how to measure this quantitatively?
    * Probability-theoretic view: *Shannon entropy*.
    * Algorithmic view: *Kolmogorov complexity*. (TBD in February or March 2017)
* [Basic information theory](https://wiki.soimort.org/info/)
    * **Shannon entropy**
        * For discrete random variable $X$ with pmf $p(x)$: $$\operatorname{H}(X) = -\sum_{x\in\mathcal{X}} p(x) \log p(x).$$
        * For continuous random variable $X$ with pdf $f(x)$: $$\operatorname{H}(X) = -\int_\mathcal{X} f(x) \log f(x) dx.$$ (also referred to as *differential entropy*)
        * The notion of entropy is an extension of the one in statistical thermodynamics (Gibbs entropy) and the [measure-theoretic entropy of dynamical systems](https://wiki.soimort.org/math/dynamical-systems/ergodic/).
        * Obviously, the entropy is determined by the pmf/pdf, which depends on the parameters of the specific probability distribution.
        * In the context of Computer Science, the logarithm in the formula is often taken to the base $2$. Assume that we take a uniform binary string of length $\ell$, then
        $$p(x) = 2^{-\ell}$$
        Thus, the entropy of the distribution is
        $$\operatorname{H}(X) = -\sum_{x\in\mathcal{X}} p(x) \log p(x) = - (2^\ell \cdot 2^{-\ell} \log_2 2^{-\ell}) = \ell$$
        which is just the length of this ($\ell$-bit) binary string. Therefore, the unit of information (when applying binary logarithm) is often called a *bit* (also *shannon*).
        * For the **joint entropy** $\operatorname{H}(X,Y)$ and the **conditional entropy** $\operatorname{H}(X\,|\,Y)$, the following equation holds:
        $$\operatorname{H}(X,Y) = \operatorname{H}(X\,|\,Y) + \operatorname{H}(Y) = \operatorname{H}(Y\,|\,X) + \operatorname{H}(X)$$
        Notice that if $\operatorname{H}(X\,|\,Y) = \operatorname{H}(X)$, then $\operatorname{H}(X,Y) = \operatorname{H}(X) + \operatorname{H}(Y)$ and $\operatorname{H}(Y\,|\,X) = \operatorname{H}(Y)$. $X$ and $Y$ are said to be independent of each other in this case.
        * **Mutual information** $\operatorname{I}(X;Y) = \operatorname{H}(X) + \operatorname{H}(Y) - \operatorname{H}(X,Y) \geq 0$ (equality holds iff $X$ and $Y$ are independent). Unlike the joint entropy or the conditional entropy, this notion does not reflect an actual probabilistic event thus it is referred to as *information* (sometimes *correlation*) rather than entropy.
    * **Kullback-Leibler divergence (relative entropy)**
    $$\operatorname{D}_\mathrm{KL}(p\|q) = \sum_{x\in\mathcal{X}} p(x) \log \frac{p(x)}{q(x)}$$
    KL divergence is a measurement of the distance of two probability distributions $p(x)$ and $q(x)$.
        * If $p = q$, $\operatorname{D}_\mathrm{KL}(p\|q) = 0$. (Any distribution has a KL divergence of 0 with itself.)
        * $\operatorname{I}(X;Y) = \operatorname{D}_\mathrm{KL}(p(x,y)\|p(x)p(y))$.
        * **Cross entropy**
        $$\operatorname{H}(p,q) = \operatorname{H}(p) + \operatorname{D}_\mathrm{KL}(p\|q)$$
        Notice that cross entropy is defined on two distributions $p$ and $q$ rather than two random variables taking one distribution $p$ (given by joint entropy $\operatorname{H}(X,Y)$).

* Basic probability theory
    * [Normal (Gaussian) distribution](https://wiki.soimort.org/math/probability/distributions/normal/).
        * (Univariate) $X \sim \mathcal{N}(\mu,\sigma^2)$
        $$f_X(x) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$$
        where $\mu$ is the mean, $\sigma^2$ is the variance of the distribution. \
        (Multivariate) $\boldsymbol x \sim \mathcal{N}_k(\boldsymbol\mu,\mathbf\Sigma)$
        $$f(\boldsymbol x) = (2\pi)^{-k/2} |\mathbf\Sigma|^{-1/2} e^{-\frac{1}{2} (\boldsymbol x - \boldsymbol\mu)^\mathrm{T} \Sigma^{-1}(\boldsymbol x - \boldsymbol\mu)}$$
        where $\boldsymbol\mu$ is the mean vector, $\mathbf\Sigma$ is the covariance matrix of the distribution.
        * *Maximum entropy*: normal distribution is the probability distribution that maximizes the entropy when the mean $\mu$ and the variance $\sigma^2$ are fixed.
        * The normal distribution does not have any shape parameter. Moreover, its skewness and excess kurtosis are always 0.

* [Basic descriptive statistics](https://wiki.soimort.org/math/statistics/)
    * *Descriptive statistics* describe the properties of data sets quantitatively, without making any further inference.
    * *Population* vs. *sample*.
    * Three major descriptive statistics:
        1. *Central tendency*: sample means (**arithmetic mean** $\mu$, geometric, harmonic), **median**, **mode**, mid-range.
            * Arithmetic mean is an unbiased estimator of the population mean (expectation).
            * Median and mode are most robust in the presence of outliers.
        2. *Dispersion (or variability)*: minimum, maximum, range, IQR (interquartile range), maximum absolute deviation, MAD (mean absolute deviation), **sample variance** $s^2$ with Bessel's correction, **CV (coefficient of variance)**, **VMR (index of dispersion)**.
            * IQR and MAD are robust in the presence of outliers.
            * Sample variance (with Bessel's correction) is an unbiased estimator of the population variance.
            * CV and VMR are sample standard deviation and sample variance normalized by the mean respectively, thus they are sometimes called *relative standard deviation* and *relative variance*; they are *not* unbiased though.
        3. *Shape*: sample skewness, sample excess kurtosis.
            * These statistics show how a sample deviates from normality, since the skewness and the excess kurtosis of a normal distribution are 0. The estimators could vary under different circumstances.



## Entropy as a measure ^[<https://en.wikipedia.org/wiki/Information_theory_and_measure_theory>]

For random variables $X$ and $Y$, we define sets $\tilde X$ and $\tilde Y$. Then the information entropy $\operatorname{H}$ may be viewed as a signed measure $\mu$ over [sets](https://wiki.soimort.org/math/set/):
\begin{align*}
\operatorname{H}(X) &= \mu(\tilde X) \\
\operatorname{H}(Y) &= \mu(\tilde Y) \\
\operatorname{H}(X,Y) &= \mu(\tilde X \cup \tilde Y) \qquad \text{(Joint entropy is the measure of a set union)} \\
\operatorname{H}(X\,|\,Y) &= \mu(\tilde X \setminus \tilde Y) \qquad \text{(Conditional entropy is the measure of a set difference)} \\
\operatorname{I}(X;Y) &= \mu(\tilde X \cap \tilde Y) \qquad \text{(Mutual information is the measure of a set intersection)}
\end{align*}
The inclusion–exclusion principle:
\begin{align*}
\operatorname{H}(X,Y) &= \operatorname{H}(X) + \operatorname{H}(Y) - \operatorname{I}(X;Y) \\
\mu(\tilde X \cup \tilde Y) &= \mu(\tilde X) + \mu(\tilde Y) - \mu(\tilde X \cap \tilde Y)
\end{align*}
Bayes' theorem:
\begin{align*}
\operatorname{H}(X\,|\,Y) &= \operatorname{H}(Y\,|\,X) + \operatorname{H}(X) - \operatorname{H}(Y) \\
\mu(\tilde X \setminus \tilde Y) &= \mu(\tilde Y \setminus \tilde X) + \mu(\tilde X) - \mu(\tilde Y)
\end{align*}



## Entropy and data coding

*Absolute entropy (Shannon entropy)* quantifies how much information is contained in some data. For data compression, the entropy gives the minimum size that is needed to reconstruct original data (losslessly). Assume that we want to store a random binary string of length $\ell$ (by "random", we do not have yet any prior knowledge on what data to be stored). Under the *principle of maximum entropy*, the entropy of its distribution $p(x)$ should be maximized:
$$\max \operatorname{H}(X) = \max \left\{ -\sum_{x\in\mathcal{X}} p(x) \log p(x) \right\}$$
given the only constraint
$$\sum_{x\in\mathcal{X}} p(x) = 1$$
Let $\lambda$ be the Lagrange multiplier, set
$$\mathcal{L} = - \sum_{x\in\mathcal{X}} p(x) \log p(x) - \lambda\left( \sum_{x\in\mathcal{X}} p(x) - 1 \right)$$
We get
\begin{align*}
\frac{\partial\mathcal{L}}{\partial x} = -p(x)(\log p(x) + 1 + \lambda) &= 0 \\
\log p(x) &= - \lambda - 1 \\
p(x) &= c \qquad \text{(constant)}
\end{align*}
That is, the [discrete uniform distribution](https://wiki.soimort.org/math/probability/#discrete-uniform-distribution) maximizes the entropy for a random string. Since $|\mathcal{X}| = 2^\ell$, we have $p(x) = 2^{-\ell}$ and $\operatorname{H}(X) = -\sum_{x\in\mathcal{X}} 2^{-\ell} \log_2 2^{-\ell} = \ell$ (bits). We conclude that the information that can be represented in a $\ell$-bit string is at most $\ell$ bits. Some practical results include

* In general, pseudorandom data (assume no prior knowledge) cannot be losslessly compressed, e.g., the uniform key used in one-time pad must have $\log_2 |\mathcal{M}|$ bits (lower bound) so as not to compromise the perfect secrecy.
* Fully correct encoding/decoding of data, e.g., $\mathsf{Enc}(m)$ and $\mathsf{Dec}(c)$ algorithms in a private-key encryption scheme, must ensure that the probability distributions of $m \in \mathcal{M}$ and $c \in \mathcal{C}$ have the same entropy.
* An algorithm with finite input cannot generate randomness infinitely. Consider a circuit that takes the encoded algorithm with some input ($\ell$ bits in total) and outputs some randomness, the entropy of the output data is at most $\ell$ bits. (Further topic: Kolmogorov complexity)

*Relative entropy (KL divergence)* quantifies how much information diverges between two sets of data. For data differencing, the KL divergence gives the minimum patch size that is needed to reconstruct target data (with distribution $p(x)$) given source data (with distribution $q(x)$).

In particular, if $p(x) = q(x)$, which means that the two distributions are identical, we have $\operatorname{D}_\mathrm{KL}(p\|q) = 0$. This follows our intuition that no information is gained or lost during data encoding/decoding. If $p(x_0) = 0$ at $x=x_0$, we take $p(x) \log \frac{p(x)}{q(x)} = 0$, to justify the fact that the target data is trivial to reconstruct at this point, no matter how much information $q(x)$ contains. However, if $q(x_0) = 0$ at $x=x_0$, we should take $p(x) \log \frac{p(x)}{q(x)} = \infty$, so that the target data is impossible to reconstruct if we have only trivial $q(x)$ at some point (unless $p(x_0) = 0$).

**Lemma 4.1. (Gibbs' inequality)** ^[<https://en.wikipedia.org/wiki/Gibbs'_inequality>] *The KL divergence is always non-negative: $\operatorname{D}_\mathrm{KL}(p\|q) \geq 0$.*

Informally, Lemma 4.1 simply states that in order to reconstruct target data from source data, either more information ($\operatorname{D}_\mathrm{KL}(p\|q) > 0$) or no further information ($\operatorname{D}_\mathrm{KL}(p\|q) = 0$) is needed.



## Maximum entropy and normality

**Theorem 4.2.** *Normal distribution $\mathcal{N}(\mu,\sigma^2)$ maximizes the differential entropy for given mean $\mu$ and variance $\sigma^2$.*

**Proof.** ^[<https://en.wikipedia.org/wiki/Differential_entropy#Maximization_in_the_normal_distribution>]
Let $g(x)$ be a pdf of the normal distribution with mean $\mu$ and variance $\sigma^2$. Let $f(x)$ be an arbitrary pdf with the same mean and variance.

Consider the KL divergence between $f(x)$ and $g(x)$. By Lemma 4.1 (Gibbs' inequality):
$$\operatorname{D}_\mathrm{KL}(f\|g) = \int_{-\infty}^\infty f(x) \log \frac{f(x)}{g(x)} dx = \operatorname{H}(f,g) - \operatorname{H}(f) \geq 0$$

Notice that
\begin{align*}
\operatorname{H}(f,g) &= - \int_{-\infty}^\infty f(x) \log g(x) dx \\
&= - \int_{-\infty}^\infty f(x) \log \left( \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}} \right) dx \\
&= \frac{1}{2} \left( \log(2\pi\sigma^2) + 1 \right) \\
&= \operatorname{H}(g)
\end{align*}
Therefore,
$$\operatorname{H}(g) \geq \operatorname{H}(f)$$
That is, the distribution of $g(x)$ (Gaussian) always has the maximum entropy.
[QED]

It is also possible to derive the normal distribution directly from the principle of maximum entropy, under the constraint such that $\int_{-\infty}^\infty (x-\mu)^2f(x)dx = \sigma^2$.

The well-known central limit theorem (CLT) which states that the sum of independent random variables $\{X_1,\dots,X_n\}$ tends toward a normal distribution may be alternatively expressed as the monotonicity of the entropy of the normalized sum:
$$\operatorname{H}\left( \frac{\sum_{i=1}^n X_i}{\sqrt{n}} \right)$$
which is an increasing function of $n$.
[@artstein2004solution]



## References and further reading

**Books:**

T. M. Cover and J. A. Thomas. *Elements of Information Theory*, 2nd ed.

**Papers:**
