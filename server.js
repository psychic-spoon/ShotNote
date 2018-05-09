const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');

/*Server*/
const server = express();
const port = 8181;

server.listen(port,()=>console.log(`Server started on ${port}. Welcome to ShotNote`));

/*Connect to mongoose*/
mongoose.connect("mongodb://localhost/shotnote-dev")
.then(()=>console.log("MongoDB connected ..."))
.catch(err=>console.log(err));

/*Middleware*/
//Helmet
server.use(helmet());
server.use(express.static(path.join(__dirname, 'public')));

//Handlebars
server.engine('handlebars', exphbs({defaultLayout: 'main'}));
server.set('view engine', 'handlebars');

//BodyParser
server.use(bodyParser.urlencoded({extended:false}));
server.use(bodyParser.json());

server.use(methodOverride('_method'));

server.use(session({
    secret: 'something',
    resave:true,
    saveUninitialized:true
}));

server.use(flash());

//Global variables
server.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
})

/*Routes*/
const notes=require('./routes/notes');
server.use('/notes',notes);

const users=require('./routes/users');
server.use('/users',users);

// //Main
server.get('/',(req,res)=>res.render('home'));

//HeartBeat
server.get('/heartbeat',(req,res)=>res.send('It works'));

