---
layout: article
tmp_tag: true
title: NEFU_Cpp_MyString
sitemap: false
---

> NEFU C++ 选修课作业

DeAD_Line!!! 2022-05-07  
编程实现仿`string`类设计的字符串类`MyString`，并自行设计测试该类功能的示例程序。

> ```text
> using formalstr = MyString
> formalstr --> 
>              | char 
>              | string 
>              | const char * 
>              | const string
>              | MyString
>              | const MyString
> ```
>
---

github: <https://github.com/Real-king-Ph/NEFU_Cpp_MyString>  
gitee: <https://gitee.com/RKnFish/NEFU_Cpp_MyString>  
NEFU_Gitea: <http://10.181.194.51:3000/rk_gitea/NEFU_Cpp_MyString>

TODO:

- [x] 构造函数
  - [x] `MyString()`
  - [x] `MyString(formalstr)`
  - [x] `MyString(numb , formalstr)`
  - [x] `MyString(formalstr, start, length)`

- [x] 对 `MyString` 对象赋值
  - [x] `= formalstr`
- [x] 求字符串的长度
  - [x] `length()`
  - [x] `size()`
- [x] `MyString` 对象中字符串的连接
  - [x] `+ formalstr`
  - [x] `+= formalstr`
  - [x] `append(formalstr)`

- [x] `MyString` 对象的比较
  - [x] `<` is okay
  - [x] `compare(formalstr)`
  - [x] `compare(start1, len1, formalstr)`
  - [x] `compare(start1, len1, formalstr, start2, len2)`
  - [x] `compare(formalstr, start2, len2)`
- [x] 求 `MyString` 对象的子串
  - [x] `substr(start)`
  - [x] `substr(start , size)`
- [x] 交换两个`MyString`对象的内容
  - [x] `swap(MyString&)`
- [x] 查找子串和字符
  - [x] `find(formalstr, start)`
  - [x] `rfind(formalstr, start)`
  - [x] `find_first_of(formalstr, start)`
  - [x] `find_last_of(formalstr, start)`
  - [x] `find_first_not_of(formalstr, start)`
  - [x] `find_last_not_of(formalstr, start)`
  - [x] ✖️ 以上均有两个重载 `(formalstr[, start])`  
- [x] 替换子串
  - [x] `replace(origional_formalstr, after_formalstr)`
  - [x] `replace(start1, size1, formalstr)`
  - [x] `replace(start1, size1, times, formalstr)`
  - [x] `replace(start1, size1, times, formalstr, start2, size2)`
- [x] 删除子串
  - [x] `erase(formalstr)`
  - [x] `erase(start, end)`
  - [x] `erase(start)`
- [x] 插入字符串
  - [x] `insert(start, formalstr)`
  - [x] `insert(start, number, formalstr)`
- [ ] 将 `MyString` 对象作为流处理(选做)
  - [ ] `CLASS iMyStringstream`
  - [ ] `CLASS oMyStringstream`

---

1. 构造函数

   `MyString` 类有多个构造函数，用法示例如下：

   ```yaml
   MyString s1()              : si = ""
   MyString s2("Hello")       : s2 = "Hello"
   MyString s3(4, 'K')        : s3 = "KKKK"
   MyString s4("12345", 1, 3) : s4 = "234"，即 "12345" 的从下标 1 开始，长度为 3 的子串
   ```

2. 对 `MyString` 对象赋值
    可以用 `char*` 类型的变量、常量，以及 `char` 类型的变量、常量对 `MyString` 对象进行赋值。例如：

    ```cpp
    MyString s1;
    s1 = "Hello";  // s1 = "Hello"
    s2 = 'K';      // s2 = "K”
    ```

    `MyString` 类还有 `assign` 成员函数，可以用来对 `MyString` 对象赋值。 `assign` 成员函数返回对象自身的引用。例如：

    ```cpp
    MyString s1("12345"), s2;
    s3.assign(s1);             // s3 = s1
    s2.assign(s1, 1, 2);       // s2 = "23"，即 s1 的子串(1, 2)
    s2.assign(4, 'K');         // s2 = "KKKK"
    s2.assign("abcde", 2, 3);  // s2 = "cde"，即 "abcde" 的子串(2, 3)
    ```

3. 求字符串的长度
`length` 成员函数返回字符串的长度。size 成员函数可以实现同样的功能。

4. `MyString` 对象中字符串的连接

   除了可以使用`+`和`+=`运算符对 `MyString` 对象执行字符串的连接操作外，`MyString` 类还有 `append` 成员函数，可以用来向字符串后面添加内容。`append` 成员函数返回对象自身的引用。例如：

   ```cpp
   MyString s1("123"), s2("abc");
   s1.append(s2);             // s1 = "123abc"
   s1.append(s2, 1, 2);       // s1 = "123abcbc"
   s1.append(3, 'K');         // s1 = "123abcbcKKK"
   s1.append("ABCDE", 2, 3);  // s1 = "123abcbcKKKCDE"，
                              // 添加 "ABCDE" 的子串(2, 3)
   ```

5. `MyString` 对象的比较

   除了可以用 `<, <=, ==, !=, >=, >` 运算符比较 `MyString` 对象外，`MyString` 类还有 `compare` 成员函数，可用于比较字符串。`compare` 成员函数有以下返回值：

   - 小于 0 表示当前的字符串小；
   - 等于 0 表示两个字符串相等；
   - 大于 0 表示另一个字符串小。

   例如：

   ```cpp
   MyString s1("hello"), s2("hello, world");
   int n = s1.compare(s2);
   n = s1.compare(1, 2, s2, 0, 3);       //比较s1的子串 (1,2) 和s2的子串 (0,3)
   n = s1.compare(0, 2, s2);             // 比较s1的子串 (0,2) 和 s2
   n = s1.compare("Hello");
   n = s1.compare(1, 2, "Hello");        //比较 s1 的子串(1,2)和"Hello”
   n = s1.compare(1, 2, "Hello", 1, 2);  //比较 s1 的子串(1,2)和 "Hello" 的子串(1,2)
   ```

6. 求 `MyString` 对象的子串

   `substr` 成员函数可以用于求子串 `(n, m)`，原型如下：

   ```cpp
   MyString substr(int n = 0, int m = MyString::npos) const;
   ```

   调用时，如果省略 m 或 m 超过了字符串的长度，则求出来的子串就是从下标 n 开始一直到字符串结束的部分。例如：

   ```cpp
   MyString s1 = "this is ok";
   MyString s2 = s1.substr(2, 4);  // s2 = "is i"
   s2 = s1.substr(2);              // s2 = "is is ok"
   ```

7. 交换两个`MyString`对象的内容

   `swap` 成员函数可以交换两个 `MyString` 对象的内容。例如：

   ```cpp
   MyString s1("West”), s2("East");
   s1.swap(s2);  // s1 = "East"，s2 = "West"
   ```

8. 查找子串和字符

   `MyString` 类有一些查找子串和字符的成员函数，它们的返回值都是子串或字符在 `MyString` 对象字符串中的位置（即下标）。如果查不到，则返回 `MyString::npos`。`MyString: :npos` 是在 `MyString` 类中定义的一个静态常量。这些函数如下：

   ~~~yml
   find              : 从前往后查找子串或字符出现的位置。
   rfind             : 从后往前查找子串或字符出现的位置。
   find_first_of     : |
                       从前往后查找何处出现另一个字符串中包含的字符。
                       例如  
                       s1.find_first_of("abc");  
                       //查找s1中第一次出现"abc"中任一字符的位置
   find_last_of      : 从后往前查找何处出现另一个字符串中包含的字符。
   find_first_not_of : 从前往后查找何处出现另一个字符串中没有包含的字符。
   find_last_not_of  : 从后往前查找何处出现另一个字符串中没有包含的字符。 
   ~~~

   下面是 MyString 类的查找成员函数的示例程序。

   ```cpp
   #include <iostream>
   #include <MyString.h>
   using namespace std;
   int main()
   {
       MyString s1("Source Code");
       int n;
       if ((n = s1.find('u')) != MyString::npos)              // 查找 u 出现的位置
           cout << "1) " << n << "," << s1.substr(n) << endl; // 输出 l)2,urce Code
       if ((n = s1.find("Source", 3)) == MyString::npos)      // 从下标3开始查找"Source"，找不到
           cout << "2) " << "Not Found" << endl;              // 输出 2) Not Found
       if ((n = s1.find("Co")) != MyString::npos)             // 查找子串"Co"。能找到，返回"Co"的位置
           cout << "3) " << n << ", " << s1.substr(n) << endl;// 输出 3) 7, Code
       if ((n = s1.find_first_of("ceo")) != MyString::npos)   // 查找第一次出现或 'c'、'e'或'o'的位置
           cout << "4) " << n << ", " << s1.substr(n) << endl;// 输出 4) l, ource Code
       if ((n = s1.find_last_of('e')) != MyString::npos)      // 查找最后一个 'e' 的位置
           cout << "5) " << n << ", " << s1.substr(n) << endl;// 输出 5) 10, e
       if ((n = s1.find_first_not_of("eou", 1)) 
            !=   MyString::npos)                               // 从下标1开始查找第一次出现非
                                                               // 'e'、'o' 或 'u' 字符的位置
           cout << "6) " << n << ", " << s1.substr(n) << endl; // 输出 6) 3, rce Code
       return 0;
   }
   ```

9. 替换子串

   `replace` 成员函数可以对 `MyString` 对象中的子串进行替换，返回值为对象自身的引用。例如：

   ```cpp
   MyString s1("Real Steel");
   s1.replace(1, 3, "123456", 2, 4);  // 用 "123456" 的子串(2,4)
                                      // 替换 s1 的子串(1,3)
   cout << s1 << endl;                // 输出 R3456 Steel
   MyString s2("Harry Potter");
   s2.replace(2, 3, 5, '0');  // 用 5 个 '0' 替换子串(2,3)
   cout << s2 << endl;        // 输出 Ha00000 Potter
   int n = s2.find("00000");  // 查找子串 "00000" 的位置，n=2
   s2.replace(n, 5, "XXX");   // 将子串(n,5)替换为"XXX"
   cout << s2 << endl;        // 输出 HaXXX Potter
   ```

10. 删除子串

    `erase` 成员函数可以删除 `MyString` 对象中的子串，返回值为对象自身的引用。例如：

    ```cpp
    MyString s1("Real Steel");
    s1.erase(1, 3);  //删除子串(1, 3)，此后 s1 = "R Steel"
    s1.erase(5);     //删除下标5及其后面的所有字符，此后 s1 = "R Ste"
    ```

11. 插入字符串

    `insert` 成员函数可以在 `MyString` 对象中插入另一个字符串，返回值为对象自身的引用。例如：

    ```cpp
    MyString s1("Limitless"), s2("00");
    s1.insert(2, "123");   //在下标 2 处插入字符串"123"，s1 = "Li123mitless"
    s1.insert(3, s2);      //在下标 2 处插入 s2 , s1 = "Li10023mitless"
    s1.insert(3, 5, 'X');  //在下标 3 处插入 5 个 'X'，s1 = "Li1XXXXX0023mitless"
    ```

12. 将 `MyString` 对象作为流处理(选做)

     编程实现类`iMyStringstream` 和 `oMyStringstream`，可以将 `MyString` 对象当作一个流进行输入输出。

     示例程序如下：

    ```cpp
    #include <iostream>
    #include <MyStringstream.h>
    #include <MyString.h>
    using namespace std;
    int main()
    {
        MyString src("Avatar 123 5.2 Titanic K");
        iMyStringstream istrStream(src); //建立src到istrStream的联系
        MyString s1, s2;
        int n;  double d;  char c;
        istrStream >> s1 >> n >> d >> s2 >> c; //把src的内容当做输入流进行读取
        oMyStringstream ostrStream;
        ostrStream << s1 << endl << s2 << endl << n << endl << d << endl << c <<endl;
        cout << ostrStream.str();
        return 0;
    }
    ```

    程序的输出结果是：

    ```text
    Avatar
    Titanic
    123
    5.2
    K
    ```

    第 11 行，从输入流 istrStream 进行读取，过程和从 cin 读取一样，只不过输入的来源由键盘变成了 MyString 对  象 src。因此，"Avatar" 被读取到 s1，123 被读取到 n，5.2 被读取到 d，"Titanic" 被读取到s2，'K' 被读取 到 c。
    第 12 行，将变量的值输出到流 ostrStream。输出结果不会出现在屏幕上，而是被保存在 ostrStream 对象管理的某  处。用 oMyStringstream 类的 str 成员函数能将输出到 oMyStringstream 对象中的内容提取出来。
