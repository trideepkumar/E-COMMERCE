const User = require('../model/user')
const session = require('express-session')
const fast2sms = require('fast-two-sms')
const axios = require('axios')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
require('dotenv').config()
const { Category } = require('../model/category')
const { Product } = require('../model/product')


//for saving userinfo in db 

const registerUser = async (req, res, next) => {
    const existing = await User.find({ $or: [{ Email: req.body.email }, { phone: req.body.phone }] })
    if (existing == 0) {
        req.session.user = {
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            Email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
        }
        res.render('user-otp')
        return next()
    } else {
        return res.render('signup', { message1: 'User Already Exists' })
    }
}

const generateOtp = (req, res, next) => {
    otp = Math.floor(100000 + Math.random() * 900000)
    // console.log(otp)
    sendOtp(otp, req.body.phone)
    req.session.otp = otp
}

const sendOtp = (otp, number) => {
    console.log(otp)
    const body = {
        "authorization": process.env.authorization,
        "variables_values": otp,
        "route": "otp",
        "numbers": number
    }
    return axios({
        method: 'GET',
        url: 'https://www.fast2sms.com/dev/bulkV2',
        data: body
    })
}

const checkOtp = async (req, res) => {

    //   console.log(otp)
    //   console.log(req.body.otp)
    //   console.log(req.session.user)
    if (req.body.otp == req.session.otp) {
        const user = new User(req.session.user)
        try {
             
            await user.save()
            return res.redirect('/user/signin')
        } catch (error) {
            console.log(error)
            return res.render('signup')
        }
    } else {
        return res.send('invalid otp entered')
    }
}

const getUserProducts = async (req,res)=>{
    const productList=await Product.find().populate('category');
    // console.log(productList)
    if(!productList){
        res.staus(500).json({success:false})
      }
      res.render('user-products',{productList}) 
   
}

const getSingleProduct = async (req,res)=>{
    const id = req.params.id
    // console.log(id);
    const product = await Product.findById({ _id: mongoose.Types.ObjectId(id) }).populate('category')
    // console.log(product)
    const categories = await Category.find({})
    // console.log(categories);
    res.render('user-Singleproduct',{product,categories})
}

const getProfile = async (req,res)=>{
    res.render('user-profile')
}





module.exports = {
    registerUser,
    generateOtp,
    sendOtp,
    checkOtp,
    getUserProducts,
    getSingleProduct,
    getProfile ,
    
}