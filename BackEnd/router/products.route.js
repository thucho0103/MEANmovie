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

route.get('/categories/:type',controller.type);
route.get('/categories',controller.getCategories);

route.post('/rating/create',controller.addComment);
route.post('/rating/get',controller.showComment);

route.post('/comment/create',controller.addComment);
route.post('/comment/get',controller.showComment);
route.post('/comment/delete',controller.deleteComment);

route.get('/search',controller.search);
//route.get('/changemovie',controller.ChangeData);


module.exports = route;