var ws = new WebSocket('wss://matherrors.com:8080');
ws.onopen = function(evt) {
	
}
ws.onmessage = function(evt){
	var dm = JSON.parse(evt.data);
	var el = document.getElementById('imageHolder');
	var img = document.createElement('img');
	img.setAttribute('src',dm.src);
	el.innerHTML = '';
	el.appendChild(img);
}


var imgData = {};
var myTimeout;
//imgData.imageSrc = document.getElementById('imageSrc').value;
imgData.text = document.getElementById('text').value;
imgData.fontSize = document.getElementById('fontSize').querySelector('input').value;
if (document.getElementById('fontSize').querySelector('select').value == "width"){
	imgData.width = document.getElementById('fontSize').querySelector('input').value;
	document.getElementById('fontSize').querySelector('span').textContent = '%';
}
imgData.font = document.getElementById('font').value;
imgData.locY = parseInt(document.getElementById('locY').querySelector('select').value);
imgData.locY += parseInt(document.getElementById('locY').querySelector('input').value);
imgData.locX = parseInt(document.getElementById('locX').querySelector('select').value);
imgData.locX += parseInt(document.getElementById('locX').querySelector('input').value);
imgData.blurRadius = document.getElementById('blurRadius').value;
imgData.blurFormula = document.getElementById('blurFormula').querySelector('textarea').value;
imgData.blurType = 'hsl';
imgData.textFormula = document.getElementById('textFormula').querySelector('textarea').value;
imgData.textType = 'hsl';
imgData.type = type;

function updateImage(evt){
	if (!evt){
		imgData['blurFormula'] = document.getElementById('blurFormula').querySelector('textarea').value;
		imgData['textFormula'] = document.getElementById('textFormula').querySelector('textarea').value;
	}
	else {
		var el = evt.target;
		if (el.id){
			imgData[el.id] = el.value;
		}
		else {
			if (el.parentElement.id == 'locY' || el.parentElement.id == 'locX'){
				var id = el.parentElement.id;
				imgData[id] = parseInt(document.getElementById(id).querySelector('select').value);
				imgData[id] += parseInt(document.getElementById(id).querySelector('input').value);
			}
			else if (el.parentElement.id == 'fontSize'){
				var id = el.parentElement.id;
				imgData.fontSize = document.getElementById('fontSize').querySelector('input').value;
				if (el.parentElement.querySelector('select').value == 'width'){
					imgData.width = document.getElementById('fontSize').querySelector('input').value;
					document.getElementById('fontSize').querySelector('span').textContent = '%';
				}
				else {
					delete imgData.width;
					document.getElementById('fontSize').querySelector('span').textContent = '';
				}
			}
			else if (el.parentElement.id == 'blurFormula'){
				var id = el.parentElement.id;
				if (el.value =='rgb'){
					document.getElementById(id+'HSL').style.display = 'none';
					document.getElementById(id+'RGB').style.display = 'block';
					imgData.blurType = 'rgb';
					updateBRGB();
				}
				else if (el.value =='hsl'){
					document.getElementById(id+'HSL').style.display = 'block';
					document.getElementById(id+'RGB').style.display = 'none';
					imgData.blurType = 'hsl';
					updateBHSL();
				}
				
			
			}
			else if (el.parentElement.id == 'textFormula'){
				var id = el.parentElement.id;
				if (el.value =='rgb'){
					document.getElementById(id+'HSL').style.display = 'none';
					document.getElementById(id+'RGB').style.display = 'block';
					imgData.textType = 'rgb';
					updateTRGB();
				}
				else if (el.value =='hsl'){
					document.getElementById(id+'HSL').style.display = 'block';
					document.getElementById(id+'RGB').style.display = 'none';
					imgData.textType = 'hsl';
					updateTHSL();
				}
				
			}
		}
	}
	//check imgData is valid?

	if (myTimeout){
		clearTimeout(myTimeout);
		myTimeout = setTimeout(function(){ ws.send(JSON.stringify(imgData)); }, 1000);
	}
	else {
		myTimeout = setTimeout(function(){ ws.send(JSON.stringify(imgData)); }, 1000);
	}
	var el = document.getElementById('imageHolder');
	var img = document.createElement('img');
	img.setAttribute('src','img/loading.jpg');
	el.innerHTML = '';
	el.appendChild(img);
	
	
}
var singleEls = ['text','font','blurRadius'];
for (var i=0;i<3;i++){
	var el = document.getElementById(singleEls[i]);
	el.addEventListener('change',updateImage);
}
var doubleEls = ['locY','locX','fontSize'];
for (var i=0;i<3;i++){
	var el = document.getElementById(doubleEls[i]);
	el.querySelector('select').addEventListener('change',updateImage);
	el.querySelector('input').addEventListener('change',updateImage);
}
var formulaEls = ['blurFormula','textFormula'];
for (var i=0;i<2;i++){
	var el = document.getElementById(formulaEls[i]);
	el.querySelector('select').addEventListener('change',updateImage);
}

var oldcode = '';
var workspaceB = Blockly.inject('blurFormulaHSL', {toolbox: document.getElementById('toolbox')});
workspaceB.createVariable("d",null,"qblur_d");
workspaceB.createVariable("h",null,"qblur_h");
workspaceB.createVariable("s",null,"qblur_s");
workspaceB.createVariable("l",null,"qblur_l");
var wxml = Blockly.Xml.textToDom('<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="qblur_l">l</variable></variables><block type="controls_if" id="Wd;mk5}4Of9%Iw%Z7Zp@" x="35" y="18"><value name="IF0"><block type="logic_compare" id="Y]b.Mo8c|Gg]GFgx]d}."><field name="OP">LT</field><value name="A"><block type="variables_get" id="z@^1uBjFU^[PEMP$1M{*"><field name="VAR" id="qblur_l">l</field></block></value><value name="B"><block type="math_number" id="q#8h__fG*5qOgK`l1]dN"><field name="NUM">0.6</field></block></value></block></value><statement name="DO0"><block type="variables_set" id="!{OE7jG|eOuI%-Gmeh$z"><field name="VAR" id="qblur_l">l</field><value name="VALUE"><block type="math_number" id="eSak{(`N-^$A8:Y!TfoB"><field name="NUM">0.6</field></block></value></block></statement></block></xml>');
Blockly.Xml.domToWorkspace(wxml,workspaceB);

var workspaceT = Blockly.inject('textFormulaHSL', {toolbox: document.getElementById('toolbox')});
workspaceT.createVariable("d",null,"qblur_d");
workspaceT.createVariable("h",null,"qblur_h");
workspaceT.createVariable("s",null,"qblur_s");
workspaceT.createVariable("l",null,"qblur_l");
var wxml = Blockly.Xml.textToDom('<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="qblur_l">l</variable></variables><block type="controls_if" id="Wd;mk5}4Of9%Iw%Z7Zp@" x="35" y="18"><value name="IF0"><block type="logic_compare" id="Y]b.Mo8c|Gg]GFgx]d}."><field name="OP">LT</field><value name="A"><block type="variables_get" id="z@^1uBjFU^[PEMP$1M{*"><field name="VAR" id="qblur_l">l</field></block></value><value name="B"><block type="math_number" id="q#8h__fG*5qOgK`l1]dN"><field name="NUM">0.6</field></block></value></block></value><statement name="DO0"><block type="variables_set" id="!{OE7jG|eOuI%-Gmeh$z"><field name="VAR" id="qblur_l">l</field><value name="VALUE"><block type="math_number" id="eSak{(`N-^$A8:Y!TfoB"><field name="NUM">0.6</field></block></value></block></statement></block></xml>');
Blockly.Xml.domToWorkspace(wxml,workspaceT);

var workspaceBRGB = Blockly.inject('blurFormulaRGB', {toolbox: document.getElementById('toolbox')});
workspaceBRGB.createVariable("d",null,"qblur_d");
workspaceBRGB.createVariable("r",null,"qblur_r");
workspaceBRGB.createVariable("g",null,"qblur_g");
workspaceBRGB.createVariable("b",null,"qblur_b");
var wxml = Blockly.Xml.textToDom('<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="qblur_r">r</variable></variables><block type="controls_if" id="Il^^YLd2NrFN:|;KKrjz" x="53" y="8"><value name="IF0"><block type="logic_compare" id="ziTZ^NbMl,qw@.Jp?R,B"><field name="OP">LT</field><value name="A"><block type="variables_get" id="]$l^IlghlBfr{3nXw`e{"><field name="VAR" id="qblur_r">r</field></block></value><value name="B"><block type="math_number" id="h2X9B|l.elRcnP+Je:;u"><field name="NUM">200</field></block></value></block></value><statement name="DO0"><block type="variables_set" id="D;pLu7Mt]Bf4$r!guo;-"><field name="VAR" id="qblur_r">r</field><value name="VALUE"><block type="math_number" id="i~V0T-jtCz[Wz(P4:BIV"><field name="NUM">200</field></block></value></block></statement></block></xml>');
Blockly.Xml.domToWorkspace(wxml,workspaceBRGB);

var workspaceTRGB = Blockly.inject('textFormulaRGB', {toolbox: document.getElementById('toolbox')});
workspaceTRGB.createVariable("d",null,"qblur_d");
workspaceTRGB.createVariable("r",null,"qblur_r");
workspaceTRGB.createVariable("g",null,"qblur_g");
workspaceTRGB.createVariable("b",null,"qblur_b");
var wxml = Blockly.Xml.textToDom('<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="qblur_r">r</variable></variables><block type="controls_if" id="Il^^YLd2NrFN:|;KKrjz" x="53" y="8"><value name="IF0"><block type="logic_compare" id="ziTZ^NbMl,qw@.Jp?R,B"><field name="OP">LT</field><value name="A"><block type="variables_get" id="]$l^IlghlBfr{3nXw`e{"><field name="VAR" id="qblur_r">r</field></block></value><value name="B"><block type="math_number" id="h2X9B|l.elRcnP+Je:;u"><field name="NUM">200</field></block></value></block></value><statement name="DO0"><block type="variables_set" id="D;pLu7Mt]Bf4$r!guo;-"><field name="VAR" id="qblur_r">r</field><value name="VALUE"><block type="math_number" id="i~V0T-jtCz[Wz(P4:BIV"><field name="NUM">200</field></block></value></block></statement></block></xml>');
Blockly.Xml.domToWorkspace(wxml,workspaceTRGB);

var lang = 'python';
document.getElementById('langOption').addEventListener('change',chgLanguage);
function chgLanguage(event){
	lang = document.getElementById('langOption').value;
	var el = document.getElementById('myCode');
	el.innerHTML = '';
	el.classList.remove('language-python');
	el.classList.remove('language-lua');
	el.classList.remove('language-php');
	el.classList.remove('language-js');
	el.classList.remove('language-dart');
	el.classList.add('language-'+lang);
	var codeEl = document.createElement('code');
	codeEl.classList.add('language-'+lang);
	el.appendChild(codeEl);
	//Add a call to update the code
	if (document.getElementById('blurFormula').querySelector('select').value == 'hsl'){
		updateBHSL();
	}
	else {
		updateBRGB();
	}
	
}
var code;
function updateWork(workspace,bort) {
	if (lang == 'lua'){
		code = Blockly.Lua.workspaceToCode(workspace);
	}
	else if (lang == 'python'){
		code = Blockly.Python.workspaceToCode(workspace);
	}
	else if (lang == 'php'){
		code = Blockly.PHP.workspaceToCode(workspace);
	}
	else if (lang == 'javascript'){
		code = Blockly.Javascript.workspaceToCode(workspace);
	}
	else if (lang == 'dart'){
		code = Blockly.Dart.workspaceToCode(workspace);
	}
	var lastNew = true;
	while (lastNew) {
		if (code.length == 0){break;}
		if (code[code.length-1]=='\n'){
			code = code.substring(0,code.length-1);
		}
		else {
			lastNew = false;
		}
	}
	
	if (code != oldcode){
		var wxml = Blockly.Xml.workspaceToDom(workspace);
		var outspace = Blockly.Xml.domToText(wxml);
		
		oldcode = code;
		if (bort == 'b'){
			document.getElementById('blurFormula').querySelector('textarea').value = outspace;
		}
		else {
			document.getElementById('textFormula').querySelector('textarea').value = outspace;
		}
		
		updateImage(false);
		document.getElementById('myCode').querySelector('code').textContent = code;
		Prism.highlightAll();
	}
}
function updateBHSL(event) {updateWork(workspaceB,'b');}
function updateBRGB(event) {updateWork(workspaceBRGB,'b');}
function updateTHSL(event) {updateWork(workspaceT,'t');}
function updateTRGB(event) {updateWork(workspaceTRGB,'t');}

workspaceB.addChangeListener(updateBHSL);
workspaceBRGB.addChangeListener(updateBRGB);
workspaceT.addChangeListener(updateTHSL);
workspaceTRGB.addChangeListener(updateTRGB);
document.getElementById('blurFormulaRGB').style.display = 'none';
document.getElementById('textFormulaRGB').style.display = 'none';
updateTHSL();
updateBHSL();