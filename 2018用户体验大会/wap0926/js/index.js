/*
* author:
* date: 9/28/18
* desc:
*/

$(function () {
    var utils = {

        loadImages: function (sources, callback) {
            sources = sources || [];
            var count = 0,
                images = {},
                src,
                imgNum = sources.length;

            for (var i = 0; i < imgNum; i++) {
                var temp = sources[i];
                src = './images/' + temp;
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
    var Msize = $('.page').size(), //
        page_n = 1,			//
        initP = null,			//
        moveP = null,			//
        firstP = null,			//
        newM = 1,			//
        p_b = null,			//
        indexP = null, 		//
        move = null,			//
        start = true, 		//
        startM = null,			//
        position = null,			//
        DNmove = false,		//
        mapS = null,			//
        canmove = false,		//
        textNode = [],			//
        mousedown = null,
        textInt = 1;			//


    /*
     **
     */
    var v_w = null;		//

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


    //
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

            if (start || startM) {
                startM = true;
                if (e.type == 'touchmove') {
                    moveP = window.event.touches[0].pageY;
                } else {
                    if (mousedown) moveP = e.Y || e.pageY;
                }
                page_n == 1 ? indexP = false : indexP = true;	//
            }

            if (moveP && startM) {

                if (!p_b) {
                    p_b = true;
                    position = moveP - initP > 0 ? true : false;	//
                    if (position) {

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
                        if (page_n != Msize) {
                            newM = page_n + 1;
                        } else {
                            move = false;
                            return;
                        }
                        $('.page').eq(newM - 1).addClass('active').css('top', v_w);
                        move = true;
                    }
                }

                if (!DNmove) {
                    if (move) {
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

            startM = null;
            p_b = false;
            var move_p;
            position ? move_p = moveP - firstP > 100 : move_p = firstP - moveP > 100;
            if (move) {
                if (move_p && Math.abs(moveP) > 5) {
                    $('.page').eq(newM - 1).animate({'top': 0}, 300, 'easeOutSine', function () {

                        changeSuccess();
                    });
                } else if (Math.abs(moveP) >= 5) {
                    position ? $('.page').eq(newM - 1).animate({'top': -v_w}, 100, 'easeOutSine') : $('.page').eq(newM - 1).animate({'top': v_w}, 100, 'easeOutSine');
                    $('.page').eq(newM - 1).removeClass('active');
                    start = true;
                }
            }

            initP = null,			//
                moveP = null,			//
                firstP = null,			//
                mousedown = null;			//
        });
    };


    function changeClose(e) {
        $('.page').off('mousedown touchstart');
        $('.page').off('mousemove touchmove');
        $('.page').off('mouseup touchend mouseout');
    }


    function shink(pageNum) {
        $('.page').eq(newM - 1).removeClass('show active').addClass('hide');
        $('.page').eq(pageNum).removeClass('hide').addClass('show');
        newM = pageNum + 1;
        page_n = pageNum + 1;

        //
        $('.page').each(function (k, v) {
            $('.next-page').toggle(k !== page_n - 1);
        });
    }

    function changeSuccess() {
        /*
         **
         */
        var thisPage = $('.page').eq(newM - 1);

        $('.page').eq(page_n - 1).removeClass('show active').addClass('hide');
        thisPage.removeClass('active hide').addClass('show');
        //
        page_n = newM;
        start = true;


        //
        $('.page').each(function (k, v) {
            $('.next-page').toggle(k !== page_n - 1);
        });
    }

    // binding events end
    init_pageH();

    //
    changeOpen();
    //
    var img1 = ['caojinhua.png', 'chenyan.png', 'guweijia.png', 'chenjibo.png', 'fanling.png', 'lixin.png', 'jiangxiao.png', 'huangshenshang.png'];
    var img2 = ['yufeng.png', 'ciensi.png', 'chenxinxin.png', 'yinjuan.png', 'suixinyuan.png', 'shenlei.png', 'luoting.png', 'juping.png', 'gaoyan.png'];
    var img3 = ['home-bg1.png', 'home-body.png', 'home-btn.png', 'home-logo.png', 'home-logo-footer.png', 'home-title.png'];
    var img4 = ['icon-suning.png', 'icon-ued.png', 'intro-title-icon.png'];
    var img5 = ['next-page.png', 'page-bg1.png', 'page-bg2.png', 'q-cord.png'];
    var img6 = ['signup-success-icon.png', 'tyjb-bg.png', 'tyjb-people.png', 'huigu.png'];
    img1 = img1.concat(img2, img3, img4, img5, img6);

    var $loadDiv = $('.page-loading');
    var $pageHome = $('.page-home');
    var $nextDiv = $('.next-page');

    //
    utils.loadImages(img1, function (loadSize, allSize, percent) {
        if (percent == 1) {
            $loadDiv.hide();
            $pageHome.show();
            $nextDiv.show();
        }
    });

    // 去报名按钮
    $('.go-signup').off('click').on('click', function () {
        shink(13)
    });
});


$(function () {
    function errorHide() {
        setTimeout(function () {
            $('.error-info').animate({'display': 'none'}, "slow")
        }, 1500);
    }

//    手机号验证
    function checkPhone(phone) {
        var phone = phone;
        if (!(/^1[345789]\d{9}$/.test(phone))) {
            errorHide();
            return false;
        }
    }

//    邮箱验证
    function checkEmail(email) {
        var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
        if (!re.test(email)) {
            errorHide();
            return false;
        }
    }


    $('.page-signup-btn').off('click').on('click', function () {
        var $errorInfo = $('.error-info');
        if ($('.signup-name').val() == "") {
            $errorInfo.show().text('请填写姓名');
            errorHide();
            return false;
        }
        if ($('.signup-company').val() == "") {
            $errorInfo.show().text('请填写公司/工号');
            errorHide();
            return false;
        }
        if ($('.signup-duty').val() == "") {
            $errorInfo.show().text('请填写职务');
            errorHide();
            return false;
        }
        if (checkPhone($('.signup-phoneNum').val()) === false) {
            $errorInfo.show().text('手机号码有误，请重填');
            return false;
        }
        if (checkEmail($('.signup-email').val()) === false) {
            $errorInfo.show().text('邮箱有误，请重填');
            return false;
        }
        var jsonT = JSON.stringify({
            root: [
                {name: "公司", value: $('.signup-company').val()},
                {name: "邮箱", value: $('.signup-email').val()},
                {name: "职务", value: $('.signup-duty').val()},
                {name: "工号", value: $('.signup-num').val()}
            ]
        });
        var signUpItem = {
            activityId: 390,
            name: $('.signup-name').val(),
            mobileNumber: $('.signup-phoneNum').val(),
            jsonField: jsonT
        };

        $.ajax({
            type: "get",
            url: "http://qrs.suning.com/qrs-web/activityqrcode/signupForJsonp.htm",
            dataType: "jsonp",
            data: signUpItem,
            success: function (data) {
                $('.do-signup').hide();
                $('.page-signup-success').show();
            },
            error: function (data) {
                $('.do-signup').hide();
                $('.page-signup-success').show();
            }
        });
    });
});
