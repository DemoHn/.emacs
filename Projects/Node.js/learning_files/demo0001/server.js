/**
 * Created with JetBrains WebStorm.
 * User: Hn
 * Date: 13-4-21
 * Time: 下午11:26
 * To change this template use File | Settings | File Templates.
 */
function start() {
    var http = require("http");
    http.createServer(function (request, response) {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("Hello World\n");
        response.write("Hello World");
        response.end();
    }).listen(80);
}
exports.start=start;
