const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const session = require('express-session');
const adminController = require('../../controllers/adminController');
const {uploadOptions} = require('../../config/multer')
const adminAuth=require('../../middlewares/adminAuth')
const order = require('../../model/order');



router.get('/admin-log',adminAuth.isLoggedOut,adminController.getLogin );

router.get('/admin-dash',adminAuth.isLoggedIn,adminController.getadminDash );

//for chart 
router.get('/chart',adminController.getchartData)

router.get('/generateTable',adminController.generateTable)

router.get('/report-Download',adminController.getreportDownload)

router.get('/excel-Data',adminController.excelTable)



router.get('/admin-user',adminAuth.isLoggedIn,adminController.adminUser);

router.get('/category',adminController.getCategory);

router.get('/add-category',adminAuth.isLoggedIn,adminController.getAddCategory)

router.get('/products',adminAuth.isLoggedIn,adminController.getProducts)

router.get('/add-products',adminAuth.isLoggedIn,adminController.getAddproducts)

router.get('/edit/product/:id',adminAuth.isLoggedIn,adminController.editProduct)


 
router.post('/add-products',uploadOptions.array('fileName',4),adminController.addProducts)

router.post('/add-category',adminController.addCategory)

router.post('/admin-log', adminController.postLogin)

router.put('/admin-user/block/:id',adminController.actionBlock)

router.put('/category/:id',adminController.deleteCategory)

router.post('/edit/:id',uploadOptions.array('fileName',4),adminController.updateProduct)

router.delete('/products/delete/:_id',adminController.deleteProduct)  


router.get('/coupons', adminController.getcouponDash)

router.get('/add-coupons',adminController.addCoupons)

router.post('/add-coupons',adminController.postaddCoupon)

router.put('/updatecoupon/:id' , adminController.updateCoupon)

//for admin order list 

router.get('/admin-order',adminController.adminOrder)

router.put('/admin-order-cancel/:id' ,adminController.cancelOrder); 

router.put('/admin-deliver-order/:id',adminController.deliverOrder)

router.put('/admin-return-order/:id',adminController.returnOrder)

//for refund 
router.put('/admin-refund-order/:id',adminController.refundOrder)


///for banners

router.get('/banner',adminController.getBanner)

router.get('/add-banner', adminController.getAddBanner)

router.post('/post-add-banner',adminController.addBanner)

//for session logout
router.get('/logout',adminController.getLogout);







module.exports = router
