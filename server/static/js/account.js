var ws = new WebSocket('wss://qblur.com:8080');
ws.onopen = function(evt) {
	var jsonmessage = {'type':'accountKey'};
	jsonmessage.message = tkey;
	ws.send(JSON.stringify(jsonmessage));
}
ws.onmessage = function(evt){
	var dm = JSON.parse(evt.data);
	if (dm.type == 'newFormulas'){
		var formulas = dm.formulas;
		console.log(formulas);
		var el = document.getElementById(dm.formulaType+'Formulas');
		el.innerHTML = '';
		if (dm.formulaType == 'filter'){
			for (group in formulas){
				for (i in formulas[group]) {
					var label = document.createElement('label');
					label.classList.add('formulaLabel');
					label.setAttribute('for',dm.formulaType+'-'+ formulas[group][i].id);
					label.textContent = formulas[group][i].name;
					el.appendChild(label);
					var div = document.createElement('div');
					div.classList.add('formulaCode');
					var div2 = document.createElement('div');
					div2.innerHTML = '<i class="fas fa-trash"></i>';
					div2.innerHTML += '<i class="fas fa-edit"></i>';
					var icon = document.createElement('i');
					icon.classList.add('fas');
					icon.classList.add('fa-copy');
					icon.setAttribute('onclick',"copyFormula('"+ formulas[group][i].name +"','"+dm.formulaType+"','"+group+"')");
					div2.appendChild(icon);
					div.appendChild(div2);
					var pre = document.createElement('pre');
					pre.classList.add('language-lua');
					var code = document.createElement('code');
					code.classList.add('language-lua');
					code.textContent = formulas[group][i].code;
					pre.appendChild(code);
					div.appendChild(pre)
					el.appendChild(div);
			
				}
			}
		}
		else {
			for (i in formulas) {
				var label = document.createElement('label');
				label.classList.add('formulaLabel');
				label.setAttribute('for',dm.formulaType+'-'+ formulas[i].id);
				label.textContent = formulas[i].name;
				el.appendChild(label);
				var div = document.createElement('div');
				div.classList.add('formulaCode');
				var div2 = document.createElement('div');
				div2.innerHTML = '<i class="fas fa-trash"></i>';
				div2.innerHTML += '<i class="fas fa-edit"></i>';
				var icon = document.createElement('i');
				icon.classList.add('fas');
				icon.classList.add('fa-copy');
				icon.setAttribute('onclick',"copyFormula('"+ formulas[i].name +"','"+dm.formulaType+"')");
				div2.appendChild(icon);
				div.appendChild(div2);
				var pre = document.createElement('pre');
				pre.classList.add('language-lua');
				var code = document.createElement('code');
				code.classList.add('language-lua');
				code.textContent = formulas[i].code;
				pre.appendChild(code);
				div.appendChild(pre)
				el.appendChild(div);
			
			}
		
		}
		
		Prism.highlightAll();
	}
	else if (dm.type == 'renamedCreation'){
		var els = document.querySelector('.content-13 .content').querySelectorAll('div.filter');
		for (var i=0;i<els.length;i++){
			if (els[i].querySelector('a').textContent == dm.old){
				els[i].querySelector('a').textContent = dm.new;
				break;
			}
		}
	}
	else if (dm.type == 'renamedImage'){
		var els = document.getElementById('imageList').querySelectorAll('div');
		for (var i=0;i<els.length;i++){
			if (els[i].querySelector('a').textContent == dm.old){
				els[i].querySelector('a').textContent = dm.new;
				break;
			}
		}

	}
	else if (dm.type == 'duplicate name'){
		alert('Name taken');
	}
	else if (dm.type == 'reloadPage'){
		location.reload();
	}
	else if (dm.type == 'settingsUpdated'){
		location.reload();
	}
	else if (dm.type == 'imageSaved'){
		location.reload();
		
	}
	else if (dm.operation == 'image'){
		/*var el = document.getElementById("friendList");
		var ell = document.createElement("div");
		ell.textContent = dm.message;
		el.appendChild(ell);*/
		console.log(dm);
	}
}

function copyFormula(name,formulaType,group){
	var jsonmessage = {'type':'copyFormula'};
	jsonmessage.message = name;
	jsonmessage.formulaType = formulaType;
	if (formulaType == 'filter'){
		jsonmessage.group = group;
	}
	ws.send(JSON.stringify(jsonmessage));
}
function newFriend() {

	jsonmessage = {'type':'newFriend','message':document.getElementById('friendName').value};
	ws.send(JSON.stringify(jsonmessage));

}

		

document.querySelector('.content-31').addEventListener('drop', handleDrop, false);
var names = ['dragenter', 'dragover', 'dragleave', 'drop'];
names.forEach(eventName => {
  document.querySelector('.content-31').addEventListener(eventName, preventDefaults, false)
})

function preventDefaults(e) {
	e.preventDefault();
    e.stopPropagation();
}
function handleDrop(e) {
  
  let dt = e.dataTransfer;
  let files = dt.files;
  //document.getElementById('dropArea').style.display = 'none';
  var ffile = files[0];
	sendImage(ffile);
	document.getElementById('imgSrc').style.display = 'none';
	document.getElementById('imgUrl').style.display = 'none';
	document.getElementById('imgDrag').style.display = 'inline-block';
	document.getElementById('imgDrag').textContent = "Image Uploaded";
	document.getElementById('imgType').value = 'drag';
}




function chgImgType(evt){
	var imgType = evt.target.value;
	if (imgType == 'upload'){
		document.getElementById('imgSrc').style.display = 'inline-block';
		document.getElementById('imgUrl').style.display = 'none';
		document.getElementById('imgDrag').style.display = 'none';
	}
	else if (imgType == 'url'){
		document.getElementById('imgSrc').style.display = 'none';
		document.getElementById('imgUrl').style.display = 'inline-block';
		document.getElementById('imgDrag').style.display = 'none';
	}
	else if (imgType == 'drag'){
		document.getElementById('imgSrc').style.display = 'none';
		document.getElementById('imgUrl').style.display = 'none';
		document.getElementById('imgDrag').style.display = 'inline-block';
		document.getElementById('imgDrag').textContent = "";
	}
}


function chgImgUrl(evt) {
	var url = evt.target.value;
	var jsonmessage = {'type':'download','url':url};
	console.log(jsonmessage);
	ws.send(JSON.stringify(jsonmessage));
}


function sendImage(img) {
	var readerF = new FileReader();
	readerF.onload = function() {

		ws.send(this.result);
	}
	
	readerF.readAsArrayBuffer(img);
}

function deleteCreation(name,id) {
	jsonmessage = {'type':'deleteCreation','message':name};
	ws.send(JSON.stringify(jsonmessage));
	document.getElementById('creation-'+id).style.display = 'none';
}
function renameCreation(name,id) {
	var el = document.getElementById('creation-'+id);
	var newname = el.querySelector("input[name='creationName']").value;
	jsonmessage = {'type':'renameCreation','old':name,'new':newname};
	ws.send(JSON.stringify(jsonmessage));
	//el.querySelector('a').textContent = newname;
	const button = el.querySelector('.fa-edit');
	button._tippy.hide();
}

function deleteImage(name,id) {
	jsonmessage = {'type':'deleteImage','message':name};
	ws.send(JSON.stringify(jsonmessage));
	document.getElementById(id).style.display = 'none';
}
function renameImage(name,id) {
	var el = document.getElementById(id);
	var newname = el.querySelector("input[name='imageName']").value;
	jsonmessage = {'type':'renameImage','old':name,'new':newname};
	ws.send(JSON.stringify(jsonmessage));
	//el.querySelector('a').textContent = newname;
	const button = el.querySelector('.fa-edit');
	button._tippy.hide();
}
function setListeners() {
	document.getElementById('imgSrc').addEventListener('change', function(inp) {

		var ffile = this.files[0];
	
		sendImage(ffile);

	}, false);
	document.getElementById('imgType').addEventListener('change', chgImgType);
	document.getElementById('imgUrl').addEventListener('change', chgImgUrl);
	document.getElementById('imgSrc').style.display = 'inline-block';
	document.getElementById('imgUrl').style.display = 'none';
	document.getElementById('imgDrag').style.display = 'none';
}

/*
function chgLanguage(event){
	lang = event.target.value;
	var workEl = event.target.parentElement.parentElement.querySelector('input.workspace');
	var el = event.target.parentElement.parentElement.querySelector('pre');
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
	// add actually change the code
	
	
	var els = document.querySelectorAll('.langOption');
	for ( var i=0;i<els.length;i++){
		els[i].value = ;
	}
	
}
var els = document.querySelectorAll('.langOption');
for ( var i=0;i<els.length;i++){
	els[i].addEventListener('change',chgLanguage);
}*/

