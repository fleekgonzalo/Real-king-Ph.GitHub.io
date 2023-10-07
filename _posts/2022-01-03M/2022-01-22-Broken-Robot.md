---
categories: algorithm
tags:
 - 高斯消元
 - 后效性处理
mathjax: true
---

<https://codeforces.com/problemset/problem/24/D>

## 题意
​
我们有 $N \times M$ 大小的网格。我们有一个点，他可能会向左中右下(不会突破边界)，这四个方向走动。我们的目标是最后一行，求解从点 `(x , y)` 走到最后一行的期望步数是多少。
​
## 思路
​
假设我们当前处于第 $i$ 行。我们可以得到如下的方程
​
$$
\begin{aligned}
& F[i , 1] = (F[i + 1 , 1] + F[i , 1] + F[i , 2])\times \frac{1}{3} + 1 \\
& F[i , M] = (F[i + 1 , M] + F[i , M] + F[i , M - 1]) \times \frac{1}{3} + 1  \\
& F[i , j] = (F[i + 1, j] + F[i , j] + F[i , j - 1] + F[i , j + 1])\times \frac{1}{4} + 1 
\end{aligned}
$$
​
如果我们将这些式子转化为矩阵的话，我们就可以得到如下的方程。
​
$$
\begin{bmatrix}
F[i , 1] \\
F[i , 2] \\
F[i , 3] \\
\vdots \\
F[i , m]
\end{bmatrix}^ T
\times
\begin{bmatrix}
2  & -1 & 0  & \dots & 0\\
-1 & 3  & -1 & \dots & 0\\
0  & -1 & 3  & \dots & 0\\
\vdots &  &  &       & \vdots\\
0 & \dots&\dots & 3 &  -1\\
0 &\dots & \dots & -1 & 2\\
\end{bmatrix} 
= \begin{bmatrix}
F[i + 1,1] + 3\\
F[i + 1,2] + 4 \\
F[i + 1, 3] + 4 \\
\vdots \\
F[i + 1 , m] + 3
\end{bmatrix} ^ T
$$
​
如果我们第 $i + 1$ 行信息已知的话，那么我们变可以轻松推得第 $i$ 行的信息。
​
事实上，我们的第 $n$ 行的信息我们已经完全的知道了，接下来我们只需要通过这个矩阵帮助我们得到每行的 $F[i,j]$ 。
​
由于这个行列式十分的稀松，我们只需要求一次高斯消元，就可以得出来结果了。
​
​
​
[code](https://codeforces.com/contest/24/submission/143548569)
​