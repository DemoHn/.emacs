/**
 * Created with JetBrains WebStorm.
 * User: Hn
 * Date: 13-4-28
 * Time: 上午11:55
 * To change this template use File | Settings | File Templates.
 */
var server=require("./Server");
var router=require("./Route");
var reqh=require("./RequestHandle");

var handle={};
handle["/"]=reqh.start;
handle["/start"]=reqh.start;
handle["/upload"]=reqh.upload;
server.start(router.route,handle);