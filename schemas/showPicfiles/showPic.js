var mongoose = require("mongoose");
//创建用户表结构，再创建模型
module.exports = new mongoose.Schema({
    title: String,
    content: String,
    url: String,
    user:String,
    //添加时间
    addTime: {
        type: Date,
        default: new Date()
    },
     //阅读量
    views: {
        type: Number,
        default: 0
    },
     //评论
    comments: {
        type: Array,
        default: []//存放名字内容时间
    }
})