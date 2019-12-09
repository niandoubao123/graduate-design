var mongoose = require("mongoose");
//创建用户表结构，再创建模型
module.exports = new mongoose.Schema({
    username: String,
    password: String,
    mail:String,
    phone:Number,
    isAdmin: { //添加管理员字段
        type: Boolean,
        default: false
    },
    goods: {
        type: Array,
        default: [] //存放名字内容时间
    },
    
})