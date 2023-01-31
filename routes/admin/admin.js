const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const session = require('express-session');
const adminController = require('../../controllers/adminController');
const {uploadOptions} = require('../../config/multer')
const adminAuth=require('../../middlewares/adminAuth')



router.get('/admin-log',adminAuth.isLoggedOut,adminController.getLogin );

router.get('/admin-dash',adminAuth.isLoggedIn,adminController.getadminDash );

//for chart 
router.get('/chart',adminController.getchartData)




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



//for session logout
router.get('/logout',adminController.getLogout);







module.exports = router
