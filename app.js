var express = require("express"),
	mustacheExpress = require("mustache-express"),
	dataChannel = require("./custom_modules/data-channel"),
	app = express();
	
app.use(express.static("./static"));

app.get("/api/updates", function(req, res){
	initialiseSSE(req, res);
});

function initialiseSSE(req, res) {
	dataChannel.subscribe(function(channel, message){
		var messageEvent = new ServerEvent();
		messageEvent.addData(message);
		outputSSE(req, res, messageEvent.payload());
	});
	
	res.set({
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive",
		"Access-Control-Allow-Origin": "*"
	});
		
	res.write("retry: 10000\n\n");
}

function outputSSE(req, res, data) {
	res.write(data);
}

function ServerEvent() {
	this.data = "";
};

ServerEvent.prototype.addData = function(data) {
	var lines = data.split(/\n/);
	
	for (var i = 0; i < lines.length; i++) {
		var element = lines[i];
		this.data += "data:" + element + "\n";
	}
}

ServerEvent.prototype.payload = function() {
	var payload = "";
	
	payload += this.data;
	return payload + "\n";
}


var server = app.listen(8081, function() {
	
});