
const https = require('https');
var fs = require("fs");
var qs = require('querystring');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var crypto = require("crypto");
require("./static/js/blockly_compressed.js");
require("./static/js/blocks_compressed.js");
require("./static/js/blocklyen.js");
require("./static/js/lua_compressed.js");
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
  	
  	//var workspace = new Workspace();
  	//var wxml = Blockly.Xml.textToDom('<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="qblur_l">l</variable></variables><block type="controls_if" id="Wd;mk5}4Of9%Iw%Z7Zp@" x="35" y="18"><value name="IF0"><block type="logic_compare" id="Y]b.Mo8c|Gg]GFgx]d}."><field name="OP">LT</field><value name="A"><block type="variables_get" id="z@^1uBjFU^[PEMP$1M{*"><field name="VAR" id="qblur_l">l</field></block></value><value name="B"><block type="math_number" id="q#8h__fG*5qOgK`l1]dN"><field name="NUM">0.6</field></block></value></block></value><statement name="DO0"><block type="variables_set" id="!{OE7jG|eOuI%-Gmeh$z"><field name="VAR" id="qblur_l">l</field><value name="VALUE"><block type="math_number" id="eSak{(`N-^$A8:Y!TfoB"><field name="NUM">0.6</field></block></value></block></statement></block></xml>');
	//Blockly.Xml.domToWorkspace(workspace, wxml);
  	//var code = Blockly.Lua.workspaceToCode(workspace);
  	
  	
  	luaBlurFormula = `function ScriptFunc (val,h,s,l)
  	`+dm.blurFormula+`
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
