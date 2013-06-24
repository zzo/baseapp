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

Travis CI?

Check And Mate!  IT'S ALL SET UP FOR YOU INCLUDING THE FIRST BATCH OF CLIENT-SIDE AND SERVER-SIDE UNIT TESTS AND WEBDRIVER TESTS - NO EXCUSES!

You've seen other 'getting started' tools that set up HTML5 or CSS or JavaScript but how about all of it including testing, automation, code coverage, static code anaylsis, and authentication all set up and ready to go?

No more having to re-do all this stuff from stratch for each webapp.  Start here and you're on your way!

DIRECTIONS
==========

Clone this repo, and download and install and start redis, give your module a name in 'package.json' & run 'grunt test'!

The TESTING has already been started for you - just write tests THEN code and pound it out!

==========

baseapp uses:

* [github](https://github.com/)
* [grunt](http://gruntjs.com/)
* [jshint](http://www.jshint.com/)
* [dustjs-linkedin](http://linkedin.github.io/dustjs/)
* [express](http://expressjs.com/)
* [jasmine](http://pivotal.github.io/jasmine/)
* [jasmine-node](https://github.com/mhevery/jasmine-node)
* [webdriver](https://github.com/camme/webdriverjs)
* [redis](http://redis.io/)
* [authentication](http://redis.io/topics/twitter-clone)
* [istanbul](https://github.com/gotwarlost/istanbul)
* [plato](https://github.com/jsoverson/plato)
* [karma](http://karma-runner.github.io/0.8/index.html)
* [phantomjs](http://phantomjs.org/)
* [bootstrap](http://twitter.github.io/bootstrap/)
* [travis-ci](https://travis-ci.org/)

====

All available grunt tasks:
--------------------------

    - jshint - Run jshint on all files
    - dustjs - compile all templates (in views/**) and create a single template.js file
    - jasmine - Run all client-side unit tests in spec/client/** with code coverage
    - jasmine_node_coverage - Run server-side jasmine unit tests in spec/server/** with code coverage
    - webdriver_coverage - Run all jasmine webdriver tests in spec/webdriver with code coverage
    - webdriver - Run all jasmine webdriver tests in spec/webdriver WITHOUT code coverage (why would you wanna do that?)
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

let 'er rip!

=====


Todo: Add Uglify/Release grunt targets
