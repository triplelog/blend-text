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
imgData.imageSrc = document.getElementById('imageSrc').value;
imgData.text = document.getElementById('text').value;
imgData.fontSize = document.getElementById('fontSize').value;
imgData.font = document.getElementById('font').value;
imgData.locY = parseInt(document.getElementById('locY').querySelector('select').value);
imgData.locY += parseInt(document.getElementById('locY').querySelector('input').value);
imgData.locX = parseInt(document.getElementById('locX').querySelector('select').value);
imgData.locX += parseInt(document.getElementById('locX').querySelector('input').value);
imgData.blurRadius = document.getElementById('blurRadius').value;
imgData.blurFormula = document.getElementById('blurFormula').querySelector('textarea').value;
imgData.textFormula = document.getElementById('textFormula').querySelector('textarea').value;

function updateImage(evt){
	if (!evt){
		imgData['blurFormula'] = document.getElementById('blurFormula').querySelector('textarea').value;
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
			/*else if (el.parentElement.id == 'blurFormula' || el.parentElement.id == 'textFormula'){
				var id = el.parentElement.id;
				imgData[id] = document.getElementById(id).querySelector('textarea').value;
			}*/
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
	img.setAttribute('src','loading.png');
	el.innerHTML = '';
	el.appendChild(img);
	
	
}
var singleEls = ['text','font','fontSize','blurRadius','imageSrc'];
for (var i=0;i<5;i++){
	var el = document.getElementById(singleEls[i]);
	el.addEventListener('change',updateImage);
}
var doubleEls = ['locY','locX'];
for (var i=0;i<2;i++){
	var el = document.getElementById(doubleEls[i]);
	el.querySelector('select').addEventListener('change',updateImage);
	el.querySelector('input').addEventListener('change',updateImage);
}
/*var formulaEls = ['blurFormula','textFormula'];
for (var i=0;i<2;i++){
	var el = document.getElementById(formulaEls[i]);
	el.querySelector('textarea').addEventListener('change',updateImage);
}*/

var oldcode = '';
var workspace = Blockly.inject('blocklyDiv', {toolbox: document.getElementById('toolbox')});
workspace.createVariable("d",opt_type="int",opt_id="qblur_d");
workspace.createVariable("h","double","qblur_h");
workspace.createVariable("s","double","qblur_s");
workspace.createVariable("l","double","qblur_l");
//var wxml = Blockly.Xml.textToDom('<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id=",;:rq?OTC,Jk8]jU5cA+">d</variable><variable id="?h%P(UR^$,ia)$nuyDBZ">h</variable></variables><block type="variables_get" id="7?~hoIxng@7*Onq/,x/0" x="181" y="73"><field name="VAR" id=",;:rq?OTC,Jk8]jU5cA+">d</field></block><block type="variables_get" id="VRUA7AnH=$PnID^I!p]M" x="88" y="106"><field name="VAR" id="?h%P(UR^$,ia)$nuyDBZ">h</field></block></xml>');
//Blockly.Xml.domToWorkspace(workspace, wxml);
function myUpdateFunction(event) {
	
	var code = Blockly.Lua.workspaceToCode(workspace);
	lastNew = true;
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
		console.log(Blockly.Xml.domToText(wxml));
		//console.log(JSON.stringify(JSON.decycle(workspace)));
		//console.log(code);
		
		oldcode = code;
		document.getElementById('blurFormula').querySelector('textarea').value = code;
		updateImage(false);
	}
}
workspace.addChangeListener(myUpdateFunction);
