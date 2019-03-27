/**
 *  音符漂浮插件
 */
(function ($, undefined) {
    var prefix = '', eventPrefix, endEventName, endAnimationName,
        vendors = {Webkit: 'webkit', Moz: '', O: 'o'},
        document = window.document, testEl = document.createElement('div'),
        supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
        transform,
        transitionProperty, transitionDuration, transitionTiming, transitionDelay,
        animationName, animationDuration, animationTiming, animationDelay,
        cssReset = {}

    function dasherize(str) {
        return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase()
    }

    function normalizeEvent(name) {
        return eventPrefix ? eventPrefix + name : name.toLowerCase()
    }

    $.each(vendors, function (vendor, event) {
        if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
            prefix = '-' + vendor.toLowerCase() + '-'
            eventPrefix = event
            return false
        }
    })

    transform = prefix + 'transform'
    cssReset[transitionProperty = prefix + 'transition-property'] =
    cssReset[transitionDuration = prefix + 'transition-duration'] =
    cssReset[transitionDelay = prefix + 'transition-delay'] =
    cssReset[transitionTiming = prefix + 'transition-timing-function'] =
    cssReset[animationName = prefix + 'animation-name'] =
    cssReset[animationDuration = prefix + 'animation-duration'] =
    cssReset[animationDelay = prefix + 'animation-delay'] =
    cssReset[animationTiming = prefix + 'animation-timing-function'] = ''

    $.fx = {
        off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
        speeds: {_default: 400, fast: 200, slow: 600},
        cssPrefix: prefix,
        transitionEnd: normalizeEvent('TransitionEnd'),
        animationEnd: normalizeEvent('AnimationEnd')
    }

    $.fn.animate = function (properties, duration, ease, callback, delay) {
        if ($.isFunction(duration))
            callback = duration, ease = undefined, duration = undefined
        if ($.isFunction(ease))
            callback = ease, ease = undefined
        if ($.isPlainObject(duration))
            ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
        if (duration) duration = (typeof duration == 'number' ? duration :
                ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
        if (delay) delay = parseFloat(delay) / 1000
        return this.anim(properties, duration, ease, callback, delay)
    }

    $.fn.anim = function (properties, duration, ease, callback, delay) {
        var key, cssValues = {}, cssProperties, transforms = '',
            that = this, wrappedCallback, endEvent = $.fx.transitionEnd,
            fired = false

        if (duration === undefined) duration = $.fx.speeds._default / 1000
        if (delay === undefined) delay = 0
        if ($.fx.off) duration = 0

        if (typeof properties == 'string') {
            // keyframe animation
            cssValues[animationName] = properties
            cssValues[animationDuration] = duration + 's'
            cssValues[animationDelay] = delay + 's'
            cssValues[animationTiming] = (ease || 'linear')
            endEvent = $.fx.animationEnd
        } else {
            cssProperties = []
            // CSS transitions
            for (key in properties)
                if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
                else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

            if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
            if (duration > 0 && typeof properties === 'object') {
                cssValues[transitionProperty] = cssProperties.join(', ')
                cssValues[transitionDuration] = duration + 's'
                cssValues[transitionDelay] = delay + 's'
                cssValues[transitionTiming] = (ease || 'linear')
            }
        }

        wrappedCallback = function (event) {
            if (typeof event !== 'undefined') {
                if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
                $(event.target).unbind(endEvent, wrappedCallback)
            } else
                $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout

            fired = true
            $(this).css(cssReset)
            callback && callback.call(this)
        }
        if (duration > 0) {
            this.bind(endEvent, wrappedCallback)
            // transitionEnd is not always firing on older Android phones
            // so make sure it gets fired
            setTimeout(function () {
                if (fired) return
                wrappedCallback.call(that)
            }, (duration * 1000) + 25)
        }

        // trigger page reflow so new elements can animate
        this.size() && this.get(0).clientLeft

        this.css(cssValues)

        if (duration <= 0) setTimeout(function () {
            that.each(function () {
                wrappedCallback.call(this)
            })
        }, 0)

        return this
    }

    testEl = null
})(Zepto)
Zepto(function ($) {
    function LoadImages(sources, callback) {
        var count = 0,
            images = {},
            imgNum = 0;
        for (src in sources) {
            imgNum++;
        }
        for (src in sources) {
            images[src] = new Image();
            images[src].onload = function () {
                if (++count >= imgNum) {
                    callback(images);
                }
            }
            images[src].src = sources[src];
        }
    }

    LoadImages([
        "image/background01.jpg",
        "image/background-02.jpg",
        "image/Group_5.png",
        "image/Group_6.png",
        "image/Group_15.png",
        "image/Group_16.png",
        "image/Group_17.png",
        "image/Group_18.png",
        "image/Group_19.png",
        "image/Group_20.png",
        "image/Group_21.png",
        "image/Group_22.png",
        "image/Group_23.png",
        "image/Group_25.png",
        "image/Group_26.png",
        "image/Group_27.png"
    ], function () {
        setTimeout(function () {
            $('.Rubik').addClass('fadeOut').hide();
            $('#M').addClass('fadeIn').show();
        }, 1000);
    });
    var Msize = $('.m-page').size(), //页面的数目
        page_n = 1,			//初始页面位置
        initP = null,			//初值控制值
        moveP = null,			//每次获取到的值
        firstP = null,			//第一次获取的值
        newM = null,			//重新加载的浮层
        p_b = null,			//方向控制值
        indexP = null, 		//控制首页不能直接找转到最后一页
        move = null,			//触摸能滑动页面
        start = true, 		//控制动画开始
        startM = null,			//开始移动
        position = null,			//方向值
        DNmove = false,		//其他操作不让页面切换
        mapS = null,			//地图变量值
        canmove = false,		//首页返回最后一页
        textNode = [],			//文本对象
        textInt = 1;			//文本对象顺序

    /*
     ** 单页切换 各个元素fixed 控制body高度
     */
    var v_w = null;		//记录设备的高度

    function init_pageH() {
        var fn_w = function () {
            if (document.compatMode == 'BackCompat')
                var Node = document.body;
            else
                var Node = document.documentElement;
            return Math.max(Node.scrollWidth, Node.clientWidth);
        }
        var fn_h = function () {
            if (document.compatMode == 'BackCompat')
                var Node = document.body;
            else
                var Node = document.documentElement;
            return Math.max(Node.scrollHeight, Node.clientHeight);
        }
        var page_w = fn_w();
        var page_h = fn_h();
        var m_h = $('.m-page').height();
        page_h >= m_h ? v_w = page_h : v_w = m_h;

        //设置各种模块页面的高度，扩展到整个屏幕高度
        $('.m-page').height(v_w);
        $('.p-index').height(v_w);

    };
    init_pageH();

    /*
     **模版切换页面的效果
     */
    //绑定事件
    function changeOpen(e) {
        $('.m-page').on('mousedown touchstart', page_touchstart);
        $('.m-page').on('mousemove touchmove', page_touchmove);
        $('.m-page').on('mouseup touchend mouseout', page_touchend);
    };

    //取消绑定事件
    function changeClose(e) {
        $('.m-page').off('mousedown touchstart');
        $('.m-page').off('mousemove touchmove');
        $('.m-page').off('mouseup touchend mouseout');
    };

    //开启事件绑定滑动
    changeOpen();

    function shink(pageNum) {
        $('.m-page').eq(newM-1).attr('class','m-page hide');
        $('.m-page').eq(pageNum).attr('class','m-page show');
        newM = pageNum+1;
        page_n = pageNum+1;
    }


    /* 音乐 */
    var musicHandle = $('.m-music');
    var audio = document.getElementById('J_audio');
    var audioFlag = 0;
    musicHandle.on('click', function () {
        audioFlag = 1;
        if ($(this).hasClass('m-play')) {
            audio.pause();
            $(this).removeClass('m-play');
            // $.fn.coffee.stop();
        } else {
            audio.play();
            $(this).addClass('m-play');
            // $.fn.coffee.start();
        }
    });

    //触摸（鼠标按下）开始函数
    function page_touchstart(e) {
        //播放音乐
        if (audioFlag == 0) {
            musicHandle.addClass('m-play');
            // $.fn.coffee.start();
        }
        if (e.type == 'touchstart') {
            initP = window.event.touches[0].pageY;
        } else {
            initP = e.Y || e.pageY;
            mousedown = true;
        }
        firstP = initP;
    };
    //触摸移动（鼠标移动）开始函数
    function page_touchmove(e) {
        e.preventDefault();
        e.stopPropagation();
        //判断是否开始或者在移动中获取值
        if (start || startM) {
            startM = true;
            if (e.type == 'touchmove') {
                moveP = window.event.touches[0].pageY;
            } else {
                if (mousedown) moveP = e.Y || e.pageY;
            }
            page_n == 1 ? indexP = false : indexP = true;	//true 为不是第一页 false为第一页
        }

        //设置一个页面开始移动
        if (moveP && startM) {

            //判断方向并让一个页面出现开始移动
            if (!p_b) {
                p_b = true;
                position = moveP - initP > 0 ? true : false;	//true 为向下滑动 false 为向上滑动
                if (position) {

                    //向下移动
                    if (indexP) {
                        newM = page_n - 1;
                        $('.m-page').eq(newM - 1).addClass('active').css('top', -v_w);
                        move = true;
                    } else {
                        if (canmove) {
                            move = true;
                            newM = Msize;
                            $('.m-page').eq(newM - 1).addClass('active').css('top', -v_w);
                        }
                        else move = false;
                    }

                } else {
                    //向上移动d
                    if (page_n != Msize) {
                        newM = page_n + 1;
                    } else {
                        // 禁止循环上翻
                        move = false;
                        return;
                    }
                    $('.m-page').eq(newM - 1).addClass('active').css('top', v_w);
                    move = true;
                }
            }

            //根据移动设置页面的值
            if (!DNmove) {
                //滑动带动页面滑动
                if (move) {
                    //移动中设置页面的值（top）
                    start = false;
                    var topV = parseInt($('.m-page').eq(newM - 1).css('top'));
                    $('.m-page').eq(newM - 1).css({'top': topV + moveP - initP});
                    initP = moveP;
                } else {
                    moveP = null;
                }
            } else {
                moveP = null;
            }
        }
    };

    //触摸结束（鼠标起来或者离开元素）开始函数
    function page_touchend(e) {
        //结束控制页面
        startM = null;
        p_b = false;
        //判断移动的方向
        var move_p;
        position ? move_p = moveP - firstP > 100 : move_p = firstP - moveP > 100;
        if (move) {
            //切画页面(移动成功)
            if (move_p && Math.abs(moveP) > 5) {
                $('.m-page').eq(newM - 1).animate({'top': 0}, 300, 'easeOutSine', function () {
                    /*
                     ** 切换成功回调的函数
                     */
                    success();
                })
                //返回页面(移动失败)
            } else if (Math.abs(moveP) >= 5) {	//页面退回去
                position ? $('.m-page').eq(newM - 1).animate({'top': -v_w}, 100, 'easeOutSine') : $('.m-page').eq(newM - 1).animate({'top': v_w}, 100, 'easeOutSine');
                $('.m-page').eq(newM - 1).removeClass('active');
                start = true;
            }
        }
        /* 初始化值 */
        initP = null,			//初值控制值
            moveP = null,			//每次获取到的值
            firstP = null,			//第一次获取的值
            mousedown = null;			//取消鼠标按下的控制值
    };
    /*
     ** 切换成功的函数
     */
    function success() {
        /*
         ** 切换成功回调的函数
         */
        var thisPage = $('.m-page').eq(newM - 1);
        //设置页面的出现
        $('.m-page').eq(page_n - 1).removeClass('show active').addClass('hide');
        thisPage.removeClass('active hide').addClass('show');
        setTimeout(function () {
            thisPage.find('.m-circle').show();
        }, 10);
        setTimeout(function () {
            thisPage.find('.J_hook').show();
        }, 200);
        //重新设置页面移动的控制值
        page_n = newM;
        start = true;
        //隐藏其他页的圆和元素
        $('.m-page').each(function (k, v) {
            if (k !== page_n - 1) {
                $(this).find('.J_hook').hide();
                $(this).find('.m-circle').hide();
            }
        });
    }

    function initPage() {
        //初始化一个页面
        $('.m-page').addClass('hide').eq(page_n - 1).addClass('show').removeClass('hide');
        setTimeout(function () {
            $('.m-page').eq(page_n - 1).find('.J_hook').show();
        }, 800)
        //PC端图片点击不产生拖拽
        $(document.body).find('img').on('mousedown', function (e) {
            e.preventDefault();
        })
        //调试图片的尺寸
        if (RegExp('iPhone').test(navigator.userAgent) || RegExp('iPod').test(navigator.userAgent) || RegExp('iPad').test(navigator.userAgent)) $('.m-page').css('height', '101%');
    }

    $('.shrinkLabel').off('click').on('click',function () {
        shink(13);
    });

    (initPage());

});