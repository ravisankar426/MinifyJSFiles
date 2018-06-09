const fs=require('fs');
const path=require('path');

var copyDlls=(sourceDir,destDir)=>{
    var sourceFiles=fs.readdirSync(sourceDir);
    sourceFiles.forEach((file)=>{
        var fileParams=path.parse(file);
        if(fileParams["ext"]===".dll"){
            var sourceFilePath=path.join(sourceDir,fileParams["base"]);
            var destFilePath=path.join(destDir,fileParams["base"]);
            try{                           
                fs.copyFileSync(sourceFilePath,destFilePath);
                console.log(`file copied from "${sourceFilePath}" to "${destFilePath}"`);
            }
            catch(e){
                console.log(`error while copying ${sourceFilePath}`,e);
            }
        }
    });
};

var logPaths=(dir,sourceFilePaths)=>{
    return new Promise((resolve,reject)=>{
        try{
            resolve(getFiles(dir,sourceFilePaths));
        }
        catch(e){
            reject(e);
        }
    });
}

var getFiles=(dir,sourceFilePaths)=>{    
    var files=fs.readdirSync(dir);
    for(var i=0;i<files.length;i++){
        var filePath=path.join(dir,files[i]);
        var pathParse=path.parse(filePath);
        if(pathParse.ext===".js" && pathParse.base.indexOf(".min")===-1 && !isJqueryFolder(filePath)){
            sourceFilePaths.push(filePath);
        }
        else if(fs.statSync(filePath).isDirectory()){
            sourceFilePaths=getFiles(filePath,sourceFilePaths);
        }
    }
    return sourceFilePaths;
};


var createDir=(dir)=>{
    var dirArray=dir.split("\\");
    var directoryExists=false;
    var count=dirArray.length;
    var counter=0;
    var tempDir="";
    while(counter<count){
        if(counter===0)
            tempDir=`${dirArray[counter]}\\`;
        else
            tempDir=`${tempDir}\\${dirArray[counter]}`;
        checkAndCreateDir(tempDir);        
        counter=counter+1;
    }
}

var isJqueryFolder=(filePath)=>{
    if(filePath.length<=0)
        return false;
    var pathArray=filePath.split(path.sep);
    for(var i=0;i<pathArray.length;i++){
        if(pathArray[i].toLowerCase()==="jquery")
            return true;
    }
    return false;
}

var checkAndCreateDir=(dir)=>{
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

module.exports={
    copyDlls,
    logPaths,
    createDir
};