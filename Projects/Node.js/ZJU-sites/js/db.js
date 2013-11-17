var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test");

var db = mongoose.connection;

db.on("error",function(){
  console.log("Database connection error!");
});

db.once("open",function(){
  /*open*/
});

var linksSchema = mongoose.Schema({
  _parentId:Number,
  _status:Number,
  host:String,
  ip:Array,
  port:Number,
  name:String
});

var infoSchema = mongoose.Schema({
  title:String,
  encoding:String,
  info:String
});

var counterSchema = mongoose.Schema({
  NodeId:Number,
  RootId:Number
});


var Counter = mongoose.model("site_counters",counterSchema);
var Link = mongoose.model("site_structs",linksSchema);
var Info = mongoose.model("site_info",infoSchema);

exports.Link = Link;
exports.Info = Info;
exports.Counter = Counter;