---
title: "重链剖分"
tags: [ "重链剖分"]
date: "2022-07-11 19:31:00 +0800"
categories: [ "algorithm"]
mathjax: true
---

## 前置知识

1. 线段树 (树链剖分的主要依托)
2. LCA (树链剖分可以解决的一个问题 \| 可以边学变了解)
3. DFS序
4. 图

### 基本概念

![随机生成树](https://s2.loli.net/2022/07/11/Vd5CJKO67M2nXIR.png "树链剖分图")

如图所示，  
这是一张随机的树。

我们以任一结点作为子树的根，那么对于这个树而言，其结点数量最多的子树的根，我们称之为 **重子树**。

例如图中的树来说。对于以 `9` 号结点为根的子树来说，我们结点最多的子树是以 `3` 作为根的子树。

对于重子树而言，其根我们称之为 **重儿子**。

我们将根不断的和重儿子形成的链，我们称之为 **重链**。

相对不是重的，我们则称之为 **轻**

有了这个我们就可以看图中的例子了。

我们从 `6` 号结点出发，我们的重儿子是 `9` ，`9` 的重儿子是 `2`， `2` 的重儿子是 `5`，因此我们就形成了 `[6 ,9 ,2 ,5]` 这样的一条链。

对于其他的轻子树而言，我们同样的也可以从中剖出来一条条重链。

那么最后就形成了我们图中的这个样子。

依照这样划分的许多重链，我们有以下两种性质

1. 所有的 **轻边** 连接出去的子树一定小于这个树的结点数量的一半。  
   对于边 $(u,v)$ 其中 $u$ 是 $v$ 的父节点。  
   如果该边为轻边，那么 $size(v) < \frac{size(u)}{2}$  
   这很容易证明。
2. 从根出发，到达任一结点所需要的链的数量小于 $\log_2 N$  
   分两种情况讨论。
   1. 走重边，这毋庸置疑，重链的条数只有一条。
   2. 走轻边。  
      从第一条性质我们可以看出里，每次走 **轻边** 的话，  
      那么轻子树的 $size(v)$ 要比原来树 $\frac{size(u)}{2}$ 还要小
      因此我们每次对半分，最多不会超过 $\log_2 N$
   

## 树链剖分的基本用法

在这里以 [【模板】轻重链剖分/树链剖分](https://www.luogu.com.cn/problem/P3384 "树链剖分") 作为讲解的依据。

在题目中有以下四点要求

1. `x y z`，表示将树从 `x` 到 `y` 结点最短路径上所有节点的值都加上 `z`。
2. `x y`，表示求树从 `x` 到 `y` 结点最短路径上所有节点的值之和。
3. `x z`，表示将以 `x` 为根节点的子树内所有节点值都加上 `z`。
4. `x` 表示求以 `x` 为根节点的子树内所有节点值之和。

我们先看第 1 2 两点。

### 预处理 -- 求出所有的重链

这主要有两个 `dfs` 形成。

#### 第一个 `dfs` 求出重儿子

为了求出重儿子我们需要以下几个变量。

1. `size`   : 表是该子树的结点数量。
2. `son`    : 表示该节点的重儿子。
3. `fa`     : 表示该节点的父节点。

那么我们形成如下的代码即可。

```cpp
void get_son(int u,int fa = -1) {
   size[u] = 1;
   son[u] = -1;
   for (int v : graph[u]) {
      if (v == fa) continue;
      get_son(v, u);
      size[u] += size[v];
      if (son[u] == -1 || size[v] > size[son[u]]) son[u] = v;
   }
}
```

#### 第二个 `dfs` 重新排布树的结构

我们将原来的树重新编号，将其划分为一条一条的链状。

下面的图就很好的印证了这条。

![reindex](https://s2.loli.net/2022/07/11/ylvSUnfFGJib65Y.png "重新排布")

我们需要以下几个变量。

1. `index`  :  表示原来树结点的编号到重新排布后的编号。
2. `invdex` :  与上述恰恰相反
3. `tot`    :  表示全部重排的数量。

最终可以形成如下的代码

```cpp
int tot = 0;
void reindex(int u,int fa = -1) {
   index[u] = tot ++;
   invdex[index[u]] = u;

   if(son[u] != -1) reindex(son[u] , u);

   for (int v : graph[u]) {
      if(v == fa || v == son[u]) continue;
      reindex(v , u);
   }
}
```

### 求 LCA

#### 还需要的信息

如果要求 LCA 相比原来两个 dfs 而言，还需要求出两个东西。

1. `dep`    :  表示该节点的深度
2. `top`    :  表示该重链上的顶层结点。

对于这两个东西的求解其实非常容易，任意的放到第一个或者第二个`dfs` 中，这里以第二个为例。

```cpp
int tot = 0;
void reindex(int u,int fa = -1,int deep = 0) {
   if(fa == -1) top[u] = u;
   dep[u] = deep;

   index[u] = tot ++;
   invdex[index[u]] = u;

   if(son[u] != -1) {
      top[son[u]] = top[u];
      reindex(son[u] , u);
   }

   for (int v : graph[u]) {
      if(v == fa || v == son[u]) continue;
      top[v] = v;
      reindex(v, u , deep + 1);
   }
}
```

#### 求解

我们的 `LCA` 是通过每次向上跳跃一条链进行的。

所以说，每次我们需要对比一下我们的 `top[x]` 和 `top[y]` 是不是相等的。

那么我们有如下的代码。

算法详情详见注释。

```cpp
int LCA(int x,int y) {
   while(top[x] != top[y]) {        ///< 每次 `x` 和 `y` 不在一条重链上的时候
      if(dep[top[x]] < dep[top[y]]) ///< 选择 `x` 和 `y` 重链顶部
         swap(x , y);               ///< 较为深的那一个进行上跳。
      x = fa[top[x]];               ///< 跳跃到父节点
   }

   return dep[x] < dep[y] ? x : y;  ///< 选择最上方的结点
}
```

#### 树套树

在该题中我们主要有另外一个数据结构，线段树。

我们回顾以下题目的要求。

选择在 `x y` 之间的哪条路径上进行区间加区间求和。

由于重链剖分的特性，我们便可以将所有的重链化为一个区间，一并处理掉。

至于线段树，我在这里使用下面的类与方法。

```cpp
struct SEG_Tree {
   using PII = pair<int, int>;
   vector<PII> Range;      //  区间
   vector<long long> value;// 值
   vector<long long> lazy; // 懒标记

   SEG_Tree(int n); // 初始化

   int Lson(int p) { return p * 2 + 1; }
   int Rson(int p) { return p * 2 + 2; }

   void build(int l, int r, int p = 0); // 建树
   void push_down(int p); // 更新树
   void upd(int x, int y, long long vue, int p = 0); // 区间 [x ,y] 加 vue
   long long querry(int x, int y, int p = 0); // 区间 [x ,y] 查询
};
```

那么我们在一条链上进行加值的时候，我们可以选择边跳结点，边进行求值。

`请注意把原来树的结点转化为新的结点`{: .warning}

```cpp
void upd(int x,int y,int z, SEG_Tree &st) {
   while(top[x] != top[y]) {
      if(dep[top[x]] < dep[top[y]]) swap(x , y);
      st.upd(index[top[x]] , index[x] , z);
      x = fa[top[x]];
   }
   if(dep[x] > dep[y]) swap(x , y);
   st.upd(index[x] , index[y] , z);
}
```


### 最终的代码

{% highlight cpp liones %}
#include <iostream>
#include <vector>

using namespace std;

const int N = 1e5 + 10;
int n, m, r;
long long P;

int val[N], Index[N], invdex[N], son[N], fa[N], top[N], sz[N], dep[N];
vector<int> E[N];

void get_size(int f, int u, int deep = 0) {
   int MX = -1;
   dep[u] = deep;
   fa[u] = f;
   son[u] = -1;
   sz[u] = 1;
   for (auto v : E[u]) {
      if (v == f) continue;
      get_size(u, v, deep + 1);

      sz[u] += sz[v];
      if (sz[v] > MX) {
         MX = sz[v];
         son[u] = v;
      }
   }
}

int tot = 0;

void reindex(int f, int u) {
   Index[u] = tot;
   invdex[tot++] = u;
   if (son[u] != -1) {
      top[son[u]] = top[u];
      reindex(u, son[u]);
   }
   for (auto v : E[u]) {
      if (v == f) continue;
      if (son[u] == v) continue;
      top[v] = v;
      reindex(u, v);
   }
}

struct SEG_Tree {
   using PII = pair<int, int>;
   vector<PII> Range;
   vector<long long> value;
   vector<long long> lazy;

   SEG_Tree(int n) {
      int size = 1;
      while (size < n) size *= 2;

      Range.resize(size * 2);
      value.resize(size * 2);
      lazy.resize(size * 2);

      build(0, n - 1);
   }

   int Lson(int p) { return p * 2 + 1; }
   int Rson(int p) { return p * 2 + 2; }

   void build(int l, int r, int p = 0) {
      Range[p] = {l, r};
      lazy[p] = 0;

      if (l == r) {
         value[p] = val[invdex[l]];
         return;
      }

      int mid = (l + r) / 2;
      build(l, mid, Lson(p));
      build(mid + 1, r, Rson(p));
      value[p] = value[Lson(p)] + value[Rson(p)];
      value[p] %= P;
   }

   int len(int p) { return Range[p].second - Range[p].first + 1; }

   void push_down(int p) {
      if (lazy[p] == 0) return;
      lazy[Lson(p)] += lazy[p], lazy[Lson(p)] %= P;
      lazy[Rson(p)] += lazy[p], lazy[Lson(p)] %= P;
      value[Lson(p)] += lazy[p] * len(Lson(p)), value[Lson(p)] %= P;
      value[Rson(p)] += lazy[p] * len(Rson(p)), value[Rson(p)] %= P;
      lazy[p] = 0;
   }

   void upd(int x, int y, long long vue, int p = 0) {
      auto [l, r] = Range[p];
      if (x <= l && r <= y) {
         lazy[p] += vue;
         value[p] += vue * (r - l + 1);
         lazy[p] %= P;
         value[p] %= P;
         return;
      }

      push_down(p);
      int mid = (l + r) / 2;
      if (x <= mid) upd(x, y, vue, Lson(p));
      if (y > mid) upd(x, y, vue, Rson(p));
      value[p] = value[Lson(p)] + value[Rson(p)];
      value[p] %= P;
   }

   long long querry(int x, int y, int p = 0) {
      auto [l, r] = Range[p];
      if (x <= l && r <= y) return value[p];
      push_down(p);
      int mid = (l + r) / 2;
      long long res = 0;
      if (x <= mid) res += querry(x, y, Lson(p));
      if (y > mid) res += querry(x, y, Rson(p));
      res %= P;
      return res;
   }
};

void add(int x, int y, int z, SEG_Tree& st) {
   while (top[x] != top[y]) {
      if (dep[top[x]] < dep[top[y]]) swap(x, y);
      st.upd(Index[top[x]], Index[x], z);
      x = fa[top[x]];
   }
   if (dep[x] > dep[y]) swap(x, y);
   st.upd(Index[x], Index[y], z);
}

long long sum(int x, int y, SEG_Tree& st) {
   long long res = 0;
   while (top[x] != top[y]) {
      if (dep[top[x]] < dep[top[y]]) swap(x, y);
      res += st.querry(Index[top[x]], Index[x]);
      x = fa[top[x]];
   }
   if (dep[x] > dep[y]) swap(x, y);
   res += st.querry(Index[x], Index[y]);
   res %= P;
   return res;
}

void add(int x, int z, SEG_Tree& st) {
   st.upd(Index[x], Index[x] + sz[x] - 1, z);
}
long long sum(int x, SEG_Tree& st) {
   return st.querry(Index[x], Index[x] + sz[x] - 1);
}

int main() {
   ios::sync_with_stdio(false);
   cin.tie(0);

   cin >> n >> m >> r >> P;
   for (int i = 0; i < n; i++) {
      cin >> val[i];
   }

   for (int i = 1; i < n; i++) {
      int x, y;
      cin >> x >> y;
      x--, y--;

      E[x].push_back(y);
      E[y].push_back(x);
   }

   get_size(-1, r - 1);
   top[r - 1] = r - 1;
   reindex(-1, r - 1);

   SEG_Tree seg(n);

   int op, x, y, z;
   while (m--) {
      cin >> op;
      if (op == 1) {
         cin >> x >> y >> z;
         x--, y--;
         add(x, y, z, seg);
      } else if (op == 2) {
         cin >> x >> y;
         x--, y--;
         cout << sum(x, y, seg) << '\n';
      } else if (op == 3) {
         cin >> x >> z;
         x--;
         add(x, z, seg);
      } else if (op == 4) {
         cin >> x;
         x--;
         cout << sum(x, seg) << '\n';
      }
   }

   return 0;
}
{% endhighlight %}



