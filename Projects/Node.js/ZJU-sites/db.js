var mong = require("mongoose");
mong.connect("mongodb://localhost/test");

var db = mong.connection;
db.on("error",function(){
  console.log("connection error!");
});

db.once("open",function(){
  /*open*/
});

var linksSchema = mong.Schema({
  host:String,
  ip:String,
  catchTime:Date,
  statusCode:Number,
  updateTime:Date,
  userType:Number,
  source:String,
  title:String
});

var Links = mong.model("zjulinks",linksSchema);
module.exports = Links;