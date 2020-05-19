function saveFormula(category="image") {
	var wxml;
	var formulaType = 'hsl';
	if (blurOrText == 'blur'){
		if (imgData.blurType == 'hsl'){
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
	var jsonmessage = {'type':'saveFormula','name':'First Formula','message':outspace,'formulaType':formulaType,'category':category};
	ws.send(JSON.stringify(jsonmessage));
}

function saveCreation() {
	//Save image
	//Save formula(s) -- should be part of imgData actually
	var jsonmessage = {'type':'saveCreation','name':'First Creation','imgData':imgData};
	ws.send(JSON.stringify(jsonmessage));
}