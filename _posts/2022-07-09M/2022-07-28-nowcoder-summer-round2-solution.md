---
title: "2022 牛客多校第二场题解(D)"
date: "2022-07-26 08:15:44 +0800"
last_modified_at: "2022-07-29 18:21:26 +0800"
categories: [algorithm]
tags: [algorithm, nowcoder]
mathjax: true  
---

## D - Link with Game Glitch

题目简单的翻译过来就可以是，给定一个有向图，每条边都有边权，每次走过这条边就需要将手里的值乘上一个数。给定一个数字 $w$ ，并将每条边的权乘上 $w$ ，求问最大的 $w$ 使得这个图不存在可以走到 $+\infty $ 。

首先，我们很容易想到二分的思路。

具体过程详见下面代码。

```cpp
#include <iostream>
#include <vector>
using namespace std;

const int N = 1010;

vector<pair<int, double>> E[N];

long double value[N];
bool vis[N];
int cnt[N];

int start;

bool dfs(int u, double m) {
   vis[u] = true;
   for (auto [v, w] : E[u]) {
      if (value[v] < w * m * value[u]) {
         if (vis[v]) {
            return false;
         }
         value[v] = w * m * value[u];
         if (dfs(v, m) == false) return false;
      }
   }
   vis[u] = false;
   return true;
}

bool check(int n, double m) {
   for (int i = 1; i <= n; i++) value[i] = 1, vis[i] = false;
   for (int i = 1; i <= n; i++) {
      if (value[i] == 1) {
         cnt[i] = 0;
         start = i;
         if (dfs(i, m) == false) return false;
      }
   }
   return true;
}

int main() {
   int n, m;
   cin >> n >> m;

   for (int i = 0; i < m; i++) {
      int a, b, c, d;
      cin >> a >> b >> c >> d;
      E[b].push_back({d, c * 1.0 / a});
   }

   double l = 0, r = 1e9;

   while (r - l > 1e-15) {
      auto m = (l + r) / 2;
      if (check(n, m)) {
         l = m;
      } else {
         r = m;
      }
   }
   printf("%.15lf\n", r);
}
```

## G - Link with Monotonic Subsequence

要求构造一个长为 $n$ 的序列，使得其最长上升子序列的的长度，和最大下降子序列长度的最大值的最小值。

该题，并没有通过什么好办法做出来，通过打表发现规律。

最终我们可以发现序列可以构造成如下的形式，假若一共有9个元素，那么序列如下。

`[7, 8, 9, 4, 5, 6, 1, 2, 3]`

也就是说，我们需要的长度最长为 $\lceil \sqrt{N}\rceil$

```cpp
#include <iostream>
#include <vector>

using namespace std;

int get_num(int n) {
   int res = 0;
   int l = 1, r = n + 3;
   while (l <= r) {
      long long m = (l + r) / 2;
      long long v = m * m;
      if (v < n) {
         l = m + 1;
      } else {
         res = m;
         r = m - 1;
      }
   }

   return res;
}

int main() {
   ios::sync_with_stdio(false);
   cin.tie(0);
   int t;
   cin >> t;

   while (t--) {
      int n;
      cin >> n;
      int qrt = get_num(n);

      vector<int> ans(n);

      for (int i = 0; i < qrt; i++) {
         for (int j = 0; j < qrt; j++) {
            auto v = i * qrt + j + 1;
            auto pos = n - qrt * (i + 1) + j;
            if (pos >= 0 && pos < n) ans[pos] = v;
         }
      }

      int div = 0;
      for (int i = n - 1; i >= 0; i--) {
         if (!div) {
            if (ans[i] > n) {
               div = ans[i] - n;
            }
         }
         if (div) ans[i] -= div;
      }

      for (auto v : ans) {
         cout << v << ' ';
      }
      cout << '\n';
   }

   return 0;
}
```

## H - Take the Elevator

这个题目的意思是，一个电梯可以随时往下走，但不可以随时往上走，只有在第一层才可以向上走。

因此，电梯的运行过程可以简化为一上一下的形式进行走。

那么，我们只需要保证在上和下的过程中，重叠部分的区间大$\le m$ 即可。注意，电梯需要先出在进入，因此，每个人的区间都是开区间。我们每次处理两个区间的大小。

在处理每个区间的时候，我们尽可能的让大的先走，这样的话，就可以保证在单次运行过程中得到的是最优解。

由于电梯的容纳量为 $m$ ，因此，我们不妨直接让最大的 $m$ 个人先走，我们再处理后续的情况。

我们很容易发现，我们只要新的区间的右区间小于等于以上 $m$ 个区间最大的左区间即可保证不重复。这种情况非常容易证明，就不在详细说明了。

```cpp
#include <iostream>
#include <queue>
#include <set>

using namespace std;

int main() {
   ios::sync_with_stdio(false);
   cin.tie(0);

   int n, m, k;
   cin >> n >> m >> k;

   multiset<pair<int, int>> up, dw;

   for (int i = 1; i <= n; i++) {
      int l, r;
      cin >> l >> r;

      if (l < r) {
         up.insert({r, l});
      } else if (l > r) {
         dw.insert({l, r});
      }
   }

   long long ans = 0;

   auto on_up = [](multiset<pair<int, int>>& muts, int m) -> void {
      priority_queue<int> mx_floor;
      for (int i = 0; i < m && muts.size(); i++) {
         mx_floor.push(muts.rbegin()->second);
         muts.erase(muts.lower_bound(*muts.rbegin()));
      }

      while (muts.size()) {
         auto it = muts.lower_bound({mx_floor.top() + 1, 0});
         if (it == muts.begin()) {
            break;
         }
         it --;

         mx_floor.push(it->second);
         muts.erase(it);
         mx_floor.pop();
      } 
   };

   while (up.size() || dw.size()) {
      int upmx = 0, dwmx = 0;
      if (up.size()) {
         upmx = (*up.rbegin()).first;
         on_up(up, m);
      }
      if (dw.size()) {
         dwmx = (*dw.rbegin()).first;
         on_up(dw, m);
      }
      ans += (max(upmx, dwmx) - 1) * 2ll;
   }

   cout << ans << '\n';

   return 0;
}
```



## J - Link with Arithmetic Progression

最小二乘法，大家在高等数学中应该已经接触过，不在详细阐述。



## K - Link with Bracket Sequence I

DP

我们不妨将题目的意思转换为在$B$ 的 $m$ 个括号中，有 $n$ 个括号是 $A$ 串。

然后如果遇到 $m \land 1 = true$ 的话，我们直接输出 0 即可。

接下来就是 DP 的地方。

我们定义 $f(l,r,i)$ 表示有 $l$ 个左括号 $r$ 个右括号 ，匹配到$A_{i}$ 。

假如在一组形如 `((((` 的括号中，其中有一位是 $A$ 中的括号。那么我们就可以发现，不管 $A$ 中的括号存在在什么地方都不会影响我们最终的答案。

所以，我们在需要填入 $A$ 串中的字符时，我们应当尽快将其填入，以免进行重复计算的问题。

最终我们便可以得到如下的一系列的情况。

$$
f(l,r,i) = \begin{cases}
& f(l - 1 , r , i - 1) & i < n \land A_i = '(' \\
& f(l - 1 , r , i) & i = n \lor A_i = ')'\\
& f(l , r - 1 , i - 1) & i < n \land A_i = ')'\\
& f(l , r - 1 , i)  & i = n \lor A_i = '('
\end{cases}
$$

值得注意的时，在全程的计算过程中，一定要保证 $l\le r$ ，在遇到所有 $l > r$ 的情况我们都需要舍弃掉。

```cpp
#include <iostream>

using namespace std;

long long dp[210][210][210];

const int MOD = 1e9 + 7;

void add(long long &a, long long b) {
   a += b;
   if (a >= MOD) a -= MOD;
}

void solve() {
   int n, m;
   cin >> n >> m;

   string s;
   cin >> s;
   if (m & 1) {
      cout << 0 << '\n';
      return;
   }
   for (int i = 0; i <= m / 2; i++) {
      for (int j = 0; j <= m / 2; j++) {
         for (int k = 0; k <= n; k++) {
            dp[i][j][k] = 0;
         }
      }
   }

   dp[0][0][0] = 1;

   for (int i = 0; i <= n; i++) {
      for (int r = 0; r <= m / 2; r++) {
         for (int l = 0; l <= m / 2; l++) {
            if (l < r) continue;

            if (i < n && s[i] == '(')
               add(dp[l + 1][r][i + 1], dp[l][r][i]);
            else
               add(dp[l + 1][r][i], dp[l][r][i]);

            if (l > r) {
               if (i < n && s[i] == ')')
                  add(dp[l][r + 1][i + 1], dp[l][r][i]);
               else
                  add(dp[l][r + 1][i], dp[l][r][i]);
            }
         }
      }
   }

   // for (int l = 0; l <= m / 2; l++) {
   //    for (int r = 0; r <= m / 2; r++) {
   //       for (int i = 0; i <= n; i++) {
   //          if (dp[l][r][i]) {
   //             cout << "[" << l << ", " << r << ", " << i << "] "
   //                  << ", V = " << dp[l][r][i] << endl;
   //          }
   //       }
   //    }
   // }

   cout << dp[m / 2][m / 2][n] << '\n';
}

int main() {
   int t;
   cin >> t;
   while (t--) solve();
}
```







