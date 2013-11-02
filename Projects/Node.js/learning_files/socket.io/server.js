var http=require("http");
var io=require("socket.io");
var fs=require("fs");

var sockFile=fs.readFileSync("client.html");
server=http.createServer();

server.on("request",function(req,res){
    res.writeHead(200,{"Content-Type":"text/html"});
    res.end(sockFile);
});
server.listen(8080);
var socket=io.listen(server);

socket.on("connection",function(client){
    console.log("Client Connected");
    client.send("Welcome client "+client.sessionIdContext);
});

