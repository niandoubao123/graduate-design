     $('.piclist ul li').click(function () {
         var id = $(this).data("to");
         $('html,body').animate({
             scrollTop: $('#' + id).offset().top-100}, 800);
     });
     $('.letsgo ul li').click(function(){
         var id = $(this).data("to");
         $('html,body').animate({
             scrollTop: $('#' + id).offset().top - 100
         }, 800);
     })
     $('.gobot').click(function () {
         var id = $(this).data("to");
         $('html,body').animate({
             scrollTop: $('#' + id).offset().top - 100
         }, 800);
     })
