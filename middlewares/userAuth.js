
 const   isLoggedIn  = (req, res, next) => {
    if (!req.session.user) {
        next()
      } else {
        res.redirect('/user/home')
      }
       }
 
 const     isLoggedOut  =(req, res, next) => {
    if (req.session.user) {
        next()
      } else {
        res.redirect('/user/signin')
      }
       }
 
       module.exports={
        isLoggedIn,
        isLoggedOut
       }
       