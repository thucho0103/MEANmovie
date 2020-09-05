var Admin = require('../models/admin.model'); 

module.exports.requireAuth = function(req, res, next){
    // console.log(req.cookies.adminId);
    if(!req.cookies.adminId){
        res.redirect('/admin/login');
        return;
    }
    Admin.find({_id:req.cookies.adminId},function(err,data){
        if(!data.length){
            res.redirect('/admin/login');
            return;
        }  
        // res.locals.user= data[0];     
        // console.log(data[0].userName);
    });
    next();
};