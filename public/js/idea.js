$('.titles li').each(function (idx, item) {
    $(item).mouseenter(function () {
        $(item).addClass('active').siblings().removeClass('active');
        $('.contents').eq(idx).addClass('current').siblings().removeClass('current');
    })
});