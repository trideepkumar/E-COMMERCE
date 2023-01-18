const mongoose= require('mongoose');
const categorySchema=new mongoose.Schema({
    name:{
        type: String,
        required:true, 
    },
    Delete:{
        type:Boolean,
        default:true,
    }
    
})

exports.Category = mongoose.model('Category',categorySchema)