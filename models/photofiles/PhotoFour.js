var mongoose = require("mongoose");
var photoFourSchema = require('../../schemas/photofiles/photoFour');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("PhotoFour", photoFourSchema); //User是起的名字