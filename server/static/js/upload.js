/*
var ctypestr = "";
var filen = "";
var syncWorker = new Worker('../wasm/uploadworker.js');
var syncWorker2 = new Worker('../wasm/datatypeworker.js');
*/

document.querySelector('.content-11 .content').addEventListener('drop', handleDrop, false);
var names = ['dragenter', 'dragover', 'dragleave', 'drop'];
names.forEach(eventName => {
  document.querySelector('.content-11 .content').addEventListener(eventName, preventDefaults, false)
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
	document.getElementById('imgSaved').style.display = 'none';
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
		document.getElementById('imgSaved').style.display = 'none';
	}
	else if (imgType == 'url'){
		document.getElementById('imgSrc').style.display = 'none';
		document.getElementById('imgUrl').style.display = 'inline-block';
		document.getElementById('imgDrag').style.display = 'none';
		document.getElementById('imgSaved').style.display = 'none';
	}
	else if (imgType == 'drag'){
		document.getElementById('imgSrc').style.display = 'none';
		document.getElementById('imgUrl').style.display = 'none';
		document.getElementById('imgDrag').style.display = 'inline-block';
		document.getElementById('imgDrag').textContent = "";
		document.getElementById('imgSaved').style.display = 'none';
	}
	else if (imgType == 'saved'){
		document.getElementById('imgSrc').style.display = 'none';
		document.getElementById('imgUrl').style.display = 'none';
		document.getElementById('imgDrag').style.display = 'none';
		document.getElementById('imgSaved').style.display = 'inline-block';
	}
}
document.getElementById('imgType').addEventListener('change', chgImgType);

function chgImgUrl(evt) {
	var url = evt.target.value;
	var jsonmessage = {'type':'download','url':url};
	console.log(jsonmessage);
	ws.send(JSON.stringify(jsonmessage));
}

function savedImgUrl(evt) {
	
	if (evt.type && evt.type == 'url'){
		console.log(realSrc);
		if (realSrc != ''){
			var jsonmessage = {'type':'savedImage','url':realSrc};
			console.log(jsonmessage);
			ws.send(JSON.stringify(jsonmessage));
		}
		else {
			var el = document.getElementById('imageHolder');
			el.innerHTML = '';
		}
	}
	else {
		var name = document.getElementById('imgSaved').value;
		if (name != ''){
			var jsonmessage = {'type':'savedImage','name':name};
			console.log(jsonmessage);
			ws.send(JSON.stringify(jsonmessage));
			document.getElementById('imgType').value = 'saved';
			document.getElementById('imgSrc').style.display = 'none';
			document.getElementById('imgUrl').style.display = 'none';
			document.getElementById('imgDrag').style.display = 'none';
			document.getElementById('imgSaved').style.display = 'inline-block';
		}
	}
	
	
}
if (loadSaved){savedImgUrl({'type':'url'});}
document.getElementById('imgUrl').addEventListener('change', chgImgUrl);
document.getElementById('imgSaved').addEventListener('awesomplete-selectcomplete',savedImgUrl);

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
document.getElementById('imgSaved').style.display = 'none';



