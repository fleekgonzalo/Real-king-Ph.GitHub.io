---
layout: article
title: Friend Links
---

hi, 欢迎交换友链。

如果您需要在这个页面展示的话，可以参照以下参数递交评论或者邮件。

{% highlight yaml linones %}
name:         RK's blog
url:          blog.ohtoai.fun
avatar:       https://blog.ohtoai.fun/assets/avater.png
discription:  Tech N Thought # (optional)
feed:         https://blog.ohtoai.fun/feed # (optional)
{% endhighlight %}

本站的友链刚建成不久，预计不久将会重构。

如果你的信息有`name`,`url`,`feed` 那么就会在下面的blogroll中找到，如果您的信息有 `name`,`url`,`avatar` 那么的就会在下面的卡片中展示，如果你的信息中有 `name` ,就可以再下面的列表中找到。

[Friend links](https://blogroll.rklittle.workers.dev/){:.button.button--secondary.button--pill}

特别的，本站不接受以转载内容为主的站点，与免费域名的站点。

明确的，不接受任何抄袭。

<div class="article-list grid grid--p-3">

{% for friend in site.data.friendlinks.friends %}
{%- if friend.avatar -%}
  <div class="cell cell--12 cell--md-4 cell--lg-3">
    <div class="card card--flat">
        <div class="card__image">
          <img class="image" src="{{ friend.avatar }}" alt="{{ friend.name }}"/>
          <div class="overlay overlay--bottom">
            <header>
              <a href="{{ friend.url }}">
                <i class="fa-solid fa-link"></i> {{ friend.name }}
              </a>
            </header>
          </div>
        </div>
    </div>
  </div>
{%- endif -%}
{% endfor %}
</div>

| name | discription | 
| ---- | ----------- | {% for friend in site.data.friendlinks.friends %}
| [{{ friend.name }}]({{ friend.url}} ) |  {{ friend.discription}} | {% endfor %}






