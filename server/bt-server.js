
const https = require('https');
var fs = require("fs");
var qs = require('querystring');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var crypto = require("crypto");
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/matherrors.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/matherrors.com/fullchain.pem')
};
const { PerformanceObserver, performance } = require('perf_hooks');


var express = require('express');



var app = express();
app.use('/',express.static('static'));

app.get('/', 
	function(req, res) {
		
		res.write(nunjucks.render('blendtext.html',{
		
		}));
		res.end();
	}
);

const server1 = https.createServer(options, app);

server1.listen(12312);

const server = https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8080);

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  var myTimeout;
  ws.on('message', function incoming(message) {
  	var dm = JSON.parse(message);
  	console.log(dm);
  	if (!dm.fontSize){
  		return;
  	}
  	// add more checks
  	
  	
	//make src a crypto random file
  	var execCmd = '../src/qr-art/bin/Debug/netcoreapp3.1/publish/qr-art "'+dm.text+'" test.jpg png static/out'+dm.fontSize+'.png';
  	execCmd += ' -s '+dm.fontSize;
  	execCmd += ' -x '+dm.locX;
  	execCmd += ' -y '+dm.locY;
  	execCmd += ' -r '+dm.blurRadius;
  	execCmd += ' -b '+dm.blurColor;
  	execCmd += ' -f '+dm.textColor;
  	console.log(execCmd);
  	var imgSrc = '../out'+fontSize+'.png';
  	if (myTimeout){
		clearTimeout(myTimeout);
		myTimeout = setTimeout(function(){ runCommand(ws,execCmd,imgSrc); }, 500);
	}
	else {
		myTimeout = setTimeout(function(){ runCommand(ws,execCmd,imgSrc); }, 200);
	}
  	
  	
  	
  });
});

function runCommand(ws,execCmd,imgSrc) {
	exec(execCmd, (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
		var jsonmessage = {'src':imgSrc};
		ws.send(JSON.stringify(jsonmessage));
	});
}
