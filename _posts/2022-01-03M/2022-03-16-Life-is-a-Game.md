---
categories: algorithm
tags:
 - kruskal重构树
---

<https://ac.nowcoder.com/acm/contest/24872/H>

## 思路
该题采用kruskal重构树。

kruskal 重构树的特点是将边权化为点权。

当我们使用kruskal求取最小生成树的时候，我们不需要直接生成该树。

每次，我们得到两个点的时候，我们将其连成边时，我们只需要将这棵树两个点提出来，然后我们新加上一个点，且该点的权值是我们原来的边权。

如图所示，我们加边的过程如下。

![kruskal](https://uploadfiles.nowcoder.com/images/20220316/738444583_1647362646287/D2B5CA33BD970F64A6301FA75AE2EB22)

倘若我们再加一条从 `B <--> C`  相互连接的边的时候。使用如下图所示的方法加边即可。

![b<->c](https://uploadfiles.nowcoder.com/images/20220316/738444583_1647362822535/D2B5CA33BD970F64A6301FA75AE2EB22)

最终，如果我们按照kruskal的方式建立最小生成树的话，不难发现我们所建立的图其实就是一个大根堆。

因此我们可以不断的采用倍增 `lca` 的方式来寻找第一个符合我们所需要的答案的地方即可。

[code](https://ac.nowcoder.com/acm/contest/view-submission?submissionId=51232571)