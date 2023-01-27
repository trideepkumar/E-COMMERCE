const mongoose = require('mongoose')
const bcrypt = require("bcrypt");



const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  Action: {
    type: Boolean,
    default: true
  },
  cart: [
    {
      id: {
        type: mongoose.SchemaTypes.ObjectId ,
        ref: "Product"
      },
      quantity: {
        type: Number
      },
      increment: {
        type: Boolean
      },
      decrement: {
        type: Boolean
      }
    }
  ],
  address: [
    {
        houseName: {
          type : String ,
          required: true
        } ,
        phone: {
          type : Number ,
          required: true
        },
        city: {
          type : String ,
          required: true
        } ,
        postalCode: {
          type : String ,
          required: true
        },
        state: {
          type : String ,
          required: true
        },
        coutry: {
          type : String ,
          required: true
        }
    }
] 

})


userSchema.pre('save', async function (next) {
  try {
    hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
    next();
  } catch (error) {
    console.log(error)
  }
})


const User = mongoose.model('User', userSchema)
module.exports = User 