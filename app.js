const express = require('express');
const app = express();
const path = require('path');
const Handlebars = require('handlebars')
const hbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const MongoStore = require('connect-mongo')
require('dotenv').config()



app.use((req, res, next) => {
  res.set('cache-control', 'no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0')
  next();
});

const userRoute = require('./routes/user/user');
const adminRoute= require('./routes/admin/admin');
//for session

//session to db
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  dbName: 'deliver',
  collectionName: 'sessions'
})

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false ,
    store: sessionStore
}));




// midddlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//serving public file
app.use(express.static(__dirname));
//for cookie
app.use(cookieParser());





// hbs configuration
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// root setup for hbs
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
);

//route set up for user

app.use('/user', userRoute);

app.use('/admin',adminRoute);

// app.get('/user', (req, res) => {
//       res.render('signup');
// })


//mongoose

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {

    app.listen(3000, () => {
      console.log('Server is up');
    })
  })
  .catch(err => {
    console.log(err);
    console.log('Server is down')
  })