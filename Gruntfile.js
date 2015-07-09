
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        watch: {
            scripts: {
                files: ['javascript/src/*.js', 'javascript/thirdparty/tinymce_ssfebuttons/*.js'],
                tasks: ['default'],
                options: {
                    spawn: false
                }
            }
        },
        // Import package manifest
        pkg: grunt.file.readJSON("package.json"),
        // Banner definitions
        meta: {
            banner: "/*\n" +
                    " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
                    " *  <%= pkg.description %>\n" +
                    " *  <%= pkg.homepage %>\n" +
                    " *\n" +
                    " *  Made by <%= pkg.author %>\n" +
                    " *  Under <%= pkg.license %> License\n" +
                    " *\n" +
                    " */\n\n"
        },
        // Concat definitions
        concat: {
            dist: {
                files: {
                    'javascript/dist/FrontEndAdmin.js': ['javascript/src/FrontEndAdmin.js'],
                    'javascript/dist/FrontEndEditor.js': ['javascript/src/FrontEndEditor.js'],
                    'javascript/dist/FrontEndEditorToolbar.js': ['javascript/src/FrontEndEditorToolbar.js'],
                    'javascript/dist/tinymce_ssfebuttons.js': ['javascript/src/tinymce_ssfebuttons.js']
                }
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        },
        // Lint definitions
        jshint: {
            src: [
                "javascript/src/FrontEndAdmin.js",
                "javascript/src/FrontEndEditor.js",
                "javascript/src/FrontEndEditorToolbar.js",
                "javascript/src/tinymce_ssfebuttons.js"
            ],
            options: {
                jshintrc: ".jshintrc"
            }
        },
        // Minify definitions
        uglify: {
            my_target: {
                files: {
                    'javascript/dist/FrontEndAdmin.min.js': ['javascript/dist/FrontEndAdmin.js'],
                    'javascript/dist/FrontEndEditor.min.js': ['javascript/dist/FrontEndEditor.js'],
                    'javascript/dist/FrontEndEditorToolbar.min.js': ['javascript/dist/FrontEndEditorToolbar.js'],
                    'javascript/dist/tinymce_ssfebuttons.min.js': ['javascript/src/tinymce_ssfebuttons.js']
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
