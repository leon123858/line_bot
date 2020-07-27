'use strict';
var line = require('@line/bot-sdk');
var express = require('express');
var app = new express();

// create LINE SDK client
var config = {
    channelAccessToken: "u0N3oQ7dZgmkWR9gtkneYUnvlCg1txZwlIT8rlYfbncpxEoki4XwUhDvqRlPvLmLlbVSA+GK0iYMORhRg2AwhOqyJIEc09ntDnd7NZ9GCU+3AA1p9GK4ZzH65818Xg93KcpJMzk+xWX0pR/yu+KWTgdB04t89/1O/w1cDnyilFU=",
    channelSecret: '58511c6e40bf7c8b9e762308e25dab23'
}
const client = new line.Client(config);

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
        
});

// event handler
function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }
    console.log(event);
    // create a echoing text message
    const echo = { type: 'text', text: event.message.text + '\n寶寶可愛' };
    // use reply API
    return client.replyMessage(event.replyToken, echo);
}


app.post('/', function (req, res) {
    holder(req.body.event);
});

var server = app.listen(8080, function () {
    var port = server.address().port;
    console.log('app now running on port', port);
});

