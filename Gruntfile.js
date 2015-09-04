/* eslint-env node */
module.exports = function(grunt) {
    "use strict";

    var lintFiles = [
        "*.js",
        "cli/*.js",
        "lib/**/*.js",
        "test/*.js"
    ];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        eslint: {
            console: {
                src: lintFiles
            },
            build: {
                options: {
                    "output-file": "eslint.xml",
                    "format": "jslint-xml",
                    "silent": true
                },
                src: lintFiles
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: "tap",
                    captureFile: "test/mocha.tap"
                },
                src: [
                    "test/*.js"
                ]
            }
        },
        karma: {
            options: {
                singleRun: true,
                colors: true,
                configFile: "./karma.config.js",
                preprocessors: {
                    "./src/*.js": ["coverage"]
                },
                basePath: "./",
                files: [
                    "lib/mocha/mocha.css",
                    "lib/mocha/mocha.js",
                    "lib/node-assert/assert.js",
                    "lib/assertive-chai/dist/assertive-chai.js",
                    "src/mpulse.js",
                    "test/*.js"
                ]
            },
            console: {
                browsers: ["PhantomJS"],
                frameworks: ["mocha"]
            }
        },
        jsdoc: {
            dist: {
                options: {
                    destination: "doc",
                    readme: "README.md",
                    package: "package.json",
                    template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json",
                    plugins: [
                        "node_modules/grunt-jsdoc/node_modules/jsdoc/plugins/markdown",
                        "node_modules/grunt-jsdoc/node_modules/jsdoc/plugins/summarize"
                    ]
                },
                src: [
                    "lib/**/*.js",
                    "cli/*.js"
                ]
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: "lib"
                }
            }
        }
    });

    //
    // Plugins
    //
    grunt.loadNpmTasks("grunt-bower-task");
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("gruntify-eslint");
    grunt.loadNpmTasks("grunt-jsdoc");

    //
    // Tasks
    //
    grunt.registerTask("test", ["bower:install", "mochaTest", "karma:console"]);

    grunt.registerTask("lint", ["eslint:console"]);
    grunt.registerTask("lint:build", ["eslint:build"]);

    //
    // Task Groups
    //
    grunt.registerTask("default", ["lint"]);
    grunt.registerTask("all", ["lint:build", "test"]);
};
