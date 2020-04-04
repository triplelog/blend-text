var ws = new WebSocket('wss://matherrors.com:8080');
ws.onopen = function(evt) {
	var jsonmessage = {'type':'key'};
	jsonmessage.message = tkey;
	ws.send(JSON.stringify(jsonmessage));
}
ws.onmessage = function(evt){
	var dm = JSON.parse(evt.data);
	if (dm.type == 'newFormulas'){
		var formulas = dm.message;
		console.log(formulas);
		var el = document.getElementById('formulas');
		el.innerHTML = '<input type="radio" name="formula" style="display: none;" id="formula--1" checked="checked"></input>';
		
		for (i in formulas) {
			el.innerHTML += '<input type="radio" name="formula" style="display: none;" id="formula-"'+ formulas[i].id+'"></input>';
		}
		el.innerHTML += '<label for="formula--1"></label>';
		
		for (i in formulas) {
			el.innerHTML += '<label class="formulaLabel" for="formula-'+ formulas[i].id +'">'+ formulas[i].name +'</label>';
			el.innerHTML += '<div class="formulaCode">';
				el.innerHTML += '<div>';
					el.innerHTML += '<i class="fas fa-trash"></i>';
					el.innerHTML += '<i class="fas fa-edit"></i>';
					el.innerHTML += '<i class="fas fa-copy" onclick="copyFormula(\''+ formulas[i].name +'\')"></i>';
				el.innerHTML += '</div>';
				el.innerHTML += '<pre class="language-python"><code class="language-python">'+ formulas[i].code +'</code></pre>';
				
			el.innerHTML += '</div>';
		}
	}
}

function copyFormula(name){
	var jsonmessage = {'type':'copyFormula'};
	jsonmessage.message = name;
	ws.send(JSON.stringify(jsonmessage));
}