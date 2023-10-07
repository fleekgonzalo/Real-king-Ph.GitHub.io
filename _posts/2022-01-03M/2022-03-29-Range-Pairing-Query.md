---
categories: algorithm
tags:
 - 莫队
 - 前缀和
 - 分类讨论
title: G - Range Pairing Query
mathjax: true
---

## 题意

有 n 个人站成一排，每个人的身上都有一个数字 c。求问区间 `[l,r]` 范围内共有多少个颜色一样的对。



## 思路

这题大概是一个裸的[莫队](https://blog.nowcoder.net/n/21b17c202732493085a003c7eb9ba005)

采取另外一种方法。

首先，我们采取离线的方式进行写题。

我们通过前缀和的方式进行更新我们的答案，并且我们的前缀和 `pre` 表示 `pre[l]` 表示区间 `[l ,i]` 上的答案位多少。

假如我们更新到了 `i = 10` 。并且 `pos[] = [1 ,3 ,4 ,7 ,9]` 。

假如我们将 `i = 10` 添加进去的话，那么如下几个区间的答案被更新了。

`[8,9] | [4,4] | [2,3]`。

因此我们可以得到如下的代码

{% highlight cpp linenos %}
int sz = pos[a[i]].size() - 1;
pos[a[i]].push_back(i);
while(sz >= 0) {
    for (int j = pos[a[i]][sz] ; j > 0 ; j -- ) {
        if(sz > 0 && pos[a[i]][sz - 1] == j) break;
        pre[j] ++ ;
    }
    sz -= 2;
}
{% endhighlight %}

 但是，由于我们的更新时间复杂度是 $O(n)$ 的，假若一个数出现的次数较多，那么毫无疑问这个算***挂掉。

如果数字多，但出现的次数不多呢？

假如我们有以下的条件。


$$
\sqrt n \ge \max (x_1 , x_2 ... ,x_k) \wedge \sum x_i \le n
$$
那么我们不难算得 $\sum x_i^2 \le n \sqrt n$ 。也就是说，如果，我们每个数出现的次数小于等于 $\sqrt n$ 的话，那么我们采取上面的做法是完全行的通的。



那么下面我们来到有数字出现次数大于等于 $\sqrt n$ 。

对于这种情况，由于这样的数字不会超过$\sqrt n$ 次，所以说，我们只需要采取求个数的形式进行前缀和即可。

每次的时间复杂度 $O(n)$ 也就是说，一共的复杂度 $O(n \sqrt n)$ 

那么我们这么分割后，时间复杂度总共为 $O(N\sqrt N)$

## ans

[code](https://atcoder.jp/contests/abc242/submissions/30536740)  **这是一份错误代码，你能找出错在哪吗？**

给一组 hack 数据


```plaintext
input :
10
1 2 3 2 3 1 3 1 3 3
6
6 10
5 8
3 6
4 4
1 6
1 10

output :
2
2
1
0
3
4
```



正解。

{% highlight cpp linenos %}
#include <algorithm>
#include <array>
#include <cmath>
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
   const int limit = sqrt(n);
   vector<int> a(n + 1);
   vector<int> cnt(n + 1, 0);
   vector pos(n + 1, vector<int>());
   for (int i = 1; i <= n; i++) cin >> a[i], cnt[a[i]]++, pos[i].push_back(0);
   int q;
   cin >> q;
   vector<tuple<int, int, int>> v(q);
   for (int i = 0; i < q; i++) {
      auto &[r, l, id] = v[i];
      cin >> l >> r;
      id = i;
   }

   sort(v.begin(), v.end());

   int su = 0;

   vector<int> pre(n + 1, 0);
   vector<int> ans(q, 0);

   for (int i = 1; i <= n; i++) {
      int tot = pos[a[i]].size();
      tot--;
      pos[a[i]].push_back(i);
      if (cnt[a[i]] <= limit) {
         while (tot > 0) {
            for (int j = pos[a[i]][tot - 1] + 1; j <= pos[a[i]][tot]; j++) {
               pre[j]++;
            }
            tot -= 2;
         }
      }

#ifndef ONLINE_JUDGE
      cout << "I = " << i << ' ';
      for (int j = 1; j <= n; j++) {
         cout << pre[j] << ' ';
      }
      cout << '\n';
#endif

      while (su < v.size() && get<0>(v[su]) <= i) {
         auto [r, l, id] = v[su];
         ans[id] += pre[l];
         su++;
      }
   }

   for (int i = 1; i <= n; i++) {
      if (cnt[i] > limit) {
         pre.assign(n + 1, 0);
         int j = 1;
         for (int kki = 1; kki <= n; kki++) {
            pre[kki] = pre[kki - 1];
            if (j < pos[i].size() && pos[i][j] == kki) {
               pre[kki]++;
               j++;
            }
         }

         for (int i = 0; i < q; i++) {
            auto [r, l, id] = v[i];
            ans[id] += (pre[r] - pre[l - 1]) / 2;
         }
      }
   }
   for (auto x : ans) cout << x << '\n';
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

[莫队代码](https://atcoder.jp/contests/abc242/submissions/30555153)