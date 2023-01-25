module.exports={
  isLoggedIn : (req, res, next) => {
       if (req.session.email) {
         next()
       } else {
         res.redirect('/user/signin')
       }
     },

    isLoggedOut :(req, res, next) => {
       if (!req.session.email) {
         next()
       } else {
         res.redirect('/user/home')
       }
     }
}