const { LoggerLevel } = require('mongodb');
const User = require('../model/user')

const getCart = async (req, res) => {
    try {
        console.log(req.session.email);
        // const id = req.params.id
        // console.log(id);
        // find the user and user's cart
        const user = await User.find({Email:req.session.email}).populate('cart.id');
        // console.log(cart.id);
        // console.log(user);
        console.log('Hello test');
        console.log(user[0]);
        console.log(user[0].cart);
        if (user[0].cart.length === 0) {
            res.render('empty-cart');
        }
        else {
            const cartItems = user[0].cart
            console.log(cartItems)

            cartItems.forEach((item) => {
                if (item.quantity >= item.id.stock) {
                    console.log(' for each workz!');
                    console.log(item.quantity);
                    console.log(item.id.stock)
                    item.incremet = true
                }
                else if (item.quantity === 1) {
                    console.log('2 works!!');
                    item.decrement = true;
                }
            })
            console.log('cartitems works');
            console.log(cartItems);
            res.render('cart', { cartItems: cartItems })

        }
    } catch (err) {
        console.log(err)
    }
}

const addToCart = async (req, res) => {

    try {
        const id = req.params.id
        // console.log(id);
        console.log(req.session.email);
        const user = await User.find({ Email: req.session.email });
        console.log('user here');
        console.log(user);
        const item = {
            id: id,
            quantity: 1
        };
        console.log(item);

        if (user[0].cart.length === 0) {
            console.log('product saved!!');
            user[0].cart.push(item);
            await user[0].save();
            res.redirect(`/cart`)
        }

    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getCart,
    addToCart

}