
module.exports = function (grunt) {
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
        pkg: grunt.file.readJSON("composer.json"),
        // Banner definitions
        meta: {
            banner: "/*\n" +
                    " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
                    " *  <%= pkg.description %>\n" +
                    " *  <%= pkg.homepage %>\n" +
                    " *\n" +
                    " *  Made by <%= pkg.authors[0].name %>\n" +
                    " *  Under <%= pkg.license %> License\n" +
                    " */\n"
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
                    'javascript/dist/FrontEndAdminTemplate.min.js': ['javascript/dist/FrontEndAdminTemplate.js']
                }
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        },
        cssmin: {
            target: {
                files: [{
                        expand: true,
                        cwd: 'css',
                        src: ['*.css', '!*.min.css'],
                        dest: 'css',
                        ext: '.min.css'
                    }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");

    grunt.registerTask("default", ["jshint", "concat", "uglify", "cssmin"]);
    grunt.registerTask("travis", ["jshint"]);

};
