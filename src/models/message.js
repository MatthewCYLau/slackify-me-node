const mongoose = require('mongoose')

//Setup message schema
const messageSchema = {
    slackChannel: String,
    messageBody: String,
    time: {
        type: Date,
        default: Date.now
    }
}

const Message = mongoose.model(
    "Message", messageSchema
);

module.exports = Message