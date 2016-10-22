[![build status](https://secure.travis-ci.org/zzo/baseapp.png)](http://travis-ci.org/zzo/baseapp)

# NO MORE EXCUSES!

Start your [Express](http://expressjs.com/) project off right with all testing infrastructure set up for you!

Client-side unit tests?

Server-side unit tests?

Webdriver integration tests?

Code Coverage?

Automation?

Compiled Templates for client-side rendering?

Authentication?

Static Code Analysis?

Continuous Integration?

Check And Mate!  IT'S ALL SET UP FOR YOU INCLUDING THE FIRST BATCH OF CLIENT-SIDE AND SERVER-SIDE UNIT TESTS AND WEBDRIVER TESTS - NO EXCUSES!

You've seen other 'getting started' tools that set up HTML5 or CSS or JavaScript but how about all of it including testing, automation, code coverage, static code anaylsis, and authentication all set up and ready to go?

No more having to re-do all this stuff from stratch for each webapp.  Start here and you're on your way!

DIRECTIONS
==========

1. Fork or clone this repo.
2. Run ```npm install``` to grab local copies of all dependencies from npm.
3. If you don't already have it, install grunt globally ```sudo npm -g install grunt-cli```. 
4. Install [redis](http://redis.io/download).  If you install from source, be sure to copy redis-server and redis-cli to your $PATH (```make install```).
5. Start the redis server using ```redis-server```.
6. Name your module in ```package.json```.
7. To run the webdriver tests make sure selenium is started (```grunt test``` will output instructions for this)
7. Run ```grunt test``` to run the full suite of tests!

The TESTING has already been started for you - just write tests THEN code and pound it out!

==========

baseapp uses:

* [authentication-ing](http://redis.io/topics/twitter-clone)
* [bootstrap prettifying](http://twitter.github.io/bootstrap/)
* [bunyan logging](https://github.com/trentm/node-bunyan)
* [dustjs-linkedin templating](http://linkedin.github.io/dustjs/)
* [express HTTP serving](http://expressjs.com/)
* [forever process administrating](https://github.com/nodejitsu/forever)
* [github code repositorying](https://github.com/)
* [grunt task running and continuous integrating](http://gruntjs.com/)
* [istanbul code coveraging](https://github.com/gotwarlost/istanbul)
* [jasmine client-side unit testing](https://jasmine.github.io/)
* [jasmine-node server-side testing](https://github.com/mhevery/jasmine-node)
* [jshint code linting](http://www.jshint.com/)
* [karma continuous integrating](http://karma-runner.github.io/0.8/index.html)
* [phantomjs headless testing](http://phantomjs.org/)
* [plato static code analyzing](https://github.com/jsoverson/plato)
* [redis persisting](http://redis.io/)
* [travis-ci continuous integrating](https://travis-ci.org/)
* [webdriver integration testing](https://github.com/camme/webdriverjs)

=======

All available grunt tasks:
====

    - jshint - Run jshint on all files
    - dustjs - compile all templates (in views/**) and create a single template.js file
    - jasmine - Run all client-side unit tests in spec/client/** with code coverage
    - jasmine_node_coverage - Run server-side jasmine unit tests in spec/server/** with code coverage
    - webdriver_coverage - Run all jasmine webdriver tests in spec/webdriver with code coverage
    - webdriver - Run all jasmine webdriver tests in spec/webdriver WITHOUT code coverage
    - express - Start your express server (will only run during the lifetime of the grunt process)
    - total_coverage - aggragates all coverage info into one mongo report
    - plato - run plato report on entire codebase
    - watch - Watch all files and run tests accordingly
    - test - run:
        - jshint
        - jasmine
        - jasmine_node_coverage
        - webdriver_coverage
        - total_coverage
        - plato
    
All test and coverage output go to the build/ directory (JUnit XML for all tests and LCOV+HTML for all coverage info)

====

A karma.conf.js file is provided for all the client-side unit-tests if you wanna roll with karma - note 'grunt watch' does the same basic thing...

====

[Visit the Wiki For Detailed Documentation!](https://github.com/zzo/baseapp/wiki)
=======

======

let 'er rip!

=====

Todo: Add Uglify/Release grunt targets
