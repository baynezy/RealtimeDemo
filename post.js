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

app.get("/api/post-update", function(req, res) {
	res.render("postupdate", {});
});

app.put("/api/post-update", function(req, res) {
	var json = JSON.stringify(req.body);
	dataChannel.publish(json);
	res.status(204).end();
});

var server = app.listen(8082, function() {
	
});