var mongoose = require("mongoose");
var thingsOneSchema = require('../../schemas/thingsfiles/thingsOne');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("ThingsOne", thingsOneSchema); //User是起的名字