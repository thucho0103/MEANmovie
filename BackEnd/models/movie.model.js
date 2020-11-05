
var mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

// mongoose.connect('mongodb://localhost:27017/demo', {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://movie:admin@movie-aoto6.gcp.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.plugin(slug);   
var movieSchema = new mongoose.Schema({
    title :String,
    slug :{type: String, slug : "title"},
    year: String,
    kind: String,
    category:[String],
    description: String,
    source: [String],
    poster: String,
    imageSource: String,
    dateUpdate : String,
})
// var list = mongoose.model('list', listSchema);
//movieSchema.set('timestamps', true);
var Movie = mongoose.model('Movie',movieSchema, 'listMovie');

module.exports = Movie;