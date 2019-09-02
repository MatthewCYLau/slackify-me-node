const request = require("request");

const sendMessage = (slackChannel, messageBody, callback) => {

    const url = "https://slack.com/api/chat.postMessage";
    const authToken = "xoxp-140168250439-479776639701-670077327843-9d74fa532adb08084c74d11f50a724dc";

    const payload = {
        'channel': slackChannel,
        'text': messageBody
    }
    const headers = {
        'Authorization': 'Bearer ' + authToken
    }

    const options = {
        method: 'POST',
        body: payload,
        json: true,
        url,
        headers,
    }

    request(options, (err, res) => {
        if (err) {
            callback(err);
        } else {
            console.log('Successfully posted message onto Slack');
            callback(undefined);
        }
    })
}
module.exports = sendMessage