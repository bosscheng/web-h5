var ran=0;
var range1=5;
var range2=9;
var myNumber1;
var myNumber2;
var myNumber3;
/*将产生随机数的方法进行封装*/
function sjs(range) {
    ran = Math.random()*range;//[0,range)的随机数
    var result = parseInt(ran);//将数字转换成整数
    return result;
}
/*对显示随机数的方法进行封装*/
function showRandomNum1() {
    var figure= sjs(range1);
    $(".numArea1").html(figure);
}
function showRandomNum2() {
    var figure= sjs(range2);
    $(".numArea2").html(figure);
}
function showRandomNum3() {
    var figure= sjs(range2);
    $(".numArea3").html(figure);
}
function keydown() {
    if (window.event.keyCode == 13){
        $("#start").click();
    }else if(window.event.keyCode == 32){
        $("#stop").click();
    }
}
$(function () {

    /*点击开始按钮,产生的事件*/
        $("#start").click(function () {
            $('#start').hide();
            $('#stop').show();
            myNumber1 = setInterval(showRandomNum1,12);//多长时间运行一次
            myNumber2 = setInterval(showRandomNum2,25);//多长时间运行一次
            myNumber3 = setInterval(showRandomNum3,21);//多长时间运行一次
        });

    /*点击结束按钮*/
        $("#stop").click(function () {
            if($(".numArea1").html()=='0' && $(".numArea2").html()=='0'){
                $(".numArea3").html('8');
            }
            clearInterval(myNumber1);
            clearInterval(myNumber2);
            clearInterval(myNumber3);
            $('#stop').hide();
            $('#start').show();
        });

});
