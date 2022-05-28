const mongoose = require('mongoose');

const data = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    pass:{
        type:String,
        required:true
    },
    blogs:[{type:mongoose.Schema.Types.ObjectId, ref : "posts"} ],
    verify :{
        type:Boolean,
        default: false
    }
})


module.exports = mongoose.model("user",data)