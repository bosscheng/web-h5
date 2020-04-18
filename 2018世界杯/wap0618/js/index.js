/*
* author:
* date: 6/12/18
* desc:
*/

$(function () {
    var $loadDiv = $('#pageLoading'); // 加载中页面
    var $pageMain = $('#pageMain');// 首页
    var $pageChooseTeam = $('#pageChooseTeam'); // 选择球队
    var $pageChooseClothes = $('#pageChooseClothes'); // 选择衣服，角色
    var $pageImageUpload = $('#pageUploadImg'); // 上传头像
    var $pageShare = $('#pageShare'); // 生产头像页面
    var $pagePkProcess = $('#pagePkProcess'); // PK过程中
    var $pagePkResult = $('#pagePkResult'); // pk 结果页面
    var $fileSelect = $('#fileSelect');
    var $mask = $('#pageMask');// mask
    var $shareMask = $('#wxShareMask');//

    var UA = navigator.userAgent.toLocaleLowerCase();
    var isIphone = !!(UA.match(/(iphone|ipod|ipad);?/i));

    var _currentTeam = '';
    var _gender = 'male';
    var _isPk = true; // 是否pk模式
    var _userName = ''; // 姓名
    var _sponsored = 'SUNING';// 赞助商
    var _setTimeout = null;
    var _token = '';
    var _shareToken = ''; //
    // 红方数据
    var _redData = {};
    // 蓝方数据
    var _blurData = {};
    // 国家列表
    var _teamList = ['xby', 'bls', 'agt', 'dg', 'glby', 'fg', 'pty', 'zg', 'ygl', 'bx'];

    var _pkLock = false;// pk 锁

    var MAKE_PIC_TYPE = {
        share: 'share',
        pk: 'pk'
    };

    // 性别枚举值
    var GENDER = {
        male: '1',
        female: '2'
    };

    var ATTRIBUTE_STR = {
        fangshou: 'fangshou',
        pandai: 'pandai',
        sudu: 'sudu',
        shesu: 'shesu',
        chanqiu: 'chanqiu'
    };

    var ATTRIBUTE = {
        fangshou: '防守',
        pandai: '盘带',
        sudu: '速度',
        shesu: '射术',
        chanqiu: '传球'
    };

    var UPLOAD_IMG_TIPS = {
        '-1': '未知错误',
        '17': '参数校验失败',
        '10000': '服务已经关闭',
        '10001': '解码异常',
        '10002': '图片大小超过限制',
        '10003': '图片解析失败',
        '10004': '头像上传失败',
        '10005': '头像上传异常',
        '10006': '图片获取失败',
        '0001': '没有找到头像',
        '0002': '存在多个头像',
        '0003': '找不到头像(BackImg)',
        '0004': '找不到头像(HeadImg)'
    };

    // 字体颜色
    var CLOTHES_COLOR = {
        xby: {
            name: '#fedd2c',
            tips: '#c3bfbf'
        },
        bls: {
            name: '#fed130',
            tips: '#aeaeb0'
        },
        agt: {
            name: '#24292f',
            tips: '#888'
        },
        dg: {
            name: '#1c1d22',
            tips: '#888'
        },
        glby: {
            name: '#25294e',
            tips: '#878787'
        },
        fg: {
            name: '#d3d5ea',
            tips: '#c3bfbf'
        },
        pty: {
            name: '#fedd2c',
            tips: '#888'
        },
        zg: {
            name: '#d9d7ed',
            tips: '#bdbec0'
        },
        ygl: {
            name: '#bdbec0',
            tips: '#888'
        },
        bx: {
            name: '#00ad7f',
            tips: '#888'
        }
    };

    var TEAM_LIST = {
        xby: '1',
        bls: '2',
        agt: '3',
        dg: '4',
        glby: '5',
        fg: '6',
        pty: '7',
        zg: '8',
        ygl: '9',
        bx: '10'
    };


    var _host = function () {
        var _hostName = document.location.hostname;
        // 一般生产环境的域名
        var _prd_reg = /(\W)*.suning.com$/;
        // 一般pre环境的域名
        var _pre_reg = /(\W)*pre(.*)*.cnsuning.com$/;
        var _prexg1_reg = /(\W)*xgpre(.*)*.cnsuning.com$/;
        var _prexg2_reg = /(\W)*prexg(.*)*.cnsuning.com$/;
        // 一般sit环境的域名
        var _sit_reg = /(\W)*sit(.*)*.cnsuning.com$/;
        var result = '';
        // Pre
        if (_pre_reg.test(_hostName)) {
            if (_prexg1_reg.test(_hostName) || _prexg2_reg.test(_hostName)) {
                result = '//actsit.cnsuning.com';
            } else {
                result = '//actsit.cnsuning.com';
            }
        }
        // sit
        else if (_sit_reg.test(_hostName)) {
            result = '//actsit.cnsuning.com';
        }
        // prd
        else if (_prd_reg.test(_hostName)) {
            result = '//facegame.suning.com';
        }
        else {
            // 默认走 sit 的接口
            result = '//actsit.cnsuning.com';
        }
        return '//facegame.suning.com';
    }();

    function _ajax(options, promise) {
        options = options || {};
        promise = promise || {};

        var config = {
            url: '',
            type: 'GET',
            dataType: "json",
            data: '',
            timeout: 60 * 1000,
            success: function (data) {
                promise.resolve && promise.resolve(data);
            },
            error: function (error) {
                promise.reject && promise.reject(error);
            }
        };

        for (var p in options) {
            config[p] = options[p];
        }

        $.ajax(config);
    }

    var utils = {
        //
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
        },

        indexOf: function (array, item) {
            if (array.indexOf) {
                return array.indexOf(item);
            }
            var result = -1;
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i] === item) {
                    result = i;
                }
            }
            return result;
        },

        getUrlSearch: function () {
            var result = {};

            var name, value;
            var str = location.href; //取得整个地址栏
            var num = str.indexOf("?");
            str = str.substr(num + 1); //取得所有参数

            var arr = str.split("&"); //各个参数放到数组里
            for (var i = 0; i < arr.length; i++) {
                num = arr[i].indexOf("=");
                if (num > 0) {
                    name = arr[i].substring(0, num);
                    value = arr[i].substr(num + 1);
                    result[name] = value;
                }
            }
            return result;
        },

        getImgExif: function (file, callback) {
            $('#hideImg').attr('src', ''); // 先清空操作
            var reader = new FileReader();
            // 文件base64化，以便获知图片原始尺寸
            reader.onload = function (e) {
                var imgBase64 = e.target.result;
                $('#hideImg').attr('src', imgBase64);
                var $img = document.getElementById('hideImg');
                $img.onload = function () {
                    window.EXIF.getData($img, function () {
                        var orientation = EXIF.getTag(this, 'Orientation');
                        callback(false, orientation, imgBase64);
                    });
                };
            };
            reader.readAsDataURL(file);
        },

        getImgBase64: function (tempFile, callback, zip) {
            utils.getImgExif(tempFile, function (error, orientation, imgBase64) {
                // 如果有错误
                if (error) {
                    callback(false);
                    return;
                }

                if (orientation) {
                    // 没有旋转
                    if (orientation === 1) {
                        if (zip) {
                            _zipAndRotateImg2(imgBase64, true, 0);
                        }
                        else {
                            callback(imgBase64);
                            return;
                        }
                    }
                    else {
                        _zipAndRotateImg2(imgBase64, zip, orientation);
                    }
                }
                else {
                    if (zip) {
                        _zipAndRotateImg2(imgBase64, true, 0);
                    }
                    else {
                        callback(imgBase64);
                        return;
                    }
                }
            });


            function _zipAndRotateImg2(imgBase64, zip, rotate) {
                var img = new Image();
                img.src = imgBase64;
                img.onload = function (ev) {
                    // 图片原始尺寸
                    var originWidth = this.width;
                    var originHeight = this.height;
                    var targetWidth = originWidth;
                    var targetHeight = originHeight;
                    if (zip) {
                        // 最大尺寸限制
                        var maxWidth = 750, maxHeight = 750;
                        // 图片尺寸超过400x400的限制
                        if (originWidth > maxWidth || originHeight > maxHeight) {
                            if (originWidth / originHeight > maxWidth / maxHeight) {
                                // 更宽，按照宽度限定尺寸
                                targetWidth = maxWidth;
                                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                            } else {
                                targetHeight = maxHeight;
                                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                            }
                        }
                    }
                    // 缩放图片需要的canvas
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');

                    // canvas对图片进行缩放
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    // 清除画布
                    context.clearRect(0, 0, targetWidth, targetHeight);
                    context.drawImage(img, 0, 0, originWidth, originHeight, 0, 0, targetWidth, targetHeight);
                    var dataUrl = canvas.toDataURL("image/jpeg");
                    if (rotate) {
                        var angle = 0;
                        var canvas2 = document.createElement('canvas');
                        var context2 = canvas2.getContext('2d');
                        canvas2.width = targetWidth;
                        canvas2.height = targetHeight;

                        var _setting = {
                            dx: 0,
                            dy: 0,
                            dw: 0,
                            dh: 0,
                            transX: targetWidth / 2,
                            transY: targetHeight / 2
                        };
                        var scale = 0;
                        // 旋转了 180度
                        if (rotate === 3) {
                            angle = Math.PI;
                            _setting.dw = targetWidth;
                            _setting.dh = targetHeight;
                        }
                        // 顺时针90度
                        else {
                            if (rotate === 6) {
                                angle = 90 * (Math.PI / 180);
                            }
                            else if (rotate === 8) {
                                angle = -90 * (Math.PI / 180);
                            }
                            canvas2.width = targetHeight;
                            canvas2.height = targetWidth;
                            _setting.transX = parseFloat(targetHeight / 2);
                            _setting.transY = parseFloat(targetWidth / 2);
                            _setting.dw = targetHeight; // 显示宽度
                            scale = targetWidth / targetHeight;
                            _setting.dh = parseFloat(_setting.dw / scale); // 显示在canvas上面的搞
                            _setting.dy = (targetWidth - _setting.dh) / 2; // 显示在canvas 的y
                        }

                        context2.translate(_setting.transX, _setting.transY);
                        context2.rotate(angle);
                        if (rotate !== 3) {
                            context2.scale(scale, scale);
                        }
                        context2.drawImage(canvas, 0, 0, targetWidth, targetHeight, _setting.dx - _setting.transX, _setting.dy - _setting.transY, _setting.dw, _setting.dh);
                        dataUrl = canvas2.toDataURL("image/jpeg");
                    }
                    callback(dataUrl);
                }
            }
        },
        //
        showErrorTips: function (msg) {
            $('#errorTipsWrap').text(msg).removeClass('hide');
            setTimeout(function () {
                $('#errorTipsWrap').addClass('hide');
            }, 2000);
        },

        //
        pageReload: function () {
            var href = window.location.href;
            if (href.indexOf('?') !== -1) {
                href = href + '&_=' + (new Date()).getTime();
            }
            else {
                href = href + '?_=' + (new Date()).getTime();
            }
            window.location.href = href;
        }
    };

    var service = {
        uploadImg: function (data) {
            var d = $.Deferred();
            var options = {
                type: 'POST',
                data: data,
                processData: false, // 不处理数据
                contentType: false,  // 不设置内容类型
                cache: false,
                url: _host + '/act-wap-web/worldCup/photo/getPicInfo.do'
            };
            _ajax(options, d);
            return d.promise();
        },

        // 获取pk 结果
        getPkInfo: function (data) {
            var d = $.Deferred();
            var options = {
                type: 'GET',
                data: data,
                url: _host + '/act-wap-web/worldCup/photo/getPkInfo.do'
            };
            _ajax(options, d);
            return d.promise();
        },

        // 生产图片
        getShareInfo: function (data) {
            var d = $.Deferred();
            var options = {
                type: 'GET',
                data: data,
                url: _host + '/act-wap-web/worldCup/photo/getShareInfo.do'
            };
            _ajax(options, d);
            return d.promise();
        }
    };

    /*
     * 事件。。。。。。。。。。。。。
     */

    // 加载页面
    function _updateLoading(percent) {
        percent = percent * 100;

        // 大于95
        if (percent > 95) {
            $('.load-icon').hide();
            $('.load-icon-end').show();
        }

        $('.load-loading-percent').css('width', percent + '%');
        $('.load-loading-icon').css('left', (percent - 3) + '%');
    }

    // 主页
    function _updateMain() {

        setTimeout(function () {
            $pageMain.find('.main-logo').addClass('do-show');
            $pageMain.find('.main-title').addClass('do-show');
            setTimeout(function () {
                $pageMain.find('.main-shanguang-top').removeClass('hide').addClass('do-show');
            }, 600);
            setTimeout(function () {
                $pageMain.find('.main-people').addClass('do-show');
                $pageMain.find('.main-p1').addClass('do-show');
                $pageMain.find('.main-p2').addClass('do-show');
                $pageMain.find('.main-animal').addClass('do-show');
                $pageMain.find('.main-pic1').addClass('do-show');
                $pageMain.addClass('do-show');
            }, 500);
        }, 100);

        setTimeout(function () {
            setTimeout(function () {
                $pageMain.find('.main-shanguang').removeClass('hide').addClass('do-show');
            }, 200);
            setTimeout(function () {
                $pageMain.find('.main-shanguang3').removeClass('hide').addClass('do-show');
            }, 400);
            setTimeout(function () {
                $pageMain.find('.main-shanguang2').removeClass('hide').addClass('do-show');
            }, 600);
            setTimeout(function () {
                $pageMain.find('.main-shanguang4').removeClass('hide').addClass('do-show');
            }, 800);
        }, 1200);

        setTimeout(function () {
            //$pageMain.find('.main-mask').removeClass('hide').addClass('do-show');
        }, 900);

        setTimeout(function () {
            $pageMain.find('.main-footer').removeClass('hide');
        }, 1500);


        if (_shareToken) {
            $pageMain.find('.big-btn').hide();
            $pageMain.find('.main-btn-inner').show();
        }
        else {
            $pageMain.find('.big-btn').show();
            $pageMain.find('.main-btn-inner').hide();
        }
    }

    // 选择球队
    function _updateChooseTeam() {
        $pageChooseTeam.find('.content-item').removeClass('do-show');
        $pageChooseTeam.find('.icon').removeClass('do-show');
        setTimeout(function () {
            $pageChooseTeam.find('.content-item').addClass('do-show');
            setTimeout(function () {
                $pageChooseTeam.find('.content-item1 .icon').addClass('do-show');
            }, 700);
            setTimeout(function () {
                $pageChooseTeam.find('.content-item2 .icon').addClass('do-show');
            }, 900);
            setTimeout(function () {
                $pageChooseTeam.find('.content-item3 .icon').addClass('do-show');
            }, 1100);
            setTimeout(function () {
                $pageChooseTeam.find('.content-item4 .icon').addClass('do-show');
            }, 1300);
            setTimeout(function () {
                $pageChooseTeam.find('.content-item5 .icon').addClass('do-show');
            }, 1500);
        }, 100);
    }

    // 更新选择球衣
    function _updateChooseClothes() {
        _updateClothes();
        // 更新角色
        //$pageChooseClothes.find('.gender').removeClass('selected');
        // $pageChooseClothes.find('.male').addClass('selected');
        // _gender = 'male';

        // 清除掉姓名和赞助商
        //$('#userName').val('');
        //$('#sponsored').val('');
        //_userName = '';
        //_sponsored = 'SUNING';
    }

    // 选择衣服
    function _updateClothes() {
        // var icon = 'right-icon icon-' + _currentTeam + '2';
        var cloth = 'clothes clothes-' + _currentTeam;
        var title = 'clothes-name title-' + _currentTeam;
        // 更新logo
        //$pageChooseClothes.find('.right-icon').removeClass().addClass(icon);
        // 更新球衣
        $pageChooseClothes.find('.clothes').removeClass().addClass(cloth);

        // 更换标题
        $pageChooseClothes.find('.clothes-name').removeClass().addClass(title);
        // 更新字体颜色
        $pageChooseClothes.find('input').css({
            'border-bottom-color': CLOTHES_COLOR[_currentTeam].name,
            'color': CLOTHES_COLOR[_currentTeam].name
        });
        $pageChooseClothes.find('.text-name2-tips').css({
            'color': CLOTHES_COLOR[_currentTeam].tips
        })
    }

    // 切换球队衣服
    function _changeClothes(type) {
        var current = _currentTeam;
        var next = current;
        var index = utils.indexOf(_teamList, current);
        var length = _teamList.length;
        if (type === 'left') {
            if (index === 0) {
                next = _teamList[length - 1];
            }
            else {
                next = _teamList[index - 1];
            }
        }
        else {
            if (index === (length - 1)) {
                next = _teamList[0];
            }
            else {
                next = _teamList[index + 1];
            }
        }

        _currentTeam = next;
        _updateClothes();
    }

    // 上传图片
    function _updateUploadImg() {
        //var icon = 'right-icon icon-' + _currentTeam + '2';
        //$pageImageUpload.find('.right-icon').removeClass().addClass(icon);
        $pageImageUpload.find('.upload-btn').removeClass('uploading');
        $pageImageUpload.find('.btn-restart').removeClass('uploading');
        $pageImageUpload.find('.error-tips2').hide();
    }

    function _initSharePage() {
        $pageShare.find('.fangshou .power-line-inner').css({'width': '0%'});
        $pageShare.find('.pandai .power-line-inner').css({'width': '0%'});
        $pageShare.find('.sudu .power-line-inner').css({'width': '0%'});
        $pageShare.find('.shesu .power-line-inner').css({'width': '0%'});
        $pageShare.find('.chanqiu .power-line-inner').css({'width': '0%'});
        $pageShare.find('.share-head-pic img').attr('src', '');

        $pageShare.find('.share-head-pic').removeClass('hide');
        $pageShare.find('.share-content').removeClass('hide');
        $pageShare.find('.share-content-img img').attr('src', '');
        $pageShare.find('.share-content-img').addClass('hide');
        $pageShare.find('.share-footer-start').removeClass('hide');
        $pageShare.find('.share-footer-end').addClass('hide');
    }

    function _initPkProcessPage() {

        $pagePkProcess.find('.head-temp').removeClass('do-show').addClass('hide');
        $pagePkProcess.find('.vs-icon').addClass('hide').removeClass('do-show');
        $pagePkProcess.find('.head-temp').removeClass('do-show');
        $pagePkProcess.find('.head-temp p').removeClass('do-show');
        $pagePkProcess.find('.process-tips').removeClass('do-show');
        $pagePkProcess.find('.process-footer').removeClass('do-show');
        $pagePkProcess.find('.body-item').removeClass('do-show');
        $pagePkProcess.find('.fire-football').removeClass('do-show');

        $pageShare.find('.red-head-pic img').attr('src', '');
        $pageShare.find('.blue-head-pic img').attr('src', '');

        // 红方
        $pagePkProcess.find('.red-fangshou .power-line-inner').css({'width': '0%'});
        $pagePkProcess.find('.red-pandai .power-line-inner').css({'width': '0%'});
        $pagePkProcess.find('.red-sudu .power-line-inner').css({'width': '0%'});
        $pagePkProcess.find('.red-shesu .power-line-inner').css({'width': '0%'});
        $pagePkProcess.find('.red-chanqiu .power-line-inner').css({'width': '0%'});

        // 蓝方
        $pagePkProcess.find('.blue-fangshou .power-line-inner').css({'width': '0%'});
        $pagePkProcess.find('.blue-pandai .power-line-inner').css({'width': '0%'});
        $pagePkProcess.find('.blue-sudu .power-line-inner').css({'width': '0%'});
        $pagePkProcess.find('.blue-shesu .power-line-inner').css({'width': '0%'});
        $pagePkProcess.find('.blue-chanqiu .power-line-inner').css({'width': '0%'});
    }

    // 分享页面
    function _updateShare(options) {
        _initSharePage();
        options = options || {};
        _token = options.token;
        // var icon = 'right-icon icon-' + _currentTeam + '2';
        var headTitle = 'share-head-title share-tips-' + _currentTeam;
        //$pageShare.find('.right-icon').removeClass().addClass(icon);
        $pageShare.find('.share-head-title').removeClass().addClass(headTitle);
        // 查看是否是需要和别人 PK  如果
        if (_isPk) {
            $pageShare.find('.btn-group-pk').removeClass('hide');
            $pageShare.find('.btn-group-share').addClass('hide');
        }
        else {
            $pageShare.find('.btn-group-pk').addClass('hide');
            $pageShare.find('.btn-group-share').removeClass('hide');
        }

        // 更新数据
        $pageShare.find('.user-name').text(_userName);
        $pageShare.find('.user-zzs').text('赞助商：' + _sponsored);
        $pageShare.find('.techang .tips').text(options.speciality || '');
        $pageShare.find('.weizhi .tips').text(options.position || '');
        $pageShare.find('.share-head-pic img').attr('src', (options.picUrl || ''));
        $pageShare.find('.share-qrcode img').attr('src', (options.qrCodeUrl || ''));

        _redData.qrCodeUrl = (options.qrCodeUrl || '');
        _redData.picUrl = (options.picUrl || '');

        var attributes = options.attributes || [];

        for (var i = 0, len = attributes.length; i < len; i++) {
            var temp = attributes[i];
            if (temp.attName === ATTRIBUTE.fangshou) {
                _redData[ATTRIBUTE_STR.fangshou] = temp.attValue || 0;
            }
            else if (temp.attName === ATTRIBUTE.pandai) {
                _redData[ATTRIBUTE_STR.pandai] = temp.attValue || 0;
            }
            else if (temp.attName === ATTRIBUTE.sudu) {
                _redData[ATTRIBUTE_STR.sudu] = temp.attValue || 0;
            }
            else if (temp.attName === ATTRIBUTE.shesu) {
                _redData[ATTRIBUTE_STR.shesu] = temp.attValue || 0;
            }
            else if (temp.attName === ATTRIBUTE.chanqiu) {
                _redData[ATTRIBUTE_STR.chanqiu] = temp.attValue || 0;
            }
        }

        setTimeout(function () {
            // 五维
            $pageShare.find('.fangshou .power-line-inner').css({'width': _redData[ATTRIBUTE_STR.fangshou] + '%'});
            $pageShare.find('.pandai .power-line-inner').css({'width': _redData[ATTRIBUTE_STR.pandai] + '%'});
            $pageShare.find('.sudu .power-line-inner').css({'width': _redData[ATTRIBUTE_STR.sudu] + '%'});
            $pageShare.find('.shesu .power-line-inner').css({'width': _redData[ATTRIBUTE_STR.shesu] + '%'});
            $pageShare.find('.chanqiu .power-line-inner').css({'width': _redData[ATTRIBUTE_STR.chanqiu] + '%'});
        }, 100);
    }

    // pk 过程
    function _updatePkProcess(options) {
        options = options || {};
        //显示 红方 和 蓝方的数据
        $pagePkProcess.find('.red-name').text(_userName);
        $pagePkProcess.find('.blue-name').text(decodeURIComponent(options.name || ''));

        // 维护数据
        _redData.goalNum = options.challengeGoalNum;

        _blurData.name = options.name;
        _blurData.country = options.country;
        _blurData.goalNum = options.shareGoalNum;
        _blurData.sponsord = options.sponsor;
        // 头像
        $pagePkProcess.find('.red-head-pic img').attr('src', _redData.picUrl);
        $pagePkProcess.find('.blue-head-pic img').attr('src', options.picUrl);

        // 选择的国旗
        var redNationalIcon = 'red-national icon-' + _currentTeam;
        var blueNationalIcon = 'blue-national icon-' + (_teamList[_blurData.country - 1] || 'xby');
        $pagePkProcess.find('.red-national').removeClass().addClass(redNationalIcon);
        $pagePkProcess.find('.blue-national').removeClass().addClass(blueNationalIcon);

        // 球队
        $pagePkProcess.find('.red-team').text(_sponsored);
        $pagePkProcess.find('.blue-team').text(decodeURIComponent(_blurData.sponsord));

        var attributes = options.attributes || [];

        for (var i = 0, len = attributes.length; i < len; i++) {
            var temp = attributes[i];
            if (temp.attName === ATTRIBUTE.fangshou) {
                _blurData[ATTRIBUTE_STR.fangshou] = temp.attValue || 0;
            }
            else if (temp.attName === ATTRIBUTE.pandai) {
                _blurData[ATTRIBUTE_STR.pandai] = temp.attValue || 0;
            }
            else if (temp.attName === ATTRIBUTE.sudu) {
                _blurData[ATTRIBUTE_STR.sudu] = temp.attValue || 0;
            }
            else if (temp.attName === ATTRIBUTE.shesu) {
                _blurData[ATTRIBUTE_STR.shesu] = temp.attValue || 0;
            }
            else if (temp.attName === ATTRIBUTE.chanqiu) {
                _blurData[ATTRIBUTE_STR.chanqiu] = temp.attValue || 0;
            }
        }


        function _startAnimate() {
            $pagePkProcess.find('.fire-football').addClass('do-show'); // 0.2
            setTimeout(function () {
                $pagePkProcess.find('.left-temp').removeClass('hide').addClass('do-show');
                $pagePkProcess.find('.right-temp').removeClass('hide').addClass('do-show'); //
                setTimeout(function () {
                    $pagePkProcess.find('.head-name').addClass('do-show'); // 0.2
                    $pagePkProcess.find('.vs-icon').removeClass('hide').addClass('do-show'); //0.2
                    $pagePkProcess.find('.process-tips').addClass('do-show'); // 0.2
                    $pagePkProcess.find('.body-item').addClass('do-show'); //
                    _initPower();
                    $pagePkProcess.find('.process-footer').addClass('do-show');
                    _goNextPage();
                }, 1000)
            }, 200);
        }

        function _initPower() {
            $pagePkProcess.find('.red-fangshou .power-line-inner').css({'width': _redData[ATTRIBUTE_STR.fangshou] + '%'});
            $pagePkProcess.find('.red-pandai .power-line-inner').css({'width': _redData[ATTRIBUTE_STR.pandai] + '%'});
            $pagePkProcess.find('.red-sudu .power-line-inner').css({'width': _redData[ATTRIBUTE_STR.sudu] + '%'});
            $pagePkProcess.find('.red-shesu .power-line-inner').css({'width': _redData[ATTRIBUTE_STR.shesu] + '%'});
            $pagePkProcess.find('.red-chanqiu .power-line-inner').css({'width': _redData[ATTRIBUTE_STR.chanqiu] + '%'});

            // 蓝方
            $pagePkProcess.find('.blue-fangshou .power-line-inner').css({'width': _blurData[ATTRIBUTE_STR.fangshou] + '%'});
            $pagePkProcess.find('.blue-pandai .power-line-inner').css({'width': _blurData[ATTRIBUTE_STR.pandai] + '%'});
            $pagePkProcess.find('.blue-sudu .power-line-inner').css({'width': _blurData[ATTRIBUTE_STR.sudu] + '%'});
            $pagePkProcess.find('.blue-shesu .power-line-inner').css({'width': _blurData[ATTRIBUTE_STR.shesu] + '%'});
            $pagePkProcess.find('.blue-chanqiu .power-line-inner').css({'width': _blurData[ATTRIBUTE_STR.chanqiu] + '%'});
        }

        function _goNextPage() {
            _setTimeout = window.setTimeout(function () {
                _updatePkResult(options.pkResult);
                $pagePkProcess.hide();
                $pagePkResult.show();
            }, 5000);
        }

        // 动画开始啦
        setTimeout(function () {
            _startAnimate();
        }, 100);
    }

    // pk 结果
    function _updatePkResult(pkResult) {

        // 姓名
        $pagePkResult.find('.red-name').text(_userName);
        $pagePkResult.find('.blue-name').text(decodeURIComponent(_blurData.name || ''));
        // 队伍
        $pagePkResult.find('.red-team').text(_sponsored);
        $pagePkResult.find('.blue-team').text(decodeURIComponent(_blurData.sponsord || ''));
        // 分数
        var redScore2 = 'red-score pk-score-2 red-' + _redData.goalNum;
        $pagePkResult.find('.red-score .pk-score-2').removeClass().addClass(redScore2);

        var blueScore2 = 'blue-score pk-score-2 black-' + _blurData.goalNum;
        $pagePkResult.find('.blue-score .pk-score-2').removeClass().addClass(blueScore2);

        // 右上角的国旗
        //var icon = 'right-icon icon-' + _currentTeam + '2';
        //$pagePkResult.find('.right-icon').removeClass().addClass(icon);

        // 头像
        $pagePkResult.find('.pk-head-pic img').attr('src', _redData.picUrl);

        // 二维码
        $pagePkResult.find('.pk-head-qrcode img').attr('src', _redData.qrCodeUrl);

        // 结果赢还是输出了，还是平局
        $pagePkResult.find('.pk-result-win').toggleClass('hide', pkResult !== '0'); // 胜
        $pagePkResult.find('.pk-result-lose').toggleClass('hide', pkResult !== '1'); // 负
        $pagePkResult.find('.pk-result-pingjun').toggleClass('hide', pkResult !== '2'); // 平
    }

    // 初始化pk结果页面。
    function _initPkResult() {
        $pagePkResult.find('.pk-head-pic').removeClass('hide');
        $pagePkResult.find('.pk-result-content').removeClass('hide');
        $pagePkResult.find('.pk-result-content-img img').attr('src', '');
        $pagePkResult.find('.pk-result-content-img').addClass('hide');
        $pagePkResult.find('.pk-result-footer-start').removeClass('hide');
        $pagePkResult.find('.pk-result-footer-end').addClass('hide');
    }

    function _initMainPage() {

    }

    // 上传头像
    function _doUploadHeadPic(file) {
        file = file || {};
        var img = file.name;

        var $errorTips = $pageImageUpload.find('.error-tips2');
        var $uploadBtn = $pageImageUpload.find('.upload-btn');
        var $restartBtn = $pageImageUpload.find('.btn-restart');
        var $tips = $pageImageUpload.find('.tip1');
        var $tips2 = $pageImageUpload.find('.tip2');

        if (img == null || img === "") {
            $errorTips.show().text('图片为空');
            return false;
        }
        else {
            if (img.substr(img.length - 4, 4).toLowerCase().match("^.jpg") == null && img.substr(img.length - 5, 5).toLowerCase().match("^.jpeg") == null && img.substr(img.length - 4, 4).toLowerCase().match("^.png") == null && img.substr(img.length - 4, 4).toLowerCase().match("^.gif") == null && img.substr(img.length - 4, 4).toLowerCase().match("^.bmp") == null) {
                $errorTips.show().text('图片文件仅支持jpg/jpeg/png/gif/bmp格式');
                return false
            }
        }
        $uploadBtn.addClass('uploading');
        $restartBtn.addClass('uploading');
        $tips.text('我的专属球星卡生成中...').addClass('uploading');
        $tips2.text('');


        if (file.size >= (1024 * 1024 * 2)) {
            utils.getImgBase64(file, function (base64) {
                if (base64) {
                    _next(base64);
                }
                else {
                    _fail();
                }
            }, true);
        }
        else {
            utils.getImgBase64(file, function (base64) {
                if (base64) {
                    _next(base64);
                }
                else {
                    _fail();
                }
            })
        }

        function _next(fileBase64) {
            // 采用 form data形式上传。
            var formData = new FormData();

            // if (needBase64) {
            //     formData.append('imgBase64', fileBase64);
            // }
            // else {
            //     formData.append('img', file);
            // }

            formData.append('imgBase64', fileBase64);
            formData.append('name', encodeURIComponent(_userName));
            formData.append('country', TEAM_LIST[_currentTeam]);
            formData.append('gender', GENDER[_gender]);
            formData.append('sponsor', encodeURIComponent(_sponsored));

            service.uploadImg(formData).then(function (response) {
                $uploadBtn.removeClass('uploading');
                $restartBtn.removeClass('uploading');
                $tips.text('点击上传正面清晰大头照').removeClass('uploading');
                $tips2.text('不要戴眼镜哦!');
                $fileSelect.val('');
                response = response || {};

                if (response.code == '1') {
                    _updateShare(response.data);
                    $pageImageUpload.hide();
                    $pageShare.show();
                }
                else {
                    var tips = UPLOAD_IMG_TIPS[response.code];
                    $errorTips.show().text(tips || '网络异常，上传失败');
                }
                //
            }, function (error) {
                // _fail();
            });
        }

        function _fail() {
            $uploadBtn.removeClass('uploading');
            $restartBtn.removeClass('uploading');
            $errorTips.show().text('网络异常，上传失败');
            $tips.text('点击上传正面清晰大头照').removeClass('uploading');
            $tips2.text('不要戴眼镜哦!');
            $fileSelect.val('');
        }
    }

    //  生成图片
    function _doMakePic(type) {
        var _type = 1;
        if (type === MAKE_PIC_TYPE.share) {
            _type = 1;
        }
        else if (type === MAKE_PIC_TYPE.pk) {
            _type = 2;
        }

        // 笼罩 层
        $mask.removeClass('hide');

        var data = {
            token: _token,
            type: _type
        };

        service.getShareInfo(data).then(function (response) {
            $mask.addClass('hide');
            response = response || {};
            if (response.code == '1') {
                if (_type === 1) {
                    _updateMakeSharePic(response.data)
                }
                else {
                    _updateMakePkPic(response.data);
                }
            }
            else {
                var errorTips = '网络异常，图片生成失败(' + response.code + ')';
                utils.showErrorTips(errorTips);
            }
        }, function (err) {
            $mask.addClass('hide');
            var errorTips = '网络异常，图片生成失败(-2)';
            utils.showErrorTips(errorTips);
        });


        function _updateMakeSharePic(data) {
            data = data || {};
            var url = data.shareUrl;
            $pageShare.find('.share-head-pic').addClass('hide');
            $pageShare.find('.share-content').addClass('hide');
            $pageShare.find('.share-content-img img').attr('src', url);
            $pageShare.find('.share-content-img').removeClass('hide');
            $pageShare.find('.share-footer-start').addClass('hide');
            // 在玩一次，分享图片
            $pageShare.find('.share-footer-end').removeClass('hide');
        }

        function _updateMakePkPic(data) {
            data = data || {};
            var url = data.shareUrl;
            $pagePkResult.find('.pk-head-pic').addClass('hide');
            $pagePkResult.find('.pk-result-content').addClass('hide');
            $pagePkResult.find('.pk-result-content-img img').attr('src', url);
            $pagePkResult.find('.pk-result-content-img').removeClass('hide');
            $pagePkResult.find('.pk-result-footer-start').addClass('hide');

            // 在玩一次，分享图片
            $pagePkResult.find('.pk-result-footer-end').removeClass('hide');
        }
    }

    // 请求pk
    function _doPK() {

        var data = {
            token: _token,
            shareToken: _shareToken
        };

        service.getPkInfo(data).then(function (response) {
            response = response || {};

            if (response.code == '1') {
                $pageShare.hide();
                _updatePkProcess(response.data);
                $pagePkProcess.show();
            }
            else {
                var errorTips = '网络异常，提交失败(' + response.code + ')';
                if (response.code == '10007') {
                    errorTips = '获取个人信息失败';
                }
                utils.showErrorTips(errorTips);
            }
        }, function (error) {
            var errorTips = '网络异常，提交失败(-2)';
            utils.showErrorTips(errorTips);
        });
    }

    //
    function _init() {
        var param = utils.getUrlSearch();
        if (param.token) {
            _shareToken = param.token;
            _isPk = true;
        }
        else {
            _isPk = false;
        }
    }


    var img1 = ['bg-bg.jpg', 'bg-bg2.jpg'];
    var main = ['pptv2.png','share-bg-bg2.png'];
    //  选择衣服
    var chooseClothes = ['worldcup_logo3.png', 'Portugal_logo.png', 'Portugal_clothes.png', 'woman_default.png', 'woman_active.png', 'man_default.png', 'man_active.png', 'btn01.png', 'btn02.png'];
    //
    var team = ['title_bg.png', 'suning_icon.png', 'top_title.png', 'middle_bg.png', 'line_bg.png', 'bottom_bg.png', 'wolf4.png'];
    //  上传头像
    var upload = ['upload_bg.png', 'btn_upload.png', 'uploading.gif'];
    //
    var logo = ['Spain_logo.png', 'belgium_logo.png', 'Argentina_logo.png', 'germany_logo.png', 'cloumbia_logo.png', 'France.png', 'portugal2_logo.png', 'china_logo.png', 'england_logo.png', 'brazil_logo.png'];
    var smallLogo = ['national-flag/agt.png', 'national-flag/bls.png', 'national-flag/bx.png', 'national-flag/dg.png', 'national-flag/fg.png', 'national-flag/glby.png', 'national-flag/pty.png', 'national-flag/xby.png', 'national-flag/ygl.png', 'national-flag/zg.png'];
    var smallLogo2 = ['national-flag/agt2.png', 'national-flag/bls2.png', 'national-flag/bx2.png', 'national-flag/dg2.png', 'national-flag/fg2.png', 'national-flag/glby2.png', 'national-flag/pty2.png', 'national-flag/xby2.png', 'national-flag/ygl2.png', 'national-flag/zg2.png'];
    var shareTips = ['share-tips/agt.png', 'share-tips/bls.png', 'share-tips/bx.png', 'share-tips/dg.png', 'share-tips/fg.png', 'share-tips/glby.png', 'share-tips/pty.png', 'share-tips/xby.png', 'share-tips/ygl.png', 'share-tips/zg.png'];
    var timeRed = ['time/red-0.png', 'time/red-1.png', 'time/red-2.png', 'time/red-3.png', 'time/red-4.png', 'time/red-5.png', 'time/red-6.png', 'time/red-7.png', 'time/red-8.png', 'time/red-9.png'];
    var timeBlack = ['time/black-0.png', 'time/black-1.png', 'time/black-2.png', 'time/black-3.png', 'time/black-4.png', 'time/black-5.png', 'time/black-6.png', 'time/black-7.png', 'time/black-8.png', 'time/black-9.png'];
    var clothes = ['clothes/agt.png', 'clothes/bls.png', 'clothes/bx.png', 'clothes/dg.png', 'clothes/fg.png', 'clothes/glby.png', 'clothes/pty.png', 'clothes/xby.png', 'clothes/ygl.png', 'clothes/zg.png'];
    var titleTips = ['title/agt.png', 'title/bls.png', 'title/bx.png', 'title/dg.png', 'title/fg.png', 'title/glby.png', 'title/pty.png', 'title/xby.png', 'title/ygl.png', 'title/zg.png'];

    // 按钮
    var btn = ['btn/btn-share.png', 'btn/btn-support.png', 'btn/btn-upload.png', 'btn/btn-upload-again.png', 'btn/btn-upload-again-small.png', 'btn/btn-uploading.gif'];
    var btn2 = ['btn/do-pk.png', 'btn/ensure-clothes.png', 'btn/make-picture.png', 'btn/make-picture-small.png', 'btn/start-game.png', 'btn/try-again.png', 'btn/try-choose-team.png', 'btn/try-choose-team-2.png', 'btn/try-choose-team-small.png', 'btn/with-pk.png', 'btn/xwfc.png'];

    img1 = img1.concat(logo, main, chooseClothes, team, upload, smallLogo, smallLogo2, timeRed, timeBlack, shareTips, clothes, btn, btn2, titleTips);

    utils.loadImages(img1, function (loadSize, allSize, percent) {
        _updateLoading(percent);
        if (percent == 1) {
            $loadDiv.hide();
            $pageMain.show();
            _updateMain();
        }
    });


    /**
     *  绑定事件。。。。。。。。。。。。。。。。。。。。。。。。
     *  start
     */

    $('.go-start').on('click', function () {
        _isPk = false;
        _shareToken = '';
        $pageMain.hide();
        _updateChooseTeam();
        $pageChooseTeam.show();
    });

    // 去 pk
    $('#goPk').on('click', function () {
        $pageMain.hide();
        _updateChooseTeam();
        $pageChooseTeam.show();
    });


    // 选择球队
    $('.icon').on('click', function () {
        var $this = $(this);
        var team = $this.data('team');
        _currentTeam = team;
        _updateChooseClothes();
        $pageChooseTeam.hide();
        $pageChooseClothes.show();

    });

    // 选择男 / 女
    $('.gender').on('click', function () {
        var $this = $(this);
        var gender = $this.data('role');
        _gender = gender;
        $('.gender').removeClass('selected');
        $this.addClass('selected');
    });

    // 重新选择
    $('.btn-restart').on('click', function () {
        var $this = $(this);
        var page = $this.data('page');

        if ($this.hasClass('uploading')) {
            return false;
        }

        $pageShare.hide();
        $pageChooseClothes.hide();
        $pageImageUpload.hide();
        $pagePkResult.hide();
        _initPkProcessPage();
        _initSharePage();
        _updateChooseTeam();
        $pageChooseTeam.show();
    });

    $('.btn-upload-pic').on('click', function () {
        $pageShare.hide();
        _updateUploadImg();
        $pageImageUpload.show();
    });

    // 确认球队
    $('.btn-sure').on('click', function () {
        _userName = $('#userName').val();
        _sponsored = $('#sponsored').val() || 'SUNING';

        var flag = $('#userName').data('flag');

        if (!_userName || !_sponsored || (flag === 'first' && _userName === '输入姓名')) {
            utils.showErrorTips('请输入姓名');
            return false;
        }
        _updateUploadImg();
        $pageChooseClothes.hide();
        $pageImageUpload.show();
    });

    // 选择头像
    $('.choose-img').on('click', function () {

        // 正在上传，直接返回
        if ($pageImageUpload.find('.upload-btn').hasClass('uploading')) {
            return false;
        }

        $pageImageUpload.find('.error-tips2').hide();
        $fileSelect.click();
    });

    // 上传照片
    $('.upload-btn').on('click', function () {
        // 正在上传，直接返回
        if ($pageImageUpload.find('.upload-btn').hasClass('uploading')) {
            return false;
        }
        $pageImageUpload.find('.error-tips2').hide();
        $fileSelect.click();
    });


    //生成图片
    $('.btn-do-share').on('click', function () {
        //生成图片
        _doMakePic(MAKE_PIC_TYPE.share);
    });

    // pk
    $('.btn-go-pk').on('click', function () {
        _doPK();
    });

    //
    $('#makePic').on('click', function () {
        _doMakePic(MAKE_PIC_TYPE.pk);
    });

    var tempPosition;
    var mousedown;
    var firstPosition;
    var arrow;// 方向

    $('#chooseClothes').on('mousedown touchstart', function (e) {
        if (e.type == 'touchstart') {
            tempPosition = window.event.touches[0].pageX;
        } else {
            tempPosition = e.X || e.pageX;
            mousedown = true;
        }
        firstPosition = tempPosition;
    });

    $('#chooseClothes').on('mousemove touchmove', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type == 'touchmove') {
            tempPosition = window.event.touches[0].pageX;
        } else {
            if (mousedown) tempPosition = e.X || e.pageX;
        }
        arrow = tempPosition - firstPosition > 0 ? 'right' : 'left';
    });

    $('#chooseClothes').on('mouseup touchend mouseout', function () {
        var result = 0;
        if (arrow == 'right') {
            result = tempPosition - firstPosition;
        }
        else {
            result = firstPosition - tempPosition;
        }
        if (result > 50) {
            _changeClothes(arrow);
        }
    });

    $('.input-team').on('focus', function () {
        var $this = $(this);
        var flag = $this.data('flag');
        if (flag === 'first') {
            $this.val('');
        }
    });

    $('.input-team').on('input', function () {
        var $this = $(this);
        $this.data('flag', 'false');
    });


    $('#userName').on('blur', function () {
        var $this = $(this);
        var flag = $this.data('flag');
        if (flag === 'first') {
            $this.val('输入姓名');
        }
    });

    $('#sponsored').on('blur', function () {
        var $this = $(this);
        var flag = $this.data('flag');
        if (flag === 'first') {
            $this.val('SUNING');
        }
    });

    $('.btn-try-again').on('click', function () {
        $pageShare.hide();
        $pagePkResult.hide();
        _updateChooseTeam();
        _initSharePage();
        _initPkProcessPage();
        _initPkResult();
        _initMainPage();
        $pageMain.show();
    });

    // 分享。。。

    $('.btn-share').on('click', function () {
        $shareMask.show();
    });


    $fileSelect.on('change', function () {
        var file = this.files[0] || {};
        _doUploadHeadPic(file);
    });

    //
    $shareMask.on('click', function () {
        $shareMask.hide();
    });


    /* 音乐 */
    var audio = document.getElementById('J_audio');
    if (isIphone) {
        //微信下兼容处理
        document.addEventListener("WeixinJSBridgeReady", function () {
            audio.play();
        }, false);
    }
    else {
        //
        audio.addEventListener("canplaythrough", function () {
            audio.play();
        }, false);
        audio.load();
    }
    _init();

    /**
     *  绑定事件。。。。。。。。。。。。。。。。。。。。。。。。
     *  end
     */


});
