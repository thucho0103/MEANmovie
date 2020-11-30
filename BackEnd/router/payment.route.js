var express = require('express');
var route = express.Router();

var controller = require('../controller/payment.controller');

route.get('/create_payment',controller.createPayment);
route.get('/vnpay_return',controller.vnpayReturn);
route.get('/vnpay_ipn',controller.vnpayIpn);

module.exports = route;