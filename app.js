const fs=require('fs');
const fc=require('./file-copy-operations');
const path=require('path');
const UglifyJS=require('uglify-js');
const {config}=require('./config');
const express=require('express');
const bodyParser=require('body-parser');

// var sourceDir=config.sourceDir;
// var destDir=config.destDir;
// var sourceFilePaths=[];

var app=express();
app.use(express.static(__dirname+'/views'));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.send('index.html');
});

app.post("/minify",(req,res)=>{
    var sourceFilePaths=[];
    var sourceDir=req.body.sourceDir;
    var destDir=req.body.destDir;
    fc.logPaths(sourceDir,sourceFilePaths).then((filePaths)=>{
        var statusMessage="";
        filePaths.forEach(function(filePath) {
            var destFilePath=filePath.replace(sourceDir,destDir);
            var destDirName=path.parse(destFilePath).dir;
            var result=UglifyJS.minify(fs.readFileSync(filePath,'utf8'));
            fc.createDir(destDirName);
            fs.writeFileSync(destFilePath,result.code);
            statusMessage=`${statusMessage} minified the file ${destFilePath}\n`;
        }, this);
        res.statusCode=200;
        res.send(statusMessage);
    },
    (err)=>{
        console.log(err);
    });
});

app.listen('3000',()=>{
    console.log("App started at port 3000...!!!");
});

