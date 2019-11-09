const path = require('path');
const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

//Setup cookie parser
app.use(cookieParser());

//Setup database
require('./db/mongoose')

//Setup routers
const messageRouter = require('./routers/message');
const userRouter = require('./routers/user');

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

//Setup body-parser
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json())
app.use(messageRouter);
app.use(userRouter);

module.exports = app