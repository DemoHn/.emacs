var dns = require("dns");
dns.resolve("qq.com","MX" ,function(e,r){
    if(e){
        console.log(e);
    }else{
        console.log(r);
    }
});

process.on("exit",function(){
    console.log("Bye");
});

