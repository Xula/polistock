import app from './app';
import path from 'path';
import Express from 'express';
import bodyParser from 'body-parser';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));
app.use('/', Express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(process.env.PORT || 3333);
