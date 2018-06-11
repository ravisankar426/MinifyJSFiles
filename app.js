const fs=require('fs');
const fc=require('./file-copy-operations');
const path=require('path');
const UglifyJS=require('uglify-js');
const {config}=require('./config');
const express=require('express');
const bodyParser=require('body-parser');
var socket=require('socket.io');

// var sourceDir=config.sourceDir;
// var destDir=config.destDir;
// var sourceFilePaths=[];

var app=express();
app.use(express.static(__dirname+'/views'));
app.use(bodyParser.json());

var server=app.listen('3000',()=>{
    console.log("App started at port 3000...!!!");
});

var io=socket(server);

io.on('connection',(socket)=>{
    socket.on('minify',(path)=>{
        io.sockets.emit('minify',path);
    });
});



app.get("/",(req,res)=>{
    res.send('index.html');
});

app.post("/minify",(req,res)=>{
    var sourceFilePaths=[];
    var sourceDir=req.body.sourceDir;
    var destDir=req.body.destDir;
    var filePaths=fc.getFilePaths(sourceDir,sourceFilePaths);
    var statusMessage='';
    console.log('/***********started minifying the files****************/');
    for(var i=0;i<filePaths.length;i++){
        var filePath=filePaths[i];
        var destFilePath=filePath.replace(sourceDir,destDir);
        var destDirName=path.parse(destFilePath).dir;
        var result=UglifyJS.minify(fs.readFileSync(filePath,'utf8'));
        fc.createDir(destDirName);
        fs.writeFileSync(destFilePath,result.code);
        statusMessage=`${statusMessage} minified the file ${destFilePath}\n`;
        io.sockets.emit('minified',`minified the file ${destFilePath}`);
        //console.log(`minified the file ${destFilePath}`);
    };
    console.log('/************completed minifying the files*************/');
    res.statusCode=200;
    res.send(statusMessage);
});



