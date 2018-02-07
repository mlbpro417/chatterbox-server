/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var uuidv1 = require('uuid/v1');
var url = require('url');
var fs = require('fs');
var path = require('path');


var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, X-Parse-Application-Id, X-Parse-REST-API-Key',  
  'access-control-max-age': 10 // Seconds.
};

// var dummyData = {
//   results:
//     [
//       {"objectId":"qvBx1fkdiJ","username":"Mike","roomname":"lobby","text":"Super","createdAt":"2018-02-05T22:23:41.053Z","updatedAt":"2018-02-05T22:23:41.053Z"},
//       {"objectId":"cb7RQqGhqv","username":"chatterbug","text":"chatterbug chatterbug chatterbug!","roomname":"lobby","createdAt":"2018-02-05T22:22:18.969Z","updatedAt":"2018-02-05T22:22:18.969Z"},
//       {"objectId":"eGyugj6y08","username":"hello%20world","text":"woe is me","roomname":"lobby","createdAt":"2018-02-05T19:30:53.268Z","updatedAt":"2018-02-05T19:30:53.268Z"},{"objectId":"5zHgPe8M8E","username":"hello%20world","text":"still works","roomname":"lobby","createdAt":"2018-02-05T19:19:01.052Z","updatedAt":"2018-02-05T19:19:01.052Z"},{"objectId":"mfKITzNIQN","username":"RicochetRobot","roomname":"lobby","text":"boo","createdAt":"2018-02-04T21:38:49.116Z","updatedAt":"2018-02-04T21:38:49.116Z"},
//     ],
// };

var messageList = {results: []};

exports.requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  console.log('Request object', request.url);

  var message;

  if (request.url === '/classes/messages' || request.url === '/classes/messages?order=-createdAt') {
    // message = JSON.stringify(messageList);
    if (request.method === 'GET') {
      if (messageList.results.length === 0) {
        message = JSON.stringify({ 
          results: [ {
            objectId: uuidv1(),
            username: 'Beth',
            text: 'I love bugs!',
            roomname: 'lobby'
          }
          ]
        });
      } else { 
        message = JSON.stringify(messageList);
      } // The outgoing status.
      var statusCode = 200;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, headers);
      response.end(message);
      
    } else if (request.method === 'POST') {
      // message = JSON.stringify('something posted');
      // get the data from the POST message
      let body = [];
      request.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        // at this point, `body` has the entire request body stored in it as a string

        // console.log('POST body is ', body);
        
        // parse the body into username, text, roomname
        body = JSON.parse(body);
        body.objectId = uuidv1();
        
        // push it to our messages array
        messageList.results.push(body);

        // send 201 response      
        var statusCode = 201;
        var headers = defaultCorsHeaders;
        headers['Content-Type'] = 'text/plain';
        response.writeHead(statusCode, headers);
        response.end('SUCCESSFULLY CREATED');
      });
      
      
    } else if (request.method === 'OPTIONS') {
      var optionsHeaders = {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'access-control-allow-headers': 'content-type, accept, X-Parse-Application-Id, X-Parse-REST-API-Key',  
        'access-control-max-age': 10, // Seconds.
        'Allow': 'GET, POST, OPTIONS' 
      };
      var apiDescription = 
        {
          "POST": {
            "description": "Post a message",
            "parameters": {
              "text": {
                "type": "string",
                "description": "Message text",
              },
              "username": {
                "type": "string",
                "description": "Your username",
              },
              "roomname": {
                "type": "string",
                "description": "Name of the room to chat in"
              },
            },
            "example": {
              "text": "I found a bug!",
              "username": "Beth",
              "roomname": "lobby"
            }
          }
        };
      message = JSON.stringify(apiDescription);
      var statusCode = 200;
      var headers = optionsHeaders;
      headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, headers);
      response.end(message);
      
    } else {
      // handles PUT and DELETE 
      var optionsHeaders = {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'access-control-allow-headers': 'content-type, accept, X-Parse-Application-Id, X-Parse-REST-API-Key',  
        'access-control-max-age': 10, // Seconds.
        'Allow': 'GET, POST, OPTIONS' 
      };
      // message = JSON.stringify('some other method');
      var statusCode = 405;
      //var headers = defaultCorsHeaders;
      //headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, optionsHeaders);
      response.end();
      
    }
  } else {
    // parse URL
    const parsedUrl = url.parse(request.url);
    // extract URL path
    let pathname = `.${parsedUrl.pathname}`;
    // maps file extention to MIME types
    const mimeType = {
      '.ico': 'image/x-icon',
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.eot': 'application/vnd.ms-fontobject',
      '.ttf': 'application/font-sfnt',
      '.gif': 'image/gif'
    };

    console.log('pathname is', pathname);
    pathname = '../client/client/' + pathname;
    console.log('new pathname is', pathname); 

    // check if the filename exists
    // use fs.stat
    fs.stat(pathname, function(err, stats) {
      console.log(stats);
      // if the file doesn't exist
      if (stats === undefined) {
        var statusCode = 404;
        console.log('this is our status code', statusCode);
        response.writeHead(statusCode);
        response.end();
      } else if (stats.isDirectory()) {
        // if the file is a directory, search for index.html inside of it
        // use fs.isDirectory
        pathname = pathname + '/index.html';
        console.log('this is our new pathname', pathname);
      }
      // otherwise try to open the file
      // use fs.readFile
      fs.readFile(pathname, function(err, data) {
        if (err) {
          // if theres an error return an error
          var statusCode = 500;
          console.log('error reading file', statusCode);
          response.writeHead(statusCode);
          response.end();
        } else {
          // read file succesfully
          var extension = path.extname(pathname);
          var fileType = mimeType[extension];
          if (fileType === undefined) {
            fileType = 'text/plain';
          } 
          console.log('extension, pathname, and fileType', extension, pathname, fileType);
          var statusCode = 200;
          var optionsHeaders = {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'access-control-allow-headers': 'content-type, accept, X-Parse-Application-Id, X-Parse-REST-API-Key',  
            'access-control-max-age': 10, // Seconds.
            'content-type': fileType
          }; 
          response.writeHead(statusCode, optionsHeaders);
          // send the file
          response.end(data);
        }
      });  
    });
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

