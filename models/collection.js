var mongoose = require("mongoose");
var collectionSchema = require('../schemas/collection');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("Collection", collectionSchema); //User是起的名字