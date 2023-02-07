const User = require('../model/user');
const Order = require('../model/order');
const Product = require('../model/product');
const order = require('../model/order');
const Razorpay = require('razorpay');
const Coupon = require('../model/coupon');
const { LogarithmicScale } = require('chart.js');


const getOrder = async (req, res) => {
    const user = await User.find({ Email: req.session.email }).populate('cart.id');
    // console.log(user)

    const cartItems = user[0].cart
    // console.log(cartItems);

    const totalQuantity = cartItems.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
    // console.log(totalQuantity);

    const totalPrice = cartItems.reduce((total, item) => {
        return total + (item.quantity * item.id.price)
    }, 0);
    // console.log(totalPrice);

    res.render('order', { user: user[0], cartItems: cartItems, totalQuantity: totalQuantity, totalPrice: totalPrice })

}

const newShippingAddress = async (req, res) => {
    // console.log('shipping address working!!');
    const { id } = req.params;
    // console.log(id);
    try {
        const user = await User.find({ _id: id });
        // console.log(user);
        user[0].address.push(req.body);
        await user[0].save();
        res.redirect(`/order`);
    } catch (e) {
        console.log(e);
    }
}

const createOrder = async (req, res) => {
    const { totalAmount, orderStatus, paymentMethod, shippingInfo } = req.body;
    // console.log(totalAmount);
    // console.log(orderStatus);
    // console.log(paymentMethod);
    // console.log(shippingInfo);
    try {
        console.log('try');
        const user = await User.find({ Email: req.session.email });
        // console.log(user[0]._id);
        const index = user[0].address.findIndex((item) => {
            return item._id.valueOf() == shippingInfo;
        })
        // console.log(index);
        let shippingAddres = user[0].address[index];
        // console.log(shippingAddres);
        // console.log(req.session.userid)
        //order schemadetails setup
        if (paymentMethod == 'cash on delivery') {
            console.log('if  cod controller wroks!!');
            const newOrder = await Order.create({
                shippingInfo: shippingAddres,
                user: user[0]._id,
                orderItems: user[0].cart,
                totalAmount: totalAmount,
                orderStatus: orderStatus,
                paymentMode: paymentMethod,
            })
            // console.log('1');
            // console.log(user[0].cart);
            // console.log('order item below');
            // console.log(newOrder.orderItems);



            user[0].cart.splice(0);
            // console.log(user[0].cart);
            await user[0].save({ validateBeforeSave: false });
            //saving the order
            await newOrder.save();
            console.log('order saved in db!!!');
            res.json({ redirect: '/order/success' });
        } else if (paymentMethod === 'Razor pay') {
            console.log('if razor pay controller wroks!!')
            let instance = new Razorpay({
                key_id: 'rzp_test_yoGhuX06uJTTMD',
                key_secret: 'dPnKGP0F5TByLAAyNJ3a04SA'
            });
            // console.log(instance);
            const myOrder = await instance.orders.create({
                amount: totalAmount * 100,
                currency: "INR",
                order_id: order.id,
                receipt: order.id,
            })
            console.log(myOrder);

            const newOrder = await Order.create({
                shippingInfo: shippingAddres,
                user: user[0]._id,
                orderItems: user[0].cart,
                totalAmount: totalAmount,
                orderStatus: orderStatus,
                paymentMode: paymentMethod,
            })
            // console.log(newOrder);
            user[0].cart.splice(0);
            // console.log(user[0].cart);
            await user[0].save({ validateBeforeSave: false });
            //saving the order
            await newOrder.save();
            console.log('order saved in db!!!');
            res.json({ myOrder: myOrder, redirect: '/order/success' })
            console.log('end');
        }
    } catch (e) {
        console.log(e);
    }

}

const orderSuccess = async (req, res) => {
    res.render('payment-success')
}

const getUserOrder = async (req, res) => {
    console.log('getUser order works!');
    console.log(req.session.userid);
    const user = await User.find({ Email: req.session.email });
    // console.log(user[0]._id);
    const userId = user[0]._id
    console.log(userId);

    const orders = await Order.find({ user: userId }).populate('orderItems.id');
    console.log(orders)
    // const user = await User.find({ Email: req.session.email })
    // console.log(user)
    if (orders.length == 0) {
        res.render('user-order-empty')
    } else {
        res.render('user-profile', { order: orders, id: req.session.id, user: user })
    }
}

const cancelOrder = async (req, res) => {
    console.log('cancel order works!')
    const id = req.params.id
    const user = await User.find({ Email: req.session.email })
    console.log(user);
    // console.log(id);
    try {
        const order = await Order.find({ id: id })
        console.log(order);
        const cancelOrder = await Order.findOneAndUpdate({ _id: id }, { isCancelled: true }, { user: user });
        res.json({ redirect: '/order/user-order' });
    } catch (err) {
        console.log(err);
    }

}

const getCouponpage = async (req, res) => {
    res.render('user-coupon')
}

const applyCoupon = async (req, res) => {

    try {
        const user = await User.find({ Email: req.session.email }).populate('cart.id');
        console.log(user);
        // console.log(user[0]._id);

        const coupon = await Coupon.find({ couponCode: req.body.coupon });
        // console.log(coupon);
        // console.log(coupon[0].users);

        // console.log(coupon[0].discountPercentage);
        //for cart items
        const cartItems = user[0].cart
        // console.log(cartItems);

        //for total quantity
        const totalQuantity = cartItems.reduce((total, item) => {
            return total + item.quantity;
        }, 0);

        // console.log(totalQuantity);

        //for total cart price 
        let totalPrice = cartItems.reduce((total, item) => {
            return total + (item.quantity * item.id.price)
        }, 0);
        // console.log(totalPrice);

        if (coupon.length === 0) {
            console.log('if worked');
            res.render('user-coupon', { couponMessage: 'Please enter a valid coupon' });
        } else if (totalPrice <= coupon[0].minDiscountAmount) {
            res.render('user-coupon', { couponMessage: 'Coupon is not applicable for this price !!' });
        }
        else {
            let isCouponUsed = coupon[0].users.some((item) => {
                return item.id.valueOf() === `${req.session._userId}`
            });
            if (isCouponUsed) {
                res.render('user-coupon', { couponMessage: 'Oops ..!! Coupon already used' });
            } else {
                console.log('else working');
                // console.log(user);
                // console.log(coupon[0].users);
                console.log(req.session.user);
                let userCoupon = { id: req.session.user._id }
                coupon[0].users.push(userCoupon)
                // console.log( coupon.users[0].push(user));
                await coupon[0].save();
                totalPrice = totalPrice - (totalPrice * coupon[0].discountPercentage) / 100;
                console.log(totalPrice);
                let couponApplied = true;
                res.render('order', { user: user[0], totalPrice: totalPrice, totalQuantity: totalQuantity, couponMessage: 'Coupon applied 🎁', couponApplied:couponApplied })
            }
        }
    } catch (err) {
        console.log(err);
    }

}

const  returnOrder = async(req,res)=>{
    console.log('return order works!')
    const id = req.params.id
    console.log(id);
    const user = await User.find({ Email: req.session.email })
    console.log(user);
    try {
        const {id} = req.params ;
        const order = await Order.find({_id: id});
        order[0].isReturn = true ;
        await order[0].save();
        res.json({redirect: '/order/user-order'});
     } catch(e) {
        console.log(e);
     }
   
}


module.exports = {
    getOrder,
    newShippingAddress,
    createOrder,
    orderSuccess,
    getUserOrder,
    cancelOrder,
    getCouponpage,
    applyCoupon,
    returnOrder,
    
}
