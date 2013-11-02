/**
 * Created with JetBrains WebStorm.
 * User: Hn
 * Date: 13-4-28
 * Time: 下午1:51
 * To change this template use File | Settings | File Templates.
 */
var http = require('http');
var util = require('util');
http.createServer(function (req, res) {

    console.log('Request received: ');
    util.log(util.inspect(req)); // this line helps you inspect the request so you can see whether the data is in the url (GET) or the req body (POST)
    util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url); // this line logs just the method and url

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    req.on('data', function (chunk) {
        console.log('GOT DATA!');
    });
    res.end('callback(\'{\"msg\": \"OK\"}\')');

}).listen(80,'127.0.0.1');
console.log('Server running on port http://127.0.0.1:1337/');