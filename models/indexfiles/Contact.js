var mongoose = require("mongoose");
var contactSchema = require('../../schemas/indexfiles/contact');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("Contact", contactSchema); //User是起的名字