var mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

// mongoose.connect('mongodb://localhost:27017/demo', {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://movie:admin@movie-aoto6.gcp.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.plugin(slug);   
var categorySchema = new mongoose.Schema({
    category:String,   
    categorySlug :{type: String, slug : "category"}   
})
// var list = mongoose.model('list', listSchema);
var Category = mongoose.model('Category',categorySchema, 'listCategory');

module.exports = Category;