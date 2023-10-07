---
cateogries: algorithm
tags: 
 - 背包
 - 数学
mathjax: true
---

[前去做题](https://codeforces.com/contest/1637/problem/D){:.button.button--outline-success.button--pill}

## 题意

给定连个长为 $n$ 的数组`a[n]` ,`b[n]`。我们可以任意次交换 `a[i]` 与 `b[i]`。

最后求取最小的 $\sum_{i = 1} ^ n \sum_{j = i + 1} ^ n (a_i + a_j) ^ 2 + \sum_{i = 1} ^ n \sum_{j = i + 1} ^ n (b_i + b_j) ^ 2$

## 思路

首先我们尝试化简其中一个式子。

首先我们有 $(x + y) ^ 2 = x^2 + y^2 + 2xy$

那么带入原来的式子就有 $\sum_{i = 1} ^ n \sum_{j = i + 1} ^ n (a_i + a_j) ^ 2 = (n - 1) \sum_{i = 1}^n a_i^2 + 2\times \sum_{i = 1} ^ n \sum_{j = i + 1} ^ n a_i\times a_j$

我们假定 $sum = \sum_{i = 1} ^ n a_i$

那么我们将后一项化简我们就可以得到 $\sum_{i = 1} ^ n \sum_{j = i + 1} ^ n (a_i + a_j) ^ 2 =  (n - 1) \sum_{i = 1}^n a_i^2 + \sum_{i = 1} ^ n a_i(sum - a_i)$

也就是说我们最终的式子为 $(n - 2)\sum_{i = 1} ^ n a_i^2 + sum^2 = (n - 2)\sum_{i = 1} ^ n a_i^2 + (\sum_{i=1}^n a_i)^2$

最终我们的答案就是 $(n - 2)\sum_{i = 1} ^ n (a_i^2 + b_i^2) + (\sum_{i=1}^n a_i)^2 + (\sum_{i=1}^n b_i)^2$

那么最后我们尝试将后两项变小即可。假定 $a = \sum_{i = 1} ^ n a_i , b = \sum_{i = 1} ^ n b_i$

我们发现 $a + b = sum_a + sum_b = s$

我们设 $d = \frac{ a + b }{ 2 } , a = d + k , b = d - k$

那么最终我们的答案就变为 $d ^ 2 + k ^ 2$ 我只需要最小的 $\lvert k\rvert $ 即可。

那么因为 $a - b = 2k$ 我们只需要最小化 $a - b$ 的值。

因为差值越接近 $0$ 越好，因此我们尝试 `0/1` 背包即可。

{% highlight cpp linoes %}
dp[0][0] = 1;
for (int i = 1 ; i <= n ; i ++ ) {
   int d = a[i] - b[i];
   for (int j = -limit ; i <= limit ;  i ++ ) {
      if(dp[i - 1][j]) dp[i][j + k] = dp[i][j - k] = 1;
   }
}
{% endhighlight %}

最后找到最接近答案的 k 值即可。

## code

{% highlight cpp linoes %}
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

int a[110] = {0, 2, 6, 4, 6};
int b[110] = {0, 3, 7, 6, 1};

long long calc(int n) {
   long long res = 0;
   for (int i = 1; i <= n; i++) {
      for (int j = i + 1; j <= n; j++) {
         res += (a[i] + a[j]) * (a[i] + a[j]) + (b[i] + b[j]) * (b[i] + b[j]);
      }
   }
   return res;
}

void solve() {
   int n;
   cin >> n;
   vector<int> a(n), b(n);
   long long ans = 0;
   long long sum = 0;
   int mxx = -1;
   for (int i = 0; i < n; i++) cin >> a[i], ans += (n - 2) * a[i] * a[i], sum += a[i];
   for (int i = 0; i < n; i++) cin >> b[i], ans += (n - 2) * b[i] * b[i], sum += b[i];
   for (int i = 0; i < n; i++) mxx = max(mxx, abs(a[i] - b[i]));
   int rg = mxx * n * 2 + 1;
   vector<int> now(rg, 0);
   vector<int> pre(rg, 0);
   now[mxx * n] = 1;
   for (int i = 0; i < n; i++) {
      int k = a[i] - b[i];
      pre.assign(rg, 0);
      for (int j = 0; j < rg; j++) {
         if (now[j]) {
            pre[j + k] = pre[j - k] = 1;
         }
      }
      now = pre;
   }
   int mnn = 1e9;
   for (int i = 0; i < rg; i++) {
      if (now[i]) mnn = min(mnn, abs(i - mxx * n));
   }
   long long na = (sum + mnn) / 2;
   long long nb = (sum - mnn) / 2;
   ans += na * na + nb * nb;
   cout << ans << '\n';
}

int main() {
   ios::sync_with_stdio(false);
   cin.tie(0);
   int t = 1;
   cin >> t;
   while (t--) solve();
   return 0;
}
{% endhighlight %}




