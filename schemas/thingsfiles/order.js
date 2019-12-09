var mongoose = require("mongoose");
module.exports = new mongoose.Schema({
    username:String,
    goods:{
        type:Array
    },
    cost: Number,
    status:String,
    place:String
})
