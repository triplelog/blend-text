
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
app.get('/index.html', 
	function(req, res) {
		
		res.write(nunjucks.render('templates/index.html',{
			
		}));
		res.end();
	}
);
app.get('/about', 
	function(req, res) {
		
		res.write(nunjucks.render('templates/aboutbase.html',{
			
		}));
		res.end();
	}
);
app.get('/about.html', 
	function(req, res) {
		
		res.write(nunjucks.render('templates/aboutbase.html',{
			
		}));
		res.end();
	}
);
app.get('/filter', 
	function(req, res) {
		/*var filterGroups = ['Brightness','Saturation','Hue','Contrast','Grayscale'];
		var filters = {'Brightness':[{"hslrgb":"h","name":"First Bright","workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"qblur_l\">l</variable><variable id=\"qblur_d\">d</variable></variables><block type=\"variables_set\" id=\"!{OE7jG|eOuI%-Gmeh$z\" x=\"22\" y=\"41\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"VALUE\"><block type=\"math_arithmetic\" id=\"67Ta$Xn*}|J,~^Mjs-.P\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables_get\" id=\"w(Q=6C.o#CN4JYN=$_%b\"><field name=\"VAR\" id=\"qblur_d\">d</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"eSak{(`N-^$A8:Y!TfoB\"><field name=\"NUM\">0.005</field></block></value></block></value><next><block type=\"math_change\" id=\"O4#ogswjF1~gIg@[4tLX\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"DELTA\"><shadow type=\"math_number\" id=\"ee.gC~#6)ZbV3D)dH!Ee\"><field name=\"NUM\">0.4</field></shadow></value></block></next></block></xml>","hslrgb":"hsl"}]};
		filters['Saturation'] = [{"hslrgb":"h","name":"First Sat","workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"qblur_l\">l</variable><variable id=\"qblur_d\">d</variable></variables><block type=\"variables_set\" id=\"!{OE7jG|eOuI%-Gmeh$z\" x=\"22\" y=\"41\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"VALUE\"><block type=\"math_arithmetic\" id=\"67Ta$Xn*}|J,~^Mjs-.P\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables_get\" id=\"w(Q=6C.o#CN4JYN=$_%b\"><field name=\"VAR\" id=\"qblur_d\">d</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"eSak{(`N-^$A8:Y!TfoB\"><field name=\"NUM\">0.005</field></block></value></block></value><next><block type=\"math_change\" id=\"O4#ogswjF1~gIg@[4tLX\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"DELTA\"><shadow type=\"math_number\" id=\"ee.gC~#6)ZbV3D)dH!Ee\"><field name=\"NUM\">0.4</field></shadow></value></block></next></block></xml>","hslrgb":"hsl"}];
		filters['Hue'] = [{"hslrgb":"h","name":"First Hue","workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"qblur_l\">l</variable><variable id=\"qblur_d\">d</variable></variables><block type=\"variables_set\" id=\"!{OE7jG|eOuI%-Gmeh$z\" x=\"22\" y=\"41\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"VALUE\"><block type=\"math_arithmetic\" id=\"67Ta$Xn*}|J,~^Mjs-.P\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables_get\" id=\"w(Q=6C.o#CN4JYN=$_%b\"><field name=\"VAR\" id=\"qblur_d\">d</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"eSak{(`N-^$A8:Y!TfoB\"><field name=\"NUM\">0.005</field></block></value></block></value><next><block type=\"math_change\" id=\"O4#ogswjF1~gIg@[4tLX\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"DELTA\"><shadow type=\"math_number\" id=\"ee.gC~#6)ZbV3D)dH!Ee\"><field name=\"NUM\">0.4</field></shadow></value></block></next></block></xml>","hslrgb":"hsl"}];
		filters['Contrast'] = [{"hslrgb":"h","name":"First Contrast","workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"qblur_l\">l</variable><variable id=\"qblur_d\">d</variable></variables><block type=\"variables_set\" id=\"!{OE7jG|eOuI%-Gmeh$z\" x=\"22\" y=\"41\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"VALUE\"><block type=\"math_arithmetic\" id=\"67Ta$Xn*}|J,~^Mjs-.P\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables_get\" id=\"w(Q=6C.o#CN4JYN=$_%b\"><field name=\"VAR\" id=\"qblur_d\">d</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"eSak{(`N-^$A8:Y!TfoB\"><field name=\"NUM\">0.005</field></block></value></block></value><next><block type=\"math_change\" id=\"O4#ogswjF1~gIg@[4tLX\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"DELTA\"><shadow type=\"math_number\" id=\"ee.gC~#6)ZbV3D)dH!Ee\"><field name=\"NUM\">0.4</field></shadow></value></block></next></block></xml>","hslrgb":"hsl"}];
		filters['Grayscale'] = [{"hslrgb":"h","name":"First Grayscale","workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"qblur_l\">l</variable><variable id=\"qblur_d\">d</variable></variables><block type=\"variables_set\" id=\"!{OE7jG|eOuI%-Gmeh$z\" x=\"22\" y=\"41\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"VALUE\"><block type=\"math_arithmetic\" id=\"67Ta$Xn*}|J,~^Mjs-.P\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables_get\" id=\"w(Q=6C.o#CN4JYN=$_%b\"><field name=\"VAR\" id=\"qblur_d\">d</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"eSak{(`N-^$A8:Y!TfoB\"><field name=\"NUM\">0.005</field></block></value></block></value><next><block type=\"math_change\" id=\"O4#ogswjF1~gIg@[4tLX\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"DELTA\"><shadow type=\"math_number\" id=\"ee.gC~#6)ZbV3D)dH!Ee\"><field name=\"NUM\">0.4</field></shadow></value></block></next></block></xml>","hslrgb":"hsl"}];
		*/
		var tkey = crypto.randomBytes(100).toString('hex').substr(2, 18);
		var formulas = [];
		var myuser;
		if (req.isAuthenticated()){
			tempKeys[tkey] = {username:req.user.username};
			myuser = req.user.username;
		}
		else {
			myuser = "h";
		}
		QblurData.findOne({ username: myuser }, function(err, result) {
			var images = result.images;
			var filters = {'Custom':[{"hslrgb":'h',"name":"Custom HSL",'workspace':""}]};
			if (result.formulas && result.formulas.filter){
				filters = result.formulas.filter;
			}
			var filterGroups = Object.keys(filters);
			console.log(filterGroups);
			if (req.query && req.query.u && req.query.id){
				var imgName = '';
				if (req.query.u != myuser){
					QblurData.findOne({ username: req.query.u }, function(err, result) {
						var creation = {};
						for (var i=0;i<result.creations.length;i++){
							if (result.creations[i].id == req.query.id){
								creation = result.creations[i];
								break;
							}
						}
						if (creation.id && creation.id.length){

							var realSrc = creation.imgSrc;
				
							res.write(nunjucks.render('templates/qblurbase.html',{
								type: 'filter',
								tkey: tkey,
								formulas: formulas,
								imgSaved: imgName,
								imgData: creation.imgData,
								name: creation.name,
								filters: filters,
								filterGroups: filterGroups,
								realSrc: realSrc,
								images: images,
							}));
							res.end();
						}
						else {
							res.write(nunjucks.render('templates/qblurbase.html',{
								type: 'filter',
								tkey: tkey,
								formulas: formulas,
								filters: filters,
								filterGroups: filterGroups,
								images: images,
							}));
							res.end();
						}
					});
				}
				else {
					var creation = {};
					for (var i=0;i<result.creations.length;i++){
						if (result.creations[i].id == req.query.id){
							creation = result.creations[i];
							break;
						}
					}
					if (creation.id && creation.id.length){
				
						var realSrc = creation.imgSrc;
				
						res.write(nunjucks.render('templates/qblurbase.html',{
							type: 'filter',
							tkey: tkey,
							formulas: formulas,
							imgSaved: imgName,
							imgData: creation.imgData,
							name: creation.name,
							filters: filters,
							filterGroups: filterGroups,
							realSrc: realSrc,
							images: images,
						}));
						res.end();
					}
					else {
						res.write(nunjucks.render('templates/qblurbase.html',{
							type: 'filter',
							tkey: tkey,
							formulas: formulas,
							filters: filters,
							filterGroups: filterGroups,
							images: images,
						}));
						res.end();
					}
				}
			}
			else {
				res.write(nunjucks.render('templates/qblurbase.html',{
					type: 'filter',
					tkey: tkey,
					formulas: formulas,
					filters: filters,
					filterGroups: filterGroups,
					images: images,
				}));
				res.end();
			}
			
			
		});
	}
);

app.get('/overlay', 
	function(req, res) {
		var tkey = crypto.randomBytes(100).toString('hex').substr(2, 18);
		var formulas = [];
		var myuser;
		if (req.isAuthenticated()){
			tempKeys[tkey] = {username:req.user.username};
			myuser = req.user.username;
		}
		else {
			myuser = "h";
		}
		QblurData.findOne({ username: myuser }, function(err, result) {
			var images = result.images;
			formulas = result.formulas.overlay;
			for (var i=0;i<formulas.length;i++){
				formulas[i].id = i;
			}
			if (req.query && req.query.u && req.query.id){
				var imgName = '';
				if (req.query.u != myuser){
					QblurData.findOne({ username: req.query.u }, function(err, result) {
						var creation = {};
						for (var i=0;i<result.creations.length;i++){
							if (result.creations[i].id == req.query.id){
								creation = result.creations[i];
								break;
							}
						}
						if (creation.id && creation.id.length){
							var realSrc = creation.imgSrc;
							res.write(nunjucks.render('templates/qblurbase.html',{
								type: 'overlay',
								tkey: tkey,
								formulas: formulas,
								imgSaved: imgName,
								imgData: creation.imgData,
								name: creation.name,
								realSrc: realSrc,
								images: images,
							}));
							res.end();
						}
						else {
							res.write(nunjucks.render('templates/qblurbase.html',{
								type: 'overlay',
								tkey: tkey,
								formulas: formulas,
								images: images,
							}));
							res.end();
						}
						
					});
				}
				else {
					var creation = {};
					for (var i=0;i<result.creations.length;i++){
						if (result.creations[i].id == req.query.id){
							creation = result.creations[i];
							break;
						}
					}
					if (creation.id && creation.id.length){
						var realSrc = creation.imgSrc;
						res.write(nunjucks.render('templates/qblurbase.html',{
							type: 'overlay',
							tkey: tkey,
							formulas: formulas,
							imgSaved: imgName,
							imgData: creation.imgData,
							name: creation.name,
							realSrc: realSrc,
							images: images,
						}));
						res.end();
					}
					else {
						res.write(nunjucks.render('templates/qblurbase.html',{
							type: 'overlay',
							tkey: tkey,
							formulas: formulas,
							images: images,
						}));
						res.end();
					}
				}
				
			}
			else {
				res.write(nunjucks.render('templates/qblurbase.html',{
					type: 'overlay',
					tkey: tkey,
					formulas: formulas,
					images: images,
				}));
				res.end();
			}
			
		});
	}
);

app.get('/gradient', 
	function(req, res) {
		var tkey = crypto.randomBytes(100).toString('hex').substr(2, 18);
		var formulas = [];
		var myuser;
		if (req.isAuthenticated()){
			tempKeys[tkey] = {username:req.user.username};
			myuser = req.user.username;
		}
		else {
			myuser = "h";
		}
		QblurData.findOne({ username: myuser }, function(err, result) {
			var images = result.images;
			formulas = result.formulas.gradient;
			for (var i=0;i<formulas.length;i++){
				formulas[i].id = i;
			}
			if (req.query && req.query.u && req.query.id){
				var imgName = '';
				if (req.query.u != myuser){
					QblurData.findOne({ username: req.query.u }, function(err, result) {
						var creation = {};
						for (var i=0;i<result.creations.length;i++){
							if (result.creations[i].id == req.query.id){
								creation = result.creations[i];
								break;
							}
						}
						if (creation.id && creation.id.length){
							var realSrc = creation.imgSrc;
							res.write(nunjucks.render('templates/qblurbase.html',{
								type: 'gradient',
								tkey: tkey,
								formulas: formulas,
								imgSaved: imgName,
								imgData: creation.imgData,
								name: creation.name,
								realSrc: realSrc,
								images: images,
							}));
							res.end();
						}
						else {
							res.write(nunjucks.render('templates/qblurbase.html',{
								type: 'gradient',
								tkey: tkey,
								formulas: formulas,
								images: images,
							}));
							res.end();
						}
					});
				}
				else {
					var creation = {};
					for (var i=0;i<result.creations.length;i++){
						if (result.creations[i].id == req.query.id){
							creation = result.creations[i];
							break;
						}
					}
					if (creation.id && creation.id.length){
						var realSrc = creation.imgSrc;
						res.write(nunjucks.render('templates/qblurbase.html',{
							type: 'gradient',
							tkey: tkey,
							formulas: formulas,
							imgSaved: imgName,
							imgData: creation.imgData,
							name: creation.name,
							realSrc: realSrc,
							images: images,
						}));
						res.end();
					}
					else {
						res.write(nunjucks.render('templates/qblurbase.html',{
							type: 'gradient',
							tkey: tkey,
							formulas: formulas,
							images: images,
						}));
						res.end();
					}
				}
						
						
						
				
			}
			else {
				res.write(nunjucks.render('templates/qblurbase.html',{
					type: 'gradient',
					tkey: tkey,
					formulas: formulas,
					images: images,
				}));
				res.end();
			}
			
			
		});

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
  var account = false;
  var imgTypes = ['.png','.jpg','.jpeg','.gif','.tiff','.tif','.bmp'];//.svg, .psd, .eps, .raw, .pdf?
  var maxsize = 2000000; //1000000~1MB
  var inSrcSz = 0;
  ws.on('message', function incoming(message) {
  	
  	if (typeof message !== 'string'){
  		console.log("af",performance.now());
  		var buffer = Buffer.from(message).slice(0,maxsize);
		if (buffer.length>=maxsize-1000){
			//send message
			return;
		}
  		FileType.fromBuffer(buffer.slice(0,1000)).then( (val) => {
  			var ext = '.'+val.ext;
  			var name = parseInt(crypto.randomBytes(50).toString('hex'),16).toString(36).substr(2, 12);
  			for (var i=0;i<imgTypes.length;i++){
				if (ext == imgTypes[i]){
					if (account){
						var imgSrc = 'userimages/'+username+'_'+parseInt(crypto.randomBytes(50).toString('hex'),16).toString(36).substr(2, 12)+ext;
						
						QblurData.updateOne({username:username,'settings.storage': {$lt:10000000}},{$push: {"images": {src:imgSrc,size:buffer.length,name:name,description:"",creations:[]}}, $inc: {'settings.storage':buffer.length}}, function(err, result) {
							if (result.n > 0){
								fs.writeFile('static/'+imgSrc, buffer, function (err) {
									if (err){console.log(err);}
									console.log("cf",performance.now());
									var jsonmessage = {'type':'imageSaved','name':name,'src':imgSrc};
									ws.send(JSON.stringify(jsonmessage));
								});
							}
							else {
								//send message that user needs to delete image
							}
						});
						
						
					}
					else {
						inSrc = 'images/in/'+imgid+imgTypes[i];
						inSrcSz = buffer.length;
						console.log(inSrc);
						fs.writeFile(inSrc, buffer, function (err) {
							if (err){console.log(err);}
							console.log("cf",performance.now());
							var jsonmessage = {'type':'imageLoaded'};
							ws.send(JSON.stringify(jsonmessage));
						});
					}
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
	else if (dm.type && dm.type == 'accountKey'){
		if (dm.message && tempKeys[dm.message]){
			username = tempKeys[dm.message].username;
		}
		account = true;
		return;
	}
	else if (dm.type && dm.type == 'download'){
		console.log(dm.url);
		var name = parseInt(crypto.randomBytes(50).toString('hex'),16).toString(36).substr(2, 12);
		var wget = '';
		var imgSrc;
		for (var i=0;i<imgTypes.length;i++){
			if (dm.url.toLowerCase().indexOf(imgTypes[i]) > -1){
				if (account){
					imgSrc = 'userimages/'+username+'_'+parseInt(crypto.randomBytes(50).toString('hex'),16).toString(36).substr(2, 12)+imgTypes[i];
					wget = '(ulimit -f '+parseInt(maxsize/512)+'; wget --accept "*"'+imgTypes[i]+' -O static/'+imgSrc + ' "' + dm.url + '")';
				}
				else {
					inSrc = 'images/in/'+imgid+imgTypes[i];
					wget = '(ulimit -f '+parseInt(maxsize/512)+'; wget --accept "*"'+imgTypes[i]+' -O '+inSrc + ' "' + dm.url + '")';	
				}
				
			}
		}
		if (wget == ''){return;}
		if (account){
			
			
			QblurData.countDocuments({username:username,'settings.storage': {$lt:10000000}}, function(err, result) {
				console.log(result);
				if (result > 0){
					var child = exec(wget, function(err, stdout, stderr) {
						var sz = 2000000;
						var szIdx = stdout.indexOf('saved [');
						if (szIdx == -1 && stderr.length > 0){
							stdout = stderr;
							szIdx = stdout.indexOf('saved [');
						}
						if (szIdx > -1){
							var szStr = stdout.substring(szIdx+7);
							var szIdxe = szStr.indexOf('/');
							sz = parseInt(szStr.substring(0,szIdxe));
						}
						QblurData.updateOne({username:username,'settings.storage': {$lt:10000000}},{$push: {"images": {src:imgSrc,size:sz,name:name,description:"",creations:[]}}, $inc: {'settings.storage':sz}}, function(err, result) {
							var jsonmessage = {'type':'imageSaved','name':name,'src':imgSrc};
							ws.send(JSON.stringify(jsonmessage));
						});
					});
				}
			});
			
		}
		else {
			var child = exec(wget, function(err, stdout, stderr) {
				inSrcSz = 2000000;
				var szIdx = stdout.indexOf('saved [');
				if (szIdx == -1 && stderr.length > 0){
					stdout = stderr;
					szIdx = stdout.indexOf('saved [');
				}
				if (szIdx > -1){
					var szStr = stdout.substring(szIdx+7);
					var szIdxe = szStr.indexOf('/');
					inSrcSz = parseInt(szStr.substring(0,szIdxe));
					
					var jsonmessage = {'type':'imageLoaded'};
					ws.send(JSON.stringify(jsonmessage));
				}
			});
		}

		return;
	}
	else if (dm.type && dm.type == 'savedImage'){
		console.log(dm.url);
		if (dm.url){
			inSrc = 'static/'+dm.url;
			var jsonmessage = {'type':'imageLoaded'};
			ws.send(JSON.stringify(jsonmessage));
		}
		else {
			QblurData.findOne({username:username}, 'images', function(err, result) {
				for (var i=0;i<result.images.length;i++){
					if (result.images[i].name == dm.name){
						inSrc = 'static/'+result.images[i].src;
						var jsonmessage = {'type':'imageLoaded'};
						ws.send(JSON.stringify(jsonmessage));
						break;
					}
				}
			});
		}
		

		return;
	}
	else if (dm.type && dm.type == 'saveFormula'){
		if (dm.message && username != ''){
			var formula = {'name':dm.name,'workspace':dm.message,'hslrgb':dm.hslrgb};
			//Add a Check that there does not exist a formula of that name already.
			if (!dm.category || dm.category == 'overlay' || dm.category =='gradient' || dm.category =='distance'){
				if (!dm.category){dm.category = 'overlay';}
				QblurData.findOne({ username: username }, "formulas", function(err, result) {
					var foundMatch = false;
					var formulas = result.formulas[dm.category];
					for (var i=0;i<formulas.length;i++){
						if (formulas[i].name == dm.name){
							if (dm.overwrite){
								formulas[i].workspace= dm.message;
								formulas[i].hslrgb = dm.hslrgb;
								result.markModified('formulas');
								result.save(function(err,result){});
								var jsonmessage = {"type":'savedFormula','message':dm.name,'category':dm.category};
								ws.send(JSON.stringify(jsonmessage));
							}
							else {
								var jsonmessage = {"type":'duplicate name'};
								ws.send(JSON.stringify(jsonmessage));
							}
							foundMatch = true;
							break;
						}
					}
					if (!foundMatch){
						formulas.push(formula);
						result.markModified('formulas');
						result.save(function(err,result){});
						var jsonmessage = {"type":'savedFormula','message':dm.name,'category':dm.category};
						ws.send(JSON.stringify(jsonmessage));
					}
				
				});
				//QblurData.updateOne({ username: username }, {$push: {"formulas.overlay": formula}}, function(err, result) {});
			}
			else if (dm.category =='filter') {
				if (formula.hslrgb == 'hsl'){formula.hslrgb = 'h';}
				else {formula.hslrgb = 'r';}
				QblurData.findOne({ username: username }, "formulas", function(err, result) {
					console.log('lssldlsdlsldsdld',err, username);
					console.log(result, dm.group);
					if (result.formulas && result.formulas.filter && result.formulas.filter[dm.group]){
						
						var foundMatch = false;
						var formulas = result.formulas.filter[dm.group];
						for (var i=0;i<formulas.length;i++){
							if (formulas[i].name == dm.name){
								if (dm.overwrite){
									formulas[i].workspace= dm.message;
									formulas[i].hslrgb = formula.hslrgb;
									result.markModified('formulas');
									result.save(function(err,result){});
									var jsonmessage = {"type":'savedFormula','message':dm.name,'group':dm.group,'category':dm.category};
									ws.send(JSON.stringify(jsonmessage));
								}
								else {
									var jsonmessage = {"type":'duplicate name'};
									ws.send(JSON.stringify(jsonmessage));
								}
								foundMatch = true;
								break;
							}
						}
						if (!foundMatch){
							formulas.push(formula);
							result.markModified('formulas');
							result.save(function(err,result){});
							var jsonmessage = {"type":'savedFormula','message':dm.name,'group':dm.group,'category':dm.category};
							ws.send(JSON.stringify(jsonmessage));
						}
					}
					else if (result.formulas && result.formulas.filter){
						result.formulas.filter[dm.group] = [formula];
						result.markModified('formulas');
						result.save(function(err,result){});
					}
					else {
						result.formulas.filter = {};
						result.formulas.filter[dm.group] = [formula];
						result.markModified('formulas');
						result.save(function(err,result){});
					}
					
				});
			}
			
		}
		return;
	}
	else if (dm.type && dm.type == 'saveCreation'){
		if (dm.imgData && username != ''){
			var imgSrc;
			var imgName;
			var randid = parseInt(crypto.randomBytes(50).toString('hex'),16).toString(36).substr(2, 12);
			
			var creationType = 'overlay';
			var creation = {'id':randid,'name':dm.name,'imgData':dm.imgData};

			QblurData.findOne({ username: username }, function(err, result) {
				var mvimg = '';
				if (inSrc.substring(0,9) == 'images/in'){
					if (result.settings.storage > 10000000){
						//not enough room
						return
					}
					var ext = inSrc.substring(inSrc.indexOf('.'));
					imgSrc = 'userimages/'+username+'_'+randid+ext;
					mvimg = 'mv '+inSrc+' static/'+imgSrc;
					inSrc = 'static/'+imgSrc;
					var sz = inSrcSz;
					imgName = dm.name;
					for (var i=0;i<result.images.length;i++){
						if (result.images[i].name == imgName){
							//var jsonmessage = {"type":'duplicate name'};
							//ws.send(JSON.stringify(jsonmessage));
							imgName = parseInt(crypto.randomBytes(50).toString('hex'),16).toString(36).substr(2, 12);
							break;
						}
					}
					
					result.images.push({src:imgSrc,size:sz,name:imgName,description:"",creations:[]});
					result.settings.storage += sz;
					
					
					
					
				
				}
				creation['imgSrc']=inSrc.substring(7);
				var foundMatch = false;
				for (var i=0;i<result.creations.length;i++){
					if (result.creations[i].name == dm.name){
						if (dm.overwrite){
							result.creations[i].imgData = dm.imgData;
							result.creations[i].imgSrc = inSrc.substring(7);
							result.markModified('creations');
							result.save(function(err,result){});
							var jsonmessage = {"type":'savedCreation','message':dm.name};
							ws.send(JSON.stringify(jsonmessage));
						}
						else {
							var jsonmessage = {"type":'duplicate name'};
							ws.send(JSON.stringify(jsonmessage));
						}
						foundMatch = true;
						break;
					}
				}
				if (!foundMatch){
					if (mvimg != ''){
						var child = exec(mvimg, function(err, stdout, stderr) {});
						result.markModified('images');
						result.markModified('settings');
					}
					result.creations.push(creation);
					result.markModified('creations');
					result.save(function(err,result){});
					var jsonmessage = {"type":'savedCreation','message':dm.name};
					ws.send(JSON.stringify(jsonmessage));
				}
				
			});
		}
		return;
	}
	else if (dm.type && dm.type == 'deleteCreation'){
		if (username != ''){
			
			
			QblurData.findOne({ username: username }, "creations", function(err, result) {
				var foundMatch = false;
				for (var i=0;i<result.creations.length;i++){
					if (result.creations[i].name == dm.message){
						result.creations.splice(i,1);
						foundMatch = true;
						break;
					}
				}
				if (foundMatch){
					result.markModified('creations');
					result.save(function(err,result){});
				}
				else {
					var jsonmessage = {'type':'reloadPage'};
					ws.send(JSON.stringify(jsonmessage));
				}
				
			});
		}
		return;
	}
	else if (dm.type && dm.type == 'renameCreation'){
		if (username != ''){
			
			
			QblurData.findOne({ username: username }, "creations", function(err, result) {
				for (var i=0;i<result.creations.length;i++){
					if (result.creations[i].name == dm.new){
						var jsonmessage = {"type":'duplicate name'};
						ws.send(JSON.stringify(jsonmessage));
						return;
					}
				}
				for (var i=0;i<result.creations.length;i++){
					if (result.creations[i].name == dm.old){
						result.creations[i].name = dm.new;
						var jsonmessage = {"type":'renamedCreation','old':dm.old,'new':dm.new};
						ws.send(JSON.stringify(jsonmessage));
						break;
					}
				}
				result.markModified('creations');
				result.save(function(err,result){});
			});
		}
		return;
	}
	else if (dm.type && dm.type == 'deleteImage'){
		if (username != ''){
			
			
			QblurData.findOne({ username: username }, "images", function(err, result) {
				var foundMatch = false;
				for (var i=0;i<result.images.length;i++){
					if (result.images[i].name == dm.message){
						result.images.splice(i,1);
						foundMatch = true;
						break;
					}
				}
				if (foundMatch){
					result.markModified('images');
					result.save(function(err,result){});
				}
				else {
					var jsonmessage = {'type':'reloadPage'};
					ws.send(JSON.stringify(jsonmessage));
				}
			});
		}
		return;
	}
	else if (dm.type && dm.type == 'renameImage'){
		if (username != ''){
			
			
			QblurData.findOne({ username: username }, "images", function(err, result) {
				for (var i=0;i<result.images.length;i++){
					if (result.images[i].name == dm.new){
						var jsonmessage = {"type":'duplicate name'};
						ws.send(JSON.stringify(jsonmessage));
						return;
					}
				}
				for (var i=0;i<result.images.length;i++){
					if (result.images[i].name == dm.old){
						result.images[i].name = dm.new;
						var jsonmessage = {"type":'renamedImage','old':dm.old,'new':dm.new};
						ws.send(JSON.stringify(jsonmessage));
						break;
					}
				}
				result.markModified('images');
				result.save(function(err,result){});
			});
		}
		return;
	}
	else if (dm.type && dm.type == 'copyFormula'){
		if (username != ''){
			if (!dm.newname && dm.newname !== 0){
				return;
			}
			QblurData.findOne({ username: username }, function(err, result) {
				var newFormula = {};
				newFormula.name = dm.newname;
				var foundMatch = false;
				var foundOne = false;
				var formulas;
				if (dm.oldFormulaType == 'filter'){
					formulas = result.formulas.filter[dm.oldGroup];
				}
				else {
					formulas = result.formulas[dm.oldFormulaType];
				}
				for (var i=0;i<formulas.length;i++){
					if (formulas[i].name == dm.oldname){
						newFormula.workspace = formulas[i].workspace;
						newFormula.hslrgb = formulas[i].hslrgb;
						foundMatch = true;
					}
				}
				if (dm.newFormulaType == 'filter' && result.formulas.filter[dm.newGroup]){
					formulas = result.formulas.filter[dm.newGroup];
				}
				else if (dm.newFormulaType == 'filter'){
					result.formulas.filter[dm.newGroup] = [];
					formulas = result.formulas.filter[dm.newGroup];
				}
				else {
					formulas = result.formulas[dm.newFormulaType];
				}
				for (var i=0;i<formulas.length;i++){
					if (formulas[i].name == newFormula.name){
						foundOne = true;
					}
				}
				var ii = 1;
				while (foundOne){
					newFormula.name = dm.newname + ' '+ii;
					foundOne = false;
					for (var i=0;i<formulas.length;i++){
						if (formulas[i].name == newFormula.name){
							foundOne = true;
							break;
						}
					}
					ii++;
				}
				if (foundMatch){
					formulas.push(newFormula);
					result.markModified("formulas");
					result.save(function (err, result2) {
						var formulas = result2.formulas[dm.newFormulaType];
						var workspace;
						var wxml;
						var code;
						var blocklyLang = Blockly.Lua;
						if (result.settings.language == 'python'){blocklyLang = Blockly.Python;}
						if (result.settings.language == 'javascript'){blocklyLang = Blockly.JavaScript;}
						if (result.settings.language == 'php'){blocklyLang = Blockly.PHP;}
						if (result.settings.language == 'dart'){blocklyLang = Blockly.Dart;}
						if (dm.formulaType == 'filter'){
							var idx = 0;
							for (var group in formulas){
								for (var i=0;i<formulas[group].length;i++){
									formulas[group][i].id = idx;
									workspace = new Blockly.Workspace();
									wxml = Blockly.Xml.textToDom(formulas[group][i].workspace);
									Blockly.Xml.domToWorkspace(wxml, workspace);
									code = '<pre class="language-'+result.settings.language+'"><code class="language-'+result.settings.language+'">'+blocklyLang.workspaceToCode(workspace)+'</code></pre>';
									formulas[group][i].code = code;
									idx++;
								}
							}
						}
						else {
							for (var i=0;i<formulas.length;i++){
								formulas[i].id = i;
								workspace = new Blockly.Workspace();
								wxml = Blockly.Xml.textToDom(formulas[i].workspace);
								Blockly.Xml.domToWorkspace(wxml, workspace);
								code = '<pre class="language-'+result.settings.language+'"><code class="language-'+result.settings.language+'">'+blocklyLang.workspaceToCode(workspace)+'</code></pre>';
								formulas[i].code = code;
							}
						}
						var jsonmessage = {'type':'newFormulas'};
						jsonmessage.formulas = formulas;
						jsonmessage.formulaType = dm.newFormulaType;
						ws.send(JSON.stringify(jsonmessage));
					});
					
				}
			});
		}
		return;
	}
	else if (dm.type && dm.type == 'renameFormula'){
		if (username != ''){
			if (!dm.newname && dm.newname !== 0){
				return;
			}
			QblurData.findOne({ username: username }, function(err, result) {
				var newFormula = {};
				newFormula.name = dm.newname;
				var foundMatch = false;
				var foundOne = false;
				var formulas;
				if (dm.oldFormulaType == 'filter'){
					formulas = result.formulas.filter[dm.oldGroup];
				}
				else {
					formulas = result.formulas[dm.oldFormulaType];
				}
				for (var i=0;i<formulas.length;i++){
					if (formulas[i].name == dm.oldname){
						newFormula.workspace = formulas[i].workspace;
						newFormula.hslrgb = formulas[i].hslrgb;
						formulas.splice(i,1);
						foundMatch = true;
						break;
					}
				}
				if (dm.oldFormulaType == 'filter' && result.formulas.filter[dm.oldGroup]){
					formulas = result.formulas.filter[dm.oldGroup];
				}
				else if (dm.oldFormulaType == 'filter'){
					result.formulas.filter[dm.oldGroup] = [];
					formulas = result.formulas.filter[dm.oldGroup];
				}
				else {
					formulas = result.formulas[dm.oldFormulaType];
				}
				for (var i=0;i<formulas.length;i++){
					if (formulas[i].name == newFormula.name){
						foundOne = true;
					}
				}
				var ii = 1;
				while (foundOne){
					newFormula.name = dm.newname + ' '+ii;
					foundOne = false;
					for (var i=0;i<formulas.length;i++){
						if (formulas[i].name == newFormula.name){
							foundOne = true;
							break;
						}
					}
					ii++;
				}
				if (foundMatch){
					formulas.push(newFormula);
					result.markModified("formulas");
					result.save(function (err, result2) {
						var formulas = result2.formulas[dm.oldFormulaType];
						var workspace;
						var wxml;
						var code;
						var blocklyLang = Blockly.Lua;
						if (result.settings.language == 'python'){blocklyLang = Blockly.Python;}
						if (result.settings.language == 'javascript'){blocklyLang = Blockly.JavaScript;}
						if (result.settings.language == 'php'){blocklyLang = Blockly.PHP;}
						if (result.settings.language == 'dart'){blocklyLang = Blockly.Dart;}
						if (dm.formulaType == 'filter'){
							var idx = 0;
							for (var group in formulas){
								for (var i=0;i<formulas[group].length;i++){
									formulas[group][i].id = idx;
									workspace = new Blockly.Workspace();
									wxml = Blockly.Xml.textToDom(formulas[group][i].workspace);
									Blockly.Xml.domToWorkspace(wxml, workspace);
									code = '<pre class="language-'+result.settings.language+'"><code class="language-'+result.settings.language+'">'+blocklyLang.workspaceToCode(workspace)+'</code></pre>';
									formulas[group][i].code = code;
									idx++;
								}
							}
						}
						else {
							for (var i=0;i<formulas.length;i++){
								formulas[i].id = i;
								workspace = new Blockly.Workspace();
								wxml = Blockly.Xml.textToDom(formulas[i].workspace);
								Blockly.Xml.domToWorkspace(wxml, workspace);
								code = '<pre class="language-'+result.settings.language+'"><code class="language-'+result.settings.language+'">'+blocklyLang.workspaceToCode(workspace)+'</code></pre>';
								formulas[i].code = code;
							}
						}
						var jsonmessage = {'type':'newFormulas'};
						jsonmessage.formulas = formulas;
						jsonmessage.formulaType = dm.oldFormulaType;
						ws.send(JSON.stringify(jsonmessage));
					});
					
				}
			});
		}
		return;
	}
	else if (dm.type && dm.type == 'deleteFormula'){
		if (username != ''){
			if (!dm.newname && dm.newname !== 0 && !dm.oldname && dm.oldname !== 0){
				return;
			}
			QblurData.findOne({ username: username }, function(err, result) {
				
				var foundMatch = false;
				var foundOne = false;
				var formulas;
				if (dm.oldFormulaType == 'filter'){
					formulas = result.formulas.filter[dm.oldGroup];
				}
				else {
					formulas = result.formulas[dm.oldFormulaType];
				}
				for (var i=0;i<formulas.length;i++){
					if (formulas[i].name == dm.oldname){
						formulas.splice(i,1);
						foundMatch = true;
						break;
					}
				}
				
				if (foundMatch){
					result.markModified("formulas");
					result.save(function (err, result2) {
						var formulas = result2.formulas[dm.oldFormulaType];
						var workspace;
						var wxml;
						var code;
						var blocklyLang = Blockly.Lua;
						if (result.settings.language == 'python'){blocklyLang = Blockly.Python;}
						if (result.settings.language == 'javascript'){blocklyLang = Blockly.JavaScript;}
						if (result.settings.language == 'php'){blocklyLang = Blockly.PHP;}
						if (result.settings.language == 'dart'){blocklyLang = Blockly.Dart;}
						if (dm.formulaType == 'filter'){
							var idx = 0;
							for (var group in formulas){
								for (var i=0;i<formulas[group].length;i++){
									formulas[group][i].id = idx;
									workspace = new Blockly.Workspace();
									wxml = Blockly.Xml.textToDom(formulas[group][i].workspace);
									Blockly.Xml.domToWorkspace(wxml, workspace);
									code = '<pre class="language-'+result.settings.language+'"><code class="language-'+result.settings.language+'">'+blocklyLang.workspaceToCode(workspace)+'</code></pre>';
									formulas[group][i].code = code;
									idx++;
								}
							}
						}
						else {
							for (var i=0;i<formulas.length;i++){
								formulas[i].id = i;
								workspace = new Blockly.Workspace();
								wxml = Blockly.Xml.textToDom(formulas[i].workspace);
								Blockly.Xml.domToWorkspace(wxml, workspace);
								code = '<pre class="language-'+result.settings.language+'"><code class="language-'+result.settings.language+'">'+blocklyLang.workspaceToCode(workspace)+'</code></pre>';
								formulas[i].code = code;
							}
						}
						var jsonmessage = {'type':'newFormulas'};
						jsonmessage.formulas = formulas;
						jsonmessage.formulaType = dm.oldFormulaType;
						ws.send(JSON.stringify(jsonmessage));
					});
					
				}
			});
		}
		return;
	}
	else if (dm.type && dm.type == 'updateSettings'){
		if (username != ''){
			if (!dm.message && dm.message !== 0){
				return;
			}
			var obj = {};
			obj['settings.'+dm.setting]=dm.message;
			QblurData.updateOne({ username: username }, obj, function(err, result) {
				if (dm.setting == 'robot'){
					var robot = 'python3 python/robohash/createrobo.py '+username+' '+dm.message;
					var child = exec(robot, function(err, stdout, stderr) {
						console.log('robot created: ',performance.now());
						var jsonmessage = {type:'settingsUpdated'};
						ws.send(JSON.stringify(jsonmessage));
					});
				}
				else if (dm.setting == 'language'){
					var jsonmessage = {type:'settingsUpdated'};
					ws.send(JSON.stringify(jsonmessage));
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
	
		var execCmd = '../src/qr-art/bin/Release/netcoreapp3.1/publish/qr-art "'+dm.text+'" '+inSrc+' png static/'+outSrc;
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
			//QblurData.updateOne({ username: username }, {$push: {"creations": outSrc}}, function(err, result) {});
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
	
		var execCmd = '../src/qr-art/bin/Release/netcoreapp3.1/publish/qr-art "'+dm.text+'" '+inSrc+' png static/'+outSrc;
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
			//QblurData.updateOne({ username: username }, {$push: {"creations": outSrc}}, function(err, result) {});
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
	
		var execCmd = '../src/qr-art/bin/Release/netcoreapp3.1/publish/qr-art "dummyText" '+inSrc+' png static/'+outSrc;

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
			execCmd += ' -s '+dm.gradientBorder;
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
			//QblurData.updateOne({ username: username }, {$push: {"creations": outSrc}}, function(err, result) {});
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
	
	
		var execCmd = '../src/qr-art/bin/Release/netcoreapp3.1/publish/qr-art "dummyText" '+inSrc+' png static/'+outSrc;

		execCmd += ' -x 0';
		execCmd += ' -y 0';
		execCmd += ' -r 0';
		execCmd += ' -g contrast';
		var luaBlurFormula = '';
		var hrString = '';
		for (var ii=0;ii<dm.filters.length;ii++){
			var workspace = new Blockly.Workspace();
			if (dm.filters[ii].workspace != ''){
				var wxml = Blockly.Xml.textToDom(dm.filters[ii].workspace);
				Blockly.Xml.domToWorkspace(wxml, workspace);
			}
			
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
			//QblurData.updateOne({ username: username }, {$push: {"creations": outSrc}}, function(err, result) {});
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
	console.log('cg',performance.now());
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
				console.log('cgd',performance.now());
				console.log(`stdout: ${stdout}`);
				var jsonmessage = {'src':outSrc+'?'+imgIndex};
				ws.send(JSON.stringify(jsonmessage));
			});
		}
  	});
	
}

