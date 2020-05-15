var ws = new WebSocket('wss://qblur.com:8080');
ws.onopen = function(evt) {
	var jsonmessage = {'type':'key'};
	jsonmessage.message = tkey;
	ws.send(JSON.stringify(jsonmessage));
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

imgData.type = type;


var blurOrText = 'blur';
function updateImage(evt){
	if (!evt){
		imgData['blurFormula'] = document.getElementById('blurFormula').querySelector('textarea').value;
	}
	else {
		var el = evt.target;
		if (el.id && el.id == 'hslrgb'){
			if (blurOrText == 'blur'){
				if (el.value =='rgb'){
					document.getElementById('blurFormulaHSL').style.display = 'none';
					document.getElementById('blurFormulaRGB').style.display = 'block';
					imgData.blurType = 'rgb';
					updateBRGB();
				}
				else if (el.value =='hsl'){
					document.getElementById('blurFormulaHSL').style.display = 'block';
					document.getElementById('blurFormulaRGB').style.display = 'none';
					imgData.blurType = 'hsl';
					updateBHSL();
				}
				else {
					var formula = formulas[parseInt(el.value)];
					if (formula.formulaType == 'rgb'){
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
					imgData.textType = 'rgb';
					updateTRGB();
				}
				else if (el.value =='hsl'){
					document.getElementById('textFormulaHSL').style.display = 'block';
					document.getElementById('textFormulaRGB').style.display = 'none';
					imgData.textType = 'hsl';
					updateTHSL();
				}
				else {
					var formula = formulas[parseInt(el.value)];
					if (formula.formulaType == 'rgb'){
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
		else if (el.id){
			imgData[el.id] = el.value;
		}
		else {
		
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
var singleEls = ['text','font','blurRadius','hslrgb','bort','threshold','typeNumber','errorCorrect','crop'];
for (var i=0;i<9;i++){
	var el = document.getElementById(singleEls[i]);
	if (el){
		el.addEventListener('change',updateImage);
	}
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
    for (var i=0;i<2;i++){
		blocklyDivs[i].style.left = x + 'px';
		blocklyDivs[i].style.top = y + 'px';
		blocklyDivs[i].style.width = document.getElementById('formulaDiv').offsetWidth + 'px';
		blocklyDivs[i].style.height = document.getElementById('formulaDiv').offsetHeight + 'px';
		Blockly.svgResize(workspaces[i]);
    }
}

var defaults = ['<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="qblur_r">r</variable></variables><block type="controls_if" id="Il^^YLd2NrFN:|;KKrjz" x="53" y="8"><value name="IF0"><block type="logic_compare" id="ziTZ^NbMl,qw@.Jp?R,B"><field name="OP">LT</field><value name="A"><block type="variables_get" id="]$l^IlghlBfr{3nXw`e{"><field name="VAR" id="qblur_r">r</field></block></value><value name="B"><block type="math_number" id="h2X9B|l.elRcnP+Je:;u"><field name="NUM">200</field></block></value></block></value><statement name="DO0"><block type="variables_set" id="D;pLu7Mt]Bf4$r!guo;-"><field name="VAR" id="qblur_r">r</field><value name="VALUE"><block type="math_number" id="i~V0T-jtCz[Wz(P4:BIV"><field name="NUM">200</field></block></value></block></statement></block></xml>'];
defaults.push('<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="qblur_l">l</variable></variables><block type="controls_if" id="Wd;mk5}4Of9%Iw%Z7Zp@" x="35" y="18"><value name="IF0"><block type="logic_compare" id="Y]b.Mo8c|Gg]GFgx]d}."><field name="OP">LT</field><value name="A"><block type="variables_get" id="z@^1uBjFU^[PEMP$1M{*"><field name="VAR" id="qblur_l">l</field></block></value><value name="B"><block type="math_number" id="q#8h__fG*5qOgK`l1]dN"><field name="NUM">0.6</field></block></value></block></value><statement name="DO0"><block type="variables_set" id="!{OE7jG|eOuI%-Gmeh$z"><field name="VAR" id="qblur_l">l</field><value name="VALUE"><block type="math_number" id="eSak{(`N-^$A8:Y!TfoB"><field name="NUM">0.6</field></block></value></block></statement></block></xml>');

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
		document.getElementById('blurFormula').querySelector('textarea').value = outspace;
		
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
updateBHSL();






