```
title: 随机过程笔记
```

# 符号表

$$
\newcommand{\F}{\mathscr{F}}
\newcommand{\B}{\mathbb{B}}
\newcommand{\limt}[1]{\lim\limits_{#1}}
\newcommand{\liminf}[1]{\lim\limits_{#1\to\infty}}
$$

| 符号 | 含义 |

# 测度空间和概率空间 

## 测度空间 $(\Omega, \F, \mu)$

[:$\sigma$-代数] 假设 $\F$ 是 $\Omega$ 中点集的集合，它满足下列性质：

1. $\Omega \in \F$
2. 如果 $A \in \F$，则 $\overline{A} \in F$
3. 如果 $A_i \in \F$，则 $$\bigcup_{i=1} A_i \in \F$$

## 概率空间 $(\Omega, \F, P)$

[:概率测度（概率）] 设 $\F$ 是定义在样本空间 $\Omega$ 上的事件[$\sigma$-代数]，$P(A) A \in \F$ 是定义在 $\F$ 上的非负集函数，且满足

1. 对任意 $A \in \F$，有 $0 \le P(A) \le 1$
2. $P(\Omega) = 1$
3. 对 $A_i \in \F$，且 $A_i \neq A_j (i \neq j)$，则有 
$$
P(\bigcup_{i=1}^{\infty} A_i = \sum_{i=1}^{\infty} P(A_i))
$$


概率函数 $P$ 是一个特殊的测度函数 $\mu$。


[:概率的性质]

1. $P(\varnothing) = 0$
2. **有限可加性**
3. **连续性定理**：假设 $\{A_i\} \in \F$ 是任意单调事件序列，$\liminf{i} = A$，那么 $$\liminf{i} P(A_i) = P(\liminf{i} A_i) = P(A)$$


## 随机变量及分布

 记 $G = \{(\infty,x] | -\infty < x < +\infty\}$，称 $\B = \sigma(G)$ 为[:Borel $\sigma$-代数]。若 $B \in \B$，称 $B$ 为 [:Borel 集]或 [:Borel 可测集]。

