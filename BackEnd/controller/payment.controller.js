var express = require('express');
const Users = require('../models/users.model');
var router = express.Router();
var $ = require('jquery');

module.exports.createPayment = function(req,res){
    var plan = req.query.plan;
    var amoutSelect;
    Users.findOne({ _id: req.user.sub })
        .then(user=>{
            userPayment = user;
            console.log(user.email);
            return user.email;
        })
        .then((userName)=>{
            console.log(userName);
            switch (plan) {
                case 1: 
                    amoutSelect ='40000';   
                    break;
                case 2: 
                    amoutSelect ='60000';   
                    break;
                default: amoutSelect ='20000';  
                    break;
            }    
            var ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
        
            console.log(ipAddr);
            var config = require('config');
            var dateFormat = require('dateformat');
           
            var tmnCode = config.get('vnp_TmnCode');
            var secretKey = config.get('vnp_HashSecret');
            var vnpUrl = config.get('vnp_Url');
            var returnUrl = config.get('vnp_ReturnUrl');
        
            var date = new Date();
        
            var createDate = dateFormat(date, 'yyyymmddHHmmss');
            var orderId = dateFormat(date, 'HHmmss');
            var amount = amoutSelect;
            var bankCode = '';
               
            var orderInfo = `${userName} thanh toan goi xem phim`;
            var orderType = 'billpayment';
            var locale = 'vn';
            if(locale === null || locale === ''){
                locale = 'vn';
            }
        
            var currCode = 'VND';
            var vnp_Params = {};
            vnp_Params['vnp_Version'] = '2';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            // vnp_Params['vnp_Merchant'] = ''
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = orderId;
            vnp_Params['vnp_OrderInfo'] = orderInfo;
            vnp_Params['vnp_OrderType'] = orderType;
            vnp_Params['vnp_Amount'] = amount * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            if(bankCode !== null && bankCode !== ''){
                vnp_Params['vnp_BankCode'] = bankCode;
            }
        
            vnp_Params = sortObject(vnp_Params);
        
            var querystring = require('qs');
            var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });
        
            var sha256 = require('sha256');
        
            var secureHash = sha256(signData);
        
            vnp_Params['vnp_SecureHashType'] =  'SHA256';
            vnp_Params['vnp_SecureHash'] = secureHash;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });
        
            userPayment.plan = new Date().setDate(new Date().getDate() + 30);
            userPayment.save();

            //Neu muon dung Redirect thi dong dong ben duoi
            res.status(200).json({code: '00', data: vnpUrl});
            //Neu muon dung Redirect thi mo dong ben duoi va dong dong ben tren
            //res.redirect(vnpUrl)
        })
        .catch(err=>{
            res.status(500).json({Message: err});
        })    
}

module.exports.vnpayReturn = function (req, res, next) {

    Users.find({email:req.user})
        .then(user=>{
            console.log("vnpay_return");
            var vnp_Params = req.query;
            var secureHash = vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];
            vnp_Params = sortObject(vnp_Params);
            var config = require('config');
            var tmnCode = config.get('vnp_TmnCode');
            var secretKey = config.get('vnp_HashSecret');
            var querystring = require('qs');
            var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });
            var sha256 = require('sha256');
            var checkSum = sha256(signData);
            if(secureHash === checkSum){
                //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
                res.send({code: vnp_Params['vnp_ResponseCode']});
                //res.render('success', {code: vnp_Params['vnp_ResponseCode']})
            } else{
                //res.render('success', {code: '97'})
                res.send({code: '97'});
            }
        })
        .catch(err=>{
            res.send(err);
        });
}

module.exports.vnpayIpn = function (req, res, next) {

    console.log("vnpay_ipn"); 

    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    var config = require('config');
    var secretKey = config.get('vnp_HashSecret');
    var querystring = require('qs');
    var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });
    
    var sha256 = require('sha256');

    var checkSum = sha256(signData);

    if(secureHash === checkSum){
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        res.status(200).json({RspCode: '00', Message: 'success'})
    }
    else {
        res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
    }
}

function sortObject(o) {
    var sorted = {},
        key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}
