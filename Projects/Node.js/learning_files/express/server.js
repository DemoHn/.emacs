/**
 * Created with JetBrains WebStorm.
 * User: demohn
 * Date: 13-7-6
 * Time: 下午11:55
 * To change this template use File | Settings | File Templates.
 */
var express = require('express');

var app =express.createServer();

app.get('/',function(req,res){
    res.send("DemoHn");
});