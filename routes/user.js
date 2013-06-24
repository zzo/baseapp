/*
 * GET users listing.
 */
exports.setup = function(app) {
    app.all('*', function(req, res, next) {
        exports.isLoggedIn(app.get('redis'), req.session, function(uid) {
            if (uid) {
                exports.loadUser(app.get('redis'), uid, function(userObj) {
                    req.session.user = userObj;
                    next();
                });
            } else {
                next();
            }
        });
    });

    app.all('/user/logout', function(req, res, next) {
        exports.userLogout(app.get('redis'), req.session, function() {
            req.session.destroy();
            res.end('OK');
        });
    });

    app.post('/user/login', function(req, res, next) {
        exports.loginUser(app.get('redis'), req.body.email, req.body.password, function(result) {
            if (result.auth && result.uid) {
                // logged in!
                req.session.auth = result.auth;
                exports.loadUser(app.get('redis'), result.uid, function(userObj) {
                    req.session.user = userObj;
                    res.json(JSON.stringify(userObj));
                });
            } else { 
                res.json(JSON.stringify(result));
            }
        });

    });
    app.post('/user/register', function(req, res, next) {
        exports.registerUser(app.get('redis'), req.body.email, req.body.password, function(result) {
            res.json(JSON.stringify(result));
        });
    });
};

exports.uuid = require('uuid');

exports.resetAuthToken = function(redis, uid, cb) {
    var auth = exports.uuid.v4();
    redis.get('uid:' + uid + ':auth', function(err, oldAuth) {
        if (!err && oldAuth) {
            // out with the old
            redis.del('auth:' + oldAuth);
        }
        // in with the new
        redis.set('uid:' + uid + ':auth', auth);
        redis.set('auth:' + auth, uid);
        cb();
    });
};

exports.userExists = function(redis, username, cb) {
    redis.get('username:' + username + ':uid', function(err, res) {
        cb(!err && res);
    });
};

exports.registerUser = function(redis, username, password, cb) {
    // make sure this user doesn't already exist
    exports.userExists(redis, username, function(exists) {
        if (exists) {
            cb({ error: "User " + username + " already exists" });
        } else {
            redis.incr('global:nextUserId', function(err, uid) {
                redis.set('uid:' + uid + ':username', username);
                redis.set('uid:' + uid + ':password', password);
                redis.set('username:' + username + ':uid', uid);
                exports.resetAuthToken(redis, uid, function() {
                    cb({ message: 'Created user ' + username });
                });
            });
        }
    });
};

////////////////

exports.loginUser = function(redis, username, password, cb) {
    exports.userExists(redis, username, function(exists) {
        if (!exists) {
            cb({error: "User " + username + " does not exist" });
        } else {
            redis.get('username:' + username + ':uid', function(err, uid) {
                if (!err) {
                    redis.get('uid:' + uid + ':password', function(err, pass) {
                        if (!err) {
                            if (pass == password) {
                                redis.get('uid:' + uid + ':auth', function(err, auth) {
                                    cb({ auth: auth, uid: uid });
                                });
                            } else {
                                cb({ error: "Wrong password" });
                            }
                        } else {
                            cb({ error: "DB error" });
                        }
                    });
                } else {
                    cb({ error: "DB error" });
                }
            });
        }
    });
};

/////////////////////////

exports.isLoggedIn = function(redis, session, cb) {
    if (!session.auth) {
        cb();
    } else {
        redis.get('auth:' + session.auth, function(err, uid) {
            if (!err && uid) {
                redis.get('uid:' + uid + ':auth', function(err, uAuth) {
                    if (!err && uAuth == session.auth) {
                        cb(uid);
                    } else {
                        cb();
                    }
                });
            } else {
                cb();
            }
        });
    }
};

/////////////////////////

exports.userLogout = function(redis, session, cb) {
    exports.isLoggedIn(redis, session, function(uid) {
        if (!uid) {
            cb();
        } else {
            exports.resetAuthToken(redis, uid, cb);
        }
    });
};

/////////////////////////

exports.loadUser = function(redis, uid, cb) {
    redis.get('uid:' + uid + ':username', function(err, username) {
        cb({ username: username });
    });
};
 
/////////////////////////

exports.deleteUser = function(redis, username, cb) {
    redis.get('username:' + username + ':uid', function(err, uid) {
        if (uid) {
            redis.get('uid:' + uid + ':auth', function(err, authKey) {
                if (err) { return cb({ error: err }) }
                var keys = [ 'username', 'password', 'auth' ]
                    , redisKeys = keys.map(function(key) {
                        return 'uid:' + uid + ':key';
                    })
                ;
                redisKeys.push('username:' + username + ':uid');
                redisKeys.push('auth:' + authKey);
                redisKeys.forEach(function(key) {
                    redis.del(key);
                });
                cb({ message: 'ok' });
            });
        } else {
            cb({ error: 'Username ' + username + ' does not exist' });
        }
    });
};
 
