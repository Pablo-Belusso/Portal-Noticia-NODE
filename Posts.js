var mongoose = require('mongoose'); // biblioteca de Modelagem de Dados de Objeto
var Schema = mongoose.Schema;

var postSchema = new Schema ({
    titulo: String,
    imagem: String,
    categoria: String,
    conteudo: String,
    slug: String
}, {collection:'posts'})

var Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;
