var express = require('express');

var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/demo', {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('momongodb+srv://movie:admin@cluster0-wmjev.gcp.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

var commentSchema = new mongoose.Schema({
    idMovie :String,
    comment: String,
    userId: String,
    user: String,
});
// var list = mongoose.model('list', listSchema);
var Comment = mongoose.model('Comment',commentSchema, 'comment');

module.exports = Comment;