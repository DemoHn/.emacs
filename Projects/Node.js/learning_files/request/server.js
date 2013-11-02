/**
 * Created with JetBrains WebStorm.
 * User: demohn
 * Date: 13-7-7
 * Time: 上午12:35
 * To change this template use File | Settings | File Templates.
 */
var http=require('http');
var fs = require('fs');

var req=http.get(
    {
        host:'www.tz1hs.com',
        port:80,
        path:'/'},
    function(res){
        res.setEncoding("utf8");
       /*res.on('data',function(data){
           console.log(data);
        });   */
        console.log(res);
    }
);

var filehandle = fs.readFile('data.txt',function(err,data){
    //
    console.log(data.toString());

});

