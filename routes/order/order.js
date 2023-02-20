const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderController')
const userAuth = require('../../middlewares/userAuth');
const order = require('../../model/order');



router.get('/', userAuth.isLoggedIn, orderController.getOrder);

router.post('/address/:id', userAuth.isLoggedIn, orderController.newShippingAddress);

router.post('/create', userAuth.isLoggedIn, orderController.createOrder);

router.get('/success', userAuth.isLoggedIn, orderController.orderSuccess)

//for razor pay order success

// razorpay success
router.put('/success/:id', userAuth.isLoggedIn, orderController.razorPaySuccess);



router.get('/user-order', userAuth.isLoggedIn, orderController.getUserOrder)

router.put('/cancel/:id', userAuth.isLoggedIn, orderController.cancelOrder);

router.put('/return/:id', userAuth.isLoggedIn, orderController.returnOrder)




//for coupon apply

router.get('/user-coupon', userAuth.isLoggedIn, orderController.getCouponpage)

router.post('/coupon', userAuth.isLoggedIn, orderController.applyCoupon)



module.exports = router;