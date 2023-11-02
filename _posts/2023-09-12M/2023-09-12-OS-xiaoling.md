---
date: "2023-09-12 17:24:00 +0800"
title: "小林coding 图解操作系统"
last_modified_at: "2023-09-13 20:31:04"
tags: ["OS" , "操作系统" , "八股"]
---

[ ] TODO

------

## 二、硬件结构

### 2.1 CPU是如何执行程序的？

![CPU执行指令](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost2/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/%E7%A8%8B%E5%BA%8F%E6%89%A7%E8%A1%8C/%E6%8C%87%E4%BB%A4%E5%91%A8%E6%9C%9F%E5%B7%A5%E4%BD%9C%E7%BB%84%E4%BB%B6.png)

## 2.2 磁盘比内存慢几万倍

## 三、操作系统结构

### 4.1 Linux 内核 VS windows 内核

计算机是由各种外部硬件设备组成的，比如内存、cpu、硬盘等，如果每个应用都要和这些硬件设备对接通信协议，那这样太累了，所以这个中间人就由内核来负责，**让内核作为应用连接硬件设备的桥梁**，应用程序只需关心与内核交互，不用关心硬件的细节。

![nehe](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/%E5%86%85%E6%A0%B8/Kernel_Layout.png)

现代操作系统的内核一般提供 4 个基本能力

- 管理进程、线程，决定哪个进程、线程使用 CPU，也就是进程调度的能力；
- 管理内存，决定内存的分配和回收，也就是内存管理的能力；
- 管理硬件设备，为进程与硬件设备之间提供通信能力，也就是硬件通信能力；
- 提供系统调用，如果应用程序要运行更高权限运行的服务，那么就需要有系统调用，它是用户程序与操作系统之间的接口。

通常来说内核具有比较高的权限，可以控制CPU、内存、硬盘等硬件通常操作系统会被分为两个区域

- 内核空间，只有内核程序可以访问
- 用户空间，提供给应用程序使用

## 四、内存管理

### 4.1 为什么要有虚拟内存

#### 虚拟内存

操作系统引入了虚拟内存，进程持有的虚拟地址会通过 CPU 芯片中的内存管理单元（MMU）的映射关系，来转换变成物理地址，然后再通过物理地址访问内存，如下图所示：

![](https://cdn.xiaolincoding.com//mysql/other/72ab76ba697e470b8ceb14d5fc5688d9.png)

#### 内存分段

不同的段是由不同的属性，用分段的形式将这些段分离出来。

分段机制下，虚拟地址由两部分组成，**段选择因子**和**段内偏移量**。

![](https://cdn.xiaolincoding.com//mysql/other/a9ed979e2ed8414f9828767592aadc21.png)



分段的办法也有不足之处

- 内存碎片
- 内存交换的效率低

#### 内存分页

![](https://cdn.xiaolincoding.com//mysql/other/08a8e315fedc4a858060db5cb4a654af.png)

在使用的过程中，我们只需要换出不常用的，换入需要用的，就可以提升内存的交换效率。更进一步的，**只有在程序运行中，需要用到对应虚拟内存也里面的指令和数据是，再加载到物理内存里去**。

![](https://cdn.xiaolincoding.com//mysql/other/388a29f45fe947e5a49240e4eff13538-20230309234651917.png)

分页对应的映射

![](https://cdn.xiaolincoding.com//mysql/other/7884f4d8db4949f7a5bb4bbd0f452609.png)

##### 多级页表

![](https://cdn.xiaolincoding.com//mysql/other/19296e249b2240c29f9c52be70f611d5.png)

现代六十四位处理系统一般采用四级目录。

##### TLB

由于局部性原理，我们会在短时间内大量访问同一段内的指令。
