var ws = new WebSocket('wss://matherrors.com:8080');
ws.onopen = function(evt) {
	
	var jsonmessage = {'fontSize':'40'};
	ws.send(JSON.stringify(jsonmessage));
	console.log(jsonmessage);
	
}
ws.onmessage = function(evt){

}