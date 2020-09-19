var express = require('express');

var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/demo', {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('momongodb+srv://movie:admin@cluster0-wmjev.gcp.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(error => console.log(error));
var userSchema = new mongoose.Schema({
    userName :String,
    password: String,
    email : String,
    phoneNumber : String,
    address : String,
    dateCreate : String,
    resetToken: String,
    resetTokenExp: Date,
    favourites : [Object],
})
// var list = mongoose.model('list', listSchema);
var Users = mongoose.model('Users',userSchema, 'users');

module.exports = Users;