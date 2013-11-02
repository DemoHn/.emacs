/**
 * Created with JetBrains WebStorm.
 * User: Hn
 * Date: 13-4-28
 * Time: 上午11:40
 * To change this template use File | Settings | File Templates.
 */
var http=require("http");
var url=require("url");
function start(route,handle){
    var resultdata="";
    http.createServer(function(req,res){
        var pathname=url.parse(req.url).pathname;
      //  route(pathname,handle,res);
        req.setEncoding("utf8");

        req.addListener("data",function(chuck){
            resultdata+=chuck;
        });

        req.addListener("end",function(){
            console.log(resultdata);
            route(pathname,handle,res,resultdata);
        });
    }).listen(80);
}
exports.start=start;
