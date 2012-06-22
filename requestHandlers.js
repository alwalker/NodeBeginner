var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");

function start(response, request)
{
    console.log("Request handler 'start' was called.");

	var body =
		'<html>'+
		'<head>'+
		'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'+
		'</head>'+
		'<body>'+
		'<form action="/upload" enctype="multipart/form-data method="post">'+
		'<input type="file" name="upload" multiple="multiple">'+
		'<input type="submit" value="Upload File" />'+
		'</form>'+
		'</body>'+
		'</html>';


	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();

}

function upload(response, request)
{
	console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files)
    {
        if(error)
        {
            console.log("error parsing: " + error);
            return;
        }

        console.log("parsing done");

        fs.rename(files.upload.path, "tmp/test.png", function(err)
        {
            if(err)
            {
                fs.unlink("tmp/test.png");
                fs.rename(files.upload.path, "tmp/test.png");
            }
        });

        console.log("writing some stuff")
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("recieved image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

function show(response, request)
{
    console.log("Request handler for 'show' was called.");
    fs.readFile("tmp/test.png", "binary", function(error, file)
    {
        if(error)
        {
           response.writeHead(500, {"Content-Type": "text/plain"});
           response.write(error + "\n");
           response.end();
        }
        else
        {
            response.writeHead(200, {"Content-Type": "image/png"});
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;