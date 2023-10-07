---
title: "2022 牛客多校第四场题解"
date: "2022-07-31 16:14:35 +0800"
last_modified_at: "2022-07-31 16:14:46 +0800"
categories: [algorithm]
tags: [algorithm, nowcoder]
mathjax: true  
---

## D - Jobs (Easy Version)

有 $n(n \le 10)$ 个公司，每个公司有 $k$ 个职位。每个职位都有三维`[a , b , c]`的要求，现在有 $q$ 名求职者，每个求职者的三维必须大于等于需要的职位的三维才可以被采纳。

求问，每个求职者最多可以收到几家公司的 offer。

由于本人的能力有限，只给出 Easy Version 的解。

在这个问题中，我们发现题目的突破口是在 `[a , b , c]` 的范围，他们最大的值仅有 400， 因此我们不妨通过设置 `need[i][a][b]` 来表示这样的值，在公司 $i$ ，能力值为 $a$ ， $b$ 且可以被公司接纳的情况下，的情况下，$c$ 的最小值。

然后对于一个公司而言，我们可以得到 `need[i][a][b] = min(need[i][a][b] , c)` 。除开这些外，我们发现对于能力值 $a$ $b$ 而言，能力值小于当前也是可以的。

因此我们还需要进行 `need[i][a][b] = min({need[i][a][b] , need[i][a - 1][b] , need[i][a][b - 1]})` 。

那么最后我们就通过这个得到最终的答案了。



```cpp
#include <bits/stdc++.h>

using namespace std;

unsigned seed;

const int M = 998244353;

long long qm(long long a, long long b = M - 2) {
   long long ans = 1;
   for (; b; b >>= 1) {
      if (b & 1) ans = a * ans % M;
      a = a * a % M;
   }
   return ans;
}

int need[10][401][401];

int main() {
   cin.tie(0)->sync_with_stdio(false);

   int n, q;
   cin >> n >> q;

   memset(need, 0x3f, sizeof(need));

   for (int i = 0; i < n; i++) {
      int k;
      cin >> k;
      while (k--) {
         int a, b, c;
         cin >> a >> b >> c;
         need[i][a][b] = min(need[i][a][b], c);
      }

      for (int a = 1; a <= 400; a++) {
         for (int b = 1; b <= 400; b++) {
            need[i][a][b] = min({need[i][a][b], need[i][a][b - 1], need[i][a - 1][b]});
         }
      }
   }

   cin >> seed;

   auto solve = [&](int IQ, int EQ, int AQ) -> int {
      int ans = 0;
      for (int i = 0; i < n; i++) {
         ans += need[i][IQ][EQ] <= AQ ? 1 : 0;
      }
      return ans;
   };

   std::mt19937 rng(seed);
   std::uniform_int_distribution<> u(1, 400);
   int lastans = 0;
   long long ans = 0;
   for (int i = 1; i <= q; i++) {
      int IQ = (u(rng) ^ lastans) % 400 + 1;  // The IQ of the i-th friend
      int EQ = (u(rng) ^ lastans) % 400 + 1;  // The EQ of the i-th friend
      int AQ = (u(rng) ^ lastans) % 400 + 1;  // The AQ of the i-th friend
      lastans = solve(IQ, EQ, AQ);  // The answer to the i-th friend
      ans += lastans * qm(seed, q - i);
      ans %= M;
   }

   cout << ans << '\n';
}
```



























## K - NIO's Sword

从 1 ~ n 每次前进一次，手里此时拥有 $A = i - 1$ 如果想要达到 $i + 1$ 可以经过数次 $A = 10 \times A + x(x\in[0 , 9]) \mod n$ 的变化。求取最小的变化次数。

假设我们在手里拥有数字 $i - 1$。此时我们的目标是 $i$，假设其一共变化了 $q$ 次。那么我们可以得到 $k\times n + i = 10^q \times (i - 1)+ b$

我们的 $q$ 就是此时的变换次数。

我们可以得到如下的式子 

$0 \le b < 10^q$ 和 $b = k\times n + i - 10^q\times(i - 1)$

那么我们最终只需要验证 b 的范围即可验证是否成立。

由于 $n\le 10^6$，所以我们通过枚举 $q$ 的形式来得到答案。

对于确定的 $q$ 我们的 $k\times n + i \ge 10^q \times (i - 1)$

即 $k\ge \lceil \frac{10^q\times(i - 1) - i}{n} \rceil$

此时我们再将求出来的 $k$ 带回到原来的方程中求出 $b$ 即可得到我们的结果。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll M = 998244353;
const ll inf = 0x3f3f3f3f3f3f3f3f;
ll ten[20];

int main() {
   ll n;
   cin >> n;
    
   if(n == 1) {
       cout << 0 << '\n';  // 1 % 1 == 0 切记！
       return 0;
   }

   ten[0] = 1;
   for (int i = 1; i < 20; i++) {
      ten[i] = ten[i - 1] * 10;
   }

   int ans = 1;
   for (int i = 2; i <= n; i++) {
      for (int q = 1; q < 20; q++) {
         if((i - 1) * ten[q] - i < 0) continue; 
         long long k = (1ll * (i - 1) * ten[q] - i) / n;
         while (k * n + i < ten[q] * (i - 1)) {
            k++;
         }
         long long b = 1ll * k * n + i - ten[q] * (i - 1);
         if (b < ten[q] && b >= 0) {
            ans += q;
            // cout << i << ' ' << q << '\n';
            break;
         }
      }
   }
   cout << ans << '\n';
   return 0;
}
```





























## N - Particle Arts

有 N 个数字，每次一对数字，我们将这对数字进行一次变换，对于原先的数字 $a$ $b$ 我们，将这对数字变换为 $a \mid b$ 和 $a \& b$。

假如对于特定的某一位而言，我们可以发现，对于一对 0 ，不会改变，对于一对 1 ，也是不会改变，对于一对 01 依然不会改变，因此，我们可以发现，我们在进行这个变换的时候我们每一位的结果中，其 1 的个数不会改变。


不过衍生到具体的两个数字中，我们可以发现，对于一个 01 而言，其 1 一定会在 $a \mid b$ 中，其 0 一定会在 $a\& b$ 中，因此我们可以发现，在不断的进行变换的过程中，我们的 1 不断的在往某几个数字进行聚集，0 也同样如此。

最后我们不妨将这些 1 的数量记录下来，我们最后就可以得到答案了。

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

void print(__int128_t x) {
   vector<char> buff;

   while (x) {
      buff.push_back(x % 10 + '0');
      x /= 10;
   }

   for (int i = buff.size() - 1; i >= 0; i--) {
      cout << buff[i];
   }
}

int main() {
   int n;
   cin >> n;
   vector<int> u(n);
   vector final(15, 0);

   for (auto &x : u) cin >> x;
   for (auto &x : u) {
      for (int i = 0; i < 15; i++) {
         if ((x >> i) & 1) {
            final[i]++;
         }
      }
   }

   for (int i = 0; i < n; i++) {
      u[i] = 0;
      for (int j = 0; j < 15; j++) {
         if (i < final[j]) u[i] |= 1 << j;
      }
   }

   __int128_t sum = 0;

   __int128_t a = 0;

   for (auto x : u) sum += x;
   for (auto x : u) a += (1ll * n * x - sum) * (1ll * n * x - sum);
   __int128_t b = 1ll * n * n * n;

   auto x = __gcd(a, b);

   a /= x, b /= x;
   if (a == 0 || b == 0) {
      cout << "0/1\n";
      return 0;
   }

   print(a);
   putchar('/');
   print(b);
   return 0;
}
```

