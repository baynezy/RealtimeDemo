var express = require("express"),
	mustacheExpress = require("mustache-express"),
	dataChannel = require("./custom_modules/data-channel"),
	eventStorage = require("./custom_modules/event-storage"),
	bodyParser = require("body-parser"),
	app = express();
	
app.engine('html', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'html');
app.use(express.static("./static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/api/post-update", function(req, res) {
	res.render("postupdate", {});
});

app.put("/api/post-update", function(req, res) {
	var json = req.body;
	json.timestamp = Date.now();
	
	eventStorage.save(json).then(function(doc) {
		dataChannel.publish(JSON.stringify(json));
	}, errorHandling);
	
	res.status(204).end();
});

function errorHandling(err) {
	throw err;
}

var server = app.listen(8082, function() {
	
});