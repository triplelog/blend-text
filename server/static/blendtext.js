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
imgData.text = "";
imgData.fontSize = "";
function updateImage(evt){
	var el = evt.target;
	imgData[el.id] = el.value;
	ws.send(JSON.stringify(imgData));
}
var textEl = document.getElementById('text');
textEl.addEventListener('change',updateImage);