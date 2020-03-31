
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
  var imgid = parseInt(crypto.randomBytes(50).toString('hex'),16).toString(36).substr(2, 12);
  var imgIndex = 0;
  ws.on('message', function incoming(message) {
  	var dm = JSON.parse(message);
  	//console.log(dm);
  	if (!dm.fontSize){
  		return;
  	}
  	// add more checks
  	

	//download or upload file to 'inputs/imgid'+fileExt and set inputSrc
	var inputSrc = 'test.jpg';
	
  	var execCmd = '../src/qr-art/bin/Debug/netcoreapp3.1/publish/qr-art "'+dm.text+'" '+inputSrc+' png static/out'+imgid+'.png';
  	execCmd += ' -s '+dm.fontSize;
  	execCmd += ' -x '+dm.locX;
  	execCmd += ' -y '+dm.locY;
  	execCmd += ' -r '+dm.blurRadius;
  	dm.blurFormula = `function ScriptFunc (val,l,s)
					if val < -25 then
						if l < .6 then
							l = .6
						end
						if s > .4 then
							s = .4
						end
					else 
						if l < .5 then
							l = .5
						end
						if s > .4 then
							s = .4
						end
					end
					return l,s
				end`
  	if (dm.blurFormula.indexOf('"')==-1){
  		execCmd += ' -b "'+dm.blurFormula+'"';
  	}
  	else {
  		execCmd += ' -b '+dm.blurFormula;
  	}
  	execCmd += ' -c '+dm.textFormula;
  	if (dm.font.indexOf('"')==-1 && dm.font.indexOf(' ')>0){
  		execCmd += ' -f "'+dm.font+'"';
  	}
  	else {
  		execCmd += ' -f '+dm.font;
  	}
  	
  	console.log(execCmd);
  	var imgSrc = '../out'+imgid+'.png';
  	if (myTimeout){
		clearTimeout(myTimeout);
		myTimeout = setTimeout(function(){ runCommand(ws,execCmd,imgSrc,imgIndex); }, 1000);
	}
	else {
		myTimeout = setTimeout(function(){ runCommand(ws,execCmd,imgSrc,imgIndex); }, 1000);
	}
	imgIndex++;
  	
  	
  	
  });
});

function runCommand(ws,execCmd,imgSrc,imgIndex) {
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
		var jsonmessage = {'src':imgSrc+'?'+imgIndex};
		ws.send(JSON.stringify(jsonmessage));
	});
}
