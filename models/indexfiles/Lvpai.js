var mongoose = require("mongoose");
var lvpaiSchema = require('../../schemas/indexfiles/lvpai');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("Lvpai", lvpaiSchema); //User是起的名字