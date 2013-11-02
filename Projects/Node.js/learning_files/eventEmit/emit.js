var events=require("events").EventEmitter;
var utils=require("util");
var Server = function (){
    console.log('init');
    console.log("I'm the first");
};
utils.inherits(Server,events);
var s=new Server();

s.on("demohn",function(){
    console.log("events");
});
s.emit("demohn");
