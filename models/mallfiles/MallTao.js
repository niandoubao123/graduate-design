var mongoose = require("mongoose");
var mallTaoSchema = require('../../schemas/mallfiles/mallTao');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("MallTao", mallTaoSchema); //User是起的名字