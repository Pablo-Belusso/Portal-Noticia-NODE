const express = require('express'); // puxa o framework EXPRESS
const path = require('path'); // módulo nativo do NODE
var bodyParser = require('body-parser'); // dependência instalada do NODE

const app = express();

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

app.get('/',(req,res) => {       // PÁGINA HOME
    console.log(req.query);

    if(req.query.busca == null){   // valida se está tendo busca:
        res.render('home',{});
    }else{
        res.send('Você buscou: '+req.query.busca);
    }
     

});


app.get('/:slug',(req,res) => {   // PÁGINA INDIVIDUAL DA NOTÍCIA
    
    res.send(req.params.slug); 

});

// ROTAS  ---------------------------------------------------


// -- SERVIDOR
app.listen(5000,() => {
    console.log('servidor rodando OK!');
})