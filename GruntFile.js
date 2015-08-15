module.exports = function(grunt) {
	grunt.initConfig({
		prompt: {
			config: {
				options: {
					questions: [
						{
							config: "config.redisChannel",
							type: "input",
							message: "What is the Redis channel name for live updates?",
							default: "liveupdates",
							validate: function(value) {
								if (value.trim().length > 0) return true;
								
								return "You must enter a Redis channel name!";
							}
						}
					]
				}
			},
		},
	});
	
	grunt.loadNpmTasks('grunt-prompt');
	
	grunt.registerTask("config", "Create config file", function() {
		var contents =	'var config = {\n' +
					'	redisChannel : "' + grunt.config("config.redisChannel") + '"\n' +
					'};\n\n' +
					'module.exports = config;';
		
		var path = "custom_modules/config.js";
		
		grunt.file.write(path, contents);
					
		grunt.log.write("Config file generated").ok();
	});
	
	grunt.registerTask("default", [
		"prompt:config",
		"config"
	]);
}