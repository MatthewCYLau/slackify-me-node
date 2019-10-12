const express = require('express');
const router = new express.Router();
const Message = require('../models/message');
const sendMessage = require("../utils/message")

router.get('/message', (req, res) => {
    res.render('message');
})

router.post("/message", function (req, res) {

    console.log(req.body)

    const slackChannel = "DE2QP24U8";
    const messageBody = req.body.messageBody;
    const slackAuthToken = process.env.SLACK_AUTH_TOKEN;

    sendMessage(slackChannel, slackAuthToken, messageBody, (err) => {

        if (err) {
            console.log(err);
        } else {
            const message = new Message({
                slackChannel,
                messageBody,
            });
            message.save(function (err) {

                if (!err) {
                    console.log("Successfully saved new message")
                    res.redirect("/success");
                }
            });
        }
    })
});

module.exports = router;