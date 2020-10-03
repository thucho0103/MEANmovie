var Product = require('../models/products.model');
const Products = require('../models/products.model');
const Movies = require('../models/movie.model');
const Users = require('../models/users.model');
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
    // console.log(req.params.item);
    Movies.find({ten:req.params.item},function(err,data){
        if(err) throw err;
        // console.log(data);
        var infor = data[0].thongtin.split('|');
        //console.log(infor);
        res.render('products/view',{ title:"Xemphim",dsphim: data, infor : infor});
    });
}
module.exports.xemphim = function(req, res){
    // console.log(req.params.item);
    Movies.find({title:req.params.item},function(err,data){
        if(err) throw err;
        // console.log(data);
        res.render('products/xemphim',{ title:"Xemphim",dsphim: data});
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
                //console.log(count);
                res.status(200).json({data:data});
                // res.render('products/phim', {
                // title:"Phim bộ", 
                // dsphim: data , 
                // current: page,
                // pages: Math.ceil(count/perPage)});
            })
        })
}

module.exports.phimle = function(req,res){
    var perPage = 8;
    var page = req.query.page || 1;
    Movies
        .find({"category":"phimle"})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err,data){
            Movies.countDocuments({"category":"phimle"}).exec(function(err,count){
                if (err) return next (err)
                //console.log(count);
                res.status(200).json({data:data});
                // res.render('products/phim', {
                // title:"Phim lẻ", 
                // dsphim: data , 
                // current: page,
                // pages: Math.ceil(count/perPage)});
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
module.exports.type =   function(req, res){
    var perPage = 8;
    var page = req.query.page || 1;
    let type = req.params.type;
    //console.log(req.params.type);
    let title;
    switch(type) {
        case 'phimgiadinh':
            title = "phim gia đình"; break;
        case 'phimhanhdong':
            title = "phim hành động"; break;
        case 'phimvientuong':
            title = "phim viễn tưởng";break;
        case 'phimchientranh':
            title = "phim chiến tranh";break;
        case 'phimhoathinh':
            title = "phim hoạt hình";break;
        case 'phimthanthoai':
            title = "phim thần thoại";break;
        case 'phimhaihuoc':
            title = "phim hài hước";break;
        case 'phimcotrang':
            title = "phim cổ trang";break;
        case 'phimphieuluu':
            title = "phim phiêu lưu";break;
            case 'phimkinhdi':
                title = "phim kinh dị";break;
        default:
            title = "phim khác"; break;
      }
    // Product.find({"theloai":type},function(err,data){
    // if(err) throw err;
    Movies.find({"category":type})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err,data){
        Movies.countDocuments({"category":type}).exec(function(err,count){
            if (err) return next (err)
            //console.log(count);
            res.render('products/phim', {
            title:title, 
            dsphim: data , 
            current: page,
            pages: Math.ceil(count/perPage)});
        })
    })
    
    // res.render('products/search', {
    //     title:title,
    //     dsphim : data,
    //     });
    // });
}

module.exports.search = function(req,res){
    var s = req.query.search;
    console.log(s);
    Movies.find({},function(err,data){
        if(err) throw err;
        {
        var matchedUsers = data.filter(function(user){
            return user.ten.toLowerCase().indexOf(s.toLowerCase()) !== -1;
        })
            var title = "Tìm kiếm";
            if(matchedUsers.length==0) {
                title = "Không tìm thấy";
            }
            res.render('products/search', {title:title,
                dsphim: matchedUsers,
              });
        } 
    })
    // var matchedUsers = modelProduct.find({name}).val().filter(function(user) {
    // return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    //  });
//     res.render('products/listMovie', {
//     lists: matchedUsers
//   });
}

// var urlencodedParser = bodyParser.urlencoded({ extended: false })
