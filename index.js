
const express = require("express")
const fs = require("fs");
const bodyParser = require('body-parser');

const Discord = require("discord.js")
const bot = new Discord.Client()
const disTokken = 'Nzg5MTM5NzU1MzUwMDk3OTgw.X9ttqw.7Qe4X6m0nXRlgjxzvfsGkki6f3s'
const PREFIX = '~';

/////////bot location
bot.on('ready', () => {
    console.log("Monius is ready!");
})
// var isPlayingMusic = false;
var musicList = [];
bot.on('message', async msg => {
    if (!msg.guild) return;
    //
    // console.log(msg.content.substring(0, 1));
    if (msg.content.substring(0, 1) != PREFIX) return;
    let session = (msg.content.substring(1, msg.content.length)).split(" ")
    if (session[0] === 'p') {
        musicList.length = 0;
        for (let i = 1; i < session.length; i++) { musicList.push(session[i]); }

        if (msg.member.voice.channel) {
            const connection = await msg.member.voice.channel.join();
            const ytdl = require('ytdl-core');
            recPlay(ytdl, connection, musicList, 0)
        } else { msg.reply('You need to join a voice channel first!'); }

        msg.reply('Danh sách đã khởi tạo, vui lòng chỉ dùng ~a nếu bạn muốn thêm nhạc!');
    } else if (session[0] === 'a') {
        musicList.push(session[1]);
        msg.reply("Đã thêm, bây giờ danh sách có " + musicList.length + " bản nhạc");
    }
    console.log(session, session.length);
    console.log('ms ls', musicList);
});
function recPlay(ytdl, connection, musicListRecPlay, index) {
    if (typeof musicListRecPlay[index] == 'undefined') { console.log('end!'); return }

    const dispatcher = connection.play(ytdl(musicListRecPlay[index], { filter: 'audioonly' }));
    dispatcher.on('finish', () => {
        recPlay(ytdl, connection, musicListRecPlay, index + 1)
    });

}
bot.login(disTokken);
/////////close bot location ^^^^^^^

const app = express().use(bodyParser.json());
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))
// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }))
let port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json("Im feaz!")
})
app.get("/monius", (req, res) => {
    res.json("Im Monius!")
})
// ////////////////////////////////////////////////
// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {

    let body = req.body;
    console.log("à", body);

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});
// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "mobius"

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});
///////////////////////////////////////////////////
app.get("/:par1", (req, res) => {
    fs.readFile("./index.html", (err, data) => {
        let content = data.toString() + " ";
        if (req.params.par1 == "khoa") {
            content = content.replace("{content}", "Địt mẹ mày khoa!")
        } else if (req.params.par1 == "feaz") {
            content = content.replace("{content}", "Wellcome home Master!")
        } else {
            content = content.replace("{content}", "404 Có vẻ trang này không tồn tại")
        }
        res.send(content);
    })
})

app.get("*", (req, res) => {

    // req.body
    // req.params
    // req.query

    fs.readFile("./index.html", (err, data) => {
        let content = data.toString() + " ";
        content = content.replace("{content}", "404 Có vẻ trang này không tồn tại")
        res.send(content);
    })
})

app.listen(port, () => {
    console.log("App is running!!!");
})



// const express = require("express")
// const fs = require("fs");
// const app = express();
// let port = process.env.PORT || 3000;

// app.get("/", (req, res) => {
//     res.json("Im feaz!")
// })
// app.get("/:par1", (req, res) => {
//     fs.readFile("./index.html", (err, data) => {
//         let content = data.toString() + " ";
//         if (req.params.par1 == "khoa") {
//             content = content.replace("{content}", "Địt mẹ mày khoa!")
//         } else if (req.params.par1 == "feaz") {
//             content = content.replace("{content}", "Wellcome home Master!")
//         } else {
//             content = content.replace("{content}", "404 Có vẻ trang này không tồn tại")
//         }
//         res.send(content);
//     })
// })
// app.get("/callback", (req, res) => {
//     res.json("hihihi")
// })
// app.get("*", (req, res) => {

//     // req.body
//     // req.params
//     // req.query

//     fs.readFile("./index.html", (err, data) => {
//         let content = data.toString() + " ";
//         content = content.replace("{content}", "404 Có vẻ trang này không tồn tại")
//         res.send(content);
//     })
// })

// app.listen(port, () => {
//     console.log("App is running!!!");
// })