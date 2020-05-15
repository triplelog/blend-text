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
imgData.blurType = 'hsl';
imgData.type = type;
imgData.filters = [];
var currentFilterID = 0;


function updateImage(evt){
	if (!evt){
		imgData['blurFormula'] = document.getElementById('blurFormula').querySelector('textarea').value;
	}
	else {
		var el = evt.target;
		if (el.id && el.id == 'hslrgb'){
			var filterListEls = document.getElementById('filterList').querySelectorAll('div');
			if (filterListEls[currentFilterID]){
				filterListEls[currentFilterID].querySelector('span').textContent = el.querySelector(':selected').textContent;
			}
			if (el.value =='rgb'){
				workspace.clear();
				var vars = ["r","g","b"];
				for (var ii=0;ii<3;ii++){
					workspace.createVariable(vars[ii],null,"qblur_"+vars[ii]);
				}
				var wxml = Blockly.Xml.workspaceToDom(workspace);
				var outspace = Blockly.Xml.domToText(wxml);
				imgData.filters[currentFilterID].workspace = outspace;
				imgData.filters[currentFilterID].hslrgb = "r";
				updateWork();
			}
			else if (el.value =='hsl'){
				workspace.clear();
				var vars = ["h","s","l"];
				for (var ii=0;ii<3;ii++){
					workspace.createVariable(vars[ii],null,"qblur_"+vars[ii]);
				}
				var wxml = Blockly.Xml.workspaceToDom(workspace);
				var outspace = Blockly.Xml.domToText(wxml);
				imgData.filters[currentFilterID].workspace = outspace;
				imgData.filters[currentFilterID].hslrgb = "h";
				updateWork();
			}
			else {
				var formula = filters[currentFilterType][parseInt(el.value)];
				if (formula.hslrgb == 'r'){
					var wxml = Blockly.Xml.textToDom(formula.workspace);
					workspace.clear();
					var vars = ["r","g","b"];
					for (var ii=0;ii<3;ii++){
						workspace.createVariable(vars[ii],null,"qblur_"+vars[ii]);
					}
					Blockly.Xml.domToWorkspace(wxml,workspace);
					imgData.filters[currentFilterID].workspace = formula.workspace;
					imgData.filters[currentFilterID].hslrgb = formula.hslrgb;
					imgData.filters[currentFilterID].name = formula.name;
					updateWork();
				}
				else {
					var wxml = Blockly.Xml.textToDom(formula.workspace);
					workspace.clear();
					var vars = ["h","s","l"];
					for (var ii=0;ii<3;ii++){
						workspace.createVariable(vars[ii],null,"qblur_"+vars[ii]);
					}
					Blockly.Xml.domToWorkspace(wxml,workspace);
					imgData.filters[currentFilterID].workspace = formula.workspace;
					imgData.filters[currentFilterID].hslrgb = formula.hslrgb;
					imgData.filters[currentFilterID].name = formula.name;
					updateWork();
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
	blocklyDiv.style.left = x + 'px';
	blocklyDiv.style.top = y + 'px';
	blocklyDiv.style.width = document.getElementById('formulaDiv').offsetWidth + 'px';
	blocklyDiv.style.height = document.getElementById('formulaDiv').offsetHeight + 'px';
	Blockly.svgResize(workspace);
}

var defaults = ['<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="qblur_r">r</variable></variables><block type="controls_if" id="Il^^YLd2NrFN:|;KKrjz" x="53" y="8"><value name="IF0"><block type="logic_compare" id="ziTZ^NbMl,qw@.Jp?R,B"><field name="OP">LT</field><value name="A"><block type="variables_get" id="]$l^IlghlBfr{3nXw`e{"><field name="VAR" id="qblur_r">r</field></block></value><value name="B"><block type="math_number" id="h2X9B|l.elRcnP+Je:;u"><field name="NUM">200</field></block></value></block></value><statement name="DO0"><block type="variables_set" id="D;pLu7Mt]Bf4$r!guo;-"><field name="VAR" id="qblur_r">r</field><value name="VALUE"><block type="math_number" id="i~V0T-jtCz[Wz(P4:BIV"><field name="NUM">200</field></block></value></block></statement></block></xml>'];
defaults.push('<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="qblur_l">l</variable></variables><block type="controls_if" id="Wd;mk5}4Of9%Iw%Z7Zp@" x="35" y="18"><value name="IF0"><block type="logic_compare" id="Y]b.Mo8c|Gg]GFgx]d}."><field name="OP">LT</field><value name="A"><block type="variables_get" id="z@^1uBjFU^[PEMP$1M{*"><field name="VAR" id="qblur_l">l</field></block></value><value name="B"><block type="math_number" id="q#8h__fG*5qOgK`l1]dN"><field name="NUM">0.6</field></block></value></block></value><statement name="DO0"><block type="variables_set" id="!{OE7jG|eOuI%-Gmeh$z"><field name="VAR" id="qblur_l">l</field><value name="VALUE"><block type="math_number" id="eSak{(`N-^$A8:Y!TfoB"><field name="NUM">0.6</field></block></value></block></statement></block></xml>');

var blocklyDiv = document.getElementById('blurFormulaHSL');
var workspace = Blockly.inject(blocklyDiv, {toolbox: document.getElementById('toolbox')});

var vars = ["d","h","s","l"];

for (var ii=0;ii<4;ii++){
	workspace.createVariable(vars[ii],null,"qblur_"+vars[ii]);
}
var currentFilterType ='Brightness';
setFilterOptions(0);
function setFilterOptions(selectedID) {
	var filterOptions = document.getElementById('hslrgb');
	filterOptions.innerHTML = '';
	for (var i=0;i<filters[currentFilterType].length;i++){
		var option = document.createElement('option');
		option.value = i;
		option.textContent = filters[currentFilterType][i].name;
		if (i == selectedID || (i==0 && !selectedID)){
			option.setAttribute('selected','selected');
		}
		filterOptions.appendChild(option);
	}
	var option = document.createElement('option');
	option.value = 'hsl';
	option.textContent = currentFilterType+" HSL";
	filterOptions.appendChild(option);
	if (-2 == selectedID){
		option.setAttribute('selected','selected');
	}
	option = document.createElement('option');
	option.value = 'rgb';
	option.textContent = currentFilterType+" RGB";
	if (-1 == selectedID){
		option.setAttribute('selected','selected');
	}
	filterOptions.appendChild(option);
}

var wxml = Blockly.Xml.textToDom(filters[currentFilterType][0].workspace);
Blockly.Xml.domToWorkspace(wxml,workspace);
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
function updateWork() {
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
		if (imgData.filters[currentFilterID]){
			imgData.filters[currentFilterID].workspace = outspace;
		}
		
		
		updateImage(false);
		document.getElementById('myCode').querySelector('code').textContent = code;
		Prism.highlightAll();
	}
	
}

workspace.addChangeListener(updateWork);
document.getElementById('blurFormulaRGB').style.display = 'none';
updateWork();

function editFilter(evt) {
	var el = evt.target;
	if (el.tagName != 'div'){
		el = el.parentElement;
	}
	var els = document.getElementById('filterList').querySelectorAll('div');
	for (var i=0;i<els.length;i++){
		els[i].style.removeProperty('background');
	}
	el.style.background = 'gray';
	currentFilterID = parseInt(el.getAttribute('data-type'));
	
	var wxml = Blockly.Xml.textToDom(imgData.filters[currentFilterID].workspace);
	workspace.clear();
	if (imgData.filters[currentFilterID].hslrgb == 'r'){
		var vars = ["r","g","b"];
		for (var ii=0;ii<3;ii++){
			workspace.createVariable(vars[ii],null,"qblur_"+vars[ii]);
		}
		Blockly.Xml.domToWorkspace(wxml,workspace);
		updateWork();
	}
	else {
		var vars = ["h","s","l"];
		for (var ii=0;ii<3;ii++){
			workspace.createVariable(vars[ii],null,"qblur_"+vars[ii]);
		}
		Blockly.Xml.domToWorkspace(wxml,workspace);
		updateWork();
	}
	currentFilterType = el.getAttribute('data-filter');
	setFilterOptions(0);
	
}

function addFilter() {
	var els = document.getElementById('filterList').querySelectorAll('div');
	for (var i=0;i<els.length;i++){
		els[i].style.removeProperty('background');
	}
	
	var filterType = document.getElementById('addFilter').querySelector('select').value;
	var el = document.getElementById('filterList');
	var div = document.createElement('div');
	div.addEventListener('click',editFilter);
	div.style.background = 'gray';
	var span = document.createElement('span');
	span.textContent = filters[filterType][0].name;
	div.appendChild(span);
	var input = document.createElement('input');
	input.style.display = 'none';
	div.appendChild(input);
	el.appendChild(div);
	var newFilter = {};
	newFilter.hslrgb = filters[filterType][0].hslrgb;
	newFilter.name = filters[filterType][0].name;
	newFilter.workspace = filters[filterType][0].workspace;
	imgData.filters.push(newFilter);
	currentFilterID = imgData.filters.length - 1;
	div.setAttribute('data-type',currentFilterID);
	div.setAttribute('data-filter',filterType);
	currentFilterType = filterType;
	setFilterOptions(0);
	
	var wxml = Blockly.Xml.textToDom(filters[filterType][0].workspace);
	workspace.clear();
	if (filters[filterType][0].hslrgb == 'r'){
		var vars = ["r","g","b"];
		for (var ii=0;ii<3;ii++){
			workspace.createVariable(vars[ii],null,"qblur_"+vars[ii]);
		}
		Blockly.Xml.domToWorkspace(wxml,workspace);
		updateWork();
	}
	else {
		var vars = ["h","s","l"];
		for (var ii=0;ii<3;ii++){
			workspace.createVariable(vars[ii],null,"qblur_"+vars[ii]);
		}
		Blockly.Xml.domToWorkspace(wxml,workspace);
		updateWork();
	}
	
	updateImage();
}
document.getElementById('addFilter').querySelector('button').addEventListener('click',addFilter);

dragula([document.getElementById('filterList')])
  .on('drag', function (el) {
    //el.className = el.className.replace('ex-moved', '');
  }).on('drop', function (el) {
    //el.className += ' ex-moved';
  }).on('over', function (el, container) {
    //container.className += ' ex-over';
  }).on('out', function (el, container) {
    //container.className = container.className.replace('ex-over', '');
  });





