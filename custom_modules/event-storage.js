var Q = require("q"),
	config = require("./config"),
	mongo = require("mongojs"),
	db = mongo(config.mongoDatabase),
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