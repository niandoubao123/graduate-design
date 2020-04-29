var mongoose = require("mongoose");
var addressSchema = require('../schemas/address');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("Address", addressSchema); //User是起的名字