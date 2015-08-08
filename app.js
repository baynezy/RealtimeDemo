var express = require("express")
	app = express();


app.use(express.static("./static"));


var server = app.listen(8081, function() {
	
});