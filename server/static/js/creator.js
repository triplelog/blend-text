

function saveFormula(category="overlay") {
	var wxml;
	var formulaType = 'hsl';
	if (typeof blurOrText === 'undefined' || blurOrText == 'blur'){
		if (typeof workspaceB === 'undefined'){
			wxml = Blockly.Xml.workspaceToDom(workspace);
		}
		else if (imgData.blurType == 'hsl'){
			wxml = Blockly.Xml.workspaceToDom(workspaceB);
		}
		else{
			wxml = Blockly.Xml.workspaceToDom(workspaceBRGB);
			formulaType = 'rgb';
		}
	}
	else {
		if (imgData.blurType == 'hsl'){
			wxml = Blockly.Xml.workspaceToDom(workspaceT);
		}
		else{
			wxml = Blockly.Xml.workspaceToDom(workspaceTRGB);
			formulaType = 'rgb';
		}
	}
	
	var outspace = Blockly.Xml.domToText(wxml);
	var name = document.getElementById('formulaName').value;
	var jsonmessage = {'type':'saveFormula','name':name,'message':outspace,'formulaType':formulaType,'category':category};
	if (category == 'filter'){
		currentFilterType = document.getElementById('filterGroup').value;
		if (!filters[currentFilterType]){
			filters[currentFilterType] = [];
		}
		
		jsonmessage.group = currentFilterType;
		var foundMatch = false;
		for (var i=0;i<filters[currentFilterType].length;i++){
			if (filters[currentFilterType][i].name == name){
				filters[currentFilterType][i].workspace = outspace;
				if (formulaType == 'rgb'){
					filters[currentFilterType][i].hslrgb = 'r';
				}
				else {
					filters[currentFilterType][i].hslrgb = 'h';
				}
				foundMatch = true;
				break;
			}
		}
		var idx = filters[currentFilterType].length;
		filters[currentFilterType].push({});
		if (!foundMatch){
			filters[currentFilterType][idx].name == name;
			filters[currentFilterType][idx].workspace = outspace;
				if (formulaType == 'rgb'){
					filters[currentFilterType][idx].hslrgb = 'r';
				}
				else {
					filters[currentFilterType][idx].hslrgb = 'h';
				}
		}
		var els = document.getElementById('filterList').querySelectorAll('div');
		els[currentFilterID].setAttribute('data-filter',currentFilterType);
		
	}
	ws.send(JSON.stringify(jsonmessage));
	saveTippy[0].hide();
	//add formula/filter to dropdown
}

function saveCreation() {
	//Save image
	//Save formula(s) -- should be part of imgData actually
	console.log('saved creation');
	var jsonmessage = {'type':'saveCreation','name':'First Creation','imgData':imgData};
	ws.send(JSON.stringify(jsonmessage));
}