var Users = require('../models/users.model'); 

module.exports.requireUser = function(req, res, next){
    res.locals.user = 0;
    //console.log(res.locals.url);
    if(req.cookies.userId){
        Users.findOne({_id:req.cookies.userId},function(err,data){
            res.locals.user= data.userName;     
        });
    }  
    next();
};