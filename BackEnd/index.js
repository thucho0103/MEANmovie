var express = require('express');
var bodyParser =require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');

var productRoute = require('./router/products.route');
var usersRoute = require('./router/users.route');
var authRoute = require('./router/auth.route');
var adminRoute = require('./router/admin.route');

// var authMiddleware = require('./middlewares/auth.middlerware');
var userMiddleware = require('./middlewares/user.middleware');

var port = process.env.PORT || 3000;

var app = express();

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.static('./public'));

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(urlencodedParser);
app.use(cookieParser());
// app.use(showUser.showUser);
// Route 
app.use('/',userMiddleware.requireUser,productRoute);
app.use('/users',usersRoute);
app.use('/auth',authRoute);
app.use('/admin',adminRoute);

// app.get('/',userMiddleware.requireUser,function(req, res){
//     res.render('products/index');
// })

app.listen(port);
console.log('server running on ' + port);