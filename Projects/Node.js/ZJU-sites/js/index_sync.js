var util = require("util");
var db = require("./db");
var hc =  require("./condition");
var request = require("request");
var event = require("events");
var cheerio = require("cheerio");
var uri = require("url");
var dns = require("dns");
var async = require("async");

var em = new event.EventEmitter();

/*在所有还没抓的网页从数据库中出来后放到内存当中去*/
var UndoneSiteList = [];

var TIME_LIMIT = 5000; //当超过规定时间时直接跳过.单位为ms

/*基本操作*/
/*抓取到链接所在的页面*/
var getSite = function(url,opt,callback){

  // 如果url为空的话直接退出
  if(url == null || url == ""){
    return callback(null,null);
  }

  opt = opt || {};
  opt.uri = url;
  opt.method = "GET";
  opt.followRedirect = false ; /*强制关闭跳转*/

  var req = request(opt,function(err,req,body){
    if(err){
      return callback(null,null);
    }else{
      return callback(req,body);
    }
  });

  /*检测是否有超时,如果有,则直接中断*/
  req.on('socket',function(socket){
    socket.setTimeout(TIME_LIMIT);
    socket.on("timeout",function(){
      req.abort();
      return callback(null,null);
    });
  });

};

/*将文档的所有的<a>标签给挖出来*/
var pickAllLinks = function(req,body,callback){

  if(body === null || req == null){
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

// 判断抓出来的链接是否符合我们的要求
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
          callback(null,addr);
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

/*专门用来判断一系列的链接,并存到数据库上来*/
var judgeAndSaveAllLinks = function(source_site,url_array,callback){

  // 将读取到的所有链接先暂时存到内存中,便于比对
  var temp_all_links = [];
  var _isArray = function(obj){
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  if(!_isArray(url_array)){
    return (typeof callback === 'function')?callback(null):null;
  }else if(url_array.length == 0){
    return (typeof callback === 'function')?callback(null):null;
  }else{
    async.each(url_array,function(i,callback){
      if(i === undefined) i = ""; //人为将无效的url变成"",以防undefined出错
      var u = uri.parse(i);
      async.waterfall([
        function(callback){
          temp_all_links.push(u);
          isStored(u.host,function(bool){
            callback(null,bool);
          });
        },function(bool,callback){
          var condition = {
            "beforeDNS":["$and",["$ne","#host",null],bool],
            "afterDNS":["$match","^10\.+","#ip"]
          };

          judgeLink(i,condition,function(result,data){

            if(result === true){
              var parentId = source_site["_id"];
              callback(null,data,parentId);
            }else{
              callback(new Error(),{});
            }
          });
        },function(data,parentId,callback){
          util.log("正在保存"+data.name+"到数据库");
          saveLink(data,data.parentId,function(){
            callback(null);
          });
        }
      ],function(){
        callback();
      });
    },function(err){
      if(err)
        throw err;
      else
        unlockStatus(source_site["_id"],function(){
          return (typeof callback === 'function')?callback(null):null;
        });
    });
  }
};
/*数据库操作*/

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
    {"_id":id},
    {$set:{_status:1}},
    function(err){
      callback();
    });
};

var saveLink = function(opts,parentId,callback){
  var _jsonConcat = function(o1,o2){
    for(var key in o1){
      o2[key] = o1[key];
    }
    return o2;
  };

  async.waterfall([
    /*将parentId,_id等数据拼进来.*/
    function(callback){
      var opt_id = {
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
    }else{
      return "success";
    }
  });
};

/*从外界增加抓包起点*/
//TODO 对起点进行数据检查
var __addRoot = function(root_sites,callback){
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
      async.each(new_arr,function(i,callback){
        saveLink(i,0,function(){});
      },function(err){
          callback();
      });

    }else{
      var new_info = {name:root_sites,"_parentId":0};
      new_arr[0] = new_info;
      saveLink(new_arr[0],0,function(){
        console.log("new"+new_arr[0]);
        callback();
      });
    }
  }
};

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
    main(UndoneSiteList);
  });
};

/*抓包流程*/

/*一次抓包的完整流程,支持同步操作和异步操作*/
var CatchOnce= function(site,opt,callback){
  async.waterfall([
    function(callback){
      console.log("get "+site.name);
      getSite(site.name,opt,function(req,body){
        callback(null,req,body);
      });
    },
    function(req,body,callback){
      pickAllLinks(req,body,function(hrefs){

        callback(null,hrefs);
      });
    },
    function(hrefs,callback){
      judgeAndSaveAllLinks(site,hrefs,function(){
        callback(null);
      });
    }
  ],function(){
    if(typeof callback === 'function'){
      callback(null);
    }
  });
};

var main = function(list,once){
  async.each(list,function(j,callback){
    CatchOnce(j,function(){
    });
  },function(err){
    if(err)
      throw err;
    else
      if(once != true || once == undefined){
        em.emit("catch_end");
      }
  });
};

var root_sites = ["http://www.zju.edu.cn/","http://www.cc98.org"];
/*初始化*/
var _init = function(){
  __addRoot(root_sites);
  __updateUndoneSiteList();
  main(UndoneSiteList);
};

_init();
em.on("catch_end",function(){
  console.log("即将进行下一次更新...");
  __updateUndoneSiteList();
});