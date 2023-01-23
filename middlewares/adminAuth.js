module.exports={
    isLoggedIn : (req, res, next) => {
         if (req.session.adminid) {
           next()
         } else {
           res.redirect('/admin/admin-log')
         }
       },
 
      isLoggedOut :(req, res, next) => {
         if (!req.session.adminid) {
           next()
         } else {
           res.redirect('/admin/admin-dash')
         }
       }
 }