const mongoose = require('mongoose')
const bcrypt = require("bcrypt");



const userSchema = new mongoose.Schema({
   Email:{
        type: String,
        required:true,
    },
    phone: {
        type: String,
        required:true
    },
    password: {
        type:String,
        required:true
    }, 
    
})


userSchema.pre('save', async function(next){
    try {
      hashedPassword = await bcrypt.hash(this.password, 10)
      this.password = hashedPassword
      next();
    } catch (error) {
      console.log(error)
    }
  })
  

const User =mongoose.model('User',userSchema)
module.exports=User