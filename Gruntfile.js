module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("frontend-admin.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.licenses[0].type %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			dist: {
                            files: {
                                'javascript/dist/FrontEndAdmin.js': ['javascript/src/FrontEndAdmin.js'],
                                'javascript/dist/FrontEndEditorToolbar.js': ['javascript/src/FrontEndEditorToolbar.js'],
                            }
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// Lint definitions
		jshint: {
                        src: ["javascript/src/FrontEndAdmin.js","javascript/src/FrontEndEditorToolbar.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
			files: {
                                'javascript/dist/FrontEndAdmin.min.js': ['javascript/dist/FrontEndAdmin.js'],
                                'javascript/dist/FrontEndEditorToolbar.min.js': ['javascript/dist/FrontEndEditorToolbar.js'],
                            }
                        },
			options: {
				banner: "<%= meta.banner %>"
			}
		},

//		 CoffeeScript compilation
//		coffee: {
//			compile: {
//				files: {
//					"javascript/dist/FrontEndAdmin.js": "javascript/src/FrontEndAdmin.coffee"
//				}
//			}
//		}

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
//	grunt.loadNpmTasks("grunt-contrib-coffee");

	grunt.registerTask("default", ["jshint", "concat", "uglify"]);
	grunt.registerTask("travis", ["jshint"]);

};
