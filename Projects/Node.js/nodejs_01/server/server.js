var express = require("express");
var fs = require("fs");
var app = express();

fs.readFile("index.html",function(err,data){
    if(err){
        console.log(err);
    }else{
        App(data);
    }
});

function App(data){
    app.get('/',function(req,res){
        res.send(data.toString());
    });

    app.post('/',express.bodyParser(),function(req,res){
        WriteIntoFile(req.body["write"]);
        res.end(ReadHistoryFile("../files/15.txt"));
    });
}

function WriteIntoFile(data){
    var route = "../files/";
    fs.readdir(route,function(err,file){
        if(err){
            console.log(err);
        }else{
            var len = file.length;
            fs.open(route+(len)+".txt","a+",function(err,fd){
                if(err){
                    console.log(err);
                }else{
                    var date = new Date();
                    data = "["+date+"]\n\n"+data+"\n\n#####===END===#####\n\n";
                    fs.appendFile(route+(len)+".txt",data,"utf-8",function(){
                    });
                }
            });
        }
    });
}

/**
 * @return {string}
 */
function ReadHistoryFile(file){
    var return_str = "<a href='/'>return</a>";
    var final_str="";
    final_str = return_str+fs.readFileSync(file,"utf-8");
    final_str = final_str.replace(/\n/g,"<br />");
    return final_str;
}

app.listen(8080);
