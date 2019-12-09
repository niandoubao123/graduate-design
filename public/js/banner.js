var idx = 0;
var timer;
clearInterval(timer);
timer = setInterval(auto, 3000);
$('.banner .right').click(auto);
$('.banner .left').click(function () {
    idx--;
    if (idx < 0) {
        idx = $('.imglist ul li').length - 1;
    }
    $('.imglist ul li').eq(idx).addClass('current').siblings().removeClass('current');
    dot(idx);
})

function auto() {
    idx++;
    // console.log(idx)
    if (idx > $('.imglist ul li').length - 1) {
        idx = 0;
    }
    $('.imglist ul li').eq(idx).addClass('current').siblings().removeClass('current');
    dot(idx);
}
$('.banner').mouseenter(function () {
    clearInterval(timer);
})
$('.banner').mouseleave(function () {
    clearInterval(timer);
    timer = setInterval(auto, 3000);
})

function dot(num) {
    $('.circle ol li').eq(num).addClass('current').siblings().removeClass('current');
}
$('.circle ol li').each(function (idx, item) {
    $(item).click(function () {
        $(item).addClass('current').siblings().removeClass('current');
        $('.imglist ul li').eq(idx).addClass('current').siblings().removeClass('current');
    })
});
$('.close').click(function () {
    $('.tanchuang').animate({
        'opacity': 0
    });
});
var res = 0;
var timerr;
timerr = setInterval(function(){
    res++;
    if(res>1){
        res = 0;
    }
    $('.example-bottom-wrap').animate({'left':-res*1200},1000);
},5000)

$('.tablist li').each(function (idx, item) {
    $(item).click(function () {
        $(item).addClass('selected').siblings().removeClass('selected');
        $('.tabb ul').eq(idx).addClass('selected').siblings().removeClass('selected');
    })
});