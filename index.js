const express = require('express'); // puxa o framework EXPRESS
const mongoose = require('mongoose'); // biblioteca de Modelagem de Dados de Objeto
var bodyParser = require('body-parser'); // dependência instalada do NODE

const path = require('path'); // módulo nativo do NODE

const app = express();

const Posts = require('./Posts.js');

// -----------   Conexão com o MONGODB usando o MONGOOSE -------------------

mongoose.connect('mongodb+srv://root:12345@cluster0.9qwkssa.mongodb.net/belussonews?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}).then(function(){

    console.log('Conectado com sucesso!');

}).catch(function(err) {

    console.log(err.message);

})



// BODY-PARSER
app.use( bodyParser.json() );     //suporta arquivos "json"
app.use( bodyParser.urlencoded({    // suporta URL codificada
    extended:true
}));

// -- Para usar o arquivo HTML 
app.engine('html',require('ejs').renderFile); // renderiza a engine pra html utilizando ejs
app.set('view engine','html'); // seta a view engine para html
app.use('/public', express.static(path.join(__dirname, 'public'))); // O diretório estático será na pasta "public"
app.set('views', path.join(__dirname,'/pages')); // aponta para a pasta "views"


// ROTAS  ---------------------------------------------------

app.get('/',(req,res) => {       // PÁGINA HOME  -- 
    console.log(req.query);

    if(req.query.busca == null){   // Validação de Rotas
        
        Posts.find({}).sort({'_id': -1}).then((posts) => {
        
            posts = posts.map(function(val){
                return {
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta: val.conteudo.substring(0,100),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria
                }
            })
        
            res.render('home',{posts:posts});
        
        }).catch((err) => {
            alert('Deu pau');
        })
                
    }else{
        
        res.render('busca',{});
    }
     

});


app.get('/:slug',(req,res) => {   // SLUG = é o valor que está depois da barra da URL da página.
    
    //res.send(req.params.slug); 
    res.render('single',{});

});

// ROTAS  ---------------------------------------------------


// -- SERVIDOR
app.listen(5000,() => {
    console.log('servidor rodando OK!');
})