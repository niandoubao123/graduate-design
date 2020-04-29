 $('#buy').click(function () {
       var cost = $('#summoney span').html();
       var place = $('#placewhere input').val();
       var username = $('input#userId').val();
        if (cost  == 0) {
            alert('请选择商品！！！！');
            return;
        }
        if(place==''){
            alert("请选择地址");
            return;
        }
        // 像服务器发送付款请求确认
        $.ajax({
            url: '/payinfo',
            data: {
                cost: cost,
                place:place,
                username:username
            },
            success: (res) => {
                // 请求正确时接收服务器的响应，再次确认是否需要生成订单
                if (res.code === 200) {
                    let info = `
                        购买人：${res.username}\n
                        购买地址：${res.place}\n
                        总共价钱：${res.cost}￥\n
                        确认创建订单进行购买吗？???
                        `;
                    if (confirm(info)) {
                        // 利用 ajax 发送订单生成订单请求
                        $.ajax({
                            type: 'post',
                            url: '/createOrder',
                            data: {
                                cost: cost,
                                place:place,
                                username: username
                            },
                            // 服务器向支付宝请求订单后，返回的是一个form表单，需要插入到浏览器中进行自动跳转
                            success: function (res) {
                                console.log(res,'创建订单???')
                                $('body').append($(res));
                            }
                        })
                    }
                }
            }
        })
 })