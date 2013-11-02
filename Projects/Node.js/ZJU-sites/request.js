var links = require("./db");
var req = require("request");
var event = require("events");
var cheerio = require("cheerio");
var em = new event.EventEmitter();



var saveLink = function(source_link,opt){
  opt.uri = source_link;
  opt.method = "GET";
  opt.followRedirect = false;/*强制将跳转关闭*/
  req(opt,function(err,req,body){
    if(err){
      console.log(err);
    }else{
      if(req.statusCode == 200){
        console.log("success!");
        var new_link = new links({
          host:source_link,
          ip:"",//TODO 实现对ip地址的记录
          catchTime:new Date(),
          statusCode:200,
          userType:(opt.userType || 0), // 0 代表是机器抓的~~
          title:(opt.title || ""),
          sources:(opt.sources || ""),
          lastUpdated:new Date()
        });

        new_link.save();
        em.emit("req_success",body);
      }
    }
  });
};

var catchUrl = function(body){
  var $ = cheerio.load(body);
  $("a").each(function(i,elem){
    console.log($(this).attr("href"));
  });
};

// 对url值进行分析.如果符合条件的话则返回0,不符合就返回一些奇怪的东西

var RegUrl = function(host,url){
  var reg_url = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  if(reg_url.test(url) == true){
    return true;
  }else{
    return false;
  }
};

em.on("req_success",function(body){
  console.log(body);
  catchUrl(body);
});

// saveLink("http://www.zju.edu.cn",{});

console.log(RegUrl("","http://www.baidu.com/"));