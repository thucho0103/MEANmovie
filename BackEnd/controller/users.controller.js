var Users = require('../models/users.model');

module.exports.index = function(req, res){
    Users.findOne({_id:req.user.sub})
        .then(result =>{
            var today = result.plan;
            var dd = today.getDate();
            var mm = today.getMonth()+1; 
            var yyyy = today.getFullYear();
            if(dd<10) 
            {
                 dd='0'+dd;
            } 
            if(mm<10) 
            {
                mm='0'+mm;
            }
            var user = {
                email:result.email,
                nickName:result.nickName,
                plan: dd+'/'+mm+'/'+yyyy,
                dateCreate:result.dateCreate
            }
            return res.status(200).send(user);
        })
        .catch(err=>{
            return res.status(500).send(err);
        });
}
module.exports.postUpdateInfo = function(req,res){
    const nickName = req.body.nickName;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;
    Users.findOne({_id:req.cookies.userId})
        .then(user =>{
            user.nickName = nickName;
            user.phoneNumber = phoneNumber;
            user.address = address;
            return user.save();
        })
        .then(result =>{
            return res.status(200).send(result);
        })
        .catch(err=>{
            return res.status(500).send(err);
        })
}