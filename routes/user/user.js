const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Register = require('../../model/user')
const bcrypt = require("bcrypt");
const { emitKeypressEvents } = require('readline');
const session = require('express-session');
const userController = require('../../controllers/userController')
const userAuth = require('../../middlewares/userAuth');
const Banner = require('../../model/banner');

// const adminAuth = require('../../middlewares/adminAuth');


router.get('/',userController.getLanding);


//for cache control



router.get('/signup',userAuth.isLoggedOut, (req, res) => {
    if (req.session.email) {
        res.redirect('/user/home')
    } else
        return res.render('signup')
})

router.get('/otp',userAuth.isLoggedOut, (req, res) => {
    res.render('user-otp')
})

router.get('/signin',userAuth.isLoggedOut, (req, res) => {

    if (req.session.email) {
        res.redirect('/user/home')
    } else
        return res.render('signin')
})


router.get('/home', userAuth.isLoggedIn, async(req, res) => {
    const banner=await Banner.find({})
    console.log(banner);
    res.render('home',{banner:banner})
})

//for session logout
router.get('/logout',userAuth.isLoggedIn, (req, res) => {
    req.session.destroy();
    res.render('signin');
});

router.get('/products', userController.getUserProducts)

router.get('/singleProduct/:id',userAuth.isLoggedIn, userController.getSingleProduct)



router.post('/signup',userAuth.isLoggedOut,userController.registerUser, userController.generateOtp)

router.post('/otp',userAuth.isLoggedOut, userController.checkOtp)


router.post('/signin', async (req, res) => {

    const user = await Register.findOne({ Email: req.body.email })
    console.log(user)
    if (user) {
        try {
            console.log('try works!!');
            const match = await bcrypt.compare(req.body.password,user.password)
            console.log(match);
            if (!match && !user.password) {
                console.log('1');
                return res.render('signin', { message2: 'invalid password entered!' })
            } else if (user.Action == false) {
                console.log(user.Action);
                return res.render('signin', { message2: 'You cannot signin ' })
            }
            else {
                let session = req.session;
                req.session.user=user;
                session.email = req.body.email;
                res.redirect('/user/home')
            }
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log(user);
        return res.render('signin', { message2: 'User does not exist!' })

    }
})

router.get('/profile',userAuth.isLoggedIn,userController.getProfile)

router.get('/edit-profile',userAuth.isLoggedIn, userController.geteditProfile)

router.get('/edit-address',userAuth.isLoggedIn,userController.geteditAddress)

router.delete('/address-delete/:id',userAuth.isLoggedIn,userController.deleteAddress)

//for editing profile

router.post('/edit-user/:id',userAuth.isLoggedIn,userController.updateUser)

router.post('/edit-address/:id',userAuth.isLoggedIn,userController.updateAddress)

router.get('/about',userController.getAbout)

//for order view page 

router.get('/order-product-view-page',userAuth.isLoggedIn, userController.getorderProductview)

router.get('/forgot-pass',userController.getForgotpass)

router.post('/forgot-pass', userController.phoneverification,userController.generateOtp)

router.get('/forgot-otp',userController.getForgototp)

router.post('/forgot-otp',userController.forgototpVerification)

router.get('/change-pass', userController.changePassword)

router.post('/change-pass',userController.changePasswordpost)

//for searching products

router.post('/search',userController.searchProducts)

//for category filter

router.get('/category-wise/:id', userController.categoryWise)

router.get('/empty-search',userController.emptySearch)

module.exports = router
