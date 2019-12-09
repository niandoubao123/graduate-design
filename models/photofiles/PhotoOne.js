var mongoose = require("mongoose");
var photoOneSchema = require('../../schemas/photofiles/photoOne');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("PhotoOne", photoOneSchema); //User是起的名字