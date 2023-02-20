const express = require('express');
const router = express.Router();

const cartController = require('../../controllers/cartController')
const userAuth = require('../../middlewares/userAuth');



router.get('/', userAuth.isLoggedIn, cartController.getCart);
router.get('/:id', userAuth.isLoggedIn, cartController.addToCart);

router.put('/qty-plus/:id', userAuth.isLoggedIn, cartController.increment);
router.put('/qty-minus/:id', userAuth.isLoggedIn, cartController.decrement);
router.delete('/:id', userAuth.isLoggedIn, cartController.deleteCart);










module.exports = router;

