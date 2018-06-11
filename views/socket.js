var socket=io.connect('http://localhost:3000');

function emit(){
    var sourceDir=document.getElementById("txtSourceDir").value;
    var destDir=document.getElementById("txtDestDir").value;
    // var sourceDir=config.sourceDir;
    // var destDir=config.destDir;
    var paths={
        source:sourceDir,
        destination:destDir
    }
    socket.emit('minify',paths);
}

socket.on('minify',(path)=>{
    var result=document.getElementById("divResult");
    result.innerHTML+=`<p><strong>SourceDir: ${path.source}</strong></p><p><strong>DestDir: ${path.destination}</strong></p>`
    console.log(path);
});

socket.on('minified',(message)=>{
    console.log(message);
    var result=document.getElementById("divResult");
    result.innerHTML+=`<p><strong>${message}</strong></p>`
});