var Q = require("q"),
	config = require("./config"),
	mongo = require("mongojs"),
	db = mongo("mongodb://mongo/" + config.mongoDatabase),
	collection = db.collection(config.mongoScoresCollection);
	
module.exports.save = function(data) {
	var deferred = Q.defer();
	collection.save(data, function(err, doc){
		if(err) {
			deferred.reject(err);
		}
		else {
			deferred.resolve(doc);
		}
	});
		
	return deferred.promise;
};

module.exports.findEventsSince = function(lastEventId) {
	var deferred = Q.defer();
	
	collection.find({
		timestamp: {$gt: Number(lastEventId)}
	})
	.sort({timestamp: 1}, function(err, docs) {
		if (err) {
			deferred.reject(err);
		}
		else {
			deferred.resolve(docs);
		}
	});
	
	return deferred.promise;
};