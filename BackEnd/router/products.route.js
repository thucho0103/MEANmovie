var express = require('express');
var route = express.Router();

var authMiddleware = require('../middlewares/auth.middlerware');
var userMiddleware = require('../middlewares/user.middleware');
var controller = require('../controller/product.controller');
const passport = require('passport');
const passportConfig = require('../middlewares/passport.middleware');

route.get('/',userMiddleware.requireUser,controller.index);

route.get('/watch/:item',controller.phim);
route.get('/phimbo',controller.phimbo);
route.get('/phimle',controller.phimle);
route.get('/categories/getcategories',controller.getCategories);

route.post('/categories/add',controller.addCategories);
route.get('/categories/:type',controller.type);

route.post('/rating/create',controller.addComment);
route.post('/rating/get',controller.showComment);

route.post('/comment/create',controller.addComment);
route.post('/comment/get',controller.showComment);

route.get('/search',controller.search);
//route.get('/changemovie',controller.ChangeData);


module.exports = route;