var ws = new WebSocket('wss://matherrors.com:8080');
ws.onopen = function(evt) {
	
	var jsonmessage = {'fontSize':'30'};
	ws.send(JSON.stringify(jsonmessage));
	console.log(jsonmessage);
	
}
ws.onmessage = function(evt){
	var dm = JSON.parse(evt.data);
	var el = document.getElementById('imageHolder');
	var img = document.createElement('img');
	img.setAttribute('src',dm.src);
	el.innerHTML = '';
	el.appendChild(img);
}