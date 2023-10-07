---
tags: blog
categories: misc
title: teXt主题下-key的重设&leancloud转国际版
---

## Key 的重设

### 由来

由于长时间没有进行更新博客，并且打算迁移一下近期题解，所以我更改以前的博客，于是乎现在的样子就是最终的结果。

在配置的时候我曾遇到过几个不太好用的地方，其中最突出的就是它所使用的评论系统与访问量的设置。

按照作者的设置，我们成功设置了这些东西。

不过作者放在文档中的方法似乎有些不太好用。

![image-20220405180351407](https://s2.loli.net/2022/04/05/zl1xQ4U7Z8TRI6v.png)

而 `key` 的值如下

![image-20220405180619954](https://s2.loli.net/2022/04/05/wkgWZGA6FT5qiBv.png)

如果每篇文章都需要我们手动设置的话那么对我们来说，特别是批量导入的人来说，这是极为不方便的。

### 修改

我们不妨根据 `jekyll` 网站的生成规则自己定义一个可能不随着博客的改变的 `key` 

首先唯一确定的东西有哪些呢？

我们考虑网址，对于我们的博客来说，它是唯一的，如果我们有两个重复的地址，那么我们将无法定义该页面显示的东西是什么。

那么因此，我们不妨用网站的 `url` 去代替对应的 `key` 。

于是我们开始着手寻找，对于原来的仓库，我们可以定位到如下几个用到页面上的 `key` 的地方。

1. [jekyll-TeXt-theme/post.html](https://github.com/kitian616/jekyll-TeXt-theme/blob/master/_includes/pageview-providers/leancloud/post.html#L8)
2. [jekyll-TeXt-theme/post.html](https://github.com/kitian616/jekyll-TeXt-theme/blob/master/_includes/pageview-providers/leancloud/post.html#L23)
3. [jekyll-TeXt-theme/post.html](https://github.com/kitian616/jekyll-TeXt-theme/blob/master/_includes/pageview-providers/leancloud/post.html#L26)
3. [jekyll-TeXt-theme/article-info.html](https://github.com/kitian616/jekyll-TeXt-theme/blob/master/_includes/article-info.html#L74)

我们将上面出现的 `page.key` 全部更换为 `page.url` 为了符合规则我做了一点点的别的改变.

将上面两个网址中，自己仓库中相应位置的文件修改过来即可。

[Real-king-Ph.GitHub.io/post.html](https://github.com/Real-king-Ph/Real-king-Ph.GitHub.io/blob/master/_includes/pageview-providers/leancloud/post.html) 这个文件覆盖即可，如果修改过可以用[文本对比](https://kmcha.com/text-compare)查看。

另外一个由于我已经转移至 [waline](https://waline.js.org/)，因此提供下面的解决办法。

{% raw %}

```text
_includes/article-info.html :
	L74 { { include.article.key } } --> {{ include.article.url | replace:'/' ,'s'}}
```

{% endraw %}  


如果不了解产生了什么变化，可以参考[LIQUID文档](https://liquid.bootcss.com/filters/replace/)

然后我们再次刷新，我们的访问量就有变化了。

值得注意的是，作者自己写了一个`LazyLoad`。因此，访问量需要加载一下才行。

## leancloud转至国际版

### 由来

[未办理备案接入的域名将于 4 月限制访问 - 新闻公告 - LeanCloud 用户社区](https://forum.leancloud.cn/t/topic/25129)

由于我并没有任何的 ip ，并且短期内不打算去设置独立ip并备案。

因此我不得不将 leancloud 转移至国际版。

为此我查阅了一些博客，发现大多数的解决方案都是在 `hexo` 的博客框架上的，而且很大一部分还都是特定的主题 `NexT` 。所以打算记录一下该如何改变。

### 操作

首先第一步，在leancloud的左上角，我们将华北/东的改为国际版

![leancloud_left_up](https://s2.loli.net/2022/04/05/XrYPo2UcSnCTiEm.png)

然后我们重新注册一个账户(不同地区账号不互通)，重新按照文档的步骤进行设置。

首先根据github中的 [issue](https://github.com/xCss/Valine/issues/340) 我们发现我们需要进行下述的设置



{% highlight yml linenos %}

serverURLs: https://xxxxxxxx.api.lncldglobal.com # 把xxxxxxxx替换成你自己AppID的前8位字符

{% endhighlight %}

我们进入leancloud中然后进入下述的页面

![image-20220405183326155](https://s2.loli.net/2022/04/05/WmN4pBMeLHCykhV.png)

然后我们在**服务器地址**中就可以找到这个设置了

然后我们在 `valine` 的[官方手册](https://valine.js.org/configuration.html)中我们发现配置的基本方法。

首先我们有



{% highlight html linones %}


<!-- 方法 1 -->
<script>
    new Valine({
        el:'#vcomment',
        appId: 'Your appId',
        appKey: 'Your appKey'
    })
</script>

<!-- 方法 2 -->
<script>
    var valine = new Valine();
    valine.init({
        el:'#vcomment',
        appId: 'Your appId',
        appKey: 'Your appKey'
    })
</script>


{% endhighlight %}

我们开始着手去寻找，我们的主题在哪个地方使用了类似的东西。

[jekyll-TeXt-theme/valine.html](https://github.com/kitian616/jekyll-TeXt-theme/blob/master/_includes/comments-providers/valine.html#L42)

我们发现信息恰好就在 `_config` 中，然后我们将我们上面得到的东西添加进去。

{% highlight javascript %}
var _config = {
    el: '#vcomments' , 
    ...
    serverURLs: 'https://xxxxxxxx.api.lncldglobal.com'
}
{% endhighlight %}

然后我们再次刷新就可以用国际版进行 `comment` 了

其中参数用法[参阅](https://valine.js.org/configuration.html#serverURLs)

对于如何改变viewer 我们也用同样的方法。

这个viewer可能是主题作者写的，我们在文件文件中搜索我们的参数 `serverURLs` 

[jekyll-TeXt-theme/leancloud.js](https://github.com/kitian616/jekyll-TeXt-theme/blob/master/_includes/pageview-providers/leancloud/leancloud.js#L16)

在这个地方我们也改为我们需要的地址即可。

至此我们的修改就已经完成了。

有什么问题可以反映在评论区哦😘。





