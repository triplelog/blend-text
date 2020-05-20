

function saveFormula(category="image") {
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
	ws.send(JSON.stringify(jsonmessage));
}

function saveCreation() {
	//Save image
	//Save formula(s) -- should be part of imgData actually
	console.log('saved creation');
	var jsonmessage = {'type':'saveCreation','name':'First Creation','imgData':imgData};
	ws.send(JSON.stringify(jsonmessage));
}