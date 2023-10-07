---
categories: algorithm
tags:
 - 数学
 - 二分
mathjax: true
---

<https://codeforces.com/contest/1657/problem/D>

> 记录一下今晚状态极差的比赛。

## 思路

我们首先以 t 为时间线划分。士兵如果要打败怪物，$kd\times t \ge H$ 。同理，怪物要打败士兵则需要$D\times t\ge h$。

我们发现都有共同的 t。不妨以 t 作为划分依据得到，$\frac h D \le t \le \frac H {kd}$。

然后我们省去 t 发现。 $khd\le HD$，而我们的目标是 $\min kc$。

由于刚好消灭掉的时候不算。因此，等号不能算。

我们不妨用桶记录答案。记 `f[c]` 为 hd 乘积的最大值。

我们就容易发现。如果我们 `f[c * 2]` 显然是可以用 `f[c] * 2` 来更新的。那么对于剩下来的同理。

因此我们走一遍更新。

{% highlight cpp linenos %}
for (int i = 1 ; i <= n ; i ++ ) 
  for (int j = 1 ; j * i <= n ; j ++ )
    f[i * j] = max(f[i * j] , f[i] * j);
{% endhighlight %}

然后我们还发现，这些值可能并不会发生一定的顺序关系。我们发现如果 `f[c - 1] > f[c]` 那么我们很难说，`f[c]` 的乘积更优。因此，我们从前往后数一遍最大值。

最终，我们对怪物的 `HD` 乘积做一次二分即可。

[code](https://codeforces.com/contest/1657/submission/150531215)
