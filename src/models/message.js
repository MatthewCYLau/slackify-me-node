const mongoose = require('mongoose')

//Setup message schema
const messageSchema = {
    slackChannel: String,
    messageBody: String,
    time: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    }
}

const Message = mongoose.model(
    "Message", messageSchema
);

module.exports = Message