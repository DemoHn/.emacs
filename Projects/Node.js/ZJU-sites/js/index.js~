var util = require("util");
var db = require("./db");
var hc =  require("./condition");
var m = require("mongoose");
var request = require("request");
var event = require("events");
var cheerio = require("cheerio");
var uri = require("url");
var dns = require("dns");
var async = require("async");

var em = new event.EventEmitter();

/*在所有还没抓的网页从数据库中出来后放到内存当中去*/
var UndoneSiteList = [];

var Timeout = 5000; //当超过规定时间时直接跳过.单位为ms

/*基本函数*/
/*基本页面,url操作*/
var getSite = function(url,opt,callback){
  opt = opt || {};
  opt.uri = url;
  opt.method = "GET";
  opt.followRedirect = false ; /*强制关闭跳转*/

  request(opt,function(err,req,body){
    if(err){
      console.log("ERR:"+err);
      return callback({},"");
    }else{
      return callback(req,body);
    }
  });

  setTimeout(function(){
    return callback({},null);
  },Timeout);
};

/*将文档的所有的<a>标签给挖出来*/
var pickAllLinks = function(req,body,callback){

  if(body === null){
    console.log("访问超时!");
    return callback(null);
  }

  var $ = cheerio.load(body);
  var reg_code = /(\d)(\d)(\d)/;
  var href_array = [];

  /*如果出现了跳转,则将跳转后的值做特殊处理*/
  if(reg_code.exec(req.statusCode)[1] == 3){
    href_array[0] = req.headers.location;
  }else{
    $("a").each(function(i,elem){
      href_array[i] = $(this).attr("href");
    });
  }
  callback(href_array);
};

var judgeLink = function(url,condition,callback){
  if(url === null){
    return callback(null);
  }

  var qs = uri.parse(url);
  var return_data = {
    host:"",
    ip:[],
    port:80, //http默认端口
    name:""
  };

  var reg_numhost = /([1-2]?[0-9]?[1-9])\.([1-2]?[0-9]?[1-9])\.([1-2]?[0-9]?[1-9])\.([1-2]?[0-9]?[1-9])/; //only for ipv4

  if(reg_numhost.test(qs.host) === true){
    return_data.host = "";
    return_data.ip = [qs.host];
  }


  //进行condition检测
  /*为了检测它是不是ZJU的网段,我们只好对它进行Dns解析了*/
  return async.waterfall([
    function(callback){

      if(hc.handleCondition(condition["beforeDNS"],qs) == true){
        /*进行一次dns查询,如果有错就抛出异常*/
        dns.resolve(qs.host,function(err,addr){
          if(err){
            console.log("A DNS Error occured in "+url);
          }
          callback(err,addr);
        });
      }else{
        callback(null,null);
      }
    },

    /*对传回来的ip地址进行分析*/
    function(addr,callback){

      if(addr == null || addr == []){
        return callback(null,false,{});
      }else{
        for(var i=0;i<addr.length;i++){
          var adr ={ip:addr[i]};
          if(hc.handleCondition(condition["afterDNS"],adr) == false){
            return callback(null,false,{});
          }
        }
      }
      return_data.port = qs.port || 80;
      return_data.ip = addr;
      return_data.host = qs.host;
      return_data.name = url;

      return callback(null,true,return_data);
    }

  ],
                         /*读取从上面回来的数据.
                          * 其中result为布尔:
                          * true表示符合条件,并在data中返回应有的数据;
                          * false表示不符合条件,data返回为空.*/
                         function(err,result,data){
                           callback(result,data);
                         });
};


/*数据库操作*/
/*如果数据库中没有counter这个表,那就初始化一个*/
var __updateCounter = function(){
  var counter = new db.Counter({NodeId:10000,RootId:0});
  db.Counter.find(function(err,doc){
    if(err){
      console.log("DB:"+err);
    }else{
      if(doc.length == 0){
        counter.save(function(err){
          if(err){
            console.log("DB saving data Error!");
          }
        });
      }
    }
  });
};

/*得到所有还没有开抓的网页. "即_status=0"的字段*/
var getUndoneLinks = function(callback){
  db.Link.find(
    {_status:0},
    function(err,doc){
      if(err){
        console.log(err);
      }else{
        callback(doc);
      }
    }
  );
};

/*检测有没有已经收录在数据库中*/
var isStored = function(host,callback){
  db.Link.find({host:host},function(err,doc){
    if(err){
      console.log(err);
    }else{
      if(doc.length == 0){ // 表示没有记录
        callback(true);
      }else{
        callback(false);
      }
    }
  });
};

/*在抓取完成了以后就将_status = 1,以表明解锁.*/
var unlockStatus = function(id,callback){
  db.Link.update(
    {"_id":Number(id)},
    {$set:{_status:1}},
    function(err){
      callback();
    });
};

var saveLink = function(opts,parentId,callback){
  var ROOT_IDENTIFIER = 0;
  var _jsonConcat = function(o1,o2){
    for(var key in o1){
      o2[key] = o1[key];
    }
    return o2;
  };

  async.waterfall([

    /*访问site_counters数据库,并+1后读出其中的数据*/
    function(callback){
      if(parentId == ROOT_IDENTIFIER){
        /*添加根节点时,减少它的RootId*/
        db.Counter.update({RootId:{$ne:10}},{$inc:{RootId:-1}},function(err,doc){
          db.Counter.find(function(err,doc){
            callback(err,doc);
          });
        });
      }else{
        db.Counter.update({NodeId:{$ne:-1}},{$inc:{NodeId:1}},function(err,doc){
          db.Counter.find(function(err,doc){
            callback(err,doc);
          });
        });
      }
    },

    /*将parentId,_id等数据拼进来.*/
    function(doc,callback){
      var opt_id = {
        _id : parentId == ROOT_IDENTIFIER ? doc[0]["RootId"]:doc[0]["NodeId"],
        _parentId:parentId,
        _status:0
      };

      var data = _jsonConcat(opt_id,opts);
      return callback(null,data);
    },
    /*把修改后的数据作为一个新字段加入到site_structs数据库中*/
    function(data,callback){
      var linked = new db.Link(data);

      linked.save(function(err){
        if(err){
          console.log(err);
        }else{
          callback(null);
        }

      });
    }
  ],function(err){
    if(typeof callback === "function"){
      callback();
    }
  });
};

/*从外界增加抓包起点*/
var __addRoot = function(root_sites){
  var new_arr = [];
  var isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };
  if(root_sites != undefined){
    if(isArray(root_sites)){
      for(var k=0;k<root_sites.length;k++){
        var new_info = {name:root_sites[k],"_parentId":0};
        new_arr[k] = new_info;
      }
      _main(new_arr,true);
    }else{
      var new_info = {name:root_sites,"_parentId":0};
      new_arr[0] = new_info;
      _main(new_arr,true);
    }
  }
};

/*工作代码*/
var __updateUndoneSiteList = function(){
  UndoneSiteList = [];
  getUndoneLinks(function(doc){
    for(var j=0;j<doc.length;j++){
      var new_doc = {
        name:doc[j]["name"],
        "_parentId":doc[j]["_parentId"],
        "_id":doc[j]["_id"]
      };
      UndoneSiteList.push(new_doc);
    }
    _main(UndoneSiteList);
  });
};

var _init = function(){
  __updateCounter();
  __addRoot(root_sites);
  __updateUndoneSiteList();
};

/*单次抓包,将undone_site_list中的所有链接都给抓一遍*/
var _main = function(list,once){
  async.eachSeries(list,function(li,callback){
    _catchSite(li,function(){
      callback();
    });
  },function(err){
    if(err){
      console.log(err);
    }
    if(once != true || once == undefined){
      em.emit("catch_end");
    }
  });
};

var _catchSite = function(site,callback){

  async.waterfall([
    function(callback){
      util.log("正在抓取:"+site.name);
      getSite(site.name,{},function(req,body){
        callback(null,req,body);
      });
    },
    function(req,body,callback){
      pickAllLinks(req,body,function(href){
        util.log("正在分析:"+site.name);
        callback(null,href);
      });
    },function(hrefs,callback){

      if(hrefs === null){
        return(callback(new Error()));
      }

      async.eachSeries(hrefs,function(hi,callback){
        async.waterfall([
          function(callback){
            if(hi == undefined){hi = "";} //人为将无效的url变成"",以防呵呵
            var u = uri.parse(hi);
            isStored(u.host,function(bool){
              var condition = {
                "beforeDNS":["$and",["$ne","#host",null],bool],
                "afterDNS":["$match","^10\.+","#ip"]
              };
              callback(null,condition);
            });
          },function(condition,callback){
            judgeLink(hi,condition,function(result,data){

              if(result === true){
                var parentId = site["_parentId"];
                callback(null,data,parentId);
              }else{
                callback(new Error(),{});
              }
            });
          },function(data,parentId,callback){
            util.log("正在导入:"+data.name);
            saveLink(data,parentId,function(){
              callback(null);
            });
          }
        ],function(){
          callback();
        });
      },function(err){
        if(err){
          console.log(err);
        }else{
          callback(null);
        }
      });
    },function(callback){
      unlockStatus(site["_id"],function(){
        callback(null);
      });
    }
  ],function(){
    callback();
  });
};

/*这使得抓包大业能够在上一次抓包结束了以后继续*/
var root_sites = ["http://www.cc98.org/","http://www.zju.edu.cn/c2033773/catalog.html"];
_init();
em.on("catch_end",function(){
  console.log("即将执行下一次更新...");
  __updateUndoneSiteList();
});