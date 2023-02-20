const { LoggerLevel } = require('mongodb')
const User = require('../model/user')

const getCart = async (req, res) => {
    try {
       console.log('get cart works!!');
        const user = await User.find({ Email: req.session.email }).populate('cart.id');
        if (user[0].cart.length === 0) {
            console.log('empty cart');
            res.render('empty-cart');
        }
        else {
            console.log('product added');
            const cartItems = user[0].cart;
           console.log(cartItems);
           console.log('here');
             const totalPrice = cartItems.reduce((total, item) => {
                const itemPrice = Number(item.id.price);
                console.log(itemPrice);
               const itemQuantity = Number(item.quantity);
               console.log(itemQuantity);
                return total + (item.quantity * item.id.price)
            }, 0);
            console.log(totalPrice);

           //for default button select
            const radioButtons = [
                { value: 'Option 1', label: 'Option 1', isSelected: false },
                { value: 'Option 2', label: 'Option 2', isSelected: false },
                { value: 'Option 3', label: 'Option 3', isSelected: false }
              ];

              const selectedValue = 'Option 1';

              radioButtons.forEach(button => {
                if (button.value === selectedValue) {
                  button.isSelected = true;
                }
              });


            res.render('cart', { cartItems: cartItems, totalPrice: totalPrice,  radioButtons  })

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
        console.log(user[0].cart);
        // const index = user[0].cart.findIndex((item) => { return item.id.valueOf() === `${id}` })
        // console.log(index);
        // user[0].cart.splice(index, 1);
        // await user[0].save();
        // res.json({ redirect: '/cart' });

        const index = user[0].cart.findIndex(item => item.id.valueOf() === id);
        console.log(id);
        console.log(index);
        if (index != -1) {
            user[0].cart.splice(index, 1); 
            await user[0].save();
         res.json({ redirect: '/cart' });        
        } else {
          res.sendStatus(404);
        }
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