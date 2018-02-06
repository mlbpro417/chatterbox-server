/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
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
    message = JSON.stringify(messageList);
    if (request.method === 'GET') {
      
      message = JSON.stringify(messageList);
      // The outgoing status.
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
        
        // create a message object
        // var newMessage = {
        //   username: body.username,
        //   text: body.text || body.message,
        //   roomname: body.roomname || 'lobby'
        // };
        // console.log(newMessage);
        // push it to our messages array
        messageList.results.push(body);

        // send 201 response      
        var statusCode = 201;
        var headers = defaultCorsHeaders;
        // headers['Content-Type'] = 'text/plain';
        response.writeHead(statusCode, headers);
        response.end('');
      });
      
      
    } else if (request.method === 'OPTIONS') {
      
      message = JSON.stringify('options options');
      var statusCode = 200;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, headers);
      response.end(message);
      
    } else {
      
      message = JSON.stringify('some other method');
      var statusCode = 200;
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, headers);
      response.end(message);
      
    }
  } else if (request.url === '/') {
    message = 'Sweet Home Alabama';
    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    response.end(message);

  } else {
    var statusCode = 404;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'text/plain';
    response.writeHead(statusCode, headers);
    response.end('These ARENT the droids you\'re looking 404' );
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

