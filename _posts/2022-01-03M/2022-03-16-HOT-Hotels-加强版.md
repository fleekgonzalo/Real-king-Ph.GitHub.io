---
categories: algorithm
tags:
 - 长链剖分
 - 树形DP
mathjax: true
---

<https://www.luogu.com.cn/problem/P5904>

## 题意

求在一个树内有多少个三元组$(i,j,k)$满足 $dis(i,j)=dis(i,k)=dis(j,k)$

## 思路

假定，我们对于所有的三元组都处理成如下图所示的模样。

![三元组](https://uploadfiles.nowcoder.com/images/20220316/738444583_1647429881549/D2B5CA33BD970F64A6301FA75AE2EB22)

其中 I B K J 都是 点 A 的子树。

我们定义如下的变量。

```
F[u][i] --> 表示在点 u 的所有子结点中到达点 u 长度为 i 的个数。
G[u][i] --> 表示如上的二元组,连接到的中心节点 B 到达点 A 还剩下来的长度。
如果不明白看下图。
```

![G](https://uploadfiles.nowcoder.com/images/20220316/738444583_1647430135697/D2B5CA33BD970F64A6301FA75AE2EB22)

那么如果我们对于点 u ，其子树 v 我们的答案可以由 `F[u][i] * G[v][i + 1] + F[v][i] + G[u][i + 1]` 更新。

那么我们再来看状态转移方程。

对于一个树 `u` 而言其所有子树 `v` ，我们需要逐个更新，由于我们的 `F\G` 的状态都可以由子树的状态更新，因此，我们可以采用[长链剖分](https://blog.nowcoder.net/n/38043ed35ac3449696d98d2432114985)的方法降低时间复杂度。

我们来看剩下了的该如何更新。

- 首先，我们每升一级，我们的 `G[v][i]` 归入到 `G[u][i-1]` 以及 `F[v][i]` 要归入到 `F[u][i + 1]`。
- 然后我们在看，`G[u][i]` 可以由 `F[u][i] * F[v][i - 1]` 归入。
- 最后，考虑到`G[u][i]` 可以被 `F[u][i]` 影响，因此，我们最后更新 `F` 即可。

那么最终答案

{% highlight cpp linenos %}
#include <iostream>
#include <vector>

using namespace std;

const int N = 1e5 + 10;
vector<int> E[N];

int buff[N << 4];
int *F[N];
int *G[N];
int *pos = buff;
int len[N];
int son[N];

void get_son(int u,int fa = -1) {
    for (auto v : E[u]) {
        if(v == fa) continue;
        get_son(v , u);
        if(len[v] > len[u]) {
            len[u] = len[v];
            son[u] = v;
        }
    }
    len[u] ++ ;
} 

void mery(int x) {
    F[x] = pos;
    pos += len[x] * 2 + 1;
    G[x] = pos;
    pos += len[x] * 2 + 1;
}

long long ans = 0;

void get_ans(int u,int fa = -1) {
    if(son[u]) {
        F[son[u]] = F[u] + 1;
        G[son[u]] = G[u] - 1;
        get_ans(son[u] , u);
    }

    F[u][0] = 1;
    ans += G[u][0];

    for (auto v : E[u]) {
        if(v == fa || v == son[u]) continue;
        mery(v);
        get_ans(v , u);
        for (int i = 1 ; i <= len[v] ; i ++ ) 
            ans += F[u][i - 1] * G[v][i] +
                   F[v][i - 1] * G[u][i];

        for (int i = 1 ; i <= len[v] ; i ++ ) 
            G[u][i - 1] += G[v][i];
        
        for (int i = 1 ; i <= len[v] ; i ++ ) 
            G[u][i] += F[u][i] * F[v][i - 1];
        

        for (int i = 1 ; i <= len[v] ; i ++ ) 
            F[u][i] += F[v][i - 1];
    }
}

int main() {
    int n ; cin >> n ;
    for (int i = 1 ; i < n ; i ++ ) {
        int x , y ; cin >> x >> y ;
        E[x].push_back(y);
        E[y].push_back(x);
    }
    
    get_son(1); 
    mery(1); 
    get_ans(1);

    cout << ans << '\n';

    return 0;
}
{% endhighlight %}































