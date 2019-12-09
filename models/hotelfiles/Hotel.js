var mongoose = require("mongoose");
var hotelSchema = require('../../schemas/hotelfiles/hotel');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("Hotel",hotelSchema); //User是起的名字