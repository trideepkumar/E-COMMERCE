const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Register = require('../../model/user')
const bcrypt = require("bcrypt");
const { emitKeypressEvents } = require('readline');
const session = require('express-session');
const userController = require('../../controllers/userController')
const userAuth =require('../../middlewares/userAuth');
const adminAuth = require('../../middlewares/adminAuth');

//for cache control


router.get('/signup' ,(req, res) => {
    if(req.session.email){
        res.redirect('/user/home')
    }else
   return res.render('signup')
})
router.post('/signup',userController.registerUser, userController.generateOtp)

router.post('/otp',userController.checkOtp)

router.get('/otp',(req,res)=>{
    res.render('user-otp')
})

router.get('/signin',(req, res) => {

    if(req.session.email){
        res.redirect('/user/home')
    }else
   return res.render('signin')
})

router.post('/signin',async (req, res) => {

    const user = await Register.findOne( { Email: req.body.email } )
    if(user) {
            
                try {
                    
                    const match = await bcrypt.compare(req.body.password,user.password)
                    if(!match){
                        console.log('1');
                    return res.render('signin',{message2:'invalid password entered!'})
                    }else if(user.Action==false){
                        console.log(user.Action);
                        return res.render('signin',{message2:'You cannot signin '})
                    }
                    else{
                        let session =req.session;
                        session.email =req.body.email;
                    res.redirect('/user/home')
                  }
              } catch (error) {
                console.log(error)
              }
        }else{
            console.log(user);
            return res.render('signin', {message2: 'User does not exist!' })
    
        }
})

router.get('/home',(req, res) => {
    res.render('home')
})

//for session logout
router.get('/logout',(req,res) => {
    req.session.destroy();
    res.render('signin');
  });

router.get('/products',userController.getUserProducts)



  

module.exports = router
