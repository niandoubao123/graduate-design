var mongoose = require("mongoose");
var mallStoreSchema = require('../../schemas/mallfiles/mallStore');
//利用之前的表结构进行创建模型，再暴露
module.exports = mongoose.model("MallStore", mallStoreSchema); //User是起的名字