---
categories: algorithm
tags: 构造
mathjax: true
---

<https://codeforces.com/gym/103470/problem/D>

## 题意

如下所示的循环中

{% highlight cpp linenos %}
for (int i = 1 ; i<= n ; i ++ ) {
    for (int j = 1 ; j <= n ; j ++ ) {
     	if(a[i] < a[j]) swap(a[i] , a[j]);   
    }
}
{% endhighlight %}

对于给定序列 $A[N]$ 分别求其前缀 `[1 , N]` swap的次数

## 思路

我们不妨观察以下我们的序列。

首先，对于第一次循环。

我们会发现，我们将找到所有刚好比上一个最大值大的那个数。

然后我们第一次循环就是把最后一个数提到第一个，然后其余的数在找到的位置上往后挪了一圈。

而在往后所有的循环中，我们前面的数都是已经拍好序的状况了，我们只会进行与前面这些数字进行交换。

我们不妨用样例模拟一下这两种情况。

```
i = 0 | [2, 3, 2, 1, 5]
i = 1 | [5, 2, 2, 1, 3]
i = 2 | [2, 5, 2, 1, 3]
i = 3 | [2, 2, 5, 1, 3]
i = 4 | [1, 2, 2, 5, 3]
i = 5 | [1, 2, 2, 3, 5]
```

我们可以发现一个显著的规律，对于第 `i` 位需要排序的位，我们一共交换的次数，与之前出现数字的次数相等。

因此，我们不妨考虑一个一个假如数字的情况。

我们将所有的情况分为两类。

1. 我们最后加入的数字小于等于前缀出现最大的数字。

   那么很显然，我们前面任何的 `i` 都不会对当前位产生任何影响。因此最后答案就是前缀中所有比当前数大的种类。

2. 我们最后出现的数字比当前的前缀最大的数字大。

   毫无疑问，我们在第一轮就会产生一次交换，那么首先我们就需要 `ans ++ `。

   然后我最后一个数字的位置，一定会被替代为之前最大的值。该情况与第一种情况极其相似，那么我们将会出现`(before_max , now_max]`  中所有数字的次数。由于比较特殊只有一个因此，我们在这个地方也会 `ans++`。

   那么还剩下一个问题，剩下来的数字我们该怎么办。

   1. 首先我们考虑在前缀中出现了两个及以上的`before_max`。

      对于之前所有拍好序的数字来说，当到达`i`位的时候。我们会有这样的序列。

      `[x, x, x, ..., [>=0 次 before_max],before_max] | [before_max]`

      经过我们这次的变换后得到另一个序列。

      `[x, x, x, ..., [>=0 次 before_max],now_max] | [before_max]`

      显然，对于上面的情况而言，是不会产生任何交换的，而对于下面的情况而言，每个值为`before_max` 都会由于 `now_max > before_max` 而产生一次交换。

       

      然后是不等于 `before_max` 的数字，我们该怎么办呢？

      同样的，不妨看看变换前和变换后的序列。

      `[x, x, x, ..., [>=1 次 before_max],before_max] | [now_value]`

      `[x, x, x, ..., [>=1 次 before_max],now_max] | [now_value]`

      我们发现，对于上面的情况而言，我们只会产生一次交换，即`swap(now_value , before_max)`

      而对于下面的情况而言，我们会产生两次交换`swap(now_value,before_max)` 和 `swap(before_max , now_max)`

      也就是说，从第二次出现 `before_max` 之后所有的数都会多产生一次交换。

      

      那么综合上面两种情况。

      `ans += (i - 1) - (second_before_max_postion) + 1 = i - second_before_max_postion`

   2. 最后，如果只出现一次呢，又会怎么样呢。

      我们简单看看。

      `[x, x, x, ..., [0 次 before_max],before_max] | [now_value]`

      `[x, x, x, ..., [0 次 before_max],now_max] | [now_value]`

      由于没有任何的 `now_value` 比`before_max` 大，并且`before_max` 被换到了最后面。

      所以，对于所有`now_value` 不会产生任何的贡献。

      只需要 `ans += 2`

   

   那么现在只剩下来一个问题了，如何知道不同数字的个数，我们观察得到`a[i] <= n` 因此简单的树状数组即可胜任。

下面提出一个问题，如果`a[i] <= 1e9` 该如何处理 , `a[i] <= 1e18` 呢？
   

   

   {% highlight cpp linenos %}
   #include <iostream>
   #include <vector>
   
   using namespace std;
   
   struct BIT_Tree {
      vector<int> Cnt;
      int sz;
      BIT_Tree(int n) : sz(n) { Cnt.assign(n + 1, 0); }
   
      int lowibit(int x) { return x & -x; }
   
      void add(int x) {
         for (int i = x; i <= sz; i += lowibit(i)) {
            Cnt[i]++;
         }
      }
   
      int sum(int x) {
         x = min(sz, x);
         int res = 0;
         for (int i = x; i > 0; i -= lowibit(i)) {
            res += Cnt[i];
         }
         return res;
      }
   
      void set(int x) {
         if (sum(x) - sum(x - 1)) return;
         add(x);
      }
   };
   
   void solve() {
      int n;
      cin >> n;
      vector<int> v(n + 1);
      BIT_Tree bt(n);
      int pos = 0;
      int maxx = -1;
      long long ans = 0;
      for (int i = 1; i <= n; i++) {
         cin >> v[i];
         bt.set(v[i]);
   
         if (i == 1) {
            maxx = v[i];
         } else if (v[i] > maxx) {
            ans += 2;
            if (pos) ans += i - pos;
            maxx = v[i];
            pos = 0;
         } else {
            ans += bt.sum(n) - bt.sum(v[i]);
            if (!pos && v[i] == maxx) {
               pos = i;
            }
         }
   
         cout << ans << " \n"[i == n];
      }
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

   

   

