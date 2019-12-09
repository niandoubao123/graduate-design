var mongoose = require("mongoose");
var piccsSchema = require('../../schemas/indexfiles/piccs');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("Picc", piccsSchema); //User是起的名字