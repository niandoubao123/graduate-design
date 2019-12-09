var mongoose = require("mongoose");
var citySchema = require('../../schemas/indexfiles/city');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("City", citySchema); //User是起的名字