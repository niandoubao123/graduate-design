window.onscroll = function(){
    var ttop = document.documentElement.scrollTop;
    if(ttop>99){
        $('.nav').css('top',0);
        $('.nav').css('z-index',999);
        $('.maodian').css('opacity', "0")
    }else{
        $('.nav').css('top','30px');
        $('.nav').css('z-index',0);
        $('.maodian').css('opacity', "0")
    }
    if(ttop>700){
        $('.letsgo').css('opacity',"1")
        $('.maodian').css('opacity',"1")
    }else{
        $('.letsgo').css('opacity',"0")
    }
}

