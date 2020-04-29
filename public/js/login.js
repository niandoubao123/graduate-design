//注册

$(function () {
         var $loginBox = $('#loginBox');
         var $registerBox = $('#registerBox');
    //注册
    $('.zhucebtn').on('click', function () {
        console.log("注册按钮")
            //通过ajax提交请求
            $.ajax({
                type: 'post',
                url: '/api/user/register',
                data: {
                    username: $registerBox.find('[name="username"]').val(),
                    password: $registerBox.find('[name="password"]').val(),
                },
                dataType: 'json',
                success: function (result) {
                    console.log(result)
                    if (!result.code) {
                        //注册成功
                        setTimeout(function () {
                            alert('注册成功');
                        }, 1000);
                    }else{
                        alert(result.message)
                    }

                }
            });
    });
//    登录
$('#dian').click(function () {
    console.log("aa")
    $('.loginwrap').css('display', 'block');
    $('.denglubtn').click(function () {
           $.ajax({
               type: 'post',
               url: '/api/user/login',
               data: {
                   username: $loginBox.find('[name="username"]').val(),
                   password: $loginBox.find('[name="password"]').val()
               },
               dataType: 'json',
               success: function (result) {
                    alert(result.message);         
                   if (!result.code) {    
                      $('.loginwrap').css('display', 'none');
                      $('.nav-top-left a').hide();
                      $('.nav-top-left div').css('display', 'block');
                      window.location.reload();
                   }
               }
           })

    })
})
 $('.logout').on('click', function () {
     $.ajax({
         url: '/api/user/logout',
         success: function (result) {
             if (!result.code) {
                 window.location.reload();
             }
         }
     });
 })
 
 $('#callbtn').on('click', function () {
      $.ajax({
          type: 'post',
          url: '/api/user/contact',
          data: {
              phoneNumber: $('#phoneNumber').val(),
              honeyName:   $('#honeyName').val(),
          },
          dataType: 'json',
          success: function (result) {
              if(result.code==1){
                  alert('该用户已经提交过，不能重复提交');
                  window.location.reload();
              }else{
                   setTimeout(function () {
                       alert('提交信息成功，稍后会有客服联系您');
                       window.location.reload();
                   }, 1000);
              }
               

          }
      });
  });


})