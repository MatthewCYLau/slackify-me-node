const port = process.env.PORT
const path = require('path');
const express = require('express');
const app = express();
const hbs = require('hbs');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const auth = require('./middleware/auth')


//Setup cookie parser
app.use(cookieParser());

//Setup database
require('./db/mongoose')

//Setup routers
const messageRouter = require('./routers/message');
const userRouter = require('./routers/user');

//Setup data models
const Message = require('./models/message');

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

//Routing
app.get('', (req, res) => {

    const userLoggedIn = (req.cookies['auth_token'])

    Message.find({}).limit(5).sort({
        'time': 'desc'
    }).exec(function (err, foundMessages) {

        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                messages: foundMessages,
                user: userLoggedIn
            });
        }

    });
});

app.get('/success', auth, (req, res) => {
    res.render('success', {
        user: req.user
    });
})

app.get('*', (req, res) => {
    res.render('404');
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})