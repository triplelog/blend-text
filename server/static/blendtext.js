var ws = new WebSocket('wss://matherrors.com:8080');
ws.onopen = function(evt) {
	
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
imgData.text = document.getElementById('text').value;
imgData.fontSize = document.getElementById('fontSize').value;
function updateImage(evt){
	var el = evt.target;
	imgData[el.id] = el.value;
	//check imgData is valid?

	if (myTimeout){
		clearTimeout(myTimeout);
		myTimeout = setTimeout(function(){ ws.send(JSON.stringify(imgData)); }, 500);
	}
	else {
		myTimeout = setTimeout(function(){ ws.send(JSON.stringify(imgData)); }, 200);
	}
	
	
}
var textEl = document.getElementById('text');
textEl.addEventListener('change',updateImage);

var fontSizeEl = document.getElementById('fontSize');
fontSizeEl.addEventListener('change',updateImage);