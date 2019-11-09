const app = require('./app')
const port = process.env.PORT
const auth = require('./middleware/auth')

//Setup data models
const Message = require('./models/message');

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