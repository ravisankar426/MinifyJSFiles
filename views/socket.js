var baseUri='http://localhost:3000';
var socket=io.connect(baseUri);

function emit(){
    var source=document.getElementById("txtSourceDir").value;
    var destination=document.getElementById("txtDestDir").value;
    var paths={
        sourceDir:source,
        destDir:destination
    }
    //socket.emit('minified',paths);
    minifyJsFiles(paths);
}

socket.on('minified',(message)=>{
    var result=document.getElementById("divResult");
    result.innerHTML+=`<p>${message}</p>`
});

function minifyJsFiles(paths){
    $.ajax({
        type: "POST",
        url: baseUri+'/minify',
        data: JSON.stringify(paths),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
            console.log(data);
        },
        failure: function(errMsg) {
            console.log(errMsg);
        }
    });
}