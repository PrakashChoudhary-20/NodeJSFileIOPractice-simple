var http = require('http');
var fs = require('fs');
var url = require('url');
var fileTitle = '';

http.createServer(function(req, res) {

			var qry = url.parse(req.url,true).query;
			var path = req.url;
			var q = url.parse(path,true).query;
			if(path=='/')
			{
				fs.readFile('../html/index.html', function(err,data){
				res.write(data);
				res.end();
				});
			}
			if(path=='/create?fileName='+q.fileName)
			{
				var status = createFile(q.fileName);
				if(status)
				{
				 fileTitle = q.fileName;
				 res.writeHead(200,{"Content-Type" : "text/html"});
				 fs.readFile('../html/readFile.html', function(err, data) {
				 res.write(data);
				 res.end();
				});
			}
		}
		if(path.toString().includes('addContent'))
		{
			var content = q.content;
			var host = 
			writeToFile(content, fileTitle);
			res.writeHead(200,{"Content-Type" : "text/html"});
			res.write("You can access the contents of your file at this location: "+ req.headers.host+"/read/"+fileTitle);
			res.end();
		}
		if(path=='/read/'+fileTitle)
		{
			res.writeHead(200,{"Content-Type" : "text/html"});
			fs.readFile('../files/'+fileTitle+'.txt', function(err, data){
				res.write("<h2>Contents from your file are:</h2>\n\n");
				res.write("<textarea rows='4' cols='50' readonly>" + data + "</textarea>");
				res.write("\n\n\n");
				res.write("<h6><i>Now as you have read your contents. You will no longer be able to access the same contents.</i></h6>")
				res.end();
			});
			fs.unlink('../files/'+fileTitle+'.txt', function(err){
				console.log('File Read and Deleted.');
			});
		}
		}).listen(9999);

function createFile(fileName)
{
	var status = fs.open('../files/'+fileName+'.txt', 'w', function(err,file)
		{ if(err) throw err;
			return true;
		});
	return true;
}

function writeToFile(content, fileName)
{
	fs.writeFile('../files/'+fileName+'.txt', content, function(err)
		{
			if(err) throw err;
		});
}