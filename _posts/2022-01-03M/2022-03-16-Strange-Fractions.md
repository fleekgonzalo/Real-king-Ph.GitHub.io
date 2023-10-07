---
categories: algorithm
tags:
 - 数学
mathjax: true
---

<https://codeforces.com/gym/103446/problem/D>


## 题意
在规定的范围内求解整数 a , b 满足 $\frac a b + \frac b a = \frac p q$

## 思路
这个题目让我来做的话，可能就暴毙了。

首先我们来看几个对这个题目而言很重要的性质。

- $p$ $q$ 假设互质，那么原来的输入总可以考虑为 $k\times q = q'$ $k\times p = p'$。
总可以证明成功。
- $a$ $b$ 假设互质，如果 $a'=k\times a, b'=k\times b$ 。那么原来的式子便可以化简为 $\frac {k^2\times(a^2+b^2)}{k^2ab}=\frac {a^2+b^2}{ab}$ ，因此 $a$ $b$ 互质。
- $\gcd(ab,a^2+b^2)=1$ 。
	
    假设 $p|(ab) 且 p|(a^2+b^2)$ 
    
    那么可以分为以下两种情况
    
    - $p \mid a \Rightarrow p\mid b^2 , 因为 \gcd(a,b)=1 所以 p = 1$
    - $p \nmid a$, 假设 $q \mid a$ 与 $r \mid b$ 那么 $p = qr$。
    
    	因此可以证得 $qr\mid a^2 + b^2 \Rightarrow q\mid a^2 + b ^ 2 \Rightarrow q\mid b^2$ 由于 $\gcd(q , b) = 1$ 所以 $q = 1$ ，同理 $r = 1$。

那么因此，我们就可以得到 $p=a^2 + b^2$ 和 $q = ab$

我们有两种做法
- 我们注意到 $1\le q\le 10^7$ 而 $\sqrt{10^7} = \sqrt {10} \times10^3$ 约为 $3\times 10^3$ 我们，通过枚举因子 $a b$ 得到我们的答案，那么复杂度就为 $O(\sqrt q T)$。 大概为$3\times 10^8$ 可过
- 同样的，我们发现，$1\le q \le 10 ^ 7$ 最多有 $8$ 个素因子，因此，我们通过二进制枚举这些数的分配情况大概为 $2^8$，最终，我们也可以得到我们的答案。同上面的情况相同，如果我们想要知道素因子的个数最多需要$\sqrt q$ 次枚举。因此复杂度同上。

	如果我们想要更快的话，我们可以通过欧拉筛，每次得到最小素因子和最小素因子的k次方的形式快速得到答案，以降低时间复杂度。



{% highlight cpp linenos %}
#include <iostream>
#include <numeric>

using namespace std;

const int N = 1e7 + 10;
bool is[N];
int prime[N];
int mk[N];

void table() {
    int tot = 0;
    for (int i = 2 ; i < N ; i ++ ) {
        if(!is[i]) {
            prime[tot++] = i;
            mk[i] = i;
        } 
        for (int j = 0 ; j < tot && 
                         1ll * i * prime[j] < N; 
                 j ++ ) {
            is[i * prime[j]] = 1;
            if(i % prime[j]) {
                mk[prime[j] * i] = prime[j];
            } else {
                mk[prime[j] * i] = prime[j] * mk[i];
                break;
            }
        }
    }
}

int v[10];

void solve() {
    int p , q ; cin >> p >> q;
    if (p < 2 * q) {
            cout << "0 0\n";
            return ;
    }
    int g = gcd(p , q);
    p /= g , q /= g;
    int tot = 0;
    while(q != 1) v[tot ++ ] = mk[q] , q /= mk[q];

    int a , b;

    for (int i = 0 ; i < (1 << tot) ; i ++ ) {
        a = 1 , b = 1;
        for (int j = 0 ; j != tot ; j ++ ) {
            if((i >> j) & 1) a *= v[j];
            else b *= v[j];
        }
        if(a * a + b * b == p) {
            if(a > b) swap(a , b);
            cout << a << ' ' << b << '\n';
            return ;
        }
    }
    cout << "0 0\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    int t ; cin >> t;
    table();
    while(t--) solve();
}
{% endhighlight %}

或者

{% highlight cpp linenos %}
#include <iostream>
#include <numeric>
#include <vector>
using namespace std;

void solve() {
    int p , q ; cin >> p >> q;
    if (p < 2 * q) {
            cout << "0 0\n";
            return ;
    }
    int g = gcd(p , q);
    p /= g , q /= g;
    int a = 1 , b = 1;
    
    vector<int> v;

    for (int i = 2 ; i * i <= q ; i ++ ) {
        if(q % i == 0) {
            int kki = 1;
            while(q % i == 0) {
                kki *= i;
                q /= i;
            }
            v.push_back(kki);
        }
    }
    if(q > 1) v.push_back(q);
    for (int i = 0 ; i < (1 << v.size()) ; i ++ ) {
        a = 1 , b = 1;
        for (int j = 0 ; j != v.size() ; j ++ ) {
            if((i >> j) & 1) a *= v[j];
            else b *= v[j];
        }      
        if(a * a + b * b == p) {
            if(a > b) swap(a , b);
            cout << a << ' ' << b << '\n';
            return ;
        }

    }
    cout << "0 0\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    int t ; cin >> t;
    while(t--) solve();
    return 0;
}

{% endhighlight %}



































