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
		else if (el.parentElement.id == 'blurFormula' || el.parentElement.id == 'textFormula'){
			var id = el.parentElement.id;
			imgData[id] = document.getElementById(id).querySelector('textarea').value;
		}
	}
	//check imgData is valid?

	if (myTimeout){
		clearTimeout(myTimeout);
		myTimeout = setTimeout(function(){ ws.send(JSON.stringify(imgData)); }, 500);
	}
	else {
		myTimeout = setTimeout(function(){ ws.send(JSON.stringify(imgData)); }, 200);
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
var formulaEls = ['blurFormula','textFormula'];
for (var i=0;i<2;i++){
	var el = document.getElementById(formulaEls[i]);
	el.querySelector('textarea').addEventListener('change',updateImage);
}

var oldcode = '';
var workspace = Blockly.inject('blocklyDiv', {toolbox: document.getElementById('toolbox')});
function myUpdateFunction(event) {
	
	var code = Blockly.Lua.workspaceToCode(workspace);
	
	if (code != oldcode){
		console.log(code);
		console.log(oldcode);
		oldcode = code;
		//console.log(JSON.stringify(JSON.decycle(workspace)));
		//console.log(code);
		document.getElementById('codearea').value = code;
	}
}
workspace.addChangeListener(myUpdateFunction);
