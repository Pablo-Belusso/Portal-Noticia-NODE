const express = require('express'); // puxa o framework EXPRESS
const mongoose = require('mongoose'); // biblioteca de Modelagem de Dados de Objeto
var bodyParser = require('body-parser'); // dependência instalada do NODE

const path = require('path'); // módulo nativo do NODE
const app = express();
const Posts = require('./Posts.js');

// -----------------------------------------------------------------------------------------

// SESSÃO = Serve pra dados persistentes. EX: fazer o login ficar salvo

var session = require('express-session') // Chamando o EXPRESS SESSION


// -----------   Conexão com o MONGODB usando o MONGOOSE -------------------

mongoose.connect('mongodb+srv://root:12345@cluster0.9qwkssa.mongodb.net/belussonews?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}).then(function(){

    console.log('Conectado com sucesso!');

}).catch(function(err) {

    console.log(err.message);

})



// --------------------- BODY-PARSER -------------------
// Obs: Serve para poder usar o método POST

app.use( bodyParser.json() );     //suporta arquivos "json"
app.use( bodyParser.urlencoded({    // suporta URL codificada
    extended:true
}));

// -------------------- SESSION (Login) ----------

app.use(session({
    secret: 'keyboard cat',
    cookie: { maxAge: 60000 } // que a seção estará ativa durante 60 minutos
  }))

// ------  Para usar o arquivo HTML 
app.engine('html',require('ejs').renderFile); // renderiza a engine pra html utilizando ejs
app.set('view engine','html'); // seta a view engine para html
app.use('/public', express.static(path.join(__dirname, 'public'))); // O diretório estático será na pasta "public"
app.set('views', path.join(__dirname,'/pages')); // aponta para a pasta "views"


// -------  ROTAS  (Início) ---------------------------------------------------

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
            

            Posts.find({}).sort({'views': -1}).limit(3).exec(function(err,postsTop) {  // ordena por quantidade de views
        
                postsTop = postsTop.map(function(val){
                    return {
                        titulo: val.titulo,
                        conteudo: val.conteudo,
                        descricaoCurta: val.conteudo.substring(0,100),
                        imagem: val.imagem,
                        slug: val.slug,
                        categoria: val.categoria,
                        views: val.views
                    }
                })

                res.render('home',{posts:posts, postsTop:postsTop});
            
            })   
                          
        }).catch((err) => {
            alert('Deu pau');
        })
                
    }else{
        
        Posts.find({titulo: {$regex: req.query.busca,$options:"i"}},function(err,posts){
            console.log(posts);

            posts = posts.map(function(val){
                return {
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta: val.conteudo.substring(0,300),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria,
                    views: val.views
                }
            }) 

            res.render('busca',{posts:posts,contagem:posts.length});
        })
        
    }
     
});


app.get('/:slug',(req,res) => {   // SLUG = é o valor que está depois da barra da URL da página.
    
    Posts.findOneAndUpdate({slug: req.params.slug}, {$inc : {views: 1}}, {new: true}, function(err,resposta) {
       
        if(resposta != null) {

            Posts.find({}).sort({'views': -1}).limit(3).exec(function(err,postsTop) {  // ordena por quantidade de views
        
                postsTop = postsTop.map(function(val){
                    return {
                        titulo: val.titulo,
                        conteudo: val.conteudo,
                        descricaoCurta: val.conteudo.substring(0,100),
                        imagem: val.imagem,
                        slug: val.slug,
                        categoria: val.categoria,
                        views: val.views
                    }
                })

                res.render('single',{noticia:resposta, postsTop:postsTop});
            
            }) 

        }else{
            res.redirect('/');
        }        
    })
    
});

// ----- Rota de LOGIN ------

var usuarios = [
    {
        login: 'Pablo',
        senha: '1234'
    }
]



app.post('/admin/login', (req,res) =>{  // Verificação do Login usando o Método POST
    
    usuarios.map(function(val){ // Método MAP mapeia o conteúdo da Array "usuários"
        if(val.login == req.body.login && val.senha == req.body.senha){
            req.session.login = "Pablo";
        }
    })
    res.redirect('/admin/login');
})


app.post('/admin/cadastro',(req,res) => { // Cria a rota de CADASTRO
    res.send("Cadastrado com Sucesso!"); 
})


app.get('/admin/deletar/10',(req,res) => { // Cria a rota de DELETAR
    res.send("Deletando a notícia com ID: " + req.params.id); // envia para o navegador
})


app.get('/admin/login',(req,res) => {

    if (req.session.login == null){ // SE não estiver logado       
        res.render('admin-login');
    } else{
        res.render('admin-panel');
    }
})

// -------  ROTAS  (Fim) ---------------------------------------------------



// ------   SERVIDOR  (Início) ------------

app.listen(5000,() => {
    console.log('servidor rodando OK!');
})

// ------   SERVIDOR  (Fim) ------------