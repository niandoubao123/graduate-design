$('.status1').click(()=>{
    alert("请先登录")
})
$('.jiudian .status').each((index,item)=>{
    $(item).click(()=>{
        $.ajax({
            type:'post',
            url:'/api/hotelCollection',
            data: {
                collectionId: $(item).next().val(),
                title: $(item).next().next().val(),
                money: $(item).next().next().next().val(),
                place: $(item).next().next().next().next().val(),
                url: $(item).next().next().next().next().next().val(),
            },
            dataType:'json',
            success:(result)=>{
                console.log(result)
                if(result.code==200){
                    alert(result.msg)
                    // window.location.reload()
                }
            }
        })
    })
})
$('.lvpai-bottom-xia .status').each((index, item) => {
    $(item).click(() => {
        alert('预定成功')
    })
})
