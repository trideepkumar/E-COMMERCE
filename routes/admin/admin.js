const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const session = require('express-session');
const adminController = require('../../controllers/adminController');






router.get('/admin-log',adminController.getLogin );


router.post('/admin-log', adminController.postLogin);

router.get('/admin-dash',adminController.getadminDash );

router.get('/admin-user',adminController.adminUser)

router.put('/admin-user/block/:id',adminController.actionBlock)


//for session logout
router.get('/logout',adminController.getLogout);







module.exports = router
