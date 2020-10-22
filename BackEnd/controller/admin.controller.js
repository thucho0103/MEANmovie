var Admin = require('../models/admin.model');
var Product = require('../models/products.model');
var Users = require('../models/users.model');
var axios = require('axios');
var cheerio = require('cheerio');
const bcrypt = require('bcrypt');
const Products = require('../models/products.model');
const Movie = require('../models/movie.model');

const { JWT_SECRET } = require('../middlewares/jwt.middlerware');

const encodedToken = (userId) => {
    return JWT.sign({
        sub: userId,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1),
    }, JWT_SECRET)
};


// index of admin
module.exports.index = function(req,res){
    var perPage = 10;
    var page = req.query.page || 1;
    Product
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err,data){
            Product.countDocuments({}).exec(function(err,count){
                if (err) return next (err)
                //console.log(count);
                res.render('admin/dashboad', {
                dsphim: data , 
                current: page,
                pages: Math.ceil(count/perPage)});
            })
        })
}
// login
module.exports.login = function(req, res){
    res.render('admin/login');
}
module.exports.postLogin = function(req,res){
    var userName = req.body.username;
    var password = req.body.password;
    //console.log(userName+" "+ password);
    Admin.findOne({ userName: userName })
        .then(user => {
            if (!user) {
                //return res.render('auth/login',{errors:'Email không tồn tại', values:email});
                return res.status(403).json({ status: 403, data: {}, message: "Admin không tồn tại" });
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        res.cookie('userId', user._id);
                        //return res.redirect('/');
                        
                    }
                    //return res.render('auth/login',{errors:'Mật khẩu không đúng', values:email});
                    return res.status(401).json({ status: 401, data: {}, message: "Invalid password." });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ data: err });
                })
        })
        .catch(err => {
            res.status(500).json({ data: err });
            return console.log(err);
        });
}
// logout
module.exports.logout = function(req, res){
    res.clearCookie('adminId');
    res.redirect('/');
}
// create product
module.exports.createProduct = function(req, res){
    res.render('admin/createMovie',{errors:'0'});
}
module.exports.postCreateproduct = function(req,res){
    //console.log(req.body.ten);
    Product.find({ten: req.body.ten}, function(err,data) {
        var errors = ['tên phim đã tồn tại'];
        if(data.length){
            res.render('admin/createMovie',{errors:errors});
            return;
        }
        //var theloai = change_alias(req.body.theloai);
        //console.log(theloai);
        var vientuong = req.body.phimvientuong;
        var thanthoai = req.body.phimthanthoai;
        var giadinh = req.body.phimgiadinh;
        var hanhdong = req.body.phimhanhdong;
        var trinhtham = req.body.phimtrinhtham;
        var kinhdi = req.body.phimkinhdi;
        var cotrang = req.body.phimcotrang;
        var haihuoc = req.body.phimhaihuoc;
        var hoathinh = req.body.phimhoathinh;
        var phimle = req.body.phimle;
        var phimbo = req.body.phimbo;
        var phanloai = [];
        if(vientuong=='on') phanloai.push('phimvientuong'); 
        if(thanthoai=='on') phanloai.push('phimthanthoai');  
        if(giadinh=='on')   phanloai.push('phimgiadinh');
        if(hanhdong=='on')  phanloai.push('phimhanhdong');
        if(trinhtham=='on') phanloai.push('phimtrinhtham');  
        if(kinhdi=='on')    phanloai.push('phimkinhdi');  
        if(cotrang=='on')   phanloai.push('phimcotrang'); 
        if(haihuoc=='on')   phanloai.push('phimhaihuoc'); 
        if(hoathinh=='on')  phanloai.push('phimhoathinh');  
        if(phimle=='on')    phanloai.push('phimle'); 
        if(phimbo=='on')    phanloai.push('phimbo'); 
        console.log(kinhdi);
        var newphim = {
            ten : req.body.ten,
            img : req.body.img,
            theloai : req.body.theloai,
            // phanloai: theloai.split(','),
            phanloai :phanloai,
            thongtin:req.body.thongtin,
            url: req.body.url,
            mota: req.body.mota,
        };
        var newProduct = Product(newphim).save(function(err,data){
            if (err) throw err;
            res.redirect('/admin');
        });
    });
}
// edit product
// module.exports.editProduct = function(req, res){
//     Product.findOne({_id:req.params.item},function(err,data){
//         if (err) throw err;
//         console.log(data.phanloai[i]);
//         res.render('admin/editMovie',{values:data});
//     });
// }
module.exports.editProduct = function(req, res){
    Products.findOne({_id:req.params.item})
            .then(data =>{
                console.log(data.phanloai);
                res.render('admin/editMovie',{values:data});
            })
            .catch(err=>{
                console.log(err);
            })
}
module.exports.postEditproduct = function(req,res){
    //var phanloai = change_alias(req.body.theloai);
    var vientuong = req.body.phimvientuong;
    var thanthoai = req.body.phimthanthoai;
    var giadinh = req.body.phimgiadinh;
    var hanhdong = req.body.phimhanhdong;
    var trinhtham = req.body.phimtrinhtham;
    var kinhdi = req.body.phimkinhdi;
    var cotrang = req.body.phimcotrang;
    var haihuoc = req.body.phimhaihuoc;
    var hoathinh = req.body.phimhoathinh;
    var phimle = req.body.phimle;
    var phimbo = req.body.phimbo;
    console.log(kinhdi);
    Product.findOne({_id: req.body.id})
        .then(product=>{
            product.ten = req.body.ten;
            product.img = req.body.img;
            product.theloai = req.body.theloai;
            product.phanloai = [];
            
            if(vientuong=='on') product.phanloai.push('phimvientuong'); 
            if(thanthoai=='on') product.phanloai.push('phimthanthoai');  
            if(giadinh=='on')   product.phanloai.push('phimgiadinh');
            if(hanhdong=='on')  product.phanloai.push('phimhanhdong');
            if(trinhtham=='on') product.phanloai.push('phimtrinhtham');  
            if(kinhdi=='on')    product.phanloai.push('phimkinhdi');  
            if(cotrang=='on')   product.phanloai.push('phimcotrang'); 
            if(haihuoc=='on')   product.phanloai.push('phimhaihuoc'); 
            if(hoathinh=='on')   product.phanloai.push('phimhoathinh');  
            if(phimle=='on')   product.phanloai.push('phimle'); 
            if(phimbo=='on')   product.phanloai.push('phimbo'); 

            //product.phanloai = phanloai.split(',');
            product.thongtin = req.body.thongtin;
            product.url = req.body.url;
            product.mota = req.body.mota;
            product.save();
        })
        .then(result =>{
            res.redirect('/admin');
        })
        .catch(err=>{
            console.log(err);
        })
}
// delete product
module.exports.deleteProduct = function(req,res){
    Product.findOne({_id: req.body.id}).deleteOne(function(err,data){
        if(err) throw err;
        res.redirect("/admin");
    });
    // console.log(req.body.id);
}
// create user
module.exports.createUser = function(req, res){
    res.render('admin/createuser',{errors:'0'});
}
module.exports.postCreateUser = function(req,res){
    Users.find({email: req.body.email}, function(err,data) {
        var errors = ['email đã tồn tại'];
        if(data.length){
            res.render('admin/createuser',{errors:errors});
            return;
        }
        var user = {
            userName:req.body.userName,
            email:req.body.email,
            phoneNumber:req.body.phoneNumber,
            password:req.body.password,
            dateCreate: new Date().toDateString(),
        }
        var newUser = Users(user).save(function(err,data){
            if (err) throw err;
            res.redirect('/admin/manageuser');
        });
    });
}
// managa user 
module.exports.manageuser = function(req, res){
    var perPage = 10;
    var page = req.query.page || 1;
    Users
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err,data){
            Users.countDocuments({}).exec(function(err,count){
                if (err) return next (err)
                //console.log(count);
                res.render('admin/manageUser', {
                users: data , 
                current: page,
                pages: Math.ceil(count/perPage)});
            })
        })
}

// edit user
module.exports.editUser= function(req, res){
    Users.find({email:req.params.item},function(err,data){
        if (err) throw err;
        res.render('admin/editUser',{errors:'0', values:data[0]});
    });
}
module.exports.postEditUser = function(req,res){
    Users.findOneAndUpdate({email : req.body.email},
        {
        userName : req.body.userName,
        email: req.body.email,
        phoneNumber:req.body.phoneNumber,
        password: req.password,
        },
        function(err,data){
            if(err) throw err;
            res.redirect("/admin/manageuser");
        }
    )
}
// delete user 
module.exports.deleteuser = function(req, res){
    // console.log(req.body.id);
    Users.findOne({_id: req.body.id}).deleteOne(function(err,data){
        if(err) throw err;
        res.redirect('/admin/manageuser');
    });
}
module.exports.crawl = function(req,res){
    res.render('admin/phimmoi');
}
module.exports.postCrawl = function(req,res){
    console.log(req.body.link);
    var link = req.body.link;
    var url = req.body.url;
    getlink(link, url);
    res.render('admin/phimmoi');
}
function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.replace(/\s/g,'');
    str = str.trim(); 
    return str;
}
function getlink(link, url){
    axios.get(link,
        { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36' }  } )
        .then((res)=>{
            var result = [];
            var arr1 = [];
            var arr2 = [];
            const html = res.data;
            const $ = cheerio.load(html);
            $('.movie-dd').each((_index,text)=>{
                arr1.push($(text).text());
            });
            $('.movie-dt').each((_index,text)=>{
                arr2.push($(text).text());
            });
        for(var i =0; i< arr1.length;i++){
            var info = arr2[i]+arr1[i] +'|';
            result.push(info);
        }
        var t ='';
        result.forEach(element => {
            t= t+element;
        });
        // console.log(t);
        var ten = $('.title-1 > a').text();
        var content = $('#film-content').text();
        var img = $('.movie-l-img > img ').attr('src');
        var type = change_alias(arr1[arr1.length-2]);
        var product = {
            title: ten,
            imageSource:img,
            kind:arr1[arr1.length-2],
            category:type.split(','),
            description:content,
            source:url,
        }
        console.log(product);
        var newProduct = Movie(product).save();
    })
}