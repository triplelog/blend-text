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
imgData.text = "";
imgData.fontSize = "";
function updateImage(evt){
	var el = evt.target;
	imgData[el.id] = el.value;
	clearTimeout(myTimeout);
	myTimeout = setTimeout(function(){ ws.send(JSON.stringify(imgData)); }, 1000);
	
}
var textEl = document.getElementById('text');
textEl.addEventListener('change',updateImage);

var fontSizeEl = document.getElementById('fontSize');
fontSizeEl.addEventListener('change',updateImage);