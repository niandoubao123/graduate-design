var mongoose = require("mongoose");
var photoThreeSchema = require('../../schemas/photofiles/photoThree');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("PhotoThree", photoThreeSchema); //User是起的名字