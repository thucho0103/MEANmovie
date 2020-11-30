const Users = require('../models/users.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var sendpulse = require('sendpulse-api');

const { JWT_SECRET } = require('../middlewares/jwt.middlerware');

const encodedToken = (userId,Mail) => {
    return JWT.sign({
        sub: userId,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET)
};

module.exports.auth = function (req, res) {
    res.render('auth/listUser');
}
module.exports.login = function (req, res) {
    res.render('auth/login', { errors: '0', values: '' });
}
module.exports.postLogin = function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body.email);
    console.log(req.body.password);
    Users.findOne({ email: email })
        .then(user => {
            if (!user) {
                //return res.render('auth/login',{errors:'Email không tồn tại', values:email});
                return res.status(403).json({ status: 403, data: {}, message: "Email không tồn tại" });
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        res.cookie('userId', user._id);
                        //return res.redirect('/');
                        const token = encodedToken(user._id,user.email);
                        res.setHeader('accessToken', token);
                        return res.status(200).json({
                            status: 200, data: {
                                'accessToken': token
                            }, message: "suscess"
                        });
                    }
                    //return res.render('auth/login',{errors:'Mật khẩu không đúng', values:email});
                    return res.status(401).json({ status: 401, data: {}, message: "Invalid password." });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ data: err });
                })
        })
        .catch(err => {
            console.log(err);            
            return res.status(500).json({ data: err });
        });
}
module.exports.logout = function (req, res) {
    res.clearCookie('userId');
    //res.redirect('/');
    return res.status(200).json({ data: "suscess" });
}
module.exports.register = function (req, res) {
    res.render('auth/register', { errors: "0", values: "" });
}
module.exports.CheckEmail = function (req, res) {
    var email = req.body.email;   
    Users.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                var error = "email " + email + " đã tồn tại.";
                //res.render('auth/register', { errors : error});               
                return res.status(400).json({ status: 400, data: {}, message: error });
            }
            console.log(password);
        })       
        .then(result => {
            //res.redirect('/auth/login');
            return res.status(200).json({ data: "email có thể sử dụng" });
        })
        .catch(err => {           
            return res.status(500).json({ data: err });
        })
}

module.exports.postRegister = function (req, res) {
    var email = req.body.email;
    const password = req.body.password;
    const confirmPW = req.body.confirm_password;
    if (password != confirmPW) {
        //res.render('auth/register',{errors:"xác nhận mật khẩu không thành công"});       
        return res.status(500).json({ message: "xác nhận mật khẩu không thành công" });
    }
    Users.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                var error = "email " + email + " đã tồn tại.";
                //res.render('auth/register', { errors : error});               
                return res.status(500).json({ status: 500, data: {}, message: error });
            }
            console.log(password);
            return bcrypt.hash(password, 12);
        })
        .then(hashPassword => {
            const user = new Users({
                email: req.body.email,
                nickName: req.body.nickname,
                password: hashPassword,
                dateCreate: new Date().toDateString(),
                plan : new Date().setDate(new Date().getDate() + 3)
            });
            return user.save();
        })
        .then(result => {
            //res.redirect('/auth/login');
            res.status(200).json({ data: "suscess" });
        })
        .catch(err => {
            res.status(500).json({ data: err });
            return console.log(err);
        })
}

module.exports.Reset = function (req, res) {
    res.render('auth/reset', { errors: '0', values: '' });
}

const sgMail = require('@sendgrid/mail');
//sgMail.setApiKey('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');


const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: 'ae0f116b4dcb88',
        pass: '5b39ef8f40b85a'
    }
});

// const transporter = nodemailer.createTransport({
//     host: 'smtp-pulse.com',
//     port: 465,
//     auth: {
//         user: 'thucduy0103@gmail.com',
//         pass: 'ebnRmoYrboZZ'
//     }
// });


var API_USER_ID = "a53fcd17b989efb1304363afc892e96c";
var API_SECRET = "34255bdf8f706682db05c8cd99c833fc";
var TOKEN_STORAGE = "/tmp/";
 
// sendpulse.init(API_USER_ID,API_SECRET,TOKEN_STORAGE,function() {
//     sendpulse.listAddressBooks(console.log);
// });

module.exports.postReset = function (req, res) {
    const email = req.body.email;
    sgMail.setApiKey('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');
    crypto.randomBytes(32, (err, Buffer) => {
        if (err) {
            console.log(err);
            //return redirect('auth/reset');
            return res.status(500).json({ data: err });
        }
        const token = Buffer.toString('hex');
        Users.findOne({ email: email })
            .then(user => {
                if (user) {
                    user.resetToken = token;
                    user.resetTokenExp = Date.now() + 3600000;
                    return user.save();
                }
                //return res.render('auth/reset',{errors:'Email không tồn tại trong hệ thống',values:email});
                return res.status(200).json({ data: "Email không tồn tại trong hệ thống" });
            })
            .then(result => {
                if (result) {                                      
                    // send email
                    transporter.sendMail({
                        from: 'teamovie@movie.com',
                        to: email,
                        subject: 'Sending with Movie+',
                        html: `
                        <p> Yêu cầu lấy lại mật khẩu </p>
                        <p> Click vào <a href="http://localhost:4200/forgotpassword/${token}"> link </a> để tạo mật khẩu mới </p>                    
                    `
                    })
                    //res.render('auth/reset',{errors:'Gửi thành công!',values:email});                   
                    // const msg = {
                    //     to: email,
                    //     from: 'test@example.com',
                    //     subject: 'Sending with Movie+',
                    //     html: `
                    //     <p> Yêu cầu lấy lại mật khẩu </p>
                    //     <p> Click vào <a href="https://teamovie.herokuapp.com/auth/reset/${token}"> link </a> để tạo mật khẩu mới </p>                    
                    // `
                    // };
                    // sgMail.send(msg)
                    .then(()=>{
                        res.status(200).json({ data: "Gửi thành công!","token":token });
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(500).json({ data: "Gửi lỗi"});
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ data: err });
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
module.exports.newPassword = function (req, res) {
    const token = req.params.token;
    Users.findOne({ resetToken: token })
        .then(user => {
            console.log(user);
            if (user) {
                //return res.render('auth/newPw',{email : user.email,token:token});
                return res.status(200).json({ data: token });
            }
            //return res.redirect('/');
            return res.status(404).json({ data: "Không tìm thấy" });
        })
        .catch(err => {
            res.status(500).json({ data: err });
            console.log(err);
        })
}
module.exports.postNewPassword = function (req, res) {
    const token = req.body.token;
    const newPassword = req.body.password;
    let resetUser;
    Users.findOne({ resetToken: token })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashPassword => {
            resetUser.password = hashPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExp = undefined;
            return resetUser.save();
        })
        .then(result => {
            //res.redirect('/auth/login');
            res.status(200).json({ data: "susscess" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ data: err });
        })
}

module.exports.postChangePassword = function (req, res) {
    const newPassword = req.body.password;
    let resetUser;
    Users.findOne({ _id: req.user.sub })
        .then(user => {
            console.log(user);
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashPassword => {
            resetUser.password = hashPassword;
            return resetUser.save();
        })
        .then(result => {
            res.status(200).json({ data: "change password susscess"});
        })
        .catch(err => {
            res.status(500).json({ data: err });
        })
}