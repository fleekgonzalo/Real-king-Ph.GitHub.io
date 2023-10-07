---
categories: algorithm
layout: article
tags:
 - 二分
 - 交互
 - 贪心
mathjax: true
---

<https://codeforces.com/contest/1624/problem/F>

## 题意简述

这是一道交互式题目。

有一个数 $x$ 和一个数 $n$ 其中 $1\le x < n$

你可以进行如下的询问:

- `+ c` 将 $x$ 的值变为 $x + c$  其中 $1\le c < n$ 然后返回一个值  $\lfloor\frac{x}{n}\rfloor$

如果你在十次之内猜到的话则输出 $x$ 即可。

## 思路

由于我们只能得到 $\lfloor\frac{x}{n}\rfloor$ 那么我们不妨用二分的想法来考虑这个题目

对于我们上一个得到的 $k = \lfloor\frac{x}{n}\rfloor$ 我们可以分析出我们需要的数值一定出现在`[k * n,(k + 1) * n - 1]`。

假若范围已经被我们更加的精确到了 `[l,r]` 这个区间上。

![alt](https://uploadfiles.nowcoder.com/images/20220113/738444583_1642063367209/D2B5CA33BD970F64A6301FA75AE2EB22)

那么如上如图所示，我们可以通过增加 `(k+n) * n - (l + r) / 2` 的方式将我们的区间`[l,r]` 移动到 `[l',r']` 上去。

此时我们得到一个 $\lfloor\frac{x}{n}\rfloor$ 通过这个值再选择是省去左边界还是右边界。

一步步划分最后就出来答案了。

[code](https://codeforces.com/contest/1624/submission/142579464)

