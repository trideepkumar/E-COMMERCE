const session = require('express-session')
const mongoose = require('mongoose')
const Register = require('../model/user')
const { Category } = require('../model/category')
const { Product } = require('../model/product')


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

const getadminDash = (req, res) => {
    if (req.session.adminid) {
        res.render('admin-home')
    } else {
        res.redirect('/admin/admin-log')
    }

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
    res.render('admin-Addproducts', { category : category})
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

const getProducts = async (req,res) =>{ 
    // console.log("getAdminProduct listing")
      const productList=await Product.find().populate('category');
    //   console.log(productList)
      if(!productList){
        res.staus(500).json({success:false})
      }
      res.render('admin-products',{productList}) 
  }    


const addProducts = async (req, res) => {
    console.log(req.body.name);
    // console.log(fileName)
    if(req.body.name === '' || req.body.category === '' || req.body.price === '' || req.body.fileName === '' || req.body.description === '') {
        console.log('error')
        return res.render('admin-Addproducts' ,{message: 'Please enter valid details!'})
    }
    const productName = await Product.findOne({ name:req.body.name })
    console.log(productName)
    if (productName) {
        res.render('admin-Addproducts', { message: 'product already exists!' })
    }
    else {
        const fileName = await req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
        let product = new Product({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            image: `${basePath}${fileName}`,
            description: req.body.description
        })
        product = await product.save();
        if (!product)
            return res.status(500).send('The product cannot be created')
        res.redirect('/admin/add-products')
    }



}

//edit product not done completely
const editProduct = async (req,res) =>{
    try {
        // console.log("edit product working started!");
        const id = req.params.id
        // console.log(req.params.id)
        const product = await Product.findById({_id: id}).populate('category')
        // console.log(product);
        const categories = await Category.find({})
        // console.log(categories)
        return res.render('admineditProduct', {product,categories})
      } catch (error) {
        console.log(error)
      }
    }

  const updateProduct = async (req,res)=>{
    console.log('update working started!!');
    const id = req.params._id
    console.log(id);
    try{
        // console.log(req.body.name)
        // console.log(req.body.price)
        // console.log(req.body.category)
        // console.log(req.body.description)

        await Product.findByIdAndUpdate({_id:id},{
            name:req.body.name,
            price:req.body.price,
            // category:req.body.category,
            description:req.body.description
        })
        console.log("confirm updation")
    }catch{
        return res.json({
            successStatus: false,
          })
    }

    
  }


  const deleteProduct = async (req, res) =>{
    console.log("delete working started!")
      const id = req.params._id
    //   console.log(id)
      const product = await Product.findById(id)
    //   console.log(id)
    //   console.log(product) 

    try{
    await Product.findByIdAndRemove(id)     
    .then((product)=>{        
      if(product){          
        return res.status(200).json({redirect:"http://localhost:4000/admin/products"})
      }else{
        return res.status(404).json({redirect:"http://localhost:4000/admin/products"})
      }
    }).catch(err=>{
      return res.status(400).json({redirect:"http://localhost:4000/admin/products"})
    })
    
  } catch (error) {
    console.log(error)
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
    updateProduct
}