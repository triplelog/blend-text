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
imgData.font = document.getElementById('font').value;
imgData.locY = parseInt(document.getElementById('locY').querySelector('select').value);
imgData.locY += parseInt(document.getElementById('locY').querySelector('input').value);
imgData.locX = parseInt(document.getElementById('locX').querySelector('select').value);
imgData.locX += parseInt(document.getElementById('locX').querySelector('input').value);
imgData.blurRadius = document.getElementById('blurRadius').value;
imgData.blurColor = parseInt(document.getElementById('blurColor').querySelector('select').value);
imgData.blurColor += parseInt(document.getElementById('blurColor').querySelector('input').value);
imgData.textColor = parseInt(document.getElementById('textColor').querySelector('select').value);
imgData.textColor += parseInt(document.getElementById('textColor').querySelector('input').value);

function updateImage(evt){
	var el = evt.target;
	if (el.id){
		imgData[el.id] = el.value;
	}
	else {
		if (el.parentElement.id == 'locY' || el.parentElement.id == 'locX' || el.parentElement.id == 'blurColor' || el.parentElement.id == 'textColor'){
			var id = el.parentElement.id;
			imgData[id] = parseInt(document.getElementById(id).querySelector('select').value);
			imgData[id] += parseInt(document.getElementById(id).querySelector('input').value);
		}
	}
	//check imgData is valid?

	if (myTimeout){
		clearTimeout(myTimeout);
		myTimeout = setTimeout(function(){ ws.send(JSON.stringify(imgData)); }, 500);
	}
	else {
		myTimeout = setTimeout(function(){ ws.send(JSON.stringify(imgData)); }, 200);
	}
	
	
}
var singleEls = ['text','font','fontSize','blurRadius'];
for (var i=0;i<4;i++){
	var el = document.getElementById(singleEls[i]);
	el.addEventListener('change',updateImage);
}
var doubleEls = ['locY','locX','blurColor','textColor'];
for (var i=0;i<4;i++){
	var el = document.getElementById(doubleEls[i]);
	el.querySelector('select').addEventListener('change',updateImage);
	el.querySelector('input').addEventListener('change',updateImage);
}
