var Users = require('../models/users.model');
var Products =require('../models/products.model');

module.exports.index = function(req, res){
    Users.findOne({_id:req.user.sub})
        .then(result =>{
            var user = {
                email:result.email,
                nickName:result.userName,
                address:result.address,
                plan:result.plan,
                phoneNumber:result.phoneNumber
            }
            return res.status(200).send(user);
        })
        .catch(err=>{
            return res.status(500).send(err);
        });
}
module.exports.postUpdateInfo = function(req,res){
    const userName = req.body.userName;
    const phoneNumber = req.body.phoneNumber;
    const address = req.body.address;
    Users.findOne({_id:req.cookies.userId})
        .then(user =>{
            user.userName = userName;
            user.phoneNumber = phoneNumber;
            user.address = address;
            return user.save();
        })
        .then(result =>{
            console.log("Update information");
            res.redirect('/users/information');
        })
        .catch(err=>{
            console.log(err);
        })
}
module.exports.favourite = function(req,res){
    Users.findOne({_id:req.cookies.userId})
        .then(user=>{
            const dsphim = [];
            user.favourites.forEach(element => {
                dsphim.push(element.img);
            });
            // console.log(dsphim);
            res.render('users/favourite',{ dsphim : dsphim});
        })
}
module.exports.postFavourite = function(req,res){
    Users.findOne({_id:req.cookies.userId})
        .then(user=>{
            let i = 0;
            user.favourites.forEach(element => {
                if(element.id == req.body.id) {
                    i=1;
                }
            });
            if(i==0){
                user.favourites.push(req.body);
                return user.save();
            }
        })
        .catch(err=>{ 
            console.log(err);
        })
    // console.log(req.body.id);
}
module.exports.deleteFavourite = function(req, res){
    var valueRemove = req.body.id;
    console.log(valueRemove);
    Users.findOne({_id: req.cookies.userId})
        .then(user=>{
            var item;
            for(var i=0; i<user.favourites.length;i++){
                //console.log(user.favourites[i].img);
                if(user.favourites[i].img == valueRemove){
                    item = i;
                    //console.log(item);
                    //return;
                }
            }
            user.favourites.splice(item,1);
            user.save();
        })
        // .then(result =>{
        //     res.redirect('users/favourite');
        // })
        .catch(err=>{
            console.log(err);
        })
        //res.redirect("/users/favourite");
}