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


//for edit-user profile

 const geteditProfile = async(req,res)=>{
    const user = await User.find({ Email: req.session.email });
    // console.log(user);
    res.render('edit-user-profile', {user: user[0]})
 }
 
const  updateUser = async(req,res)=>{
    console.log(' user update working started!!');
    console.log(req.params);
    const id = req.params.id
    console.log(id);
    console.log(req.body);
    // console.log(req.files);
    // console.log(id);
    try {
        // console.log(id);
        // console.log(req.body.firstname)
        // console.log(req.body.lastname)
        // console.log(req.body.email);
        // console.log(req.body.phone);
        
        console.log('work update!!');
        await User.findByIdAndUpdate(id, req.body);
        console.log(' user edit updated ?');
        return res.redirect('/user/edit-profile')
    } catch (e) {
        console.log(e);
    }

}

const getAbout = async(req,res)=>{
    res.render('about')
}

const geteditAddress = async(req,res)=>{
    const user = await User.find({Email:req.session.email})
    // console.log(user);
    // console.log(user[0].address);
    res.render('edit-address',{user:user[0]})
}

const updateAddress = async(req,res)=>{
    console.log('update address working');
    const id = req.params.id    
    try{
        const user = await User.find({ Email: req.session.email });
        // console.log(user[0].address);
        // console.log(req.body)
        const { houseName , phone , city , postalCode , state, coutry } = req.body ;
        user[0].address[0].houseName = req.body.houseName;
        user[0].address[0].city = req.body.city;
        user[0].address[0].postalCode = req.body.postalCode;
        user[0].address[0].state =req.body.state;
        user[0].address[0].coutry = req.body.coutry;
        await user[0].save();
        console.log('update finished');
        return res.redirect('/user/edit-address')
    }catch(err){
        console.log(err);
    }
} 

const deleteAddress = async(req,res)=>{
    console.log('delete works started!!');
    const { id } = req.params;
    try {
        const user = await User.find({ Email: req.session.email });
        console.log(user);
        const index = user[0].address.findIndex((item) => {
            return item._id.valueOf() === id ;
        })
        // console.log(index);
        user[0].address.splice(index , 1);
        await user[0].save();
    console.log('saved');
        res.json({redirect: `/order`});
    } catch (err) {
        console.log(err);
    }

}
//for order view product

const getorderProductview = async(req,res)=>{
    // console.log('productvi');
    const user = await User.find({ Email: req.session.email }).populate('order.id');
    console.log(user);
    const orderItems = order.orderItems;
    console.log(orderItems);
    res.render('user-order-view-page', {cartItems: cartItems})
}

module.exports = {
    registerUser,
    generateOtp,
    sendOtp,
    checkOtp,
    getUserProducts,
    getSingleProduct,
    getProfile ,
    geteditProfile,
    updateUser,
    getAbout,
    geteditAddress,
    updateAddress,
    deleteAddress,
    getorderProductview
}