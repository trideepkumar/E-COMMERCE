const session = require('express-session')
const mongoose = require('mongoose')
const Register = require('../model/user')

//for admin login
const myemail = "trideep@gmail.com"
const mypassword ="trideep123"


const getLogin = (req, res) => {
    if(req.session.adminid){
        res.redirect('/admin/admin-dash')
    } else {
        res.render('admin-log')
    } 
}

const postLogin = (req, res) => {
    if(req.body.email === myemail && req.body.password === mypassword){
        let session=req.session;
        session.adminid=req.body.email; 
        if(req.session.adminid){
            res.redirect('/admin/admin-dash')
        }  
    } else {
        res.render('admin-log',{info:'admin not found!'});
    }
}

const getadminDash = (req,res)=>{
    if(req.session.adminid){
        res.render('admin-home')
    }else{
        res.redirect('/admin/admin-log')
    }
   
}


const adminUser = async(req,res)=>{
    const user = await Register.find();
    res.render('admin-user',{users:user})
}


const getLogout = (req,res) => {
    req.session.destroy();
    res.render('admin-log');
  }

const actionBlock = async(req,res)=>{
    // console.log('actionBlock')
    const id =req.params.id
    // console.log(id)
    const user = await Register.findById(id)
    // console.log(user)
    if(user.Action){
        try {
            await Register.findOneAndUpdate({_id:id}, {
              $set: {
                Action: false
              }
            })
            return res.json({
                redirect: 'http://localhost:3000/admin/admin-user'
              })
          } catch (error) {
            console.log(error)
          }
    }else{
       
        try{
            await Register.findOneAndUpdate({_id:id},{
                $set:{
                    Action:true
                }
            })
            return res.json({
                redirect: 'http://localhost:3000/admin/admin-user'
              })

        } catch (error) {
            console.log(error)
          }
        }
    }





module.exports = {
   getLogin,
   postLogin,
   getadminDash,
   getLogout,
   adminUser,
   actionBlock
   
}