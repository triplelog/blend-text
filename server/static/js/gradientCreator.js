

var imgData = {};
var myTimeout;
imgData.locY = parseInt(document.getElementById('locY').querySelector('select').value);
imgData.locY += parseInt(document.getElementById('locY').querySelector('input').value);
imgData.locX = parseInt(document.getElementById('locX').querySelector('select').value);
imgData.locX += parseInt(document.getElementById('locX').querySelector('input').value);
imgData.gradientSpread = parseInt(document.getElementById('gradientSpread').querySelector('input').value);
imgData.gradientAngle = parseInt(document.getElementById('gradientAngle').querySelector('input').value);
imgData.gradientType = document.getElementById('gradientType').querySelector('select').value;
imgData.gradientCenter = parseInt(document.getElementById('gradientCenter').querySelector('select').value);
imgData.gradientDistance = parseInt(document.getElementById('gradientDistance').querySelector('select').value);
imgData.gradientSkew = parseInt(document.getElementById('gradientSkew').querySelector('select').value);
imgData.gradientYears = parseInt(document.getElementById('gradientYears').querySelector('input').value);
imgData.gradientDeadMin = parseInt(document.getElementById('gradientDeadMin').querySelector('input').value);
imgData.gradientDeadMax = parseInt(document.getElementById('gradientDeadMax').querySelector('input').value);
imgData.gradientLiveMin = parseInt(document.getElementById('gradientLiveMin').querySelector('input').value);
imgData.gradientLiveMax = parseInt(document.getElementById('gradientLiveMax').querySelector('input').value);
imgData.gradientBorder = parseInt(document.getElementById('gradientBorder').querySelector('input').value);
imgData.blurFormula = document.getElementById('blurFormula').querySelector('textarea').value;
imgData.blurType = 'hsl';
imgData.type = type;

imgData.threshold = document.getElementById('threshold').value;

var singleEls = ['threshold'];
for (var i=0;i<1;i++){
	var el = document.getElementById(singleEls[i]);
	el.addEventListener('change',updateImage);
}
var numberEls = ['gradientSpread','gradientAngle','gradientYears','gradientDeadMin','gradientDeadMax','gradientLiveMin','gradientLiveMax','gradientBorder'];
for (var i=0;i<8;i++){
	var el = document.getElementById(numberEls[i]).querySelector('input');
	el.addEventListener('change',updateImage);
}
var selectEls = ['gradientType','gradientCenter','gradientDistance','gradientSkew'];
for (var i=0;i<4;i++){
	var el = document.getElementById(selectEls[i]).querySelector('select');
	el.addEventListener('change',updateImage);
}
var doubleEls = ['locY','locX'];
for (var i=0;i<2;i++){
	var el = document.getElementById(doubleEls[i]);
	el.querySelector('select').addEventListener('change',updateImage);
	el.querySelector('input').addEventListener('change',updateImage);
}

document.getElementById('gradientAngle').style.display = 'block';
document.getElementById('gradientSpread').style.display = 'none';
document.getElementById('gradientCenter').style.display = 'none';
document.getElementById('gradientDistance').style.display = 'none';
document.getElementById('gradientSkew').style.display = 'none';
document.getElementById('lifeOptions').style.display = 'none';
					
var blurOrText = 'blur';
function updateImage(evt){
	if (!evt){
		imgData['blurFormula'] = document.getElementById('blurFormula').querySelector('textarea').value;
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
					updateBHSL();
				}
				else {
					document.getElementById('blurFormulaRGB').style.display = 'block';
					updateBRGB();
				}
			}
			onresize();
		}
		else if (el.id && el.id == 'hslrgb'){
			if (el.value =='rgb'){
				workspaceBRGB.clear();
				var vars = ["d","r","g","b"];
				for (var ii=0;ii<4;ii++){
					workspaceBRGB.createVariable(vars[ii],null,"qblur_"+vars[ii]);
				}
				document.getElementById('blurFormulaHSL').style.display = 'none';
				document.getElementById('blurFormulaRGB').style.display = 'block';
				overwriteFormula['gradient'] = '';
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
				overwriteFormula['gradient'] = '';
				imgData.blurType = 'hsl';
				updateBHSL();
			}
			else {
				var formula = formulas[parseInt(el.value)];
				overwriteFormula['gradient'] = formula.name;
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
			onresize();
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
			else if (el.parentElement.id == 'gradientAngle' || el.parentElement.id == 'gradientSpread'){
				var id = el.parentElement.id;
				imgData[id] = parseInt(el.value);
			}
			else if (el.parentElement.id == 'gradientYears' || el.parentElement.id == 'gradientDeadMin' || el.parentElement.id == 'gradientDeadMax' || el.parentElement.id == 'gradientLiveMin' || el.parentElement.id == 'gradientLiveMax' || el.parentElement.id == 'gradientBorder'){
				var id = el.parentElement.id;
				imgData[id] = parseInt(el.value);
			}
			else if (el.parentElement.id == 'gradientCenter' || el.parentElement.id == 'gradientDistance' || el.parentElement.id == 'gradientSkew'){
				var id = el.parentElement.id;
				imgData[id] = parseInt(el.value);
			}
			else if (el.parentElement.id == 'gradientType'){
				chgGradientType();
				
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
function setGroup() {
	document.getElementById('formulaName').value = overwriteFormula['gradient'];
}
function chgGradientType() {
	var el = document.getElementById('gradientType').querySelector('select');
	if (el.value == 'linear'){
		document.getElementById('gradientAngle').style.display = 'block';
		document.getElementById('gradientSpread').style.display = 'none';
		document.getElementById('gradientCenter').style.display = 'none';
		document.getElementById('gradientDistance').style.display = 'none';
		document.getElementById('gradientSkew').style.display = 'none';
		document.getElementById('lifeOptions').style.display = 'none';
	}
	else if (el.value == 'radial'){
		document.getElementById('gradientAngle').style.display = 'none';
		document.getElementById('gradientSpread').style.display = 'none';
		document.getElementById('gradientCenter').style.display = 'block';
		document.getElementById('gradientDistance').style.display = 'block';
		document.getElementById('gradientSkew').style.display = 'block';
		document.getElementById('lifeOptions').style.display = 'none';
	}
	else if (el.value == 'edge'){
		document.getElementById('gradientAngle').style.display = 'none';
		document.getElementById('gradientSpread').style.display = 'block';
		document.getElementById('gradientCenter').style.display = 'none';
		document.getElementById('gradientDistance').style.display = 'none';
		document.getElementById('gradientSkew').style.display = 'none';
		document.getElementById('lifeOptions').style.display = 'none';
	}
	else if (el.value == 'life'){
		document.getElementById('gradientAngle').style.display = 'none';
		document.getElementById('gradientSpread').style.display = 'none';
		document.getElementById('gradientCenter').style.display = 'none';
		document.getElementById('gradientDistance').style.display = 'none';
		document.getElementById('gradientSkew').style.display = 'none';
		document.getElementById('lifeOptions').style.display = 'block';
	}
	imgData.gradientType = el.value;
}
chgGradientType();

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
    var oh = document.getElementById('formulaDiv').offsetHeight;
    var ow = document.getElementById('formulaDiv').offsetWidth;
    for (var i=0;i<2;i++){
		blocklyDivs[i].style.left = x + 'px';
		blocklyDivs[i].style.top = y + 'px';
		blocklyDivs[i].style.height = oh + 'px';
	}
	for (var i=0;i<2;i++){
		console.log(document.getElementById('formulaDiv').offsetWidth);
		blocklyDivs[i].style.width = ow + 'px';
		console.log(document.getElementById('formulaDiv').offsetWidth);
		console.log(blocklyDivs[i].style.width);
		
	}
	for (var i=0;i<2;i++){
		console.log(document.getElementById('formulaDiv').offsetWidth);
		Blockly.svgResize(workspaces[i]);
		console.log(document.getElementById('formulaDiv').offsetWidth);
    }
}

var blocklyDivs = [document.getElementById('blurFormulaRGB'),document.getElementById('blurFormulaHSL')];
var workspaceBRGB = Blockly.inject(blocklyDivs[0], {toolbox: document.getElementById('toolbox')});
var workspaceB = Blockly.inject(blocklyDivs[1], {toolbox: document.getElementById('toolbox')});
var workspaces = [workspaceBRGB,workspaceB];
for (var i=0;i<2;i++){
	var workspace = workspaces[i];
	var vars = ["d","r","g","b"];
	if (i>=1){
		vars = ["d","h","s","l"];
	}
	for (var ii=0;ii<4;ii++){
		workspace.createVariable(vars[ii],null,"qblur_"+vars[ii]);
	}
	var wxml = Blockly.Xml.textToDom(defaults[i]);
	Blockly.Xml.domToWorkspace(wxml,workspace);
	
}
console.log(document.getElementById('formulaDiv').offsetWidth);
onresize();
console.log(document.getElementById('formulaDiv').offsetWidth);
onresize();


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
	if (imgData.blurType == 'hsl') {
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
		
		updateImage(false);
		document.getElementById('myCode').querySelector('code').textContent = code;
		Prism.highlightAll();
	}
}
function updateBHSL(event) {updateWork(workspaceB,'b');}
function updateBRGB(event) {updateWork(workspaceBRGB,'b');}

workspaceB.addChangeListener(updateBHSL);
workspaceBRGB.addChangeListener(updateBRGB);
document.getElementById('blurFormulaRGB').style.display = 'none';
document.getElementById('refreshCreation').addEventListener('click',updateImage);
updateBHSL();

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






