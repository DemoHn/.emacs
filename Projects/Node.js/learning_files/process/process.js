process.stdin.resume();

process.on("SIGINT",function(){
    console.log("demohhn");
    console.log("Run Time:",process.uptime());//最好在终端下运行，这样使得当程序按ctrl+C时不会随意退出
});
console.log(process.platform);
