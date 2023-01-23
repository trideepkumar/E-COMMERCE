

const mongoose= require('mongoose');
const productSchema=new mongoose.Schema({
    name:{
      type: String,
      required: true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required: true,
      },
    price:{
      type:Number,
      default:0, 
      required: true,
    },
    image:[{
      type: String,
      required: [true,'images added '],
    }],  
    description:{
      type: String,
      required: true,
    },
    
  })  
  
  const Product = mongoose.model('Product', productSchema);

  module.exports={Product}