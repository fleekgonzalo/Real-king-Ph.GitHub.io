---
category: algorithm
tags:
  - 线性DP
  - 贪心
mathjax: true
---

[前去做题](https://codeforces.com/problemset/problem/1647/F){:.button.button--outline-success.button--pill}

## 题意

我们有一个序列 `a[n]` 求问如果将这个序列分裂为两个山峰序列会有几个最大值对的。

其中山峰序列表示对于一组数列满足 $a_1<a_2< \dots < a_r > a_{r + 1} >\dots > a_n$

## 思路

首先，由于这个序列中的所有的数字都是唯一出现的，那么我们最大值的位置一定时唯一的。

我们不妨定我们的另外一个山顶出现在我们最大值的右端。

假定最大值的端点在 `p` 另一个山顶在 `q` 那么其中数字的大小变化如下。

![array](https://s2.loli.net/2022/04/07/n3iBqyaGeVQJ2fW.png)



- `[1,p]` 两个数组都单调递增
- `(p,q]` 第一个数组单调递减，第二个数组单调递增
- `(q,n]` 两个数组都单调递减

由于该题目的单调性是确定的。

如果我们在 `q` 点，对于从 `p` 点衍生出的点。如果我们在左边拿到的单调递减序列末尾比右边的开头大，那么我们这个 `q` 点就是成立的。

那么基于这个思路我们需要考虑两个方面的问题。

1. 右边如何拿到最低
2. 左边如何拿到最低

----


首先是右边，较好处理

我们采用 `dp`  的方式去解决。

`dp[i]` 存储序列，如果**从右到左**的顺序下，`a[i]` 在当前单增序列中，另一个单增序列的最小值是多少，第一步我们需要把这个数组初始化为 $+\infty$。

由于该题目允许除山峰外的空序列的存在，因此 `dp[n]` 需要初始化为 $-\infty$ 然后我们再去选择如何处理我们的答案。

那么状态转移可以变为一下两种形式了。

- `a[i] > a[i + 1]` 此时 `a[i]` 可以有上一个序列增加而来，因此继承上一个最小值 `dp[i] = min(dp[i] , dp[i + 1])`。
- `a[i] > dp[i + 1]` 此时 `a[i]` 可以由上一个 `a[i + 1]` 不在的序列继承而来，因此，`dp[i] = min(dp[i] , a[i + 1])` 。

也就是下面的的代码就可以完成这样的状态转移了。

```cpp
dp[n] = -INF;
for (int i = n - 1 ; i >= 1 ; i -- ) {
    if(a[i] > a[i + 1]) dp[i] = min(dp[i] , dp[i + 1]);
    if(a[i] > dp[i + 1]) dp[i] = min(dp[i] , a[i + 1]);
}
```

----

那么下面我们来考虑拿最低的情况。

首先我们不妨使用数组 `IncMax[i]` 来表示 `a[i]` 在上升序列中，下降的序列最大值是多少。

那么首先我们有 `a[i] > a[i - 1]` ，那么很显然，我们可以通过上次的状态将其继承过来 `IncMax[i] = max(IncMax[i] , IncMax[i - 1])` .

那么显然，我们的 `IncMax[i]` 不仅仅有这一种途径进行状态转移。如果 `a[i - 1]` 在下降序列中，我们该如何更正我们的答案呢？

我们需要尽可能的更正答案，因此我们希望`a[i - 1]` 在下降序列时，上升序列的最小值越小越好。

因此我们引入另一个数组 `DecMin[i]` 来表示 `a[i]` 在下降序列中，上升序列的最小值是多少。

那么上面的 `a[i] > DecMin[i - 1]` 时，我们此时 `IncMax[i] = max(IncMax[i] , a[i - 1])`

既然来到了这个地方，我们的 `DecMin[i]` 的数组也需要更新。

和上面的情况差不多。`a[i] < a[i - 1]` 可以继承 `DecMin[i] = min(DecMin[i] , DecMin[i + 1])`。

如果 `a[i] < IncMax[i - 1]` 可以推导出来 `DecMin[i] = min(DecMin[i] , a[i - 1])`

那么我们把上面的东西整理一下我们就可以得到。

```cpp
for (int i = p + 1 ; i <= n ; i ++ ) {
    if(a[i] > a[i - 1]) IncMax[i] = max(IncMax[i] , IncMax[i - 1]);
    if(a[i] > DecMin[i - 1]) IncMax[i] = max(IncMax[i] , a[i - 1]);
    
    if(a[i] < a[i - 1]) DecMin[i] = min(DecMin[i] , DecMin[i - 1]);
    if(a[i] < IncMax[i - 1]) DecMin[i] = min(DecMin[i] , a[i - 1]);
}
```

---



这个时候，我们再来考虑一下初值的问题。

显然，我们的 `Max` 中都要初始化为 `-INF` ，`Min` 都初始化为 `+INF` 以表示不存在。

那么 `IncMax[p]` 和 `DecMin[p]` 该怎么办呢？

首先我们来考虑 `IncMax[p]` 该值表示 `p` 在上升序列中下降序列的最大值。我们此时并没有任何下降序列产生，因此我们可以考虑将这个之赋值为 `+INF` 以表示下降序列的开头足够大。

然后我们考虑 `DecMin[p]` 该值表示 `p` 在下降序列中上升序列的最小值。这个值显然不是空穴来风的。我们发现它可以通过我们第一个计算的 `dp` 那么更新。因此我**从左到右**去更新一遍`dp` 即可。

我们不妨把左边的答案作为 `dp1` 右边的作为 `dp2`。由最开始认证答案的推导。

> 如果我们在 `q` 点，对于从 `p` 点衍生出的点。如果我们在左边拿到的单调递减序列末尾比右边的开头大，那么我们这个 `q` 点就是成立的。

我们只需要 `IncMax[q] > dp2[q]` 就可以保证答案是成立的了。

## code

{% highlight cpp liones %}
#include <algorithm>
#include <array>
#include <cassert>
#include <cmath>
#include <cstring>
#include <iomanip>
#include <iostream>
#include <map>
#include <numeric>
#include <queue>
#include <set>
#include <stack>
#include <tuple>
#include <vector>

using namespace std;

void solve() {
   int n;
   cin >> n;
   vector<int> a(n + 1);
   for (int i = 1; i <= n; i++) cin >> a[i];

   const int INF = 1e9 + 10;

   auto get_ans = [&]() -> int {
      int mx = -1, mxpos;
      for (int i = 1; i <= n; i++) {
         if (a[i] > mx) {
            mx = a[i];
            mxpos = i;
         }
      }
      vector<int> dp1(n + 1, INF), dp2(n + 1, INF);
      dp2[n] = dp1[1] = -INF;

      for (int i = 2; i <= n; i++) {
         if (a[i] > a[i - 1]) dp1[i] = min(dp1[i], dp1[i - 1]);
         if (a[i] > dp1[i - 1]) dp1[i] = min(dp1[i], a[i - 1]);
      }
      for (int i = n - 1; i >= 1; i--) {
         if (a[i] > a[i + 1]) dp2[i] = min(dp2[i], dp2[i + 1]);
         if (a[i] > dp2[i + 1]) dp2[i] = min(dp2[i], a[i + 1]);
      }
      vector<int> DecMin(n + 1, INF), IncMax(n + 1, -INF);
      DecMin[mxpos] = dp1[mxpos];
      IncMax[mxpos] = INF;
    
      for (int i = mxpos + 1; i <= n; i++) {
         if (a[i] > a[i - 1]) IncMax[i] = max(IncMax[i], IncMax[i - 1]);
         if (a[i] > DecMin[i - 1]) IncMax[i] = max(IncMax[i], a[i - 1]);
    
         if (a[i] < a[i - 1]) DecMin[i] = min(DecMin[i], DecMin[i - 1]);
         if (a[i] < IncMax[i - 1]) DecMin[i] = min(DecMin[i], a[i - 1]);
      }
      int res = 0;
      for (int i = mxpos + 1; i <= n; i++) {
         res += IncMax[i] > dp2[i];
      }
      return res;
   };

   int ans = 0;
   ans += get_ans();
   reverse(a.begin() + 1, a.end());
   ans += get_ans();
   cout << ans << '\n';
}

int main() {
   ios::sync_with_stdio(false);
   cin.tie(0);
   int t = 1;
   // cin >> t;
   while (t--) solve();
   return 0;
}
{% endhighlight %}