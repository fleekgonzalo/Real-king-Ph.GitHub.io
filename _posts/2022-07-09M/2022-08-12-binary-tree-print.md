---
title: "二叉树打印模板"
data: "2022-08-12 20:35:19"
last_modified_at: "2022-08-12 20:35:22"
tags: [Splay]
categories: [algorithm , ACM_template]
---

该代码仅作为赛时模板使用，为了方便调试信息，以反转区间为例。

```cpp
#include <iomanip>
#include <iostream>
#include <vector>
using namespace std;

const int N = 1e5 + 10;

struct Node {
   int val;
   int son[2], par;
   int sz;
   int tag;

   void init(int v, int p) {
      val = v;
      par = p;
      son[0] = son[1] = 0;
      sz = 1;
      tag = 0;
   }
} Tree[N];

void upd_size(int x) {
   Tree[x].sz = 1 + Tree[Tree[x].son[0]].sz + Tree[Tree[x].son[1]].sz;
}

int root = 0, id = 0;

void _rotate(int x) {
   int y = Tree[x].par;
   int z = Tree[y].par;

   int d = Tree[y].son[1] == x;

   Tree[y].son[d] = Tree[x].son[d ^ 1];
   Tree[x].son[d ^ 1] = y;
   if (z) Tree[z].son[Tree[z].son[1] == y] = x;

   Tree[Tree[y].son[d]].par = y;
   Tree[y].par = x;
   Tree[x].par = z;

   upd_size(y);
   upd_size(x);
}

int lflg[N], rflg[N];

void print_list(int now, int val) {
   switch (now) {
      case 1:
         cout << "val:";
         if (val < 0)
            cout << "-inf";
         else if (val > 1e7)
            cout << " inf";
         else
            cout << fixed << right << setw(4) << val;
         break;

      case 2:
         cout << "tag:";
         cout << fixed << right << setw(4) << val;
         break;

      default:
         cout << "";
         break;
   }
}

void print_branch(int dep, pair<int, int> square) {
   auto [x, y] = square;
   for (int row = 1; row <= x; row++) {
      for (int column = 1; column <= dep; column++) {
         for (int i = 1; i < y; i++) cout << ' ';
         cout << " |"[(rflg[column] && lflg[column + 1]) ||
                      (lflg[column] && rflg[column + 1]) ||
                      (column == dep)];
      }
      cout << '\n';
   }
}

void print_val(int dep, pair<int, int> square, vector<int> val) {
   auto [x, y] = square;
   for (int row = 1; row <= x; row++) {
      for (int column = 1; column < dep; column++) {
         for (int i = 1; i < y; i++) cout << ' ';
         cout << " |"[(rflg[column] && lflg[column + 1]) ||
                      (lflg[column] && rflg[column + 1])];
      }

      for (int i = 0; i < y; i++) cout << '-';
      print_list(row, val[row - 1]);
      cout << '\n';
   }
}

void pt_tree(int cur, pair<int, int> square, int dep = 1) {
   if (cur == 0) return;
   lflg[dep] = 1;
   pt_tree(Tree[cur].son[1], square, dep + 1);
   if (Tree[cur].son[1]) print_branch(dep, square);
   rflg[dep] = 1;
   print_val(dep, square, {Tree[cur].val, Tree[cur].tag});
   lflg[dep] = 0;
   if (Tree[cur].son[0]) print_branch(dep, square);
   pt_tree(Tree[cur].son[0], square, dep + 1);
   rflg[dep] = 0;
}

void push_down(int p) {
   if (Tree[p].tag) {
      Tree[Tree[p].son[0]].tag ^= 1;
      Tree[Tree[p].son[1]].tag ^= 1;
      Tree[p].tag = 0;
      swap(Tree[p].son[0], Tree[p].son[1]);
   }
}

void splay(int cur, int tar) {
   while (Tree[cur].par != tar) {
      push_down(cur);
      int cop = Tree[cur].par, cgp = Tree[cop].par;
      if (cgp != tar)
         if ((Tree[cgp].son[0] == cop) == (Tree[cop].son[0] == cur))
            _rotate(cop);
         else
            _rotate(cur);
      _rotate(cur);
   }

   if (tar == 0) root = cur;
}

void insert(int x) {
   int cur = root, par = 0;
   while (cur) {
      push_down(cur);
      par = cur;
      cur = Tree[cur].son[x > Tree[cur].val];
   }
   id++;
   Tree[id].init(x, par);
   Tree[par].son[x > Tree[par].val] = id;
   splay(id, 0);
}

int find(int sz) {
   int cur = root, par = 0;
   while (sz) {
      push_down(cur);
      par = cur;
      int t = Tree[Tree[cur].son[0]].sz + 1;
      if (sz == t) return cur;
      cur = Tree[cur].son[sz > t];
      if (sz > t) sz -= t;
   }
   return 0;
}

void reverse(int l, int r) {
   l = find(l - 1);
   splay(l, 0);
   r = find(r + 1);
   splay(r, l);

   Tree[Tree[r].son[0]].tag ^= 1;
   splay(Tree[r].son[0], 0);

   pt_tree(root, {2, 6});
}

void print(int cur) {
   if (cur == 0) return;
   push_down(cur);
   print(Tree[cur].son[0]);
   if (Tree[cur].val > 0 && Tree[cur].val < 1e7)
      cout << Tree[cur].val << ' ';
   print(Tree[cur].son[1]);
}

int main() {
   int n, m;
   cin >> n >> m;
   insert(-1e9);
   insert(1e9);

   for (int i = 1; i <= n; i++) insert(i);

   while (m--) {
      int l, r;
      cin >> l >> r;
      reverse(l + 1, r + 1);
   }

   print(root);

   return 0;
}
```