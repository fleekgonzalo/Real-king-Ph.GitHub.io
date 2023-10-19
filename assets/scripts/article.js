(function () {
  var SOURCES = window.TEXT_VARIABLES.sources;
  window.Lazyload.js(SOURCES.jquery, function () {
    $(function () {
      var $this, $scroll;
      var $articleContent = $('.js-article-content');
      var hasSidebar = $('.js-page-root').hasClass('layout--page--sidebar');
      var scroll = hasSidebar ? '.js-page-main' : 'html, body';
      $scroll = $(scroll);

      $articleContent.find('.highlight').each(function () {
        $this = $(this);
        $this.attr('data-lang', $this.find('code').attr('data-lang'));
      });
      $articleContent.find('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').each(function () {
        $this = $(this);
        $this.append($('<a class="anchor d-print-none" aria-hidden="true"></a>').html('<i class="fas fa-anchor"></i>'));
      });
      $articleContent.on('click', '.anchor', function () {
        $scroll.scrollToAnchor('#' + $(this).parent().attr('id'), 400);
      });
    });

    $(function () {
      // ----------------  
      // back to top
      // When to show the scroll link
      // higher number = scroll link appears further down the page   
      var upperLimit = 500;

      // Our scroll link element
      var scrollElem = $('#totop');
      var scrollElemA = $('#totop_a');

      // Scroll to top speed
      var scrollSpeed = 500;

      // Show and hide the scroll to top link based on scroll position   
      scrollElem.hide();
      $(window).scroll(function () {
        var scrollTop = $(document).scrollTop();
        if (scrollTop > upperLimit) {
          $(scrollElem).stop().fadeTo(300, 1); // fade back in           
        } else {
          $(scrollElem).stop().fadeTo(300, 0); // fade out
        }
      });
      // Scroll to top animation on click
      $(scrollElem).click(function () {
        $('html, body').animate({ scrollTop: 0 }, scrollSpeed); return false;
      });
      // ----------------
    });
  });
})();
