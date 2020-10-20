var express = require('express');

var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/demo', {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('momongodb+srv://movie:admin@cluster0-wmjev.gcp.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

var adminSchema = new mongoose.Schema({
    userName :String,
    password: String,
})
// var list = mongoose.model('list', listSchema);
var Admin = mongoose.model('Admin',adminSchema, 'admin');

module.exports = Admin;