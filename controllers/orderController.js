const User = require('../model/user');
const Order = require('../model/order');
const Product = require('../model/product');


const getOrder = async (req,res)=>{
    const user = await User.find({ Email: req.session.email }).populate('cart.id');
    // console.log(user)

    const cartItems = user[0].cart
    // console.log(cartItems);

    const totalQuantity = cartItems.reduce((total , item) => {
        return total+item.quantity;
    } , 0);
    // console.log(totalQuantity);
    
    const totalPrice = cartItems.reduce((total , item) => {
        return total+ (item.quantity * item.id.price) 
    } , 0);
    // console.log(totalPrice);

    res.render('order' ,{user:user[0],cartItems: cartItems,totalQuantity: totalQuantity, totalPrice:totalPrice})
    
}

const newShippingAddress = async (req,res) => {
    // console.log('shipping address working!!');
    const {id} = req.params;
    // console.log(id);
    try {
        const user = await User.find({_id: id});
        // console.log(user);
        user[0].address.push(req.body);
        await user[0].save();
        res.redirect(`/order`);
    } catch(e) {
        console.log(e);
    }
}

const createOrder = async (req,res) => {
    const { totalAmount , orderStatus , paymentMethod , shippingInfo  } = req.body ;
    // console.log(totalAmount);
    // console.log(orderStatus);
    // console.log(paymentMethod);
    // console.log(shippingInfo);
    try {
          console.log('try');
        const user = await User.find({Email: req.session.email});
        console.log(user[0]._id);
        const index = user[0].address.findIndex((item) => {
            return item._id.valueOf() == shippingInfo ;
        })
        console.log(index);
        let shippingAddres = user[0].address[index];
        console.log(shippingAddres);
        // console.log(req.session.userid)
        console.log(user[0].cart);
        //order schemadetails setup
        const newOrder = await Order.create({
            shippingInfo: shippingAddres ,
            user:user[0]._id,
            orderItems: user[0].cart ,
            totalAmount: totalAmount ,
            orderStatus: orderStatus ,
            paymentMode: paymentMethod ,
        })
        console.log(newOrder);
    
        // removing the cart items
        await user[0].cart.splice(0);
        console.log(user[0].cart);
        await user[0].save({validateBeforeSave: false});
        
        //saving the order
        await newOrder.save();

        res.json({redirect: '/order/success'});

    } catch(e) {
        console.log(e);
    }
    
}

const orderSuccess = async (req,res)=>{
    res.render('payment-success')
}



module.exports = {
   getOrder,
   newShippingAddress,
   createOrder,
   orderSuccess
}
