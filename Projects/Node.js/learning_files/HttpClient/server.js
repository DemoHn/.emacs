var http = require("http");
var opts={
    host:"www.baidu.com",
    port:80,
    path:'/',
    method:"POST"
};

var req = http.request(opts,function(res){
    res.setEncoding("utf8");
    console.log(res);
    res.on("data",function(chuck){
        console.log("BODY : "+chuck);
    })
});

req.write("Demohn");
req.write("hn");
req.end();