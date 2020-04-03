var ws = new WebSocket('wss://matherrors.com:8080');
ws.onopen = function(evt) {
	var jsonmessage = {'type':'key'};
	jsonmessage.message = tkey;
	ws.send(JSON.stringify(jsonmessage));
}
ws.onmessage = function(evt){
	var dm = JSON.parse(evt.data);

}

function copyFormula(id){
	console.log(id);
	var jsonmessage = {'type':'copyFormula'};
	jsonmessage.message = id;
	ws.send(JSON.stringify(jsonmessage));
}