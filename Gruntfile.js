var path = require('path')
    , exec = require('child_process').exec
;

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'public/javascripts/**/*.js', 'routes/**/*.js', 'spec/**/*.js', 'app.js']
            , options: {
                globals: {
                    jQuery: true
                }
                , 'laxcomma': true
                , 'multistr': true
            }
        },
        jasmine : {
            test: {
                src : 'public/javascripts/**/*.js',
                options : {
                    specs : 'spec/client/**/*.js'
//                    , keepRunner: true
                    , vendor: [ 
                          'public/vendor/jquery-2.0.2.min.js'
                        , 'public/vendor/jasmine-jquery.js' 
                        , 'public/vendor/dust-core-1.2.3.min.js' 
                        , 'vendor/bootstrap/js/bootstrap.min.js'
                    ]
                    , junit: {
                        path: "./build/reports/jasmine/"
                        , consolidate: true
                    }
                    , template: require('grunt-template-jasmine-istanbul')
                    , templateOptions: {
                        coverage: 'public/coverage/client/coverage.json'
                        , report:   'public/coverage/client'
                    }
                }
            }
        },
        express: {
            server: {
                options: {
                    server: path.resolve('./app.js')
                    , debug: true
                    , port: 3000
                    , host: '127.0.0.1'
                    , bases: 'public'
                }
            }
        },
        dustjs: {
            compile: {
                files: {
                    "public/javascripts/templates.js": ["views/**/*.dust"]
                }
            }
        }
        , env: {
            options : {
                //Shared Options Hash
            }
            , test: {
                NODE_ENV : 'test'
                , HOST: '<%= express.server.options.host %>'
                , PORT: '<%= express.server.options.port %>'
                , BROWSER: '<%= webd.options.browser %>'
            }
            , coverage: {
                COVERAGE: true
            }
        }
        , watch: {
            // If the main app changes (don't have any specific tests for this file :( YET! )
            mainApp: {
                files: [ 'app.js' ]
                , tasks: ['jshint', 'webdriver' ]
            } 
            // If any server-side JS changes
            , serverSide: {
                files: [ 'routes/**/*.js' ]
                , tasks: ['jshint', 'jasmine_node_coverage', 'webdriver' ]
            }
            // If any server-side JS TEST changes
            , serverSideTests: {
                files: [ 'spec/server/**/*.js' ]
                , tasks: ['jshint', 'jasmine_node_coverage' ]
            }
            // If any client-side JS changes
            , clientSide: {
                files: [ 'public/javascripts/**/*.js' ]
                , tasks: ['jshint', 'jasmine', 'webdriver' ]
            }
            // If any client-side JS TEST changes
            , clientSideTests: {
                files: [ 'spec/client/**/*.js' ]
                , tasks: ['jshint', 'jasmine' ]
            }
            // If any integration/webdriver JS TEST changes
            , webDriverTests: {
                files: [ 'spec/webdriver/**/*.js' ]
                , tasks: ['jshint', 'webdriver' ]
            }
        }
        , jasmine_node_coverage: {
            options: {
                coverDir: 'public/coverage/server'
                , specDir: 'spec/server'
                , junitDir: './build/reports/jasmine_node/'
            }
        }
        , webd: {
            options: {
                tests: 'spec/webdriver/*.js'
                , junitDir: './build/reports/webdriver/'
                , coverDir: 'public/coverage/webdriver'
                , browser: grunt.option('browser') || 'phantomjs'
            }
        }
        , total_coverage: {
            options: {
                coverageDir: './build/reports'
                , outputDir: 'public/coverage/total'
            }
        }
        , plato: {
            myapp: {
              options : {
                jshint : false
              }
              , files: {
                'public/plato': ['public/javascripts/**/*.js', 'routes/**/*.js', 'spec/**/*.js', 'app.js'],
              }
            }
          },
    });

    //this replaces the need to load all grunt tasks manually
    require('matchdep').filterDev('grunt-*').forEach(function(mod) {
        // these are not grunt plugins
        if (!mod.match('grunt-template') && !mod.match('grunt-cli')) {
            grunt.loadNpmTasks(mod);
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['jshint']);

    grunt.registerTask('test', [
        'jshint', 
        'jasmine',
        'jasmine_node_coverage',
        'dustjs', 
        'webdriver_coverage',
        'total_coverage',
        'plato'
    ]); 

    grunt.registerTask('travis', [
        'jshint', 
        'jasmine',
        'jasmine_node_coverage'
    ]); 

    // webdriver tests with coverage
    grunt.registerTask('webdriver_coverage', [
        'env:test'  // use test db
        , 'env:coverage' // server sends by coverage'd JS files
        , 'express'
        , 'webd:coverage'
    ]);

    // webdriver tests without coverage
    grunt.registerTask('webdriver', [
        'env:test'  // use test db
        , 'express'
        , 'webd'
    ]);

    grunt.registerTask('jasmine_node_coverage', 'Istanbul code coverage for jasmine_node', function() {
        var done = this.async()
            , options = this.options()
        ;

        var coverCmd = 'node_modules/istanbul/lib/cli.js cover '
            .concat('--dir ')
            .concat(options.coverDir)
            .concat(' -x ' + "'**/spec/**'" + ' ./node_modules/.bin/jasmine-node')
            .concat(' -- ' )
            .concat(options.specDir)
            .concat(' --forceexit --junitreport --output ')
            .concat(options.junitDir);

        exec(coverCmd, { }, function(err, stdout, stderr) {
                grunt.log.write(stdout);
                grunt.log.write('Server-side coverage available at: ' +
                        path.join(options.coverDir, 'lcov-report', 'index.html'));
                done();
        });
    });

    grunt.registerTask('webd', 'Webdriver with optional coverage', function(coverage) {
        var done = this.async()
            , options = this.options()
        ;

        grunt.task.requires('env:test');
        grunt.task.requires('express');

        if (coverage) {
            grunt.task.requires('env:coverage');
        }

        var testCmd = './node_modules/.bin/jasmine-node '
            .concat(options.tests)
            .concat(' --forceexit --junitreport --output ')
            .concat(options.junitDir);

        exec(testCmd, { }, function(err, stdout, stderr) {
            if (err || stderr) {
                if (err) {
                    grunt.log.writeln("ERR: " + err);
                    grunt.log.writeln(stdout);
                    grunt.log.writeln(stderr);
                }
                if (stderr && stderr.match('connect ECONNREFUSED')) {
                    grunt.log.writeln("Cannot connect to the Selenium JAR - is it running?");
                    grunt.log.writeln("In another window try:");
                    grunt.log.writeln("% java -jar " + path.resolve('./node_modules/webdriverjs/bin/selenium-server-standalone-2.31.0.jar'));
                } else {
                    if (stderr) {
                        grunt.log.writeln(stderr);
                    }
                }
                grunt.fatal();
            } else {
                //grunt.log.writeln(stdout); // debug output
                if (coverage) {
                    var coverCmd = 'node_modules/istanbul/lib/cli.js report --root '
                        .concat(options.junitDir)
                        .concat(' --dir ')
                        .concat(options.coverDir);

                    exec(coverCmd, { }, function(err, stdout, stderr) {
                        grunt.log.write(stdout);
                        grunt.log.writeln('For coverage point yer browser to: ' + 
                            path.resolve(options.coverDir, 'lcov-report', 'index.html'));
                        done();
                    });
                } else {
                    done();
                }
            }
        });
    });

    // aggregate all coverage data from all tests
    grunt.registerTask('total_coverage', 'Aggregate coverage from all tests', function() {
        var done = this.async()
            , options = this.options()
        ;

        var aggCmd = 'node_modules/istanbul/lib/cli.js report --root' 
            .concat(options.coverageDir)
            .concat(' --dir ')
            .concat(options.outputDir)
        ;

        exec(aggCmd, { }, function(err, stdout, stderr) {
            grunt.log.write(stdout);
            grunt.log.writeln('Total coverage available at: ' + 
                path.join(options.outputDir, 'lcov-report', 'index.html'));

            // output cobertura for jenkins
            aggCmd += ' cobertura';
            exec(aggCmd, { }, function(err, stdout, stderr) {
                grunt.log.write(stdout);
                done();
            });
        });

    });
};
