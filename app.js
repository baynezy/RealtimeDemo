var express = require("express"),
	mustacheExpress = require("mustache-express"),
	dataChannel = require("./custom_modules/data-channel"),
	eventStorage = require("./custom_modules/event-storage"),
	app = express();
	
app.use(express.static("./static"));

app.get("/api/updates", function(req, res){
	initialiseSSE(req, res);
	
	if (typeof(req.headers["last-event-id"]) != "undefined") {
		replaySSEs(req, res);
	}
});

function initialiseSSE(req, res) {
	dataChannel.subscribe(function(channel, message){
		var json = JSON.parse(message);
		var messageEvent = new ServerEvent(json.timestamp);
		messageEvent.addData(json.update);
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

function replaySSEs(req, res) {
	var lastId = req.headers["last-event-id"];
	
	eventStorage.findEventsSince(lastId).then(function(docs) {
		for (var index = 0; index < docs.length; index++) {
			var doc = docs[index];
			var messageEvent = new ServerEvent(doc.timestamp);
			messageEvent.addData(doc.update);
			outputSSE(req, res, messageEvent.payload());
		}
	}, errorHandling);
};

function errorHandling(err) {
	throw err;
}

function outputSSE(req, res, data) {
	res.write(data);
}

function ServerEvent(name) {
	this.name = name || "";
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
	if (this.name != "") {
		payload += "id: " + this.name + "\n";
	}
	
	payload += this.data;
	return payload + "\n";
}


var server = app.listen(8081, function() {
	
});