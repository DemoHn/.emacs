/**
 * Created with JetBrains WebStorm.
 * User: Hn
 * Date: 13-4-28
 * Time: 下午12:00
 * To change this template use File | Settings | File Templates.
 */
function route(pathname,handle,res,data){
    if(typeof handle[pathname]==='function'){
        handle[pathname](res,data);
    }else{
        res.writeHead(200,{"Content-Type":"text/html"});
        res.write("<h1>出错了！</h1><p>请检查一下node.js是否有运行，或者数据正确无误。</p>");
        res.end();
    }
}
exports.route=route;
