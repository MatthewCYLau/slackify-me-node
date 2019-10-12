const port = process.env.PORT
const app = express();
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require("body-parser");

//Setup database
require('./db/mongoose')

//Setup routers
const messageRouter = require('./routers/message');

//Setup data models
const Message = require('./models/message');

//Setup body-parser
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json())
app.use(messageRouter);

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

//Routing

app.get('', (req, res) => {

    Message.find({}).limit(5).sort({
        'time': 'desc'
    }).exec(function (err, foundMessages) {

        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                messages: foundMessages
            });
        }

    });
});

app.get('/success', (req, res) => {
    res.render('success')
})

app.get('/signup', (req, res) => {
    res.render('signup');
})

app.get('*', (req, res) => {
    res.render('404')
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})