var prepage = 10;
var page = 1;
var pages = 0;
var comments = [];

//提交评论
$('#messageBtn').on('click', function () {
    $.ajax({
        type: 'POST',
        url: '/api/comment/post',
        data: {
            contentid: $('#showPicId').val(),
            content: $('#messageContent').val()
        },
        success: function (responseData) {
            console.log(responseData);
            $('#messageContent').val('');//清空上次输入
            comments = responseData.data.comments.reverse();
            renderComment();
        }
    })
});

//每次页面重载的时候获取一下该文章的所有评论
$.ajax({
    url: '/api/comment',
    data: {
        showPicid: $('#showPicId').val()
    },
    success: function (responseData) {
        comments = responseData.data.reverse();
        renderComment();
    }
});

function renderComment() {

    $('#messageCount').html(comments.length);

    pages = Math.max(Math.ceil(comments.length / prepage), 1);
    var start = Math.max(0, (page - 1) * prepage);
    var end = Math.min(start + prepage, comments.length);

    if (comments.length == 0) {
        $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>');
    } else {
        var html = '';
        for (var i = start; i < end; i++) {
            html += '<div class="messageBox">' +
                '<p class="name clear">评论人:<span class="fl">' + comments[i].username + '</span>评论时间：<span class="fr">' + formatDate(comments[i].postTime) + '</span></p><p style="margin-top:0;">' + comments[i].content + '</p>' +
                '</div>';
        }
        $('.messageList').html(html);
    }

}

function formatDate(d) {
    var date1 = new Date(d);
    return date1.getFullYear() + '年' + (date1.getMonth() + 1) + '月' + date1.getDate() + '日 ' + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
}