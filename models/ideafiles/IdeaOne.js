var mongoose = require("mongoose");
var ideaOneSchema = require('../../schemas/ideafiles/ideaOne');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("IdeaOne", ideaOneSchema); //User是起的名字