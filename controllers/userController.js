const User = require('../model/user')
const session = require('express-session')
const fast2sms = require('fast-two-sms')
const axios = require('axios')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
require('dotenv').config()
const { Category } = require('../model/category')
const { Product } = require('../model/product')
const { ObjectId } = require('mongodb');
const Banner = require('../model/banner');



//for saving userinfo in db 

const getLanding = async(req,res)=>{
    const banner=await Banner.find({})
    console.log(banner);
    res.render('home',{banner:banner})
}

const registerUser = async (req, res, next) => {
    console.log('register user works');
    const existing = await User.find({ $or: [{ Email: req.body.email }, { phone: req.body.phone }] })
    if (existing == 0) {
        req.session.user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            Email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
        }
        console.log(req.session.user);
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
     console.log('checking otp works and saving');
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

const getUserProducts = async (req, res) => {
    let productList = await Product.find().populate('category');
    // let category =await Category.find()
    // console.log(productList)
    const category = await Category.find({})
    console.log(category);

    if (!productList) {
        res.staus(500).json({ success: false })
    }
    res.render('user-products', { productList: req.session.productList ? req.session.productList : productList, search: req.session.search ? req.session.search : "", category: category })

}

const getSingleProduct = async (req, res) => {
    const id = req.params.id
    // console.log(id);
    const product = await Product.findById({ _id: mongoose.Types.ObjectId(id) }).populate('category')
    // console.log(product)
    const categories = await Category.find({})
    // console.log(categories);
    res.render('user-Singleproduct', { product, categories })
}

const getProfile = async (req, res) => {
    res.render('user-profile')
}


//for edit-user profile

const geteditProfile = async (req, res) => {
    const user = await User.find({ Email: req.session.email });
    // console.log(user);
    res.render('edit-user-profile', { user: user[0] })
}

const updateUser = async (req, res) => {
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

const getAbout = async (req, res) => {
    res.render('about')
}

const geteditAddress = async (req, res) => {
    const user = await User.find({ Email: req.session.email })
    // console.log(user);
    // console.log(user[0].address);
    res.render('edit-address', { user: user[0] })
}

const updateAddress = async (req, res) => {
    console.log('update address working');
    const id = req.params.id
    try {
        const user = await User.find({ Email: req.session.email });
        // console.log(user[0].address);
        // console.log(req.body)
        const { houseName, phone, city, postalCode, state, coutry } = req.body;
        user[0].address[0].houseName = req.body.houseName;
        user[0].address[0].city = req.body.city;
        user[0].address[0].postalCode = req.body.postalCode;
        user[0].address[0].state = req.body.state;
        user[0].address[0].coutry = req.body.coutry;
        await user[0].save();
        console.log('update finished');
        return res.redirect('/user/edit-address')
    } catch (err) {
        console.log(err);
    }
}

const deleteAddress = async (req, res) => {
    console.log('delete works started!!');
    const { id } = req.params;
    try {
        const user = await User.find({ Email: req.session.email });
        console.log(user);
        const index = user[0].address.findIndex((item) => {
            return item._id.valueOf() === id;
        })
        // console.log(index);
        user[0].address.splice(index, 1);
        await user[0].save();
        console.log('saved');
        res.json({ redirect: `/order` });
    } catch (err) {
        console.log(err);
    }

}
//for order view product

const getorderProductview = async (req, res) => {
    // console.log('productvi');
    const user = await User.find({ Email: req.session.email }).populate('order.id');

    console.log(user);
    const orderItems = order.orderItems;
    console.log(orderItems);
    res.render('user-order-view-page', { cartItems: cartItems })
}

const getForgotpass = async (req, res) => {
    res.render('forgot-pass')
}

const phoneverification = async (req, res, next) => {
    const phoneformat = /^\d{10}$/;
    const phone = req.body.phone;
    // console.log(phone.match(phoneformat))
    if (phone.match(phoneformat)) {
        next()
        console.log(req.body.phone);
        req.session.phone = req.body.phone
        console.log(req.session.phone);
        return res.redirect('/user/forgot-otp')
    } else {
        return res.render('forgot-pass', { message: 'Enter a valid a Phone' })
    }
}

const getForgototp = async (req, res) => {
    res.render('forgot-otp')
}

const forgototpVerification = async (req, res) => {
    console.log('check otp for new password')
    console.log(req.session);
    console.log(req.session.otp)
    if (req.body.otp == req.session.otp) {
        try {
            return res.redirect('/user/change-pass')
        } catch (error) {
            console.log(error)
        }
    } else {
        return res.render('forgot-otp', { message: 'Invalid otp Entered' })
    }
}

const changePassword = async (req, res) => {
    res.render('change-pass')
}

const changePasswordpost = async (req, res) => {
    console.log('change controller works');
    console.log(req.session.phone);
    const user = await User.findOne({ phone: req.session.phone })
    console.log(user)
    if (req.body.password1 == req.body.password2) {
        if (user) {
            try {
                const user = await User.updateOne({ phone: req.session.phone }, { $set: { password: req.body.password1 } })
                console.log(user)
                req.session.password = req.body.password1
                return res.redirect('/user/signin')
            } catch (e) {
                console.error(e)
            }
        } else {
            return res.redirect('/changepass')
        }
    } else {
        res.render('change-pass', { message: 'Please Enter same password!' })
    }
}

const searchProducts = async (req, res) => {
    console.log(req.body.input)
    // console.log(req.query.q);
    const searchTerm = req.body.input;
    try {
        const productList = await Product.find({ name: { $regex: searchTerm, $options: 'i' } });
        // console.log(productList);
        console.log(productList.length);
        req.session.search = searchTerm
        req.session.productList = productList

        if(productList.length === 0){
            console.log('if works');
            return res.json({ redirect: ('/user/empty-search') })
        }else{
            console.log('else works');
            return res.json({ redirect: ('/user/products') })
        }
        
    } catch (error) {
        res.status(500).send(error.message);
    }

}



const categoryWise = async (req, res) => {
    console.log('category controller works!');
    const { id } = req.params;
    console.log(id);
    const productList = await Product.find({ category: ObjectId(id) }).exec();
    console.log('category wise filtration');
    console.log(productList);
    //   res.send(productList);
    const category = await Category.find({})
    console.log(category);
    if (productList.length === 0) {
        res.render('empty-cat-products', { search: req.session.search ? req.session.search : "", category: category })
    } else {
        res.render('user-products', { productList: productList, search: req.session.search ? req.session.search : "", category: category })
    }
};


const emptySearch  = async (req,res)=>{
    const category = await Category.find({})
    console.log(category);
    res.render('empty-cat-products',{ search: req.session.search ? req.session.search : "", category: category })
}



module.exports = {
    registerUser,
    generateOtp,
    sendOtp,
    checkOtp,
    getUserProducts,
    getSingleProduct,
    getProfile,
    geteditProfile,
    updateUser,
    getAbout,
    geteditAddress,
    updateAddress,
    deleteAddress,
    getorderProductview,
    getForgotpass,
    phoneverification,
    getForgototp,
    forgototpVerification,
    changePassword,
    changePasswordpost,
    searchProducts,
    categoryWise,
    emptySearch,
    getLanding
}