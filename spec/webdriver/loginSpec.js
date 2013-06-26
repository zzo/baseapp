var redis = require("redis").createClient()
    , http = require('http')
    , fs   = require('fs')
    , webdriverjs = require('webdriverjs')
    , assert = require('assert')
    , saveCoverage = require('./GetCoverage')
;

redis.select(15);
redis.flushdb();

describe('login tests', function() {
    var client = {};

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 9999999;

    beforeEach(function(done) {
        client = webdriverjs.remote({ desiredCapabilities: {browserName: process.env.BROWSER || 'firefox'} });
        client.init()
            .url("http://" + process.env.HOST + ':' + process.env.PORT)
            .pause(500, done);
    });

    afterEach(function(done) {
        if (process.env.COVERAGE) {
            saveCoverage.GetCoverage(client, process.env.HOST, process.env.PORT);
        }

        // just blows out all of the session & user data
        redis.flushdb();

        client.end(done);
    });

    it("check buttons visible/not", function(done) {
        client
            .isVisible('#logout', function(err, val) {
                // it should NOT be in the DOM!  So expect an error object back
                assert(err);
            })
            .isVisible('button[data-target="#loginForm"]', function(err, val) {
                assert(val);
            })
            .isVisible('button[data-target="#registerForm"]', function(err, val) {
                assert(val);
            })
            .call(done);
    });

    it("check failed login", function(done) {
        client
            .pause(1)
            .click('button[data-target="#loginForm"]')
            .pause(500)
            .isVisible('#loginForm', function(err, val) {
                assert(val);
            })
            .setValue("#emaillogin", 'this will')
            .setValue("#passwordlogin", 'fail!')
            .click('#loginSubmit')
            .pause(1000)
            .getText('#loginError', function(err, val) {
                console.log(val);
                // 'User this will does not exist',
            })
            .call(done);
        }
    );

    it("check empty login", function(done) {
        client
            .pause(1)
            .click('button[data-target="#loginForm"]')
            .pause(500)
            .isVisible('#loginForm', function(err, val) {
                assert(val);
            })
            .click('#loginSubmit')
            .pause(100)
            .getText('#loginError', function(err, val) {
                // 'Missing email or password',
                assert(val === 'Missing email or password');
            })
            .setValue("#emaillogin", 'this will')
            .click('#loginSubmit')
            .pause(100)
            .getText('#loginError', function(err, val) {
                // 'Missing email or password',
                assert(val === 'Missing email or password');
            })
            .clearElement("#emaillogin")
            .setValue("#passwordlogin", 'wew')
            .click('#loginSubmit')
            .pause(100)
            .getText('#loginError', function(err, val) {
                // 'Missing email or password',
                assert(val === 'Missing email or password');
            })
            .call(done);
        }
    );

    it("register & login user", function(done) {
        client
            .pause(1)
            .click('button[data-target="#registerForm"]')
            .pause(500)
            .isVisible('#registerForm', function(err, val) {
                assert(val);
            })
            .setValue("#emailregister", 'testdummy')
            .setValue("#passwordregister", 'testdummy')
            .click('#registerSubmit')
            .pause(500)
            .isVisible('#registerForm', function(err, val) {
                // register form no longer visible
                assert(!val);
            })
            .click('button[data-target="#loginForm"]')
            .pause(500)
            .isVisible('#loginForm', function(err, val) {
                assert(val);
            })
            .setValue("#emaillogin", 'testdummy')
            .setValue("#passwordlogin", 'testdummy')
            .click('#loginSubmit')
            .pause(200)
            .isVisible('#loginForm', function(err, val) {
                // login form gone now
                assert(err);
            })
            .isVisible('#logout', function(err, val) {
                // logout button now visible
                assert(val);
            })
            .isVisible('button[data-target="#loginForm"]', function(err, val) {
                // login button gone
                assert(err);
            })
            .isVisible('button[data-target="#registerForm"]', function(err, val) {
                // register button gone
                assert(err);
            })
            .click('#logout')
            .pause(500)
            .isVisible('#logout', function(err, val) {
                // logout button gone now
                assert(err);
            })
            .isVisible('button[data-target="#loginForm"]', function(err, val) {
                // login button back
                assert(val);
            })
            .isVisible('button[data-target="#registerForm"]', function(err, val) {
                // register button back
                assert(val);
            })
            .call(done);
        }
    );
});
