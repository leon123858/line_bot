'use strict';
var fs = require('fs');
var line = require('@line/bot-sdk');
var express = require('express');
var bodyParser = require('body-parser');
var app = new express();
var HTTPpath = "";
var learn_word = "";
var gradeTable = {};
var usermode = {};

//ejs set
app.engine('.html', require('ejs').__express)
app.set('view engine', 'html')
app.set('views', __dirname + '/views');//指定模板位置
//get static data
fs.readFile('./static/httpPath.txt', function (err, data) {
    if (err) { console.log(err); return; }
    HTTPpath = data.toString();
    console.log(HTTPpath);
})
fs.readFile('./static/grade.csv', 'utf8', function (err, data) {
    if (err) {console.log(err);return;}
    let dataArray = data.split('\r\n');
    for (var i = 0; i < dataArray.length; i++) {
        let list = dataArray[i].split('\t');
        gradeTable[list[0]] = {1:list[1], 2:list[2], 3:list[3]}
    }
});
fs.readFile('./static/learn.txt', 'utf8', function (err, data) {
    if (err) { console.log(err); return; }
    learn_word = data.toString();
});
//get static data by http
app.use(express.static(__dirname + '/static'));//使html直接去static資料夾找連結靜態資料
app.use('/static', express.static(__dirname + '/static'));//使static可取靜態資料
// create LINE SDK client
var config = {
    channelAccessToken: "u0N3oQ7dZgmkWR9gtkneYUnvlCg1txZwlIT8rlYfbncpxEoki4XwUhDvqRlPvLmLlbVSA+GK0iYMORhRg2AwhOqyJIEc09ntDnd7NZ9GCU+3AA1p9GK4ZzH65818Xg93KcpJMzk+xWX0pR/yu+KWTgdB04t89/1O/w1cDnyilFU=",
    channelSecret: '58511c6e40bf7c8b9e762308e25dab23'
}
const client = new line.Client(config);

// register a webhook handler with middleware
// about the middleware, please refer to doc
//首頁
app.get('/view', function (req, res) {
    res.render("index");//轉換頁面 find from views
});
//changeview
app.get('/changeview/:aid', function (req, res, next) {
    if (req.params.aid.toString() == 'broadcast') {
        fs.readFile('./static/emoji.txt', 'utf8', function (err, data) {
            if (err) { console.log(err); return; }
            res.render(req.params.aid.toString(), { emoji: data});
        });
    }
    else
        res.render(req.params.aid.toString());
});
//line bot
app.post('/', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});
//function in handler for line bot
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function showImg(who, where, name, prename, words, str) {
    return who.replyMessage(where.replyToken,[
        {
            type: 'image',
            originalContentUrl: HTTPpath+'/'+ name +'.jpg',
            previewImageUrl: HTTPpath + '/'+ prename + '.jpg'
        },
        { type: 'text', text: words + '\n' + str }]
    )
}
function say(who,where, words,str) {
    // create a echoing text message
    const echo = { type: 'text', text: words + '\n' + str };
    // use reply API
    return who.replyMessage(where.replyToken, echo);
}
function getgrade(int) {
    if (gradeTable[int.toString()])
        return 'first test:' + gradeTable[int.toString()][1] + '\nsecond test:' + gradeTable[int.toString()][2] + '\nthird test:' + gradeTable[int.toString()][3];
    else
        return  '沒有這個座號\n輸入範例:12';
}
function random_nice_string(who,where) {
    fs.readFile('./static/nice_string.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            return say(client, event, '今天沒句子', '謝謝使用,如有問題請聯絡XXXXXX');
        }
        let list = data.toString().split('\r\n');
        let str = list[getRandomInt(list.length)];
        console.log(str);
        if (str == "")  str = list[0];
        return say(who, where, str, '謝謝使用,如有問題請聯絡XXXXXX');
    });
}
// event handler
function handleEvent(event) {
    console.log(event);
    switch (String(event.message.type)) {
        case 'text':
            console.log(event.message.text);
            if (usermode[event.source.userId] == 'somerequest') {
                fs.appendFile('./static/requestrecord.txt', '\n-------------\n' + event.message.text + '\n-------------\n', function (err) {
                    if (err) console.log(err);
                    else console.log('Write operation complete.');
                });
                usermode[event.source.userId] = '';
                return say(client, event, '感謝您的意見反映', '謝謝使用,如有問題請聯絡XXXXXX');
            }
            else if (event.message.text == '課表')
                return showImg(client, event, 'classtable', 'classtable', '以上是' + event.message.text, '謝謝使用,如有問題請聯絡XXXXXX');
            else if (event.message.text == '行事曆')
                return showImg(client, event, 'schedule', 'schedule', '以上是' + event.message.text, '謝謝使用,如有問題請聯絡XXXXXX');
            else if (event.message.text == '教學')
                return say(client, event,   '😀' + learn_word, '謝謝使用,如有問題請聯絡XXXXXX');
            else if (event.message.text == '抽名言')
                return random_nice_string(client, event);
            else if (event.message.text == '成績') {
                usermode[event.source.userId] = 'askgrade';
                return say(client, event, '請告訴我學號幾號', '謝謝');
            }
            else if (!isNaN(event.message.text))
                if (usermode[event.source.userId] == 'askgrade') {
                    usermode[event.source.userId] = '';
                    return say(client, event, getgrade(parseInt(event.message.text.toString())), '謝謝使用,如有問題請聯絡XXXXXX')
                }
                else {
                    usermode[event.source.userId] = '';
                    return say(client, event, '無法直接填寫座號', '請再輸入一次成績\n謝謝');
                }
            else if (event.message.text == '意見反映') {
                usermode[event.source.userId] = 'somerequest';
                return say(client, event, '請直接在下方輸入想說的話(不可中途送出)', '謝謝(如果希望讓我知道是誰寄的可以在下面署名喔)');
            }
            else if (event.message.text.split('-')[0] == '紀錄ID') {
                fs.appendFile('./static/IDrecord.txt', '\n' + event.message.text +'['+ event.source.userId + ']', function (err) {
                    if (err) console.log(err);
                    else console.log('Write operation complete.');
                });
                return say(client, event, '謝謝 已記下line對應資料', '之後將根據您的填表結果傳遞個人化資訊\n問卷連結:XXXXXXX');
            }
            else
                return say(client, event, '無此功能, 情直接輸入指令\nex:課表', '謝謝使用,如有問題請聯絡XXXXXX');
        case 'sticker':
            console.log('sticker');
            return say(client, event,'我看不懂貼圖', '可愛');
        default:
            console.log('default');
            return Promise.resolve(null);
    }
}

//post
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //get json
//broadcast
app.post('/broadcast', function (req, res) {
    //const echo = { type: 'text', text: req.body.str };
    console.log(req.body);
    const img = {
        type: 'image',
        originalContentUrl: req.body.img,
        previewImageUrl: req.body.img
    }
    if (req.body.username == 'admin' && req.body.userpassword == '0000')
        res.render("index");
    //console.log("broadcast:" + echo);
    //client.broadcast(echo);
    client.broadcast(img);
})

var server = app.listen(8080, function () {
    var port = server.address().port;
    console.log('app now running on port', port);
});

