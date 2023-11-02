---
layout: article

title: "Lecture #06: Memory Management"
date: "2023-10-23 11:10:55 +08:00"
last_modified_at : "2023-10-30 20:58:31 +08:00"
tags:
 [
    "数据库",
    "CMU15-445"
 ]
categories: 
 [
   "CMU15-445"
 ]    

# 写作插件
mathjax: false
chart: false
mermaid: false
---

[<i class="fa-solid fa-link"></i> Tracker](/cmu15-445/2023/10/02/CMU-Project-Tracker.html){:.button.button--outline-secondary.button--pill}

TODO: <https://youtu.be/Y9H2HaRKOIw?list=PLSE8ODhjZXjaKScG3l0nuOiDTTqpfnWFf&t=1141>

## 1. Introduction

如何存储：

- 我们的 pages 要存储在 disk 上的什么样的地方


快速操作：

- 对于 DBMS 来说，在进行操作数据之前需要将所有的的数据从 Disk 先转移到 Memory 中才可以进行操作。
  
  <blockquote class="imgur-embed-pub" lang="en" data-id="Fb6bfcD"><a href="https://imgur.com/Fb6bfcD">View post on imgur.com</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>

<blockquote class="imgur-embed-pub" lang="en" data-id="x6oYq9T"><a href="https://imgur.com/x6oYq9T">View post on imgur.com</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>

----

## 2. Locks vs. Latches

<blockquote class="imgur-embed-pub" lang="en" data-id="YG9cxAA"><a href="https://imgur.com/YG9cxAA">View post on imgur.com</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>

----


## 3. Buffer Pool

Memory 中存储的是一个个固定大小的 pages。

其中的每一个记录称之为 *frame*

当我们需要一个 page 的时候，我们会立刻复制一个 frame。

Dirty pages 不会立刻写回。(Write-Back Cache)

<blockquote class="imgur-embed-pub" lang="en" data-id="zYv4D0C"><a href="https://imgur.com/zYv4D0C">View post on imgur.com</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>

### Buffer Pool Meta-data

<blockquote class="imgur-embed-pub" lang="en" data-id="vRnMHx4"><a href="https://imgur.com/vRnMHx4">View post on imgur.com</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>

_page table_ 是用来跟踪哪些 pages 在 memory 中。

通常还有一些信息也会被保存在 page table 中
- Dirty Flag
- Pin/Reference Counter

Dirty Flag 用来表示这个页是否被写过。

Pin/Reference Counter 是用来固定 frame 来确保该页面不会被放回到 disk 中。


> **page directory** 是一个将 page id 映射到 page location 的一个映射。所有信息必须存放在 disk 上，以便 DBMS 可以找到
>
> **page table** 是一个将 page id 映射到 buffer pool 中的帧上的映射。这是一个 in-memory 的数据结构不需要存储在 disk 上。

### Memory Allocation Policies

----

## 4. Buffer Pool Optimizations



### Multiple Buffer Pools

### Pre-fetching

### Scan Sharing(Synchornized Scans)

### Buffer Pool Bypass

----

## 5. OS Page Cache


----


## 6. Buffer Replacement Policies


----

