import app from './app';
import path from 'path';
import Express from 'express';
import bodyParser from 'body-parser';
//const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));
app.use('/', Express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//app.use(session({secret: 'segredo', saveUninitialized: true, resave: true}));

app.listen(process.env.PORT || 3333);
