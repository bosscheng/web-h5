$(function () {
    setTimeout(function () {
        $('.shrinkLabel').animate({'right':'-14%'},"slow","linear",function () {
            $('.shrinkLabel').addClass('shrinkLabel2');
        });
    },5000)
});
function errorHide() {
    setTimeout(function () {
        $('.error_info').animate({'display' : 'none'},"slow")
    },1500);
}
//    手机号验证
function checkPhone(phone){
    var phone = phone;
    if(!(/^1[34578]\d{9}$/.test(phone))){
        errorHide();
        return false;
    }
}
//    邮箱验证
function checkEmail(email){
    var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    if (!re.test(email)) {
        errorHide();
        return false;
    }
}
$('.signUpBtn').off('click').on('click',function () {
    if($('.signUP_name').val() == ""){
        $('.error_info').show().text('请填写姓名');
        errorHide();
        return false;
    }
    if($('.signUP_company').val() == ""){
        $('.error_info').show().text('请填写公司/工号');
        errorHide();
        return false;
    }
    if($('.signUP_duty').val() == ""){
        $('.error_info').show().text('请填写职务');
        errorHide();
        return false;
    }
    if(checkPhone($('.signUP_phoneNum').val()) === false){
        $('.error_info').show().text('手机号码有误，请重填');
        return false;
    }
    if(checkEmail($('.signUP_email').val()) === false){
        $('.error_info').show().text('邮箱有误，请重填');
        return false;
    }
    var jsonT = JSON.stringify({
        root:[
            {name: "公司/工号",value:$('.signUP_company').val()},
            {name: "邮箱",value:$('.signUP_email').val()},
            {name:"职务",value:$('.signUP_duty').val()}
        ]
    });
    var signUpItem = {
        activityId : 333,
        name : $('.signUP_name').val(),
        mobileNumber : $('.signUP_phoneNum').val(),
        email : $('.signUP_email').val(),
        jsonField : jsonT
    };

    $.ajax({
        type : "get",
        url : "http://qrs.suning.com/qrs-web/activityqrcode/signup.htm",
        dataType : "json",
        data : signUpItem,
        success: function (data) {
            $('.signUp_area').hide();
            $('.signUp_success').show();
        },
        error: function(data) {
            $('.signUp_area').hide();
            $('.signUp_success').show();
        }
    });
});