var express = require('express');
var route = express.Router();

var controller = require('../controller/payment.controller');
var passport = require('passport');
const passportConfig = require('../middlewares/passport.middleware');

route.get('/create_payment',passport.authenticate('jwt',{session : false}),controller.createPayment);
route.get('/vnpay_return',controller.vnpayReturn);
route.get('/vnpay_ipn',controller.vnpayIpn);

module.exports = route;