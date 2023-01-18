const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const session = require('express-session');
const adminController = require('../../controllers/adminController');
const {uploadOptions} = require('../../config/multer')


router.get('/admin-log',adminController.getLogin );

router.get('/admin-dash',adminController.getadminDash );

router.get('/admin-user',adminController.adminUser);

router.get('/category',adminController.getCategory);

router.get('/add-category',adminController.getAddCategory)

router.get('/products',adminController.getProducts)

router.get('/add-products',adminController.getAddproducts)

router.get('/edit-product/:id',adminController.editProduct)


 
router.post('/add-products',uploadOptions.single('fileName'),adminController.addProducts)

router.post('/add-category',adminController.addCategory)

router.post('/admin-log', adminController.postLogin)

router.put('/admin-user/block/:id',adminController.actionBlock)

router.put('/category/:id',adminController.deleteCategory)

router.put('/edit-product/:_id',adminController.updateProduct)

router.delete('/products/delete/:_id',adminController.deleteProduct)  



//for session logout
router.get('/logout',adminController.getLogout);







module.exports = router
