var mongoose = require("mongoose");
var showPicSchema = require('../../schemas/showPicfiles/showPic');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("ShowPic", showPicSchema); //User是起的名字