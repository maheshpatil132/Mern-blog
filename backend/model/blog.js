const mongoose = require('mongoose');

const blog = mongoose.Schema({
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    title  : {
        type:String,
        required:true
    },
    decr   : {
        type:String,
        required:true
    },
    img: {
        type:String,
        required:true
    },

})

module.exports = mongoose.model('posts',blog)