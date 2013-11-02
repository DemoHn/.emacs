var http= require("http");
var server=http.createServer();
var handleReq=function (req,res){
    res.writeHead(200,{});
    console.log("req"+req.toString());
    console.log("res"+res.toString());
    res.end("Hi");
};

var handleConnection=function(req,res){
    console.log(arguments[0]);
};

var handleClose=function(){
    console.log("just an end");
};
server.on("request",handleReq);
server.on("connection",handleConnection);

server.listen(8080);