var express = require("express"),
	mustacheExpress = require("mustache-express"),
	dataChannel = require("./custom_modules/data-channel"),
	bodyParser = require("body-parser"),
	app = express();
	
app.engine('html', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'html');
app.use(express.static("./static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/api/updates", function(req, res){
	initialiseSSE(req, res);
});

app.get("/api/post-update", function(req, res) {
	res.render("postupdate", {});
});

app.put("/api/post-update", function(req, res) {
	var json = JSON.stringify(req.body);
	dataChannel.publish(json);
	res.status(204).end();
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