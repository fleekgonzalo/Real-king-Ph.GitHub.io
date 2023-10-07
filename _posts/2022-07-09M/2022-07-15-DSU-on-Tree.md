---
title: "树上启发式合并(DSU on Tree)"
date: "2022-07-15 03:39:36 +0800"
last_modified_at: "2022-07-17 15:59:08 +0800"
categories: ["algorithm"]
tags: ["algorithm", "tree", "DSU"]
mathjax: true
---

[<i class="fa-brands fa-connectdevelop"></i>算法发明者的第一题][dsu]{:.button.button--outline-secondary.button--pill}

[OI Wiki][oiwiki]{:.button.button--outline-secondary.button--pill}

[dsu]: https://codeforces.com/contest/741/problem/D
[oiwiki]: https://oi-wiki.org/graph/dsu-on-tree/

## 简单的介绍

什么是启发式合并？

启发式合并，是一种基于 *直觉* 的奇特算法。

通常来说，我们需要按 **秩** 合并，这个秩可以有两种意思，一个是集合大小，一个是树的高度。

我们总是将秩小的那个合并到大的那个中，这样的话，我们就可以以一种较为简洁的方式将树，尽量的往 _扁_ 的方向合并。

假如以并查集为例，我们通常可以这样子合并。

```cpp
void merge(int x,int y) {
   x = find(x) , y = find(y);
   if(sz[x] < sz[y]) swap(x , y);
   fa[y] = x;
   sz[x] += sz[y];
}
```

## 复杂度分析

可以参考之前发布的 [重链剖分](/algorithm/2022/07/11/heavy-link-tree.html)

在重链剖分的时间复杂度分析中，我们发现有一个非常重要的性质就是，我们最多只会跳 $O(\log N)$ 次。假如我们把这个过程反过来呢？同样适用。

在一个已经确定的树上，我们通常会采用不断的将轻儿子向重儿子上合并的方式进行回溯。所以，我们这样就可以使用重链剖分中以及存在的结论了。那么我们就可以产生如下的推理。

1. 从根节点到任意节点上所经过的轻边的数量要少于 $\log_2 N$ 条。
2. 每个点被重复遍历的次数，从根节点到达这条边的轻边数量相同。
3. 因此最终的时间复杂度就是 $O(N\log N)$

## 例题

照例，以页眉中的例题为例。

### 题意

给定一棵树，这棵树上的每条边都有一个字母标记，且这些字母的范围表示的范围为 `['a' , 'v']`。我们要求所有的子树中，可以通过变换形式形成回文串的路径的最长长度。

### 解法

首先，我们发现，这个字母集合的大小有点怪，那么我们很容易想到，可以状态压缩。

再由于回文的条件，进一步敲定了，状压的事实。因为对于一个回文串来讲，奇数个的字母数，一定 $\le 1$

那么我们不妨通过异或的方式进行解决问题。

首先，我们可以得到如下的信息。

对于一条路径 `x <---> y` 而言，必须满足如下的关系

令 $value = xor(1,x) \oplus  xor(1,y)$   
只要 $lowbit(value) = value$ 就说明这条路径合法。

由于我们的状态并不是很多，所以我们可以考虑开启一个桶来记录对应 $xor$ 的最深的深度是多少。

不过由于该问题需要求解每个子树的最长回文路径，所以我们可以考虑在树上进行搜索来解决问题。

每当确定一个点作为根，我们就可以去搜索该子树中两两合法的点对，找到最长路径 $depth(x) + depth(y) - depth(root) \times 2$ 即可。

我们发现这个算法的时间复杂度是 $O(N^2)$ 显然不能很好的完成任务，因此接下来就是启发式合并带来的好处了。

每次搜索，我们先完成非重儿子的搜索，计算出答案，然后清空即可。

随后，我们搜索完成重儿子的计算，并且不清空，将重儿子计算过程中产生的桶中的信息保留下来，然后在一个一个去合并非重儿子的结点。

有上上面的推到结果，我们可以大胆的估计，每个点被访问的次数是从根节点到该点中轻边的数量+1，因此该算法的时间复杂度可以为 $O(N\log N)$

{% highlight cpp linones %}
#include <bitset>
#include <cstring>
#include <iostream>
#include <vector>
using namespace std;

const int N = 5e5 + 10;

int son[N], dep[N], sz[N];
int val[N], mx_dep[1 << 23];
int ans[N];

vector<int> E[N];

const int useful[] = {
    0b00000000000000000000000, 0b00000000000000000000001,
    0b00000000000000000000010, 0b00000000000000000000100,
    0b00000000000000000001000, 0b00000000000000000010000,
    0b00000000000000000100000, 0b00000000000000001000000,
    0b00000000000000010000000, 0b00000000000000100000000,
    0b00000000000001000000000, 0b00000000000010000000000,
    0b00000000000100000000000, 0b00000000001000000000000,
    0b00000000010000000000000, 0b00000000100000000000000,
    0b00000001000000000000000, 0b00000010000000000000000,
    0b00000100000000000000000, 0b00001000000000000000000,
    0b00010000000000000000000, 0b00100000000000000000000,
    0b01000000000000000000000, 0b10000000000000000000000,
};

int mx_dep_ans(int _xor, int depth) {
   int res = -1e9;
   for (auto value : useful) {
      res = max(res, mx_dep[_xor ^ value] + depth);
   }
   return res;
}

void get_son(int u) {
   for (auto v : E[u]) {
      dep[v] = dep[u] + 1;
      val[v] ^= val[u];
      get_son(v);
      if (son[u] == 0 || sz[v] > sz[son[u]]) son[u] = v;
      sz[u] += sz[v];
   }
   sz[u]++;
}

void clear(int u) {
   mx_dep[val[u]] = -1e9;
   for (auto v : E[u]) {
      clear(v);
   }
}

vector<pair<int, int>> nw;

void calc(int u) {
   nw.push_back({val[u], dep[u]});
   for (auto v : E[u]) {
      calc(v);
   }
}

void get_ans(int u) {
   for (auto v : E[u]) {
      if (v == son[u]) continue;
      get_ans(v);
      clear(v);
      ans[u] = max(ans[u], ans[v]);
   }
   if (son[u]) {
      get_ans(son[u]);
      ans[u] = max(ans[u], mx_dep_ans(val[u], dep[u]) - 2 * dep[u]);
      ans[u] = max(ans[u], ans[son[u]]);
      mx_dep[val[u]] = max(mx_dep[val[u]], dep[u]);
      for (auto v : E[u]) {
         if (v == son[u]) continue;
         calc(v);
         for (auto [_xor, depth] : nw)
            ans[u] =
                max(ans[u], mx_dep_ans(_xor, depth) - 2 * dep[u]);
         for (auto [_xor, depth] : nw)
            mx_dep[_xor] = max(mx_dep[_xor], depth);
         nw.clear();
      }
   } else {
      mx_dep[val[u]] = max(mx_dep[val[u]], dep[u]);
   }
}

int main() {
   ios::sync_with_stdio(false);
   cin.tie(0);
   memset(mx_dep, 0xc4, sizeof(mx_dep));

   int n;
   cin >> n;

   for (int i = 1; i < n; i++) {
      int x;
      char ch;
      cin >> x >> ch;
      x--;
      E[x].push_back(i);
      val[i] = 1 << (ch - 'a');
   }

   dep[0] = 1;
   get_son(0);
   get_ans(0);

   for (int i = 0; i < n; i++) {
      cout << ans[i] << ' ';
   }

   return 0;
}
{% endhighlight %}


## 更多的题目

### CF600E Lomsat gelral

[题目连接](https://codeforces.com/problemset/problem/600/E){:.button.button--outline-secondary.button--pill}

和例题十分相似，非常的模板化。

<details><summary>代码</summary>

{% highlight cpp linones %}
#include <iostream>
#include <vector>
using namespace std;

const int N = 1e5 + 10;

vector<int> E[N];
int colo[N];
long long ans[N];
int tmp[N];

bool is[N];
int sz[N];

long long Max, Colo;

void get_imp(int u, int fa = -1) {
    int it;
    int maxx = -1;
    for (auto t : E[u]) {
        if (t == fa) continue;
        get_imp(t, u);
        sz[u] += sz[t];
        if (sz[t] > maxx) {
            maxx = sz[t];
            it = t;
        }
    }
    if (maxx != -1) is[it] = true;
}

void clear(int u, int fa = -1) {
    tmp[colo[u]]--;
    for (auto t : E[u]) {
        if (t == fa) continue;
        clear(t, u);
    }
}

void get_ans(int u, int fa, int p = -1) {
    tmp[colo[u]]++;
    if (tmp[colo[u]] > Max) {
        Max = tmp[colo[u]];
        Colo = colo[u];
    } else if (tmp[colo[u]] == Max) {
        Colo += colo[u];
    }
    for (auto t : E[u]) {
        if (t == fa || t == p) continue;
        get_ans(t, u);
    }
}

void dfs(int u, int fa = -1) {
    int p = 0;
    for (auto t : E[u]) {
        if (t == fa) continue;
        if (is[t]) {
            p = t;
            continue;
        }
        dfs(t, u);
        clear(t, u);
        Max = Colo = 0;
    }
    if (p) dfs(p, u);
    get_ans(u, fa, p);
    ans[u] = Colo;
}

int main() {
#ifdef LOCAL
    freopen("input.txt", "r", stdin);
#endif
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) scanf("%d", &colo[i]), sz[i] = 1;
    for (int i = 1, u, v; i < n; i++) {
        scanf("%d%d", &u, &v);
        E[u].push_back(v);
        E[v].push_back(u);
    }

    get_imp(1);
    dfs(1);

    for (int i = 1; i <= n; i++) printf("%lld ", ans[i]);
    puts("");
    return 0;
}
{% endhighlight %}
</details>

### CF246E Blood Cousins Return

[题目连接](https://codeforces.com/problemset/problem/246/E){:.button.button--outline-secondary.button--pill}

只需要使用 set 记录信息，然后套上模板就可以过了。

<details><summary>代码</summary>

{% highlight cpp linones %}
#include <iostream>
#include <map>
#include <set>
#include <vector>
using namespace std;

const int N = 1e5 + 10;

int son[N], dep[N], sz[N], n, m, id, name_id[N];

vector<int> E[N];
map<string, int> name;

void get_son(int u) {
   sz[u] = 1;
   for (auto v : E[u]) {
      dep[v] = dep[u] + 1;
      get_son(v);
      if (son[u] == 0 || sz[son[u]] < sz[v]) son[u] = v;
      sz[u] += sz[v];
   }
}

set<int> S[N];
set<pair<int, int>> as[N];
int ans[N];

void clear(int u) {
   S[dep[u]].clear();
   for (auto v : E[u]) {
      clear(v);
   }
}

void calc(int u) {
   S[dep[u]].insert(name_id[u]);
   for (auto v : E[u]) {
      calc(v);
   }
}

void get_ans(int u) {
   for (auto v : E[u]) {
      if (son[u] == v) continue;
      get_ans(v);
      clear(v);
   }

   S[dep[u]].insert(name_id[u]);

   if (son[u]) {
      get_ans(son[u]);
      for (auto v : E[u]) {
         if (son[u] == v) continue;
         calc(v);
      }

      for (auto [k, i] : as[u]) {
         if (dep[u] + k < N) {
            ans[i] = S[dep[u] + k].size();
         }
      }
   }
}

int main() {
   ios::sync_with_stdio(false);
   cin.tie(0);
   cin >> n;

   for (int i = 1; i <= n; i++) {
      string s;
      int fa;
      cin >> s >> fa;
      if (name.count(s) == 0) name[s] = ++id;
      name_id[i] = name[s];

      E[fa].push_back(i);
   }

   cin >> m;

   for (int i = 0; i < m; i++) {
      int v, k;
      cin >> v >> k;
      as[v].insert({k, i});
   }

   get_son(0);
   get_ans(0);

   for (int i = 0; i < m; i++) {
      cout << ans[i] << ' ';
   }
}
{% endhighlight %}
</details>


### CF1009F Dominant Indices

[题目连接](https://codeforces.com/problemset/problem/1009/F){:.button.button--outline-secondary.button--pill}

这个题目也是中规中矩，和平时的启发式合并差不多

<details><summary>代码</summary>

{% highlight cpp linones %}
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

const int N = 1e6 + 10;
int buff[N << 4], *pos = buff;
int* F[N];
int son[N], len[N];
int ans[N], maxx[N];

vector<int> E[N];

void get_son(int u, int fa = -1) {
    for (auto v : E[u]) {
        if (v == fa) continue;
        get_son(v, u);
        if (len[v] > len[u]) {
            son[u] = v;
            len[u] = len[v];
        }
    }
    len[u]++;
}

void get_pos(int p) {
    F[p] = pos;
    pos += len[p] + 1;
}

void upd(int u, int mx, int pos) {
    if (mx > maxx[u]) {
        ans[u] = pos;
        maxx[u] = mx;
    } else if (mx == maxx[u])
        ans[u] = min(ans[u], pos);
}

void print(int u) {
    cerr << " POINT = " << u << " ans = " << ans[u] << '\n';
    for (int i = 0; i < len[u]; i++) {
        cerr << "I = " << i << " F = ";
        cerr << F[u][i] << '\n';
    }
}

void dfs(int u, int fa = -1) {
    ans[u] = 0, maxx[u] = 1;
    F[u][0] = 1;
    if (son[u]) {
        F[son[u]] = F[u] + 1;
        dfs(son[u], u);
        upd(u, maxx[son[u]], ans[son[u]] + 1);
    }

    for (auto v : E[u]) {
        if (v == fa || v == son[u]) continue;
        get_pos(v);
        dfs(v, u);
        for (int i = 0; i < len[v]; i++) {
            F[u][i + 1] += F[v][i];
            upd(u, F[u][i + 1], i + 1);
        }
    }

    // print(u);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    int n;
    cin >> n;

    for (int i = 1; i < n; i++) {
        int x, y;
        cin >> x >> y;
        E[x].push_back(y);
        E[y].push_back(x);
    }

    get_son(1);
    get_pos(1);
    dfs(1);

    for (int i = 1; i <= n; i++) {
        cout << ans[i] << '\n';
    }

    return 0;
}
{% endhighlight %}
</details>


### CF375D Tree and Queries

[题目连接](https://codeforces.com/problemset/problem/375/D){:.button.button--outline-secondary.button--pill}

在前面的一道题目中，使用的是 `std::set<T>` 记录答案，在这道题目中使用的是树状数组进行记录的答案，总体来说还是非常的套路的。

<details><summary>代码</summary>

{% highlight cpp linones %}
#include <iostream>
#include <set>
#include <vector>
using namespace std;

const int N = 1e5 + 10;

int son[N], sz[N], colo[N], c[N];
int ans[N];
set<pair<int, int>> S[N];
vector<int> E[N];

struct BIT_Tree {
   vector<int> tree;

   BIT_Tree(int n) { tree.resize(n + 1); }

   void update(int x, int v) {
      if (x)
         for (; x < tree.size(); x += x & -x) tree[x] += v;
   }

   int query(int x) {
      int res = 0;
      for (; x > 0; x -= x & -x) res += tree[x];
      return res;
   }

   int query(int l, int r) { return query(r) - query(l - 1); }
} bit(N);

void get_son(int u, int fa = -1) {
   sz[u] = 1;
   for (auto v : E[u]) {
      if (v == fa) continue;
      get_son(v, u);
      sz[u] += sz[v];
      if (sz[v] > sz[son[u]]) son[u] = v;
   }
}

void clear(int u, int fa = -1) {
   bit.update(colo[c[u]], -1);
   colo[c[u]]--;
   bit.update(colo[c[u]], 1);
   for (auto v : E[u]) {
      if (v == fa) continue;
      clear(v, u);
   }
}

void calc(int u, int fa, int tar) {
   bit.update(colo[c[u]], -1);
   colo[c[u]]++;
   bit.update(colo[c[u]], 1);

   for (auto v : E[u]) {
      if (v == fa) continue;
      calc(v, u, tar);
   }
}

void get_ans(int u, int fa = -1) {
   for (auto v : E[u]) {
      if (v == fa || v == son[u]) continue;
      get_ans(v, u);
      clear(v, u);
   }

   if (son[u]) {
      get_ans(son[u], u);
      for (auto v : E[u]) {
         if (v == fa || v == son[u]) continue;
         calc(v, u, u);
      }
   }

   bit.update(colo[c[u]], -1);
   colo[c[u]]++;
   bit.update(colo[c[u]], 1);

   // for (int i = 1; i <= 5; i++) {
   //    cerr << bit.query(i) << ' ';
   // }
   // cerr << '\n';

   for (auto [x, y] : S[u]) {
      ans[y] = bit.query(x, N - 5);
   }
}

int main() {
   int n, m;
   cin >> n >> m;

   for (int i = 1; i <= n; i++) {
      cin >> c[i];
   }

   for (int i = 1; i < n; i++) {
      int x, y;
      cin >> x >> y;
      E[x].push_back(y);
      E[y].push_back(x);
   }

   for (int i = 0; i < m; i++) {
      int x, y;
      cin >> x >> y;
      S[x].insert({y, i});
   }

   get_son(1);
   get_ans(1);

   for (int i = 0; i < m; i++) {
      cout << ans[i] << '\n';
   }

   return 0;
}
{% endhighlight %}
</details>

### CF570D Tree Requests

[题目连接](https://codeforces.com/problemset/problem/570/D){:.button.button--outline-secondary.button--pill}

相较于前面几个题目，还没有跳脱开套路。

<details><summary>代码</summary>

{% highlight cpp linones %}
#include <cstring>
#include <iostream>
#include <set>
#include <vector>

using namespace std;

const int N = 5e5 + 10;

vector<int> E[N];
bool ans[N];

int son[N], sz[N], dep[N], value[N];

void get_son(int u) {
   sz[u] = 1;
   for (auto v : E[u]) {
      dep[v] = dep[u] + 1;
      get_son(v);
      if (sz[v] > sz[son[u]]) son[u] = v;
   }
}

set<pair<int, int>> S[N];

int XOR[N];

void clear(int u) {
   XOR[dep[u]] ^= value[u];
   for (auto v : E[u]) {
      clear(v);
   }
}

void calc(int u) {
   for (auto v : E[u]) {
      calc(v);
   }
   XOR[dep[u]] ^= value[u];
}

bool check(int x) { return x == (x & -x); }

void get_ans(int u) {
   for (auto v : E[u]) {
      if (v == son[u]) continue;
      get_ans(v);
      clear(v);
   }

   if (son[u]) {
      get_ans(son[u]);

      for (auto v : E[u]) {
         if (v == son[u]) continue;
         calc(v);
      }
   }

   XOR[dep[u]] ^= value[u];

   for (auto [depth, index] : S[u]) {
         ans[index] = check(XOR[depth]);
   }
}

int main() {
   ios::sync_with_stdio(false);
   cin.tie(0);
   int n, m;
   cin >> n >> m;

   for (int i = 2; i <= n; i++) {
      int x;
      cin >> x;
      E[x].push_back(i);
   }

   string s;
   cin >> s;

   for (int i = 0; i < n; i++) {
      value[i + 1] = 1 << (s[i] - 'a');
   }

   for (int i = 1; i <= m; i++) {
      int x, y;
      cin >> x >> y;
      S[x].insert({y, i});
   }

   dep[1] = 1;
   get_son(1);
   get_ans(1);

   for (int i = 1; i <= m; i++) {
      cout << (ans[i] ? "Yes" : "No") << '\n';
   }

   return 0;
}
{% endhighlight %}
</details>
