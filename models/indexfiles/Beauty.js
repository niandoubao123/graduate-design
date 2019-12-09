var mongoose = require("mongoose");
var beautySchema = require('../../schemas/indexfiles/beauty');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("Beauty", beautySchema); //User是起的名字