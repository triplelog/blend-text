
const https = require('https');
var fs = require("fs");
var qs = require('querystring');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var crypto = require("crypto");
var Blockly = require('blockly');
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/qblur.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/qblur.com/fullchain.pem')
};
const { PerformanceObserver, performance } = require('perf_hooks');
const FileType = require('file-type');

const mongoose = require('mongoose');
mongoose.connect('mongodb://triplelog:kZGWGda3A@45.32.213.227:27017/triplelog', {useNewUrlParser: true});
const User = require('./models/user');
const QblurData = require('./models/qblurdata');

var express = require('express');


var fromLogin = require('./login-server.js');
var app = fromLogin.loginApp;
var tempKeys = fromLogin.tempKeys;






app.use('/',express.static('static'));

app.get('/', 
	function(req, res) {
		
		res.write(nunjucks.render('templates/index.html',{
			
		}));
		res.end();
	}
);

app.get('/filter', 
	function(req, res) {
		var filterGroups = ['Brightness','Saturation','Hue','Contrast','Grayscale','Palette'];
		var filters = {'Brightness':[{"hslrgb":"h","name":"First Bright","workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"qblur_l\">l</variable><variable id=\"qblur_d\">d</variable></variables><block type=\"variables_set\" id=\"!{OE7jG|eOuI%-Gmeh$z\" x=\"22\" y=\"41\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"VALUE\"><block type=\"math_arithmetic\" id=\"67Ta$Xn*}|J,~^Mjs-.P\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables_get\" id=\"w(Q=6C.o#CN4JYN=$_%b\"><field name=\"VAR\" id=\"qblur_d\">d</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"eSak{(`N-^$A8:Y!TfoB\"><field name=\"NUM\">0.005</field></block></value></block></value><next><block type=\"math_change\" id=\"O4#ogswjF1~gIg@[4tLX\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"DELTA\"><shadow type=\"math_number\" id=\"ee.gC~#6)ZbV3D)dH!Ee\"><field name=\"NUM\">0.4</field></shadow></value></block></next></block></xml>","formulaType":"hsl"}]};
		filters['Saturation'] = [{"hslrgb":"h","name":"First Sat","workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"qblur_l\">l</variable><variable id=\"qblur_d\">d</variable></variables><block type=\"variables_set\" id=\"!{OE7jG|eOuI%-Gmeh$z\" x=\"22\" y=\"41\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"VALUE\"><block type=\"math_arithmetic\" id=\"67Ta$Xn*}|J,~^Mjs-.P\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables_get\" id=\"w(Q=6C.o#CN4JYN=$_%b\"><field name=\"VAR\" id=\"qblur_d\">d</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"eSak{(`N-^$A8:Y!TfoB\"><field name=\"NUM\">0.005</field></block></value></block></value><next><block type=\"math_change\" id=\"O4#ogswjF1~gIg@[4tLX\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"DELTA\"><shadow type=\"math_number\" id=\"ee.gC~#6)ZbV3D)dH!Ee\"><field name=\"NUM\">0.4</field></shadow></value></block></next></block></xml>","formulaType":"hsl"}];
		filters['Hue'] = [{"hslrgb":"h","name":"First Hue","workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"qblur_l\">l</variable><variable id=\"qblur_d\">d</variable></variables><block type=\"variables_set\" id=\"!{OE7jG|eOuI%-Gmeh$z\" x=\"22\" y=\"41\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"VALUE\"><block type=\"math_arithmetic\" id=\"67Ta$Xn*}|J,~^Mjs-.P\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables_get\" id=\"w(Q=6C.o#CN4JYN=$_%b\"><field name=\"VAR\" id=\"qblur_d\">d</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"eSak{(`N-^$A8:Y!TfoB\"><field name=\"NUM\">0.005</field></block></value></block></value><next><block type=\"math_change\" id=\"O4#ogswjF1~gIg@[4tLX\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"DELTA\"><shadow type=\"math_number\" id=\"ee.gC~#6)ZbV3D)dH!Ee\"><field name=\"NUM\">0.4</field></shadow></value></block></next></block></xml>","formulaType":"hsl"}];
		filters['Contrast'] = [{"hslrgb":"h","name":"First Contrast","workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"qblur_l\">l</variable><variable id=\"qblur_d\">d</variable></variables><block type=\"variables_set\" id=\"!{OE7jG|eOuI%-Gmeh$z\" x=\"22\" y=\"41\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"VALUE\"><block type=\"math_arithmetic\" id=\"67Ta$Xn*}|J,~^Mjs-.P\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables_get\" id=\"w(Q=6C.o#CN4JYN=$_%b\"><field name=\"VAR\" id=\"qblur_d\">d</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"eSak{(`N-^$A8:Y!TfoB\"><field name=\"NUM\">0.005</field></block></value></block></value><next><block type=\"math_change\" id=\"O4#ogswjF1~gIg@[4tLX\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"DELTA\"><shadow type=\"math_number\" id=\"ee.gC~#6)ZbV3D)dH!Ee\"><field name=\"NUM\">0.4</field></shadow></value></block></next></block></xml>","formulaType":"hsl"}];
		filters['Grayscale'] = [{"hslrgb":"h","name":"First Grayscale","workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"qblur_l\">l</variable><variable id=\"qblur_d\">d</variable></variables><block type=\"variables_set\" id=\"!{OE7jG|eOuI%-Gmeh$z\" x=\"22\" y=\"41\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"VALUE\"><block type=\"math_arithmetic\" id=\"67Ta$Xn*}|J,~^Mjs-.P\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables_get\" id=\"w(Q=6C.o#CN4JYN=$_%b\"><field name=\"VAR\" id=\"qblur_d\">d</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"eSak{(`N-^$A8:Y!TfoB\"><field name=\"NUM\">0.005</field></block></value></block></value><next><block type=\"math_change\" id=\"O4#ogswjF1~gIg@[4tLX\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"DELTA\"><shadow type=\"math_number\" id=\"ee.gC~#6)ZbV3D)dH!Ee\"><field name=\"NUM\">0.4</field></shadow></value></block></next></block></xml>","formulaType":"hsl"}];
		

		var tkey = crypto.randomBytes(100).toString('hex').substr(2, 18);
		var formulas = [];
		if (req.isAuthenticated()){
			tempKeys[tkey] = {username:req.user.username};
			QblurData.findOne({ username: req.user.username }, function(err, result) {
				formulas = result.formulas.color;
				for (var i=0;i<formulas.length;i++){
					formulas[i].id = i;
				}
				res.write(nunjucks.render('templates/qblurbase.html',{
					type: 'filter',
					tkey: tkey,
					formulas: formulas,
					filters: filters,
					filterGroups: filterGroups,
				}));
				res.end();
			});
		}
		else {
			QblurData.findOne({ username: "h" }, function(err, result) {
				formulas = result.formulas.color;
				for (var i=0;i<formulas.length;i++){
					formulas[i].id = i;
				}
				res.write(nunjucks.render('templates/qblurbase.html',{
					type: 'filter',
					tkey: tkey,
					formulas: formulas,
					filters: filters,
					filterGroups: filterGroups,
				}));
				res.end();
			});
		}
	}
);

app.get('/overlay', 
	function(req, res) {
		var tkey = crypto.randomBytes(100).toString('hex').substr(2, 18);
		var formulas = [];
		if (req.isAuthenticated()){
			tempKeys[tkey] = {username:req.user.username};
			QblurData.findOne({ username: req.user.username }, function(err, result) {
				formulas = result.formulas.color;
				for (var i=0;i<formulas.length;i++){
					formulas[i].id = i;
				}
				res.write(nunjucks.render('templates/qblurbase.html',{
					type: 'overlay',
					tkey: tkey,
					formulas: formulas,
				}));
				res.end();
			});
		}
		else {
			QblurData.findOne({ username: "h" }, function(err, result) {
				formulas = result.formulas.color;
				for (var i=0;i<formulas.length;i++){
					formulas[i].id = i;
				}
				res.write(nunjucks.render('templates/qblurbase.html',{
					type: 'overlay',
					tkey: tkey,
					formulas: formulas,
				}));
				res.end();
			});
		}
	}
);

app.get('/gradient', 
	function(req, res) {
		var tkey = crypto.randomBytes(100).toString('hex').substr(2, 18);
		var formulas = [];
		if (req.isAuthenticated()){
			tempKeys[tkey] = {username:req.user.username};
			QblurData.findOne({ username: req.user.username }, function(err, result) {
				formulas = result.formulas.gradient;
				for (var i=0;i<formulas.length;i++){
					formulas[i].id = i;
				}
				res.write(nunjucks.render('templates/qblurbase.html',{
					type: 'gradient',
					tkey: tkey,
					formulas: formulas,
				}));
				res.end();
			});
		}
		else {
			QblurData.findOne({ username: 'h' }, function(err, result) {
				formulas = result.formulas.gradient;
				for (var i=0;i<formulas.length;i++){
					formulas[i].id = i;
				}
				res.write(nunjucks.render('templates/qblurbase.html',{
					type: 'gradient',
					tkey: tkey,
					formulas: formulas,
				}));
				res.end();
			});
			
			
		}

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
  var username = '';
  var newCreation = true;
  var imgTypes = ['.png','.jpg','.jpeg','.gif','.tiff','.tif'];//.svg, .psd, .eps, .raw, .pdf?
  ws.on('message', function incoming(message) {
  	
  	if (typeof message !== 'string'){
  		console.log("af",performance.now());
  		var buffer = Buffer.from(message);
  		FileType.fromBuffer(buffer.slice(0,1000)).then( (val) => {
  			var ext = '.'+val.ext;
  			for (var i=0;i<imgTypes.length;i++){
				if (ext == imgTypes[i]){
					inSrc = 'images/in/'+imgid+imgTypes[i];
					console.log(inSrc);
					fs.writeFile(inSrc, buffer, function (err) {
						if (err){console.log(err);}
						console.log("cf",performance.now());
					});
					break;
				}
			}
  		});
		
  		return;
  	}
  	var dm = JSON.parse(message);
	if (dm.type && dm.type == 'key'){
		if (dm.message && tempKeys[dm.message]){
			username = tempKeys[dm.message].username;
		}
		return;
	}
	else if (dm.type && dm.type == 'download'){
		console.log(dm.url);
		
		var wget = '';
		for (var i=0;i<imgTypes.length;i++){
			if (dm.url.substring(dm.url.length-imgTypes[i].length,dm.url.length) == imgTypes[i]){
				inSrc = 'images/in/'+imgid+imgTypes[i];
				wget = 'wget --accept "*"'+imgTypes[i]+' -O '+inSrc + ' "' + dm.url + '" && echo "done"';	
			}
		}
		if (wget == ''){return;}
		var child = exec(wget, function(err, stdout, stderr) {
			console.log("err: ",err);
			console.log("stdout: ",stdout);
			console.log("stderr: ",stderr);
		});
		return;
	}
	else if (dm.type && dm.type == 'saveFormula'){
		if (dm.message && username != ''){
			var formula = {'name':dm.name,'workspace':dm.message,'formulaType':dm.formulaType};
			//Add a Check that there does not exist a formula of that name already.
			if (!dm.category || dm.category == 'color'){
				QblurData.updateOne({ username: username }, {$push: {"formulas.color": formula}}, function(err, result) {});
			}
			else if (dm.category =='gradient') {
				QblurData.updateOne({ username: username }, {$push: {"formulas.gradient": formula}}, function(err, result) {});
			}
			else if (dm.category =='distance') {
				QblurData.updateOne({ username: username }, {$push: {"formulas.distance": formula}}, function(err, result) {});
			}
			
		}
		return;
	}
	else if (dm.type && dm.type == 'saveTemplate'){
		if (dm.message && username != ''){
			var template = {'name':dm.name,'workspace':dm.message};
			//Add a Check that there does not exist a template of that name already.
			QblurData.updateOne({ username: username }, {$push: {"templates": template}}, function(err, result) {});
		}
		return;
	}
	else if (dm.type && dm.type == 'copyFormula'){
		if (username != ''){
			if (!dm.message && dm.message !== 0){
				return;
			}
			QblurData.findOne({ username: username }, "formulas", function(err, result) {
				var newFormula = {};
				newFormula.name = dm.message + ' 1';
				var foundMatch = false;
				var foundOne = false;
				for (var i=0;i<result.formulas.length;i++){
					if (result.formulas[i].name == newFormula.name){
						foundOne = true;
					}
					if (result.formulas[i].name == dm.message){
						newFormula.workspace = result.formulas[i].workspace;
						foundMatch = true;
					}
				}
				var ii = 2;
				while (foundOne){
					newFormula.name = dm.message + ' '+ii;
					foundOne = false;
					for (var i=0;i<result.formulas.length;i++){
						if (result.formulas[i].name == newFormula.name){
							foundOne = true;
							break;
						}
					}
					ii++;
				}
				if (foundMatch){
					result.formulas.push(newFormula);
					result.markModified("formulas");
					result.save(function (err, result2) {
						var formulas = result.formulas;
					
						var workspace;
						var wxml;
						var code;
						for (var i=0;i<formulas.length;i++){
							formulas[i].id = i;
							workspace = new Blockly.Workspace();
							wxml = Blockly.Xml.textToDom(formulas[i].workspace);
							Blockly.Xml.domToWorkspace(wxml, workspace);
							code = Blockly.Lua.workspaceToCode(workspace);
							formulas[i].code = code;
						}
						var jsonmessage = {'type':'newFormulas'};
						jsonmessage.formulas = formulas;
						ws.send(JSON.stringify(jsonmessage));
					});
					
				}
			});
		}
		return;
	}
	
	//Start creating image if made it this far

	if (dm.type =="qr"){
		
		if (username != ''){
			console.log('username: '+username);
		}
		//console.log(dm);
		if (!dm){
			return;
		}
		// add more checks
	

		//download or upload file to 'inputs/imgid'+fileExt and set inputSrc
		//var inSrc = 'test.jpg';
	
		var execCmd = '../src/qr-art/bin/Debug/netcoreapp3.1/publish/qr-art "'+dm.text+'" '+inSrc+' png static/'+outSrc;
		execCmd += ' -s '+dm.typeNumber;
		execCmd += ' -x '+dm.locX;
		execCmd += ' -y '+dm.locY;
		execCmd += ' -g '+dm.errorCorrect;
		execCmd += ' -r 1';
		if (dm.width && dm.width != -1){
			execCmd += ' -w '+dm.width;
		}
	
		var workspace = new Blockly.Workspace();
		var wxml = Blockly.Xml.textToDom(dm.blurFormula);
		Blockly.Xml.domToWorkspace(wxml, workspace);
		var usedvars = workspace.getAllVariables();
		var varstr = "";
		for (var i=0;i<usedvars.length;i++){
			console.log(usedvars[i].id_);
			varstr += usedvars[i].id_.substring(6,7);
		}
		var code = Blockly.Lua.workspaceToCode(workspace);
		console.log(code);
		if (dm.blurType == 'hsl'){
			luaBlurFormula = `function ScriptFunc (d,h,s,l)
			`+code+`
			return h,s,l
			end
			`
	
			execCmd += ' -b "testBlur"';
			execCmd += ' -B hsl'+varstr;
		}
		else {
			luaBlurFormula = `function ScriptFunc (d,r,g,b)
			`+code+`
			return r,g,b
			end
			`
	
			execCmd += ' -b "testBlur"';
			execCmd += ' -B rgb'+varstr;
		}
	
		workspace = new Blockly.Workspace();
		wxml = Blockly.Xml.textToDom(dm.textFormula);
		Blockly.Xml.domToWorkspace(wxml, workspace);
		code = Blockly.Lua.workspaceToCode(workspace);
		console.log(code);
		if (dm.textType == 'hsl'){
			luaTextFormula = `function TextFunc (d,h,s,l)
			`+code+`
			return h,s,l
			end
			`
	
			execCmd += ' -c "testText"';
			execCmd += ' -C hsl';
		}
		else {
			luaTextFormula = `function TextFunc (d,r,g,b)
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
	
		if (dm.threshold){
			execCmd += ' -l '+dm.threshold;
		}
	
		var luaDistanceFormula = `function DistanceFunc (d,maxD)
					return (10*d-15*maxD)*2/maxD
					end`;
		execCmd += ' -d "'+'test'+'Distance"';
	
		console.log(execCmd);
	
		if (newCreation && username != ''){
			//Add a Check that there does not exist a creation of that name already.
			QblurData.updateOne({ username: username }, {$push: {"creations": outSrc}}, function(err, result) {});
			newCreation = false;
		}
		
		if (myTimeout){
			clearTimeout(myTimeout);
			myTimeout = setTimeout(function(){ runCommand(ws,execCmd,outSrc,imgIndex, luaBlurFormula, luaTextFormula, luaDistanceFormula); }, 1000);
		}
		else {
			myTimeout = setTimeout(function(){ runCommand(ws,execCmd,outSrc,imgIndex, luaBlurFormula, luaTextFormula, luaDistanceFormula); }, 1000);
		}
		imgIndex++;
  	}
  	else if (dm.type == "text"){
		//Start creating image if made it this far
		if (username != ''){
			console.log('username: '+username);
		}
		//console.log(dm);
		if (!dm.fontSize || dm.textFormula == "" || dm.blurFormula == ""){
			return;
		}
		// add more checks
		if (dm.crop){dm.type = 'text';}
		else {dm.type = 'image';}

		//download or upload file to 'inputs/imgid'+fileExt and set inputSrc
		//var inSrc = 'test.jpg';
	
		var execCmd = '../src/qr-art/bin/Debug/netcoreapp3.1/publish/qr-art "'+dm.text+'" '+inSrc+' png static/'+outSrc;
		execCmd += ' -s '+dm.fontSize;
		execCmd += ' -x '+dm.locX;
		execCmd += ' -y '+dm.locY;
		execCmd += ' -r '+dm.blurRadius;
		if (dm.width && dm.width != -1){
			execCmd += ' -w '+dm.width;
		}
	
		var workspace = new Blockly.Workspace();
		var wxml = Blockly.Xml.textToDom(dm.blurFormula);
		Blockly.Xml.domToWorkspace(wxml, workspace);
		var usedvars = workspace.getAllVariables();
		var varstr = "";
		for (var i=0;i<usedvars.length;i++){
			console.log(usedvars[i].id_);
			varstr += usedvars[i].id_.substring(6,7);
		}
		var code = Blockly.Lua.workspaceToCode(workspace);
		console.log(code);
		if (dm.blurType == 'hsl'){
			luaBlurFormula = `function ScriptFunc (d,h,s,l)
			`+code+`
			return h,s,l
			end
			`
	
			execCmd += ' -b "testBlur"';
			execCmd += ' -B hsl'+varstr;
		}
		else {
			luaBlurFormula = `function ScriptFunc (d,r,g,b)
			`+code+`
			return r,g,b
			end
			`
	
			execCmd += ' -b "testBlur"';
			execCmd += ' -B rgb'+varstr;
		}
	
		workspace = new Blockly.Workspace();
		wxml = Blockly.Xml.textToDom(dm.textFormula);
		Blockly.Xml.domToWorkspace(wxml, workspace);
		code = Blockly.Lua.workspaceToCode(workspace);
		console.log(code);
		if (dm.textType == 'hsl'){
			luaTextFormula = `function TextFunc (d,h,s,l)
			`+code+`
			return h,s,l
			end
			`
	
			execCmd += ' -c "testText"';
			execCmd += ' -C hsl';
		}
		else {
			luaTextFormula = `function TextFunc (d,r,g,b)
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
	
		if (dm.threshold){
			execCmd += ' -l '+dm.threshold;
		}
	
		var luaDistanceFormula = `function DistanceFunc (d,maxD)
					return (10*d-15*maxD)*2/maxD
					end`;
		execCmd += ' -d "'+'test'+'Distance"';
	
		console.log(execCmd);
	
		if (newCreation && username != ''){
			//Add a Check that there does not exist a creation of that name already.
			QblurData.updateOne({ username: username }, {$push: {"creations": outSrc}}, function(err, result) {});
			newCreation = false;
		}
		
		if (myTimeout){
			clearTimeout(myTimeout);
			myTimeout = setTimeout(function(){ runCommand(ws,execCmd,outSrc,imgIndex, luaBlurFormula, luaTextFormula, luaDistanceFormula); }, 1000);
		}
		else {
			myTimeout = setTimeout(function(){ runCommand(ws,execCmd,outSrc,imgIndex, luaBlurFormula, luaTextFormula, luaDistanceFormula); }, 1000);
		}
		imgIndex++;
  	}
  	else if (dm.type =="gradient") {
  		//Start creating image if made it this far
		if (username != ''){
			console.log('username: '+username);
		}
		//console.log(dm);
		if (!2==2){
			return;
		}
		// add more checks
	
	
		var execCmd = '../src/qr-art/bin/Debug/netcoreapp3.1/publish/qr-art "dummyText" '+inSrc+' png static/'+outSrc;

		execCmd += ' -x '+dm.locX;
		execCmd += ' -y '+dm.locY;
		if (dm.gradientType == 'linear'){
			execCmd += ' -r '+dm.gradientAngle;
		}
		else if (dm.gradientType == 'radial'){
			execCmd += ' -r '+(dm.gradientCenter+dm.gradientDistance+dm.gradientSkew);
		}
		else if (dm.gradientType == 'edge'){
			execCmd += ' -r '+dm.gradientSpread;
		}
		else if (dm.gradientType == 'life'){
			execCmd += ' -r '+(dm.gradientYears+dm.gradientDeadMin*10000+dm.gradientDeadMax*100000+dm.gradientLiveMin*1000000+dm.gradientLiveMax*10000000);
		}
		execCmd += ' -g '+dm.gradientType;
	
		var workspace = new Blockly.Workspace();
		var wxml = Blockly.Xml.textToDom(dm.blurFormula);
		Blockly.Xml.domToWorkspace(wxml, workspace);
		var usedvars = workspace.getAllVariables();
		var varstr = "";
		for (var i=0;i<usedvars.length;i++){
			console.log(usedvars[i].id_);
			varstr += usedvars[i].id_.substring(6,7);
		}
		var code = Blockly.Lua.workspaceToCode(workspace);
		console.log(code);
		if (dm.blurType == 'hsl'){
			luaBlurFormula = `function ScriptFunc (d,h,s,l)
			`+code+`
			return h,s,l
			end
			`
	
			execCmd += ' -b "testBlur"';
			execCmd += ' -B hsl'+varstr;
		}
		else {
			luaBlurFormula = `function ScriptFunc (d,r,g,b)
			`+code+`
			return r,g,b
			end
			`
	
			execCmd += ' -b "testBlur"';
			execCmd += ' -B rgb';
		}
	
	
		execCmd += ' -t '+dm.type;
	
		if (dm.threshold){
			execCmd += ' -l '+dm.threshold;
		}
	
		console.log(execCmd);
	
		if (newCreation && username != ''){
			//Add a Check that there does not exist a creation of that name already.
			QblurData.updateOne({ username: username }, {$push: {"creations": outSrc}}, function(err, result) {});
			newCreation = false;
		}
		
		if (myTimeout){
			clearTimeout(myTimeout);
			myTimeout = setTimeout(function(){ createGradient(ws,execCmd,outSrc,imgIndex, luaBlurFormula); }, 1000);
		}
		else {
			myTimeout = setTimeout(function(){ createGradient(ws,execCmd,outSrc,imgIndex, luaBlurFormula); }, 1000);
		}
		imgIndex++;
  	}
  	else if (dm.type =="filter") {
  		//Start creating image if made it this far
		if (username != ''){
			console.log('username: '+username);
		}
		//console.log(dm);
		if (!2==2){
			return;
		}
		// add more checks
	
	
		var execCmd = '../src/qr-art/bin/Debug/netcoreapp3.1/publish/qr-art "dummyText" '+inSrc+' png static/'+outSrc;

		execCmd += ' -x 0';
		execCmd += ' -y 0';
		execCmd += ' -r 0';
		execCmd += ' -g contrast';
		var luaBlurFormula = '';
		var hrString = '';
		for (var ii=0;ii<dm.filters.length;ii++){
			var workspace = new Blockly.Workspace();
			var wxml = Blockly.Xml.textToDom(dm.filters[ii].workspace);
			Blockly.Xml.domToWorkspace(wxml, workspace);
			var usedvars = workspace.getAllVariables();
			var varstr = "";
			for (var i=0;i<usedvars.length;i++){
				console.log(usedvars[i].id_);
				varstr += usedvars[i].id_.substring(6,7);
			}
			var code = Blockly.Lua.workspaceToCode(workspace);
			console.log(code);
			if (dm.filters[ii].hslrgb == 'h'){
				luaBlurFormula += `function Filter`+(ii+1)+` (h,s,l)
				`+code+`
				return h,s,l
				end
				`
				hrString += 'h';
			}
			else {
				luaBlurFormula += `function Filter`+(ii+1)+` (r,g,b)
				`+code+`
				return r,g,b
				end
				`
				hrString += 'r';
			
			}
		}
		console.log(luaBlurFormula);
		execCmd += ' -b "testBlur"';
		execCmd += ' -B '+hrString;
	
		execCmd += ' -t '+dm.type;
	
		if (dm.threshold){
			execCmd += ' -l '+dm.threshold;
		}
	
		console.log(execCmd);
	
		if (newCreation && username != ''){
			//Add a Check that there does not exist a creation of that name already.
			QblurData.updateOne({ username: username }, {$push: {"creations": outSrc}}, function(err, result) {});
			newCreation = false;
		}
		
		if (myTimeout){
			clearTimeout(myTimeout);
			myTimeout = setTimeout(function(){ createGradient(ws,execCmd,outSrc,imgIndex, luaBlurFormula); }, 1000);
		}
		else {
			myTimeout = setTimeout(function(){ createGradient(ws,execCmd,outSrc,imgIndex, luaBlurFormula); }, 1000);
		}
		imgIndex++;
  	}
  	
  	
  });
});

function runCommand(ws,execCmd,outSrc,imgIndex, luaBlurFormula, luaTextFormula, luaDistanceFormula) {
	var formulaName = 'test';
	fs.writeFile("formulas/"+formulaName+"Blur.txt", luaBlurFormula, function(err) {
  		fs.writeFile("formulas/"+formulaName+"Text.txt", luaTextFormula, function(err) {
			fs.writeFile("formulas/"+formulaName+"Distance.txt", luaDistanceFormula, function(err) {
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
  	});
	
}
function createGradient(ws,execCmd,outSrc,imgIndex, luaBlurFormula) {
	var formulaName = 'test';
	fs.writeFile("formulas/"+formulaName+"Blur.txt", luaBlurFormula, function(err) {
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
	
}

