var user = require('../../routes/user')
    , redis = require("redis").createClient()
;

redis.select(15);

describe("user actions", function() {

    afterEach(function() {
        redis.flushdb();
    });

    it("should register a user", function() {
        var username = 'mark'
            , password = 'zot'
        ;

        runs(function() {
            user.registerUser(redis, username, password, function(rez) {
                expect(rez.message).toEqual('Created user ' + username);
                jasmine.asyncSpecDone();
            });
        });

        jasmine.asyncSpecWait();

        runs(function() {
            redis.get('username:' + username + ':uid', function(err, u) {
                expect(u).toEqual('1');
                jasmine.asyncSpecDone();
            });
        });
        jasmine.asyncSpecWait();

        runs(function() {
            redis.get('uid:1:username', function(err, u) {
                expect(u).toEqual(username);
                jasmine.asyncSpecDone();
            });
        });
        jasmine.asyncSpecWait();

        runs(function() {
            redis.get('uid:1:password', function(err, u) {
                expect(u).toEqual(password);
                jasmine.asyncSpecDone();
            });
        });
        jasmine.asyncSpecWait();



    });
});
