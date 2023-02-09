const session = require('express-session')
const mongoose = require('mongoose')
const Register = require('../model/user')
const { Category } = require('../model/category')
const { Product } = require('../model/product')
const User = require('../model/user');
const Order = require('../model/order');
const puppeteer = require('puppeteer');
const xlsx = require('xlsx')
const Coupon = require('../model/coupon');
const Razorpay = require('razorpay');
const Banner = require('../model/banner');



//for admin login
const myemail = "trideep@gmail.com"
const mypassword = "trideep123"


const getLogin = (req, res) => {
    if (req.session.adminid) {
        res.redirect('/admin/admin-dash')
    } else {
        res.render('admin-log')
    }
}

const postLogin = (req, res) => {
    if (req.body.email === myemail && req.body.password === mypassword) {
        let session = req.session;
        session.adminid = req.body.email;
        if (req.session.adminid) {
            res.redirect('/admin/admin-dash')
        }
    } else {
        res.render('admin-log', { info: 'admin not found!' });
    }
}

const getadminDash = async (req, res) => {
    if (req.session.adminid) {
        try {
            const user = await User.find({});
            const product = await Product.find({});
            const order = await Order.find({});
            // console.log(`${user.length} ${product.length} ${order.length}`);
            res.render('admin-home', { user: user.length, product: product.length, order: order.length });
        } catch (e) {
            console.log(e);
        }

    } else {
        res.redirect('/admin/admin-log')
    }

}

//for chart

const getchartData = async (req, res) => {
    // console.log('getchartData controller works');
    try {

        const productWiseSale = await Order.aggregate(
            [
                {
                    '$lookup': {
                        'from': 'products',
                        'localField': 'orderItems.id',
                        'foreignField': '_id',
                        'as': 'test'
                    }
                }, {
                    '$unwind': {
                        'path': '$test'
                    }
                }, {
                    '$group': {
                        '_id': '$test.name',
                        'totalAmount': {
                            '$sum': '$totalAmount'
                        }
                    }
                }
            ]
        )

        // console.log(productWiseSale);
        return res.json({ productWiseSale: productWiseSale })
    } catch (err) {
        console.log(err)
    }
}

//for pdf and excel download

const getreportDownload = async (req, res) => {






    try {

        // Create a browser instance
        const browser = await puppeteer.launch();
        // Create a new page
        const page = await browser.newPage();

        // this needs to change {Hosting}
        const website_url = 'http://localhost:4000/admin/generateTable';

        await page.goto(website_url, { waitUntil: 'networkidle0' });

        //To reflect CSS used for screens instead of print
        await page.emulateMediaType('screen');

        const pdf = await page.pdf({
            path: 'result.pdf',
            //   margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
            printBackground: true,
            format: 'A4',
        });

        res.download('result.pdf');


        await browser.close();

    } catch (e) {
        console.log(e);
    }


    //     try {
    //         // const productWiseSale = await Order.aggregate(
    //         //     [
    //         //         {
    //         //             '$lookup': {
    //         //                 'from': 'products',
    //         //                 'localField': 'orderItems.id',
    //         //                 'foreignField': '_id',
    //         //                 'as': 'test'
    //         //             }
    //         //         }, {
    //         //             '$unwind': {
    //         //                 'path': '$test'
    //         //             }
    //         //         }, {
    //         //             '$group': {
    //         //                 '_id': '$test.name',
    //         //                 'totalAmount': {
    //         //                     '$sum': '$totalAmount'
    //         //                 }
    //         //             }
    //         //         }
    //         //     ]
    //         // )
    //         // console.log(productWiseSale);
    //         console.log('pdf controller works')
    //         const browser = await puppeteer.launch();
    //         const page = await browser.newPage();
    //         // console.log(page);
    //         await page.goto('http://localhost:4000/admin/report-Download', { waitUntil: 'networkidle0' });
    //         await page.pdf({ path: 'productsalesreport.pdf', format: 'A4' });
    //         res.download('productsalesreport.pdf');
    //         await browser.close();
    //     }
    //     // res.render('productPdf',{productWiseSale:productWiseSale})
    //     // const browser = await puppeteer.launch();
    //     // const page = await browser.newPage();
    //     // const url = 'http://localhost:4000/admin/report-Download';
    //     // await page.goto(url, { waitUntil: 'networkidle0' });
    //     // await page.emulateMediaType('screen');
    //     // await page.goto('http://localhost:4000/admin/report-Download');
    //     // await page.pdf({ path: 'productsalesreport.pdf' });
    //     // const pdf = await page.pdf({
    //     //     path: 'productsalesreport.pdf',
    //     //     margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
    //     //     // printBackground: true,
    //     //     format: 'A4',
    //     // });
    //     // console.log(pdf);
    //     // res.download('productsalesreport.pdf');
    //     // await browser.close();
    //     // res.redirect('/admin/admin-dash')
    //     catch (err) {
    //         console.log(err);
    //     }
    // }
}

const generateTable = async (req, res) => {
    const productSale = await Order.aggregate(
        [
            {
                '$lookup': {
                    'from': 'products',
                    'localField': 'orderItems.id',
                    'foreignField': '_id',
                    'as': 'test'
                }
            }, {
                '$unwind': {
                    'path': '$test'
                }
            }, {
                '$group': {
                    '_id': '$test.name',
                    'totalAmount': {
                        '$sum': '$totalAmount'
                    }
                }
            }
        ]
    )
    console.log(productSale);
    res.render('productPdf', { productSale: productSale })
}

const excelTable = async (req, res) => {
    const productSale = await Order.aggregate(
        [
            {
                '$lookup': {
                    'from': 'products',
                    'localField': 'orderItems.id',
                    'foreignField': '_id',
                    'as': 'test'
                }
            }, {
                '$unwind': {
                    'path': '$test'
                }
            }, {
                '$group': {
                    '_id': '$test.name',
                    'totalAmount': {
                        '$sum': '$totalAmount'
                    }
                }
            }
        ]
    )
    // console.log(productSale);
    let saleReport = []
    productSale.forEach(items => {
        excel = {
            Product: items._id,
            TotalAmount: items.totalAmount,

        }
        saleReport.push(excel)
    })

    console.log(saleReport);
    //creating a workBook
    let newWB = xlsx.utils.book_new()
    //creating a worksheet
    let newWS = xlsx.utils.json_to_sheet(saleReport)
    //worksheet to workbook
    xlsx.utils.book_append_sheet(newWB, newWS, 'SalesReport')
    //write to excel 
    xlsx.writeFile(newWB, './public/files/SalesReport.xlsx')
    res.download('./public/files/SalesReport.xlsx', 'salesReport.xlsx')

    // const ws = reader.utils.json_to_sheet(saleReport)
    // reader.utils.book_append_sheet(file,ws,"Sheet3")
    // // Writing to our file
    // reader.writeFile(file,'./test.xlsx')

    // res.render('excel',{productSale:productSale})
}

const adminUser = async (req, res) => {
    const user = await Register.find();
    res.render('admin-user', { users: user })
}

const getLogout = (req, res) => {
    req.session.destroy();
    res.render('admin-log');
}

const actionBlock = async (req, res) => {
    // console.log('actionBlock')
    const id = req.params.id
    // console.log(id)
    const user = await Register.findById(id)
    // console.log(user)
    if (user.Action) {
        try {
            await Register.findOneAndUpdate({ _id: id }, {
                $set: {
                    Action: false
                }
            })
            return res.json({
                redirect: 'http://localhost:4000/admin/admin-user'
            })
        } catch (error) {
            console.log(error)
        }
    } else {

        try {
            await Register.findOneAndUpdate({ _id: id }, {
                $set: {
                    Action: true
                }
            })
            return res.json({
                redirect: 'http://localhost:4000/admin/admin-user'
            })

        } catch (error) {
            console.log(error)
        }
    }
}

const getCategory = async (req, res) => {
    const categoryList = await Category.find();
    if (!categoryList) {
        res.status(500).json({ success: false })
    }
    res.render('admin-category', { categoryList })
}

const getAddCategory = (req, res) => {
    res.render('add-category')
}

const getAddproducts = async (req, res) => {

    const category = await Category.find({});
    if (!category) {
        res.staus(500).json({ success: false })
    }
    res.render('admin-Addproducts', { category: category })
}

const addCategory = async (req, res) => {
    let category = new Category({
        name: req.body.name
    })
    const existing = await Category.findOne({ name: req.body.name })
    // console.log(existing.name)
    // console.log(category.name)
    if (category.name == "") {
        console.log('empty')
        return res.render('add-category', { message: 'NAME MUST BE PROVIDED!' })
    }
    else if (existing) {
        console.log(existing)
        console.log('exist')
        return res.render('add-category', { message: ' CATEGORY ALREADY EXISTS!' })
    } else {
        console.log('saving!')
        category = await category.save();
        if (!category) {
            return res.status(404).send('the category cannot be created!')
        } else {
            res.redirect('/admin/category')
        }
    }
}

const deleteCategory = async (req, res) => {
    const id = req.params.id
    console.log(id)
    const cat = await Category.findById(id)
    // console.log(user)
    if (cat.Delete) {
        try {
            await Category.findOneAndUpdate({ _id: id }, {
                $set: {
                    Delete: false
                }
            })
            return res.json({
                redirect: 'http://localhost:4000/admin/category'
            })
        } catch (error) {
            console.log(error)
        }
    } else {

        try {
            await Category.findOneAndUpdate({ _id: id }, {
                $set: {
                    Delete: true
                }
            })
            return res.json({
                redirect: 'http://localhost:4000/admin/category'
            })

        } catch (error) {
            console.log(error)
        }
    }
}

const getProducts = async (req, res) => {
    // console.log("getAdminProduct listing")
    const productList = await Product.find().populate('category');
    //   console.log(productList)
    if (!productList) {
        res.staus(500).json({ success: false })
    }
    res.render('admin-products', { productList })
}

const addProducts = async (req, res) => {
    try {
        const existing = await Product.find({ name: req.body.name })
        const images = []
        for (key in req.files) {
            const imPath = req.files[key].path
            const path = imPath.substring(imPath.lastIndexOf("/") - 8);
            // images.push(req.files[key].path);
            images.push(path);
        }
        console.log(images)

        let product = new Product({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            image: images,
        })
        console.log(product)
        console.log(req.body)
        if (existing.length == 0) {
            if (images.length < 3) {
                console.log('image not satisfied')
                return res.redirect('/admin/add-products')
            } else {
                try {
                    console.log('save entered')
                    product = await Product.create({
                        name: req.body.name,
                        category: req.body.category,
                        price: req.body.price,
                        description: req.body.description,
                        image: images,
                    });
                    return res.redirect('/admin/products')
                } catch (error) {
                    console.log(error)
                    return res.redirect('/admin/add-products')
                }
            }
        } else {
            console.log('not working');
            return res.redirect('/admin/add-products')

        }
    } catch (error) {
        console.log(error)
    }

}

const editProduct = async (req, res) => {
    try {
        // console.log("edit product working started!");
        const id = req.params.id
        // console.log(req.params);
        // console.log(req.params.id)
        const product = await Product.findById({ _id: mongoose.Types.ObjectId(id) }).populate('category')
        // console.log(product);
        const categories = await Category.find({})
        // console.log(categories)
        return res.render('admineditProduct', { product, categories })
    } catch (error) {
        console.log(error)
    }
}

const updateProduct = async (req, res) => {
    console.log('update working started!!');
    // console.log(req.params);
    const id = req.params.id
    console.log(id);
    // console.log(req.files);
    // console.log(req.body);
    const images = []
    for (key in req.files) {
        const imPath = req.files[key].path
        console.log(imPath)
        const path = imPath.substring(imPath.lastIndexOf("/") - 8);
        // images.push(req.files[key].path);
        console.log(path);
        images.push(path);
    }
    // console.log(images)
    req.body.image = images;
    // console.log(id);
    try {
        // console.log(req.body.name)
        // console.log(req.body.price)
        // console.log(req.body.category)
        // console.log(req.body.description)
        console.log('work update!!');
        await Product.findByIdAndUpdate(id, req.body);
        return res.redirect('/admin/products')
    } catch (e) {
        console.log(e);
    }


}

const deleteProduct = async (req, res) => {
    console.log("delete working started!")
    const id = req.params._id
    console.log(id)
    const product = await Product.findById(id)
    //   console.log(id)
    //   console.log(product) 

    try {
        await Product.findByIdAndRemove(id)
            .then((product) => {
                if (product) {
                    return res.status(200).json({ redirect: "http://localhost:4000/admin/products" })
                } else {
                    return res.status(404).json({ redirect: "http://localhost:4000/admin/products" })
                }
            }).catch(err => {
                return res.status(400).json({ redirect: "http://localhost:4000/admin/products" })
            })

    } catch (error) {
        console.log(error)
    }

}

const getcouponDash = async (req, res) => {
    try {
        const coupon = await Coupon.find({})
        res.render('coupon', { coupon: coupon })
    } catch (err) {
        console.log(err);
    }

}

const addCoupons = async (req, res) => {
    return res.render('add-coupons')
}

const postaddCoupon = async (req, res) => {
    let { couponCode, expiryDate, minDiscountAmount, discountPercentage } = req.body;
    try {
        const coupon = await Coupon.create({
            couponCode: couponCode,
            expiryDate: new Date(expiryDate),
            minDiscountAmount: parseInt(minDiscountAmount),
            discountPercentage: parseInt(discountPercentage),
            isAvailable: true,
        });
        console.log(coupon);
        await coupon.save();
        res.redirect('/admin/coupons');
    } catch (err) {
        console.log(err);
    }
}

//for blocking unblocking coupon
const updateCoupon = async (req, res) => {
    const { id } = req.params;
    try {
        // console.log('block works');
        const coupon = await Coupon.findById({ _id: id });
        const isAvailable = coupon.isAvailable;
        coupon.isAvailable = !isAvailable;
        await coupon.save();
        res.json({ redirect: '/admin/coupons' });
    } catch (e) {
        console.log(e);
    }
}

//for admin orders
const adminOrder = async (req, res) => {
    console.log('admin-order works!!')
    const orders = await Order.find({})
    // console.log(orders)
    if (orders.length == 0) {
        res.render('user-order-empty')
    } else {
        res.render('admin-order', { order: orders })
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
        res.json({ redirect: '/admin/admin-order' });
    } catch (err) {
        console.log(err);
    }

}

const deliverOrder = async (req, res) => {
    console.log('deliver order works!')
    const id = req.params.id
    const user = await User.find({ Email: req.session.email })
    console.log(user);
    console.log(id);
    try {
        const order = await Order.find({ id: id })
        console.log(order);
        const cancelOrder = await Order.findOneAndUpdate({ _id: id }, { isDelivered: true }, { user: user });
        res.json({ redirect: '/admin/admin-order' });
    } catch (err) {
        console.log(err);
    }
}

const returnOrder = async (req, res) => {
    console.log('return order works!')
    const id = req.params.id
    const user = await User.find({ Email: req.session.email })
    console.log(user);
    console.log(id);
    try {
        const order = await Order.find({ id: id })
        // console.log(order);
        console.log('1');
        const cancelOrder = await Order.findOneAndUpdate({ _id: id }, { isReturnStatus: true }, { user: user });
        console.log('2');
        res.json({ redirect: '/admin/admin-order' });
    } catch (err) {
        console.log(err);
    }
}

const refundOrder = async (req, res) => {

    console.log('return order works!')
    const id = req.params.id
    // console.log(req.params.id);
    const user = await User.find({ Email: req.session.email })
    // console.log(user);
    console.log(id);
    try {
        const { id } = req.params;
        const order = await Order.find({ _id: id });
        // console.log(order);
        console.log('workkk pay id');
        // let instance = new Razorpay({ key_id: 'rzp_test_yoGhuX06uJTTMD', key_secret: 'dPnKGP0F5TByLAAyNJ3a04SA' })
        // console.log('22');
        // instance.payments.refund(order[0].paymentId, {
        //     amount: order[0].totalAmount * 100,
        //     speed: "normal",
        // })

        order[0].isRefundStatus = true;
        await order[0].save();
        res.json({ redirect: '/admin/admin-order' });








        // const order = await Order.find({ id: id })
        // console.log(order);
        // console.log('1');
        // const cancelOrder = await Order.findOneAndUpdate({ _id: id }, {isRefundStatus : true }, { user: user });
        // console.log('2');

    } catch (err) {
        console.log(err);
    }

}

const getBanner = async (req, res) => {
    try {
        const banner = await Banner.find({});
        res.render('banner', { banner: banner });
    } catch (e) {
        console.log(e);
    }
}

const getAddBanner = async (req, res) => {
    res.render('add-banner')
}

const addBanner = async (req, res) => {
    try {
        // console.log('addBanner works ..');
        // console.log(req.body.name);
        // console.log(req.body.caption);
        // console.log(req.body.image);
        // console.log(req.body);
        // // const images = []
        let images = req.body.image
    
        // const banner = await Banner.find({})

        for (key in req.files) {
            console.log('for in works');
            const imPath = req.files[key].path
            const path = imPath.substring(imPath.lastIndexOf("/") - 8);
            // images.push(req.files[key].path);
            images.push(path);
        }

        const banner = await Banner.create({
            name: req.body.name,
            caption: req.body.caption,
            image:images
        });

        console.log(banner);
        await banner.save();
        let image = images

        console.log(image);

        image.forEach(() => {
            image.splice(1);
        })

        console.log(image);


        res.render('banner',{banner:banner});
    } catch (err) {
        console.log(err);
    }
}




module.exports = {
    getLogin,
    postLogin,
    getadminDash,
    getLogout,
    adminUser,
    actionBlock,
    getCategory,
    getAddproducts,
    getAddCategory,
    addCategory,
    deleteCategory,
    getProducts,
    addProducts,
    editProduct,
    deleteProduct,
    updateProduct,
    getchartData,
    getreportDownload,
    generateTable,
    excelTable,
    getcouponDash,
    addCoupons,
    postaddCoupon,
    updateCoupon,
    adminOrder,
    cancelOrder,
    deliverOrder,
    returnOrder,
    refundOrder,
    getBanner,
    getAddBanner,
    addBanner
}

