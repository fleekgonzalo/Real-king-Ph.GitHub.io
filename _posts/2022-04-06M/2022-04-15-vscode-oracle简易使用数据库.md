---
title: vscode + oracle 简易使用数据库
tag:
 - vscode
 - SQL
---

> 由来：
>
> 由于数据库是一门十分重要的课程，计算机的数据基本都是由此系统而保管，顺应学校的教学，采用oracle数据库。
>
> 在电脑上折腾了一下 oracle Database ， 发现电脑的内存被吞了不少，并且成为了我计算机的常驻服务占用了部分的 CPU 略微影响到日常使用。
>
> 恰好学校服务器提供了一个不错的数据库系统，那么不妨利用这个作为我们学习使用的服务器

## 需要的物件

- 电脑 `?`{:.error}
- vscode + 学校的内网
- [官方文档](https://www.oracle.com/cn/database/technologies/appdev/dotnet/odtvscodequickstart.html)


### Vs Code 安装相应的工具

![image-20220415170416815](https://s2.loli.net/2022/04/15/35iRrvafjHUXq91.png)

在侧栏的拓展中搜索 oracle 并找到 Oracle Developer Tools for Vscode，点击安装即可，等待安装完成。

### 连接到数据库

安装完之后我们的 VScode 就多出来了一个图标 <i class="fa-solid fa-database"></i> 之后我们点击右上角的 + 

![image-20220415172126832](https://s2.loli.net/2022/04/15/Jt6qOsYieGDrRp7.png)

然后出现如下的界面

![image-20220415172209067](https://s2.loli.net/2022/04/15/yJfXG6YbEtpCUl5.png)



其中标注为 * 号的为必填符号。

有下列的信息我们需要填写

| Name               | Value                                |
| ------------------ | ------------------------------------ |
| Database host name | 123.123.123.123 (host 所在的 ip)     |
| Service name       | orcl (服务器的名字)                  |
| User name          | 你的用户名  (我校为S+学号)           |
| Password           | 密码   (我校为world文件中的默认密码) |
| Connection name    | 你选择连接的名字                     |


我的填写

![info](https://s2.loli.net/2022/04/15/32G7rhnYPio18dy.png)



然后进入之后，我们新建一个以 `.sql` 为结尾的文件，然后在其中写点语句用于测试。

以我校文档中的信息作为测试源

{% highlight sql %}
Create table Student
(Sno number(12) constraint PK_student primary key,
Sname char(8) not null unique,
Ssex char(2),
Sdept char(20),
Constraint ck_ss check (Ssex in ('男','女'))
);

Create table Course
(Cno number(4) constraint pk_course primary key,
Cname char(20),
Cpno number,
Ccredit number);

Create table SC
(Sno number(12),
 Cno number(4),
 Grade number,
 Constraint pk_SC Primary key (Sno,Cno),
 Constraint fk_s Foreign key (sno ) references student(Sno),
 Constraint fk_c Foreign key (cno ) references course(Cno)
);

 Alter table Student add Sage number not null;

Insert Into Student(Sno,Sname,Ssex,Sage,Sdept)
Values(200215121,'李勇','男',20,'CS');
Insert Into Student(Sno,Sname,Ssex,Sage,Sdept)
Values(200215122,'刘晨','女',19,'CS');
Insert Into Student(Sno,Sname,Ssex,Sage,Sdept)
Values(200215123,'王敏','女',18,'MA');
Insert Into Student(Sno,Sname,Ssex,Sage,Sdept)
Values(200215125,'张立进','男',22,'IS');

Insert Into Course(Cno,Cname, Cpno, Ccredit)
Values(1,'数据库',5,4);
Insert Into Course(Cno,Cname, Ccredit)
Values(2,'数学',2);
Insert Into Course(Cno,Cname,Cpno, Ccredit)
Values(3,'信息系统',1,4);
Insert Into Course(Cno,Cname,Cpno, Ccredit)
Values(4,'操作系统',6,3);
Insert Into Course(Cno,Cname,Cpno,Ccredit)
Values(5,'数据结构',7,4);
Insert Into Course(Cno,Cname,Ccredit)
Values(6,'数据处理',2);
Insert Into Course(Cno,Cname,Cpno,Ccredit)
Values(7,'PASCAL语言',6,4);

Insert Into SC(Sno,Cno, Grade)
Values(200215121,1,92);
Insert Into SC(Sno,Cno, Grade)
Values(200215121,2,85);
Insert Into SC(Sno,Cno, Grade)
Values(200215121,3,88);
Insert Into SC(Sno,Cno, Grade)
Values(200215122,2,90);
Insert Into SC(Sno,Cno, Grade)
Values(200215122,3,80);
{% endhighlight %}

在写完这些信息之后我们按 `F1` 然后输入 `connect`

![vscode](https://s2.loli.net/2022/04/15/cLhJHaU7gBrTCwN.png)

选择刚才填充的信息即可。

### 运行数据库

我们在 `.sql` 的目录下右键出现如下的菜单。

![m](https://s2.loli.net/2022/04/15/LpDc8bFEZdHXz2q.png)

`Ctrl+E` 是执行选中的那句话 `Ctrl+R` 是执行文件的全部。

这里我们选择全部执行，然后会弹出来全部代码的执行状况。

然后这个执行完毕之后，我们在看看，我们的数据是否被存储进去。

将文件中的代码全部清空加入下面的查询语句。

{% highlight sql %}
SELECT * FROM COURSE;

SELECT * FROM SC;

SELECT * FROM STUDENT;
{% endhighlight %}

同样按下 `Ctrl + R` 全部执行。

那么我们就得到下面的结构化存储数据了。

![image-20220415175131257](https://s2.loli.net/2022/04/15/jbI5HGBXYOtxnDu.png)

到这里我们就可以成功的用 vscode 连接到学校的数据库了。



如果在本机安装 Oracle Database 的话 host 请填写 `localhost` 或者 `127.0.0.1` 别的不变。
