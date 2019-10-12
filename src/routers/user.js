const express = require('express');
const router = new express.Router();
const User = require('../models/user')
const auth = require('../middleware/auth')

router.get('/users/signup', async (req, res) => {
    res.render('signup');
})

router.get('/users/login', async (req, res) => {
    res.render('login');
})

router.post('/users/signup', async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const user = new User({
        username,
        password
    })

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({
            user,
            token
        })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken();
        res.send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send();
    }
})

router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })

        await req.user.save();
        res.send();
    } catch (e) {
        res.statue(500).send();
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = [];

        await req.user.save();
        res.send();
    } catch (e) {
        res.statue(500).send();
    }
})

module.exports = router;