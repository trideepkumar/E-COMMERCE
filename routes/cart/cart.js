const express = require('express');
const router = express.Router();

const cartController = require('../../controllers/cartController')
const userAuth = require('../../middlewares/userAuth');



router.get('/',userAuth.isLoggedIn,cartController.getCart);

router.get('/:id' , userAuth.isLoggedIn ,cartController.addToCart);











module.exports = router;

