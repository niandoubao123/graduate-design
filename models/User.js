var mongoose = require("mongoose");
var usersSchema = require('../schemas/user');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("User", usersSchema); //User是起的名字