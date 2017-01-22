var redis = require("redis"),
	config = require("./config");

module.exports.subscribe = function(callback) {
	var subscriber = redis.createClient(6379,"redis");
	
	subscriber.subscribe(config.redisChannel);
	
	subscriber.on("error", function(err){
		console.log("Redis error: " + err);
	});
	
	subscriber.on("message", callback);
};

module.exports.publish = function(data) {
	var publisher = redis.createClient(6379,"redis");
	
	publisher.publish(config.redisChannel, data);
};