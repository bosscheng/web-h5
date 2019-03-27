/**
 * date: 2018/4/29
 * author: wancheng(17033234)
 * desc:
 */

$(function () {


    var utils = {
        // 加载图片
        loadImages: function (sources, callback) {
            sources = sources || [];
            var count = 0,
                images = {},
                src,
                imgNum = sources.length;

            for (var i = 0; i < imgNum; i++) {
                var temp = sources[i];
                src = './image/' + temp;
                images[temp] = new Image();
                images[temp].onload = function () {
                    count++;
                    callback(parseInt(count), parseInt(imgNum), parseFloat((parseInt(count) / parseInt(imgNum)), 2));
                };

                //
                images[temp].onerror = function () {

                };

                images[temp].src = src;
            }
        }
    };

    // binding  events start
    var Msize = $('.page').size(), //页面的数目
        page_n = 1,			//初始页面位置
        initP = null,			//初值控制值
        moveP = null,			//每次获取到的值
        firstP = null,			//第一次获取的值
        newM = 1,			//重新加载的浮层
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
        mousedown = null,
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
    };


    //绑定事件
    function changeOpen(e) {
        $('.page').on('mousedown touchstart', function (e) {
            if (e.type == 'touchstart') {
                initP = window.event.touches[0].pageY;
            } else {
                initP = e.Y || e.pageY;
                mousedown = true;
            }
            firstP = initP;
        });
        $('.page').on('mousemove touchmove', function (e) {
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
                            $('.page').eq(newM - 1).addClass('active').css('top', -v_w);
                            move = true;
                        } else {
                            if (canmove) {
                                move = true;
                                newM = Msize;
                                $('.page').eq(newM - 1).addClass('active').css('top', -v_w);
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
                        $('.page').eq(newM - 1).addClass('active').css('top', v_w);
                        move = true;
                    }
                }

                //根据移动设置页面的值
                if (!DNmove) {
                    //滑动带动页面滑动
                    if (move) {
                        //移动中设置页面的值（top）
                        start = false;
                        var topV = parseInt($('.page').eq(newM - 1).css('top'));
                        $('.page').eq(newM - 1).css({'top': topV + moveP - initP});
                        initP = moveP;
                    } else {
                        moveP = null;
                    }
                } else {
                    moveP = null;
                }
            }
        });

        $('.page').on('mouseup touchend mouseout', function (e) {
            //结束控制页面
            startM = null;
            p_b = false;
            //判断移动的方向
            var move_p;
            position ? move_p = moveP - firstP > 100 : move_p = firstP - moveP > 100;
            if (move) {
                //切画页面(移动成功)
                if (move_p && Math.abs(moveP) > 5) {
                    $('.page').eq(newM - 1).animate({'top': 0}, 300, 'easeOutSine', function () {
                        /*
                         ** 切换成功回调的函数
                         */
                        success();
                    });
                    //返回页面(移动失败)
                } else if (Math.abs(moveP) >= 5) {	//页面退回去
                    position ? $('.page').eq(newM - 1).animate({'top': -v_w}, 100, 'easeOutSine') : $('.page').eq(newM - 1).animate({'top': v_w}, 100, 'easeOutSine');
                    $('.page').eq(newM - 1).removeClass('active');
                    start = true;
                }
            }
            /* 初始化值 */
            initP = null,			//初值控制值
                moveP = null,			//每次获取到的值
                firstP = null,			//第一次获取的值
                mousedown = null;			//取消鼠标按下的控制值
        });
    };

    //取消绑定事件
    function changeClose(e) {
        $('.page').off('mousedown touchstart');
        $('.page').off('mousemove touchmove');
        $('.page').off('mouseup touchend mouseout');
    }


    function success() {
        /*
         ** 切换成功回调的函数
         */
        var thisPage = $('.page').eq(newM - 1);
        //设置页面的出现
        $('.page').eq(page_n - 1).removeClass('show active').addClass('hide');
        thisPage.removeClass('active hide').addClass('show');
        //重新设置页面移动的控制值
        page_n = newM;
        start = true;


        //隐藏其他页的圆和元素
        $('.page').each(function (k, v) {
            $('.next-page').toggle(k !== page_n - 1);
        });
    }

    // binding events end
    init_pageH();

    //开启事件绑定滑动
    changeOpen();
    // 开启加载动画效果。
    var img1 = ['head-pic-gw.png', 'head-pic-hj.png', 'head-pic-lx.png', 'head-pic-lyx.png', 'head-pic-wmq.png', 'head-pic-wp.png', 'head-pic-zqc.png'];
    var img2 = ['am.png', 'pm.png', 'guest-bg.png', 'guest-title.png', 'qcord.jpg', 'next-page.png', 'schedule-title.png', 'wrap-bg.jpg'];
    var img3 = ['home-box.png', 'home-line.png', 'home-logo.png'];
    var img4 = ['host-sub-title1.png', 'host-sub-title2.png', 'host-title.png'];
    var img5 = ['introduce-data.png', 'introduce-pic.png', 'introduce-title.png'];
    var img6 = ['review-pic-1.jpg', 'review-pic-2.jpg', 'review-pic-3.jpg', 'review-pic-4.jpg'];

    img1 = img1.concat(img2, img3, img4, img5, img6);

    var $loadDiv = $('.page-loading');
    var $pageHome = $('.page-home');
    var $nextDiv = $('.next-page');

    // 加载图片资源
    utils.loadImages(img1, function (loadSize, allSize, percent) {
        if (percent == 1) {
            $loadDiv.hide();
            $pageHome.show();
            $nextDiv.show();
        }
    })
});