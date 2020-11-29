var User = require('../models/users.model'); 

module.exports.requireAuth = function(req, res, next){
    console.log(req.user);
    
    User.findOne({_id : req.user.sub})
        .then(result =>{
            console.log(result);
            if(!result){              
                return res.status(403).json({message : "Forbidden"});
            } 
            else{
                console.log(result.isAdmin);
                if(result.isAdmin == true){
                    next();
                }
                else{
                    return res.status(403).json({message : "Forbidden"});
                }
                
            }                   
        })
        .catch(err =>{
            return res.status(500).json({ data: err });
        });    
};