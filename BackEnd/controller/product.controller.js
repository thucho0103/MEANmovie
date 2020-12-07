var Product = require('../models/products.model');
const Products = require('../models/products.model');
const Movies = require('../models/movie.model');
const Comment = require('../models/comment.model');
const Users = require('../models/users.model');
const Category = require('../models/category.model');
// var bodyParser =require('body-parser');

module.exports.index =  function(req, res){ 
    Movies
        .find({})
        .limit(8)
        .exec(function(err,data){
            res.render('products/index',{title:"Movie+",dsphim:data});
        })
}

module.exports.phim = function(req, res){
    Movies.findOne({slug:req.params.item},function(err,data){
        if(err) throw err;
        res.send(data);
    });
}

module.exports.addComment = function(req, res){ 
    var movieId = req.body.movie_id;
    var comment = req.body.comment;
    var userId = req.user.sub;
     
    Users.findOne({_id:req.user.sub})
        .then(data=>{
            const cmt = new Comment({
                idMovie: movieId,
                comment : comment,
                userId :userId,
                user:data.nickName,
            });
            cmt.save();              
            return res.status(200).json({message:"success"});
        })
        .catch(err =>{            
            return res.status(500).send(err);
        });   
}

module.exports.showComment = function(req, res){ 
    Comment.find({idMovie:req.body.movie_id})
        .then(data =>{
            return res.status(200).send(data);
        })
        .catch(err =>{            
            return res.status(500).send(err);
        }); 
}

module.exports.deleteComment = function(req, res){ 
    Comment.find({idMovie:req.body.movie_id})
        .then(data =>{
            if(data.userId != req.user.sub){
                return res.status(400).json({message:"không thể xoá comment của người khác"});
            }   
            data.remove();
            return res.status(200).json({message:"success"});
        })
        .catch(err =>{            
            return res.status(500).send(err);
        }); 
}

module.exports.phimbo = function(req, res){
    var perPage = 8;
    var page = req.query.page || 1;
    Movies
        .find({"category":"phimbo"})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err,data){
            Movies.countDocuments({"category":"phimbo"}).exec(function(err,count){
                if (err) return next (err)
                res.status(200).send(data);
            })
        })
}

module.exports.phimle = function(req,res){
    var perPage = 8;
    var page = req.query.page || 1;
    Movies
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err,data){
            Movies.countDocuments({}).exec(function(err,count){
                if (err) return next (err)
                res.status(200).send(data);                
            })
        })
}
// module.exports.ChangeData = function(req,res){
//     var perPage = 100;
//     var page = req.query.page || 1;
//     console.log("abcd");
//     Movies
//         .find({})
//         .skip((perPage * page) - perPage)
//         .limit(perPage)
//         .exec(function(err,data){
//             Movies.countDocuments({}).exec(function(err,count){
//                 if (err) return next (err)            
//                 res.status(200).json({data:data});        
//             })
//         })
// }
// module.exports.ChangeData = function(req,res){
//     var perPage = 100;
//     var page = req.query.page || 1;
//     console.log("abcd");
//     Product
//         .find({"phanloai":"phimle"})
//         .skip((perPage * page) - perPage)
//         .limit(perPage)
//         .exec(function(err,data){
//             Product.countDocuments({}).exec(function(err,count){
//                 if (err) return next (err)
//                 //console.log(count);
//                 //res.status(200).json({data:data});
//                 for (let index = 0; index < data.length; index++) {
//                     const element = data[index];
//                     const movie = new Movies({
//                         title : element.ten,
//                         year : '',
//                         kind : element.theloai,
//                         category : element.phanloai,
//                         description : element.thongtin,
//                         source : element.url,
//                         imageSource : element.img,                       
//                     });
//                     movie.save();
//                 }
//                 res.json({"message":"sussecc"})               
//             })
//         })
// }
module.exports.getCategories = function(req, res){  
    console.log("data");
    Category.find({})
        .then(data=>{  
            console.log(data);  
            var result =[];
            data.forEach(element => {
                var cate = {
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

module.exports.type = function(req, res){
    var perPage = 8;
    var page = req.query.page || 1;
    let type = req.params.type;
    Movies.find({"category":type})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err,data){
        Movies.countDocuments({"category":type}).exec(function(err,count){
            if (err) {
                return res.status(500).json({message: "Error"});
            }           
            console.log(req.user.sub);
            res.status(200).send(data);
        })
    })
}

module.exports.search = function(req,res){
    var s = req.query.search;
    console.log(s);
    Movies.find({"slug": new RegExp(req.query.search, 'i') },function(err,data){
        if(err) throw err;
        res.send(data);
    })
}

// var urlencodedParser = bodyParser.urlencoded({ extended: false })
