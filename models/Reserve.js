var mongoose = require("mongoose");
var reserveSchema = require('../schemas/reserve');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("Reserve", reserveSchema); //User是起的名字