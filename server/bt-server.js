
const https = require('https');
var fs = require("fs");
var qs = require('querystring');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var crypto = require("crypto");
var Blockly = require('blockly');
//require("./static/js/blockly_compressed.js");
//require("./static/js/blocks_compressed.js");
//require("./static/js/blocklyen.js");
//require("./static/js/lua_compressed.js");
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
		
		res.write(nunjucks.render('index.html',{
			
		}));
		res.end();
	}
);

app.get('/qr', 
	function(req, res) {
		
		res.write(nunjucks.render('blendtext.html',{
			type: 'qr',
		}));
		res.end();
	}
);

app.get('/text', 
	function(req, res) {
		
		res.write(nunjucks.render('blendtext.html',{
			type: 'text',
		}));
		res.end();
	}
);

app.get('/image', 
	function(req, res) {
		
		res.write(nunjucks.render('blendtext.html',{
			type: 'image',
		}));
		res.end();
	}
);

app.get('/chart', 
	function(req, res) {
		
		res.write(nunjucks.render('blendtext.html',{
			type: 'chart',
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
  	
  	var workspace = new Blockly.Workspace();
  	var wxml = Blockly.Xml.textToDom(dm.blurFormula);
  	Blockly.Xml.domToWorkspace(wxml, workspace);
  	var code = Blockly.Lua.workspaceToCode(workspace);
  	
  	luaBlurFormula = `function ScriptFunc (val,h,s,l)
  	`+code+`
  	return h,s,l
  	end
  	`
  	
  	execCmd += ' -b "'+luaBlurFormula+'"';

  	execCmd += ' -c '+dm.textFormula;
  	if (dm.font.indexOf('"')==-1 && dm.font.indexOf(' ')>0){
  		execCmd += ' -f "'+dm.font+'"';
  	}
  	else {
  		execCmd += ' -f '+dm.font;
  	}
  	
  	execCmd += ' -t "image"';
  	
  	console.log(execCmd);
  	var imgSrc = '../out'+imgid+'.png';
  	if (myTimeout){
		clearTimeout(myTimeout);
		myTimeout = setTimeout(function(){ runCommand(ws,execCmd,imgSrc,imgIndex, luaBlurFormula); }, 1000);
	}
	else {
		myTimeout = setTimeout(function(){ runCommand(ws,execCmd,imgSrc,imgIndex, luaBlurFormula); }, 1000);
	}
	imgIndex++;
  	
  	
  	
  });
});

function runCommand(ws,execCmd,imgSrc,imgIndex, luaBlurFormula) {
	var formulaName = 'test';
	fs.writeFile("formulas/"+formulaName+".txt", luaBlurFormula, function(err) {
  		if (err){
  		
  		}
  		else {
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
  	});
	
}
