---
title: The Fundamental Justification
subtitle: On epistemology and logic.
author: Mort Yao
date: 2017-02-06
---

I don't have much to write about this week. My plan was to finish the sections on statistics and machine learning in [my wiki](https://wiki.soimort.org/) before I can move on to more rigorous mathematics and logic, but that turned out to be an impossible task (shortly after the exam week a new, incredibly tenser semester is right under the nose). I wanted to write more about cryptography and information theory as a brush-up account of previous courses I've taken, and that's infeasible too (although the very introductory parts are done in [#3](/mst/3/) and [#4](/mst/4/)).

Still, I have thought of many fun things I could do with statistical learning: image classification and face recognition (I always want a photo management application to be like that! I take and collect so many photos each day), a CBIR tool (like "Search by Image" in Google Images, but works locally on my computer), a GIMP Script-Fu that does tricks like image synthesis via ConvNets, etc. The good part about applying learning methods in image processing is that, once you can extract feature descriptors, everything becomes statistically learnable (and you as a programmer don't really need to have prior knowledge about what an object visually is: an apple, or a pen?).

Cryptography, from what I learned, is a differently fun story. For a perfectly secure encryption scheme:
$$\Pr[M=m\,|\,C=c] = \Pr[M=m]$$
that is, knowing the ciphertext $c$ will not update any attacker's belief about whatever the underlying message $m$ is. Even if you have a statistical training model, it cannot learn anything from purely observations of ciphertexts. But this unbreakable level of security comes with a price: The key space must expose substantial entropy that is as high as the message space, thus the key length can be no shorter than the message length (given by Shannon's theorem). In practice, the messages we sent do not usually have the highest entropy possible, and we can safely assume that the attackers' computation ability is bounded by polynomial-time algorithms, thus, we as the cryptosystem designers need only to make up schemes that are assumed to be unbreakable (i.e., breakable with only a negligible probability) for any polynomial-time attackers. As we don't know yet if there actually are any polynomial unsolvable cases (e.g., is P ≠ NP?), the proof of security would eventually rely on some unproven computational hardness assumptions: one-way functions exist, integer factorization is hard, discrete logarithm is hard, etc. If one can construct a provably secure scheme, it is guaranteed that statistical cryptanalysis would be theoretically impossible within polynomial time (except for side-channel attacks); of course, if the hardness assumption we made is proved invalid, then nothing but the one-time pad can be secure.

I might be writing one or two blog posts about cryptographic security from an information-theoretic perspective and some basic cryptanalysis on insecure schemes, but now is the time to move on with my unfinished courses about logic and programming. Before that, I feel that I should add a little bit [philosophy](https://wiki.soimort.org/philosophy/) to my wiki so as to refresh my viewpoint and methodology. And here it is.

(Philosophy is a sophisticated, highly arguable subject, so pardon me if there's any inconsistency with your textbook.)

* **Metaphysics** is about the fundamental nature of being and the world. **Ontology**, as a branch of metaphysics, studies about the basic categories of being of entities and their relations.
* [Epistemology](https://wiki.soimort.org/philosophy/epistemology/) is the study of knowledge.
    * Where does knowledge come form?
        * **Empiricism** claims that knowledge comes from empirical evidence.
        * **Rationalism** claims that knowledge requires justification by reasoning.
        * **Skepticism** rejects the certainty in knowledge and claims that it is impossible to have an adequate justification of knowledge.
    * How to resolve the *regress problem* that the justification of knowledge is questioned ad infinitum?
        * In **foundationalism**, a statement is inferred from a basis of unprovably sound premises.
            * This approach leads to the (axiomatic) foundations of mathematics and the constructivism.
            * The fundamentals of modern *mathematics* are the *axiomatic set theory* (which has several variations with different sets of axioms).
            * The fundamentals of modern *probability theory* are the *Kolmogorov axioms*.
            * The computational hardness assumptions in cryptography may also be seen as a practice of foundationalism.
        * In **coherentism**, a statement holds true as long as it coheres with all other justified beliefs, including itself.
        * In **infinitism**, a justification chain is allowed to be infinite, thus there could never be adequate justification for any statement in the chain (which is the point that it is often criticized for).
    * So, what is knowledge, actually?
        * **Knowledge** is *justified true belief*. (though questioned by the *Gettier problem* [@gettier1963justified])
    * How do we categorize our knowledge?
        * **A priori** knowledge is independent of empirical evidence. Examples: knowledge deduced by logical deductions or mathematical proofs.
        * **A posteriori** knowledge is dependent of empirical evidence. Examples: knowledge induced by statistical inference or learning (either human or machine learning).
    * **Science** is the approach to filter out unreliable knowledge and gather together reliable knowledge as a **theory**.
    * What qualifies as a science?
        * See the *demarcation problem*.
    * Scientific discovery is made of **hypotheses**. A hypothesis is a proposed explanation or prediction method for a phenomenon.
        * Only formally proved or statistically tested hypotheses qualify as reliable knowledge.
        * **Epicurus' principle of multiple explanations**: If multiple hypotheses are consistent with the observations, one should retain them all.
        * **Occam's razor**: Among all hypotheses consistent with the observations, choose the simplest.
        * Epicurus' principle of multiple explanations and Occam's razor find their uses in the learning theory, e.g., Occam's razor bound.
* [Logic](https://wiki.soimort.org/philosophy/logic/) is the study of reasoning and argument, which plays an essential part in gaining knowledge.
    * How to reason / argue by inference?
        * **Deduction** is to infer a conclusion by deriving a logical consequence ("a priori") from some premises using rules of inference in a formal system. Examples: proofs, a priori probabilities.
        * **Induction** is to infer a probable conclusion ("a posteriori") from the generalization of some observations. Examples: statistical inference and learning, inductive programming.
        * **Abduction** is to infer a probable explanation from some observations. Examples: deep learning.

We can talk about the philosophy of science (particularly, philosophy of mathematics and statistics) with the understanding of epistemology and logic: Are you a logician or a statistician? If a logician, does set theory or type theory suit you the best? If a statistician, are you a Bayesian or a frequentist?

(As a personally opinionated note, I often find myself subscribe to the skepticism the most. But that doesn't mean that logical reasoning and statistical inference aren't useful to me; they are. Extremely. So as not to go too far with this subjective topic, I'll be focusing more on classical / modal logic in the next few weeks.)

## References and further reading

**Papers:**
