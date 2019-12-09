var mongoose = require("mongoose");
var photoTwoSchema = require('../../schemas/photofiles/photoTwo');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("PhotoTwo", photoTwoSchema); //User是起的名字