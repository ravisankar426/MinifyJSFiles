const fs=require('fs');
const fc=require('./file-copy-operations');
const path=require('path');
const UglifyJS=require('uglify-js');
const {config}=require('./config');
const express=require('express');
const bodyParser=require('body-parser');
const hbs=require('hbs');
var socket=require('socket.io');

// var sourceDir=config.sourceDir;
// var destDir=config.destDir;
// var sourceFilePaths=[];

var app=express();
app.set('view engine','hbs');
app.use(express.static(path.join(__dirname,'views')));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var port = process.env.PORT || '3000';
var server=app.listen(port,()=>{
    console.log("App started at port 3000...!!!");
});

var io=socket(server);

// io.on('connection',(socket)=>{
//     socket.on('minified',(path)=>{
//         io.sockets.emit('minified',`Source: ${path.source} ; Destination: ${path.destination}`);   
//         setTimeout(()=>{io.sockets.emit('minified',`Source: ${path.source} ; Destination: ${path.destination}`);},1000);     
//         setTimeout(()=>{io.sockets.emit('minified',`Source: ${path.source} ; Destination: ${path.destination}`);},1000); 
//         setTimeout(()=>{io.sockets.emit('minified',`Source: ${path.source} ; Destination: ${path.destination}`);},1000); 
//         setTimeout(()=>{io.sockets.emit('minified',`Source: ${path.source} ; Destination: ${path.destination}`);},1000); 
//         setTimeout(()=>{io.sockets.emit('minified',`Source: ${path.source} ; Destination: ${path.destination}`);},1000); 
//     });
// });



app.get("/",(req,res)=>{
    res.render('index');
});

app.post("/minify",(req,res)=>{
    var sourceDir=req.body.sourceDir;
    var destDir=req.body.destDir;
    var sourceFilePaths=[];
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
        console.log(`minified the file ${destFilePath}`);
        io.sockets.emit('minified',`minified the file ${destFilePath}`);
    };
    console.log('/************completed minifying the files*************/');

    res.statusCode=200;
    res.send(statusMessage);
});



