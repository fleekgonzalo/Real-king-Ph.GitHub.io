---
categories: algorithm
tags:
 - 前缀和
title: C. Klee in Solitary Confinement
---

<https://codeforces.com/gym/103470/problem/C>

## 题意

给出一个数组，我们可以选择一段区间加上 k (或者不加)。求出现次数最多的数出现了几次。

## 思路

对于一段区间加上 `k` 的话。

我们不妨考虑最多的数为 `a[i] + k` 的情形。

我们敲定区间 `[L , R]` 我们最优的方案一定是刚好 `a[L] = a[R] = k`。这很容易想出，因为只有这种情况下，我们才可以保证 `L` 左边的和 `R` 右边的  `a[i] + k` 没被改掉。

我们不妨用 `cnt[i]` 表示区间 `[1 , i]` 内 `a[i]` 出现的次数，`ckt[i]` 表示区间 `[1 , i]` 内， `a[i] + k` 出现的次数。

由于 `k == 0` 时我们直接统计即可，因此我们不再考虑这种情况。

那么计算对于区间 `[L , R]` 中 `a[i] --> a[i] + k` 对答案的贡献。

按照前缀和的写法我们得到 `(cnt[R] - cnt[L - 1]) - (ckt[R] - ckt[L - 1])` 。由于我们这样记录 `L - 1` 实际上并不存在。不过，由于我们只进行了统计答案的操作。我们将上述的 `cnt[L - 1] --> cnt[L] - 1` , `ckt[L - 1] --> ckt[L]`。

然后再将其变形，我们便得到。

`(cnt[R] - ckt[R]) - (cnt[L] - ckt[L]) + 1`。

那么因此我们就得到了一个简单的条件。

那么现在问题回到 `cnt` 和 `ckt` 的统计上。由于 `a[i]`  的范围并不是很大，我们于是可以开启一个数组`pos[a[i]]`用来记录上次 `a[i]` 出现的位置。

于是，我就有了一个基础代码。

{% highlight cpp linenos %}
for (int i = 1 ; i <= n ; i ++ ) {
    int now = a[i] ;
    int _uk = a[i] + k;
    
    cnt[now] = cnt[pos[now]] + 1;
    if(in_legal_range(uk)) {
        ckt[_uk] = cnt[pos[_uk]] + 1;
    }
    pos[a[i]] = i;
}
{% endhighlight %}



那么根据上面的代码，我们开启数组 `pot[a[i]]` 来记录 `a[i] --> a[i] + k` 时 `cnt[i] - ckt[i]`  的最小值。

我们还需要原本统计答案的数组，因此，我们在开始的时候就用`count[a[i]]`统计一下每个`a[i]` 出现的次数。

那么最后，我们的循环就变为如下所示的样子了。

{% highlight cpp linenos %}
for (int i = 1; i <= n; i++) {
    int now = a[i];
    int _uk = now + k;

    ans = max(ans , count[now]);
    cnt[i] = cnt[pos[now]] + 1;
    
    if (in_legal_range(_uk)) {
        ckt[i] = cnt[pos[_uk]];
          
        int _R = cnt[i] - ckt[i];
        pot[now] = min(pot[now], _R);
        ans = max(ans, count[now + k] + _R - pot[now] + 1);
    }
    pos[a[i]] = i;
}
{% endhighlight %}

在我的写法下，我们发现余留的 1 可以用 `bool(k)` 代替。

那么最终的代码如下

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
   int n, k;
   cin >> n >> k;

   vector<int> a(n + 1);
   int maxx = -1e9, minn = 1e9;
   for (int i = 1; i <= n; i++) cin >> a[i], minn = min(minn, a[i]);

   for (int i = 1; i <= n; i++) {
      a[i] -= minn;
      maxx = max(a[i], maxx);
   }

   vector<int> count(maxx + 1, 0);
   for (int i = 1; i <= n; i++) {
      count[a[i]]++;
   }

   vector<int> cnt(n + 1, 0), ckt(n + 1, 0), pos(maxx + 1, 0), pot(maxx + 1, 1e9);
   auto in_legal_range = [&](int x) -> bool { return x >= 0 && x <= maxx; };
   int ans = 0;
   for (int i = 1; i <= n; i++) {
      int now = a[i];
      int _uk = now + k;

      ans = max(ans, count[now]);

      cnt[i] = cnt[pos[now]] + 1;
      if (in_legal_range(_uk)) {
         ckt[i] = cnt[pos[_uk]];
         int _R = cnt[i] - ckt[i];
         pot[now] = min(pot[now], _R);
         ans = max(ans, count[now + k] + _R - pot[now] + bool(k));
      }
      pos[a[i]] = i;
   }
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

 

当然，代码还可以更短。

{% highlight cpp linenos %}
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 2000000;
vector<int> pot[4000006];
int a[4000006];
int cnt[4000006];
int main() {
   int n, k;

   cin >> n >> k;
   for (int i = 1; i <= n; i++) {
      scanf("%d", &a[i]);
      cnt[a[i] + N]++;
      pot[a[i] + N].push_back(cnt[a[i] + N] - cnt[a[i] + k + N]);
   }
   int ans = 0;
   for (int i = 1000000; i <= 3000000; i++) {
      int tmp = 0;
      int mn = 8000006;
      for (int j = 0; j < pot[i].size(); j++) {
         mn = min(mn, pot[i][j]);
         tmp = max(tmp, pot[i][j] - mn + ((k == 0) ? 0 : 1));
      }
      ans = max((int)(tmp + pot[i + k].size()), ans);
   }
   cout << ans;
}
{% endhighlight %}

