baseapp using:
    - [grunt](http://gruntjs.com/)
    - [jshint](http://www.jshint.com/)
    - [dustjs-linkedin](http://linkedin.github.io/dustjs/)
    - [express](http://expressjs.com/)
    - [jasmine](http://pivotal.github.io/jasmine/)
    - [jasmine-node](https://github.com/mhevery/jasmine-node)
    - [webdriver](https://github.com/camme/webdriverjs)
    - [redis](http://redis.io/)
    - [authentication](http://redis.io/topics/twitter-clone)
    - [istanbul](https://github.com/gotwarlost/istanbul)
    - [plato](https://github.com/jsoverson/plato)
    - [karma](http://karma-runner.github.io/0.8/index.html)
    - [phantomjs](http://phantomjs.org/)
    - [bootstrap](http://twitter.github.io/bootstrap/)

====

All available grunt tasks:

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

A karma.conf.js file is provided for all the client-side unit-tests

====

let 'er rip!
