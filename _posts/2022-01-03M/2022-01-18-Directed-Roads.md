---
categories: algorithm
tags:
 - 基环树
 - 数学
mathjax: true
---

## 题意

我们有 $n$ 个点和 $n$ 个边，其中第 $i$ 条边连接至 $a_i$ 点。每条边需要指定一个方向。求问，有多少种方案使图中不出现环。

## 思路

我们可以发现，每个点的度至少为一，那么我们便可以得出以下的结论。

假如我们一共 $k$ 个连通图，那么我们这 $k$ 个连通图中边的数量一定等于点的数量。

如果边的数量等于点的数量的话，我们的图便是一个基环树，假若我们的图如下所示有多个基环树。

![随意的图](https://uploadfiles.nowcoder.com/images/20220118/738444583_1642475973133/D2B5CA33BD970F64A6301FA75AE2EB22)

我们不难发现基环树可以拆分为两个部分
- 以紫色为边的环
- 以环的点为根的树

对于所有的树，无论我们怎么算都无法将其变为环图，因此我们只需要统计树中边的个数 $k$ 即可算出这部分的答案 $2^k$

对于所有的环，我们只有两种方案（都朝向一个地方）让他们成为环，因此我们需要统计环的长度 $s$ 就可以得到这个环所带来的影响 $2^s - 2$。

那么我们的答案最终就是 $2^k\prod 2^s - 2$

[code](https://codeforces.com/contest/711/submission/143059817)

