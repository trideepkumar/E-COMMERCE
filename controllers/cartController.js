const { LoggerLevel } = require('mongodb')
const User = require('../model/user')

const getCart = async (req, res) => {
    try {
        // console.log(req.session.email);
        // const id = req.params.id
        // console.log(id);
        // find the user and user's cart
        const user = await User.find({ Email: req.session.email }).populate('cart.id');
        // console.log(cart.id);
        // console.log(user);
        // console.log('getcart works');
        // console.log(user[0]);
        // console.log(user[0].cart);
        if (user[0].cart.length === 0) {
            res.render('empty-cart');
        }
        else {
            const cartItems = user[0].cart;
            cartItems.forEach((item) => {
                if (item.quantity >= item.id.stock) {
                    item.incremet = true
                }
                else if (item.quantity === 1) {
                    // console.log('2 works!!');
                    item.decrement = true;
                }
            })


            const totalPrice = cartItems.reduce((total, item) => {
                return total + (item.quantity * item.id.price)
            }, 0);
            console.log(totalPrice);


            res.render('cart', { cartItems: cartItems, totalPrice: totalPrice })

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
        } else {
            console.log('else working!');
            const res = user[0].cart.findIndex((item) => {
                return item.id.valueOf() === `${id}`
            })
            console.log(res)
            if (res === -1) {
                user[0].cart.push(item);
            } else {
                console.log('inner else working!');
                user[0].cart[res].quantity = user[0].cart[res].quantity + 1;
                console.log(user[0].cart[res].quantity);
            }
            await user[0].save();
        }
        res.redirect('/cart')
    } catch (err) {
        console.log(err)
    }
}


const increment = async (req, res) => {
    console.log('increment works!!')
    const { id } = req.params;
    console.log(id);
    try {
        const user = await User.find({ Email: req.session.email });
        console.log(user);
        const index = user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` });
        console.log(index);
        user[0].cart[index].quantity = user[0].cart[index].quantity + 1;
        await user[0].save();
        res.json({ redirect: '/cart' });
    } catch (err) {
        console.log(err);
    }
}

const decrement = async (req, res) => {
    console.log('decrement works!!');
    const { id } = req.params;
    try {
        const user = await User.find({ Email: req.session.email });
        console.log(user);
        const index = user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` });
        user[0].cart[index].quantity = user[0].cart[index].quantity - 1;
        await user[0].save();
        res.json({ redirect: '/cart' });
    } catch (e) {
        console.log(e);
    }
}

const deleteCart = async (req, res) => {
    console.log('delete works started!!');
    const { id } = req.params;
    try {
        const user = await User.find({ Email: req.session.email });
        console.log(user);
        const index = user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` })
        console.log(index);
        console.log(index);
        user[0].cart.splice(index, 1);
        await user[0].save();
        res.json({ redirect: '/cart' });
    } catch (err) {
        console.log(err);
    }

}



module.exports = {
    getCart,
    addToCart,
    increment,
    decrement,
    deleteCart

}