var express = require('express');
var route = express.Router();

var validate = require('../validate/user.validate');
var controller = require('../controller/auth.controller');
var authMiddleware = require('../middlewares/auth.middlerware');

// route.get('/',authMiddleware.requireAuth,controller.index);

route.get('/',controller.auth);
route.get('/login',controller.login);
route.post('/login',controller.postLogin);
route.get('/logout',controller.logout);

route.get('/register',controller.register);
route.post('/register',
    controller.postRegister
);
route.post('/checkemail',controller.CheckEmail);
route.get('/reset',controller.Reset);
route.post('/reset',controller.postReset);
route.get('/reset/:token',controller.newPassword);
route.post('/newpassword',controller.postNewPassword);

module.exports = route;
