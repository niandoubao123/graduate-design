var goods = [];

$('.jhcd ul li .Add').each(function (idx, item) {
    $(item).click(function () {
        //存数据库
         $.ajax({
             type: 'POST',
             url: '/api/AddCar/post',
             data: {
                 userid: $('.jhcd ul li').eq(idx).find('#userId').val(),
                 goodstitle: $('.jhcd ul li').eq(idx).find('#goodsTitle').val(),
                 goodsurl: $('.jhcd ul li').eq(idx).find('#goodsUrl').val(),
                 goodsmoney: $('.jhcd ul li').eq(idx).find('#goodsMoney').val()
             },
             success: function (responseData) {
                //  console.log(responseData);
                 renderGood(responseData.data.goods);
             }
         })
    })
});
$('.jhyp ul li .Add').each(function (idx, item) {
    $(item).click(function () {
        $.ajax({
            type: 'POST',
            url: '/api/AddCar/post',
            data: {
                userid: $('.jhyp ul li').eq(idx).find('#userId').val(),
                goodstitle: $('.jhyp ul li').eq(idx).find('#goodsTitle').val(),
                goodsurl: $('.jhyp ul li').eq(idx).find('#goodsUrl').val(),
                goodsmoney: $('.jhyp ul li').eq(idx).find('#goodsMoney').val()
            },
            success: function (responseData) {
                // console.log(responseData);
                renderGood(responseData.data.goods);
            }
        })
    })
});
//页面重载加载订单所有信息
$.ajax({
    url: '/api/AddCar',
    data: {
        userid: $('.jhyp ul li').find('#userId').val()
    },
    success: function (responseData) {
        renderGood(responseData.data);
    }
})

function renderGood(goods){
    var html ="";
    var money = 0;
    if(goods.length>0){
        $('.car h2').css("display","none");
    }
   for(var i = 0;i<goods.length;i++){
       html += '<li><div><img src="'+goods[i].goodsUrl+'" alt=""></div><div>' + goods[i].goodsTitle + '</div><div>' + goods[i].goodsMoney + '</div>'+
       '<div> <a href="/addCar/delete?title='+goods[i].goodsTitle+'">删除</a ></div></li>'
       money += Number(goods[i].goodsMoney.split('￥')[1]);
    }
    $('.car .sumshu span').html(goods.length)
    $('.car .summoney span').html(money)
    $('.car-wrap .car ul').html(html);
}
