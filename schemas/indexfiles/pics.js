var mongoose = require("mongoose");
//创建用户表结构，再创建模型
module.exports = new mongoose.Schema({
   name:String,
   url:String
})