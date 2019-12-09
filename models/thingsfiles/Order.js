var mongoose = require("mongoose");
var orderSchema = require('../../schemas/thingsfiles/order');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("Order", orderSchema, 'orders'); //User是起的名字
// var Order = mongoose.model("Order", orderSchema, 'order'); //指定表