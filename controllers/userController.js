const User = require('../model/user')
const session = require('express-session')
const fast2sms = require('fast-two-sms')
const axios = require('axios')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
require('dotenv').config()

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
        console.log(req.session.user)
        res.render('user-otp')
        return next()
    } else {
        return res.render('signup', { message1: 'User Already Exists' })
    }
}



const generateOtp = (req, res, next) => {
    otp = Math.floor(100000 + Math.random() * 900000)
    console.log(otp)
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




module.exports = {
    registerUser,
    generateOtp,
    sendOtp,
    checkOtp,
    

}