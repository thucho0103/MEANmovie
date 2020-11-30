var express = require('express');
var route = express.Router();

// var validate = require('../validate/user.validate');
var controller = require('../controller/admin.controller');
var authMiddleware = require('../middlewares/admin.middlerware');
var passport = require('passport');
const passportConfig = require('../middlewares/passport.middleware');

// route.get('/',authMiddleware.requireAuth,controller.index);
route.get('/',controller.index);

route.get('/login',controller.login);
route.post('/login',controller.postLogin);
route.get('/logout',controller.logout);

// create & delete products
route.get('/createMovie',passport.authenticate('jwt',{session : false}),authMiddleware.requireAuth,controller.createProduct);
route.post('/createMovie',passport.authenticate('jwt',{session : false}),authMiddleware.requireAuth,controller.postCreateproduct);

route.get('/editMovie/:item',passport.authenticate('jwt',{session : false}),authMiddleware.requireAuth,controller.editProduct);
route.post('/editMovie',authMiddleware.requireAuth,controller.postEditproduct);

route.get('/categories/getcategories',passport.authenticate('jwt',{session : false}),authMiddleware.requireAuth,controller.getCategories);
route.post('/categories/add',passport.authenticate('jwt',{session : false}),authMiddleware.requireAuth,controller.addCategories);

route.post('/deleteMovie',passport.authenticate('jwt',{session : false}),authMiddleware.requireAuth,controller.deleteProduct);

route.get('/manageuser',passport.authenticate('jwt',{session : false}),authMiddleware.requireAuth,controller.manageuser);

route.get('/createuser',passport.authenticate('jwt',{session : false}),authMiddleware.requireAuth,controller.createUser);
route.post('/createuser',passport.authenticate('jwt',{session : false}),authMiddleware.requireAuth,controller.postCreateUser);

route.get('/edituser/:item',passport.authenticate('jwt',{session : false}),authMiddleware.requireAuth,controller.editUser);
route.post('/edituser',passport.authenticate('jwt',{session : false}),authMiddleware.requireAuth,controller.postEditUser);

route.delete('/deleteUser',passport.authenticate('jwt',{session : false}),authMiddleware.requireAuth,controller.deleteuser);
module.exports = route;
