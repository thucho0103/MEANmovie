
var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/demo', {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://movie:admin@movie-aoto6.gcp.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(error => handleError(error));

var movieSchema = new mongoose.Schema({
    title :String,
    slug :String,
    year: Date,
    kind: String,
    category:[String],
    description: String,
    source: [String],
    poster: String,
    imageSource: String,
    dateUpdate : String,
})
// var list = mongoose.model('list', listSchema);
var Movie = mongoose.model('Movie',movieSchema, 'listMovie');

module.exports = Movie;