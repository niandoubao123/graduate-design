var mongoose = require("mongoose");
var thingsTwoSchema = require('../../schemas/thingsfiles/thingsTwo');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("ThingsTwo", thingsTwoSchema); //User是起的名字