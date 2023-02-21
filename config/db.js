const mongoose = require('mongoose')
require('dotenv').config()


mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URL)
.then(()=> {
  console.log('Connected to database')
})
.catch(error =>{
  console.log(`failed connect to database`)
})

module.exports = mongoose.connection