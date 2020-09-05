var Users = require('../models/users.model'); 

module.exports.requireAuth = function(req, res, next){
    if(!req.cookies.userId){
        res.redirect('/auth/login');
        return;
    }
    Users.find({_id:req.cookies.userId},function(err,data){
        if(!data.length){
            res.redirect('/auth/login');
            return;
        }  
        // res.locals.user= data[0];     
        // console.log(data[0].userName);
    });
    next();
};