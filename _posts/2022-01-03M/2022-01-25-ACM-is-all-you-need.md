---
categories: algorithm
tags:
 - 数组
 - 贪心
mathjax: true
---

<https://ac.nowcoder.com/acm/contest/23106/G>

## 题意

我们得到一个数组 `f[n]` 。同时我们定义 local minimum 为 $f[i] < \min(f[i - 1] , f[i + 1])$ 。 我们可以选择一个整数 `b`并将这些 `f[n]` 变为 `|f[n] - b| + b`。求解，最终得到的数组中 local minimum 最少的个数。

## 思路


首先，对于一个这样的一个方程我们可以发先，$\lvert a-b \rvert +b=\max(a , 2 * b - a)$ 我们发现，对于 $b \le a $ 来说，原数组的大小时不会变化的，因此我们只有 `b` 的取值大于 a 的时候才会对数组产生影响。 


然后我们考虑这样的一个三元组 `(x , y , z)` 。我们要使的变化后的 $y\ge \min(x,z)$ 。如果`x == y || z == y` 无论我们选择什么样的 `b` 我们的最终情况都符合要求。


然后，我们每次只考虑一对数`(x,y)`。为了便于描述我们定义 $g(a , b) = \lvert a-b \rvert +b=\max(a , 2 * b - a)$ 。那么我们要使得 $g(x,b) \le g(y,b)$，接下来分为两类情况来讨论。

由于我们的目的是求出符合 `local minimum` 的最少个数，因此我们要求的是不可行的区间，即成立`local minimum`的区间。

1. $x < y$  
	我们的区间可以划分为三个部分 $(-\infty , x] ,(x ,y] , (y ,+\infty)$  
    
    我们可以发现，对于第一个而言，我们无论选择哪个数都不可能。对于第三个区间而言，无论选择哪个数都可能，因此我们的决策点在中间。我们化简的得到 $b\ge\frac{x+y}{2}$。  
    
    由于我们需要选择不可能的情况。  
    
    那么我们最终得到的区间是 $(-\infty,\frac{x+y}{2})$
    

2.  
	同上所述，我们的状况恰好相反我们算得的区间范围是 $(\frac{x+y}{2},+\infty)$。

当且仅当，我们求得的区间并，是合法区间，我们才加入统计答案中。
    
最终，我们取这些区间的并集中，重叠区间的次数最小的那个。

那么根据上面的计算所得暴力即可。

[code](https://ac.nowcoder.com/acm/contest/view-submission?submissionId=50605442)
   
   
