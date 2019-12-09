var mongoose = require("mongoose");
var invitationSchema = require('../schemas/invitation');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("Invitation", invitationSchema); //User是起的名字