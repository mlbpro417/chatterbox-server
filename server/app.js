const express = require('express');
var bodyParser = require('body-parser');
let uuidv1 = require('uuid/v1');

const app = express();

let messageList = {results: [ {
  objectId: uuidv1(),
  username: 'Beth',
  text: 'I love bugs!',
  roomname: 'lobby'
}]};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Parse-Application-Id, X-Parse-REST-API-Key");
  next();
});


app.use(bodyParser.json()); // for parsing application/json

app.get('/', (req, res) => res.send('Hello World!'));

app.get(['/classes/messages', '/classes/messages?order=-createdAt'], (req, res) => { 
  res.status(200).json(messageList);
});

app.options(['/classes/messages', '/classes/messages?order=-createdAt'], (req, res) => { 
  res.append('Allow', 'GET, POST, OPTIONS');
  res.status(200).end();
});

app.post('/classes/messages', (req, res) => { 
  console.log(req);
  let newMessage = {
    objectId: uuidv1(),
    roomname: req.body.roomname,
    text: req.body.text,
    username: req.body.username
  };
  messageList.results.push(newMessage);
  res.status(201).end();
});



app.listen(3000, () => console.log('Example app listening on port 3000!'));

//(request.url === '/classes/messages' || request.url === '/classes/messages?order=-createdAt')

