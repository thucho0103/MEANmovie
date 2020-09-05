var express = require('express');

var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/demo', {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://movie:admin@movie-aoto6.gcp.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(error => handleError(error));
var productSchema = new mongoose.Schema({
    ten :String,
    img :String,
    poster:String,
    theloai:String,
    phanloai:[String],
    thongtin:String,
    url: String,
    mota: String,
})
// var list = mongoose.model('list', listSchema);
var Products = mongoose.model('Product',productSchema, 'dsphim');

module.exports = Products;