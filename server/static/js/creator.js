

function saveFormula(category="overlay") {
	var wxml;
	var hslrgb = 'hsl';
	if (typeof blurOrText === 'undefined' || blurOrText == 'blur'){
		if (typeof workspaceB === 'undefined'){
			wxml = Blockly.Xml.workspaceToDom(workspace);
		}
		else if (imgData.blurType == 'hsl'){
			wxml = Blockly.Xml.workspaceToDom(workspaceB);
		}
		else{
			wxml = Blockly.Xml.workspaceToDom(workspaceBRGB);
			hslrgb = 'rgb';
		}
	}
	else {
		if (imgData.blurType == 'hsl'){
			wxml = Blockly.Xml.workspaceToDom(workspaceT);
		}
		else{
			wxml = Blockly.Xml.workspaceToDom(workspaceTRGB);
			hslrgb = 'rgb';
		}
	}
	
	var outspace = Blockly.Xml.domToText(wxml);
	var name = document.getElementById('formulaName').value;
	var jsonmessage = {'type':'saveFormula','name':name,'message':outspace,'hslrgb':hslrgb,'category':category};
	if (category == 'filter'){
		currentFilterType = document.getElementById('filterGroup').value;
		if (!filters[currentFilterType]){
			filters[currentFilterType] = [];
			//add group to filterlist dropdown
			var el = document.getElementById('addFilter').querySelector('select');
			var option = document.createElement('option');
			option.value = currentFilterType;
			option.textContent = currentFilterType;
			el.appendChild(option);
		}
		
		jsonmessage.group = currentFilterType;
		var foundMatch = false;
		for (var i=0;i<filters[currentFilterType].length;i++){
			if (filters[currentFilterType][i].name == name){
				filters[currentFilterType][i].workspace = outspace;
				if (hslrgb == 'rgb'){
					filters[currentFilterType][i].hslrgb = 'r';
				}
				else {
					filters[currentFilterType][i].hslrgb = 'h';
				}
				filters[currentFilterType][i].hslrgb = hslrgb;
				foundMatch = true;
				break;
			}
		}
		
		
		if (!foundMatch){
			var idx = filters[currentFilterType].length;
			filters[currentFilterType].push({});
			filters[currentFilterType][idx].name = name;
			filters[currentFilterType][idx].workspace = outspace;
			if (hslrgb == 'rgb'){
				filters[currentFilterType][idx].hslrgb = 'r';
			}
			else {
				filters[currentFilterType][idx].hslrgb = 'h';
			}
			filters[currentFilterType][idx].hslrgb = hslrgb;
		}
		var els = document.getElementById('filterList').querySelectorAll('div');
		els[currentFilterID].setAttribute('data-filter',currentFilterType);
		els[currentFilterID].textContent = name;
		
	}
	else {
		var foundMatch = false;
		for (var i=0;i<formulas.length;i++){
			if (formulas[i].name == name){
				formulas[i].workspace = outspace;
				foundMatch = true;
				break;
			}
		}
		
		
		if (!foundMatch){
			var idx = formulas.length;
			formulas.push({});
			formulas[idx].name = name;
			formulas[idx].workspace = outspace;
			formulas[idx].id = idx;
			formulas[idx].hslrgb = hslrgb;
		}
	}
	ws.send(JSON.stringify(jsonmessage));
	saveTippy[0].hide();
	//add formula/filter to dropdown
}

function saveCreation() {
	var name = document.getElementById('creationName').value;
	var jsonmessage = {'type':'saveCreation','name':name,'imgData':imgData};
	if (name == overwriteName){
		jsonmessage.overwrite = true;
	}
	ws.send(JSON.stringify(jsonmessage));
	creationTippy[0].hide();
}

