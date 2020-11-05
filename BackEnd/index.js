var express = require('express');
var bodyParser =require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var cors = require('cors')

var productRoute = require('./router/products.route');
var usersRoute = require('./router/users.route');
var authRoute = require('./router/auth.route');
var adminRoute = require('./router/admin.route');
var paymentRoute = require('./router/payment.route');

// var authMiddleware = require('./middlewares/auth.middlerware');
var passport = require('passport');
const passportConfig = require('./middlewares/passport.middleware');

var port = process.env.PORT || 3000;

var app = express();

app.set('view engine','ejs');
app.set('views','./views');

app.use(express.static('./public'));
app.use(cors())

app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(urlencodedParser);
app.use(cookieParser());
// app.use(showUser.showUser);
// Route 
app.use('/movie',passport.authenticate('jwt',{session : false}),productRoute);
app.use('/users',usersRoute);
app.use('/auth',authRoute);
app.use('/admin',adminRoute);
app.use('/payment',passport.authenticate('jwt',{session : false}),paymentRoute);

// app.get('/',userMiddleware.requireUser,function(req, res){
//     res.render('products/index');
// })

app.listen(port);
console.log('server running on ' + port);