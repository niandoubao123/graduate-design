var mongoose = require("mongoose");
var addCarSchema = require('../../schemas/thingsfiles/addCar');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("AddCar", addCarSchema); //User是起的名字