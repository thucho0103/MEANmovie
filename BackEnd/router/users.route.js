var express = require('express');
var route = express.Router();

var validate = require('../validate/user.validate');
var controller = require('../controller/users.controller');
var authMiddleware = require('../middlewares/auth.middlerware');

route.get('/information',controller.index);
route.post('/updateinfor',controller.postUpdateInfo);
route.get('/favourite',controller.favourite);
route.post('/favourite',controller.postFavourite);
route.delete('/deleteMovie',controller.deleteFavourite);
module.exports = route;
