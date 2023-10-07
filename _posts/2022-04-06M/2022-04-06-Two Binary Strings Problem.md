---
category: algorithm
tag: 位运算
mathjax: true
---

[前往做题](https://codeforces.com/gym/103446/problem/J){:.button.button--outline-success.button--pill}

## 题意

给定两个长为 $n$ 的 `0\1` 序列 a 和 b

$$
f(l,r) = \begin{cases}
1, if \sum\limits_{i = l} ^ r a_i > \frac{r - l + 1}{ 2} \\
0 , otherwise
\end{cases}
$$

输出一个零一序列，`c[k]` 的值如果为 `1` ,那么对于所有的 $i\in [1,n]$ $f(max(i - k + 1) , i) = b_i$ 成立。

## 思路

首先，如果 `a[i]` 的值为 `0` ，那么我们将其变换为 `-1` , 然后我们对这个数组求取前缀和 `S` 。

那么我们就得到一个简单的转换如果对于 `b[i] = 1` 的情况而言其所有满足 `S[i] - S[i - k] > 0`。即 `S[i] > S[i - k]`。

那么整理一下就是。

- if `b[i] == 0` then `S[i] <= S[i - k]`
- if `b[i] == 1` then `S[i] > S[i - k]`

为了方便求取答案，我们把这个所有情况变为不符合条件的状况。


- if `b[i] == 0` then `S[i] > S[i - k]`
- if `b[i] == 1` then `S[i] <= S[i - k]`

得到了下面的方程之后，我们下面的任务就是寻找是否有任何一个 `k`，满足了上面其中一个式子，如果满足则设 `C[k] = 1`，输出的时候取反即可。

如果我们在这阶段采取了 $O(N^2)$ 的算法，那么显而易见，在这个范围内一定是 T 掉的。巧在，如果我们除去 $10$ 刚好可以过，那么由上面的规律我们发现，我们可以采用 `std::bitset` 的方法降低常数。

不过由于我们要的顺序是 `1 ~> n` ，在上面的表达式中，如果我们右移了 `n - i + 1` 位的话，我们以第 `n` 位为 `1` 开始数数的话，刚好和我们的顺序颠倒过来了。

那么我们不妨将计就计，用这个倒序作为我们答案输出。

我们观察上面的式子。

假如，我们以第一句作为基准。

我们用 `bitset::A` 作为桶存储所有比 `S[i]` 值小的下标。如果出现值相等的值，我们优先将下标大的放在前面，确保我们的不等式条件不被破坏。

那么的话，如果我们 `b[i] == 0` 的话，我们就可以通过 `C |= A << (n - pos + 1)` 。来更新答案。

否则的话 `C |= (~A) << (n - pos + 1)`

最后我们倒叙输出答案即可。

不过呢，我们发现，我们每个i的话，存在一个前缀需要满足，那么因此我们只需要加一下保证前缀能够成功运行即可。

{% highlight cpp liones %}
#include <algorithm>
#include <bitset>
#include <iostream>

using namespace std;

char a[50010], b[50000];
int id[50010];

bitset<50010> A, C;

void solve() {
   int n;
   cin >> n;
   cin >> a + 1 >> b + 1;

   int now = 0;
   int pre = n + 1;

   for (int i = 1; i <= n; i++) {
      now += a[i] == '1';
      if ((now * 2 > i) != (b[i] == '1')) {
         pre = i;
         break;
      }
   }

   A.reset(), C.reset();

   vector<int> S(n + 1, 0);
   for (int i = 0; i <= n; i++) {
      if (i) S[i] = S[i - 1] + (2 * (a[i] == '1') - 1);
      id[i] = i;
   }

   sort(id, id + n + 1, [&](int a, int b) {
      if (S[a] == S[b]) return a > b;
      return S[a] < S[b];
   });

   for (int i = 0; i <= n; i++) {
      int pos = id[i];
      if (b[pos] == '0') {
         C |= A << (n - pos + 1);
      } else if (b[pos] == '1') {
         C |= (~A) << (n - pos + 1);
      }
      A[pos] = 1;
   }

   for (int i = 1; i <= n; i++) {
      if (i < pre) {
         if (C[n - i + 1])
            cout << 0;
         else
            cout << 1;
      } else
         cout << 0;
   }
   cout << '\n';
}

int main() {
   ios::sync_with_stdio(false);
   cin.tie(0);
   int t;
   cin >> t;
   while (t--) solve();
   return 0;
}
{% endhighlight %}

