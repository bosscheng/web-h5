/**
 * date: 2018/4/29
 * author:
 * desc:
 */

$(function () {


    var utils = {
        // ����ͼƬ
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
    var Msize = $('.page').size(), //ҳ�����Ŀ
        page_n = 1,			//��ʼҳ��λ��
        initP = null,			//��ֵ����ֵ
        moveP = null,			//ÿ�λ�ȡ����ֵ
        firstP = null,			//��һ�λ�ȡ��ֵ
        newM = 1,			//���¼��صĸ���
        p_b = null,			//�������ֵ
        indexP = null, 		//������ҳ����ֱ����ת�����һҳ
        move = null,			//�����ܻ���ҳ��
        start = true, 		//���ƶ�����ʼ
        startM = null,			//��ʼ�ƶ�
        position = null,			//����ֵ
        DNmove = false,		//������������ҳ���л�
        mapS = null,			//��ͼ����ֵ
        canmove = false,		//��ҳ�������һҳ
        textNode = [],			//�ı�����
        mousedown = null,
        textInt = 1;			//�ı�����˳��


    /*
     ** ��ҳ�л� ����Ԫ��fixed ����body�߶�
     */
    var v_w = null;		//��¼�豸�ĸ߶�

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


    //���¼�
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
            //�ж��Ƿ�ʼ�������ƶ��л�ȡֵ
            if (start || startM) {
                startM = true;
                if (e.type == 'touchmove') {
                    moveP = window.event.touches[0].pageY;
                } else {
                    if (mousedown) moveP = e.Y || e.pageY;
                }
                page_n == 1 ? indexP = false : indexP = true;	//true Ϊ���ǵ�һҳ falseΪ��һҳ
            }

            //����һ��ҳ�濪ʼ�ƶ�
            if (moveP && startM) {

                //�жϷ�����һ��ҳ����ֿ�ʼ�ƶ�
                if (!p_b) {
                    p_b = true;
                    position = moveP - initP > 0 ? true : false;	//true Ϊ���»��� false Ϊ���ϻ���
                    if (position) {

                        //�����ƶ�
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
                        //�����ƶ�d
                        if (page_n != Msize) {
                            newM = page_n + 1;
                        } else {
                            // ��ֹѭ���Ϸ�
                            move = false;
                            return;
                        }
                        $('.page').eq(newM - 1).addClass('active').css('top', v_w);
                        move = true;
                    }
                }

                //�����ƶ�����ҳ���ֵ
                if (!DNmove) {
                    //��������ҳ�滬��
                    if (move) {
                        //�ƶ�������ҳ���ֵ��top��
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
            //��������ҳ��
            startM = null;
            p_b = false;
            //�ж��ƶ��ķ���
            var move_p;
            position ? move_p = moveP - firstP > 100 : move_p = firstP - moveP > 100;
            if (move) {
                //�л�ҳ��(�ƶ��ɹ�)
                if (move_p && Math.abs(moveP) > 5) {
                    $('.page').eq(newM - 1).animate({'top': 0}, 300, 'easeOutSine', function () {
                        /*
                         ** �л��ɹ��ص��ĺ���
                         */
                        success();
                    });
                    //����ҳ��(�ƶ�ʧ��)
                } else if (Math.abs(moveP) >= 5) {	//ҳ���˻�ȥ
                    position ? $('.page').eq(newM - 1).animate({'top': -v_w}, 100, 'easeOutSine') : $('.page').eq(newM - 1).animate({'top': v_w}, 100, 'easeOutSine');
                    $('.page').eq(newM - 1).removeClass('active');
                    start = true;
                }
            }
            /* ��ʼ��ֵ */
            initP = null,			//��ֵ����ֵ
                moveP = null,			//ÿ�λ�ȡ����ֵ
                firstP = null,			//��һ�λ�ȡ��ֵ
                mousedown = null;			//ȡ����갴�µĿ���ֵ
        });
    };

    //ȡ�����¼�
    function changeClose(e) {
        $('.page').off('mousedown touchstart');
        $('.page').off('mousemove touchmove');
        $('.page').off('mouseup touchend mouseout');
    }


    function success() {
        /*
         ** �л��ɹ��ص��ĺ���
         */
        var thisPage = $('.page').eq(newM - 1);
        //����ҳ��ĳ���
        $('.page').eq(page_n - 1).removeClass('show active').addClass('hide');
        thisPage.removeClass('active hide').addClass('show');
        //��������ҳ���ƶ��Ŀ���ֵ
        page_n = newM;
        start = true;


        //��������ҳ��Բ��Ԫ��
        $('.page').each(function (k, v) {
            $('.next-page').toggle(k !== page_n - 1);
        });
    }

    // binding events end
    init_pageH();

    //�����¼��󶨻���
    changeOpen();
    // �������ض���Ч����
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

    // ����ͼƬ��Դ
    utils.loadImages(img1, function (loadSize, allSize, percent) {
        if (percent == 1) {
            $loadDiv.hide();
            $pageHome.show();
            $nextDiv.show();
        }
    })
});
