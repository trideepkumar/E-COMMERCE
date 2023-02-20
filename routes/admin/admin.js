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
router.get('/chart',adminAuth.isLoggedIn,adminController.getchartData)

router.get('/generateTable',adminAuth.isLoggedIn,adminController.generateTable)

router.get('/report-Download',adminAuth.isLoggedIn,adminController.getreportDownload)

router.get('/excel-Data',adminAuth.isLoggedIn,adminController.excelTable)



router.get('/admin-user',adminAuth.isLoggedIn,adminController.adminUser);

router.get('/category',adminAuth.isLoggedIn,adminController.getCategory);

router.get('/add-category',adminAuth.isLoggedIn,adminController.getAddCategory)

router.get('/products',adminAuth.isLoggedIn,adminController.getProducts)

router.get('/add-products',adminAuth.isLoggedIn,adminController.getAddproducts)

router.get('/edit/product/:id',adminAuth.isLoggedIn,adminController.editProduct)


 
router.post('/add-products',adminAuth.isLoggedIn,uploadOptions.array('fileName',4),adminController.addProducts)

router.post('/add-category',adminAuth.isLoggedIn,adminController.addCategory)

router.put('/admin-user/block/:id',adminAuth.isLoggedIn,adminAuth.isLoggedIn,adminController.actionBlock)

router.put('/category/:id',adminAuth.isLoggedIn,adminAuth.isLoggedIn,adminController.deleteCategory)

router.post('/edit/:id',adminAuth.isLoggedIn,uploadOptions.array('fileName',4),adminController.updateProduct)

router.delete('/products/delete/:_id',adminAuth.isLoggedIn,adminController.deleteProduct)  

router.put('/products/block-product/:id',adminAuth.isLoggedIn,adminController.softDelete)


router.get('/coupons',adminAuth.isLoggedIn, adminController.getcouponDash)

router.get('/add-coupons',adminAuth.isLoggedIn,adminController.addCoupons)

router.post('/add-coupons',adminAuth.isLoggedIn,adminController.postaddCoupon)

router.put('/updatecoupon/:id' ,adminAuth.isLoggedIn, adminController.updateCoupon)

//for admin order list 

router.get('/admin-order',adminAuth.isLoggedIn,adminController.adminOrder)

router.put('/admin-order-cancel/:id',adminAuth.isLoggedIn ,adminController.cancelOrder); 

router.put('/admin-deliver-order/:id',adminAuth.isLoggedIn,adminController.deliverOrder)

router.put('/admin-return-order/:id',adminAuth.isLoggedIn,adminController.returnOrder)

//for refund 
router.put('/admin-refund-order/:id',adminAuth.isLoggedIn,adminController.refundOrder)


///for banners

router.get('/banner',adminAuth.isLoggedIn,adminController.getBanner)

router.get('/add-banner',adminAuth.isLoggedIn, adminController.getAddBanner)

router.post('/post-add-banner',adminAuth.isLoggedIn,adminController.addBanner)

//for session logout



router.post('/admin-log', adminController.postLogin)

router.get('/logout',adminController.getLogout);







module.exports = router
