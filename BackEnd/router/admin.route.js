var express = require('express');
var route = express.Router();

// var validate = require('../validate/user.validate');
var controller = require('../controller/admin.controller');
var authMiddleware = require('../middlewares/admin.middlerware');

// route.get('/',authMiddleware.requireAuth,controller.index);
route.get('/',controller.index);

route.get('/login',controller.login);
route.post('/login',controller.postLogin);
route.get('/logout',controller.logout);

// create & delete products
route.get('/createMovie',controller.createProduct);
route.post('/createMovie',controller.postCreateproduct);

route.get('/editMovie/:item',controller.editProduct);
route.post('/editMovie',controller.postEditproduct);

route.post('/deleteMovie',controller.deleteProduct);

route.get('/manageuser',controller.manageuser);

route.get('/createuser',controller.createUser);
route.post('/createuser',controller.postCreateUser);

route.get('/edituser/:item',controller.editUser);
route.post('/edituser',controller.postEditUser);

route.delete('/deleteUser',controller.deleteuser);
module.exports = route;
