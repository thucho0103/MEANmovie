var express = require('express');
var route = express.Router();

var authMiddleware = require('../middlewares/auth.middlerware');
var userMiddleware = require('../middlewares/user.middleware');
var controller = require('../controller/product.controller');
const passport = require('passport');
const passportConfig = require('../middlewares/passport.middleware');

route.get('/',userMiddleware.requireUser,controller.index);

route.get('/phim/:item',controller.phim);
route.get('/phimbo',passport.authenticate('jwt',{session : false}),controller.phimbo);
route.get('/phimle',passport.authenticate('jwt',{session : false}),controller.phimle);
route.get('/theloai/:type',controller.type);
route.get('/xemphim/:item',authMiddleware.requireAuth,controller.xemphim);
//route.post('/create',controller.postCreate);
route.get('/search',controller.search);
//route.get('/changemovie',controller.ChangeData);


module.exports = route;