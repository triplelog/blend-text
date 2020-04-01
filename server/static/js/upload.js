/*
var ctypestr = "";
var filen = "";
var syncWorker = new Worker('../wasm/uploadworker.js');
var syncWorker2 = new Worker('../wasm/datatypeworker.js');


document.getElementById('dropArea').addEventListener('drop', handleDrop, false);
var names = ['dragenter', 'dragover', 'dragleave', 'drop'];
names.forEach(eventName => {
  document.getElementById('dropArea').addEventListener(eventName, preventDefaults, false)
})
*/
function preventDefaults(e) {
	e.preventDefault();
    e.stopPropagation();
}
function handleDrop(e) {
  
  let dt = e.dataTransfer;
  let files = dt.files;
  //document.getElementById('dropArea').style.display = 'none';
  var ffile = files[0];
	syncWorker.postMessage(ffile);
	syncWorker.onmessage = function(e) {
		//ctypestr = toTable(e.data.result,e.data.ctypestr);
		document.getElementById('dataTableModified').innerHTML = '';
		setTimeout(fullCompression,10,ffile);
	};
}


document.querySelector('#imgSrc').addEventListener('change', function(inp) {
	
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

function sendImage(img) {
	var readerF = new FileReader();
	readerF.onload = function() {

		ws.send(this.result);
	}
	
	readerF.readAsArrayBuffer(img);
}



function fullCompression(to_compress) {
	var readerF = new FileReader();
	readerF.onload = function() {
		console.log("Compressing")
	
		var mybase64 = this.result;
		var index = mybase64.indexOf('base64,');
		var csvindex = mybase64.substring(0,index).indexOf('text/csv');
		
		if (csvindex>-1){
			mybase64 = mybase64.substring(index+7);
			var compbase64 = pako.deflate(mybase64,{to:'string'});
			dataChanged(btoa(compbase64));
		}
		else {
			var xlsindex = mybase64.substring(0,index).indexOf('excel');
			if (xlsindex>-1){
				mybase64 = mybase64.substring(index+7);
				dataChanged(mybase64,'xls');
			}
			else {
				var xlsxindex = mybase64.substring(0,index).indexOf('openxml');
				if (xlsxindex>-1) {
					mybase64 = mybase64.substring(index+7);
					dataChanged(mybase64,'xlsx');
				}
			}
		}

		

		
	}
	
	readerF.readAsDataURL(to_compress);
}


