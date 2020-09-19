const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const JWT = require('jsonwebtoken');

const { JWT_SECRET } = require('../middlewares/jwt.middlerware');

const encodedToken = (userId)=>{
    return JWT.sign({
        sub: userId,
        iat: new Date().getTime(),   
        exp: new Date().setDate(new Date().getDate() + 1),    
    },JWT_SECRET)
};

module.exports.auth = function(req, res){
    res.render('auth/listUser');
}
module.exports.login = function(req, res){
    res.render('auth/login',{errors:'0',values:''});
}
module.exports.postLogin = function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    Users.findOne({email:email})
        .then(user=>{
            if(!user){
                //return res.render('auth/login',{errors:'Email không tồn tại', values:email});
                return res.status(403).json({status:403,data:{},message:"Email không tồn tại"});
            }
            bcrypt.compare(password,user.password)
                .then(doMatch=>{
                    if(doMatch){
                        res.cookie('userId',user._id);                      
                        //return res.redirect('/');
                        const token = encodedToken(user._id);
                        res.setHeader('Authorization',"Bearer "+token);
                        return res.status(200).json({status:200,data:{},message:"suscess"});
                    }
                    //return res.render('auth/login',{errors:'Mật khẩu không đúng', values:email});
                    return res.status(200).json({data:"Mật khẩu không đúng"});
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({data:err});
                })
        })
        .catch(err=>{
            res.status(500).json({data:err});
            return console.log(err);
        });
} 
module.exports.logout = function(req, res){
    res.clearCookie('userId');
    //res.redirect('/');
    return res.status(200).json({data:"suscess"});
}
module.exports.register = function(req, res){
    res.render('auth/register',{errors:"0",values:""});
}
module.exports.postRegister = function(req,res){
    var email = req.body.email;
    const password = req.body.password;
    const confirmPW = req.body.confirm_password;
    if(password!=confirmPW) {  
        //res.render('auth/register',{errors:"xác nhận mật khẩu không thành công"});       
        return res.status(200).json({data:"xác nhận mật khẩu không thành công"});
        }
    Users.findOne({email:email})
        .then(userDoc =>{
            if(userDoc) {
                var error = "email "+ email +" đã tồn tại ";
                //res.render('auth/register', { errors : error});               
                return res.status(200).json({data:error});
            }
            console.log(password);
            return bcrypt.hash(password,12);
        })
        .then(hashPassword =>{
            const user = new Users({
                email:req.body.email,
                userName:req.body.userName,
                password:hashPassword,
                dateCreate: new Date().toDateString(),
            });
            return user.save();
        })
        .then(result=>{
            //res.redirect('/auth/login');
            res.status(200).json({data:"suscess"});
        })
        .catch(err=>{
            res.status(500).json({data:err});
            return console.log(err);
        })
}

module.exports.Reset = function(req,res){
    res.render('auth/reset',{errors:'0',values:''});
}
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
module.exports.postReset = function(req,res){
    const email = req.body.email;
    crypto.randomBytes(32,(err,Buffer) =>{
        if(err) {
            console.log(err);            
            //return redirect('auth/reset');
            return res.status(500).json({data:err});
        }
        const token = Buffer.toString('hex');
        Users.findOne({email:email})
            .then(user=>{
                if(user){
                    user.resetToken = token;
                    user.resetTokenExp = Date.now() + 3600000;
                    return user.save();
                }
                //return res.render('auth/reset',{errors:'Email không tồn tại trong hệ thống',values:email});
                return res.status(200).json({data:"Email không tồn tại trong hệ thống"});
            })
            .then(result=>{
                if(result){
                    //res.render('auth/reset',{errors:'Gửi thành công!',values:email});
                    res.status(200).json({data:"Gửi thành công!"});
                    const msg = {
                    to: email,
                    from: 'teadragon@movie.com',
                    subject: 'Sending with Movie+',
                    html: `
                        <p> Yêu cầu lấy lại mật khẩu </p>
                        <p> Click vào <a href="https://teamovie.herokuapp.com/auth/reset/${token}"> link </a> để tạo mật khẩu mới </p>                    
                    `
                    };
                sgMail.send(msg);
                }
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({data:err});
            })
    });
}

// module.exports.postReset = function(req,res){
//     var email = req.body.email;
//     console.log(email);
//     Users.find({email:email},function(err,data){
//         console.log(data);
//         if(data.length){
//             var key = Math.random().toString(36).substr(2, 6);
//             const msg = {
//             to: email,
//             from: 'teadragon@movie.com',
//             subject: 'Sending with Movie+',
//             text: 'key'+ key,
//             html: '<div> mật khẩu mới của bạn là <strong> '+ key +'</strong> mời bạn đăng nhập ở hệ thống </div>',
//             };
//             sgMail.send(msg);
//             Users.findOneAndUpdate({email:email},{password:key},function(err,data){
//                 if (err) throw err;
//                 res.render('auth/result');
//             });
//         } else {
//             res.render('auth/err',{error : "email không tồn tại"});
//         }
//     });
// }
module.exports.newPassword = function(req,res){
    const token = req.params.token;
    Users.findOne({resetToken:token})
        .then(user =>{
            console.log(user);
            if(user){
               //return res.render('auth/newPw',{email : user.email,token:token});
               return res.status(200).json({data : token});
            }           
                //return res.redirect('/');
                return res.status(404).json({data : "Không tìm thấy"});
        })
        .catch(err=>{
            res.status(404).json({data : err});
            console.log(err);
        })
}
module.exports.postNewPassword = function(req,res){
    const token = req.body.token;
    const newPassword = req.body.password;
    let resetUser;
    Users.findOne({resetToken:token})
        .then(user=>{
            resetUser= user;
            return bcrypt.hash(newPassword,12);
        })
        .then(hashPassword =>{
            resetUser.password = hashPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExp = undefined;
            return resetUser.save();
        })
        .then(result=>{
            //res.redirect('/auth/login');
            res.status(200).json({data : "susscess"});
        })
        .catch(err=>{
            console.log(err);
            res.status(200).json({data : err});
        })
}