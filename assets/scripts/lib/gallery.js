(function () {
  (function () {
    var SOURCES = window.TEXT_VARIABLES.sources;
    window.Lazyload.js(SOURCES.jquery, function () {
      function swiper(options) {
        var $window = $(window), $root = this, $swiperWrapper, $swiperSlides, $swiperButtonPrev, $swiperButtonNext,
          initialSlide, animation, onChange, onChangeEnd,
          rootWidth, count, preIndex, curIndex, translateX, CRITICAL_ANGLE = Math.PI / 3;

        function setOptions(options) {
          var _options = options || {};
          initialSlide = _options.initialSlide || 0;
          animation = _options.animation === undefined && true;
          onChange = onChange || _options.onChange;
          onChangeEnd = onChangeEnd || _options.onChangeEnd;
        }

        function init() {
          $swiperWrapper = $root.find('.swiper__wrapper');
          $swiperSlides = $root.find('.swiper__slide');
          $swiperButtonPrev = $root.find('.swiper__button--prev');
          $swiperButtonNext = $root.find('.swiper__button--next');
          animation && $swiperWrapper.addClass('swiper__wrapper--animation');
          calc(true);
        }

        function preCalc() {
          rootWidth = $root.width();
          count = $swiperWrapper.children('.swiper__slide').length;
          if (count < 2) {
            $swiperButtonPrev.addClass('d-none');
            $swiperButtonNext.addClass('d-none');
          }
          curIndex = initialSlide || 0;
          translateX = getTranslateXFromCurIndex();
        }

        var calc = (function () {
          var preAnimation, $swiperSlide, $preSwiperSlide;
          return function (needPreCalc, params) {
            needPreCalc && preCalc();
            var _animation = (params && params.animation !== undefined) ? params.animation : animation;
            if (preAnimation === undefined || preAnimation !== _animation) {
              preAnimation = _animation ? $swiperWrapper.addClass('swiper__wrapper--animation') :
                $swiperWrapper.removeClass('swiper__wrapper--animation');
            }
            if (preIndex !== curIndex) {
              ($preSwiperSlide = $swiperSlides.eq(preIndex)).removeClass('active');
              ($swiperSlide = $swiperSlides.eq(curIndex)).addClass('active');
              onChange && onChange(curIndex, $swiperSlides.eq(curIndex), $swiperSlide, $preSwiperSlide);
              if (onChangeEnd) {
                if (_animation) {
                  setTimeout(function () {
                    onChangeEnd(curIndex, $swiperSlides.eq(curIndex), $swiperSlide, $preSwiperSlide);
                  }, 400);
                } else {
                  onChangeEnd(curIndex, $swiperSlides.eq(curIndex), $swiperSlide, $preSwiperSlide);
                }
              }
              preIndex = curIndex;
            }
            $swiperWrapper.css('transform', 'translate(' + translateX + 'px, 0)');
            if (count > 1) {
              if (curIndex <= 0) {
                $swiperButtonPrev.addClass('disabled');
              } else {
                $swiperButtonPrev.removeClass('disabled');
              }
              if (curIndex >= count - 1) {
                $swiperButtonNext.addClass('disabled');
              } else {
                $swiperButtonNext.removeClass('disabled');
              }
            }
          };
        })();

        function getTranslateXFromCurIndex() {
          return curIndex <= 0 ? 0 : - rootWidth * curIndex;
        }

        function moveToIndex(index, params) {
          preIndex = curIndex;
          curIndex = index;
          translateX = getTranslateXFromCurIndex();
          calc(false, params);
        }

        function move(type) {
          var nextIndex = curIndex, unstableTranslateX;
          if (type === 'prev') {
            nextIndex > 0 && nextIndex--;
          } else if (type === 'next') {
            nextIndex < count - 1 && nextIndex++;
          }
          if (type === 'cur') {
            moveToIndex(curIndex, { animation: true });
            return;
          }
          unstableTranslateX = translateX % rootWidth !== 0;
          if (nextIndex !== curIndex || unstableTranslateX) {
            unstableTranslateX ? moveToIndex(nextIndex, { animation: true }) : moveToIndex(nextIndex);
          }
        }

        setOptions(options);
        init();
        preIndex = curIndex;

        $swiperButtonPrev.on('click', function (e) {
          e.stopPropagation();
          move('prev');
        });
        $swiperButtonNext.on('click', function (e) {
          e.stopPropagation();
          move('next');
        });
        $window.on('resize', function () {
          calc(true, { animation: false });
        });

        (function () {
          var pageX, pageY, velocityX, preTranslateX = translateX, timeStamp, touching;
          function handleTouchstart(e) {
            var point = e.touches ? e.touches[0] : e;
            pageX = point.pageX;
            pageY = point.pageY;
            velocityX = 0;
            preTranslateX = translateX;
          }
          function handleTouchmove(e) {
            if (e.touches && e.touches.length > 1) {
              return;
            }
            var point = e.touches ? e.touches[0] : e;
            var deltaX = point.pageX - pageX;
            var deltaY = point.pageY - pageY;
            velocityX = deltaX / (e.timeStamp - timeStamp);
            timeStamp = e.timeStamp;
            if (e.cancelable && Math.abs(Math.atan(deltaY / deltaX)) < CRITICAL_ANGLE) {
              touching = true;
              translateX += deltaX;
              calc(false, { animation: false });
            }
            pageX = point.pageX;
            pageY = point.pageY;
          }
          function handleTouchend() {
            touching = false;
            var deltaX = translateX - preTranslateX;
            var distance = deltaX + velocityX * rootWidth;
            if (Math.abs(distance) > rootWidth / 2) {
              distance > 0 ? move('prev') : move('next');
            } else {
              move('cur');
            }
          }
          $swiperWrapper.on('touchstart', handleTouchstart);
          $swiperWrapper.on('touchmove', handleTouchmove);
          $swiperWrapper.on('touchend', handleTouchend);
          $swiperWrapper.on('touchcancel', handleTouchend);

          (function () {
            var pressing = false, moved = false;
            $swiperWrapper.on('mousedown', function (e) {
              pressing = true; handleTouchstart(e);
            });
            $swiperWrapper.on('mousemove', function (e) {
              pressing && (e.preventDefault(), moved = true, handleTouchmove(e));
            });
            $swiperWrapper.on('mouseup', function (e) {
              pressing && (pressing = false, handleTouchend(e));
            });
            $swiperWrapper.on('mouseleave', function (e) {
              pressing && (pressing = false, handleTouchend(e));
            });
            $swiperWrapper.on('click', function (e) {
              moved && (e.stopPropagation(), moved = false);
            });
          })();

          $root.on('touchmove', function (e) {
            if (e.cancelable & touching) {
              e.preventDefault();
            }
          });
        })();

        return {
          setOptions: setOptions,
          previous: function () {
            move('prev');
          },
          next: function () {
            move('next');
          },
          refresh: function () {
            calc(true, { animation: false });
          }
        };
      }
      $.fn.swiper = swiper;
    });
  })();

  var SOURCES = window.TEXT_VARIABLES.sources;
  window.Lazyload.js(SOURCES.jquery, function () {
    var template =
      '<div class="swiper gallery__swiper">' +
      '<div class="swiper__wrapper">' +
      '</div>' +
      '<div class="swiper__button swiper__button--prev fas fa-chevron-left"></div>' +
      '<div class="swiper__button swiper__button--next fas fa-chevron-right"></div>' +
      '</div>';
    function setState($item, zoom, translate) {
      $item.css('transform', 'scale(' + zoom + ') translate(' + translate.x + 'px,' + translate.y + 'px)');
    }
    function Gallery(root, items) {
      this.$root = $(root);
      this.$swiper = null;
      this.$swiperWrapper = null;
      this.$activeItem = null;
      this.$items = [];
      this.contentWidth = 0;
      this.contentHeight = 0;
      this.swiper = null;
      this.items = items;
      this.disabled = false;
      this.curIndex = 0;
      this.touchCenter = null;
      this.lastTouchCenter = null;
      this.zoomRect = null;
      this.lastZoomRect = null;
      this.lastTranslate = null;
      this.translate = null;
      this.lastZoom = 1;
      this.preZoom = 1;
      this.zoom = 1;
    }
    Gallery.prototype.init = function () {
      var i, item, items = this.items, size, self = this, touchstartFingerCount = 0;
      this.$root.append(template);
      this.$swiper = this.$root.find('.gallery__swiper');
      this.$swiperWrapper = this.$root.find('.swiper__wrapper');
      this.contentWidth = this.$swiperWrapper && this.$swiperWrapper.width();
      this.contentHeight = this.$swiperWrapper && this.$swiperWrapper.height();
      for (i = 0; i < items.length; i++) {
        item = items[i];
        size = this._calculateImageSize(item.w, item.h);
        this.$items.push($(
          '<div class="swiper__slide">' +
          '<div class="gallery-item">' +
          '<div class="gallery-item__content">' +
          '<img src="' + item.src + '" style="width:' + size.w + 'px;height:' + size.h + 'px"/>' +
          '</div>' +
          '</div>' +
          '</div>'
        ));
      }
      this.$swiperWrapper && this.$swiperWrapper.append(this.$items);
      this.swiper = this.$swiper && this.$swiper.swiper({
        onChangeEnd: function () {
          self._handleChangeEnd.apply(self, Array.prototype.slice.call(arguments));
        }
      });
      $(window).on('resize', function () {
        if (self.disabled) { return; }
        self._resizeImageSize();
      });
      // Char Code: 37  ⬅, 39  ➡
      $(window).on('keyup', function (e) {
        if (window.isFormElement(e.target || e.srcElement) || self.disabled) { return; }
        if (e.which === 37) {
          self.swiper && self.swiper.previous();
        } else if (e.which === 39) {
          self.swiper && self.swiper.next();
        }
      });
      function getRect(touch0, touch1) {
        return {
          o: {
            x: (touch0.pageX + touch1.pageX) / 2,
            y: (touch0.pageY + touch1.pageY) / 2
          },
          w: Math.abs(touch0.pageX - touch1.pageX),
          h: Math.abs(touch0.pageY - touch1.pageY)
        };
      }
      function getTouches(e) {
        return e.touches || e;
      }
      function getTouchesCount(e) {
        if (e.touches) {
          return e.touches.length;
        } else {
          return 1;
        }
      }
      this.$swiperWrapper.on('touchstart', function (e) {
        var touch0, touch1, rect;
        touchstartFingerCount = getTouchesCount(e);
        if (touchstartFingerCount > 1) {
          touch0 = e.touches[0];
          touch1 = e.touches[1];
          rect = getRect(touch0, touch1);
          self.lastZoomRect = { w: rect.w, h: rect.h };
          self.lastTouchCenter = rect.o;
        } else {
          var touch = getTouches(e)[0];
          self.lastTouchCenter = { x: touch.pageX, y: touch.pageY };
        }
      });
      this.$swiperWrapper.on('touchmove', function (e) {
        if (touchstartFingerCount === getTouchesCount(e)) {
          if (touchstartFingerCount > 1) {
            var touch0 = e.touches[0];
            var touch1 = e.touches[1];
            var rect = getRect(touch0, touch1);
            self.zoomRect = { w: rect.w, h: rect.h };
            self.touchCenter = rect.o;
            self._zoom(); self._translate();
            setState(self.$activeItem, self.zoom, self.translate);
          } else {
            var touch = getTouches(e)[0];
            self.touchCenter = { x: touch.pageX, y: touch.pageY };
            self._translate();
            setState(self.$activeItem, self.zoom, self.translate);
          }
        }
      });
      this.$swiperWrapper.on('touchend', function (e) {
        self.lastZoom = self.zoom;
        self.lastTranslate = self.translate;
        touchstartFingerCount = 0;
      });
      this.$root.on('touchmove', function (e) {
        if (self.disabled) { return; }
        e.preventDefault();
      });
    };

    Gallery.prototype._translate = function () {
      this.translate = this.touchCenter && this.lastTouchCenter && this.lastTranslate ? {
        x: (this.touchCenter.x - this.lastTouchCenter.x) / this.zoom + this.lastTranslate.x,
        y: (this.touchCenter.y - this.lastTouchCenter.y) / this.zoom + this.lastTranslate.y
      } : { x: 0, y: 0 };
    }
    Gallery.prototype._zoom = function () {
      this.zoom = (this.zoomRect.w + this.zoomRect.h) / (this.lastZoomRect.w + this.lastZoomRect.h) * this.lastZoom;
      this.zoom > 1 ? this.$activeItem.addClass('zoom') : this.$activeItem.removeClass('zoom');
      this.preZoom = this.zoom;
    }

    Gallery.prototype._calculateImageSize = function (w, h) {
      var scale = 1;
      if (this.contentWidth > 0 && this.contentHeight > 0 && w > 0 && h > 0) {
        scale = Math.min(
          Math.min(w, this.contentWidth) / w,
          Math.min(h, this.contentHeight) / h);
      }
      return { w: Math.floor(w * scale), h: Math.floor(h * scale) };
    };

    Gallery.prototype._resizeImageSize = function () {
      var i, $item, $items = this.$items, item, size;
      this.contentWidth = this.$swiperWrapper && this.$swiperWrapper.width();
      this.contentHeight = this.$swiperWrapper && this.$swiperWrapper.height();
      if ($items.length < 1) { return; }
      for (i = 0; i < $items.length; i++) {
        item = this.items[i], $item = $items[i];
        size = this._calculateImageSize(item.w, item.h);
        item.width = size.w; item.height = size.h;
        $item && $item.find('img').css({ width: size.w, height: size.h });
      }
    };
    Gallery.prototype._handleChangeEnd = function (index, $dom, preIndex, $preDom) {
      this.curIndex = index;
      this.lastZoomRect = null; this.lastZoomRect = null;
      this.lastTranslate = this.translate = { x: 0, y: 0 };
      this.lastZoom = this.preZoom = this.zoom = 1;
      this.$activeItem = $dom.find('.gallery-item__content');
      setState($preDom.find('.gallery-item__content'), this.zoom, this.translate);
    };

    Gallery.prototype.refresh = function () {
      this.swiper && this.swiper.refresh();
      this._resizeImageSize();
    };
    Gallery.prototype.setOptions = function (options) {
      this.disabled = options.disabled;
      this.swiper && this.swiper.setOptions(options);
    };
    window.Gallery = Gallery;
  });
})();