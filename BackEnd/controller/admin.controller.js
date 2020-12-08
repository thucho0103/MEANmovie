var Admin = require('../models/admin.model');
var Users = require('../models/users.model');
var axios = require('axios');
var cheerio = require('cheerio');
const bcrypt = require('bcrypt');
const Movie = require('../models/movie.model');
const Category = require('../models/category.model');
const Payment = require('../models/paymentDetail.model');
const JWT = require('jsonwebtoken');

const { JWT_SECRET } = require('../middlewares/jwt.middlerware');

const encodedToken = (userId) => {
    return JWT.sign({
        sub: userId,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1),
    }, JWT_SECRET)
};
module.exports.index = function(req,res){
    var perPage = 20;
    var page = req.query.page || 1;
    Movie
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err,data){
            Movie.countDocuments({}).exec(function(err,count){
                if (err) return next (err)
                return res.status(200).send(data);
            })
        })
}
module.exports.login = function(req, res){
    res.render('admin/login');
}
module.exports.postLogin = function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    console.log(email+" "+ password);
    Users.findOne({ email: email })
        .then(user => {
            if (!user) {
                //return res.render('auth/login',{errors:'Email không tồn tại', values:email});
                return res.status(403).json({ status: 403, data: {}, message: "Admin không tồn tại" });
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    console.log(doMatch);
                    if (doMatch) {                       
                        const token = encodedToken(user._id,user.email);
                        res.setHeader('accessToken', token);
                        return res.status(200).json({
                            status: 200, data: {
                                'accessToken': token
                            }, message: "suscess"
                        });                    
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
    Movie.find({title:req.body.title})
        .then(data =>{
            if(data.length){
                return res.status(200).json({ message: "Tên phim đã tồn tại" });
            }           
            var movie = {
                title : req.body.title,
                year: req.body.year,
                kind: req.body.kind,
                category: req.body.category.split(","),
                description: req.body.description,
                source: req.body.source.split(","),
                poster: req.body.poster,
                imageSource: req.body.imageSource,
                dateUpload : req.body.dateUpload,
            }
            var newMovie = Movie(movie)
            .save(function(err,data){
                if (err) throw err;
                return res.status(200).json({ message: "Thêm phim thành công" });
            });
        })
        .catch(err => {                     
            return res.status(500).json({ message: err });
        }); 
}
module.exports.editProduct = function(req, res){
    Movie.findOne({_id:req.params.item})
            .then(data =>{
                console.log(data.phanloai);
                res.render('admin/editMovie',{values:data});
            })
            .catch(err=>{
                console.log(err);
            })
}
module.exports. postEditproduct = function(req,res){
    console.log(req.body);
    Movie.findOne({_id: req.body.id})
        .then(movie=>{
            console.log(movie);
            movie.title = req.body.title;
            movie.year = req.body.year;
            movie.kind = req.body.kind;
            movie.category = req.body.category.split(",");
            movie.description = req.body.description;
            movie.source = req.body.source.split(",");
            movie.poster = req.body.poster;
            movie.imageSource = req.body.imageSource;
            movie.dateUpload = req.body.dateUpload;           
            movie.save();           
        })
        .then(result =>{
            return res.status(200).json({message : "Cập nhật thành công"});
        })
        .catch(err=>{
            return res.status(500).json({message : "Cập nhật thất bại"})
        })
    
}
// delete product
module.exports.deleteProduct = function(req,res){
    Movie.findOne({_id: req.body.id})
    .then(movie=>{
        console.log(movie);
        if(!movie){
            return res.status(200).json({message : "Phim không tồn tại"});
        }
        else{
            movie.remove();
            return res.status(200).json({message : "Xoá thành công"});
        }       
    })
    .catch(err=>{
        return res.status(500).json({message : err});
    });      
}
// create user
module.exports.createUser = function(req, res){
    res.render('admin/createuser',{errors:'0'});
}
module.exports.postCreateUser = function(req,res){
    const password =req.body.password;
    Users.find({email: req.body.email})
        .then(data =>{
            if(data.length){               
                return res.status(400).json({errors:"email đã tồn tại"});;
            }
            return bcrypt.hash(password, 12)
        .then(HashPassword=>{
            var user = {
                nickName:req.body.nickname,
                email:req.body.email,
                password : HashPassword,
                plan: Date.parse(req.body.plan),
                password:req.body.password,
                dateCreate: Date.parse(req.body.dateCreate),
            }
            var newUser = Users(user).save(function(err,data){
                if (err) res.status(500).send(err);   
                res.status(200).json({message : "Thêm thành công"});           
            });
        })           
        })
        .catch(err=>{
            res.status(500).send(err);   
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
                if (err) return res.status(500).send(err);
                var listUser = [];               
                data.forEach(element => {
                    if(!element.isAdmin){
                        var today = element.plan;
                        var dd = today.getDate();
                        var mm = today.getMonth()+1; 
                        var yyyy = today.getFullYear();
                        if(dd<10) 
                        {
                            dd='0'+dd;
                        } 
                        if(mm<10) 
                        {
                            mm='0'+mm;
                        }
                        var user_infor ={
                            id:element._id,
                            email:element.email,
                            nickname:element.nickName,
                            dateCreate:element.dateCreate,
                            plan:dd+'/'+mm+'/'+yyyy,              
                        };
                        
                        listUser.push(user_infor);
                    }                   
                });
                res.status(200).json({data:listUser,current :page,pages:Math.ceil(count/perPage)});
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
    var currentUser;
    Users.findOne({_id: req.body.id})
        .then(user=>{
            if(!user){
                return res.status(400).json({message : "user không tồn tại"});
            }
            currentUser = user;
            return bcrypt.hash(req.body.password, 12); 
        }) 
        .then(HashPassword=>{
            console.log(HashPassword);
            currentUser.nickName = req.body.nickname;
            currentUser.email = req.body.email;
            currentUser.password = HashPassword;
            currentUser.dateCreate = req.body.dateCreate;
            currentUser.plan = new Date(Date.parse(req.body.plan));             
            currentUser.save();      
            res.status(200).json({message : "Cập nhật thành công"});  
        })                          
        .catch(err=>{
            console.log(err);
            res.status(500).json({message : "Cập nhật thất bại"});
        })        
}

module.exports.addCategories = function(req, res){  
    const newCategory = req.body.Category;
    Category.findOne({category:newCategory})
        .then(result=>{
            console.log(result);
            if(result){
                return res.status(400).json({message : "Category đã tồn tại"});
            }
            const cate = new Category({
                category:newCategory
            });
            cate.save(); 
            res.status(200).json({message : "Thêm mới thành công"}); 
        })
        .catch(err=>{
            res.status(500).send(err);   
        })        
}

module.exports.editCategories = function(req, res){  
    Category.findOne({_id:req.body.id})
        .then(result=>{
            if(!result){
                return res.status(400).json({message : "category không tồn tại"});
            }
            result.category = req.body.category;                       
            result.save();      
            res.status(200).json({message : "Cập nhật thành công"}); 
        })
        .catch(err=>{
            res.status(500).send(err);   
        })
}

module.exports.deleteCategories = function(req, res){  
    Category.findOne({_id:req.body.id})
        .then(result=>{
            if(!result){
                return res.status(400).json({message : "category không tồn tại"});
            }
            console.log(result);
            result.remove();      
            res.status(200).json({message : "Xoá thành công"}); 
        })
        .catch(err=>{
            res.status(500).send(err);   
        })
}
module.exports.getCategories = function(req, res){  
    Category.find({})
        .then(data=>{    
            var result =[];
            data.forEach(element => {
                var cate = {
                    id:element._id,
                    title:element.category,
                    name:element.categorySlug,
                };
                result.push(cate);
            });       
            res.status(200).send(result);
        })  
        .catch(err=>{
            res.status(500).send(err);   
        });
}

// delete user 
module.exports.deleteuser = function(req, res){
    Users.findOne({_id: req.body.id})
    .then(user=>{
        console.log(user);
        if(!user){
            return res.status(200).json({message : "Người dùng không tồn tại"});
        }
        else{
            user.remove();
            return res.status(200).json({message : "Người dùng thành công"});
        }       
    })
    .catch(err=>{
        return res.status(500).json({message : err});
    }); 
}

module.exports.listPayment = function(req, res){
    Payment.find({})
    .then(list=>{
        return res.status(200).send(list);             
    })
    .catch(err=>{
        return res.status(500).json({message : err});
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