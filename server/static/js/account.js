var ws = new WebSocket('wss://qblur.com:8080');
ws.onopen = function(evt) {
	var jsonmessage = {'type':'key'};
	jsonmessage.message = tkey;
	ws.send(JSON.stringify(jsonmessage));
}
ws.onmessage = function(evt){
	var dm = JSON.parse(evt.data);
	if (dm.type == 'newFormulas'){
		var formulas = dm.formulas;
		console.log(formulas);
		var el = document.getElementById('formulas');
		el.innerHTML = '<input type="radio" name="formula" style="display: none;" id="formula--1" checked="checked"></input>';
		
		for (i in formulas) {
			var input = document.createElement('input');
			input.setAttribute('type','radio');
			input.setAttribute('name','formula');
			input.setAttribute('style','display: none;');
			input.id = 'formula-'+ formulas[i].id;
			el.appendChild(input);
		}
		el.innerHTML += '<label for="formula--1"></label>';
		
		for (i in formulas) {
			var label = document.createElement('label');
			label.classList.add('formulaLabel');
			label.setAttribute('for','formula-'+ formulas[i].id);
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
			icon.setAttribute('onclick',"copyFormula('"+ formulas[i].name +"')");
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
		Prism.highlightAll();
	}
}

function copyFormula(name){
	var jsonmessage = {'type':'copyFormula'};
	jsonmessage.message = name;
	ws.send(JSON.stringify(jsonmessage));
}
function newFriend() {

	jsonmessage = {'type':'newFriend','message':document.getElementById('friendName').value};
	ws.send(JSON.stringify(jsonmessage));

}

ws = new WebSocket('wss://qblur.com:8080');
ws.onopen = function(evt) {
	var jsonmessage = {'type':'accountKey'};
	jsonmessage.message = tkey;
	ws.send(JSON.stringify(jsonmessage));
	
}
ws.onmessage = function(evt){
	//Add friend
	var dm = JSON.parse(evt.data);
	if (dm.operation == 'friend'){
		var el = document.getElementById("friendList");
		var ell = document.createElement("div");
		ell.textContent = dm.message;
		el.appendChild(ell);
	}
	else if (dm.operation == 'image'){
		/*var el = document.getElementById("friendList");
		var ell = document.createElement("div");
		ell.textContent = dm.message;
		el.appendChild(ell);*/
		console.log(dm);
	}
}
		

document.querySelector('.content-31 .content').addEventListener('drop', handleDrop, false);
var names = ['dragenter', 'dragover', 'dragleave', 'drop'];
names.forEach(eventName => {
  document.querySelector('.content-31 .content').addEventListener(eventName, preventDefaults, false)
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


document.getElementById('imgSrc').addEventListener('change', function(inp) {
	
	//document.getElementById('dropArea').style.display = 'none';
	var ffile = this.files[0];
	
	sendImage(ffile);
	/*
	syncWorker.postMessage(ffile);
	syncWorker.onmessage = function(e) {
		//ctypestr = toTable(e.data.result,e.data.ctypestr);
		
		//if (filen != ""){createConfirmForm();}
		document.getElementById('dataTableModified').innerHTML = '';
		setTimeout(fullCompression,10,ffile);
	};*/
	
	

}, false);

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
document.getElementById('imgType').addEventListener('change', chgImgType);

function chgImgUrl(evt) {
	var url = evt.target.value;
	var jsonmessage = {'type':'download','url':url};
	console.log(jsonmessage);
	ws.send(JSON.stringify(jsonmessage));
}

document.getElementById('imgUrl').addEventListener('change', chgImgUrl);
function sendImage(img) {
	var readerF = new FileReader();
	readerF.onload = function() {

		ws.send(this.result);
	}
	
	readerF.readAsArrayBuffer(img);
}


document.getElementById('imgSrc').style.display = 'inline-block';
document.getElementById('imgUrl').style.display = 'none';
document.getElementById('imgDrag').style.display = 'none';