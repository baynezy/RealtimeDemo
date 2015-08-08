var redis = require("redis");

module.exports.subscribe = function(callback) {
	var subscriber = redis.createClient();
	
	subscriber.subscribe("liveupdates");
	
	subscriber.on("error", function(err){
		console.log("Redis error: " + err);
	});
	
	subscriber.on("message", callback);
};

module.exports.publish = function(data) {
	var publisher = redis.createClient();
	
	publisher.publish("liveupdates", data);
};