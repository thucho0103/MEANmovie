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

var controller = require('./controller/admin.controller');

var authMiddleware = require('./middlewares/admin.middlerware');
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

app.get('/crawl',controller.crawl);
app.post('/crawl',controller.postCrawl);

app.use('/movie',passport.authenticate('jwt',{session : false}),productRoute);
app.use('/users',passport.authenticate('jwt',{session : false}),usersRoute);
app.use('/auth',authRoute);
app.use('/admin',passport.authenticate('jwt',{session : false}),authMiddleware.requireAuth,adminRoute);
app.use('/payment',paymentRoute);

// app.get('/',userMiddleware.requireUser,function(req, res){
//     res.render('products/index');
// })

app.listen(port);
console.log('server running on ' + port);