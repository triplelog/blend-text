
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
  var outSrc = 'out/'+imgid+'.png';
  var inSrc = 'images/in/'+imgid+'.png';
  var imgIndex = 0;
  ws.on('message', function incoming(message) {
  	
  	if (typeof message !== 'string'){
  		fs.writeFile(inSrc, Buffer.from(message), function (err) {
  			console.log(err);
  		});
  		return;
  	}
  	var dm = JSON.parse(message);

  	//console.log(dm);
  	if (!dm.fontSize || dm.textFormula == "" || dm.blurFormula == ""){
  		return;
  	}
  	// add more checks
  	

	//download or upload file to 'inputs/imgid'+fileExt and set inputSrc
	//var inSrc = 'test.jpg';
	
  	var execCmd = '../src/qr-art/bin/Debug/netcoreapp3.1/publish/qr-art "'+dm.text+'" '+inSrc+' png static/'+outSrc;
  	execCmd += ' -s '+dm.fontSize;
  	execCmd += ' -x '+dm.locX;
  	execCmd += ' -y '+dm.locY;
  	execCmd += ' -r '+dm.blurRadius;
  	//execCmd += ' -w 50';
  	
  	var workspace = new Blockly.Workspace();
  	var wxml = Blockly.Xml.textToDom(dm.blurFormula);
  	Blockly.Xml.domToWorkspace(wxml, workspace);
  	var code = Blockly.Lua.workspaceToCode(workspace);
  	
  	if (dm.blurType == 'hsl'){
		luaBlurFormula = `function ScriptFunc (val,h,s,l)
		`+code+`
		return h,s,l
		end
		`
	
		execCmd += ' -b "testBlur"';
		execCmd += ' -B hsl';
  	}
  	else {
  		luaBlurFormula = `function ScriptFunc (val,r,g,b)
		`+code+`
		return r,g,b
		end
		`
	
		execCmd += ' -b "testBlur"';
		execCmd += ' -B rgb';
  	}
  	
  	workspace = new Blockly.Workspace();
  	wxml = Blockly.Xml.textToDom(dm.textFormula);
  	Blockly.Xml.domToWorkspace(wxml, workspace);
  	code = Blockly.Lua.workspaceToCode(workspace);
  	
  	if (dm.textType == 'hsl'){
		luaTextFormula = `function TextFunc (val,h,s,l)
		`+code+`
		return h,s,l
		end
		`
	
		execCmd += ' -c "testText"';
		execCmd += ' -C hsl';
  	}
  	else {
  		luaTextFormula = `function TextFunc (val,r,g,b)
		`+code+`
		return r,g,b
		end
		`
	
		execCmd += ' -c "testText"';
		execCmd += ' -C rgb';
  	}

  	if (dm.font.indexOf('"')==-1 && dm.font.indexOf(' ')>0){
  		execCmd += ' -f "'+dm.font+'"';
  	}
  	else {
  		execCmd += ' -f '+dm.font;
  	}
  	
  	execCmd += ' -t '+dm.type;
  	
  	console.log(execCmd);
  	
  	if (myTimeout){
		clearTimeout(myTimeout);
		myTimeout = setTimeout(function(){ runCommand(ws,execCmd,outSrc,imgIndex, luaBlurFormula, luaTextFormula); }, 1000);
	}
	else {
		myTimeout = setTimeout(function(){ runCommand(ws,execCmd,outSrc,imgIndex, luaBlurFormula, luaTextFormula); }, 1000);
	}
	imgIndex++;
  	
  	
  	
  });
});

function runCommand(ws,execCmd,outSrc,imgIndex, luaBlurFormula, luaTextFormula) {
	var formulaName = 'test';
	fs.writeFile("formulas/"+formulaName+"Blur.txt", luaBlurFormula, function(err) {
  		fs.writeFile("formulas/"+formulaName+"Text.txt", luaTextFormula, function(err) {
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
					var jsonmessage = {'src':outSrc+'?'+imgIndex};
					ws.send(JSON.stringify(jsonmessage));
				});
			}
		});
  	});
	
}
