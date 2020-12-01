var express = require('express');

var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/demo', {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('momongodb+srv://movie:admin@cluster0-wmjev.gcp.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

var PaymentSchema = new mongoose.Schema({
    payment_id :String,
    amount: String,
    month:Number,
    email: String,
    status: String,
});
// var list = mongoose.model('list', listSchema);
var PaymentDetail = mongoose.model('Payment',PaymentSchema, 'payment');

module.exports = PaymentDetail;