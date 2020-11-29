var express = require('express');
var route = express.Router();

var controller = require('../controller/users.controller');

route.get('/information',controller.index);
route.post('/updateinfor',controller.postUpdateInfo);

module.exports = route;
