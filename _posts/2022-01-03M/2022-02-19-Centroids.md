---
categories: algorithm
tags:
 - 树形DP
---

<https://codeforces.com/contest/708/problem/C >

[可以选择在这里阅读](https://real-king.notion.site/CF708C-Centroids-214b945b028d46a3b7c720b13f13a366)

## 题意

你拥有一棵树，现在你又一次改造树的机会，即删去原来树中的一个边，并且加上一个边使得其依然为树。求问对于每个点而言，是否存在机会使得改造后的树其可以成为树的重心。

## 思路

我们如果想要求其改造后是否可以取得重心，因此我们对任意一个节点，我们需要求得其最大子树中，最大可以切出来多少个点。

那么图也就变为如下所示。

![alt](https://uploadfiles.nowcoder.com/images/20220219/738444583_1645283181461/D2B5CA33BD970F64A6301FA75AE2EB22)

还有一种情况是其最大子树是点 u 的父节点。

如我我们需要更新这个节点的话，我们不妨设置如下几个变量。

- `s[u]` 表示将其及其子树可以切下最大合法的子树
- `f[u]` 表示在其父节点中除了点 u 外可以切下的最大合法子树
- `g[u]` 表示其最大的子树(可以为父节点)
- `x[u]` 表示点 u 的父节点。
- `sz[u]` 表示点 u 及其子树的大小。

那么对于一个点 `u` 的最大子树 `g[u]` 如果 `x[u] == g[u]` 的话，只需要满足 `n - sz[u] - f[u] <= n / 2` 。如果 `x[u] != g[u]` 的话，则需要满足条件 `sz[g[u]] - s[g[u]] <= n / 2`。



那么问题回归到如何求解 s 与 f。

对于 s 的求解我们有如下的转移

- 如果该节点的大小 `<= n / 2` 则 `s[u] = sz[u]`。
- 同时 `s[u] = max(s[v])` 

{% highlight cpp linenos %}
void get_s(int u,int fa = -1) {
    for (auto v : E[u]) {
        if(v == fa) continue;
        get_s(v , u);
        if(sz[v] <= n / 2) s[u] = max(s[u] , sz[v]);
        s[u] = max(s[u] , s[v]);
    }
    if(sz[u] <= n / 2) s[u] = max(s[u] , sz[u]);
}
{% endhighlight %}

对于 f 的求解，我们不妨看一下图。
![alt](https://uploadfiles.nowcoder.com/images/20220219/738444583_1645284001923/D2B5CA33BD970F64A6301FA75AE2EB22)

首先如果 `n - sz[v] <= n / 2` 那么我将其更新为 `f[v] = n - sz[v]`

除此之外， 如果我们要更新点 `v` 那么我们必须要找除点 `v` 外所有节点的 `s[v]` 的最大值，同时我们也需要 `f[u]` 的值。

设最大值为 `a` 次大值为 `b`。

那么就需要如下的规则。

- 如果 `s[v] == a` 那么我们就需要将 `f[v] = max(f[v] , b)`。否则 `f[v] = max(f[v] , a)`。
- 同时我们的 `f[v] = max(f[v] , f[u])` 以将之前求到过的答案更新过来。



{% highlight cpp linenos %}
void get_f(int u,int fa = -1) {
    int a , b; a = b = -1;
    for (auto v : E[u]) {
        if(v == fa) continue;
        if(s[v] > a) {
            b = a;
            a = s[v];
        } else if(s[v] > b) {
            b = s[v];
        }
    }
 
    for (auto v : E[u]) {
        if(v == fa) continue;
        int mxdiv = a;
        if(s[v] == a) mxdiv = b;
        if(n - sz[v] <= n / 2) {
            f[v] = max(f[v] , n - sz[v]);
        }
        f[v] = max(f[v] , mxdiv);
        f[v] = max(f[v] , f[u]);
        get_f(v , u);
    }
}
{% endhighlight %}

[code](https://codeforces.com/contest/708/submission/146947789)
