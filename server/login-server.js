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

var tempKeys = {};
const User = require('./models/user');
const QblurData = require('./models/qblurdata');
const mongoose = require('mongoose');
mongoose.connect('mongodb://triplelog:kZGWGda3A@45.32.213.227:27017/triplelog', {useNewUrlParser: true});
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
// use static authenticate method of model in LocalStrategy
//passport.use(User.createStrategy());
 
// use static serialize and deserialize of model for passport session support
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var express = require('express');



var app = express();
const session = require("express-session");
app.use(session({ secret: "cats" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/account',
  function(req, res){
  	if (!req.isAuthenticated()){
  		if (req.query.e && req.query.e=='duplicate'){
  			res.write(nunjucks.render('templates/loginregisterbase.html',{
				duplicate: true,
			}));
			res.end();
  		}
  		else if (req.query.e && req.query.e=='badlogin'){
  			res.write(nunjucks.render('templates/loginregisterbase.html',{
				badlogin: true,
			}));
			res.end();
  		}
  		else {
  			res.write(nunjucks.render('templates/loginregisterbase.html',{}));
			res.end();
  		}
		
  	}
  	else {
  		var tkey = crypto.randomBytes(100).toString('hex').substr(2, 18);
		tempKeys[tkey] = {username:req.user.username};
		
		QblurData.findOne({username:req.user.username}, function(err,result) {
			if (result == null){
				result = {username: req.user.username.toLowerCase(), formulas: {gradient:baseGradients,distance:[],overlay:[],filter:{}}, images: [], creations: [], friends: [], followers: [], settings: {robot:1,storage:0}};
				var qblurData = new QblurData(result);
				qblurData.save(function(err2,result2){
					console.log('user registered!',performance.now());
					var robot = 'python3 python/robohash/createrobo.py '+req.user.username.toLowerCase()+' 1';
					var child = exec(robot, function(err, stdout, stderr) {
						console.log('robot created: ',performance.now());
					});
				})
			
			}
			var formulas = result.formulas;
			var workspace;
			var wxml;
			var code;
			//console.log(req.user);
			for (var i=0;i<formulas.overlay.length;i++){
				formulas.overlay[i].id = i;
				workspace = new Blockly.Workspace();
				wxml = Blockly.Xml.textToDom(formulas[i].workspace);
				Blockly.Xml.domToWorkspace(wxml, workspace);
				code = Blockly.Lua.workspaceToCode(workspace);
				formulas.overlay[i].code = code;
			}
			for (var i=0;i<formulas.gradient.length;i++){
				formulas.gradient[i].id = i;
				workspace = new Blockly.Workspace();
				wxml = Blockly.Xml.textToDom(formulas[i].workspace);
				Blockly.Xml.domToWorkspace(wxml, workspace);
				code = Blockly.Lua.workspaceToCode(workspace);
				formulas.gradient[i].code = code;
			}
		
			var images = result.images;

			var creations = result.creations;
		
		
			res.write(nunjucks.render('templates/accountbase.html',{
				username: req.user.options.displayName || req.user.username,
				name: req.user.name || '',
				options: req.user.options,
				friends: result.friends,
				tkey: tkey,
				formulas: formulas,
				images: images,
				creations: creations,
			}));
			res.end();
		})
		
  	}
  	
  }
);

var baseGradients = [{"name":"First Formula","workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"qblur_l\">l</variable><variable id=\"qblur_d\">d</variable></variables><block type=\"variables_set\" id=\"!{OE7jG|eOuI%-Gmeh$z\" x=\"22\" y=\"41\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"VALUE\"><block type=\"math_arithmetic\" id=\"67Ta$Xn*}|J,~^Mjs-.P\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables_get\" id=\"w(Q=6C.o#CN4JYN=$_%b\"><field name=\"VAR\" id=\"qblur_d\">d</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"eSak{(`N-^$A8:Y!TfoB\"><field name=\"NUM\">0.005</field></block></value></block></value><next><block type=\"math_change\" id=\"O4#ogswjF1~gIg@[4tLX\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"DELTA\"><shadow type=\"math_number\" id=\"ee.gC~#6)ZbV3D)dH!Ee\"><field name=\"NUM\">0.4</field></shadow></value></block></next></block></xml>","hslrgb":"hsl"},{"name":"First Formula","workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"qblur_l\">l</variable><variable id=\"qblur_d\">d</variable></variables><block type=\"variables_set\" id=\"!{OE7jG|eOuI%-Gmeh$z\" x=\"20\" y=\"30\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"VALUE\"><block type=\"math_arithmetic\" id=\"67Ta$Xn*}|J,~^Mjs-.P\"><field name=\"OP\">MULTIPLY</field><value name=\"A\"><block type=\"variables_get\" id=\"w(Q=6C.o#CN4JYN=$_%b\"><field name=\"VAR\" id=\"qblur_d\">d</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"eSak{(`N-^$A8:Y!TfoB\"><field name=\"NUM\">0.005</field></block></value></block></value><next><block type=\"math_change\" id=\"O4#ogswjF1~gIg@[4tLX\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"DELTA\"><shadow type=\"math_number\" id=\"ee.gC~#6)ZbV3D)dH!Ee\"><field name=\"NUM\">0.4</field></shadow></value></block></next></block></xml>","hslrgb":"hsl"},{"name":"First Formula","workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"qblur_l\">l</variable><variable id=\"qblur_d\">d</variable></variables><block type=\"variables_set\" id=\"!{OE7jG|eOuI%-Gmeh$z\" x=\"20\" y=\"30\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"VALUE\"><block type=\"math_arithmetic\" id=\"67Ta$Xn*}|J,~^Mjs-.P\"><field name=\"OP\">MULTIPLY</field><value name=\"A\"><block type=\"variables_get\" id=\"w(Q=6C.o#CN4JYN=$_%b\"><field name=\"VAR\" id=\"qblur_d\">d</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"eSak{(`N-^$A8:Y!TfoB\"><field name=\"NUM\">0.005</field></block></value></block></value><next><block type=\"math_change\" id=\"O4#ogswjF1~gIg@[4tLX\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"DELTA\"><shadow type=\"math_number\" id=\"ee.gC~#6)ZbV3D)dH!Ee\"><field name=\"NUM\">0.4</field></shadow></value></block></next></block></xml>","hslrgb":"hsl"},{"name":"First Formula","workspace":"<xml xmlns=\"https://developers.google.com/blockly/xml\"><variables><variable id=\"qblur_l\">l</variable><variable id=\"qblur_h\">h</variable><variable id=\"qblur_d\">d</variable><variable id=\"qblur_s\">s</variable></variables><block type=\"controls_if\" id=\"YJyHn]b[ufVP!P_RS1$e\" x=\"8\" y=\"11\"><mutation else=\"1\"/><value name=\"IF0\"><block type=\"logic_compare\" id=\"o}?%mEv!~5ukZh+A6:uy\"><field name=\"OP\">GT</field><value name=\"A\"><block type=\"variables_get\" id=\"9;Ft$U$6waf7()IF{8JE\"><field name=\"VAR\" id=\"qblur_d\">d</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"$rjVfR6c[Tf$5R=AQsxE\"><field name=\"NUM\">100</field></block></value></block></value><statement name=\"DO0\"><block type=\"variables_set\" id=\"!{OE7jG|eOuI%-Gmeh$z\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"VALUE\"><block type=\"math_number\" id=\"eSak{(`N-^$A8:Y!TfoB\"><field name=\"NUM\">1</field></block></value></block></statement><statement name=\"ELSE\"><block type=\"variables_set\" id=\"@SrMHiu#RPHn8AUNAW;5\"><field name=\"VAR\" id=\"qblur_h\">h</field><value name=\"VALUE\"><block type=\"math_arithmetic\" id=\"3.ps!A(ymlM()y__ehbu\"><field name=\"OP\">MULTIPLY</field><value name=\"A\"><block type=\"variables_get\" id=\"xxP.`KseFJO98bI7zP?7\"><field name=\"VAR\" id=\"qblur_d\">d</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"S+_q(0K(?f/%lSwD]pQT\"><field name=\"NUM\">3.5</field></block></value></block></value><next><block type=\"variables_set\" id=\"AEO[;2d:2_:k|0N/JZca\"><field name=\"VAR\" id=\"qblur_l\">l</field><value name=\"VALUE\"><block type=\"math_number\" id=\"5}3$ajy[ihF#HZ~%_!S7\"><field name=\"NUM\">0.5</field></block></value><next><block type=\"variables_set\" id=\"-C-X;StO[k2a{Rj2q}Fg\"><field name=\"VAR\" id=\"qblur_s\">s</field><value name=\"VALUE\"><block type=\"math_number\" id=\"?iH:ucP}#oWpkL{RTP_*\"><field name=\"NUM\">0.5</field></block></value></block></next></block></next></block></statement></block></xml>","hslrgb":"hsl"}];


app.post('/register',
  function(req, res){
  	console.log('registering: ',performance.now());
  	var user = new User({username: req.body.username.toLowerCase(), options: {displayName: req.body.username,robot:1}});
	User.register(user,req.body.password, function(err) {
		if (err) {
		  if (err.name == 'UserExistsError'){
		  	res.redirect('../account?e=duplicate');
		  }
		  else {
		  	console.log(err);
		  }
		  
		}
		else {
			var qblurData = new QblurData({username: req.body.username.toLowerCase(), formulas: {gradient:baseGradients,distance:[],overlay:[],filter:{}}, images: [], creations: [], friends: [], followers: [], settings: {robot:1,storage:0}});
			qblurData.save(function(err,result){
				console.log('user registered!',performance.now());
				var robot = 'python3 python/robohash/createrobo.py '+req.body.username.toLowerCase()+' 1';
				var child = exec(robot, function(err, stdout, stderr) {
					console.log('robot created: ',performance.now());
					req.login(user, function(err) {
					  if (err) { res.redirect('/'); }
					  else {
						console.log('logged in: ',performance.now());
						res.redirect('../account');
					  }
					});
				});
			})
			
			
			
			
		}
		

	});
  }
);

function usernameToLowerCase(req, res, next){
	req.body.username = req.body.username.toLowerCase();
	next();
} 
app.post('/login',  usernameToLowerCase,
	passport.authenticate('local', { successRedirect: '/account', failureRedirect: '/account?e=badlogin' })
);

app.get('/logout', 
	function(req, res) {
	  req.logout();
	  res.redirect('../');
	}
);




module.exports = {loginApp: app, tempKeys: tempKeys}