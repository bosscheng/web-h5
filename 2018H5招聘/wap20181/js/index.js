/**
 * date: 2018/1/17
 * author: wancheng(17033234)
 * desc:
 */


// 懒加载图片


$(function () {
    // page
    var $loading = $('#loading');
    var $main = $('#main');
    var $roleSelect = $('#roleSelect');
    var $roleInfo = $('#roleInfo');
    var $sharePage = $('#sharePage');
    var $formPage = $('#formPage');
    var $successPage = $('#successPage');
    var $errorTips = $('#errorTips');

    // btn
    var $backBtn = $('#doBack');
    var $shareBtn = $('#doShare');
    var $closeBtn = $('.do-close');
    var $music = $('#doMusic');


    var PAGE = {
        loading: "loading", // 加载中
        main: 'main', // main
        roleSelect: 'roleSelect', // 角色选择
        roleInfo: 'roleInfo', // 角色信息
        formPage: 'formPage', // 表单提交页面
        successPage: 'successPage' // 提交成功页面
    };

    //
    var ROLE = {
        chanpingjl: 'chanpingjl',
        qianduan: 'qianduan',
        android: 'android',
        ios: 'ios',
        shuju: 'shuju',
        java: 'java',
        test: 'test',
        jiaohu: 'jiaohu',
        shijue: 'shijue',
        jiagou: 'jiagou',
        jszj: 'jszj',
        chanpingzj: 'chanpingzj'
    };

    var ROLE_INFO = {
        chanpingjl: '产品经理',
        qianduan: '前端开发工程师',
        android: 'Android开发工程师',
        ios: 'IOS开发工程师',
        shuju: '大数据开发工程师',
        java: 'JAVA开发工程师',
        test: '软件测试工程师',
        jiaohu: '交互设计师',
        shijue: '视觉设计师',
        jiagou: '资深架构师',
        jszj: '技术总监',
        chanpingzj: '产品总监'
    };


    var _currentPage = PAGE.loading;
    // 默认产品经理
    var _selectRole = ROLE.chanpingjl;
    //
    var _submiting = false;

    var UA = navigator.userAgent.toLocaleLowerCase();

    var isIphone = !!(UA.match(/(iphone|ipod|ipad);?/i));

    var isWX = UA.indexOf("micromessenger") != -1;

    var utils = {
        loadImages: function (sources, callback) {
            sources = sources || [];
            var count = 0,
                images = {},
                src,
                imgNum = sources.length;

            for (var i = 0; i < imgNum; i++) {
                var temp = sources[i];
                src = './images/' + temp + '.png';
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


    function _showPage($page) {
        $('.wrapper').hide();
        _initPage();
        $page.show();
    }

    /*
     *  初始化数据
     *
     * */

    // 首页素材
    var mainList = ['main-bg', 'bg-share', 'main-title', 'main-title-inner', 'main-top', 'main-people', 'main-footer', 'main-button', 'fireworks'];
    // 角色选择
    var roleSelectList = ['sure-select', 'header-role-select', 'success-tips', 'sure-select'];
    //
    var imageList = ['common-header', 'fireworks', 'house-bg', 'icon-andriod-2', 'icon-qianduan-2', 'role-ability-content-bg', 'role-ability-tip1', 'role-ability-tip2', 'role-ability-tip3'];

    var headerRole = ['header-role-android', 'header-role-chanpingjl', 'header-role-chanpingzj', 'header-role-info', 'header-role-ios', 'header-role-java', 'header-role-jiagou', 'header-role-jiaohu', 'header-role-jszj', 'header-role-qianduan', 'header-role-select', 'header-role-shijue', 'header-role-shuju', 'header-role-test'];
    //
    var iconList = ['icon-cpjl', 'icon-qd', 'icon-andriod', 'icon-ios', 'icon-shuju', 'icon-java', 'icon-test', 'icon-jhsj', 'icon-shijue', 'icon-jiagou', 'icon-jszj', 'icon-cpzj'];
    //
    var iconBigList = ['icon-cpjl-big', 'icon-qd-big', 'icon-andriod-big', 'icon-ios-big', 'icon-shuju-big', 'icon-java-big', 'icon-test-big', 'icon-jhsj-big', 'icon-shijue-big', 'icon-jiagou-big', 'icon-jszj-big', 'icon-cpzj-big'];

    var iconBigBgList = ['icon-chanpingjl-big-bg', 'icon-qianduan-big-bg', 'icon-android-big-bg', 'icon-ios-big-bg', 'icon-shuju-big-bg', 'icon-java-big-bg', 'icon-test-big-bg', 'icon-jiaohu-big-bg', 'icon-shijue-big-bg', 'icon-jiagou-big-bg', 'icon-jszj-big-bg', 'icon-chanpingzj-big-bg'];

    var infoList = ['info-cpjl', 'info-cpzj', 'info-ios', 'info-java', 'info-jhsj', 'info-jiagou', 'info-jszj', 'info-qd', 'info-shijue', 'info-shuju', 'info-test'];
    //
    var btnList = ['btn-share', 'btn-ability', 'btn-back', 'btn-close2', 'btn-home', 'btn-i-know', 'btn-submit'];

    var textList = ['text-cpjl', 'text-qd', 'text-andriod', 'text-ios', 'text-shuju', 'text-java', 'text-test', 'text-jhsj', 'text-shijue', 'text-jiagou', 'text-jszj', 'text-cpzj'];

    var textSelectedList = ['text-cpjl-selected', 'text-qd-selected', 'text-andriod-selected', 'text-ios-selected', 'text-shuju-selected', 'text-java-selected', 'text-test-selected', 'text-jhsj-selected', 'text-shijue-selected', 'text-jiagou-selected', 'text-jszj-selected', 'text-cpzj-selected'];

    var tipsList = ['tip-name', 'tip-tele', 'tip-work', 'tip-work-age', 'music-close', 'music-open', 'loading-tips'];

    imageList = imageList.concat(mainList, roleSelectList, imageList, btnList, iconList, iconBigList, headerRole, iconBigBgList, infoList, textList, textSelectedList, tipsList);
    var $loadingPercent = $('#loadPercent'); // 分享百分比
    utils.loadImages(imageList, function (loadSize, allSize, percent) {
        $loadingPercent.css({
            width: percent * 100 + '%'
        });

        //
        if (percent == 1) {
            _currentPage = PAGE.main;
            _showPage($main);
            _playMusic();
        }
    });


    // 初始化页面信息
    function _initPage() {
        // 首页
        if (_currentPage == PAGE.main) {
            //
            setTimeout(function () {
                $main.find('.main-top').addClass('show-normal');
            }, 100);
        }
        // 角色选择
        else if (_currentPage == PAGE.roleSelect) {
            _initRoleSelect();
        }
        // 角色详情
        else if (_currentPage == PAGE.roleInfo) {
            $roleInfo.find('.role-info-inner').hide();
            $roleInfo.find('.' + _selectRole).show();
            $roleInfo.find('.footer').show();
            $roleInfo.find('.role-ability').removeClass('aniShow');
            setTimeout(function () {
                $roleInfo.find('.' + _selectRole).find('.icon-big').addClass('do-show');
                $roleInfo.find('.' + _selectRole).find('.house-bg').addClass('normal-show');
                $roleInfo.find('.' + _selectRole).find('.icon-bg').addClass('normal-show');
            }, 100);
        }
        else if (_currentPage == PAGE.formPage) {
            $('#selectRole').val(_selectRole || ROLE.chanpingjl);
        }


        if (_currentPage != PAGE.roleInfo) {
            $roleInfo.find('.icon-big').removeClass('do-show');
            $roleInfo.find('.house-bg').removeClass('normal-show');
            $roleInfo.find('.icon-bg').removeClass('normal-show');
        }

        if (_currentPage != PAGE.main) {
            $main.find('.main-top').removeClass('show-normal');
        }

        if (_currentPage == PAGE.main || _currentPage == PAGE.successPage) {
            $backBtn.hide();
        }
        else {
            $backBtn.show();
        }
    }

    function _goBack() {
        var newCurrentPage;
        var $newCurrentPage;


        // 角色个人信息
        if (_currentPage == PAGE.roleInfo) {
            newCurrentPage = PAGE.roleSelect;
            $newCurrentPage = $roleSelect;
        }
        // 角色选择
        else if (_currentPage == PAGE.roleSelect) {
            newCurrentPage = PAGE.main;
            $newCurrentPage = $main;
        }
        // 表单提交
        else if (_currentPage == PAGE.formPage) {
            newCurrentPage = PAGE.roleSelect;
            $newCurrentPage = $roleSelect;
        }
        // 分享成功
        else if (_currentPage == PAGE.successPage) {
            newCurrentPage = PAGE.roleSelect;
            $newCurrentPage = $roleSelect;
        }

        if (_currentPage && $newCurrentPage) {
            _currentPage = newCurrentPage;
            _showPage($newCurrentPage);
        }
    }

    //
    function _initRoleSelect() {
        // 默认产品经理
        _selectRole = ROLE.chanpingjl;
        $roleSelect.find('.icon').removeClass('selected');
        $roleSelect.find('.icon:first').addClass('selected');
    }

    //
    function _showShare() {
        $sharePage.show();
    }

    function _hideShare() {
        $sharePage.hide();
    }

    function _showAbility() {
        var $role = '.' + _selectRole;
        $roleInfo.find($role + ' .role-ability').show().addClass('aniShow');
        $roleInfo.find('.footer').hide();
        setTimeout(function () {
            $closeBtn.show();
        }, 500);

    }

    function _hideAbility() {
        var $role = '.' + _selectRole;
        $roleInfo.find($role + ' .role-ability').removeClass('aniShow');
        $closeBtn.hide();
        setTimeout(function () {
            $roleInfo.find('.footer').show();
            $roleInfo.find($role + ' .role-ability').hide();
        }, 500);
    }

    /*
     * 初始化数据 end
     *
     * */


    /*
     * 事件绑定
     *
     *
     *
     * */

    // 去角色选择页面
    $('#toRoleSelect').click(function () {
        _currentPage = PAGE.roleSelect;
        _showPage($roleSelect);
    });

    //
    $('#toRoleInfo').click(function () {
        if (!_selectRole) {
            return;
        }
        _currentPage = PAGE.roleInfo;
        _showPage($roleInfo);
    });


    $('#showRoleAbility').click(function () {
        _showAbility();
    });

    $('.toFormPage').click(function () {
        _currentPage = PAGE.formPage;
        _showPage($formPage);
    });


    //
    $('.btn-share').click(function () {
        _showShare();
    });

    $('.btn-ikonw').click(function () {
        _hideShare();
    });

    $('.btn-home').click(function () {
        _currentPage = PAGE.main;
        _showPage($main);
    });

    // 角色选择
    $roleSelect.find('.icon').click(function () {
        var $el = $(this);
        var role = $el.find('span[data-role]').data('role');
        if (_selectRole == role) {
            $('#toRoleInfo').click();
        }
        else {
            $roleSelect.find('.icon').removeClass('selected');
            $el.addClass('selected');
            _selectRole = role;
        }
    });

    //
    $('#doBack').click(function () {
        _goBack();
    });

    $('.do-close').click(function () {
        _hideAbility();
    });

    $('#doShare').click(function () {
        _showShare();
    });


    $('#submitBtn').click(function () {
        if (_submiting) {
            return;
        }

        var validResult = _validForm();

        if (validResult.error) {
            _showError(validResult.tips);
            return false;
        }
        _submiting = true;
        $('#submitBtn').addClass('btn-submiting');
        _submitForm(_toSuccess, function (msg) {
            _submiting = false;
            $('#submitBtn').removeClass('btn-submiting');
            _showError(msg || '网络异常，请稍后再试');
        });

        function _toSuccess() {
            _submiting = false;
            $('#submitBtn').removeClass('btn-submiting');
            _currentPage = PAGE.successPage;
            _showPage($successPage);
        }

    });


    function _validForm() {

        //    手机号验证
        function _checkPhone(phone) {
            var phone = phone || '';
            var result = true;
            /*if (parseInt(phone, 10) != phone) {
             result = false;
             }*/
            var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
            if (!reg.test(phone)) {
                result = false;
            }
            return result;
        }

        var result = {
            error: false,
            tips: ''
        };

        var name = $('[name="name"]').val();
        var telephone = $('[name="telephone"]').val();
        var workAge = $('[name="workAge"]').val();

        if (!$.trim(name)) {
            result.error = true;
            result.tips = '请填写姓名';
        }
        else if (!$.trim(telephone)) {
            result.error = true;
            result.tips = '请填写手机号';
        }
        else if (!$.trim(workAge)) {
            result.error = true;
            result.tips = '请填写工作年限';
        }

        if (!result.error) {
            if (!_checkPhone(telephone)) {
                result.error = true;
                result.tips = '手机号码有误，请重填';
            }
        }

        return result;
    }

    //
    function _submitForm(success, error) {
        $.ajax({
            //请求类型
            type: 'get',
            url: '//qrs.suning.com/qrs-web/activityqrcode/signupForJsonp.htm',
            data: _getFormData(),
            dataType: "jsonp",
            jsonp: 'callback',
            success: function (data) {
                var result = data || {};
                if (typeof result == 'string') {
                    try {
                        result = JSON.parse(result);
                    }
                    catch (e) {

                    }
                }
                if (result.code == 1) {
                    success && success();
                }
                else {
                    error(result.msg);
                }
            },
            error: function () {
                error && error()
            }
        })
    }


    function _getFormData() {
        var result = {};
        var name = $('[name="name"]').val();
        var telephone = $('[name="telephone"]').val();
        var workAge = $('[name="workAge"]').val();
        var wantRole = $('[name="wantRole"]').val();

        var jsonT = '{root:[{name:"工作年限",value:"' + $.trim(workAge) + '"},{name:"应聘职位",value:"' + ROLE_INFO[wantRole] + '"},]}';
        // 10000743
        result.activityId = 340;
        result.name = $.trim(name);
        result.mobileNumber = $.trim(telephone);
        result.email = '';
        result.jsonField = jsonT;

        return result;
    }

    $('#errorTipsHide').click(function () {
        _hideError();
    });


    //
    function _showError(tips) {
        if (!tips) {
            return;
        }
        $errorTips.find('.tip2').html(tips);
        $errorTips.show();
    }


    function _hideError() {
        $errorTips.hide();
    }

    var playLock = false;
    // 播放音乐
    function _playMusic() {
        if (playLock) {
            return;
        }
        // 加载完毕了 就可以播放了
        if ((musicCanPlay || isIphone) && _currentPage !== PAGE.loading) {
            if (isIphone) {
                // $music.removeClass('btn-music-close').addClass('btn-music-open');
                // audio.play();
            }
            else {
                audio.play();
            }

            $music.show();
            playLock = true;
        }
    }


    /* 音乐 */
    var audio = document.getElementById('J_audio');
    var musicCanPlay = false;
    $music.on('click', function () {
        // 提示用户关闭音乐
        if ($(this).hasClass('btn-music-close')) {
            audio.pause();
            $(this).removeClass('btn-music-close').addClass('btn-music-open');
        }
        // 提示用户打开音乐
        else {
            audio.play();
            $(this).addClass('btn-music-close').removeClass('btn-music-open');
        }
    });

    if(isIphone){
        //微信下兼容处理
        document.addEventListener("WeixinJSBridgeReady", function () {
            audio.play();
        }, false);
    }
    else{
        //
        audio.addEventListener("canplaythrough", function () {
            musicCanPlay = true;
            _playMusic()
        }, false);

        audio.load();
    }

    /*
     * 事件绑定 end
     *
     * */
});