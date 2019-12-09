var mongoose = require("mongoose");
var picsSchema = require('../../schemas/indexfiles/pics');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("Pic", picsSchema); //User是起的名字