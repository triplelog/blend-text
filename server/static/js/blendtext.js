


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

if (document.getElementById('threshold')){
	imgData.threshold = document.getElementById('threshold').value;
}
if (document.getElementById('typeNumber')){
	imgData.typeNumber = document.getElementById('typeNumber').value;
}
if (document.getElementById('errorCorrect')){
	imgData.errorCorrect = document.getElementById('errorCorrect').value;
}
if (document.getElementById('crop')) {
	imgData.crop = document.getElementById('crop').checked;
}

var blurOrText = 'blur';
function updateImage(evt){
	if (!evt){
		imgData['blurFormula'] = document.getElementById('blurFormula').querySelector('textarea').value;
		imgData['textFormula'] = document.getElementById('textFormula').querySelector('textarea').value;
	}
	else {
		var el;
		if (evt == 'updateHslrgb'){
			el = document.getElementById('hslrgb');
		}
		else {
			el = evt.target;
		}
		if (el.id && el.id == 'bort'){
			if (el.value == 'blur'){
				blurOrText = 'blur';
				if (imgData.blurType == 'hsl') {
					document.getElementById('blurFormulaHSL').style.display = 'block';
					document.getElementById('textFormulaHSL').style.display = 'none';
					document.getElementById('textFormulaRGB').style.display = 'none';
					updateBHSL();
				}
				else {
					document.getElementById('blurFormulaRGB').style.display = 'block';
					document.getElementById('textFormulaRGB').style.display = 'none';
					document.getElementById('textFormulaHSL').style.display = 'none';
					updateBRGB();
				}
			}
			else {
				blurOrText = 'text';
				if (imgData.textType == 'hsl') {
					document.getElementById('textFormulaHSL').style.display = 'block';
					document.getElementById('blurFormulaHSL').style.display = 'none';
					document.getElementById('blurFormulaRGB').style.display = 'none';
					updateTHSL();
				}
				else {
					document.getElementById('textFormulaRGB').style.display = 'block';
					document.getElementById('blurFormulaRGB').style.display = 'none';
					document.getElementById('blurFormulaHSL').style.display = 'none';
					updateTRGB();
				}
			}
			onresize();
		}
		else if (el.id && el.id == 'hslrgb'){
			if (blurOrText == 'blur'){
				if (el.value =='rgb'){
					workspaceBRGB.clear();
					var vars = ["d","r","g","b"];
					for (var ii=0;ii<4;ii++){
						workspaceBRGB.createVariable(vars[ii],null,"qblur_"+vars[ii]);
					}
					document.getElementById('blurFormulaHSL').style.display = 'none';
					document.getElementById('blurFormulaRGB').style.display = 'block';
					overwriteFormula['overlay'] = '';
					imgData.blurType = 'rgb';
					updateBRGB();
				}
				else if (el.value =='hsl'){
					workspaceB.clear();
					var vars = ["d","h","s","l"];
					for (var ii=0;ii<4;ii++){
						workspaceB.createVariable(vars[ii],null,"qblur_"+vars[ii]);
					}
					document.getElementById('blurFormulaHSL').style.display = 'block';
					document.getElementById('blurFormulaRGB').style.display = 'none';
					overwriteFormula['overlay'] = '';
					imgData.blurType = 'hsl';
					updateBHSL();
				}
				else {
					var formula = formulas[parseInt(el.value)];
					overwriteFormula['overlay'] = formula.name;
					if (formula.hslrgb == 'rgb'){
						var wxml = Blockly.Xml.textToDom(formula.workspace);
						workspaceBRGB.clear();
						var vars = ["d","r","g","b"];
						for (var ii=0;ii<4;ii++){
							workspaceBRGB.createVariable(vars[ii],null,"qblur_"+vars[ii]);
						}
						Blockly.Xml.domToWorkspace(wxml,workspaceBRGB);
						document.getElementById('blurFormulaHSL').style.display = 'none';
						document.getElementById('blurFormulaRGB').style.display = 'block';
						imgData.blurType = 'rgb';
						updateBRGB();
					}
					else {
						var wxml = Blockly.Xml.textToDom(formula.workspace);
						workspaceB.clear();
						var vars = ["d","h","s","l"];
						for (var ii=0;ii<4;ii++){
							workspaceB.createVariable(vars[ii],null,"qblur_"+vars[ii]);
						}
						Blockly.Xml.domToWorkspace(wxml,workspaceB);
						document.getElementById('blurFormulaHSL').style.display = 'block';
						document.getElementById('blurFormulaRGB').style.display = 'none';
						imgData.blurType = 'hsl';
						updateBHSL();
					}
					
				}
			}
			else {
				if (el.value =='rgb'){
					document.getElementById('textFormulaHSL').style.display = 'none';
					document.getElementById('textFormulaRGB').style.display = 'block';
					overwriteFormula['overlay'] = '';
					imgData.textType = 'rgb';
					updateTRGB();
				}
				else if (el.value =='hsl'){
					document.getElementById('textFormulaHSL').style.display = 'block';
					document.getElementById('textFormulaRGB').style.display = 'none';
					overwriteFormula['overlay'] = '';
					imgData.textType = 'hsl';
					updateTHSL();
				}
				else {
					var formula = formulas[parseInt(el.value)];
					overwriteFormula['overlay'] = formula.name;
					if (formula.hslrgb == 'rgb'){
						var wxml = Blockly.Xml.textToDom(formula.workspace);
						workspaceTRGB.clear();
						var vars = ["d","r","g","b"];
						for (var ii=0;ii<4;ii++){
							workspaceTRGB.createVariable(vars[ii],null,"qblur_"+vars[ii]);
						}
						Blockly.Xml.domToWorkspace(wxml,workspaceTRGB);
						document.getElementById('textFormulaHSL').style.display = 'none';
						document.getElementById('textFormulaRGB').style.display = 'block';
						imgData.textType = 'rgb';
						updateTRGB();
					}
					else {
						var wxml = Blockly.Xml.textToDom(formula.workspace);
						workspaceT.clear();
						var vars = ["d","h","s","l"];
						for (var ii=0;ii<4;ii++){
							workspaceT.createVariable(vars[ii],null,"qblur_"+vars[ii]);
						}
						Blockly.Xml.domToWorkspace(wxml,workspaceT);
						document.getElementById('textFormulaHSL').style.display = 'block';
						document.getElementById('textFormulaRGB').style.display = 'none';
						imgData.textType = 'hsl';
						updateTHSL();
					}
				}
				
			}
			onresize();
		}
		else if (el.id && el.id == 'crop'){
			imgData[el.id] = el.checked;
		}
		else if (el.id){
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
	loadTippy[0].hide();
	
	
}
var singleEls = ['text','font','blurRadius','bort','threshold','typeNumber','errorCorrect','crop'];
for (var i=0;i<8;i++){
	var el = document.getElementById(singleEls[i]);
	if (el){
		el.addEventListener('change',updateImage);
	}
}
var doubleEls = ['locY','locX','fontSize'];
for (var i=0;i<3;i++){
	var el = document.getElementById(doubleEls[i]);
	el.querySelector('select').addEventListener('change',updateImage);
	el.querySelector('input').addEventListener('change',updateImage);
}


var oldcode = '';

for (var i=1;i<4;i++){
	document.getElementById('radio31-'+i).addEventListener('change', onresize, false);
}

function onresize(evt) {
	var element = document.getElementById('formulaDiv');
    var x = 0;
    var y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    for (var i=0;i<4;i++){
		blocklyDivs[i].style.left = x + 'px';
		blocklyDivs[i].style.top = y + 'px';
		blocklyDivs[i].style.width = document.getElementById('formulaDiv').offsetWidth + 'px';
		blocklyDivs[i].style.height = document.getElementById('formulaDiv').offsetHeight + 'px';
		Blockly.svgResize(workspaces[i]);
    }
}


var blocklyDivs = [document.getElementById('blurFormulaRGB'),document.getElementById('textFormulaRGB'),document.getElementById('blurFormulaHSL'),document.getElementById('textFormulaHSL')];
var workspaceBRGB = Blockly.inject(blocklyDivs[0], {toolbox: document.getElementById('toolbox')});
var workspaceTRGB = Blockly.inject(blocklyDivs[1], {toolbox: document.getElementById('toolbox')});
var workspaceB = Blockly.inject(blocklyDivs[2], {toolbox: document.getElementById('toolbox')});
var workspaceT = Blockly.inject(blocklyDivs[3], {toolbox: document.getElementById('toolbox')});
var workspaces = [workspaceBRGB,workspaceTRGB,workspaceB,workspaceT];
for (var i=0;i<4;i++){
	var workspace = workspaces[i];
	var vars = ["d","r","g","b"];
	if (i>=2){
		vars = ["d","h","s","l"];
	}
	for (var ii=0;ii<4;ii++){
		workspace.createVariable(vars[ii],null,"qblur_"+vars[ii]);
	}
	var wxml = Blockly.Xml.textToDom(defaults[parseInt(i)]);
	Blockly.Xml.domToWorkspace(wxml,workspace);
	onresize();
}



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
	if (blurOrText == 'blur'){
		if (imgData.blurType == 'hsl') {
			updateBHSL();
		}
		else {
			updateBRGB();
		}
	}
	else {
		if (imgData.textType == 'hsl') {
			updateTHSL();
		}
		else {
			updateTRGB();
		}
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
		code = Blockly.JavaScript.workspaceToCode(workspace);
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
document.getElementById('textFormulaHSL').style.display = 'none';
document.getElementById('textFormulaRGB').style.display = 'none';
updateTHSL();
updateBHSL();

function switchType(evt) {
	if (document.getElementById('overlayText').checked){
		var els = document.querySelectorAll('.textType');
		for (var i=0;i<els.length;i++){
			els[i].style.removeProperty('display');
		}
		var el2 = document.getElementById('fontSize');
		el2.querySelector('option[value=font]').style.removeProperty('display');
		imgData.type = 'text';
		
	}
	else {
		var els = document.querySelectorAll('.textType');
		for (var i=0;i<els.length;i++){
			els[i].style.display = 'none';
		}
	}
	if (document.getElementById('overlayQR').checked){
		var els = document.querySelectorAll('.qrType');
		for (var i=0;i<els.length;i++){
			els[i].style.removeProperty('display');
		}
		var el2 = document.getElementById('fontSize');
		el2.querySelector('select').value = 'width';
		el2.querySelector('option[value=font]').style.display = 'none';
		imgData.width = document.getElementById('fontSize').querySelector('input').value;
		document.getElementById('fontSize').querySelector('span').textContent = '%';
		imgData.type = 'qr';
	}
	else {
		var els = document.querySelectorAll('.qrType');
		for (var i=0;i<els.length;i++){
			els[i].style.display = 'none';
		}
	}
}
document.getElementById('overlayText').addEventListener('change',switchType);
document.getElementById('overlayQR').addEventListener('change',switchType);
switchType();

function setFormulaOptions() {
	var filterOptions = document.getElementById('hslrgb');
	filterOptions.innerHTML = '';
	for (var i=0;i<formulas.length;i++){
		var option = document.createElement('option');
		option.value = formulas[i].id;
		option.textContent = formulas[i].name;
		filterOptions.appendChild(option);
	}
	var option = document.createElement('option');
	option.value = 'hsl';
	option.textContent = "Custom HSL";
	filterOptions.appendChild(option);

	option = document.createElement('option');
	option.value = 'rgb';
	option.textContent = "Custom RGB";

	filterOptions.appendChild(option);
}




