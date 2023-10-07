---
layout: article
title: Linux 阶段测试实验报告
tmp_tag: true
mathjax: true
sitemap: false
---

## 目的

1. 掌握 linux 的系统安装
2. linux 命令行测试
3. 远程连接

## 环境信息

### wsl

在 windows 的 powershell 输入 `sysinfo` 的信息，仅展示重要信息。

| 栏目             | 信息                                                         |
| ---------------- | ------------------------------------------------------------ |
| OS 名称          | Microsoft Windows 11 家庭中文版                              |
| OS 版本          | 10.0.22000 暂缺 Build 22000                                  |
| OS 制造商        | Microsoft Corporation                                        |
| OS 配置          | 独立工作站                                                   |
| OS 构建类型      | Multiprocessor Free                                          |
| 系统制造商       | LENOVO                                                       |
| 系统型号         | 82LM                                                         |
| 系统类型         | x64-based PC                                                 |
| 处理器           | 安装了 1 个处理器。<br/>[01]:AMD64 Family 23 Model 104 Stepping 1 AuthenticAMD ~2100 Mhz |
| BIOS 版本        | LENOVO G5CN58WW(V2.04), 2021/10/26                           |
| 物理内存总量     | 15,706 MB                                                    |
| 可用的物理内存   | 6,964 MB                                                     |
| 虚拟内存: 最大值 | 23,520 MB                                                    |
| 虚拟内存: 可用   | 11,370 MB                                                    |
| 虚拟内存: 使用中 | 12,150 MB                                                    |
| 修补程序         | 安装了 4 个修补程序。<br/>[01]: KB5012121<br/>                [02]: KB5004567<br/>[03]: KB5012592<br/>[04]: KB5011650 |

---

### Ubuntu

![Linux 基本配置信息](https://s2.loli.net/2022/05/05/4IhxCv85iF97Tuk.png)

## WSL2 的安装和简单的配置

首先在官方[^1]已经有十分详细的介绍了，请确保您的机器满足要求

不过在这里我还是简单的叙述一下。

[^1]: wsl2 安装官方文档 <https://docs.microsoft.com/zh-cn/windows/wsl/install>

### 安装系统

首先需要使用管理员权限打开 powershell 。按`win+x` 或者在win菜单上按右键。就可以看到这个选项。

然后在终端上依照下面输入对应的代码即可。

#### 一次都没装过

如果你之前一次都没有安装的话那么执行下面的语句就可以安装一个 linux 了

```powershell
# powershell
wsl --install
```

> 默认安装为 Ubunutu 版本的linux

❗ 如果您之前有安装过wsl，即使卸载掉的话，那么这条命令将不会生效。

#### 通用的装法

如果上一个步骤无效的话 或者直接按照下面的步骤安装

命令需要变成下面的格式

```powershell
# powershell
wsl --install -d <Distribution Name>
```

其中 `-d` 表示指定需要的发行版本

`<Distribution Name>` 表示的发行版本的具体名称。

获得 `<Distribution Name>` 可以下面的通过命令获得。

```powershell
#powershell
wsl --list --online
# wsl -l -o # 等同上句
```

执行之后我们得到一个列表。

```text
以下是可安装的有效分发的列表。
请使用“wsl --install -d <分发>”安装。

NAME            FRIENDLY NAME
Ubuntu          Ubuntu
Debian          Debian GNU/Linux
kali-linux      Kali Linux Rolling
openSUSE-42     openSUSE Leap 42
SLES-12         SUSE Linux Enterprise Server v12
Ubuntu-16.04    Ubuntu 16.04 LTS
Ubuntu-18.04    Ubuntu 18.04 LTS
Ubuntu-20.04    Ubuntu 20.04 LTS
```

至于何种版本请自行选择

个人采用的是 `wsl --install -d Ubuntu`

我们输入完上面的信息之后，等待安装完成。

之后会要求我们重启电脑。

![安装](https://s2.loli.net/2022/05/02/Gzs36a58mSH2uZp.png)

### 可能出现的问题

如果你的电脑出现了这样的问题

![wsl](https://s2.loli.net/2022/05/02/sXcBngiJtIkj2oy.png)

在图片中的链接中就有相关的解决办法[^2]

[^2]: wsl 出现内核老旧的解决办法 <https://aka.ms/wsl2kernel>

下载并安装内核更新包即可。

### 初始化系统

![success](https://s2.loli.net/2022/05/02/NAwLIx5KykShF2Z.png)

这是你的的用户名。

❗注意开头字母不可以用大写字母

然后输入你的密码即可。

![成功](https://s2.loli.net/2022/05/02/5GyZ2Vzq7gLlnPE.png)

如果到这个界面就说明成功了。

如果官方的apt源更新过慢的话可以尝试下面的方法进行更换源。

#### 更换国内源

这里采用清华大学的源请按照镜像站点的帮助指南进行配置[^3]

[^3]: 清华大学镜像站 <https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/>

##### 查看Linux发行版本

首先查看自己的版本信息

```bash
# lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 20.04 LTS
Release:        20.04
Codename:       focal
```

可以看到我的版本是 `Ubuntu 20.04 LTS`

那么依照清华大学镜像站点中的信息进行编辑。

##### 创建源文件

首先我们在 windows 的桌面新建一个文件 `sources.list.txt`

![sources.list.txt](https://s2.loli.net/2022/05/02/4nzVPqoO93wvXZ6.png)

然后把清华大学镜像apt代码复制进去

```bash
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse

# 预发布软件源，不建议启用
# deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
```

##### 备份

执行下面的代码将ubuntu官方的源进行备份，方便改回来。

```bash
#bash 
cd /etc/apt/
sudo cp sources.list sources.list.bak
```

##### 覆盖

然后我们将我们windows桌面的`sources.list.txt`拷贝过来。

```bash
#bash
sudo cp /mnt/c/Users/RKnFish/Desktop/sources.list.txt /etc/apt/sources.list
# ~~~~~~~~~~~~~~~~~~~~~^ 请填上你自己的 windwos 用户名
```

然后查看是否成功了。

```bash
#bash 
cat /etc/apt/sources.list
```

如果和清华镜像站点中的代码一致就说明可以了。

##### 执行

最后执行

```bash
# bash
sudo apt-get update # 更新源
```

> 如果出现下面的问题[^f1]
> [^f1]: Linux apt 证书过期 <https://www.zhangbj.com/p/1023.html>
>
> ```text
> Ign:1 https://mirrors.tuna.tsinghua.edu.cn/ubuntu focal InRelease
> Ign:2 https://mirrors.tuna.tsinghua.edu.cn/ubuntu focal-updates InRelease
> Ign:3 https://mirrors.tuna.tsinghua.edu.cn/ubuntu focal-backports InRelease
> Ign:4 https://mirrors.tuna.tsinghua.edu.cn/ubuntu focal-security InRelease
> Err:5 https://mirrors.tuna.tsinghua.edu.cn/ubuntu focal Release
>   Certificate verification failed: The certificate is NOT trusted. The certificate chain uses expired certificate.  Could not handshake: Error in the certificate verification. [IP: 101.6.15.130 443]
> Err:6 https://mirrors.tuna.tsinghua.edu.cn/ubuntu focal-updates Release
>   Certificate verification failed: The certificate is NOT trusted. The certificate chain uses expired certificate.  Could not handshake: Error in the certificate verification. [IP: 101.6.15.130 443]
> Err:7 https://mirrors.tuna.tsinghua.edu.cn/ubuntu focal-backports Release
>   Certificate verification failed: The certificate is NOT trusted. The certificate chain uses expired certificate.  Could not handshake: Error in the certificate verification. [IP: 101.6.15.130 443]
> Err:8 https://mirrors.tuna.tsinghua.edu.cn/ubuntu focal-security Release
>   Certificate verification failed: The certificate is NOT trusted. The certificate chain uses expired certificate.  Could not handshake: Error in the certificate verification. [IP: 101.6.15.130 443]
> Reading package lists... Done
> E: The repository 'https://mirrors.tuna.tsinghua.edu.cn/ubuntu focal Release' does not have a Release file.
> N: Updating from such a repository can't be done securely, and is therefore disabled by default.
> N: See apt-secure(8) manpage for repository creation and user configuration details.
> E: The repository 'https://mirrors.tuna.tsinghua.edu.cn/ubuntu focal-updates Release' does not have a Release file.
> N: Updating from such a repository can't be done securely, and is therefore disabled by default.
> N: See apt-secure(8) manpage for repository creation and user configuration details.
> E: The repository 'https://mirrors.tuna.tsinghua.edu.cn/ubuntu focal-backports Release' does not have a Release file.
> N: Updating from such a repository can't be done securely, and is therefore disabled by default.
> N: See apt-secure(8) manpage for repository creation and user configuration details.
> E: The repository 'https://mirrors.tuna.tsinghua.edu.cn/ubuntu focal-security Release' does not have a Release file.
> N: Updating from such a repository can't be done securely, and is therefore disabled by default.
> N: See apt-secure(8) manpage for repository creation and user configuration details.
> ```
>
> 这是因为出现了证书的问题。
>
> 这是因为 apt 源默认是 http 的。
>
> 执行下面的步骤即可。
>
> 1. 将所有的`https`修改为 `http`
>
>    然后执行 `sudo apt-get update`
>
>    我们发现已经可以正常运行了。
>
> 2. 安装证书
>
>    ```bash
>    sudo apt-get install --reinstall ca-certificates
>    ```
>
> 3. 将`http`改回`https` 然后再次更新即可

执行下面的命令，更新软件

```bash
sudo apt-get upgrade 
```

### 简单的测试

---

#### neovim 测试

- 前置软件 : git(默认已安装) , curl(默认已安装)

我平时使用的配置文件[^my_nvim]。

<https://blog.ohtoai.fun/assets/others/init.vim>

[^my_nvim]: 我的 neovim 配置 <https://blog.ohtoai.fun/assets/others/init.vim>

##### neovim 安装 + vim-plug 安装

执行`sudo apt-get install neovim`即可安装

vim-plug 官方[^vim_plug_offical]

[^vim_plug_offical]: vim-plug 官方<https://github.com/junegunn/vim-plug>

<https://github.com/junegunn/vim-plug>

官方给出的下载方式

```bash
sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs \
       https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
```

不出意外会超时。

两种解决办法。

1. 代理上网
2. 国内镜像

第一种方式由于本校并不提供相关资源，个人也提供不了，因此采用第二种方案。

好在国内gitee有镜像[^gitee_mirror_vim_plug]。

[^gitee_mirror_vim_plug]: vim-plug 在 gitee 的镜像 <https://gitee.com/liufawei/vim-plug>

<https://gitee.com/liufawei/vim-plug>

我们点进去，找到我们相关的东西

![mirror-of-vim-plug](https://s2.loli.net/2022/05/02/3blX65ONnac4RAd.png)

我们点击原始数据，然后我们将其网址代替掉原本的内容即可。

```bash
sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs \
       https://gitee.com/liufawei/vim-plug/raw/master/plug.vim'
```

这个时候，我们就有了 vim-plug 了。

neovim 的配置文件的目录是 `~/.config/nvim/init.vim`

所以我们需要创建，并将你(或者我的)配置放进去。

```bash
mkdir ~/.config/nvim/ -p
# mv /mnt/c/Users/RKnFish/Downloads/init.vim ~/.config/nvim/init.vim
# ~~~~~~~~~~~~~~~~~~^ 如果采用我的方案将此替换为你的 windows 用户名
```

然后输入 nvim 并进入，如果出现错误，那是因为部分配置没有下载下来，所以无法加载。

> 如果出现了 `XXXX ^M` 类似的错误[^xxx^^M]，可以通过如下的命令行修正
> [^xxx^^M]: dos-> unix <https://www.computerhope.com/unix/dos2unix.htm>
>
> 这是因为 windows 的换行和 linux 的换行字符不一样。
>
> ```bash
> sudo apt-get install dos2unix
> dos2unix <file>
> ```

在普通模式输入 `:PlugInstall` 并回车

![PlugInstall](https://s2.loli.net/2022/05/02/UKOSGXELuYd1pfF.png)

如果没猜错的话，这一步依然举步维艰。

![timeout](https://s2.loli.net/2022/05/02/q2CGmw9op1tyurz.png)

<https://ghproxy.com/> 随意寻找的github加速网址[^git_hub_faster]

[^git_hub_faster]: github 加速 <https://ghproxy.com/>

<https://github.com/hunshcn/gh-proxy> 也可以依照这个部署一下自己的加速站点[^github_faster_orgion]

[^github_faster_orgion]: 可部署的 github 加速 <https://github.com/hunshcn/gh-proxy>

我们用第一个网址中给出的方法进行加速，也就是将所有的 plug 改成`https://ghproxy.com/https://github.com/XXX/xxx` 的形式

![traing first](https://s2.loli.net/2022/05/02/MgZaREN2L3udpHe.png)

比刚才好多了。

不过我们再重复执行也无法安装上。因为我们再没有改变的时候就已经成功安装了，不过为了保持统一，我们需要先 `PlugClean` 。那么输入`:PlugClean` 再次重复上述步骤即可。

![success-installed](https://s2.loli.net/2022/05/02/2WYymsnLglVZSw9.png)

---

#### gcc/g++ 测试

gcc 就容易多了，因为不依赖外网。

##### 安装

```bash
sudo apt-get install gcc g++ 
```

##### 编译测试

由于我在 vim 中的配置中设置了映射，可以bash中执行下述代码重现现场

```bash
g++ <FILE>.cpp -o <FILE> -std=c++17
./<FILE> < data.in > data.out
cat data.out
# <FILE> 为文件名，即为下图的 a.cpp 中的 a
```

成功！🎉

![edit-success](https://s2.loli.net/2022/05/02/QYl2CWMjigXUFus.png)

## SSH 远程登录Linux 主机

相较于装系统远程登陆的任务似乎变得非常简单。

下面将举两个例子。

- 在本机的电脑上ssh 到 wsl 上
- 在教学楼 ssh 到宿舍的电脑上

---

### SSH 到 WSL

由于本人平时并不会连接到WSL上

所以该部分的内容来自[^remote_wsl]

[^remote_wsl]: 远程连接 wsl 教程原地址 <https://zhuanlan.zhihu.com/p/355748937>

<https://zhuanlan.zhihu.com/p/355748937>

#### 为WSL开启 ssh server

将 WSL 的ssh server重新安装

```bash
apt remove openssh-server  # 卸载
apt install openssh-server # 重装
```

#### 修改配置信息

编辑 `/etc/ssh/sshd_config`

执行 `sudo nvim /etc/ssh/sshd_config`

有以下几项需要修改

- `Port 2222`
- `PasswordAuthentication yes`
- `ListenAddress 0.0.0.0`

只需要在 vim 的普通模式下先输入 `/` 然后输入需要匹配的单词就能定位到，记得把行前的 `#` 删去

![Port 2222](https://s2.loli.net/2022/05/02/fEjUiCwqA5HW4nv.png)

![PasswordAuthentication](https://s2.loli.net/2022/05/02/YcVslRoib5BA7Qh.png)

然后输入 `:wq` 退出即可。

重启 ssh 服务

```bash
sudo service ssh restart
```

---

#### 本机连接

在powershell 中输入

```powershell
ssh <yourwslusername>@127.0.0.1 -p 2222
```

然后就可以连接你的 wsl 中。

> 为了增加辨识度，我在 .bashrc 中的最后一行加入了命令 neofetch

![ssh success](https://s2.loli.net/2022/05/03/QoMqR6zvBix3frI.png)

又或者我们可以通过 wsl 的 ip 地址进行连接。

先装 `net-tools`

然后再wsl 中输入

![getip](https://s2.loli.net/2022/05/02/aTtBnikIojWZvGR.png)

然后我们将 eth0 中的 inet第一串 ip 换掉原来的 `127.0.0.1` 即可。

然后同上

```bash
ssh <yourwslusername>@172.19.52.160 -p 2222
```

![ssh success 2](https://s2.loli.net/2022/05/02/9f3YGD4WAVjPebk.png)

远程连接具体远程连接可以到上面的链接学习。

### SSH 到宿舍的电脑上

由于我的舍友有一台暂时不用的电脑，被我们拿来当作了一个简单的服务器，用来存放一些服务。

和上面的操作基本一致

```bash
apt install openssh-server net-tools
```

然后输入 `ifconfig` 得到本机的 ip 地址。

然后在powershell 输入 `ssh <yourusername>@<youipaddr>`

如果设置了不是 22 端口则需要加参数 `-p <port>`

![success](https://s2.loli.net/2022/05/02/siVTQ3nCfHZGpY4.png)

另外手机上也是同样的。(软件为 `JuiceSSH`[^ssh_mobile])

[^ssh_mobile]: 手机上的 SSH 软件 <https://juicessh.com/>

其他设备同理。

| 编辑界面                                                    | 成功界面                                                   |
| ----------------------------------------------------------- | ---------------------------------------------------------- |
| ![link](https://s2.loli.net/2022/05/02/riyUKmRul7JGkAc.png) | ![suc](https://s2.loli.net/2022/05/02/YLlZvxrVksJuicj.png) |

## 总结

1. Linux 只需要按照官方执行步骤来即可。
2. 远程连接不管用什么都需要 `ssh xxx@xxx:xxxx`
3. 利用搜索引擎找到解决办法
4. 学会利用镜像 / 个人加速站点
