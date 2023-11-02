---
date: "2023-09-13 20:32:27"
title: "小林coding 图解计算机网络"
last_modified_at: "2023-09-13 20:32:27"
tags: ["八股" , "网络"]
---

[ ] TODO

-----

## 二、基础篇

### 2.1 TCP/IP 网络模型有哪几层？

#### 应用层

应用层只需要专注为用户提供应用功能，例如HTTP、FTP等。

应用层不会去关心如何传输

#### 传输层

传输层，为应用层提供网络支持，目前有两个传输协议，TCP 和 UDP。

TCP相较于UDP多了许多特性，例如 流量控制、超时重传、拥塞控制等。这些都是为了保证数据包能可靠的传输给对方。

#### 网络层

网络层主要确保可以将数据发送给另外一个设备

#### 网络接口层

负责两个直接相连的设备连接

#### 总结

![](https://s2.loli.net/2023/09/25/JYZdsStFG6IpL1b.png)

### 2.2 键入网址到网页显示，期间发生了什么？

#### HTTP

```
https://xiaolincoding.com/network/1_base/what_happen_url.html
|-1--|  |---2-----------| |--3-------------------------------|
```

![](https://s2.loli.net/2023/09/25/p19sEXfv4CoWmaN.jpg)

如果没有路径名称的时候就我们就需要先访问我们的**默认文件**，是`/index.html`或者`/default.html`这些文件。

在对`URL`完成解析之后，浏览器确定了 Web 服务器额文件名， 接下来就是根据这些信息生成 HTTP 请求的消息了。

![](https://s2.loli.net/2023/09/25/wG5rdVCse1PJqZA.png)

#### DNS

在发送http消息之前我们需要找寻到一个服**务器域名所对应的 IP 地址**。

域名是使用 `.` 来进行分割，越靠右层级越高。

例如 `www.xiaolingcoding.com.` 中，最后一个点代表了根域名。

 DNS解析可以看成如下图所述的过程。

![](https://s2.loli.net/2023/09/25/PyulZ7eSMjxO1Rk.png)



#### 协议栈

通过DNS服务器获取到IP之后就可以将 HTTP 所获的传输工作交给操作系统中的**协议栈**。

![](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/%E9%94%AE%E5%85%A5%E7%BD%91%E5%9D%80%E8%BF%87%E7%A8%8B/7.jpg)

在 IP 协议中还有两个协议 `ICMP` 和 `ARP` 协议

- `ICMP` 用于告知网络包传送过程中产生的错误以及各种控制信息。
- `ARP` 用于根据 IP 地址查询相应的以太网 MAC 地址。

#### TCP

#### IP

#### MAC

#### 网卡

#### 交换机



## 三、HTTP篇



### 3.1 HTTP 常见面试题

#### 强制缓存

强缓存指的是只要浏览器判断缓存没有过期，则直接使用浏览器的本地缓存，决定是否使用缓存的主动性在于浏览器这边。

