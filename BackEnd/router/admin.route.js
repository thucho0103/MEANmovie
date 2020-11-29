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
route.get('/createMovie',authMiddleware.requireAuth,controller.createProduct);
route.post('/createMovie',authMiddleware.requireAuth,controller.postCreateproduct);

route.get('/editMovie/:item',authMiddleware.requireAuth,controller.editProduct);
route.post('/editMovie',authMiddleware.requireAuth,controller.postEditproduct);

route.get('/categories/getcategories',authMiddleware.requireAuth,controller.getCategories);
route.post('/categories/add',authMiddleware.requireAuth,controller.addCategories);

route.post('/deleteMovie',authMiddleware.requireAuth,controller.deleteProduct);

route.get('/manageuser',authMiddleware.requireAuth,controller.manageuser);

route.get('/createuser',authMiddleware.requireAuth,controller.createUser);
route.post('/createuser',authMiddleware.requireAuth,controller.postCreateUser);

route.get('/edituser/:item',authMiddleware.requireAuth,controller.editUser);
route.post('/edituser',authMiddleware.requireAuth,controller.postEditUser);

route.delete('/deleteUser',authMiddleware.requireAuth,controller.deleteuser);
module.exports = route;
